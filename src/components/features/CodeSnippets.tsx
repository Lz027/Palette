import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, Plus, Copy, Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { z } from 'zod';
import { snippetTitleSchema, snippetCodeSchema, validateInput, INPUT_LIMITS } from '@/lib/validation';
import { safeParseLocalStorage, safeSetLocalStorage } from '@/lib/safe-storage';

// Schema for validating snippet data from localStorage
const snippetSchema = z.object({
  id: z.string(),
  title: z.string().max(INPUT_LIMITS.SNIPPET_TITLE),
  code: z.string().max(INPUT_LIMITS.SNIPPET_CODE),
  language: z.string(),
});

const snippetArraySchema = z.array(snippetSchema);

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
}

const STORAGE_KEY = 'palette-code-snippets';

interface CodeSnippetsProps {
  className?: string;
}

export function CodeSnippets({ className }: CodeSnippetsProps) {
  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    return safeParseLocalStorage(STORAGE_KEY, snippetArraySchema, [] as Snippet[]) as Snippet[];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newSnippet, setNewSnippet] = useState({ title: '', code: '', language: 'javascript' });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const saveSnippets = (newSnippets: Snippet[]) => {
    setSnippets(newSnippets);
    safeSetLocalStorage(STORAGE_KEY, newSnippets);
  };

  const addSnippet = () => {
    // Validate title
    const titleValidation = validateInput(snippetTitleSchema, newSnippet.title);
    if (!titleValidation.success) {
      toast.error('error' in titleValidation ? titleValidation.error : 'Invalid title');
      return;
    }
    
    // Validate code
    const codeValidation = validateInput(snippetCodeSchema, newSnippet.code);
    if (!codeValidation.success) {
      toast.error('error' in codeValidation ? codeValidation.error : 'Invalid code');
      return;
    }
    
    const snippet: Snippet = {
      id: Date.now().toString(),
      title: titleValidation.data,
      code: codeValidation.data,
      language: newSnippet.language,
    };
    saveSnippets([...snippets, snippet]);
    setNewSnippet({ title: '', code: '', language: 'javascript' });
    setIsAdding(false);
    toast.success('Snippet saved!');
  };

  const deleteSnippet = (id: string) => {
    saveSnippets(snippets.filter(s => s.id !== id));
    toast.success('Snippet deleted');
  };

  const copySnippet = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Code className="h-4 w-4" />
            Code Snippets
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
              placeholder="Snippet title"
              value={newSnippet.title}
              onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value.slice(0, INPUT_LIMITS.SNIPPET_TITLE) })}
              maxLength={INPUT_LIMITS.SNIPPET_TITLE}
              className="h-8 text-sm"
            />
            <Textarea
              placeholder="Paste your code here..."
              value={newSnippet.code}
              onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value.slice(0, INPUT_LIMITS.SNIPPET_CODE) })}
              maxLength={INPUT_LIMITS.SNIPPET_CODE}
              className="min-h-[80px] font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              {newSnippet.code.length}/{INPUT_LIMITS.SNIPPET_CODE} characters
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={addSnippet} className="h-7">Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="h-7">Cancel</Button>
            </div>
          </div>
        )}

        <ScrollArea className="max-h-64">
          <div className="space-y-2">
            {snippets.length === 0 && !isAdding && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No snippets yet. Click + to add one.
              </p>
            )}
            {snippets.map((snippet) => (
              <div
                key={snippet.id}
                className="p-2 rounded-lg bg-muted/50 group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{snippet.title}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => copySnippet(snippet.code, snippet.id)}
                    >
                      {copiedId === snippet.id ? (
                        <Check className="h-3 w-3 text-success" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-destructive"
                      onClick={() => deleteSnippet(snippet.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <pre className="text-[10px] font-mono bg-background/50 p-2 rounded overflow-x-auto">
                  <code>{snippet.code.slice(0, 150)}{snippet.code.length > 150 ? '...' : ''}</code>
                </pre>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
