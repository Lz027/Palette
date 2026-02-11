import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { MobileTopBar } from '@/components/layout/MobileTopBar';
import { TopBar } from '@/components/layout/TopBar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

function MobileLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <MobileTopBar />
      <div className="flex flex-1 w-full overflow-hidden">
        <MobileSidebar />
        {/* Added pl-14 for sidebar width + proper padding */}
        <main className="flex-1 overflow-auto p-3 pb-20 pl-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function DesktopLayout() {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <TopBar />
        <div className="flex flex-1 w-full overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-auto p-3 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
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
      <div className={cn("md:hidden", isMobile ? "block" : "hidden")}>
        <MobileLayout />
      </div>
      <div className={cn("hidden md:block", !isMobile ? "block" : "hidden")}>
        <DesktopLayout />
      </div>
    </>
  );
}
