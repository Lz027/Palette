import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FocusMode, useFocus } from '@/contexts/FocusContext';
import { Tool, getFallbackTools } from '@/lib/tool-constants';

export function useFocusTools() {
    const { focusMode } = useFocus();
    const [tools, setTools] = useState<Tool[]>(getFallbackTools(focusMode));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchTools() {
            try {
                setLoading(true);
                const { data, error: supabaseError } = await supabase
                    .from('focus_tools')
                    .select('*')
                    .eq('focus_mode', focusMode)
                    .order('name');

                if (supabaseError) throw supabaseError;

                if (data && data.length > 0) {
                    const mappedTools: Tool[] = data.map(t => ({
                        id: t.id,
                        name: t.name,
                        logo: t.logo_url,
                        url: t.url,
                        category: t.category
                    }));
                    setTools(mappedTools);
                } else {
                    // If table is empty, use fallbacks
                    setTools(getFallbackTools(focusMode));
                }
            } catch (err) {
                console.error('Error fetching tools from Supabase:', err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
                // Keep using fallback tools on error
                setTools(getFallbackTools(focusMode));
            } finally {
                setLoading(false);
            }
        }

        fetchTools();
    }, [focusMode]);

    return { tools, loading, error };
}
