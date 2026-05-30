import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Settings, LogOut, ShieldCheck,
  PieChart, BarChart3, Home, Gavel, Target, Zap, Scale, Package, Coins,
  Building,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const sidebarGroups = [
  {
    title: 'Général',
    items: [
      { name: 'Accueil', icon: Home, path: '/' },
    ]
  },
  {
    title: 'Banking',
    items: [
      { name: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Dossiers Recouvrement', icon: FileText, path: '/dossiers' },
      { name: 'Moteur de Relance', icon: Zap, path: '/relances' },
      { name: 'Prise de Décision', icon: Target, path: '/relances/decision-credit' },
      { name: 'Module Contentieux', icon: Scale, path: '/litigation' },
    ]
  },
  {
    title: 'Alternatif & Inclusif',
    items: [
      { name: 'Microfinance', icon: Building, path: '/microfinance' },
      { name: 'Leasing', icon: Package, path: '/leasing' },
      { name: 'Affacturage & Factoring', icon: Coins, path: '/factoring' },
    ]
  },
  {
    title: 'Réglementation & Pilotage',
    items: [
      { name: 'Veille Réglementaire', icon: ShieldCheck, path: '/regulatory' },
      { name: 'Scoring & Segmentation', icon: Target, path: '/scoring' },
      { name: 'Reporting', icon: PieChart, path: '/reporting' },
      { name: 'Analyses', icon: BarChart3, path: '/analytics' },
    ]
  },
  {
    title: 'Système',
    items: [
      { name: 'Paramètres', icon: Settings, path: '/settings' },
    ]
  }
];

export default function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'Déconnexion', description: 'À bientôt.' });
    navigate('/', { replace: true });
  };

  const displayName = (user?.user_metadata as { full_name?: string } | undefined)?.full_name || user?.email || 'Utilisateur';
  const initial = (displayName[0] || 'U').toUpperCase();

  return (
    <aside className="w-64 h-screen bg-navy text-white flex flex-col border-r border-white/5 fixed left-0 top-0 z-50">
      <div className="p-6 shrink-0">
        <Link to="/" className="text-2xl font-extrabold tracking-tighter font-syne hover:opacity-80 transition-opacity">
          <span className="text-sky">Recov</span>TN
        </Link>
        <div className="mt-2 flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
          <ShieldCheck size={14} className="text-gold" />
          <span className="text-[10px] uppercase font-black tracking-widest text-white/60">Admin Portal</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {sidebarGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-white/30 px-4">
              {group.title}
            </span>
            <nav className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                    isActive 
                      ? "bg-sky text-white shadow-lg shadow-sky/20" 
                      : "text-white/65 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon size={16} className={cn("transition-colors", "group-hover:text-sky")} />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 shrink-0">
        <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-2xl mb-3">
          <div className="w-8 h-8 rounded-full bg-sky/20 flex items-center justify-center text-sky font-bold text-xs shrink-0">{initial}</div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold truncate">{displayName}</span>
            <span className="text-[9px] text-white/40 truncate">{user?.email}</span>
          </div>
        </div>

        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-red-450 hover:bg-red-400/10 transition-all cursor-pointer">
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
