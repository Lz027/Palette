import React, { useState, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Plus, Trash2, Type, Hash, Calendar, Paperclip, Link as LinkIcon, Check, X, CheckSquare, Upload, FileIcon, Loader2 } from 'lucide-react';
import { useBoards } from '@/contexts/BoardContext';
import { useFocus, defaultStatuses } from '@/contexts/FocusContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ColumnType } from '@/types';

type ExtendedColumnType = ColumnType | 'status';

const columnTypeConfig: Record<ExtendedColumnType, { icon: React.ElementType; label: string }> = {
  text: { icon: Type, label: 'Text' },
  number: { icon: Hash, label: 'Number' },
  date: { icon: Calendar, label: 'Date' },
  file: { icon: Paperclip, label: 'File' },
  link: { icon: LinkIcon, label: 'Link' },
  'status': { icon: CheckSquare, label: 'Status' },
};

const boardColorConfigs: Record<string, { bg: string; text: string; light: string; border: string; gradient: string }> = {
  coral: { bg: 'bg-board-coral', text: 'text-board-coral', light: 'bg-board-coral/10', border: 'border-board-coral/20', gradient: 'from-board-coral/20 to-board-peach/10' },
  lavender: { bg: 'bg-board-lavender', text: 'text-board-lavender', light: 'bg-board-lavender/10', border: 'border-board-lavender/20', gradient: 'from-board-lavender/20 to-board-rose/10' },
  mint: { bg: 'bg-board-mint', text: 'text-board-mint', light: 'bg-board-mint/10', border: 'border-board-mint/20', gradient: 'from-board-mint/20 to-board-sky/10' },
  sky: { bg: 'bg-board-sky', text: 'text-board-sky', light: 'bg-board-sky/10', border: 'border-board-sky/20', gradient: 'from-board-sky/20 to-board-lavender/10' },
  peach: { bg: 'bg-board-peach', text: 'text-board-peach', light: 'bg-board-peach/10', border: 'border-board-peach/20', gradient: 'from-board-peach/20 to-board-coral/10' },
  rose: { bg: 'bg-board-rose', text: 'text-board-rose', light: 'bg-board-rose/10', border: 'border-board-rose/20', gradient: 'from-board-rose/20 to-board-lavender/10' },
};

