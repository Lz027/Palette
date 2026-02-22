import React, { useState } from 'react';
import { useFocus, FocusMode } from '@/contexts/FocusContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Code, Palette, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tech tools with fallback colors
const techTools = [
  { id: 'lovable', name: 'Lovable', logo: 'https://lovable.dev/favicon.ico', url: 'https://lovable.dev', category: 'AI Builder', color: '#FF6B6B' },
  { id: 'replit', name: 'Replit', logo: 'https://cdn.replit.com/dotcom/favicon.ico', url: 'https://replit.com', category: 'AI Builder', color: '#F26207' },
  { id: 'cursor', name: 'Cursor', logo: 'https://www.cursor.com/favicon.ico', url: 'https://cursor.com', category: 'AI Editor', color: '#000000' },
  { id: 'manus', name: 'Manus', logo: 'https://manus.im/favicon.svg', url: 'https://manus.im', category: 'AI Agent', color: '#4F46E5' },
  { id: 'kimi', name: 'Kimi', logo: 'https://kimi.ai/favicon.ico', url: 'https://kimi.ai', category: 'AI Agent', color: '#10B981' },
  { id: 'github', name: 'GitHub', logo: 'https://github.githubassets.com/favicons/favicon.svg', url: 'https://github.com', category: 'Git', color: '#181717' },
  { id: 'supabase', name: 'Supabase', logo: 'https://supabase.com/favicon/favicon-32x32.png', url: 'https://supabase.com', category: 'Database', color: '#3ECF8E' },
  { id: 'vercel', name: 'Vercel', logo: 'https://vercel.com/favicon.ico', url: 'https://vercel.com', category: 'Deploy', color: '#000000' },
  { id: 'bolt', name: 'Bolt.new', logo: 'https://bolt.new/favicon.svg', url: 'https://bolt.new', category: 'AI Builder', color: '#FF6B00' },
  { id: 'v0', name: 'v0.dev', logo: 'https://v0.dev/icon-dark.svg', url: 'https://v0.dev', category: 'AI Builder', color: '#000000' },
  { id: 'genspark', name: 'Genspark', logo: 'https://www.genspark.ai/favicon.ico', url: 'https://genspark.ai', category: 'AI Search', color: '#F59E0B' },
];

// Design tools with fallback colors
const designTools = [
  { id: 'figma', name: 'Figma', logo: 'https://static.figma.com/app/icon/1/favicon.png', url: 'https://figma.com', category: 'Design', color: '#F24E1E' },
  { id: 'canva', name: 'Canva', logo: 'https://static.canva.com/static/images/favicon-1.ico', url: 'https://canva.com', category: 'Design', color: '#00C4CC' },
  { id: 'leonardo', name: 'Leonardo AI', logo: 'https://leonardo.ai/favicon.ico', url: 'https://leonardo.ai', category: 'AI Image', color: '#7C3AED' },
  { id: 'midjourney', name: 'Midjourney', logo: 'https://www.midjourney.com/favicon.ico', url: 'https://midjourney.com', category: 'AI Image', color: '#000000' },
  { id: 'ideogram', name: 'Ideogram', logo: 'https://ideogram.ai/favicon.ico', url: 'https://ideogram.ai', category: 'AI Image', color: '#EC4899' },
  { id: 'photopea', name: 'Photopea', logo: 'https://www.photopea.com/promo/icon512.png', url: 'https://photopea.com', category: 'Editor', color: '#18A497' },
  { id: 'remove-bg', name: 'Remove.bg', logo: 'https://www.remove.bg/favicon.ico', url: 'https://remove.bg', category: 'Editor', color: '#FF6B6B' },
  { id: 'coolors', name: 'Coolors', logo: 'https://coolors.co/assets/img/favicon.png', url: 'https://coolors.co', category: 'Colors', color: '#0066FF' },
  { id: 'blender', name: 'Blender', logo: 'https://www.blender.org/favicon.ico', url: 'https://blender.org', category: '3D', color: '#E87D0D' },
  { id: 'procreate', name: 'Procreate', logo: 'https://procreate.com/favicon.ico', url: 'https://procreate.com', category: 'Drawing', color: '#000000' },
];

// Productivity tools
const productivityTools = [
  { id: 'linear', name: 'Linear', logo: 'https://linear.app/favicon.ico', url: 'https://linear.app', category: 'Project', color: '#5E6AD2' },
  { id: 'slack', name: 'Slack', logo: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png', url: 'https://slack.com', category: 'Chat', color: '#4A154B' },
  { id: 'loom', name: 'Loom', logo: 'https://cdn.loom.com/assets/favicons-loom/favicon.ico', url: 'https://loom.com', category: 'Video', color: '#625DF5' },
  { id: 'excalidraw', name: 'Excalidraw', logo: 'https://excalidraw.com/favicon.ico', url: 'https://excalidraw.com', category: 'Whiteboard', color: '#6965DB' },
  { id: 'genspark', name: 'Genspark', logo: 'https://www.genspark.ai/favicon.ico', url: 'https://genspark.ai', category: 'AI Search', color: '#F59E0B' },
  { id: 'manus', name: 'Manus', logo: 'https://manus.im/favicon.svg', url: 'https://manus.im', category: 'AI Agent', color: '#4F46E5' },
  { id: 'kimi', name: 'Kimi', logo: 'https://kimi.ai/favicon.ico', url: 'https://kimi.ai', category: 'AI Agent', color: '#10B981' },
  { id: 'poe', name: 'Poe AI', logo: 'https://poe.com/favicon.ico', url: 'https://poe.com', category: 'AI Chat', color: '#8B5CF6' },
  { id: 'todoist', name: 'Todoist', logo: 'https://todoist.com/favicon.ico', url: 'https://todoist.com', category: 'Tasks', color: '#E44332' },
  { id: 'airtable', name: 'Airtable', logo: 'https://airtable.com/favicon.ico', url: 'https://airtable.com', category: 'Database', color: '#18BFFF' },
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

interface ToolLogoProps {
  src: string;
  alt: string;
  color: string;
}

function ToolLogo({ src, alt, color }: ToolLogoProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div 
        className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm"
        style={{ backgroundColor: color }}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-8 h-8 rounded-md object-contain bg-white/50 p-0.5"
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

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
      <CardContent className={cn("p-3", compact && "p-2")}>
        <ScrollArea className={cn("h-auto", compact ? "max-h-48" : "max-h-64")}>
          <div className={cn(
            "grid gap-2",
            compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
          )}>
            {tools.map((tool) => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg",
                  "bg-muted/50 hover:bg-muted transition-colors",
                  "group cursor-pointer"
                )}
              >
                <div className="relative">
                  <ToolLogo src={tool.logo} alt={tool.name} color={tool.color} />
                  <ExternalLink className="absolute -top-1 -right-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                </div>
                <span className="text-[10px] text-center font-medium truncate w-full">{tool.name}</span>
                <span className="text-[8px] text-muted-foreground">{tool.category}</span>
              </a>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
