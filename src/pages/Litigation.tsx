import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gavel, Scale, Clock, TrendingUp, Search, Filter, Plus, ChevronRight,
  FileText, Users, Calendar, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  litigationCases, STAGE_CONFIG, TYPE_LABELS, KANBAN_STAGES,
  totalAmount, totalRecovered, type CaseStage, type CaseType,
} from '@/lib/litigation-mock';
import NouveauDossierContentieuxModal from '@/components/litigation/NouveauDossierContentieuxModal';

const fmtTND = (n: number) => `${(n / 1000).toFixed(0)}k TND`;
const fmtFull = (n: number) => `${n.toLocaleString('fr-FR')} TND`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' });
const daysSince = (d: string) => Math.round((Date.now() - new Date(d).getTime()) / 86_400_000);

export default function Litigation() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<CaseStage | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CaseType | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // ─── Stats ───
  const stats = useMemo(() => {
    const total = litigationCases.length;
    const byType = litigationCases.reduce<Record<string, number>>((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {});
    const totalSum = litigationCases.reduce((s, c) => s + totalAmount(c), 0);
    const avgDuration = Math.round(
      litigationCases.reduce((s, c) => s + daysSince(c.filingDate), 0) / total,
    );
    const closedRecovered = litigationCases.filter(c => c.stage === 'closed_recovered').length;
    const recoveryRate = (closedRecovered / total) * 100;
    return { total, byType, totalSum, avgDuration, recoveryRate };
  }, []);

  const filtered = useMemo(() => {
    return litigationCases.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        c.id.toLowerCase().includes(q) ||
        c.debtor.name.toLowerCase().includes(q) ||
        c.lawyer.name.toLowerCase().includes(q);
      const matchStage = stageFilter === 'all' || c.stage === stageFilter;
      const matchType = typeFilter === 'all' || c.type === typeFilter;
      return matchSearch && matchStage && matchType;
    });
  }, [search, stageFilter, typeFilter]);

  const kanbanByStage = useMemo(() => {
    return KANBAN_STAGES.reduce<Record<CaseStage, typeof litigationCases>>((acc, s) => {
      acc[s] = litigationCases.filter(c => c.stage === s);
      return acc;
    }, {} as any);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-serif-display text-[hsl(var(--charcoal))] tracking-tight">Gestion du contentieux</h1>
          <p className="text-muted-foreground text-sm mt-1">Pilotage des procédures judiciaires de recouvrement.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[hsl(var(--crimson))] text-white text-sm font-bold shadow-sm hover:shadow-md transition">
          <Plus size={16} /> Nouveau dossier
        </button>
      </div>
      <NouveauDossierContentieuxModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ─── Stats row ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Gavel} label="Total dossiers" value={stats.total.toString()}
          subtitle={Object.entries(stats.byType).map(([t, n]) => `${TYPE_LABELS[t as CaseType]} : ${n}`).join(' · ')}
        />
        <StatCard
          icon={Scale} label="Encours contentieux" value={fmtTND(stats.totalSum)}
          subtitle={fmtFull(stats.totalSum)}
        />
        <StatCard
          icon={Clock} label="Durée moyenne" value={`${stats.avgDuration} j`}
          subtitle="depuis ouverture"
        />
        <StatCard
          icon={TrendingUp} label="Taux recouvrement" value={`${stats.recoveryRate.toFixed(1)}%`}
          subtitle="dossiers clos · recouvrés"
          accent
        />
      </div>

      {/* ─── Kanban pipeline ─── */}
      <section className="bg-card rounded-2xl p-6 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-serif-display text-[hsl(var(--charcoal))]">Pipeline contentieux</h2>
            <p className="text-xs text-muted-foreground mt-1">Suivi visuel par étape de la procédure.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {KANBAN_STAGES.map((stage, i) => {
            const cfg = STAGE_CONFIG[stage];
            const cases = kanbanByStage[stage];
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-secondary/30 p-3 min-h-[180px]"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md", cfg.bg, cfg.color)}>
                    {cfg.label}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">{cases.length}</span>
                </div>
                <div className="space-y-2">
                  {cases.length === 0 && <p className="text-[11px] text-muted-foreground text-center py-4">Aucun</p>}
                  {cases.map(c => (
                    <Link
                      key={c.id}
                      to={`/litigation/${c.id}`}
                      className="block bg-card rounded-lg p-2.5 border border-border hover:border-[hsl(var(--charcoal))] hover:shadow-sm transition group"
                    >
                      <p className="text-[10px] font-bold text-muted-foreground">{c.id}</p>
                      <p className="text-xs font-semibold text-[hsl(var(--charcoal))] truncate mt-0.5">{c.debtor.name}</p>
                      <p className="text-[11px] font-bold text-[hsl(var(--crimson))] mt-1">{fmtTND(totalAmount(c))}</p>
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── Filters ─── */}
      <section className="bg-card rounded-2xl border border-border shadow-sm">
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Numéro, débiteur, avocat…"
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--crimson))]/20"
            />
          </div>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-secondary text-sm border-0 focus:outline-none cursor-pointer"
          >
            <option value="all">Toutes étapes</option>
            {KANBAN_STAGES.concat(['closed_written_off']).map(s => (
              <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-secondary text-sm border-0 focus:outline-none cursor-pointer"
          >
            <option value="all">Tous types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} dossier(s)</span>
        </div>

        {/* ─── Cases table ─── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="text-left py-3 px-4">N° Dossier</th>
                <th className="text-left px-2">Débiteur</th>
                <th className="text-left px-2">Type</th>
                <th className="text-right px-2">Montant</th>
                <th className="text-left px-2">Étape</th>
                <th className="text-left px-2">Dépôt</th>
                <th className="text-left px-2">Avocat / Huissier</th>
                <th className="text-left px-2">Audience</th>
                <th className="text-right px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const cfg = STAGE_CONFIG[c.stage];
                const nextHearing = c.hearings
                  .filter(h => h.status === 'scheduled' && new Date(h.date) >= new Date())
                  .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0];
                return (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition">
                    <td className="py-3 px-4">
                      <Link to={`/litigation/${c.id}`} className="text-[hsl(var(--crimson))] font-bold hover:underline">{c.id}</Link>
                    </td>
                    <td className="px-2 font-semibold text-[hsl(var(--charcoal))]">{c.debtor.name}</td>
                    <td className="px-2 text-muted-foreground text-xs">{TYPE_LABELS[c.type]}</td>
                    <td className="px-2 text-right font-bold tabular-nums">{fmtTND(totalAmount(c))}</td>
                    <td className="px-2">
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md whitespace-nowrap", cfg.bg, cfg.color)}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-2 text-muted-foreground text-xs whitespace-nowrap">{fmtDate(c.filingDate)}</td>
                    <td className="px-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Users size={11} className="text-muted-foreground" />
                        {c.lawyer.name.replace('Maître ', 'M.')}
                      </div>
                    </td>
                    <td className="px-2 text-xs whitespace-nowrap">
                      {nextHearing ? (
                        <span className="flex items-center gap-1 text-[hsl(var(--charcoal))] font-semibold">
                          <Calendar size={11} /> {fmtDate(nextHearing.date)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 text-right">
                      <Link to={`/litigation/${c.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-[hsl(var(--charcoal))] hover:text-[hsl(var(--crimson))] transition">
                        Ouvrir <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground text-sm">
                    <AlertCircle size={20} className="mx-auto mb-2 opacity-50" />
                    Aucun dossier ne correspond à ces critères.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────
function StatCard({ icon: Icon, label, value, subtitle, accent }: {
  icon: any;
  label: string; value: string; subtitle?: string; accent?: boolean;
}) {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className={cn("text-3xl font-serif-display mt-2", accent ? "text-[hsl(var(--crimson))]" : "text-[hsl(var(--charcoal))]")}>{value}</p>
        </div>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", accent ? "bg-[hsl(var(--crimson))]/10 text-[hsl(var(--crimson))]" : "bg-secondary text-[hsl(var(--charcoal))]")}>
          <Icon size={18} />
        </div>
      </div>
      {subtitle && <p className="text-[11px] text-muted-foreground mt-2 truncate">{subtitle}</p>}
    </div>
  );
}
