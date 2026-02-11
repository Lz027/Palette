import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useBoards } from '@/contexts/BoardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BoardCard } from '@/components/boards/BoardCard';

export default function BoardsPage() {
  const { boards } = useBoards();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">All Boards</h1>
          <p className="text-muted-foreground mt-1">
            {boards.length} board{boards.length !== 1 ? 's' : ''} in your workspace
          </p>
        </div>
        <Button asChild className="gradient-primary text-primary-foreground w-full md:w-auto">
          <Link to="/boards/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Board
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search boards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Boards Grid */}
      {filteredBoards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBoards.map(board => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      ) : boards.length > 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No boards match your search</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">No boards yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first board to get started
          </p>
          <Button asChild className="gradient-primary text-primary-foreground">
            <Link to="/boards/new">Create Board</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
