import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Code, Palette, Target, Sparkles, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFocus } from '@/contexts/FocusContext';
import { FocusMode } from '@/types';

interface FocusWheelProps {
  className?: string;
  compact?: boolean;
}

const focusModes: { id: FocusMode; label: string; icon: React.ReactNode; color: string; bgColor: string; description: string }[] = [
  { id: 'tech', label: 'Tech', icon: <Code className="w-3 h-3" />, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-500', description: 'Dev Tools & Code' },
  { id: 'productive', label: 'Focus', icon: <Target className="w-3 h-3" />, color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-500', description: 'Productivity' },
  { id: 'design', label: 'Design', icon: <Palette className="w-3 h-3" />, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-500', description: 'Design Tools' },
];

export function FocusWheel({ className, compact = false }: FocusWheelProps) {
  const { focusMode, setFocusMode } = useFocus();
  const [rotation, setRotation] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [burstActive, setBurstActive] = useState(false);

  const currentIndex = focusModes.findIndex(m => m.id === focusMode);
  const currentMode = focusModes.find(m => m.id === focusMode) || focusModes[0];

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('focus_wheel_onboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    setBurstActive(true);
    const timer = setTimeout(() => setBurstActive(false), 600);
    return () => clearTimeout(timer);
  }, [focusMode]);

  const closeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('focus_wheel_onboarding', 'true');
  };

  const handleRotate = () => {
    const nextIndex = (currentIndex + 1) % focusModes.length;
    setRotation(prev => prev + 120);
    setFocusMode(focusModes[nextIndex].id);
    if (showOnboarding) closeOnboarding();
  };

  const wheelSize = compact ? 'w-9 h-9' : 'w-20 h-20';
  const armLength = compact ? 10 : 28;
  const circleSize = compact ? 'w-3.5 h-3.5' : 'w-7 h-7';
  const circlePx = compact ? 7 : 14;

  return (
    <div className="relative">
      {/* Onboarding Notice */}
      {showOnboarding && !compact && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 z-50 animate-in fade-in zoom-in duration-300">
          <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-medium shadow-xl relative">
            <Sparkles className="w-3.5 h-3.5 absolute -top-1.5 -left-1.5 text-warning fill-warning" />
            Click to shift focus!
            <button onClick={closeOnboarding} className="absolute top-1 right-1 hover:bg-black/10 rounded">
              <X className="w-3 h-3" />
            </button>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
          </div>
        </div>
      )}

      {/* Color Burst Effect */}
      {burstActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className={cn(
            "w-full h-full rounded-full opacity-0 animate-color-burst",
            currentMode.bgColor
          )} />
        </div>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("relative flex items-center z-10", className)}>
              {/* Center hub */}
              <button
                onClick={handleRotate}
                className={cn(
                  "relative rounded-full bg-gradient-to-br from-muted to-muted/50 border border-border shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group",
                  wheelSize,
                  showOnboarding && "animate-slow-pulse"
                )}
                aria-label="Rotate focus wheel"
              >
                {/* Rotating wheel with 3 arms */}
                <div
                  className="absolute inset-1 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {/* Arms connecting to circles */}
                  {focusModes.map((mode, index) => {
                    const angle = (index * 120 - 90) * (Math.PI / 180);
                    const endX = Math.cos(angle) * armLength;
                    const endY = Math.sin(angle) * armLength;

                    return (
                      <div key={mode.id}>
                        {/* Arm line */}
                        <div
                          className="absolute top-1/2 left-1/2 h-0.5 bg-border origin-left"
                          style={{
                            width: `${armLength}px`,
                            transform: `rotate(${index * 120 - 90}deg) translateY(-50%)`,
                          }}
                        />
                        {/* End circle */}
                        <div
                          className={cn(
                            "absolute rounded-full flex items-center justify-center shadow-sm transition-all duration-300",
                            circleSize,
                            mode.bgColor,
                            focusMode === mode.id ? "ring-2 ring-foreground/30 ring-offset-1 ring-offset-background scale-110" : "opacity-40 scale-90"
                          )}
                          style={{
                            left: `calc(50% + ${endX}px - ${circlePx}px)`,
                            top: `calc(50% + ${endY}px - ${circlePx}px)`,
                          }}
                        >
                          <span
                            className="text-primary-foreground"
                            style={{ transform: `rotate(${-rotation}deg)` }}
                          >
                            {mode.icon}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={compact ? 5 : 10} side="bottom" className="text-xs">
            <p className="font-medium">{currentMode?.label} Mode</p>
            <p className="text-muted-foreground">{currentMode?.description}</p>
            <p className="text-muted-foreground mt-1 text-[10px] uppercase tracking-wider font-bold opacity-70">Click to rotate</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
