import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBoards } from '@/contexts/BoardContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LogOut, Camera, FolderKanban, Calendar, Loader2, Save, ImagePlus, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { displayNameSchema, bioSchema, validateInput, INPUT_LIMITS } from '@/lib/validation';
import { supabase } from '@/integrations/supabase/client';

export default function ProfilePage() {
  const { user, logout, uploadAvatar } = useAuth();
  const { boards } = useBoards();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isBannerUploading, setIsBannerUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  // Load profile data
  const loadProfileData = async () => {
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('display_name, bio, avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (profile) {
        setDisplayName((profile.display_name || user.name || '').slice(0, INPUT_LIMITS.DISPLAY_NAME));
        setBio((profile.bio || '').slice(0, INPUT_LIMITS.BIO));
      } else {
        setDisplayName((user.name || '').slice(0, INPUT_LIMITS.DISPLAY_NAME));
        setBio('');
      }

      // Load banner
      const { data: bannerFiles } = await supabase.storage
        .from('banners')
        .list(user.id, { limit: 1, sortBy: { column: 'created_at', order: 'desc' } });

      if (bannerFiles && bannerFiles.length > 0) {
        const { data: { publicUrl } } = supabase.storage
          .from('banners')
          .getPublicUrl(`${user.id}/${bannerFiles[0].name}`);
        setBannerUrl(publicUrl);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [user]);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const totalCards = boards.reduce((acc, b) => 
    acc + b.columns.reduce((colAcc, c) => colAcc + c.cards.length, 0), 0
  );

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleBannerClick = () => {
    bannerInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadAvatar(file);
      if (url) {
        toast.success('Profile picture updated!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsBannerUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      setBannerUrl(publicUrl);
      toast.success('Banner updated!');
    } catch (error) {
      console.error('Banner upload error:', error);
      toast.error('Failed to upload banner');
    } finally {
      setIsBannerUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    const nameValidation = validateInput(displayNameSchema, displayName);
    if (!nameValidation.success) {
      toast.error('error' in nameValidation ? nameValidation.error : 'Invalid display name');
      return;
    }
    
    const bioValidation = validateInput(bioSchema, bio);
    if (!bioValidation.success) {
      toast.error('error' in bioValidation ? bioValidation.error : 'Invalid bio');
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: nameValidation.data,
          bio: bioValidation.data,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Profile saved!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reload saved values instead of resetting
    loadProfileData();
    setIsEditing(false);
  };

  const handleStartEdit = async () => {
    // Reload fresh data before editing
    await loadProfileData();
    setIsEditing(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      {/* Banner & Avatar */}
      <div className="relative">
        <div 
          className={cn(
            "relative w-full h-32 sm:h-48 rounded-xl overflow-hidden cursor-pointer group",
            !bannerUrl && "bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30"
          )}
          onClick={handleBannerClick}
        >
          {bannerUrl && (
            <img src={bannerUrl} alt="Profile banner" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isBannerUploading ? (
              <Loader2 className="h-8 w-8 text-foreground animate-spin" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-foreground">
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs font-medium">Change Banner</span>
              </div>
            )}
          </div>
          <input ref={bannerInputRef} type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-4 sm:left-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <button 
              onClick={handleAvatarClick}
              disabled={isUploading}
              className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
            >
              {isUploading ? <Loader2 className="h-6 w-6 text-foreground animate-spin" /> : <Camera className="h-6 w-6 text-foreground" />}
            </button>
            <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        </div>
      </div>

      {/* Profile Info - Name left, Edit button far right */}
      <div className="pt-14 px-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">{displayName || user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            {bio && !isEditing && <p className="text-sm text-muted-foreground mt-2 max-w-md">{bio}</p>}
          </div>
          
          {/* Edit Profile button - far right */}
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleStartEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveProfile} disabled={isSaving} className="gradient-primary text-primary-foreground">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Form - Only visible when editing */}
      {isEditing && (
        <Card className="glass-card">
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value.slice(0, INPUT_LIMITS.DISPLAY_NAME))} maxLength={INPUT_LIMITS.DISPLAY_NAME} className="mt-1" placeholder="Your name" />
                <p className="text-xs text-muted-foreground mt-1">{displayName.length}/{INPUT_LIMITS.DISPLAY_NAME}</p>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email} disabled className="mt-1 bg-muted" />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value.slice(0, INPUT_LIMITS.BIO))} maxLength={INPUT_LIMITS.BIO} placeholder="Tell us about yourself..." className="mt-1 min-h-[100px]" />
              <p className="text-xs text-muted-foreground mt-1">{bio.length}/{INPUT_LIMITS.BIO}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="font-display text-lg">Your Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50"><p className="text-2xl font-bold text-primary">{boards.length}</p><p className="text-xs text-muted-foreground">Workspaces</p></div>
            <div className="text-center p-4 rounded-lg bg-muted/50"><p className="text-2xl font-bold text-secondary">{totalCards}</p><p className="text-xs text-muted-foreground">Cards</p></div>
            <div className="text-center p-4 rounded-lg bg-muted/50"><p className="text-2xl font-bold text-accent">{boards.filter(b => b.isFavorite).length}</p><p className="text-xs text-muted-foreground">Favorites</p></div>
            <div className="text-center p-4 rounded-lg bg-muted/50"><p className="text-2xl font-bold text-board-rose">{boards.reduce((acc, b) => acc + b.columns.length, 0)}</p><p className="text-xs text-muted-foreground">Columns</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Log Out */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div><p className="font-medium text-destructive">Log Out</p><p className="text-sm text-muted-foreground">Log out of your account</p></div>
            <Button variant="destructive" onClick={logout}><LogOut className="h-4 w-4 mr-2" />Log Out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
