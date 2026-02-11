import React, { useState } from 'react';
import { Zap, Plus, X } from 'lucide-react';
import { useBoards } from '@/contexts/BoardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export function QuickCapture() {
  const [isOpen, setIsOpen] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  
  const { boards, addCard } = useBoards();

  const selectedBoard = boards.find(b => b.id === selectedBoardId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardTitle.trim() || !selectedBoardId || !selectedColumnId) return;
    
    addCard(selectedBoardId, selectedColumnId, cardTitle.trim());
    setCardTitle('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full p-4 rounded-xl border-2 border-dashed border-muted-foreground/20",
          "hover:border-primary/40 hover:bg-primary/5 transition-all duration-200",
          "flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
        )}
      >
        <Zap className="h-5 w-5" />
        <span className="font-medium">Quick Capture</span>
        <span className="text-xs opacity-70">— Add a card instantly</span>
      </button>
    );
  }

  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Quick Capture</span>
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Input
            placeholder="What's on your mind?"
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            className="text-lg"
            autoFocus
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedBoardId} onValueChange={(value) => {
              setSelectedBoardId(value);
              setSelectedColumnId('');
            }}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent>
                {boards.map(board => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedColumnId} 
              onValueChange={setSelectedColumnId}
              disabled={!selectedBoardId}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {selectedBoard?.columns.map(col => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              type="submit" 
              className="gradient-primary text-primary-foreground"
              disabled={!cardTitle.trim() || !selectedBoardId || !selectedColumnId}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
