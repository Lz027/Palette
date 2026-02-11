import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StickyNote, Plus, Trash2, Check, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { INPUT_LIMITS } from '@/lib/validation';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NoteTakerProps {
  className?: string;
}

export function NoteTaker({ className }: NoteTakerProps) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('palette-notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('palette-notes', JSON.stringify(newNotes));
  };

  const addNote = () => {
    if (!newNote.title.trim()) {
      toast.error('Please add a title');
      return;
    }
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title.trim().slice(0, INPUT_LIMITS.NOTE_TITLE || 100),
      content: newNote.content.trim().slice(0, INPUT_LIMITS.NOTE_CONTENT || 2000),
      createdAt: new Date().toISOString(),
    };
    saveNotes([...notes, note]);
    setNewNote({ title: '', content: '' });
    setIsAdding(false);
    toast.success('Note saved!');
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
    toast.success('Note deleted');
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    saveNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
    setEditingId(null);
    toast.success('Note updated!');
  };

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <StickyNote className="h-4 w-4" />
            Quick Notes
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAdding(!isAdding)}
            className="h-7 px-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        {isAdding && (
          <div className="space-y-2 mb-3 p-3 rounded-lg bg-muted/50">
            <Input
              placeholder="Note title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value.slice(0, 100) })}
              maxLength={100}
              className="h-8 text-sm"
            />
            <Textarea
              placeholder="Write your note..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value.slice(0, 2000) })}
              maxLength={2000}
              className="min-h-[80px] text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {newNote.content.length}/2000 characters
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={addNote} className="h-7">Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="h-7">Cancel</Button>
            </div>
          </div>
        )}

        <ScrollArea className="max-h-64">
          <div className="space-y-2">
            {notes.length === 0 && !isAdding && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notes yet. Click + to add one.
              </p>
            )}
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-2 rounded-lg bg-muted/50 group"
              >
                {editingId === note.id ? (
                  <div className="space-y-2">
                    <Input
                      value={note.title}
                      onChange={(e) => {
                        const updated = notes.map(n => 
                          n.id === note.id ? { ...n, title: e.target.value.slice(0, 100) } : n
                        );
                        setNotes(updated);
                      }}
                      className="h-7 text-xs"
                    />
                    <Textarea
                      value={note.content}
                      onChange={(e) => {
                        const updated = notes.map(n => 
                          n.id === note.id ? { ...n, content: e.target.value.slice(0, 2000) } : n
                        );
                        setNotes(updated);
                      }}
                      className="min-h-[60px] text-xs"
                    />
                    <div className="flex gap-1">
                      <Button size="sm" className="h-6 text-xs" onClick={() => updateNote(note.id, { title: note.title, content: note.content })}>
                        <Check className="h-3 w-3 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{note.title}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => setEditingId(note.id)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-3">
                      {note.content || 'No content'}
                    </p>
                    <p className="text-[8px] text-muted-foreground mt-1">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
