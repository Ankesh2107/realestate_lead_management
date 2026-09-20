// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Building2, ClipboardList, LayoutGrid, PhoneCall, Sparkles, Users } from 'lucide-react';
// import { useHealthCheck } from '@/hooks/useHealthCheck';

// const NAV_ITEMS = [
//   { href: '/dashboard', label: 'Home', icon: LayoutGrid, exact: true },
//   { href: '/dashboard/voice', label: 'Voice Agent', icon: PhoneCall },
//   { href: '/dashboard/leads', label: 'Leads CRM', icon: Users },
//   { href: '/dashboard/properties', label: 'Properties', icon: Building2 },
//   { href: '/dashboard/ops', label: 'Ops & Escalations', icon: ClipboardList },
// ];

// export function Sidebar() {
//   const pathname = usePathname();
//   const { health } = useHealthCheck();

//   return (
//     // sticky + h-screen (not min-h-screen) is what stops it scrolling away with the page
//     <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-border bg-sidebar p-4">
//       {/* Logo */}
//       <div className="flex items-center gap-2.5 px-2 py-1">
//         <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink shadow-sm">
//           <Sparkles size={17} className="text-white" />
//         </div>
//         <span className="text-[17px] font-bold tracking-tight text-ink">Realty AI</span>
//       </div>

//       {/* Nav */}
//       <nav className="flex flex-col gap-1.5">
//         {NAV_ITEMS.map((item) => {
//           const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
//           const Icon = item.icon;
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={[
//                 'group flex items-center gap-3 rounded-2xl px-2.5 py-2 text-sm transition-all',
//                 active
//                   ? 'bg-ink font-semibold text-white shadow-md'
//                   : 'font-medium text-muted hover:bg-black/[0.04]',
//               ].join(' ')}
//             >
//               <span
//                 className={[
//                   'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
//                   active ? 'bg-white/15 text-white' : 'bg-surface text-muted shadow-sm group-hover:text-ink',
//                 ].join(' ')}
//               >
//                 <Icon size={16} />
//               </span>
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Bottom cards */}
//       <div className="mt-auto flex flex-col gap-2.5">
//         <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-3.5 shadow-sm">
//           <span className="text-[10.5px] font-bold uppercase tracking-wide text-faint">System Status</span>
//           <div className="flex items-center gap-2">
//             <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${health.dbOk ? 'bg-success' : 'bg-danger'}`} />
//             <span className="text-xs text-muted">Supabase DB</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${health.geminiOk ? 'bg-success' : 'bg-danger'}`} />
//             <span className="text-xs text-muted">Gemini AI Engine</span>
//           </div>
//         </div>

//         <div className="rounded-2xl border border-border bg-surface p-3.5 shadow-sm">
//           <p className="mb-1 text-xs font-bold text-ink">Skyline Realty</p>
//           <p className="text-[11.5px] leading-relaxed text-faint">
//             Multilingual AI sales agent across WhatsApp, Instagram, Facebook &amp; Voice.
//           </p>
//         </div>
//       </div>
//     </aside>
//   );
// }
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, ClipboardList, LayoutGrid, PhoneCall, Sparkles, Users } from 'lucide-react';
import { useHealthCheck } from '@/hooks/useHealthCheck';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: LayoutGrid, exact: true },
  { href: '/dashboard/voice', label: 'Voice Agent', icon: PhoneCall },
  { href: '/dashboard/leads', label: 'Leads CRM', icon: Users },
  { href: '/dashboard/properties', label: 'Properties', icon: Building2 },
  { href: '/dashboard/ops', label: 'Ops & Escalations', icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();
  const { health } = useHealthCheck();

  return (
    <aside
      className="sticky top-0 flex h-screen w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-white/[0.06] p-4"
      style={{ background: 'linear-gradient(180deg, #16171c 0%, #1b1c22 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 py-1">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-2xl shadow-md"
          style={{ background: 'linear-gradient(135deg, #d4af6a, #b8863f)' }}
        >
          <Sparkles size={17} className="text-[#16171c]" />
        </div>
        <span className="text-[17px] font-bold tracking-tight text-white">Realty AI</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'group flex items-center gap-3 rounded-2xl px-2.5 py-2 text-sm transition-all',
                active
                  ? 'font-semibold text-[#16171c] shadow-lg'
                  : 'font-medium text-white/55 hover:bg-white/[0.05] hover:text-white/85',
              ].join(' ')}
              style={active ? { background: 'linear-gradient(135deg, #e9c98a, #c9a15c)' } : undefined}
            >
              <span
                className={[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
                  active ? 'bg-black/10 text-[#16171c]' : 'bg-white/[0.06] text-white/50 group-hover:text-white/80',
                ].join(' ')}
              >
                <Icon size={16} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom cards */}
      <div className="mt-auto flex flex-col gap-2.5">
        <div className="flex flex-col gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5">
          <span className="text-[10.5px] font-bold uppercase tracking-wide text-white/35">System Status</span>
          <div className="flex items-center gap-2">
            <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${health.dbOk ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className="text-xs text-white/55">Supabase DB</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${health.geminiOk ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className="text-xs text-white/55">Gemini AI Engine</span>
          </div>
        </div>

        <div
          className="rounded-2xl border border-white/[0.07] p-3.5"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,106,0.12), rgba(184,134,63,0.06))' }}
        >
          <p className="mb-1 text-xs font-bold text-[#e9c98a]">Skyline Realty</p>
          <p className="text-[11.5px] leading-relaxed text-white/45">
            Multilingual AI sales agent across WhatsApp, Instagram, Facebook &amp; Voice.
          </p>
        </div>
      </div>
    </aside>
  );
}