// import React from 'react';
// import { Sidebar } from '@/components/dashboard/Sidebar';

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-screen bg-bg">
//       <Sidebar />
//       <main className="max-w-[1400px] flex-1 p-7 md:p-9">{children}</main>
//     </div>
//   );
// }


import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import DashboardNavbar from '@/components/dashboard/ui/DashboardNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
  
<div className="flex min-h-screen bg-[#f8f6f0]">
  <Sidebar />

  <main className="min-w-0 flex-1">
    <DashboardNavbar/>

    <div className="px-4 pb-8 lg:px-6">
      {children}
    </div>
  </main>
</div>
  );
}

