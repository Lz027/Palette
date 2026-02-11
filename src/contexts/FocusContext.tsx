import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type FocusMode = 'tech' | 'productive' | 'design';

interface FocusColors {
  primary: string;
  secondary: string;
  accent: string;
  name: string;
  createLabel: string;
  createRoute: string;
}

const focusModeColors: Record<FocusMode, FocusColors> = {
  productive: {
    primary: '350 70% 65%', // Pastel red (default)
    secondary: '280 50% 65%',
    accent: '340 60% 70%',
    name: 'Productive',
    createLabel: 'Create Workspace',
    createRoute: '/boards/new',
  },
  design: {
    primary: '45 85% 60%', // Yellow
    secondary: '35 80% 55%',
    accent: '55 75% 65%',
    name: 'Design',
    createLabel: 'Create Design',
    createRoute: '/boards/new',
  },
  tech: {
    primary: '220 70% 60%', // Blue
    secondary: '200 65% 55%',
    accent: '240 60% 65%',
    name: 'Tech',
    createLabel: 'Create Project',
    createRoute: '/boards/new',
  },
};

interface FocusContextType {
  focusMode: FocusMode;
  setFocusMode: (mode: FocusMode) => void;
  colors: FocusColors;
  getColumnTypes: () => { value: string; label: string; icon?: string }[];
  pendingModeChange: FocusMode | null;
  confirmModeChange: () => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const [focusMode, setFocusModeState] = useState<FocusMode>(() => {
    const saved = localStorage.getItem('palette-focus-mode');
    return (saved as FocusMode) || 'productive';
  });
  const [pendingModeChange, setPendingModeChange] = useState<FocusMode | null>(null);

  const setFocusMode = useCallback((mode: FocusMode) => {
    if (mode !== focusMode) {
      setPendingModeChange(mode);
    }
  }, [focusMode]);

  const confirmModeChange = useCallback(() => {
    if (pendingModeChange) {
      setFocusModeState(pendingModeChange);
      localStorage.setItem('palette-focus-mode', pendingModeChange);
      setPendingModeChange(null);
    }
  }, [pendingModeChange]);

  const colors = focusModeColors[focusMode];

  // Apply theme colors to CSS variables - dynamically update the primary/secondary/accent
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--ring', colors.primary);
    root.style.setProperty('--sidebar-primary', colors.primary);
  }, [colors]);

  const getColumnTypes = () => {
    return [
      { value: 'text', label: 'Text' },
      { value: 'number', label: 'Number' },
      { value: 'date', label: 'Date' },
      { value: 'file', label: 'File' },
      { value: 'link', label: 'Link' },
      { value: 'status', label: 'Status' },
    ];
  };

  return (
    <FocusContext.Provider value={{ focusMode, setFocusMode, colors, getColumnTypes, pendingModeChange, confirmModeChange }}>
      {children}
    </FocusContext.Provider>
  );
}

export function useFocus() {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
}

// Dev tools for tech mode
export const devTools = [
  { id: 'github', name: 'GitHub', icon: '🔗' },
  { id: 'vscode', name: 'VS Code', icon: '💻' },
  { id: 'docker', name: 'Docker', icon: '🐳' },
  { id: 'postgres', name: 'PostgreSQL', icon: '🐘' },
  { id: 'supabase', name: 'Supabase', icon: '⚡' },
  { id: 'vercel', name: 'Vercel', icon: '▲' },
  { id: 'cursor', name: 'Cursor AI', icon: '🤖' },
  { id: 'lovable', name: 'Lovable', icon: '💜' },
  { id: 'npm', name: 'npm', icon: '📦' },
  { id: 'git', name: 'Git', icon: '📝' },
  { id: 'figma', name: 'Figma', icon: '🎨' },
  { id: 'notion', name: 'Notion', icon: '📓' },
];

// Design tools for design mode
export const designTools = [
  { id: 'figma', name: 'Figma', icon: '🎨' },
  { id: 'canva', name: 'Canva', icon: '🖼️' },
  { id: 'leonardo', name: 'Leonardo AI', icon: '🎭' },
  { id: 'midjourney', name: 'Midjourney', icon: '✨' },
  { id: 'photoshop', name: 'Photoshop', icon: '📷' },
  { id: 'illustrator', name: 'Illustrator', icon: '✏️' },
  { id: 'procreate', name: 'Procreate', icon: '🖌️' },
  { id: 'blender', name: 'Blender', icon: '🧊' },
  { id: 'aftereffects', name: 'After Effects', icon: '🎬' },
  { id: 'premiere', name: 'Premiere Pro', icon: '🎥' },
  { id: 'davinci', name: 'DaVinci Resolve', icon: '🎞️' },
  { id: 'sketch', name: 'Sketch', icon: '💎' },
];

// Default status options
export const defaultStatuses = [
  { id: 'todo', name: 'To Do', color: '220 15% 50%' },
  { id: 'in-progress', name: 'In Progress', color: '45 85% 55%' },
  { id: 'review', name: 'Review', color: '280 50% 60%' },
  { id: 'done', name: 'Done', color: '158 55% 48%' },
  { id: 'blocked', name: 'Blocked', color: '0 65% 55%' },
];
