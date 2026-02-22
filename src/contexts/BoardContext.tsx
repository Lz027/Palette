import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface Card {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

interface Board {
  id: string;
  name: string;
  color: string;
  isFavorite: boolean;
  columns: Column[];
  createdAt: Date;
  userId: string;
}

interface BoardContextType {
  boards: Board[];
  createBoard: (name: string, color: string, template?: string) => Promise<Board>;
  updateBoard: (id: string, updates: Partial<Board>) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  addCard: (boardId: string, columnId: string, card: Omit<Card, 'id'>) => Promise<void>;
  moveCard: (boardId: string, fromColumnId: string, toColumnId: string, cardId: string) => Promise<void>;
  addColumn: (boardId: string, title: string) => Promise<void>;
  updateColumn: (boardId: string, columnId: string, title: string) => Promise<void>;
  deleteColumn: (boardId: string, columnId: string) => Promise<void>;
  isLoading: boolean;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setBoards([]);
      setIsLoading(false);
      return;
    }

    const fetchBoards = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching boards:', error);
        toast.error('Failed to load boards');
      } else {
        setBoards(data.map(b => ({
          id: b.id,
          name: b.name,
          color: b.color,
          isFavorite: b.is_favorite,
          columns: b.columns || [],
          createdAt: new Date(b.created_at),
          userId: b.user_id
        })));
      }
      setIsLoading(false);
    };

    fetchBoards();
  }, [user]);

  const createBoard = async (name: string, color: string, template?: string): Promise<Board> => {
    if (!user) throw new Error('Not authenticated');

    if (boards.length >= 100) {
      toast.error('Board limit reached (100). Delete old boards to create new ones.');
      throw new Error('Board limit reached');
    }

    const columns = template === 'kanban' 
      ? [
          { id: generateId(), title: 'To Do', cards: [] },
          { id: generateId(), title: 'In Progress', cards: [] },
          { id: generateId(), title: 'Done', cards: [] }
        ]
      : [{ id: generateId(), title: 'Tasks', cards: [] }];

    try {
      const { data, error } = await supabase
        .from('boards')
        .insert({
          name,
          color,
          columns,
          user_id: user.id,
          is_favorite: false
        })
        .select()
        .single();

      if (error) {
        console.error('Create board error:', error);
        
        if (error.code === '42501') {
          toast.error('Permission denied. Please check your login status.');
        } else if (error.code === '23505') {
          toast.error('A board with this name already exists.');
        } else if (error.code === '23514') {
          toast.error('Board limit reached for your account.');
        } else if (error.code === '23502') {
          toast.error('Missing required fields. Please try again.');
        } else {
          toast.error(`Failed to create board: ${error.message}`);
        }
        
        throw error;
      }

      const newBoard: Board = {
        id: data.id,
        name: data.name,
        color: data.color,
        isFavorite: data.is_favorite,
        columns: data.columns,
        createdAt: new Date(data.created_at),
        userId: data.user_id
      };

      setBoards(prev => [newBoard, ...prev]);
      toast.success('Board created successfully!');
      return newBoard;
      
    } catch (error) {
      console.error('Create board exception:', error);
      throw error;
    }
  };

  const updateBoard = async (id: string, updates: Partial<Board>) => {
    const { error } = await supabase
      .from('boards')
      .update({
        name: updates.name,
        color: updates.color,
        is_favorite: updates.isFavorite,
        columns: updates.columns
      })
      .eq('id', id);

    if (error) {
      console.error('Update board error:', error);
      toast.error('Failed to update board');
      throw error;
    }

    setBoards(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBoard = async (id: string) => {
    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete board error:', error);
      toast.error('Failed to delete board');
      throw error;
    }

    setBoards(prev => prev.filter(b => b.id !== id));
    toast.success('Board deleted');
  };

  const toggleFavorite = async (id: string) => {
    const board = boards.find(b => b.id === id);
    if (!board) return;

    const newValue = !board.isFavorite;
    
    const { error } = await supabase
      .from('boards')
      .update({ is_favorite: newValue })
      .eq('id', id);

    if (error) {
      console.error('Toggle favorite error:', error);
      toast.error('Failed to update favorite');
      throw error;
    }

    setBoards(prev => prev.map(b => b.id === id ? { ...b, isFavorite: newValue } : b));
  };

  const addColumn = async (boardId: string, title: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    const newColumn = { id: generateId(), title, cards: [] };
    const updatedColumns = [...board.columns, newColumn];

    await updateBoard(boardId, { columns: updatedColumns });
  };

  const updateColumn = async (boardId: string, columnId: string, title: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    const updatedColumns = board.columns.map(c => 
      c.id === columnId ? { ...c, title } : c
    );

    await updateBoard(boardId, { columns: updatedColumns });
  };

  const deleteColumn = async (boardId: string, columnId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    const updatedColumns = board.columns.filter(c => c.id !== columnId);

    await updateBoard(boardId, { columns: updatedColumns });
  };

  const addCard = async (boardId: string, columnId: string, card: Omit<Card, 'id'>) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    const newCard = { ...card, id: generateId() };
    const updatedColumns = board.columns.map(c => 
      c.id === columnId ? { ...c, cards: [...c.cards, newCard] } : c
    );

    await updateBoard(boardId, { columns: updatedColumns });
  };

  const moveCard = async (boardId: string, fromColumnId: string, toColumnId: string, cardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    const fromCol = board.columns.find(c => c.id === fromColumnId);
    const card = fromCol?.cards.find(c => c.id === cardId);
    if (!card) return;

    const updatedColumns = board.columns.map(c => {
      if (c.id === fromColumnId) return { ...c, cards: c.cards.filter(card => card.id !== cardId) };
      if (c.id === toColumnId) return { ...c, cards: [...c.cards, card] };
      return c;
    });

    await updateBoard(boardId, { columns: updatedColumns });
  };

  return (
    <BoardContext.Provider value={{ 
      boards, 
      createBoard, 
      updateBoard, 
      deleteBoard, 
      toggleFavorite,
      addCard,
      moveCard,
      addColumn,
      updateColumn,
      deleteColumn,
      isLoading
    }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoards() {
  const context = useContext(BoardContext);
  if (!context) throw new Error('useBoards must be used within BoardProvider');
  return context;
}
