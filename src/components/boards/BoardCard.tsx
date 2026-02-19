import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MoreHorizontal, Trash2, Edit, Check, X } from 'lucide-react';
import type { Board } from '@/types';
import { useBoards } from '@/contexts/BoardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const { toggleFavorite, deleteBoard, updateBoard } = useBoards();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(board.name);
  
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

  const startEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setEditName(board.name);
  };

  const saveEdit = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (editName.trim() && editName !== board.name) {
      await updateBoard(board.id, { name: editName.trim() });
    }
    setIsEditing(false);
  };

  const cancelEdit = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setEditName(board.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
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
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="flex items-center gap-1" onClick={e => e.preventDefault()}>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-7 text-sm px-1"
                    autoFocus
                    onClick={e => e.preventDefault()}
                  />
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={saveEdit}>
                    <Check className="h-3 w-3 text-success" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={cancelEdit}>
                    <X className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ) : (
                <h3 
                  className="font-medium truncate group-hover:text-primary transition-colors cursor-pointer"
                  onClick={startEditing}
                  title="Click to rename"
                >
                  {board.name}
                </h3>
              )}
              
              {board.description && !isEditing && (
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

            {!isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={startEditing}>
                    <Edit className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
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
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
