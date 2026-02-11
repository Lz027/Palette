// Palette Core Types

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  color: BoardColor;
  template: BoardTemplate;
  columns: Column[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  ownerId: string;
}

export interface Column {
  id: string;
  name: string;
  boardId: string;
  order: number;
  type?: ColumnType;
  cards: Card[];
  cells?: Cell[];
}

export type ColumnType = 'text' | 'number' | 'date' | 'file' | 'link';

export interface Cell {
  id: string;
  columnId: string;
  rowId: string;
  value: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Row {
  id: string;
  boardId: string;
  order: number;
  createdAt: Date;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  order: number;
  labels: Label[];
  dueDate?: Date;
  priority?: Priority;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type BoardColor = 
  | 'coral'
  | 'lavender'
  | 'mint'
  | 'sky'
  | 'peach'
  | 'rose';

export type BoardTemplate = 
  | 'canvas' // Blank slate
  | 'sprint' // Agile sprint board
  | 'mosaic' // Creative project with multiple categories
  | 'compass' // Goal tracking
  | 'rhythm' // Daily/weekly planner
  | 'spark' // Ideation and brainstorming;

export interface BoardTemplateConfig {
  id: BoardTemplate;
  name: string;
  description: string;
  defaultColumns: string[];
  features: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  showQuickCapture: boolean;
  focusModeEnabled: boolean;
  defaultBoardColor: BoardColor;
}
