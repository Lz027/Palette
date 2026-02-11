import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  uploadAvatar: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  uploadAvatar: async () => null,
});

// Demo accounts
const DEMO_USERS = [
  { email: 'student@exam.com', password: 'exam2024', name: 'Exam Student' },
  { email: 'ahmed@palette.app', password: 'palette123', name: 'Ahmed Baghni' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser({
        id: 'user-' + Date.now(),
        name: foundUser.name,
        email: foundUser.email,
      });
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const uploadAvatar = async (): Promise<string | null> => {
    return null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user, 
      login, 
      logout,
      uploadAvatar,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
