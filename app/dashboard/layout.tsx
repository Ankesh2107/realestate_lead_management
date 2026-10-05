'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import DashboardNavbar from '@/components/dashboard/ui/DashboardNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer automatically whenever the route changes (tapping a
  // nav link should navigate AND close the drawer, not leave it open).
  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#f8f6f0]">
      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <main className="min-w-0 flex-1">
        <DashboardNavbar onMenuClick={() => setMobileNavOpen(true)} />

        <div className="px-3 pb-8 sm:px-4 lg:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
