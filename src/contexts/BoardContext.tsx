import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { Board, Column, Card, FocusMode } from '@/types';


interface BoardContextType {
  boards: Board[];
  createBoard: (name: string, template: string, color: string, description: string, focusMode: FocusMode) => Promise<Board>;
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

// Fallback ID generator for browsers without crypto.randomUUID
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load boards from Supabase
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
      } else {
        setBoards(data.map(b => ({
          id: b.id,
          name: b.name,
          description: b.description,
          color: b.color,
          template: b.template_type || 'canvas',
          isFavorite: b.is_favorite,
          columns: b.columns || [],
          createdAt: new Date(b.created_at),
          updatedAt: new Date(b.created_at), // Use created_at if updated_at is null
          ownerId: b.user_id,
          focusMode: b.focus_mode || 'tech'
        })));
      }
      setIsLoading(false);
    };

    fetchBoards();
  }, [user]);

  const createBoard = async (name: string, template: string, color: string, description: string, focusMode: FocusMode): Promise<Board> => {
    if (!user) throw new Error('Not authenticated');

    const columns = template === 'kanban'
      ? [
        { id: generateId(), title: 'To Do', cards: [] },
        { id: generateId(), title: 'In Progress', cards: [] },
        { id: generateId(), title: 'Done', cards: [] }
      ]
      : [{ id: generateId(), title: 'Tasks', cards: [] }];

    const { data, error } = await supabase
      .from('boards')
      .insert({
        name,
        color,
        columns,
        user_id: user.id,
        is_favorite: false,
        focus_mode: focusMode,
        description: description
      })
      .select()
      .single();

    if (error) {
      console.error('Create board error:', error);
      throw error;
    }

    const newBoard: Board = {
      id: data.id,
      name: data.name,
      description: data.description,
      color: data.color,
      template: data.template_type || 'canvas',
      isFavorite: data.is_favorite,
      columns: data.columns,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.created_at),
      ownerId: data.user_id,
      focusMode: data.focus_mode
    };

    setBoards(prev => [newBoard, ...prev]);
    return newBoard;
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
      throw error;
    }

    setBoards(prev => prev.filter(b => b.id !== id));
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
      throw error;
    }

    setBoards(prev => prev.map(b => b.id === id ? { ...b, isFavorite: newValue } : b));
  };

  const addColumn = async (boardId: string, title: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    const newColumn: Column = {
      id: generateId(),
      name: title,
      boardId,
      order: board.columns.length,
      cards: []
    };
    const updatedColumns = [...board.columns, newColumn];

    await updateBoard(boardId, { columns: updatedColumns });
  };

  const updateColumn = async (boardId: string, columnId: string, title: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    const updatedColumns = board.columns.map(c =>
      c.id === columnId ? { ...c, name: title } : c
    );

    await updateBoard(boardId, { columns: updatedColumns });
  };

  const deleteColumn = async (boardId: string, columnId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    const updatedColumns = board.columns.filter(c => c.id !== columnId);

    await updateBoard(boardId, { columns: updatedColumns });
  };

  const addCard = async (boardId: string, columnId: string, card: Omit<Card, 'id' | 'columnId' | 'order' | 'labels' | 'createdAt' | 'updatedAt'>) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;

    const newCard: Card = {
      ...card,
      id: generateId(),
      columnId,
      order: (board.columns.find(c => c.id === columnId)?.cards.length || 0),
      labels: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
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

    const newCard: Card = { ...card, columnId: toColumnId };

    const updatedColumns = board.columns.map(c => {
      if (c.id === fromColumnId) return { ...c, cards: c.cards.filter(card => card.id !== cardId) };
      if (c.id === toColumnId) return { ...c, cards: [...c.cards, newCard] };
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
