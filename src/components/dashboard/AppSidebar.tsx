import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Settings, LogOut, ShieldCheck,
  PieChart, BarChart3, Home, Gavel, Target, Zap, Scale, Package, Coins,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const navItems = [
  { name: 'Accueil', icon: Home, path: '/' },
  { name: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Dossiers Recouvrement', icon: FileText, path: '/dossiers' },
  { name: 'Moteur de Relance', icon: Zap, path: '/relances' },
  { name: 'Module Contentieux', icon: Scale, path: '/litigation' },
  { name: 'Leasing', icon: Package, path: '/leasing' },
  { name: 'Affacturage & Factoring', icon: Coins, path: '/factoring' },
  { name: 'Veille Réglementaire', icon: ShieldCheck, path: '/regulatory' },
  { name: 'Scoring & Segmentation', icon: Target, path: '/scoring' },
  { name: 'Reporting', icon: PieChart, path: '/reporting' },
  { name: 'Analyses', icon: BarChart3, path: '/analytics' },
  { name: 'Paramètres', icon: Settings, path: '/settings' },
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
      <div className="p-6">
        <Link to="/" className="text-2xl font-extrabold tracking-tighter font-syne hover:opacity-80 transition-opacity">
          <span className="text-sky">Recov</span>TN
        </Link>
        <div className="mt-2 flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
          <ShieldCheck size={14} className="text-gold" />
          <span className="text-[10px] uppercase font-black tracking-widest text-white/60">Admin</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
              isActive 
                ? "bg-sky text-white shadow-lg shadow-sky/20" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-4 bg-white/5 rounded-2xl mb-4">
          <div className="w-10 h-10 rounded-full bg-sky/20 flex items-center justify-center text-sky font-bold">{initial}</div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold truncate">{displayName}</span>
            <span className="text-[10px] text-white/40 truncate">{user?.email}</span>
          </div>
        </div>

        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
