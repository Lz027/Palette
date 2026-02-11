import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFocus } from '@/contexts/FocusContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SpinningFocusWheel } from '@/components/features/SpinningFocusWheel';
import { FocusChangeOverlay } from '@/components/features/FocusChangeOverlay';
import { useFocusSound } from '@/hooks/useFocusSound';

const tips = [
  "Welcome to PALETTE! Tap the wheel to change focus modes.",
  "Create workspaces for different projects.",
  "Use the focus timer to stay productive.",
  "Favorite your most used workspaces.",
  "Check out Shoseki for AI tools!"
];

export function MobileTopBar() {
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
      
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 safe-area-pt">
        <div className="flex items-center justify-between h-14 px-3">
          {/* Left: Theme toggle only */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-muted-foreground"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            >
              {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          {/* Right: Notifications + Focus Wheel + Profile */}
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground relative">
                  <Sparkles className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Tips & Welcome
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h3 className="font-medium mb-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h3>
                    <p className="text-sm text-muted-foreground">
                      Here's how to make the most of PALETTE.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {tips.map((tip, index) => (
                      <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                          {index + 1}
                        </span>
                        <p className="text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <SpinningFocusWheel size="compact" />
            
            {user && (
              <Link to="/profile">
                <Avatar className="h-8 w-8 border-2 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
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
