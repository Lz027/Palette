import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Code, ImageIcon, StickyNote, Wrench, ChevronDown, X } from 'lucide-react';
import { useFocus, FocusMode } from '@/contexts/FocusContext';
import { CodeSnippets } from '@/components/features/CodeSnippets';
import { NoteTaker } from '@/components/features/NoteTaker';
import { ImageEditor } from '@/components/features/ImageEditor';
import { useFocusTools } from '@/hooks/useFocusTools';
import { Skeleton } from '@/components/ui/skeleton';

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

  const { tools, loading } = useFocusTools();
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
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/20 animate-pulse">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <Skeleton className="h-2 w-10" />
                    </div>
                  ))
                ) : (
                  tools.map((tool) => (
                    <a
                      key={tool.id}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 active:scale-95 transition-all touch-manipulation border border-border/40"
                    >
                      <div className="relative p-1 bg-background rounded-lg shadow-sm">
                        <img
                          src={tool.logo}
                          alt={tool.name}
                          className="w-8 h-8 rounded-md object-contain"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=random&color=fff&size=64`;
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-center font-semibold truncate w-full">{tool.name}</span>
                    </a>
                  ))
                )}
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

