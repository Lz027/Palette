import React from 'react';
import { useFocus, FocusMode } from '@/contexts/FocusContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Code, Palette, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tech tools with logos and URLs
const techTools = [
  { id: 'lovable', name: 'Lovable', logo: 'https://lovable.dev/favicon.ico', url: 'https://lovable.dev', category: 'AI Builder' },
  { id: 'replit', name: 'Replit', logo: 'https://cdn.replit.com/dotcom/favicon.ico', url: 'https://replit.com', category: 'AI Builder' },
  { id: 'cursor', name: 'Cursor', logo: 'https://www.cursor.com/favicon.ico', url: 'https://cursor.com', category: 'AI Editor' },
  { id: 'manus', name: 'Manus', logo: 'https://manus.im/favicon.svg', url: 'https://manus.im', category: 'AI Agent' },
  { id: 'kimi', name: 'Kimi', logo: 'https://kimi.ai/favicon.ico', url: 'https://kimi.ai', category: 'AI Agent' },
  { id: 'github', name: 'GitHub', logo: 'https://github.githubassets.com/favicons/favicon.svg', url: 'https://github.com', category: 'Git' },
  { id: 'supabase', name: 'Supabase', logo: 'https://supabase.com/favicon/favicon-32x32.png', url: 'https://supabase.com', category: 'Database' },
  { id: 'vercel', name: 'Vercel', logo: 'https://vercel.com/favicon.ico', url: 'https://vercel.com', category: 'Deploy' },
  { id: 'bolt', name: 'Bolt.new', logo: 'https://bolt.new/favicon.svg', url: 'https://bolt.new', category: 'AI Builder' },
  { id: 'v0', name: 'v0.dev', logo: 'https://v0.dev/icon-dark.svg', url: 'https://v0.dev', category: 'AI Builder' },
  { id: 'genspark', name: 'Genspark', logo: 'https://www.genspark.ai/favicon.ico', url: 'https://genspark.ai', category: 'AI workspace' },
];

// Design tools with logos and URLs
const designTools = [
  { id: 'figma', name: 'Figma', logo: 'https://static.figma.com/app/icon/1/favicon.png', url: 'https://figma.com', category: 'Design' },
  { id: 'canva', name: 'Canva', logo: 'https://static.canva.com/static/images/favicon-1.ico', url: 'https://canva.com', category: 'Design' },
  { id: 'leonardo', name: 'Leonardo AI', logo: 'https://leonardo.ai/favicon.ico', url: 'https://leonardo.ai', category: 'AI Image' },
  { id: 'midjourney', name: 'Midjourney', logo: 'https://www.midjourney.com/favicon.ico', url: 'https://midjourney.com', category: 'AI Image' },
  { id: 'ideogram', name: 'Ideogram', logo: 'https://ideogram.ai/favicon.ico', url: 'https://ideogram.ai', category: 'AI Image' },
  { id: 'photopea', name: 'Photopea', logo: 'https://www.photopea.com/promo/icon512.png', url: 'https://photopea.com', category: 'Editor' },
  { id: 'remove-bg', name: 'Remove.bg', logo: 'https://www.remove.bg/favicon.ico', url: 'https://remove.bg', category: 'Editor' },
  { id: 'coolors', name: 'Coolors', logo: 'https://coolors.co/assets/img/favicon.png', url: 'https://coolors.co', category: 'Colors' },
  { id: 'blender', name: 'Blender', logo: 'https://www.blender.org/favicon.ico', url: 'https://blender.org', category: '3D' },
  { id: 'procreate', name: 'Procreate', logo: 'https://procreate.com/favicon.ico', url: 'https://procreate.com', category: 'Drawing' },
];

// Productivity tools (all tools catalog)
const productivityTools = [
  { id: 'linear', name: 'Linear', logo: 'https://linear.app/favicon.ico', url: 'https://linear.app', category: 'Project' },
  { id: 'slack', name: 'Slack', logo: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png', url: 'https://slack.com', category: 'Chat' },
  { id: 'loom', name: 'Loom', logo: 'https://cdn.loom.com/assets/favicons-loom/favicon.ico', url: 'https://loom.com', category: 'Video' },
  { id: 'excalidraw', name: 'Excalidraw', logo: 'https://excalidraw.com/favicon.ico', url: 'https://excalidraw.com', category: 'Whiteboard' },
  { id: 'genspark', name: 'Genspark', logo: 'https://www.genspark.ai/favicon.ico', url: 'https://genspark.ai', category: 'AI Search' },
  { id: 'manus', name: 'Manus', logo: 'https://manus.im/favicon.svg', url: 'https://manus.im', category: 'AI Agent' },
  { id: 'kimi', name: 'Kimi', logo: 'https://kimi.ai/favicon.ico', url: 'https://kimi.ai', category: 'AI Agent' },
  { id: 'poe', name: 'Poe AI', logo: 'https://poe.com/favicon.ico', url: 'https://poe.com', category: 'AI Chat' },
  { id: 'todoist', name: 'Todoist', logo: 'https://todoist.com/favicon.ico', url: 'https://todoist.com', category: 'Tasks' },
  { id: 'airtable', name: 'Airtable', logo: 'https://airtable.com/favicon.ico', url: 'https://airtable.com', category: 'Database' },
];

const getToolsForMode = (mode: FocusMode) => {
  switch (mode) {
    case 'tech':
      return techTools;
    case 'design':
      return designTools;
    case 'productive':
      return productivityTools;
  }
};

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
  const tools = getToolsForMode(focusMode);

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
            {tools.map((tool) => (
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
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
