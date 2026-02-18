import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Star,
  Settings,
  User,
  Code,
  Palette,
  Briefcase,
  Plus,
  PanelLeft,
  PanelRight,
  Lightbulb,
  Zap,
  Target,
  Coffee,
  PenTool,
  Terminal,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import paletteLogo from '@/assets/palette-logo.jpeg';
import shosekiLogo from '@/assets/shoseki-logo.png';
import { useBoards } from '@/contexts/BoardContext';
import { useFocus } from '@/contexts/FocusContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Workspaces', url: '/boards', icon: FolderKanban },
  { title: 'Favorites', url: '/favorites', icon: Star },
];

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

const focusCreate = {
  productive: { icon: Briefcase, label: 'New Workspace' },
  tech: { icon: Code, label: 'New Project' },
  design: { icon: Palette, label: 'New Design' },
};

export function MobileSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { boards } = useBoards();
  const { focusMode } = useFocus();
  const location = useLocation();

  useEffect(() => {
    setIsExpanded(false);
  }, [location.pathname]);

  const favoriteBoards = boards.filter(b => b.isFavorite).slice(0, 5);
  const currentTips = focusTips[focusMode] || focusTips.productive;
  const createConfig = focusCreate[focusMode] || focusCreate.productive;
  const CreateIcon = createConfig.icon;

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
    <>
      {/* Animated Sidebar Container */}
      <aside 
        className={cn(
          "fixed left-0 top-14 bottom-0 bg-background border-r border-border flex flex-col z-30 md:hidden transition-all duration-300 ease-in-out",
          isExpanded ? "w-64" : "w-14"
        )}
      >
        {/* Toggle Button at Top */}
        <div className="flex items-center justify-center p-2 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {isExpanded ? <PanelLeft className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Logo (expanded only) */}
        <div className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "h-16 opacity-100" : "h-0 opacity-0"
        )}>
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3">
            <img src={paletteLogo} alt="PALETTE" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-lg tracking-tight">PALETTE</span>
          </Link>
        </div>

        {/* Main Nav Icons */}
        <div className="flex-1 py-2 space-y-1 px-2">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 rounded-lg transition-all duration-200 active:scale-95",
                isExpanded ? "px-3 py-2" : "justify-center py-2",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                "active:scale-95"
              )}
              activeClassName="bg-primary/10 text-primary"
            >
              <item.icon className={cn("shrink-0", isExpanded ? "h-5 w-5" : "h-[18px] w-[18px]")} />
              <span className={cn(
                "text-sm whitespace-nowrap transition-all duration-300",
                isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
              )}>
                {item.title}
              </span>
            </NavLink>
          ))}

          {/* Create Button */}
          <NavLink
            to="/boards/new"
            className={cn(
              "flex items-center gap-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 transition-all mt-2",
              isExpanded ? "px-3 py-2" : "justify-center py-2"
            )}
          >
            <Plus className={cn("shrink-0", isExpanded ? "h-5 w-5" : "h-[18px] w-[18px]")} />
            <span className={cn(
              "text-sm font-medium whitespace-nowrap transition-all duration-300",
              isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
            )}>
              {createConfig.label}
            </span>
          </NavLink>

          {/* Favorites (expanded only) */}
          <div className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "mt-4 opacity-100" : "h-0 opacity-0"
          )}>
            {favoriteBoards.length > 0 && (
              <>
                <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Favorites
                </p>
                <div className="space-y-0.5 px-1">
                  {favoriteBoards.map((board) => (
                    <NavLink
                      key={board.id}
                      to={`/boards/${board.id}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors"
                      activeClassName="bg-muted text-foreground"
                    >
                      <div className={cn("w-2 h-2 rounded-full shrink-0", getBoardColorClass(board.color))} />
                      <span className="text-sm truncate">{board.name}</span>
                    </NavLink>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Tips (expanded only) */}
          <div className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "mt-4 opacity-100" : "h-0 opacity-0"
          )}>
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {focusMode.charAt(0).toUpperCase() + focusMode.slice(1)} Tips
            </p>
            <div className="space-y-2 px-1">
              {currentTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                  <tip.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Shoseki, Profile and Settings */}
        <div className="border-t border-border py-2 px-2 space-y-1">

          {/* Shoseki - ALWAYS black background for both themes */}
          <a
            href="https://shoseki.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-3 rounded-lg bg-black hover:bg-gray-900 transition-all",
              isExpanded ? "px-3 py-2" : "justify-center py-2"
            )}
          >
            <img src={shosekiLogo} alt="Shoseki" className={cn("object-contain rounded bg-white/10", isExpanded ? "w-6 h-6" : "w-5 h-5")} />
            <span className={cn(
              "text-sm font-semibold text-white whitespace-nowrap transition-all duration-300",
              isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
            )}>
              Shoseki
            </span>
          </a>

          {/* Profile - FIXED: Added responsive sizing for mobile */}
          <NavLink
            to="/profile"
            className={cn(
              "flex items-center gap-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors",
              isExpanded ? "px-3 py-2" : "justify-center py-2"
            )}
            activeClassName="bg-primary/10 text-primary"
          >
            <User className={cn("shrink-0", isExpanded ? "h-5 w-5" : "h-[18px] w-[18px]")} />
            <span className={cn(
              "text-sm whitespace-nowrap transition-all duration-300",
              isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
            )}>
              Profile
            </span>
          </NavLink>

          {/* Settings */}
          <NavLink
            to="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors",
              isExpanded ? "px-3 py-2" : "justify-center py-2"
            )}
            activeClassName="bg-primary/10 text-primary"
          >
            <Settings className={cn("shrink-0", isExpanded ? "h-5 w-5" : "h-[18px] w-[18px]")} />
            <span className={cn(
              "text-sm whitespace-nowrap transition-all duration-300",
              isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
            )}>
              Settings
            </span>
          </NavLink>
        </div>
      </aside>

      {/* Overlay when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}
