import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { MobileTopBar } from '@/components/layout/MobileTopBar';
import { TopBar } from '@/components/layout/TopBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  // Reminder System
  React.useEffect(() => {
    if (!settings.reminders_enabled || !isAuthenticated) return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      if (currentTime === settings.morning_reminder) {
        toast.info("Good morning! Ready to tackle your priorities?", {
          description: "Check your 'Productive' board for today's tasks.",
          duration: 10000,
        });
      } else if (currentTime === settings.evening_reminder) {
        toast.info("Evening review time!", {
          description: "Don't forget to mark your daily achievements as done.",
          duration: 10000,
        });
      }
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [settings.reminders_enabled, settings.morning_reminder, settings.evening_reminder, isAuthenticated]);

  if (!isAuthenticated && !isAuthPage) {
    return null;
  }

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <>
      {/* MOBILE - Only shows below md breakpoint */}
      <div className="flex md:hidden min-h-screen flex-col w-full bg-background">
        <MobileTopBar />
        <div className="flex flex-1 w-full overflow-hidden">
          <MobileSidebar />
          <main className={cn(
            "flex-1 overflow-auto transition-all duration-300",
            settings.compact_mode ? "p-2 pb-16 pl-12" : "p-3 pb-20 pl-14"
          )}>
            <Outlet />
          </main>
        </div>
      </div>

      {/* DESKTOP - Only shows at md and above */}
      <SidebarProvider defaultOpen>
        <div className="hidden md:flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className={cn(
              "flex-1 overflow-auto transition-all duration-300",
              settings.compact_mode ? "p-3 md:p-4" : "p-6"
            )}>
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
