// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { ArrowUpRight, Building2, ClipboardList, Flame, PhoneCall, Sparkles, Users } from 'lucide-react';
// import { StatCard } from '@/components/dashboard/ui/StatCard';
// import { statusBadgeClass, tempBadgeClass } from '@/lib/dashboard/styles';
// import { useOverviewStats } from '@/hooks/useOverviewStats';

// export default function DashboardHome() {
//   const { stats, loading } = useOverviewStats();

//   const coldLeads = Math.max(stats.totalLeads - stats.hotLeads - stats.warmLeads, 0);
//   const total = Math.max(stats.totalLeads, 1);

//   return (
//     <div>
//       {/* Hero */}
//       <div className="mb-6 grid grid-cols-1 gap-5 overflow-hidden rounded-3xl border border-border bg-surface shadow-lg md:grid-cols-[1.3fr_1fr]">
//         <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
//           <span className="w-fit rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
//             AI Sales Agent · Live
//           </span>
//           <h1 className="text-[30px] font-bold leading-tight tracking-tight text-ink">
//             Welcome back 👋 <br /> here&apos;s your pipeline today.
//           </h1>
//           <p className="max-w-md text-sm leading-relaxed text-muted">
//             Realty AI is chatting, qualifying and scheduling site visits across WhatsApp, Instagram, Facebook and Voice —
//             all in real time.
//           </p>
//           <div className="mt-2 flex flex-wrap gap-3">
//             <Link
//               href="/dashboard/voice"
//               className="flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
//             >
//               <PhoneCall size={16} /> Start a test call
//             </Link>
//             <Link
//               href="/dashboard/leads"
//               className="flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-alt"
//             >
//               <Users size={16} /> View leads
//             </Link>
//           </div>
//         </div>

//         {/* Property photo panel — drop a photo at /public/property-hero.jpg to replace the gradient */}
//         <div
//           className="relative hidden min-h-[220px] md:block"
//           style={{
//             backgroundImage:
//               "linear-gradient(135deg, rgba(47,111,237,0.55), rgba(124,92,255,0.55)), url('/property-hero.jpg')",
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//           }}
//         >
//           <div className="absolute inset-0 flex items-end p-6">
//             <div className="flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
//               <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-soft text-violet">
//                 <Building2 size={18} />
//               </div>
//               <div>
//                 <p className="text-xs font-bold text-ink">{loading ? '—' : stats.totalProperties} Properties</p>
//                 <p className="text-[11px] text-faint">Live in the catalog</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stat cards */}
//       <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
//         <StatCard label="Total Leads" value={loading ? '—' : stats.totalLeads} icon={<Users size={16} />} tint="blue" />
//         <StatCard label="Hot Leads" value={loading ? '—' : stats.hotLeads} icon={<Flame size={16} />} tint="amber" />
//         <StatCard label="Properties Listed" value={loading ? '—' : stats.totalProperties} icon={<Building2 size={16} />} tint="violet" />
//         <StatCard
//           label="Pending Ops"
//           value={loading ? '—' : stats.pendingVisits + stats.pendingEscalations}
//           icon={<ClipboardList size={16} />}
//           tint="green"
//         />
//       </div>

//       <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
//         {/* Recent leads */}
//         <div className="rounded-2xl border border-border bg-surface p-5 shadow-md md:p-6">
//           <div className="mb-4 flex items-center justify-between">
//             <h2 className="text-base font-bold text-ink">Recent Leads</h2>
//             <Link href="/dashboard/leads" className="flex items-center gap-1 text-[13px] font-semibold text-primary">
//               View all <ArrowUpRight size={14} />
//             </Link>
//           </div>

