// // 'use client';

// // import React from 'react';
// // import Link from 'next/link';
// // import {
// //   Bell,
// //   Building2,
// //   CalendarDays,
// //   ChevronDown,
// //   Home,
// //   Mic2,
// //   Search,
// //   Users,
// // } from 'lucide-react';

// // const navItems = [
// //   {
// //     label: 'Home',
// //     href: '/dashboard',
// //     icon: Home,
// //   },
// //   {
// //     label: 'Leads',
// //     href: '/dashboard/leads',
// //     icon: Users,
// //   },
// //   {
// //     label: 'Properties',
// //     href: '/dashboard/properties',
// //     icon: Building2,
// //   },
// //   {
// //     label: 'Visits',
// //     href: '/dashboard/visits',
// //     icon: CalendarDays,
// //   },
// //   {
// //     label: 'Voice AI',
// //     href: '/dashboard/voice',
// //     icon: Mic2,
// //   },
// // ];

// // export default function DashboardNavbar() {
// //   return (
// //     <header className="sticky top-0 z-40 w-full bg-[#f8f6f0]/95 px-4 py-4 backdrop-blur-xl lg:px-6">
// //       <div className="flex min-h-[68px] items-center gap-4 rounded-[22px] border border-[#e9e3d5] bg-white px-4 shadow-[0_12px_35px_-25px_rgba(60,50,30,0.25)] lg:px-5">

// //         {/* Logo */}
// //         <Link
// //           href="/dashboard"
// //           className="flex shrink-0 items-center gap-2.5 pr-3"
// //         >
// //           <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14171f] text-[#e9c98a]">
// //             <span className="text-sm font-black">R</span>
// //           </div>

// //           <div className="hidden leading-none sm:block">
// //             <p className="text-[14px] font-bold tracking-tight text-[#14171f]">
// //               Realty AI
// //             </p>
// //             <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.16em] text-[#a3762f]">
// //               Sales Platform
// //             </p>
// //           </div>
// //         </Link>

// //         {/* Divider */}
// //         <div className="hidden h-8 w-px bg-[#eee9df] lg:block" />

// //         {/* Navigation */}
// //         <nav className="hidden items-center gap-1 xl:flex">
// //           {navItems.map((item) => {
// //             const Icon = item.icon;

// //             return (
// //               <Link
// //                 key={item.href}
// //                 href={item.href}
// //                 className="group flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#77736b] transition-all hover:bg-[#f8f4ea] hover:text-[#14171f]"
// //               >
// //                 <Icon
// //                   size={16}
// //                   strokeWidth={1.8}
// //                   className="transition-colors group-hover:text-[#a3762f]"
// //                 />

// //                 {item.label}
// //               </Link>
// //             );
// //           })}
// //         </nav>

// //         {/* Search */}
// //         <div className="ml-auto flex min-w-0 flex-1 justify-end">
// //           <div className="relative w-full max-w-[280px]">
// //             <Search
// //               size={16}
// //               strokeWidth={1.8}
// //               className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a19b91]"
// //             />

// //             <input
// //               type="text"
// //               placeholder="Search leads, properties..."
// //               className="h-10 w-full rounded-xl border border-[#eee9df] bg-[#faf9f6] pl-10 pr-4 text-[12.5px] text-[#14171f] outline-none transition-all placeholder:text-[#aaa59b] focus:border-[#d9c18d] focus:bg-white focus:ring-2 focus:ring-[#e9c98a]/20"
// //             />

// //             <div className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center rounded-md border border-[#e6e1d7] bg-white px-1.5 py-0.5 text-[9px] font-semibold text-[#aaa59b] md:flex">
// //               ⌘ K
// //             </div>
// //           </div>
// //         </div>

// //         {/* Notification */}
// //         <button
// //           type="button"
// //           className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#eee9df] bg-[#faf9f6] text-[#6f6b64] transition-all hover:border-[#dfd5c2] hover:bg-[#f8f4ea] hover:text-[#14171f]"
// //         >
// //           <Bell size={17} strokeWidth={1.8} />

// //           <span className="absolute right-[9px] top-[8px] h-1.5 w-1.5 rounded-full bg-[#b8863f] ring-2 ring-[#faf9f6]" />
// //         </button>

