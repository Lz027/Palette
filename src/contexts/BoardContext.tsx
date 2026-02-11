import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
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
}

interface BoardContextType {
  boards: Board[];
  createBoard: (name: string, color: string, template?: string) => Board;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addCard: (boardId: string, columnId: string, card: Omit<Card, 'id'>) => void;
  moveCard: (boardId: string, fromColumnId: string, toColumnId: string, cardId: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

// Local storage key
const STORAGE_KEY = 'palette_boards';

// Default boards for demo
const defaultBoards: Board[] = [
  {
    id: '1',
    name: 'My First Workspace',
    color: 'coral',
    isFavorite: true,
    createdAt: new Date(),
    columns: [
      { id: 'c1', title: 'To Do', cards: [{ id: 'card1', title: 'Welcome to PALETTE!' }] },
      { id: 'c2', title: 'In Progress', cards: [] },
      { id: 'c3', title: 'Done', cards: [] }
    ]
  }
];

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.forEach((b: Board) => {
          b.createdAt = new Date(b.createdAt);
        });
        setBoards(parsed);
      } catch (e) {
        setBoards(defaultBoards);
      }
    } else {
      setBoards(defaultBoards);
    }
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
    }
  }, [boards, loaded]);

  const createBoard = (name: string, color: string, template?: string): Board => {
    const columns = template === 'kanban' 
      ? [{ id: Date.now().toString(), title: 'To Do', cards: [] }, { id: (Date.now()+1).toString(), title: 'In Progress', cards: [] }, { id: (Date.now()+2).toString(), title: 'Done', cards: [] }]
      : [{ id: Date.now().toString(), title: 'Tasks', cards: [] }];

    const newBoard: Board = {
      id: Date.now().toString(),
      name,
      color,
      isFavorite: false,
      columns,
      createdAt: new Date()
    };

    setBoards(prev => [newBoard, ...prev]);
    return newBoard;
  };

  const updateBoard = (id: string, updates: Partial<Board>) => {
    setBoards(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBoard = (id: string) => {
    setBoards(prev => prev.filter(b => b.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setBoards(prev => prev.map(b => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));
  };

  const addCard = (boardId: string, columnId: string, card: Omit<Card, 'id'>) => {
    const newCard: Card = { ...card, id: Date.now().toString() };
    setBoards(prev => prev.map(b => {
      if (b.id !== boardId) return b;
      return {
        ...b,
        columns: b.columns.map(c => c.id === columnId ? { ...c, cards: [...c.cards, newCard] } : c)
      };
    }));
  };

  const moveCard = (boardId: string, fromColumnId: string, toColumnId: string, cardId: string) => {
    setBoards(prev => prev.map(b => {
      if (b.id !== boardId) return b;
      const fromCol = b.columns.find(c => c.id === fromColumnId);
      const card = fromCol?.cards.find(c => c.id === cardId);
      if (!card) return b;
      
      return {
        ...b,
        columns: b.columns.map(c => {
          if (c.id === fromColumnId) return { ...c, cards: c.cards.filter(card => card.id !== cardId) };
          if (c.id === toColumnId) return { ...c, cards: [...c.cards, card] };
          return c;
        })
      };
    }));
  };

  if (!loaded) return null;

  return (
    <BoardContext.Provider value={{ 
      boards, 
      createBoard, 
      updateBoard, 
      deleteBoard, 
      toggleFavorite,
      addCard,
      moveCard
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
