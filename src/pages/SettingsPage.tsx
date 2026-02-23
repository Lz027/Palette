import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sun, Moon, Monitor, Palette, Bell, Zap, Clock, User, Mail, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import paletteLogo from '@/assets/palette-logo.jpeg';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { settings, profile, updateSettings, updateProfile, isLoading } = useSettings();

  const [profileForm, setProfileForm] = useState({
    display_name: profile.display_name,
    bio: profile.bio,
  });

  // Sync internal form state when profile data is loaded from context
  useEffect(() => {
    setProfileForm({
      display_name: profile.display_name || '',
      bio: profile.bio || '',
    });
  }, [profile]);

  const handleProfileUpdate = async () => {
    await updateProfile(profileForm);
  };

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your Palette experience</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={profileForm.display_name}
              onChange={(e) => setProfileForm(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileForm.bio}
              onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>
          <Button onClick={handleProfileUpdate} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Section */}
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

      {/* Notifications Section */}
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
              onCheckedChange={(checked) => updateSettings({ reminders_enabled: checked })}
              disabled={isLoading}
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
                onChange={(e) => updateSettings({ morning_reminder: e.target.value })}
                className="w-24"
                disabled={!settings.reminders_enabled || isLoading}
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
                onChange={(e) => updateSettings({ evening_reminder: e.target.value })}
                className="w-24"
                disabled={!settings.reminders_enabled || isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
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
              onCheckedChange={(checked) => updateSettings({ compact_mode: checked })}
              disabled={isLoading}
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
              onCheckedChange={(checked) => updateSettings({ quick_capture: checked })}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email Address</p>
              <p className="text-xs text-muted-foreground">{user?.email || 'Not available'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Account Security</p>
              <p className="text-xs text-muted-foreground">Logged in via Supabase Auth</p>
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
            <img
              src={paletteLogo}
              alt="Palette"
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <p className="font-display font-semibold">Palette</p>
              <p className="text-sm text-muted-foreground">
                Version 1.2 · Pro Edition
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Your personal workspace for ideas, tasks, and creative projects.
            Designed for deep focus and effortless workflow management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
