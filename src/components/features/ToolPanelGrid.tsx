import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Code, ImageIcon, StickyNote, Wrench, ChevronDown, X } from 'lucide-react';
import { useFocus, FocusMode } from '@/contexts/FocusContext';
import { CodeSnippets } from '@/components/features/CodeSnippets';
import { NoteTaker } from '@/components/features/NoteTaker';
import { ImageEditor } from '@/components/features/ImageEditor';

// Tool data
const techTools = [
  { id: 'lovable', name: 'Lovable', logo: 'https://lovable.dev/favicon.ico', url: 'https://lovable.dev' },
  { id: 'replit', name: 'Replit', logo: 'https://cdn.replit.com/dotcom/favicon.ico', url: 'https://replit.com' },
  { id: 'cursor', name: 'Cursor', logo: 'https://www.cursor.com/favicon.ico', url: 'https://cursor.com' },
  { id: 'manus', name: 'Manus', logo: 'https://manus.im/favicon.svg', url: 'https://manus.im' },
  { id: 'github', name: 'GitHub', logo: 'https://github.githubassets.com/favicons/favicon.svg', url: 'https://github.com' },
  { id: 'supabase', name: 'Supabase', logo: 'https://supabase.com/favicon/favicon-32x32.png', url: 'https://supabase.com' },
];

const designTools = [
  { id: 'figma', name: 'Figma', logo: 'https://static.figma.com/app/icon/1/favicon.png', url: 'https://figma.com' },
  { id: 'canva', name: 'Canva', logo: 'https://static.canva.com/static/images/favicon-1.ico', url: 'https://canva.com' },
  { id: 'leonardo', name: 'Leonardo', logo: 'https://leonardo.ai/favicon.ico', url: 'https://leonardo.ai' },
  { id: 'midjourney', name: 'Midjourney', logo: 'https://www.midjourney.com/favicon.ico', url: 'https://midjourney.com' },
  { id: 'photopea', name: 'Photopea', logo: 'https://www.photopea.com/promo/icon512.png', url: 'https://photopea.com' },
  { id: 'coolors', name: 'Coolors', logo: 'https://coolors.co/assets/img/favicon.png', url: 'https://coolors.co' },
];

const productivityTools = [
  { id: 'linear', name: 'Linear', logo: 'https://linear.app/favicon.ico', url: 'https://linear.app' },
  { id: 'slack', name: 'Slack', logo: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png', url: 'https://slack.com' },
  { id: 'genspark', name: 'Genspark', logo: 'https://www.genspark.ai/favicon.ico', url: 'https://genspark.ai' },
  { id: 'excalidraw', name: 'Excalidraw', logo: 'https://excalidraw.com/favicon.ico', url: 'https://excalidraw.com' },
  { id: 'todoist', name: 'Todoist', logo: 'https://todoist.com/favicon.ico', url: 'https://todoist.com' },
  { id: 'poe', name: 'Poe AI', logo: 'https://poe.com/favicon.ico', url: 'https://poe.com' },
];

const getToolsForMode = (mode: FocusMode) => {
  switch (mode) {
    case 'tech': return techTools;
    case 'design': return designTools;
    case 'productive': return productivityTools;
  }
};

const getSpecialToolInfo = (mode: FocusMode) => {
  switch (mode) {
    case 'tech': return { title: 'Snippets', icon: <Code className="h-5 w-5" /> };
    case 'design': return { title: 'Editor', icon: <ImageIcon className="h-5 w-5" /> };
    case 'productive': return { title: 'Notes', icon: <StickyNote className="h-5 w-5" /> };
  }
};

type OpenPanel = 'tools' | 'special' | null;

export function ToolPanelGrid() {
  const { focusMode, colors } = useFocus();
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  
  const tools = getToolsForMode(focusMode);
  const specialTool = getSpecialToolInfo(focusMode);

  const togglePanel = (panel: OpenPanel) => {
    setOpenPanel(current => current === panel ? null : panel);
  };

  const renderSpecialTool = () => {
    switch (focusMode) {
      case 'tech': return <CodeSnippets />;
      case 'design': return <ImageEditor />;
      case 'productive': return <NoteTaker />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Grid of 2 square panels */}
      <div className="grid grid-cols-2 gap-3">
        {/* Focus Tools Panel */}
        <button
          onClick={() => togglePanel('tools')}
          className={cn(
            "aspect-square rounded-xl border border-border bg-card p-3 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 touch-manipulation shadow-sm",
            openPanel === 'tools' && "ring-2 ring-primary bg-primary/5"
          )}
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wrench className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs font-medium text-center">{colors.name} Tools</span>
        </button>

        {/* Special Tool Panel */}
        <button
          onClick={() => togglePanel('special')}
          className={cn(
            "aspect-square rounded-xl border border-border bg-card p-3 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 touch-manipulation shadow-sm",
            openPanel === 'special' && "ring-2 ring-primary bg-primary/5"
          )}
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {specialTool.icon}
          </div>
          <span className="text-xs font-medium text-center">{specialTool.title}</span>
        </button>
      </div>

      {/* Expanded Panel Content */}
      {openPanel && (
        <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {openPanel === 'tools' ? <Wrench className="h-4 w-4" /> : specialTool.icon}
              </div>
              <span className="text-sm font-medium">
                {openPanel === 'tools' ? `${colors.name} Tools` : specialTool.title}
              </span>
            </div>
            <button
              onClick={() => setOpenPanel(null)}
              className="p-1.5 rounded-lg hover:bg-muted active:scale-95 transition-all touch-manipulation"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3">
            {openPanel === 'tools' ? (
              <div className="grid grid-cols-3 gap-2">
                {tools.map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-muted/50 hover:bg-muted active:scale-95 transition-all touch-manipulation"
                  >
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-8 h-8 rounded-lg object-contain"
                      onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                    />
                    <span className="text-[11px] text-center font-medium truncate w-full">{tool.name}</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="-m-3">
                {renderSpecialTool()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
