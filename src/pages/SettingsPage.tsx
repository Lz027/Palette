import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sun, Moon, Monitor, Palette, Bell, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [compactMode, setCompactMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [quickCapture, setQuickCapture] = React.useState(true);

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your experience</p>
      </div>

      {/* Appearance */}
      <Card className="glass-card">
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

      {/* Preferences */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Preferences</CardTitle>
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
              checked={compactMode}
              onCheckedChange={setCompactMode}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifications" className="font-medium flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive updates and reminders
              </p>
            </div>
            <Switch 
              id="notifications" 
              checked={notifications}
              onCheckedChange={setNotifications}
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
                Show quick capture on dashboard
              </p>
            </div>
            <Switch 
              id="quickcapture" 
              checked={quickCapture}
              onCheckedChange={setQuickCapture}
            />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="glass-card">
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
