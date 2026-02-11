import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import paletteLogo from '@/assets/palette-logo.jpeg';

export default function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    
    if (!success) {
      setError('Invalid email or password. Try: student@exam.com / exam2024');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={paletteLogo} 
            alt="PALETTE" 
            className="w-24 h-24 rounded-full mx-auto shadow-2xl object-cover"
          />
          <h1 className="font-display text-3xl font-bold mt-4">PALETTE</h1>
          <p className="text-muted-foreground text-sm">Your creative productivity space</p>
        </div>

        {/* Login Card */}
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/30 p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@exam.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button 
              type="submit"
              className="w-full h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo accounts:</p>
            <p>student@exam.com / exam2024</p>
            <p>ahmed@palette.app / palette123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
