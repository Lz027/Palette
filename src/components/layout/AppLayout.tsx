import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { MobileTopBar } from '@/components/layout/MobileTopBar';
import { TopBar } from '@/components/layout/TopBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

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
          <main className="flex-1 overflow-auto p-3 pb-20 pl-14">
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
            <main className="flex-1 overflow-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