// //         {/* Profile */}
// //         <button
// //           type="button"
// //           className="flex shrink-0 items-center gap-2.5 rounded-xl border border-[#eee9df] bg-[#faf9f6] py-1.5 pl-1.5 pr-2.5 transition-all hover:border-[#dfd5c2] hover:bg-[#f8f4ea]"
// //         >
// //           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#14171f] text-[11px] font-bold text-[#e9c98a]">
// //             VK
// //           </div>

// //           <div className="hidden text-left md:block">
// //             <p className="text-[12px] font-semibold leading-none text-[#14171f]">
// //               Vikas
// //             </p>
// //             <p className="mt-1 text-[10px] text-[#969188]">
// //               Admin
// //             </p>
// //           </div>

// //           <ChevronDown
// //             size={14}
// //             className="hidden text-[#969188] md:block"
// //           />
// //         </button>
// //       </div>
// //     </header>
// //   );
// // }
// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import {
//   Bell,
//   ChevronDown,
//   Home,
//   Search,
// } from 'lucide-react';

// export default function DashboardNavbar() {
//   return (
//     <header className="sticky top-0 z-40 px-4 pt-2 lg:px-6">
//       <div className="flex h-[74px] items-center gap-4 rounded-[24px] border border-[#e9e1d2] bg-white px-5 shadow-[0_12px_35px_-28px_rgba(60,50,30,0.35)]">

//         {/* Home */}
//         <Link
//           href="/dashboard"
//           className="group flex h-11 shrink-0 items-center gap-2.5 rounded-xl px-3 text-[#6f6b64] transition-all hover:bg-[#f8f4ea] hover:text-[#14171f]"
//         >
//           <Home
//             size={18}
//             strokeWidth={1.8}
//             className="transition-colors group-hover:text-[#a3762f]"
//           />

//           <span className="text-[13px] font-semibold">
//             Home
//           </span>
//         </Link>

//         {/* Divider */}
//         <div className="h-8 w-px bg-[#eee8dd]" />

//         {/* Search */}
//         <div className="flex flex-1 justify-center">
//           <div className="relative w-full max-w-[620px]">
//             <Search
//               size={18}
//               strokeWidth={1.8}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa399]"
//             />

//             <input
//               type="text"
//               placeholder="Search leads, properties, conversations..."
//               className="
//                 h-12 w-full
//                 rounded-[15px]
//                 border border-[#e9e3d8]
//                 bg-[#faf9f6]
//                 pl-11 pr-20
//                 text-[13px]
//                 font-medium
//                 text-[#14171f]
//                 outline-none
//                 transition-all
//                 placeholder:text-[#aaa59c]
//                 focus:border-[#d8bc82]
//                 focus:bg-white
//                 focus:ring-4
//                 focus:ring-[#e9c98a]/10
//               "
//             />

//             {/* Keyboard shortcut */}
//             <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center rounded-lg border border-[#e4ded3] bg-white px-2 py-1 text-[10px] font-semibold text-[#aaa399]">
//               ⌘ K
//             </div>
//           </div>
//         </div>

//         {/* Right actions */}
//         <div className="flex shrink-0 items-center gap-2">

//           {/* Notification */}
//           <button
//             type="button"
//             className="
//               relative flex h-11 w-11
//               items-center justify-center
//               rounded-xl
//               border border-[#e9e3d8]
//               bg-[#faf9f6]
//               text-[#777269]
//               transition-all
//               hover:border-[#dcd1bc]
//               hover:bg-[#f8f4ea]
//               hover:text-[#14171f]
//             "
//           >
//             <Bell size={18} strokeWidth={1.8} />

//             {/* Notification dot */}
//             <span className="absolute right-[9px] top-[8px] h-[6px] w-[6px] rounded-full bg-[#b8863f] ring-2 ring-[#faf9f6]" />
//           </button>

//           {/* Profile */}
//           <button
//             type="button"
//             className="
//               flex h-11 items-center gap-2.5
//               rounded-xl
//               border border-[#e9e3d8]
//               bg-[#faf9f6]
//               pl-1.5 pr-3
//               transition-all
//               hover:border-[#dcd1bc]
//               hover:bg-[#f8f4ea]
//             "
//           >
//             {/* Avatar */}
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#14171f] text-[11px] font-bold text-[#e9c98a]">
//               VK
//             </div>

