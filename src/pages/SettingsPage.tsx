import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface UserSettings {
    compact_mode: boolean;
    quick_capture: boolean;
    reminders_enabled: boolean;
    morning_reminder: string;
    evening_reminder: string;
    openai_key_encrypted?: string;
    gemini_key_encrypted?: string;
    claude_key_encrypted?: string;
    ai_enabled: boolean;
}

interface UserProfile {
    display_name: string;
    bio: string;
    avatar_url: string;
    email: string;
}

interface SettingsContextType {
    settings: UserSettings;
    profile: UserProfile;
    isLoading: boolean;
    updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const defaultSettings: UserSettings = {
    compact_mode: false,
    quick_capture: true,
    reminders_enabled: true,
    morning_reminder: '09:00',
    evening_reminder: '17:00',
    ai_enabled: false,
};

const defaultProfile: UserProfile = {
    display_name: '',
    bio: '',
    avatar_url: '',
    email: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [settings, setSettings] = useState<UserSettings>(defaultSettings);
    const [profile, setProfile] = useState<UserProfile>(defaultProfile);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSettings = async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            // Fetch user settings
            const { data: settingsData, error: settingsError } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (settingsError) throw settingsError;
            if (settingsData) {
                setSettings({
                    compact_mode: settingsData.compact_mode ?? defaultSettings.compact_mode,
                    quick_capture: settingsData.quick_capture ?? defaultSettings.quick_capture,
                    reminders_enabled: settingsData.reminders_enabled ?? defaultSettings.reminders_enabled,
                    morning_reminder: settingsData.morning_reminder ?? defaultSettings.morning_reminder,
                    evening_reminder: settingsData.evening_reminder ?? defaultSettings.evening_reminder,
                    openai_key_encrypted: settingsData.openai_key_encrypted,
                    gemini_key_encrypted: settingsData.gemini_key_encrypted,
                    claude_key_encrypted: settingsData.claude_key_encrypted,
                    ai_enabled: settingsData.ai_enabled ?? defaultSettings.ai_enabled,
                });
            }

            // Fetch user profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (profileError) throw profileError;
            if (profileData) {
                setProfile({
                    display_name: profileData.display_name ?? '',
                    bio: profileData.bio ?? '',
                    avatar_url: profileData.avatar_url ?? '',
                    email: profileData.email ?? user.email ?? '',
                });
            }
        } catch (error) {
            console.error('Error fetching settings/profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [user]);

    const updateSettings = async (updates: Partial<UserSettings>) => {
        if (!user) return;

        try {
            const newSettings = { ...settings, ...updates };

            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    ...newSettings,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id'
                });

            if (error) throw error;
            setSettings(newSettings);
            toast.success('Settings updated');
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error('Failed to update settings');
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user) return;

        try {
            const newProfile = { ...profile, ...updates };

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    user_id: user.id,
                    display_name: newProfile.display_name,
                    bio: newProfile.bio,
                    avatar_url: newProfile.avatar_url,
                    email: newProfile.email,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id'
                });

            if (error) throw error;
            setProfile(newProfile);
            toast.success('Profile updated');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            profile,
            isLoading,
            updateSettings,
            updateProfile,
            refreshSettings: fetchSettings
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