//           {loading ? (
//             <p className="text-[13px] text-muted">Loading...</p>
//           ) : stats.recentLeads.length === 0 ? (
//             <p className="text-[13px] text-muted">
//               No leads yet — once WhatsApp, Instagram or Facebook messages come in, they&apos;ll show up here.
//             </p>
//           ) : (
//             <div className="flex flex-col">
//               {stats.recentLeads.map((l, idx) => (
//                 <div
//                   key={l.id}
//                   className={`flex items-center justify-between py-3 ${idx === 0 ? '' : 'border-t border-border-soft'}`}
//                 >
//                   <div>
//                     <p className="text-sm font-semibold text-ink">{l.name || l.external_user_id}</p>
//                     <p className="mt-0.5 text-xs capitalize text-faint">
//                       {l.channel} · {l.intent || 'unknown intent'}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className={tempBadgeClass(l.temperature)}>{l.temperature}</span>
//                     <span className={statusBadgeClass(l.status)}>{l.status}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Right column */}
//         <div className="flex flex-col gap-4">
//           <div className="rounded-2xl bg-ink p-5 text-white shadow-lg md:p-6">
//             <Sparkles size={20} className="mb-2.5 opacity-90" />
//             <p className="mb-3.5 text-[15px] font-semibold leading-relaxed">
//               Talk to Realty AI live — hear how it qualifies a lead in Hindi or English before it ever reaches a real
//               customer.
//             </p>
//             <Link
//               href="/dashboard/voice"
//               className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-[13px] font-semibold hover:bg-white/15"
//             >
//               Open Voice Agent <ArrowUpRight size={14} />
//             </Link>
//           </div>

//           <div className="rounded-2xl border border-border bg-surface p-5 shadow-md md:p-6">
//             <h2 className="mb-3.5 text-sm font-bold text-ink">Lead Temperature</h2>
//             <div className="mb-3.5 flex h-2.5 overflow-hidden rounded-md">
//               <div className="bg-danger" style={{ width: `${(stats.hotLeads / total) * 100}%` }} />
//               <div className="bg-warning" style={{ width: `${(stats.warmLeads / total) * 100}%` }} />
//               <div className="bg-primary" style={{ width: `${(coldLeads / total) * 100}%` }} />
//             </div>
//             <div className="flex flex-col gap-2 text-[12.5px]">
//               <LegendRow dotClass="bg-danger" label="Hot" value={stats.hotLeads} />
//               <LegendRow dotClass="bg-warning" label="Warm" value={stats.warmLeads} />
//               <LegendRow dotClass="bg-primary" label="Cold" value={coldLeads} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function LegendRow({ dotClass, label, value }: { dotClass: string; label: string; value: number }) {
//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-2">
//         <span className={`h-2 w-2 rounded-full ${dotClass}`} />
//         <span className="text-muted">{label}</span>
//       </div>
//       <span className="font-bold text-ink">{value}</span>
//     </div>
//   );
// }

'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Building2,
  ClipboardList,
  Flame,
  PhoneCall,
  Sparkles,
  Users,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/ui/StatCard';
import { statusBadgeClass, tempBadgeClass } from '@/lib/dashboard/styles';
import { useOverviewStats } from '@/hooks/useOverviewStats';

