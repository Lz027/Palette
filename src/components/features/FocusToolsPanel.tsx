import React, { useState } from 'react';
import { useFocus, FocusMode } from '@/contexts/FocusContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Code, Palette, Briefcase, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tech tools — Added Antigravity
const techTools = [
  { id: 'lovable', name: 'Lovable', logo: 'https://lovable.dev/favicon.ico', url: 'https://lovable.dev', category: 'AI Builder', color: '#FF6B6B' },
  { id: 'replit', name: 'Replit', logo: 'https://cdn.replit.com/dotcom/favicon.ico', url: 'https://replit.com', category: 'AI Builder', color: '#F26207' },
  { id: 'cursor', name: 'Cursor', logo: 'https://www.cursor.com/favicon.ico', url: 'https://cursor.com', category: 'AI Editor', color: '#000000' },
  { id: 'antigravity', name: 'Antigravity', logo: '', url: 'https://antigravity.co', category: 'AI Code', color: '#6366F1' },
  { id: 'manus', name: 'Manus', logo: 'https://manus.im/favicon.svg', url: 'https://manus.im', category: 'AI Agent', color: '#4F46E5' },
  { id: 'kimi', name: 'Kimi', logo: 'https://kimi.ai/favicon.ico', url: 'https://kimi.ai', category: 'AI Agent', color: '#10B981' },
  { id: 'github', name: 'GitHub', logo: 'https://github.githubassets.com/favicons/favicon.svg', url: 'https://github.com', category: 'Git', color: '#181717' },
  { id: 'supabase', name: 'Supabase', logo: 'https://supabase.com/favicon/favicon-32x32.png', url: 'https://supabase.com', category: 'Database', color: '#3ECF8E' },
  { id: 'vercel', name: 'Vercel', logo: 'https://vercel.com/favicon.ico', url: 'https://vercel.com', category: 'Deploy', color: '#000000' },
  { id: 'bolt', name: 'Bolt.new', logo: 'https://bolt.new/favicon.svg', url: 'https://bolt.new', category: 'AI Builder', color: '#FF6B00' },
  { id: 'v0', name: 'v0.dev', logo: 'https://v0.dev/icon-dark.svg', url: 'https://v0.dev', category: 'AI Builder', color: '#000000' },
  { id: 'genspark', name: 'Genspark', logo: 'https://www.genspark.ai/favicon.ico', url: 'https://genspark.ai', category: 'AI Search', color: '#F59E0B' },
];

// Design tools — Added 2 more (Spline, Framer)
const designTools = [
  { id: 'figma', name: 'Figma', logo: 'https://static.figma.com/app/icon/1/favicon.png', url: 'https://figma.com', category: 'Design', color: '#F24E1E' },
  { id: 'framer', name: 'Framer', logo: 'https://framer.com/favicon.ico', url: 'https://framer.com', category: 'Site Builder', color: '#0055FF' },
  { id: 'spline', name: 'Spline', logo: 'https://spline.design/favicon.ico', url: 'https://spline.design', category: '3D Design', color: '#FF6B6B' },
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

// Productivity tools — Added 2 more (Notion, Raycast)
const productivityTools = [
  { id: 'linear', name: 'Linear', logo: 'https://linear.app/favicon.ico', url: 'https://linear.app', category: 'Project', color: '#5E6AD2' },
  { id: 'notion', name: 'Notion', logo: 'https://www.notion.so/images/favicon.ico', url: 'https://notion.so', category: 'Notes', color: '#000000' },
  { id: 'raycast', name: 'Raycast', logo: 'https://raycast.com/favicon.ico', url: 'https://raycast.com', category: 'Launcher', color: '#FF6363' },
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

const getModeGradient = (mode: FocusMode) => {
  switch (mode) {
    case 'tech':
      return 'from-blue-500/20 via-cyan-500/20 to-teal-500/20';
    case 'design':
      return 'from-pink-500/20 via-purple-500/20 to-indigo-500/20';
    case 'productive':
      return 'from-orange-500/20 via-amber-500/20 to-yellow-500/20';
  }
};

interface ToolLogoProps {
  src: string;
  alt: string;
  color: string;
}

function ToolLogo({ src, alt, color }: ToolLogoProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white/20"
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
      className="w-8 h-8 rounded-lg object-contain bg-white/60 p-1 shadow-sm ring-2 ring-white/20 transition-transform duration-300"
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
    <Card className={cn(
      "overflow-hidden transition-all duration-500",
      "bg-gradient-to-br",
      getModeGradient(focusMode),
      "border-0 shadow-lg",
      className
    )}>
      <CardHeader className={cn("pb-2 relative overflow-hidden", compact && "p-3")}>
        {/* Animated color burst background */}
        <div className="absolute inset-0 opacity-30">
          <div className={cn(
            "absolute inset-0 animate-pulse",
            "bg-gradient-to-r from-transparent via-white/20 to-transparent",
            "animate-[shimmer_2s_infinite]"
          )} />
        </div>
        
        <CardTitle className="flex items-center gap-2 text-sm font-medium relative z-10">
          <span className={cn(
            "p-1.5 rounded-md bg-white/20 backdrop-blur-sm",
            "animate-in zoom-in duration-300"
          )}>
            {getModeIcon(focusMode)}
          </span>
          <span className="animate-in fade-in slide-in-from-left-2 duration-300">
            {getModeTitle(focusMode)}
          </span>
          <Sparkles className="h-3 w-3 ml-auto text-white/60 animate-pulse" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className={cn("p-3 relative", compact && "p-2")}>
        {/* Color burst wave effect */}
        <div className="absolute inset-0 overflow-hidden rounded-b-lg pointer-events-none">
          <div className={cn(
            "absolute -inset-full",
            "bg-gradient-to-r from-transparent via-white/10 to-transparent",
            "animate-[wave_3s_ease-in-out_infinite]",
            "rotate-12"
          )} />
        </div>

        <ScrollArea className={cn("h-auto relative z-10", compact ? "max-h-48" : "max-h-64")}>
          <div className={cn(
            "grid gap-2",
            compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
          )}>
            {tools.map((tool, index) => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2.5 rounded-xl",
                  "bg-white/40 backdrop-blur-sm hover:bg-white/60",
                  "transition-all duration-300 ease-out",
                  "hover:scale-105 hover:shadow-lg hover:-translate-y-1",
                  "active:scale-95",
                  "group cursor-pointer",
                  "animate-in fade-in zoom-in duration-300 fill-mode-forwards"
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="relative transition-transform duration-300 group-hover:rotate-6">
                  <ToolLogo src={tool.logo} alt={tool.name} color={tool.color} />
                  <ExternalLink className="absolute -top-1 -right-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 text-foreground/60 bg-white/80 rounded-full p-0.5" />
                </div>
                <span className="text-[10px] text-center font-semibold truncate w-full text-foreground/90">{tool.name}</span>
                <span className="text-[8px] text-foreground/60 font-medium">{tool.category}</span>
              </a>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