//             {/* User info */}
//             <div className="hidden text-left sm:block">
//               <p className="text-[12px] font-bold leading-none text-[#14171f]">
//                 Vikas
//               </p>

//               <p className="mt-1 text-[10px] font-medium text-[#99938a]">
//                 Admin
//               </p>
//             </div>

//             <ChevronDown
//               size={14}
//               strokeWidth={1.8}
//               className="text-[#99938a]"
//             />
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bell,
  ChevronDown,
  Home,
  Search,
} from 'lucide-react';

export default function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-3 lg:px-6">
      <div className="flex h-[82px] items-center gap-5 rounded-[26px] border border-[#e8e0d1] bg-white px-6 shadow-[0_12px_35px_-25px_rgba(60,50,30,0.28)]">

        {/* Home */}
        <Link
          href="/dashboard"
          className="
            group flex h-12 shrink-0 items-center gap-3
            rounded-xl px-4
            text-[#68645d]
            transition-all
            hover:bg-[#f8f4ea]
            hover:text-[#14171f]
          "
        >
          <Home
            size={21}
            strokeWidth={1.8}
            className="group-hover:text-[#a3762f]"
          />

          <span className="text-[15px] font-semibold">
            Home
          </span>
        </Link>

        {/* Divider */}
        <div className="h-9 w-px bg-[#eae4d9]" />

        {/* Search */}
        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-[680px]">
            <Search
              size={20}
              strokeWidth={1.8}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#969087]"
            />

            <input
              type="text"
              placeholder="Search leads, properties, conversations..."
              className="
                h-[52px] w-full
                rounded-[16px]
                border border-[#e6dfd3]
                bg-[#faf9f6]
                pl-12 pr-20
                text-[14px]
                font-medium
                text-[#14171f]
                outline-none
                transition-all
                placeholder:text-[#969087]
                focus:border-[#d5b876]
                focus:bg-white
                focus:ring-4
                focus:ring-[#e9c98a]/10
              "
            />

            {/* Shortcut */}
            <div
              className="
                absolute right-3 top-1/2
                flex -translate-y-1/2
                items-center
                rounded-lg
                border border-[#e2dcd1]
                bg-white
                px-2.5 py-1.5
                text-[11px]
                font-semibold
                text-[#969087]
              "
            >
              ⌘ K
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-3">

          {/* Notification */}
          <button
            type="button"
            className="
              relative flex h-12 w-12
              items-center justify-center
              rounded-xl
              border border-[#e6dfd3]
              bg-[#faf9f6]
              text-[#68645d]
              transition-all
              hover:border-[#d8cdbb]
              hover:bg-[#f8f4ea]
              hover:text-[#14171f]
            "
          >
            <Bell
              size={20}
              strokeWidth={1.8}
            />

            <span
              className="
                absolute right-[9px] top-[8px]
                h-[7px] w-[7px]
                rounded-full
                bg-[#b8863f]
                ring-2 ring-[#faf9f6]
              "
            />
          </button>

          {/* Profile */}
          <button
            type="button"
            className="
              flex h-12 items-center gap-3
              rounded-xl
              border border-[#e6dfd3]
              bg-[#faf9f6]
              pl-1.5 pr-3.5
              transition-all
              hover:border-[#d8cdbb]
              hover:bg-[#f8f4ea]
            "
          >
            {/* Avatar */}
            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-[10px]
                bg-[#14171f]
                text-[12px]
                font-bold
                text-[#e9c98a]
              "
            >
              VK
            </div>

            {/* Details */}
            <div className="hidden text-left sm:block">
              <p className="text-[14px] font-bold leading-none text-[#14171f]">
                Vikas
              </p>

              <p className="mt-1.5 text-[11px] font-medium text-[#8f8a81]">
                Admin
              </p>
            </div>

            <ChevronDown
              size={16}
              strokeWidth={1.8}
              className="text-[#8f8a81]"
            />
          </button>
        </div>
      </div>
    </header>
  );
}