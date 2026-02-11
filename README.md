# Palette Exam Version

---

📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Authentication System](#authentication-system)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Code Documentation](#code-documentation)
- [Performance Considerations](#performance-considerations)
- [Security Measures](#security-measures)
- [Future Roadmap](#future-roadmap)
- [License](#license)

---

🎯 Overview

Palette is an AI-enhanced productivity application designed to help users manage tasks, organize ideas, and leverage artificial intelligence for content generation. The exam version demonstrates core functionality including user authentication, real-time data synchronization, and a responsive mobile-first interface.

Key Objectives:
- Provide seamless task management with AI assistance
- Demonstrate full-stack development capabilities
- Implement secure authentication flows
- Showcase modern UI/UX design principles

---

✨ Features

Core Functionality

| Feature             | Description                                          | Status        |
| :------------------ | :--------------------------------------------------- | :------------ |
| User Authentication | Secure login via Google OAuth 2.0 and GitHub OAuth   | ✅ Implemented |
| Task Management     | Create, edit, delete, and organize tasks with categories | ✅ Implemented |
| AI Integration      | AI-powered content generation and task suggestions   | ✅ Implemented |
| Real-time Sync      | Live database synchronization via Supabase           | ✅ Implemented |
| Responsive Design   | Mobile-optimized interface with touch gestures       | ✅ Implemented |
| Dark/Light Mode     | Theme switching with persistent preferences          | ✅ Implemented |

Authentication Features
- OAuth 2.0 Integration: Secure third-party authentication
- Session Management: JWT-based session handling with automatic refresh
- Protected Routes: Route guards for authenticated content
- User Profiles: Persistent user data and preferences

---

🛠 Tech Stack

Frontend
- Framework: React 18+ with TypeScript
- Build Tool: Vite 5.x
- Styling: Tailwind CSS 3.x
- UI Components: shadcn/ui component library
- State Management: React Hooks + Context API
- Routing: React Router v6

Backend & Infrastructure
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth (OAuth 2.0)
- Storage: Supabase Storage for user assets
- Hosting: Vercel Edge Network
- API: RESTful API with Supabase client

Development Tools
- Language: TypeScript 5.x
- Linting: ESLint with TypeScript rules
- Formatting: Prettier
- Version Control: Git

---

🏗 Architecture

System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  Auth State  │  │  API Client  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/WSS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Platform                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Auth (GoTrue)│  │ PostgreSQL   │  │   Storage    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

Data Flow
1. Authentication Flow: OAuth provider → Supabase Auth → JWT Session → Protected Routes
2. Data Operations: User Action → Supabase Client → PostgreSQL → Real-time Subscription → UI Update
3. AI Integration: User Input → API Route → External AI Service → Response → UI Render

---

📁 Project Structure

```
palette/
├── public/                     # Static assets
│   ├── icon.png               # App icon (512x512)
│   ├── favicon.ico            # Browser favicon
│   └── manifest.json          # PWA manifest
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── auth/             # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── OAuthButtons.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   └── features/         # Feature-specific components
│   │       ├── TaskList.tsx
│   │       ├── TaskItem.tsx
│   │       └── AIAssistant.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts        # Authentication state management
│   │   ├── useTasks.ts       # Task data operations
│   │   └── useTheme.ts       # Theme preference management
│   ├── lib/                  # Utility functions & configurations
│   │   ├── supabase.ts       # Supabase client configuration
│   │   ├── utils.ts          # Helper functions
│   │   └── constants.ts      # App constants
│   ├── pages/                # Route pages
│   │   ├── Login.tsx         # Authentication page
│   │   ├── Dashboard.tsx     # Main app interface
│   │   ├── Profile.tsx       # User settings
│   │   └── NotFound.tsx      # 404 page
│   ├── types/                # TypeScript type definitions
│   │   ├── auth.ts           # Authentication types
│   │   ├── task.ts           # Task entity types
│   │   └── index.ts          # Type exports
│   ├── context/              # React context providers
│   │   └── AuthContext.tsx   # Global auth state
│   ├── styles/               # Global styles
│   │   └── globals.css       # Tailwind imports + custom CSS
│   │   └── main.tsx              # Application entry point
├── supabase/                 # Supabase configurations
│   ├── migrations/           # Database migrations
│   └── functions/            # Edge functions (if any)
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── index.html               # HTML entry point
├── package.json             # Dependencies & scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

---

🔐 Authentication System

OAuth Configuration

The application supports multiple OAuth providers through Supabase Auth:

Google OAuth 2.0 Setup

```typescript
// Configuration in Supabase Dashboard
{
  provider: 'google',
  client_id: process.env.VITE_GOOGLE_CLIENT_ID,
  redirect_uri: `${window.location.origin}/auth/callback`,
  scopes: ['email', 'profile']
}
```

GitHub OAuth Setup

```typescript
// Configuration in Supabase Dashboard
{
  provider: 'github',
  client_id: process.env.VITE_GITHUB_CLIENT_ID,
  redirect_uri: `${window.location.origin}/auth/callback`,
  scopes: ['read:user', 'user:email']
}
```

Authentication Flow

```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Real-time auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOAuth = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, session, loading, signInWithOAuth, signOut };
};
```

Protected Route Implementation

```typescript
// src/components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
```

---

🗄 Database Schema

Tables

1. Profiles (User Data Extension)

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  theme_preference TEXT DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);
```

2. Boards (User Workspaces)

```sql
CREATE TABLE public.boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT 'coral',
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own boards" 
  ON public.boards FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create boards" 
  ON public.boards FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boards" 
  ON public.boards FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boards" 
  ON public.boards FOR DELETE 
  USING (auth.uid() = user_id);
```

3. Columns (Board Columns)

```sql
CREATE TABLE public.columns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.columns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view columns on their boards" 
  ON public.columns FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.boards WHERE id = board_id AND user_id = auth.uid()));

CREATE POLICY "Users can manage columns on their boards" 
  ON public.columns FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.boards WHERE id = board_id AND user_id = auth.uid()));
```

4. Cards (Column Items)

```sql
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  column_id UUID REFERENCES public.columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  order_index INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view cards on their boards" 
  ON public.cards FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.columns WHERE id = column_id AND EXISTS (SELECT 1 FROM public.boards WHERE id = board_id AND user_id = auth.uid())));

CREATE POLICY "Users can manage cards on their boards" 
  ON public.cards FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.columns WHERE id = column_id AND EXISTS (SELECT 1 FROM public.boards WHERE id = board_id AND user_id = auth.uid())));
```

---

⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file:

`VITE_SUPABASE_URL`
`VITE_SUPABASE_ANON_KEY`
`VITE_GOOGLE_CLIENT_ID`
`VITE_GITHUB_CLIENT_ID`

Example `.env.example`:

```
VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
VITE_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
VITE_GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID"
```

---

🚀 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Lz027/project-palette.git
   cd project-palette
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or yarn install
   # or pnpm install
   ```

3. **Set up Supabase**
   - Create a new project on [Supabase](https://supabase.com/).
   - Configure Google and GitHub OAuth providers in your Supabase project settings.
   - Copy your Supabase URL and Anon Key.
   - Apply the provided SQL schema (from `supabase/migrations/*.sql`) to your Supabase database.

4. **Configure environment variables**
   - Create a `.env.local` file in the root of your project.
   - Add your Supabase URL, Anon Key, Google Client ID, and GitHub Client ID to this file (refer to `Environment Variables` section).

5. **Run the development server**

   ```bash
   npm run dev
   # or yarn dev
   # or pnpm dev
   ```

   The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

---

💡 Usage Guide

- **Authentication**: Log in using your Google or GitHub account. Demo accounts are also available for quick testing (see `src/contexts/AuthContext.tsx`).
- **Dashboard**: View recent and favorite boards. Access quick tools based on your selected focus mode (Tech, Design, Productive).
- **Board Management**: Create new boards, organize tasks into columns, and move cards between columns.
- **Quick Capture**: Quickly add new tasks or ideas to your boards.
- **Focus Modes**: Switch between 'Tech', 'Design', and 'Productive' modes to customize your dashboard tools and color scheme.

---

📄 Code Documentation

- **`src/contexts/AuthContext.tsx`**: Manages user authentication state, including login, logout, and user session handling. Currently uses demo accounts for local testing and integrates with Supabase for OAuth.
- **`src/contexts/BoardContext.tsx`**: Handles board, column, and card data management, including creation, updates, deletions, and real-time synchronization (via local storage for now, but designed for Supabase integration).
- **`src/contexts/FocusContext.tsx`**: Manages the application's focus modes (Tech, Design, Productive), dynamically adjusting the UI theme and available tools.
- **`src/integrations/supabase/client.ts`**: Initializes the Supabase client with the project URL and public key, configuring authentication persistence.
- **`src/components/features/QuickCapture.tsx`**: A component for rapidly adding new cards to selected boards and columns.
- **`src/components/features/FocusToolsPanel.tsx`**: Displays a curated list of external tools relevant to the current focus mode.

---

⚡ Performance Considerations

- **Lazy Loading**: Components and routes are designed for lazy loading to reduce initial bundle size.
- **State Management**: Optimized React Context usage to prevent unnecessary re-renders.
- **Real-time Updates**: Leveraging Supabase's real-time capabilities for efficient data synchronization.

---

🔒 Security Measures

- **OAuth 2.0**: Secure authentication via trusted third-party providers.
- **Row Level Security (RLS)**: Supabase RLS policies ensure users can only access and modify their own data.
- **Environment Variables**: Sensitive API keys are stored as environment variables and not exposed in the client-side code.

---

🛣️ Future Roadmap

- **Full Supabase Integration**: Transition `BoardContext` from local storage to full Supabase backend for persistent data.
- **AI Assistant Enhancements**: Expand AI capabilities for more sophisticated content generation and task automation.
- **Customizable Dashboards**: Allow users to personalize their dashboard layout and tool selection.
- **Collaboration Features**: Enable real-time collaboration on boards and tasks with other users.
- **Mobile Application**: Develop native mobile applications using React Native.

---

© License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---