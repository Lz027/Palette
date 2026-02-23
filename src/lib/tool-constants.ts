import { FocusMode } from '@/contexts/FocusContext';

export interface Tool {
    id: string;
    name: string;
    logo: string;
    url: string;
    category: string;
}

export const fallbackTechTools: Tool[] = [
    { id: 'base-44', name: 'Base 44', logo: 'https://base44.com/favicon.ico', url: 'https://base44.com', category: 'AI Builder' },
    { id: 'cursor', name: 'Cursor', logo: 'https://www.cursor.com/favicon.ico', url: 'https://cursor.com', category: 'AI Editor' },
    { id: 'genspark', name: 'Genspark', logo: 'https://www.genspark.ai/favicon.ico', url: 'https://www.genspark.ai', category: 'AI Search' },
    { id: 'github', name: 'GitHub', logo: 'https://github.githubassets.com/favicons/favicon.svg', url: 'https://github.com', category: 'Git' },
    { id: 'kimi', name: 'Kimi', logo: 'https://kimi.ai/favicon.ico', url: 'https://kimi.ai', category: 'AI Agent' },
    { id: 'lovable', name: 'Lovable', logo: 'https://lovable.dev/favicon.ico', url: 'https://lovable.dev', category: 'AI Builder' },
    { id: 'manus', name: 'Manus', logo: 'https://manus.im/favicon.svg', url: 'https://manus.im', category: 'AI Agent' },
    { id: 'replit', name: 'Replit', logo: 'https://cdn.replit.com/dotcom/favicon.ico', url: 'https://replit.com', category: 'AI Builder' },
    { id: 'supabase', name: 'Supabase', logo: 'https://supabase.com/favicon/favicon-32x32.png', url: 'https://supabase.com', category: 'Database' },
    { id: 'v0', name: 'v0.dev', logo: 'https://v0.dev/icon-dark.svg', url: 'https://v0.dev', category: 'AI Builder' },
    { id: 'vercel', name: 'Vercel', logo: 'https://vercel.com/favicon.ico', url: 'https://vercel.com', category: 'Deploy' },
];

export const fallbackDesignTools: Tool[] = [
    { id: 'blender', name: 'Blender', logo: 'https://www.blender.org/favicon.ico', url: 'https://blender.org', category: '3D' },
    { id: 'canva', name: 'Canva', logo: 'https://static.canva.com/static/images/favicon-1.ico', url: 'https://canva.com', category: 'Design' },
    { id: 'figma', name: 'Figma', logo: 'https://static.figma.com/app/icon/1/favicon.png', url: 'https://figma.com', category: 'Design' },
    { id: 'ideogram', name: 'Ideogram', logo: 'https://ideogram.ai/favicon.ico', url: 'https://ideogram.ai', category: 'AI Image' },
    { id: 'leonardo', name: 'Leonardo AI', logo: 'https://leonardo.ai/favicon.ico', url: 'https://leonardo.ai', category: 'AI Image' },
    { id: 'midjourney', name: 'Midjourney', logo: 'https://www.midjourney.com/favicon.ico', url: 'https://midjourney.com', category: 'AI Image' },
    { id: 'photopea', name: 'Photopea', logo: 'https://www.photopea.com/promo/icon512.png', url: 'https://photopea.com', category: 'Editor' },
    { id: 'remove-bg', name: 'Remove.bg', logo: 'https://www.remove.bg/favicon.ico', url: 'https://remove.bg', category: 'Editor' },
];

export const fallbackProductivityTools: Tool[] = [
    { id: 'airtable', name: 'Airtable', logo: 'https://airtable.com/favicon.ico', url: 'https://airtable.com', category: 'Database' },
    { id: 'linear', name: 'Linear', logo: 'https://linear.app/favicon.ico', url: 'https://linear.app', category: 'Project' },
    { id: 'loom', name: 'Loom', logo: 'https://cdn.loom.com/assets/favicons-loom/favicon.ico', url: 'https://loom.com', category: 'Video' },
    { id: 'poe', name: 'Poe AI', logo: 'https://poe.com/favicon.ico', url: 'https://poe.com', category: 'AI Chat' },
    { id: 'slack', name: 'Slack', logo: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png', url: 'https://slack.com', category: 'Chat' },
    { id: 'tldraw', name: 'Tldraw', logo: 'https://www.tldraw.com/favicon.ico', url: 'https://www.tldraw.com', category: 'Whiteboard' },
    { id: 'todoist', name: 'Todoist', logo: 'https://todoist.com/favicon.ico', url: 'https://todoist.com', category: 'Tasks' },
];

export const getFallbackTools = (mode: FocusMode): Tool[] => {
    switch (mode) {
        case 'tech': return fallbackTechTools;
        case 'design': return fallbackDesignTools;
        case 'productive': return fallbackProductivityTools;
        default: return fallbackProductivityTools;
    }
};
