import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Star, 
  Settings, 
  User,
  PanelLeft,
  PanelRight,
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
import { Button } from '@/components/ui/button';

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Boards', url: '/boards', icon: FolderKanban },
  { title: 'Favorites', url: '/favorites', icon: Star },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isOpen = state === 'expanded';
  const { boards, focusMode } = useBoards();
  const { focusMode: currentFocus } = useFocus();

  // Filter boards by focus mode
  const filteredBoards = boards.filter(b => {
    if (currentFocus === 'design') return b.color === 'lavender' || b.color === 'rose' || b.template === 'design';
    if (currentFocus === 'tech') return b.color === 'sky' || b.color === 'mint' || b.template === 'kanban';
    return true; // productive shows all
  }).slice(0, 5);

  const getCreateAction = () => {
    switch (currentFocus) {
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
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Toggle Button — Moved inside */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={cn(
          "absolute top-4 h-7 w-7 rounded-md border border-sidebar-border bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background hover:scale-105 transition-all duration-300 z-50",
          isOpen ? "right-3" : "right-3"
        )}
      >
        {isOpen ? <PanelLeft className="h-3.5 w-3.5" /> : <PanelRight className="h-3.5 w-3.5" />}
      </Button>

      {/* Header */}
      <div className={cn(
        "border-b border-sidebar-border flex items-center gap-3 transition-all duration-500",
        isOpen ? "p-4" : "p-3 justify-center"
      )}>
        <Link to="/dashboard" className={cn(
          "flex items-center shrink-0 transition-transform duration-300 hover:scale-105",
          !isOpen && "justify-center"
        )}>
          <img 
            src={paletteLogo} 
            alt="Palette" 
            className={cn(
              "rounded-lg object-cover transition-all duration-500",
              isOpen ? "w-10 h-10" : "w-10 h-10"
            )}
          />
        </Link>
        
        {isOpen && (
          <span className="font-bold text-lg animate-in fade-in slide-in-from-left-2 duration-500">
            PALETTE
          </span>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className={cn("space-y-1", isOpen ? "px-3" : "px-2")}>
          {mainNavItems.map((item, index) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 rounded-lg transition-all duration-300 ease-out",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1",
                "active:scale-95",
                isOpen ? "px-3 py-2.5" : "justify-center py-2.5",
                "opacity-0 animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-forwards"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium shadow-sm"
            >
              <item.icon className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:rotate-12" />
              {isOpen && (
                <span className="text-sm animate-in fade-in duration-300">
                  {item.title}
                </span>
              )}
            </NavLink>
          ))}

          {/* Create */}
          <NavLink
            to={createAction.url}
            className={cn(
              "flex items-center gap-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 mt-2 transition-all duration-300",
              "hover:shadow-md hover:translate-x-1 active:scale-95",
              isOpen ? "px-3 py-2.5" : "justify-center py-2.5"
            )}
          >
            <createAction.icon className="h-5 w-5 shrink-0" />
            {isOpen && <span className="text-sm">{createAction.label}</span>}
          </NavLink>

          {/* Filtered Favorites by Focus Mode */}
          {isOpen && filteredBoards.length > 0 && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase mb-2 tracking-wider">
                {currentFocus === 'tech' ? 'Dev Projects' : currentFocus === 'design' ? 'Design Boards' : 'Recent Boards'}
              </p>
              <div className="space-y-0.5">
                {filteredBoards.map((board, index) => (
                  <NavLink
                    key={board.id}
                    to={`/boards/${board.id}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sm transition-all duration-300",
                      "hover:translate-x-1 active:scale-95 opacity-0 animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-forwards"
                    )}
                    style={{ animationDelay: `${(index + 3) * 50}ms` }}
                    activeClassName="bg-sidebar-accent shadow-sm"
                  >
                    <div className={cn("w-2 h-2 rounded-full animate-pulse", getBoardColorClass(board.color))} />
                    <span className="truncate">{board.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </nav>
      </ScrollArea>

      {/* External Links */}
      <div className={cn("border-t border-sidebar-border py-3 space-y-2", isOpen ? "px-3" : "px-2")}>
        <a
          href="https://shoseki.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-3 rounded-xl bg-black hover:bg-gray-900 transition-all duration-300",
            "hover:shadow-lg hover:-translate-y-0.5",
            isOpen ? "px-4 py-3" : "justify-center py-3"
          )}
        >
          <img 
            src={shosekiLogo} 
            alt="Shoseki" 
            className={cn("object-contain transition-transform duration-300", isOpen ? "w-8 h-8" : "w-6 h-6")}
            style={{ backgroundColor: 'transparent' }}
          />
          {isOpen && (
            <div className="flex flex-col animate-in fade-in duration-300">
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
            "flex items-center gap-3 rounded-lg hover:bg-sidebar-accent transition-all duration-300",
            "hover:translate-x-1 active:scale-95",
            isOpen ? "px-3 py-2" : "justify-center py-2"
          )}
          activeClassName="bg-sidebar-accent shadow-sm"
        >
          <User className="h-5 w-5 shrink-0" />
          {isOpen && <span className="text-sm">Profile</span>}
        </NavLink>
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg hover:bg-sidebar-accent mt-1 transition-all duration-300",
            "hover:translate-x-1 active:scale-95",
            isOpen ? "px-3 py-2" : "justify-center py-2"
          )}
          activeClassName="bg-sidebar-accent shadow-sm"
        >
          <Settings className="h-5 w-5 shrink-0" />
          {isOpen && <span className="text-sm">Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}
