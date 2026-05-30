import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Home,
  LayoutDashboard, BarChart3, PieChart, FileText,
  Briefcase, Building, Coins, Package,
  CheckSquare, RefreshCw, Calendar, MapPin, CheckCircle2,
  ShieldAlert, Gavel, Scale, Shield, Receipt,
  Zap, Sliders, Smartphone, Workflow,
  Users, Settings, Cable, Database, KeyRound,
  ShieldCheck, LogOut, ChevronDown, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface SidebarSubItem {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  tab?: string;
}

interface SidebarGroup {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: SidebarSubItem[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    id: 'pilotage',
    title: 'Pilotage',
    icon: LayoutDashboard,
    items: [
      { name: 'Tableau de bord global', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Indicateurs recouvrement', icon: BarChart3, path: '/analytics', tab: 'recouvrement' },
      { name: 'Indicateurs contentieux', icon: PieChart, path: '/analytics', tab: 'contentieux' },
      { name: 'Rapports', icon: FileText, path: '/reporting' }
    ]
  },
  {
    id: 'portefeuilles',
    title: 'Portefeuilles',
    icon: Briefcase,
    items: [
      { name: 'Tous les portefeuilles', icon: Briefcase, path: '/scoring' },
      { name: 'Microfinance', icon: Building, path: '/microfinance' },
      { name: 'Affacturage / Factoring', icon: Coins, path: '/factoring' },
      { name: 'Leasing', icon: Package, path: '/leasing' }
    ]
  },
  {
    id: 'recouvrement',
    title: 'Recouvrement',
    icon: FileText,
    items: [
      { name: 'Dossiers de recouvrement', icon: FileText, path: '/dossiers' },
      { name: 'Tâches du jour', icon: CheckSquare, path: '/relances', tab: 'tasks' },
      { name: 'Relances', icon: RefreshCw, path: '/relances' },
      { name: 'Promesses de paiement', icon: Calendar, path: '/microfinance', tab: 'promises' },
      { name: 'Visites terrain', icon: MapPin, path: '/microfinance', tab: 'visites' },
      { name: 'Paiements récupérés', icon: CheckCircle2, path: '/dossiers', tab: 'payments' }
    ]
  },
  {
    id: 'contentieux',
    title: 'Contentieux',
    icon: Scale,
    items: [
      { name: 'Pré-contentieux', icon: ShieldAlert, path: '/litigation', tab: 'pre-contentieux' },
      { name: 'Dossiers contentieux', icon: Gavel, path: '/litigation' },
      { name: 'Actions juridiques', icon: Scale, path: '/litigation', tab: 'actions' },
      { name: 'Documents juridiques', icon: FileText, path: '/litigation', tab: 'documents' },
      { name: 'Garanties & cautions', icon: Shield, path: '/litigation', tab: 'garanties' },
      { name: 'Frais contentieux', icon: Receipt, path: '/litigation', tab: 'frais' }
    ]
  },
  {
    id: 'automatisation',
    title: 'Automatisation',
    icon: Zap,
    items: [
      { name: 'Moteur de relance', icon: Zap, path: '/automatisation/moteur-relance' },
      { name: 'Règles d’escalade', icon: Sliders, path: '/automatisation/regles-escalade' },
      { name: 'Modèles SMS / Email / WhatsApp', icon: Smartphone, path: '/automatisation/modeles-messages' },
      { name: 'Workflows', icon: Workflow, path: '/automatisation/workflows' }
    ]
  },
  {
    id: 'administration',
    title: 'Administration',
    icon: Settings,
    items: [
      { name: 'Utilisateurs & rôles', icon: Users, path: '/settings', tab: 'utilisateurs' },
      { name: 'Institutions / agences', icon: Building, path: '/settings', tab: 'institutions' },
      { name: 'Paramètres métier', icon: Settings, path: '/settings' },
      { name: 'Intégrations', icon: Cable, path: '/settings', tab: 'integrations' },
      { name: 'Audit logs', icon: Database, path: '/settings', tab: 'audit' },
      { name: 'Sécurité', icon: KeyRound, path: '/settings', tab: 'securite' }
    ]
  }
];

export default function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State to track expanded groups
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    pilotage: true,
    portefeuilles: true,
    recouvrement: false,
    contentieux: false,
    automatisation: false,
    administration: false,
  });

  // Expand a group automatically if one of its items is currently active
  useEffect(() => {
    sidebarGroups.forEach((group) => {
      const hasActiveItem = group.items.some((item) => {
        const isPathMatch = location.pathname === item.path;
        if (!isPathMatch) return false;
        if (item.tab) {
          return (
            location.search.toLowerCase().includes(item.tab.toLowerCase()) ||
            location.hash.toLowerCase().includes(item.tab.toLowerCase())
          );
        }
        return true;
      });

      if (hasActiveItem) {
        setExpandedGroups((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [location.pathname, location.search, location.hash]);

  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'Déconnexion', description: 'À bientôt.' });
    navigate('/', { replace: true });
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const isSubItemActive = (item: SidebarSubItem) => {
    const isPathMatch = location.pathname === item.path;
    if (!isPathMatch) return false;
    if (item.tab) {
      return (
        location.search.toLowerCase().includes(item.tab.toLowerCase()) ||
        location.hash.toLowerCase().includes(item.tab.toLowerCase())
      );
    }
    // Also if we are on the page, but no search param is set, highlight the default item
    const otherTabsOnSamePage = sidebarGroups
      .flatMap((g) => g.items)
      .filter((i) => i.path === item.path && i.tab);
    
    const hasAnyTabActive = otherTabsOnSamePage.some((i) => 
      location.search.toLowerCase().includes(i.tab?.toLowerCase() || '') ||
      location.hash.toLowerCase().includes(i.tab?.toLowerCase() || '')
    );

    return !hasAnyTabActive;
  };

  const isGroupActive = (group: SidebarGroup) => {
    return group.items.some((item) => isSubItemActive(item));
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

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {/* Accueil Link */}
        <div className="space-y-1">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all group",
              location.pathname === '/' 
                ? "bg-sky text-white shadow-lg shadow-sky/20" 
                : "text-white/65 hover:text-white hover:bg-white/5"
            )}
          >
            <Home size={16} className={cn("transition-colors", location.pathname === '/' ? "text-white" : "group-hover:text-sky")} />
            Accueil
          </Link>
        </div>

        {/* Collapsible Menu Groups */}
        {sidebarGroups.map((group) => {
          const GroupIcon = group.icon;
          const isExpanded = expandedGroups[group.id];
          const isActive = isGroupActive(group);
          
          return (
            <div key={group.id} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2 rounded-xl text-xs font-bold transition-all group/btn",
                  isActive 
                    ? "text-sky bg-sky/5 font-extrabold border-l-2 border-sky rounded-l-none" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <GroupIcon size={16} className={cn("transition-colors", isActive ? "text-sky" : "group-hover/btn:text-sky")} />
                  <span>{group.title}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform text-white/45 group-hover/btn:text-white",
                    isExpanded ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>

              {isExpanded && (
                <div className="pl-4 ml-2 border-l border-white/5 space-y-1 mt-1 transition-all duration-300">
                  {group.items.map((item, itemIdx) => {
                    const ItemIcon = item.icon;
                    const active = isSubItemActive(item);
                    
                    return (
                      <Link
                        key={itemIdx}
                        to={item.tab ? `${item.path}?tab=${item.tab}` : item.path}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all duration-200",
                          active
                            ? "bg-white/10 text-white font-bold"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <ItemIcon size={13} className={cn("shrink-0", active ? "text-sky" : "text-white/40")} />
                        <span className="truncate">{item.name}</span>
                        {active && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
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