export default function DashboardHome() {
  const { stats, loading } = useOverviewStats();

  const coldLeads = Math.max(
    stats.totalLeads - stats.hotLeads - stats.warmLeads,
    0
  );

  const total = Math.max(stats.totalLeads, 1);

  return (
    <div>
      {/* Hero */}
      <div
        className="mb-6 grid mt-4 grid-cols-1 gap-0 overflow-hidden rounded-[32px] border border-[#ece4d0] bg-white md:grid-cols-[1.3fr_1fr]"
        style={{
          boxShadow: '0 30px 60px -30px rgba(120,95,40,0.14)',
        }}
      >
        {/* Hero Content */}
        <div className="flex flex-col  justify-center gap-4 p-8 md:p-10">
          <span className="w-fit rounded-full bg-[#f4eee0] px-3 py-1 text-xs font-bold text-[#a3762f]">
            AI Sales Agent · Live
          </span>

          <h1 className="text-[30px] font-bold leading-tight tracking-tight text-ink">
            Welcome back 👋
            <br />
            here&apos;s your pipeline today.
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-muted">
            Realty AI is chatting, qualifying and scheduling site visits
            across WhatsApp, Instagram, Facebook and Voice — all in real time.
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href="/dashboard/voice"
              className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold bg-[#1e1c1c] text-white transition-transform hover:scale-[1.02]"
              style={{
              
              }}
            >
              <PhoneCall size={16} />
              Start a test call
            </Link>

            <Link
              href="/dashboard/leads"
              className="flex items-center gap-2 rounded-full  border-2 border-[#e8e1cf] bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-[#dcb673]/60"
            >
              <Users size={16} />
              View leads
            </Link>
          </div>
        </div>

        {/* Property Image */}
        <div className="relative hidden min-h-[320px] overflow-hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1723110994499-df46435aa4b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D"
            alt="Modern luxury property"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Subtle overlay only — no colorful gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/10" />

          {/* Properties Badge */}
          <div className="absolute bottom-6 left-6">
            <div className="flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4eee0] text-[#a3762f]">
                <Building2 size={18} />
              </div>

              <div>
                <p className="text-xs font-bold text-ink">
                  {loading ? '—' : `${stats.totalProperties}+ Properties`}
                </p>
                <p className="text-[11px] text-faint">
                  Live in the catalog
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Leads"
          value={loading ? '—' : stats.totalLeads}
          icon={<Users size={16} />}
          tint="blue"
        />

        <StatCard
          label="Hot Leads"
          value={loading ? '—' : stats.hotLeads}
          icon={<Flame size={16} />}
          tint="amber"
        />

        <StatCard
          label="Properties Listed"
          value={loading ? '—' : stats.totalProperties}
          icon={<Building2 size={16} />}
          tint="violet"
        />

        <StatCard
          label="Pending Ops"
          value={
            loading
              ? '—'
              : stats.pendingVisits + stats.pendingEscalations
          }
          icon={<ClipboardList size={16} />}
          tint="green"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
        {/* Recent leads */}
        <div
          className="rounded-[28px] border border-[#ece4d0] bg-white p-6"
          style={{
            boxShadow:
              '0 30px 60px -30px rgba(120,95,40,0.1)',
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">
              Recent Leads
            </h2>

            <Link
              href="/dashboard/leads"
              className="flex items-center gap-1 text-[13px] font-semibold text-[#a3762f]"
            >
              View all
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {loading ? (
            <p className="text-[13px] text-muted">Loading...</p>
          ) : stats.recentLeads.length === 0 ? (
            <p className="text-[13px] text-muted">
              No leads yet — once WhatsApp, Instagram or Facebook
              messages come in, they&apos;ll show up here.
            </p>
          ) : (
            <div className="flex flex-col">
              {stats.recentLeads.map((l, idx) => (
                <div
                  key={l.id}
                  className={`flex items-center justify-between py-3 ${
                    idx === 0
                      ? ''
                      : 'border-t border-[#f0ede4]'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {l.name || l.external_user_id}
                    </p>

                    <p className="mt-0.5 text-xs capitalize text-faint">
                      {l.channel} · {l.intent || 'unknown intent'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={tempBadgeClass(l.temperature)}
                    >
                      {l.temperature}
                    </span>

                    <span
                      className={statusBadgeClass(l.status)}
                    >
                      {l.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Voice Agent */}
          <div className="rounded-[28px] bg-ink p-6 text-white shadow-lg">
            <Sparkles
              size={20}
              className="mb-2.5 text-[#e9c98a]"
            />

            <p className="mb-3.5 text-[15px] font-semibold leading-relaxed">
              Talk to Realty AI live — hear how it qualifies a
              lead in Hindi or English before it ever reaches a
              real customer.
            </p>

            <Link
              href="/dashboard/voice"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-[13px] font-semibold hover:bg-white/15"
            >
              Open Voice Agent
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Lead Temperature */}
          <div
            className="rounded-[28px] border border-[#ece4d0] bg-white p-6"
            style={{
              boxShadow:
                '0 30px 60px -30px rgba(120,95,40,0.1)',
            }}
          >
            <h2 className="mb-3.5 text-sm font-bold text-ink">
              Lead Temperature
            </h2>

            <div className="mb-3.5 flex h-2.5 overflow-hidden rounded-md bg-[#f4eee0]">
              <div
                className="bg-danger"
                style={{
                  width: `${(stats.hotLeads / total) * 100}%`,
                }}
              />

              <div
                className="bg-warning"
                style={{
                  width: `${(stats.warmLeads / total) * 100}%`,
                }}
              />

              <div
                style={{
                  width: `${(coldLeads / total) * 100}%`,
                  background: '#b8863f',
                }}
              />
            </div>

            <div className="flex flex-col gap-2 text-[12.5px]">
              <LegendRow
                dotClass="bg-danger"
                label="Hot"
                value={stats.hotLeads}
              />

              <LegendRow
                dotClass="bg-warning"
                label="Warm"
                value={stats.warmLeads}
              />

              <LegendRow
                dotStyle={{ background: '#b8863f' }}
                label="Cold"
                value={coldLeads}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendRow({
  dotClass,
  dotStyle,
  label,
  value,
}: {
  dotClass?: string;
  dotStyle?: React.CSSProperties;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${dotClass || ''}`}
          style={dotStyle}
        />
        <span className="text-muted">{label}</span>
      </div>

      <span className="font-bold text-ink">{value}</span>
    </div>
  );
}