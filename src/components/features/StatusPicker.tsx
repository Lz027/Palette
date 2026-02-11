import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CircleDot, Plus, Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { z } from 'zod';
import { safeParseLocalStorage, safeSetLocalStorage } from '@/lib/safe-storage';

// Schema for validating status data from localStorage
const statusSchema = z.object({
  id: z.string(),
  name: z.string().max(30),
  color: z.string(),
});

const statusArraySchema = z.array(statusSchema);

interface Status {
  id: string;
  name: string;
  color: string;
}

const defaultStatuses: Status[] = [
  { id: 'available', name: 'Available', color: '158 55% 48%' },
  { id: 'busy', name: 'Busy', color: '0 65% 55%' },
  { id: 'away', name: 'Away', color: '45 85% 55%' },
  { id: 'dnd', name: 'Do Not Disturb', color: '280 50% 60%' },
];

const STORAGE_KEY_STATUSES = 'palette-user-statuses';
const STORAGE_KEY_CURRENT = 'palette-current-status';

interface StatusPickerProps {
  className?: string;
}

export function StatusPicker({ className }: StatusPickerProps) {
  const [statuses, setStatuses] = useState<Status[]>(() => {
    return safeParseLocalStorage(STORAGE_KEY_STATUSES, statusArraySchema, defaultStatuses) as Status[];
  });
  const [currentStatus, setCurrentStatus] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_CURRENT) || 'available';
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newStatus, setNewStatus] = useState({ name: '', color: '220 70% 60%' });

  const saveStatuses = (newStatuses: Status[]) => {
    setStatuses(newStatuses);
    safeSetLocalStorage(STORAGE_KEY_STATUSES, newStatuses);
  };

  const saveCurrentStatus = (statusId: string) => {
    setCurrentStatus(statusId);
    localStorage.setItem('palette-current-status', statusId);
  };

  const addStatus = () => {
    if (!newStatus.name.trim()) {
      toast.error('Please enter a status name');
      return;
    }

    const status: Status = {
      id: Date.now().toString(),
      name: newStatus.name.trim().slice(0, 30),
      color: newStatus.color,
    };
    saveStatuses([...statuses, status]);
    setNewStatus({ name: '', color: '220 70% 60%' });
    setIsAdding(false);
    toast.success('Status added!');
  };

  const deleteStatus = (id: string) => {
    if (statuses.length <= 1) {
      toast.error('Must have at least one status');
      return;
    }
    const newStatuses = statuses.filter(s => s.id !== id);
    saveStatuses(newStatuses);
    if (currentStatus === id) {
      saveCurrentStatus(newStatuses[0].id);
    }
    toast.success('Status deleted');
  };

  const selectStatus = (id: string) => {
    saveCurrentStatus(id);
    const status = statuses.find(s => s.id === id);
    toast.success(`Status set to ${status?.name}`);
  };

  const colorOptions = [
    { label: 'Green', value: '158 55% 48%' },
    { label: 'Red', value: '0 65% 55%' },
    { label: 'Yellow', value: '45 85% 55%' },
    { label: 'Purple', value: '280 50% 60%' },
    { label: 'Blue', value: '220 70% 60%' },
    { label: 'Pink', value: '340 60% 60%' },
  ];

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <CircleDot className="h-4 w-4" />
            Your Status
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
              placeholder="Status name"
              value={newStatus.name}
              onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value.slice(0, 30) })}
              maxLength={30}
              className="h-8 text-sm"
            />
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setNewStatus({ ...newStatus, color: color.value })}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all",
                    newStatus.color === color.value ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: `hsl(${color.value})` }}
                  title={color.label}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={addStatus} className="h-7">Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="h-7">Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {statuses.map((status) => (
            <div
              key={status.id}
              className={cn(
                "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors group",
                currentStatus === status.id ? "bg-primary/10" : "bg-muted/50 hover:bg-muted"
              )}
              onClick={() => selectStatus(status.id)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `hsl(${status.color})` }}
                />
                <span className="text-sm">{status.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {currentStatus === status.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStatus(status.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