export default function BoardViewPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const { boards, toggleFavorite, addColumn, deleteColumn, updateColumn, updateBoard } = useBoards();
  const { focusMode, getColumnTypes } = useFocus();
  const { settings } = useSettings();

  const board = boards.find(b => b.id === boardId);
  const colorConfig = board ? boardColorConfigs[board.color] || boardColorConfigs.coral : boardColorConfigs.coral;

  const [newColumnName, setNewColumnName] = useState('');

  // Initialize from board.data if available
  const initialRows = board?.data?.rows || [{ id: '1', cells: {} }];
  const initialColumnTypes = board?.data?.columnTypes || {};

  const [rows, setRows] = useState<{ id: string; cells: Record<string, string> }[]>(initialRows);
  const [columnTypes, setColumnTypes] = useState<Record<string, ExtendedColumnType>>(initialColumnTypes);

  // Update local state when board data changes (e.g. from Quick Capture)
  React.useEffect(() => {
    if (board?.data?.rows) {
      setRows(board.data.rows);
    }
    if (board?.data?.columnTypes) {
      setColumnTypes(board.data.columnTypes);
    }
  }, [board?.id, JSON.stringify(board?.data)]);

  // Auto-save changes back to the board
  React.useEffect(() => {
    if (!board) return;

    const saveTimeout = setTimeout(async () => {
      const currentData = board.data || {};
      const newData = {
        ...currentData,
        rows,
        columnTypes
      };

      // Only update if something actually changed to avoid infinite loops
      if (JSON.stringify(currentData) !== JSON.stringify(newData)) {
        await updateBoard(board.id, { data: newData });
      }
    }, 1000); // Debounce saves

    return () => clearTimeout(saveTimeout);
  }, [rows, columnTypes, board?.id]);

  const [editingCell, setEditingCell] = useState<{ rowId: string; colId: string } | null>(null);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnName, setEditingColumnName] = useState('');
  const [uploadingCell, setUploadingCell] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFileCell, setPendingFileCell] = useState<{ rowId: string; colId: string } | null>(null);

  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [boardNameEdit, setBoardNameEdit] = useState(board?.name || '');

  if (!board) {
    return <Navigate to="/boards" replace />;
  }

  const startEditingBoardName = () => {
    setIsEditingBoardName(true);
    setBoardNameEdit(board.name);
  };

  const saveBoardName = async () => {
    if (boardNameEdit.trim() && boardNameEdit !== board.name) {
      await updateBoard(board.id, { name: boardNameEdit.trim() });
    }
    setIsEditingBoardName(false);
  };

  const cancelBoardNameEdit = () => {
    setBoardNameEdit(board.name);
    setIsEditingBoardName(false);
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    addColumn(board.id, newColumnName.trim());
    setNewColumnName('');
  };

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now().toString(), cells: {} }]);
  };

  const handleCellChange = (rowId: string, colId: string, value: string) => {
    setRows(rows.map(row =>
      row.id === rowId
        ? { ...row, cells: { ...row.cells, [colId]: value } }
        : row
    ));
  };

  const handleDeleteRow = (rowId: string) => {
    setRows(rows.filter(row => row.id !== rowId));
  };

  const handleColumnTypeChange = (colId: string, type: ExtendedColumnType) => {
    setColumnTypes({ ...columnTypes, [colId]: type });
  };

  const getColumnType = (colId: string): ExtendedColumnType => {
    return columnTypes[colId] || 'text';
  };

  const startEditingColumn = (colId: string, currentName: string) => {
    setEditingColumnId(colId);
    setEditingColumnName(currentName);
  };

  const saveColumnName = (colId: string) => {
    if (editingColumnName.trim() && board) {
      updateColumn(board.id, colId, editingColumnName.trim());
    }
    setEditingColumnId(null);
    setEditingColumnName('');
  };

  const cancelEditingColumn = () => {
    setEditingColumnId(null);
    setEditingColumnName('');
  };

  const handleFileUpload = async (file: File, rowId: string, colId: string) => {
    const cellKey = `${rowId}-${colId}`;
    setUploadingCell(cellKey);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${boardId}/${colId}/${rowId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('board-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('board-files')
        .getPublicUrl(filePath);

      handleCellChange(rowId, colId, JSON.stringify({ name: file.name, url: publicUrl }));
      toast.success('File uploaded');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploadingCell(null);
    }
  };

  const triggerFileUpload = (rowId: string, colId: string) => {
    setPendingFileCell({ rowId, colId });
    fileInputRef.current?.click();
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pendingFileCell) {
      handleFileUpload(file, pendingFileCell.rowId, pendingFileCell.colId);
    }
    e.target.value = '';
    setPendingFileCell(null);
  };

  const availableColumnTypes = getColumnTypes();

  const renderCellInput = (rowId: string, colId: string, type: ExtendedColumnType) => {
    const value = rows.find(r => r.id === rowId)?.cells[colId] || '';
    const isEditing = editingCell?.rowId === rowId && editingCell?.colId === colId;

    const inputProps = {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleCellChange(rowId, colId, e.target.value),
      onBlur: () => setEditingCell(null),
      onFocus: () => setEditingCell({ rowId, colId }),
      className: cn(
        "border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent",
        settings.compact_mode ? "h-7 text-xs" : "h-9 text-sm"
      ),
    };

    switch (type) {
      case 'number':
        return <Input {...inputProps} type="number" placeholder="0" />;
      case 'date':
        return <Input {...inputProps} type="date" />;
      case 'link':
        return (
          <Input
            {...inputProps}
            type="url"
            placeholder="https://"
            className={cn(inputProps.className, value && "text-primary underline")}
          />
        );
      case 'file': {
        const cellKey = `${rowId}-${colId}`;
        const isUploading = uploadingCell === cellKey;
        let fileData: { name: string; url: string } | null = null;
        try {
          if (value) fileData = JSON.parse(value);
        } catch { }

        return (
          <div className="flex items-center gap-1.5 px-2 h-9">
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : fileData ? (
              <a
                href={fileData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline truncate"
              >
                <FileIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{fileData.name}</span>
              </a>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => triggerFileUpload(rowId, colId)}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload
              </Button>
            )}
          </div>
        );
      }
      case 'status':
        const selectedStatus = defaultStatuses.find(s => s.id === value);
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-full justify-start px-3 text-sm font-normal">
                {selectedStatus ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: `hsl(${selectedStatus.color})` }}
                    />
                    {selectedStatus.name}
                  </span>
                ) : 'Select status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {defaultStatuses.map(status => (
                <DropdownMenuItem
                  key={status.id}
                  onClick={() => handleCellChange(rowId, colId, status.id)}
                  className={cn(value === status.id && "bg-accent")}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full mr-2"
                    style={{ backgroundColor: `hsl(${status.color})` }}
                  />
                  {status.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      default:
        return <Input {...inputProps} type="text" placeholder="Enter text..." />;
    }
  };

  return (
    <div className={cn("h-full flex flex-col bg-gradient-to-br transition-colors duration-500", colorConfig.gradient)}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={onFileInputChange}
        accept="*/*"
      />

      <div className={cn(
        "border-b backdrop-blur-md sticky top-0 z-20 transition-colors",
        colorConfig.border,
        colorConfig.light,
        settings.compact_mode ? "p-2 md:p-3" : "p-4 md:p-6"
      )}>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-background/20"
          >
            <Link to="/boards">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div className="flex-1 min-w-0">
            {isEditingBoardName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={boardNameEdit}
                  onChange={(e) => setBoardNameEdit(e.target.value)}
                  className={cn(
                    "font-display font-bold h-auto py-1 bg-background/50 border-primary/20",
                    settings.compact_mode ? "text-lg" : "text-xl md:text-2xl"
                  )}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveBoardName();
                    if (e.key === 'Escape') cancelBoardNameEdit();
                  }}
                />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={saveBoardName}>
                  <Check className="h-4 w-4 text-success" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cancelBoardNameEdit}>
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <h1
                className={cn(
                  "font-display font-bold cursor-pointer hover:opacity-80 transition-all",
                  colorConfig.text,
                  settings.compact_mode ? "text-lg" : "text-xl md:text-2xl"
                )}
                onClick={startEditingBoardName}
                title="Click to edit board name"
              >
                {board.name}
              </h1>
            )}

            {board.description && !isEditingBoardName && (
              <p className="text-sm text-muted-foreground/80 truncate">{board.description}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(board.id)}
            className={cn(
              "transition-colors",
              board.isFavorite ? "text-warning fill-warning" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Star className={cn("h-5 w-5", board.isFavorite && "fill-current")} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className={cn("min-w-max", settings.compact_mode ? "p-2 md:p-3" : "p-4 md:p-6")}>
          <div className={cn("flex border-b sticky top-0 z-10 backdrop-blur-sm rounded-t-xl overflow-hidden", colorConfig.border, "bg-background/40")}>
            <div className={cn(
              "w-12 shrink-0 px-2 border-r flex items-center justify-center",
              settings.compact_mode ? "py-1.5" : "py-3",
              colorConfig.border
            )}>
              <span className="text-xs text-muted-foreground font-medium">#</span>
            </div>

            {board.columns && board.columns.length > 0 ? (
              board.columns.map((column) => {
                const type = getColumnType(column.id);
                const TypeIcon = columnTypeConfig[type]?.icon || Type;
                const isEditing = editingColumnId === column.id;

                return (
                  <div
                    key={column.id}
                    className={cn("w-48 shrink-0 border-r", colorConfig.border)}
                  >
                    <div className={cn(
                      "flex items-center justify-between px-3 group",
                      settings.compact_mode ? "py-1.5" : "py-3"
                    )}>
                      {isEditing ? (
                        <div className="flex items-center gap-1 flex-1">
                          <Input
                            value={editingColumnName}
                            onChange={(e) => setEditingColumnName(e.target.value)}
                            className="h-7 text-sm px-2 bg-background/50"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveColumnName(column.id);
                              if (e.key === 'Escape') cancelEditingColumn();
                            }}
                          />
                        </div>
                      ) : (
                        <span
                          className="font-semibold text-sm truncate cursor-pointer hover:opacity-70 transition-opacity"
                          onClick={() => startEditingColumn(column.id, column.name || 'Untitled')}
                        >
                          {column.name || 'Untitled'}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-40 hover:opacity-100">
                              <TypeIcon className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {availableColumnTypes.map(({ value: typeKey, label }) => {
                              const config = columnTypeConfig[typeKey as ExtendedColumnType];
                              if (!config) return null;
                              return (
                                <DropdownMenuItem
                                  key={typeKey}
                                  onClick={() => handleColumnTypeChange(column.id, typeKey as ExtendedColumnType)}
                                  className={cn(type === typeKey && "bg-accent")}
                                >
                                  <config.icon className="h-4 w-4 mr-2" />
                                  {label}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : null}

            <div className={cn(
              "w-48 shrink-0 px-3",
              settings.compact_mode ? "py-1.5" : "py-3"
            )}>
              <form onSubmit={handleAddColumn} className="flex gap-2">
                <Input
                  placeholder="New column..."
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  className={cn(
                    "bg-background/30 border-transparent focus:border-primary/30",
                    settings.compact_mode ? "h-7 text-xs" : "h-8 text-sm"
                  )}
                />
              </form>
            </div>
          </div>

          <div className={cn("bg-background/20 rounded-b-xl border border-t-0 overflow-hidden shadow-sm", colorConfig.border)}>
            {rows.map((row, rowIndex) => (
              <div key={row.id} className={cn("flex border-b hover:bg-background/30 transition-colors group last:border-0", colorConfig.border)}>
                <div className={cn(
                  "w-12 shrink-0 px-2 border-r flex items-center justify-center relative",
                  settings.compact_mode ? "py-0.5" : "py-1",
                  colorConfig.border
                )}>
                  <span className="text-xs text-muted-foreground/60 group-hover:opacity-0">{rowIndex + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "absolute opacity-0 group-hover:opacity-100 transition-opacity",
                      settings.compact_mode ? "h-5 w-5" : "h-6 w-6"
                    )}
                    onClick={() => handleDeleteRow(row.id)}
                  >
                    <Trash2 className={cn("text-destructive/70 hover:text-destructive", settings.compact_mode ? "h-3 w-3" : "h-3.5 w-3.5")} />
                  </Button>
                </div>

                {board.columns && board.columns.map((column) => (
                  <div
                    key={column.id}
                    className={cn("w-48 shrink-0 border-r last:border-0", colorConfig.border)}
                  >
                    {renderCellInput(row.id, column.id, getColumnType(column.id))}
                  </div>
                ))}

                <div className="w-48 shrink-0" />
              </div>
            ))}

            <button
              onClick={handleAddRow}
              className={cn(
                "w-full text-muted-foreground hover:text-foreground hover:bg-background/40 transition-all flex items-center gap-2 font-medium",
                settings.compact_mode ? "px-3 py-1.5 text-xs" : "px-5 py-3 text-sm"
              )}
            >
              <Plus className={cn(settings.compact_mode ? "h-3.5 w-3.5" : "h-4 w-4")} />
              Add new row
            </button>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
