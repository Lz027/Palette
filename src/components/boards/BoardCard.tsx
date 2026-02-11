import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import type { Board } from '@/types';
import { useBoards } from '@/contexts/BoardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface BoardCardProps {
  board: Board;
}

const boardColorClasses: Record<string, string> = {
  coral: 'from-board-coral to-board-peach',
  lavender: 'from-board-lavender to-board-rose',
  mint: 'from-board-mint to-board-sky',
  sky: 'from-board-sky to-board-lavender',
  peach: 'from-board-peach to-board-coral',
  rose: 'from-board-rose to-board-lavender',
};

export function BoardCard({ board }: BoardCardProps) {
  const { toggleFavorite, deleteBoard } = useBoards();
  
  const totalCards = board.columns.reduce((acc, col) => acc + col.cards.length, 0);
  
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(board.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this board?')) {
      deleteBoard(board.id);
    }
  };

  return (
    <Link to={`/boards/${board.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-transparent hover:border-primary/20">
        {/* Color Banner */}
        <div 
          className={cn(
            "h-24 bg-gradient-to-br relative",
            boardColorClasses[board.color] || 'from-primary to-secondary'
          )}
        >
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 h-8 w-8 bg-background/20 hover:bg-background/40",
              board.isFavorite ? "text-warning" : "text-foreground/70"
            )}
            onClick={handleFavorite}
          >
            <Star className={cn("h-4 w-4", board.isFavorite && "fill-current")} />
          </Button>

          {/* Template Badge */}
          <div className="absolute bottom-2 left-3">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-background/30 backdrop-blur-sm text-foreground/90 capitalize">
              {board.template}
            </span>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                {board.name}
              </h3>
              {board.description && (
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {board.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>{board.columns.length} columns</span>
                <span>•</span>
                <span>{totalCards} cards</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleFavorite}>
                  <Star className="h-4 w-4 mr-2" />
                  {board.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
