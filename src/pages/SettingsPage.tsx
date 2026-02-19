import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Sun, Moon, Monitor, Palette, Bell, Zap, Clock, User, Mail, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserSettings {
  compact_mode: boolean;
  quick_capture: boolean;
  morning_reminder: string;
  evening_reminder: string;
  reminders_enabled: boolean;
}

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    compact_mode: false,
    quick_capture: true,
    morning_reminder: '09:00',
    evening_reminder: '17:00',
    reminders_enabled: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
      return;
    }

    if (data) {
      setSettings(data);
    }
  };

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    if (!user) return;
    
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    setIsLoading(true);
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        ...newSettings,
        updated_at: new Date().toISOString(),
      });

    setIsLoading(false);
    
    if (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to save settings');
      return;
    }
    
    toast.success('Settings saved');
  };

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <div className="text-center">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your Palette experience</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>Choose your preferred theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(option => {
              const Icon = option.icon;
              const isActive = theme === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setTheme(option.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                    isActive 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Icon className={cn(
                    "h-6 w-6",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications & Reminders
          </CardTitle>
          <CardDescription>Set up your daily reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="reminders_enabled" className="font-medium flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Enable Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive daily notifications for your tasks
              </p>
            </div>
            <Switch 
              id="reminders_enabled" 
              checked={settings.reminders_enabled}
              onCheckedChange={(checked) => updateSetting('reminders_enabled', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Morning Reminder
                </Label>
                <p className="text-sm text-muted-foreground">
                  Start your day with your priorities
                </p>
              </div>
              <Input
                type="time"
                value={settings.morning_reminder}
                onChange={(e) => updateSetting('morning_reminder', e.target.value)}
                className="w-24"
                disabled={!settings.reminders_enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Evening Reminder
                </Label>
                <p className="text-sm text-muted-foreground">
                  Review your day's progress
                </p>
              </div>
              <Input
                type="time"
                value={settings.evening_reminder}
                onChange={(e) => updateSetting('evening_reminder', e.target.value)}
                className="w-24"
                disabled={!settings.reminders_enabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Preferences
          </CardTitle>
          <CardDescription>Customize your workflow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="compact" className="font-medium">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">
                Show more content with less spacing
              </p>
            </div>
            <Switch 
              id="compact" 
              checked={settings.compact_mode}
              onCheckedChange={(checked) => updateSetting('compact_mode', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="quickcapture" className="font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Capture
              </Label>
              <p className="text-sm text-muted-foreground">
                Show quick capture widget on dashboard
              </p>
            </div>
            <Switch 
              id="quickcapture" 
              checked={settings.quick_capture}
              onCheckedChange={(checked) => updateSetting('quick_capture', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-xs text-muted-foreground">{user?.email || 'Not available'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Account Status</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">About Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <div>
              <p className="font-display font-semibold text-gradient">Palette v1.0</p>
              <p className="text-sm text-muted-foreground">
                Paint your productivity canvas
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Palette is a beautiful, colorful project management app that gives you the freedom to create your perfect workspace. Choose from unique templates, customize with vibrant colors, and stay productive in style.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
