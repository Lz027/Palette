import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import { useBoards } from '@/contexts/BoardContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFocus, FocusMode } from '@/contexts/FocusContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BoardCard } from '@/components/boards/BoardCard';
import { FocusToolsPanel } from '@/components/features/FocusToolsPanel';
import { CodeSnippets } from '@/components/features/CodeSnippets';
import { NoteTaker } from '@/components/features/NoteTaker';
import { ImageEditor } from '@/components/features/ImageEditor';
import { ToolPanelGrid } from '@/components/features/ToolPanelGrid';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';


export default function DashboardPage() {
  const { boards } = useBoards();
  const { user } = useAuth();
  const { colors, focusMode } = useFocus();
  const isMobile = useIsMobile();
  
  const favoriteBoards = boards.filter(b => b.isFavorite);
  const recentBoards = boards.slice(-4).reverse();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const renderSpecialTool = () => {
    switch (focusMode) {
      case 'tech': return <CodeSnippets />;
      case 'design': return <ImageEditor />;
      case 'productive': return <NoteTaker />;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-lg sm:text-2xl md:text-3xl font-bold">
              {greeting()}, {user?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
              Here's what's happening with your projects
            </p>
          </div>
          {!isMobile && (
            <Button asChild className="gradient-primary text-primary-foreground">
              <Link to="/boards/new">
                <Plus className="h-4 w-4 mr-2" />
                {colors.createLabel}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Tool Panels */}
      {isMobile ? (
        <ToolPanelGrid />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <FocusToolsPanel compact={isMobile} />
          {renderSpecialTool()}
        </div>
      )}

      {/* Recent Boards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-sm sm:text-lg font-semibold">Recent Boards</h2>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground text-xs sm:text-sm h-8">
            <Link to="/boards">
              View all <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        {recentBoards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {recentBoards.map(board => <BoardCard key={board.id} board={board} />)}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="p-4 sm:p-8 text-center">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Plus className="h-5 w-5 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1.5 text-sm sm:text-base">No boards yet</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                Create your first board to get started
              </p>
              <Button asChild className="gradient-primary text-primary-foreground" size={isMobile ? "sm" : "default"}>
                <Link to="/boards/new">{colors.createLabel}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Favorites Section */}
      {favoriteBoards.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-sm sm:text-lg font-semibold">Favorites</h2>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground text-xs sm:text-sm h-8">
              <Link to="/favorites">
                View all <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {favoriteBoards.slice(0, 4).map(board => <BoardCard key={board.id} board={board} />)}
          </div>
        </section>
      )}
    </div>
  );
}
