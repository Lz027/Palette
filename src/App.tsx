import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BoardProvider } from "@/contexts/BoardContext";
import { FocusProvider } from "@/contexts/FocusContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import BoardsPage from "@/pages/BoardsPage";
import NewBoardPage from "@/pages/NewBoardPage";
import BoardViewPage from "@/pages/BoardViewPage";
import FavoritesPage from "@/pages/FavoritesPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <FocusProvider>
          <BoardProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Auth callback - handles OAuth redirects */}
                  <Route path="/auth/callback" element={<Navigate to="/dashboard" replace />} />
                  
                  {/* Protected routes with layout */}
                  <Route element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/boards" element={<BoardsPage />} />
                    <Route path="/boards/new" element={<NewBoardPage />} />
                    <Route path="/boards/:boardId" element={<BoardViewPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>

                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </BoardProvider>
        </FocusProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
