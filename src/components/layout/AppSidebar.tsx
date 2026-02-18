import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Star, 
  Settings, 
  User,
  ChevronLeft,
  ChevronRight,
  Code,
  Palette,
  Briefcase,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import paletteLogo from '@/assets/palette-logo.jpeg';
import shosekiLogo from '@/assets/shoseki-logo.png';
import { useBoards } from '@/contexts/BoardContext';
import { useFocus } from '@/contexts/FocusContext';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebar } from '@/components/ui/sidebar';

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Boards', url: '/boards', icon: FolderKanban },
  { title: 'Favorites', url: '/favorites', icon: Star },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isOpen = state === 'expanded';
  const { boards } = useBoards();
  const { focusMode } = useFocus();

  const favoriteBoards = boards.filter(b => b.isFavorite).slice(0, 5);

  const getCreateAction = () => {
    switch (focusMode) {
      case 'tech':
        return { icon: Code, label: 'New Project', url: '/boards/new' };
      case 'design':
        return { icon: Palette, label: 'New Design', url: '/boards/new' };
      default:
        return { icon: Briefcase, label: 'New Board', url: '/boards/new' };
    }
  };

  const createAction = getCreateAction();

  const getBoardColorClass = (color: string) => {
    const colors: Record<string, string> = {
      coral: 'bg-board-coral',
      lavender: 'bg-board-lavender',
      mint: 'bg-board-mint',
      sky: 'bg-board-sky',
      peach: 'bg-board-peach',
      rose: 'bg-board-rose',
    };
    return colors[color] || 'bg-primary';
  };

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col relative transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Toggle Button - Now uses proper sidebar context */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 z-[100] w-6 h-6 rounded-full border border-border bg-background shadow-md flex items-center justify-center hover:bg-muted transition-all cursor-pointer"
        type="button"
      >
        {isOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>

      {/* Header */}
      <div className={cn("p-4 border-b border-sidebar-border flex items-center justify-center", !isOpen && "p-3")}>
        <Link to="/dashboard" className="flex items-center">
          <img 
            src={paletteLogo} 
            alt="Palette" 
            className={cn("rounded-lg object-cover", isOpen ? "w-12 h-12" : "w-10 h-10")}
          />
          {isOpen && <span className="ml-3 font-bold text-xl">PALETTE</span>}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className={cn("space-y-1", isOpen ? "px-3" : "px-2")}>
          {mainNavItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 rounded-lg transition-colors",
                isOpen ? "px-3 py-2.5" : "justify-center py-2.5",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {isOpen && <span className="text-sm">{item.title}</span>}
            </NavLink>
          ))}

          {/* Create */}
          <NavLink
            to={createAction.url}
            className={cn(
              "flex items-center gap-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 mt-2",
              isOpen ? "px-3 py-2.5" : "justify-center py-2.5"
            )}
          >
            <createAction.icon className="h-5 w-5 shrink-0" />
            {isOpen && <span className="text-sm">{createAction.label}</span>}
          </NavLink>

          {/* Favorites */}
          {isOpen && favoriteBoards.length > 0 && (
            <div className="mt-4">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase mb-2">Favorites</p>
              {favoriteBoards.map((board) => (
                <NavLink
                  key={board.id}
                  to={`/boards/${board.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sm"
                  activeClassName="bg-sidebar-accent"
                >
                  <div className={cn("w-2 h-2 rounded-full", getBoardColorClass(board.color))} />
                  <span className="truncate">{board.name}</span>
                </NavLink>
              ))}
            </div>
          )}
        </nav>
      </ScrollArea>

      {/* External Links - Shoseki Only */}
      <div className={cn("border-t border-sidebar-border py-3 space-y-2", isOpen ? "px-3" : "px-2")}>

        {/* Shoseki - Black bg, transparent logo */}
        <a
          href="https://shoseki.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-3 rounded-xl bg-black hover:bg-gray-900 transition-all",
            isOpen ? "px-4 py-3" : "justify-center py-3"
          )}
        >
          <img 
            src={shosekiLogo} 
            alt="Shoseki" 
            className={cn("object-contain", isOpen ? "w-8 h-8" : "w-6 h-6")}
            style={{ backgroundColor: 'transparent' }}
          />
          {isOpen && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Shoseki</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide">AI Directory</span>
            </div>
          )}
        </a>
      </div>

      {/* Footer */}
      <div className={cn("border-t border-sidebar-border py-3", isOpen ? "px-3" : "px-2")}>
        <NavLink
          to="/profile"
          className={cn(
            "flex items-center gap-3 rounded-lg hover:bg-sidebar-accent",
            isOpen ? "px-3 py-2" : "justify-center py-2"
          )}
          activeClassName="bg-sidebar-accent"
        >
          <User className="h-5 w-5 shrink-0" />
          {isOpen && <span className="text-sm">Profile</span>}
        </NavLink>
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg hover:bg-sidebar-accent mt-1",
            isOpen ? "px-3 py-2" : "justify-center py-2"
          )}
          activeClassName="bg-sidebar-accent"
        >
          <Settings className="h-5 w-5 shrink-0" />
          {isOpen && <span className="text-sm">Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}
