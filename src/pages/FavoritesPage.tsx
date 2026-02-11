import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus } from 'lucide-react';
import { useBoards } from '@/contexts/BoardContext';
import { Button } from '@/components/ui/button';
import { BoardCard } from '@/components/boards/BoardCard';

export default function FavoritesPage() {
  const { boards } = useBoards();
  const favoriteBoards = boards.filter(b => b.isFavorite);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Star className="h-7 w-7 text-warning fill-warning" />
            Favorites
          </h1>
          <p className="text-muted-foreground mt-1">
            {favoriteBoards.length} favorite board{favoriteBoards.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Boards Grid */}
      {favoriteBoards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoriteBoards.map(board => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-warning" />
          </div>
          <h3 className="font-medium mb-2">No favorites yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Star your favorite boards for quick access
          </p>
          <Button asChild variant="outline">
            <Link to="/boards">Browse Boards</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
