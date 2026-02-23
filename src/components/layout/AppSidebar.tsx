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
  Terminal,
  Zap,
  PenTool,
  Target,
  Coffee,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import paletteLogo from '@/assets/palette-logo.jpeg';
import shosekiLogo from '@/assets/shoseki-logo.png';
import { useBoards } from '@/contexts/BoardContext';
import { useFocus } from '@/contexts/FocusContext';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const focusTips = {
  productive: [
    { icon: Coffee, text: "Take breaks every 25 minutes" },
    { icon: Target, text: "Set 3 priorities for today" },
  ],
  tech: [
    { icon: Terminal, text: "Commit code before switching tasks" },
    { icon: Zap, text: "Test your changes frequently" },
  ],
  design: [
    { icon: PenTool, text: "Save versions as you iterate" },
    { icon: Palette, text: "Check contrast ratios" },
  ],
};

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
  const { settings } = useSettings();

  const favoriteBoards = boards.filter(b => b.isFavorite && b.focusMode === focusMode).slice(0, 5);
  const currentTips = focusTips[focusMode as keyof typeof focusTips] || focusTips.productive;

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
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        isOpen ? "w-64" : "w-14"
      )}
    >
      {/* Toggle Button at top - Modern style like mobile */}
      <div className={cn(
        "flex items-center justify-center p-2 border-b border-sidebar-border",
        settings.compact_mode ? "py-1.5" : "py-2"
      )}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
        >
          {isOpen ? <PanelLeft className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Logo Section - Visible when expanded */}
      <div className={cn(
        "transition-all duration-300 overflow-hidden",
        isOpen ? (settings.compact_mode ? "h-12" : "h-16") + " opacity-100" : "h-0 opacity-0"
      )}>
        <Link to="/dashboard" className={cn(
          "flex items-center gap-3 px-4",
          settings.compact_mode ? "py-2" : "py-3"
        )}>
          <img
            src={paletteLogo}
            alt="Palette"
            className="w-8 h-8 rounded-lg object-cover shrink-0"
          />
          <span className="font-bold text-lg tracking-tight">PALETTE</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className={cn(
          "space-y-1",
          isOpen ? "px-3" : "px-2",
          settings.compact_mode && "space-y-0.5"
        )}>
          {mainNavItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 rounded-lg transition-all duration-200 active:scale-95",
                isOpen
                  ? (settings.compact_mode ? "px-3 py-1 text-xs" : "px-3 py-2 text-sm")
                  : "justify-center py-2",
                "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
            >
              <item.icon className={cn("shrink-0", isOpen ? "h-5 w-5" : "h-[18px] w-[18px]")} />
              {isOpen && <span className="text-sm">{item.title}</span>}
            </NavLink>
          ))}

          {/* Create */}
          <NavLink
            to={createAction.url}
            className={cn(
              "flex items-center gap-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 mt-2 transition-all duration-200 active:scale-95",
              isOpen
                ? (settings.compact_mode ? "px-3 py-1 text-xs" : "px-3 py-2 text-sm")
                : "justify-center py-2"
            )}
          >
            <createAction.icon className={cn("shrink-0", isOpen ? "h-5 w-5" : "h-[18px] w-[18px]")} />
            {isOpen && <span className="text-sm font-medium">{createAction.label}</span>}
          </NavLink>

          {/* Favorites */}
          {isOpen && favoriteBoards.length > 0 && (
            <div className={cn(
              "animate-in fade-in slide-in-from-left-2 duration-300",
              settings.compact_mode ? "mt-3" : "mt-4"
            )}>
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Favorites</p>
              <div className="space-y-0.5">
                {favoriteBoards.map((board) => (
                  <NavLink
                    key={board.id}
                    to={`/boards/${board.id}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sm transition-colors",
                      settings.compact_mode && "py-1 text-xs"
                    )}
                    activeClassName="bg-sidebar-accent"
                  >
                    <div className={cn("w-2 h-2 rounded-full shrink-0", getBoardColorClass(board.color))} />
                    <span className="truncate">{board.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          {/* Tips (expanded only) */}
          {isOpen && (
            <div className={cn(
              "px-3 animate-in fade-in slide-in-from-left-2 duration-500",
              settings.compact_mode ? "mt-4" : "mt-6"
            )}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {focusMode.charAt(0).toUpperCase() + focusMode.slice(1)} Tips
              </p>
              <div className="space-y-2">
                {currentTips.map((tip, index) => (
                  <div key={index} className={cn(
                    "flex items-start gap-2.5 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/50",
                    settings.compact_mode ? "p-2" : "p-2.5"
                  )}>
                    <tip.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>
      </ScrollArea>

      {/* External Links - Shoseki Only */}
      <div className={cn(
        "border-t border-sidebar-border py-3 space-y-2",
        isOpen ? "px-3" : "px-2",
        settings.compact_mode && "py-2"
      )}>
        {/* Shoseki - Black bg, transparent logo */}
        <a
          href="https://shoseki.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-3 rounded-lg bg-black hover:bg-gray-900 transition-all",
            isOpen
              ? (settings.compact_mode ? "px-3 py-1 text-xs" : "px-3 py-2 text-sm")
              : "justify-center py-2"
          )}
        >
          <img
            src={shosekiLogo}
            alt="Shoseki"
            className={cn("object-contain rounded bg-white/10", isOpen ? "w-6 h-6" : "w-5 h-5")}
          />
          {isOpen && (
            <span className="text-sm font-semibold text-white">Shoseki</span>
          )}
        </a>
      </div>

      {/* Footer */}
      <div className={cn(
        "border-t border-sidebar-border py-2 px-2 space-y-1",
        !isOpen && "pb-4",
        settings.compact_mode && "py-1.5"
      )}>
        <NavLink
          to="/profile"
          className={cn(
            "flex items-center gap-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95",
            isOpen
              ? (settings.compact_mode ? "px-3 py-1 text-xs" : "px-3 py-2 text-sm")
              : "justify-center py-2"
          )}
          activeClassName="bg-primary/10 text-primary"
        >
          <User className={cn("shrink-0", isOpen ? (settings.compact_mode ? "h-4 w-4" : "h-5 w-5") : "h-[18px] w-[18px]")} />
          {isOpen && <span className="text-sm">Profile</span>}
        </NavLink>
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95",
            isOpen
              ? (settings.compact_mode ? "px-3 py-1 text-xs" : "px-3 py-2 text-sm")
              : "justify-center py-2"
          )}
          activeClassName="bg-primary/10 text-primary"
        >
          <Settings className={cn("shrink-0", isOpen ? (settings.compact_mode ? "h-4 w-4" : "h-5 w-5") : "h-[18px] w-[18px]")} />
          {isOpen && <span className="text-sm">Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}
