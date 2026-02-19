import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFocus } from '@/contexts/FocusContext';
import { FocusChangeOverlay } from '@/components/features/FocusChangeOverlay';
import { useFocusSound } from '@/hooks/useFocusSound';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FocusWheel } from '@/components/features/FocusWheel';
import { NotificationBell } from '@/components/features/NotificationBell';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user } = useAuth();
  const { pendingModeChange, confirmModeChange } = useFocus();
  const { playFocusSound } = useFocusSound();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleModeChangeComplete = () => {
    confirmModeChange();
  };

  React.useEffect(() => {
    if (pendingModeChange) {
      playFocusSound(pendingModeChange);
    }
  }, [pendingModeChange, playFocusSound]);

  return (
    <>
      <FocusChangeOverlay 
        targetMode={pendingModeChange} 
        onComplete={handleModeChangeComplete} 
      />
      
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-lg">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            {/* SidebarTrigger REMOVED - now only in AppSidebar */}
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <FocusWheel compact />
            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground h-9 w-9">
                  {resolvedTheme === 'dark' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user && (
              <Link to="/profile">
                <Avatar className="h-8 w-8 border-2 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
