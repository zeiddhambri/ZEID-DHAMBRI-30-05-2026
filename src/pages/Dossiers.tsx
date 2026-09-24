import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MoreVertical, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { statusConfig, DossierComplet } from '@/lib/mock-data';
import { api } from '@/services/api';
import { classificationConfig } from '@/lib/scoring';
import { calculerScore } from '@/lib/scoring';
import { useAuth } from '@/contexts/AuthContext';
import NouveauDossierModal from '@/components/dossiers/NouveauDossierModal';

const allStatuses = ['all', 'a_relancer', 'en_relance', 'promesse_paiement', 'partiellement_paye', 'paye', 'contentieux'] as const;

function dbRowToDossier(r: any): DossierComplet {
  const scoring = { montant: Number(r.amount), ancienneteJours: 30, tauxPaiementHistorique: 50, tauxReactivite: 50, typologieClient: 'pme' as const };
  return {
    id: r.id,
    clientCode: r.client_code,
    debtorName: r.debtor_name,
    amount: Number(r.amount),
    status: r.status,
    managementLevel: r.management_level || 'recouvreur',
    agent: r.assigned_to || 'Non assigné',
    date: (r.due_date || r.created_at || '').slice(0, 10),
    scoring,
    scoringResult: calculerScore(scoring),
    typologieClient: 'pme',
  };
}

export default function Dossiers() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dbDossiers, setDbDossiers] = useState<DossierComplet[]>([]);
  const [scope, setScope] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    if (!user) return;
    try {
      // Voie de données unique (lot P0) : backend RecovAI authentifié, plus de
      // fusion silencieuse avec des listes mock non identifiées.
      const res: any = await api.dossiers.getAll();
      setDbDossiers(((res?.data) || []).map(dbRowToDossier));
      setScope(res?.scope?.institution ?? null);
    } catch {
      setDbDossiers([]);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const all = dbDossiers;
  const filtered = all.filter(d => {
    const matchesSearch = d.debtorName.toLowerCase().includes(searchQuery.toLowerCase()) || d.clientCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight font-syne">Gestion Des Dossiers Recouvrement</h1>
          <p className="text-muted-foreground mt-1">Gérez vos dossiers de recouvrement et suivez les actions en cours.</p>
          <span className={cn(
            "inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-[11px] font-bold border",
            scope ? "bg-sky/10 text-sky border-sky/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
          )}>
            <Building2 size={12} />
            {scope ? `Périmètre cloisonné : ${scope}` : 'Périmètre : tous portefeuilles (compte transverse)'}
          </span>
        </div>
        <div className="flex gap-2"><button onClick={() => navigate('/nouveaux-dossiers')} className="flex items-center gap-2 px-5 py-2.5 border border-sky text-sky rounded-xl text-sm font-bold hover:bg-sky/5 transition-all">✨ Nouveaux dossiers</button><button onClick={() => setOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-sky text-white rounded-xl text-sm font-bold hover:bg-sky/90 transition-all shadow-lg shadow-sky/20">
          <Plus size={18} />
          Nouveau dossier
        </button>
      </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Rechercher un dossier..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-sky/20 focus:border-sky transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {allStatuses.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                statusFilter === s ? "bg-navy text-white" : "bg-card border border-border text-muted-foreground hover:bg-mist")}>
              {s === 'all' ? 'Tous' : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                <th className="text-left p-4">Code</th>
                <th className="text-left p-4">Débiteur</th>
                <th className="text-left p-4">Montant</th>
                <th className="text-left p-4">Agent</th>
                <th className="text-left p-4">Statut</th>
                <th className="text-left p-4">Score</th>
                <th className="text-left p-4">Classification</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => {
                const cls = classificationConfig[d.scoringResult.classification];
                return (
                  <motion.tr key={d.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.5) }}
                    className="border-b border-border hover:bg-mist transition-colors">
                    <td className="p-4 text-sm font-mono text-muted-foreground">{d.clientCode}</td>
                    <td className="p-4 font-bold text-sm text-navy">{d.debtorName}</td>
                    <td className="p-4 text-sm font-mono">{d.amount.toLocaleString()} TND</td>
                    <td className="p-4 text-xs text-muted-foreground">{d.agent}</td>
                    <td className="p-4">
                      <span className={cn("text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap", statusConfig[d.status].color)}>
                        {statusConfig[d.status].label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-black"
                          style={{ borderColor: d.scoringResult.score >= 70 ? 'hsl(0,84%,60%)' : d.scoringResult.score >= 40 ? 'hsl(40,58%,55%)' : 'hsl(142,76%,36%)' }}>
                          {d.scoringResult.score}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn("text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap", cls.bgClass, cls.colorClass)}>
                        {cls.label}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{d.date}</td>
                    <td className="p-4">
                      <button className="p-2 hover:bg-mist rounded-lg transition-colors">
                        <MoreVertical size={16} className="text-muted-foreground" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <NouveauDossierModal open={open} onClose={() => setOpen(false)} onCreated={load} />
    </div>
  );
}
