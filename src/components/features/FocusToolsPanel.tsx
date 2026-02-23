import React from 'react';
import { useFocus, FocusMode } from '@/contexts/FocusContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Code, Palette, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFocusTools } from '@/hooks/useFocusTools';
import { Skeleton } from '@/components/ui/skeleton';

const getModeIcon = (mode: FocusMode) => {
  switch (mode) {
    case 'tech':
      return <Code className="h-4 w-4" />;
    case 'design':
      return <Palette className="h-4 w-4" />;
    case 'productive':
      return <Briefcase className="h-4 w-4" />;
  }
};

const getModeTitle = (mode: FocusMode) => {
  switch (mode) {
    case 'tech':
      return 'Dev Tools';
    case 'design':
      return 'Design Tools';
    case 'productive':
      return 'Productivity Tools';
  }
};

interface FocusToolsPanelProps {
  className?: string;
  compact?: boolean;
}

export function FocusToolsPanel({ className, compact = false }: FocusToolsPanelProps) {
  const { focusMode } = useFocus();
  const { tools, loading } = useFocusTools();

  return (
    <Card className={cn("glass-card overflow-hidden", className)}>
      <CardHeader className={cn("pb-2", compact && "p-3")}>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {getModeIcon(focusMode)}
          {getModeTitle(focusMode)}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("p-1.5 sm:p-3", compact && "p-2")}>
        <ScrollArea className={cn("w-full h-auto", compact ? "max-h-48" : "max-h-80")}>
          <div className={cn(
            "flex sm:grid gap-2 p-1",
            "overflow-x-auto sm:overflow-x-visible pb-3 sm:pb-0",
            "snap-x snap-mandatory sm:snap-none",
            compact
              ? "grid-cols-3"
              : "sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          )}>
            {loading ? (
              // Loading Skeleton
              Array.from({ length: compact ? 3 : 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl shrink-0 w-[100px] sm:w-auto">
                  <Skeleton className="w-10 h-10 sm:w-8 sm:h-8 rounded-md" />
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-2 w-8" />
                </div>
              ))
            ) : (
              tools.map((tool) => (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl shrink-0 w-[100px] sm:w-auto",
                    "bg-muted/30 hover:bg-muted/60 transition-all duration-300",
                    "border border-border/50 hover:border-primary/30",
                    "group cursor-pointer snap-center shadow-sm hover:shadow-md",
                    "active:scale-95"
                  )}
                >
                  <div className="relative p-1 bg-background rounded-lg shadow-inner ring-1 ring-border/5 group-hover:ring-primary/20 transition-all">
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-10 h-10 sm:w-8 sm:h-8 rounded-md object-contain transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=random&color=fff&size=64`;
                      }}
                    />
                    <div className="absolute -top-1 -right-1 p-0.5 rounded-full bg-primary text-white scale-0 group-hover:scale-100 transition-transform duration-300 shadow-sm">
                      <ExternalLink className="h-2.5 w-2.5" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-0 w-full overflow-hidden">
                    <span className="text-[11px] sm:text-[10px] text-center font-semibold truncate w-full transition-colors group-hover:text-primary">
                      {tool.name}
                    </span>
                    <span className="text-[9px] sm:text-[8px] text-muted-foreground font-medium uppercase tracking-tighter opacity-80">
                      {tool.category}
                    </span>
                  </div>
                </a>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

