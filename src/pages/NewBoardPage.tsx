import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Layout, Zap, Grid3X3, Compass, Calendar, Lightbulb, Check, ArrowRight } from 'lucide-react';
import { useBoards } from '@/contexts/BoardContext';
import { BOARD_TEMPLATES, BOARD_COLORS } from '@/lib/board-templates';
import type { BoardTemplate, BoardColor } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const templateIcons: Record<string, React.ElementType> = {
  canvas: Layout,
  sprint: Zap,
  mosaic: Grid3X3,
  compass: Compass,
  rhythm: Calendar,
  spark: Lightbulb,
};

export default function NewBoardPage() {
  const navigate = useNavigate();
  const { createBoard } = useBoards();
  
  const [step, setStep] = useState<'template' | 'customize'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<BoardTemplate>('canvas');
  const [selectedColor, setSelectedColor] = useState<BoardColor>('coral');
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');

  const handleTemplateSelect = (template: BoardTemplate) => {
    setSelectedTemplate(template);
    const templateConfig = BOARD_TEMPLATES.find(t => t.id === template);
    if (templateConfig) {
      setBoardName(`My ${templateConfig.name}`);
    }
    setStep('customize');
  };

  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!boardName.trim() || isCreating) return;
    setIsCreating(true);
    try {
      const newBoard = await createBoard(boardName.trim(), selectedTemplate, selectedColor, boardDescription);
      if (newBoard) {
        navigate(`/boards/${newBoard.id}`);
      } else {
        navigate('/boards');
      }
    } catch (error) {
      console.error('Error creating board:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Create New Board
        </h1>
        <p className="text-muted-foreground">
          {step === 'template' 
            ? 'Choose a template to get started' 
            : 'Customize your board'}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
          step === 'template' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-sm font-medium">
            1
          </span>
          <span className="text-sm font-medium hidden sm:inline">Template</span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
          step === 'customize' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-sm font-medium">
            2
          </span>
          <span className="text-sm font-medium hidden sm:inline">Customize</span>
        </div>
      </div>

      {/* Template Selection */}
      {step === 'template' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BOARD_TEMPLATES.map(template => {
            const Icon = templateIcons[template.id] || Layout;
            return (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={cn(
                  "text-left p-5 rounded-xl border-2 transition-all duration-200",
                  "hover:border-primary hover:shadow-lg hover:scale-[1.02]",
                  selectedTemplate === template.id 
                    ? "border-primary bg-primary/5" 
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-lg mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {template.features.slice(0, 2).map(feature => (
                        <span 
                          key={feature}
                          className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Customize Step */}
      {step === 'customize' && (
        <div className="space-y-8">
          {/* Board Name & Description */}
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Board Name</label>
                <Input
                  placeholder="Enter board name"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="text-lg"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description (optional)</label>
                <Textarea
                  placeholder="What's this board about?"
                  value={boardDescription}
                  onChange={(e) => setBoardDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Color Selection */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <label className="text-sm font-medium mb-4 block">Choose Color</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {BOARD_COLORS.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id as BoardColor)}
                    className={cn(
                      "aspect-square rounded-xl transition-all duration-200 relative",
                      color.class,
                      selectedColor === color.id 
                        ? "ring-4 ring-primary ring-offset-2 ring-offset-background scale-105" 
                        : "hover:scale-105"
                    )}
                  >
                    {selectedColor === color.id && (
                      <Check className="absolute inset-0 m-auto h-6 w-6 text-foreground drop-shadow-md" />
                    )}
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview & Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => setStep('template')}
            >
              Back to Templates
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!boardName.trim() || isCreating}
              className="gradient-primary text-primary-foreground w-full sm:w-auto"
              size="lg"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Board
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
