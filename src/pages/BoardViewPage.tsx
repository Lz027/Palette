import React, { useState, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Plus, Trash2, Type, Hash, Calendar, Paperclip, Link as LinkIcon, Check, X, CheckSquare, Upload, FileIcon, Loader2 } from 'lucide-react';
import { useBoards } from '@/contexts/BoardContext';
import { useFocus, defaultStatuses } from '@/contexts/FocusContext';
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

export default function BoardViewPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const { boards, toggleFavorite, addColumn, deleteColumn, updateColumn } = useBoards();
  const { focusMode, getColumnTypes } = useFocus();
  
  const board = boards.find(b => b.id === boardId);

  // DEBUG: Log board data
  console.log('=== BOARD DEBUG ===');
  console.log('Board ID:', boardId);
  console.log('Board found:', !!board);
  console.log('Board data:', board);
  console.log('Board columns:', board?.columns);
  console.log('Columns count:', board?.columns?.length);
  console.log('First column:', board?.columns?.[0]);
  
  const [newColumnName, setNewColumnName] = useState('');
  const [rows, setRows] = useState<{ id: string; cells: Record<string, string> }[]>([
    { id: '1', cells: {} },
  ]);
  const [columnTypes, setColumnTypes] = useState<Record<string, ExtendedColumnType>>({});
  const [editingCell, setEditingCell] = useState<{ rowId: string; colId: string } | null>(null);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnName, setEditingColumnName] = useState('');
  const [uploadingCell, setUploadingCell] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFileCell, setPendingFileCell] = useState<{ rowId: string; colId: string } | null>(null);

  if (!board) {
    console.log('Board not found, redirecting...');
    return <Navigate to="/boards" replace />;
  }

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    console.log('Adding column:', newColumnName);
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
      
      console.log('Uploading file:', filePath);
      
      const { error: uploadError } = await supabase.storage
        .from('board-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

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
      className: "h-9 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent",
    };
    
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [boardNameEdit, setBoardNameEdit] = useState(board.name);
  const { updateBoard } = useBoards();

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

  // ... then in the JSX, replace the header div:

  <div className="p-4 md:p-6 border-b border-border bg-card">
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="icon" 
        asChild
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
              className="font-display text-xl md:text-2xl font-bold h-auto py-1"
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
            className="font-display text-xl md:text-2xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
            onClick={startEditingBoardName}
            title="Click to edit board name"
          >
            {board.name}
          </h1>
        )}
        
        {board.description && !isEditingBoardName && (
          <p className="text-sm text-muted-foreground truncate">{board.description}</p>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => toggleFavorite(board.id)}
        className={cn(
          board.isFavorite ? "text-warning" : "text-muted-foreground"
        )}
      >
        <Star className={cn("h-5 w-5", board.isFavorite && "fill-current")} />
      </Button>
    </div>
  </div>

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
        } catch {}
        
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
    <div className="h-full flex flex-col -m-3 md:-m-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={onFileInputChange}
        accept="*/*"
      />
      <div className="p-4 md:p-6 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
          >
            <Link to="/boards">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">
              {board.name}
            </h1>
            {board.description && (
              <p className="text-sm text-muted-foreground truncate">{board.description}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(board.id)}
            className={cn(
              board.isFavorite ? "text-warning" : "text-muted-foreground"
            )}
          >
            <Star className={cn("h-5 w-5", board.isFavorite && "fill-current")} />
          </Button>
        </div>
      </div>

      {/* Spreadsheet View */}
      <ScrollArea className="flex-1">
        <div className="min-w-max">
          {/* Header Row */}
          <div className="flex border-b border-border bg-muted/30 sticky top-0 z-10">
            {/* Row number column */}
            <div className="w-12 shrink-0 px-2 py-2 border-r border-border flex items-center justify-center">
              <span className="text-xs text-muted-foreground">#</span>
            </div>
            
            {/* Existing columns */}
            {board.columns && board.columns.length > 0 ? (
              board.columns.map((column) => {
                const type = getColumnType(column.id);
                const TypeIcon = columnTypeConfig[type]?.icon || Type;
                const isEditing = editingColumnId === column.id;
                
                return (
                  <div 
                    key={column.id}
                    className="w-48 shrink-0 border-r border-border"
                  >
                    <div className="flex items-center justify-between px-3 py-2 group">
                      {isEditing ? (
                        <div className="flex items-center gap-1 flex-1">
                          <Input
                            value={editingColumnName}
                            onChange={(e) => setEditingColumnName(e.target.value)}
                            className="h-6 text-sm px-1"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveColumnName(column.id);
                              if (e.key === 'Escape') cancelEditingColumn();
                            }}
                          />
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => saveColumnName(column.id)}>
                            <Check className="h-3 w-3 text-success" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={cancelEditingColumn}>
                            <X className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ) : (
                        <span 
                          className="font-medium text-sm truncate cursor-pointer hover:text-primary"
                          onClick={() => startEditingColumn(column.id, column.title || column.name || 'Untitled')}
                          title="Click to edit"
                        >
                          {column.title || column.name || 'Untitled'}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-60 hover:opacity-100">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-60 hover:opacity-100"
                          onClick={() => deleteColumn(board.id, column.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-48 shrink-0 px-3 py-2 text-muted-foreground text-sm">
                No columns yet. Add one →
              </div>
            )}

            {/* Add Column */}
            <div className="w-48 shrink-0 px-2 py-2">
              <form onSubmit={handleAddColumn} className="flex gap-1">
                <Input
                  placeholder="New column..."
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  className="h-7 text-sm"
                />
                {newColumnName && (
                  <Button type="submit" size="icon" className="h-7 w-7 shrink-0">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                )}
              </form>
            </div>
          </div>

          {/* Data Rows */}
          {rows.map((row, rowIndex) => (
            <div key={row.id} className="flex border-b border-border hover:bg-muted/20 group">
              {/* Row number */}
              <div className="w-12 shrink-0 px-2 py-1 border-r border-border flex items-center justify-center relative">
                <span className="text-xs text-muted-foreground group-hover:opacity-0">{rowIndex + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 absolute opacity-0 group-hover:opacity-100"
                  onClick={() => handleDeleteRow(row.id)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              
              {/* Cells */}
              {board.columns && board.columns.map((column) => (
                <div 
                  key={column.id}
                  className="w-48 shrink-0 border-r border-border"
                >
                  {renderCellInput(row.id, column.id, getColumnType(column.id))}
                </div>
              ))}

              {/* Empty cell for add column space */}
              <div className="w-48 shrink-0" />
            </div>
          ))}

          {/* Add Row Button */}
          <div className="flex border-b border-border">
            <button
              onClick={handleAddRow}
              className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add row
            </button>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
