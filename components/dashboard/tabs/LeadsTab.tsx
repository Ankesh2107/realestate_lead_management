// // // import React from 'react';
// // // import { RefreshCw, Users } from 'lucide-react';
// // // import { iconBtnClass, panelClass, statusBadgeClass, tableClass, tempBadgeClass } from '@/lib/dashboard/styles';
// // // import { Lead } from '@/types/dashboard';

// // // const th = 'border-b border-border px-3 pb-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-faint';
// // // const td = 'border-b border-border-soft px-3 py-3.5 text-ink';

// // // export function LeadsTab({
// // //   leads,
// // //   loadingLeads,
// // //   fetchLeads,
// // // }: {
// // //   leads: Lead[];
// // //   loadingLeads: boolean;
// // //   fetchLeads: () => void;
// // // }) {
// // //   return (
// // //     <div className={panelClass}>
// // //       <div className="mb-4 flex items-center justify-between">
// // //         <h2 className="text-base font-bold text-ink">Leads Directory</h2>
// // //         <button onClick={fetchLeads} className={iconBtnClass}>
// // //           <RefreshCw size={14} /> Refresh
// // //         </button>
// // //       </div>
// // //       {loadingLeads ? (
// // //         <p className="text-[13px] text-muted">Loading leads...</p>
// // //       ) : leads.length === 0 ? (
// // //         <div className="flex flex-col items-center gap-2.5 py-12 text-faint">
// // //           <Users size={28} />
// // //           <p className="text-[13px]">No leads yet.</p>
// // //         </div>
// // //       ) : (
// // //         <div className="overflow-x-auto">
// // //           <table className={tableClass}>
// // //             <thead>
// // //               <tr>
// // //                 <th className={th}>Name / ID</th>
// // //                 <th className={th}>Channel</th>
// // //                 <th className={th}>Intent</th>
// // //                 <th className={th}>Budget</th>
// // //                 <th className={th}>Locations</th>
// // //                 <th className={th}>Status</th>
// // //                 <th className={th}>Temp</th>
// // //                 <th className={th}>Score</th>
// // //                 <th className={th}>Last Active</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {leads.map((l) => (
// // //                 <tr key={l.id}>
// // //                   <td className={`${td} font-semibold`}>{l.name || l.external_user_id}</td>
// // //                   <td className={`${td} capitalize`}>{l.channel}</td>
// // //                   <td className={td}>{l.intent || '—'}</td>
// // //                   <td className={td}>{l.budget_max ? `₹${(l.budget_max / 100000).toFixed(1)}L` : '—'}</td>
// // //                   <td className={td}>{(l.preferred_locations || []).join(', ') || '—'}</td>
// // //                   <td className={td}>
// // //                     <span className={statusBadgeClass(l.status)}>{l.status}</span>
// // //                   </td>
// // //                   <td className={td}>
// // //                     <span className={tempBadgeClass(l.temperature)}>{l.temperature}</span>
// // //                   </td>
// // //                   <td className={`${td} font-bold`}>{l.lead_score ?? 0}</td>
// // //                   <td className={`${td} text-xs text-faint`}>{new Date(l.updated_at).toLocaleString()}</td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // 'use client';

// // import React, { useMemo, useState } from 'react';
// // import { RefreshCw, Search, SlidersHorizontal, Users, X } from 'lucide-react';
// // import { Lead } from '@/types/dashboard';
// // import { LeadDetailPanel } from './LeadsDetailPanel';

// // const STATUS_OPTIONS = ['all', 'new', 'contacted', 'qualified', 'negotiating', 'closed', 'lost'] as const;
// // const TEMP_OPTIONS = ['all', 'hot', 'warm', 'cold'] as const;
// // const CHANNEL_OPTIONS = ['all', 'whatsapp', 'instagram', 'messenger', 'voice'] as const;

// // function statusBadge(status: string) {
// //   const map: Record<string, string> = {
// //     new: 'bg-blue-400/10 text-blue-300 border-blue-400/20',
// //     contacted: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
// //     qualified: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
// //     negotiating: 'bg-[#e9c98a]/10 text-[#e9c98a] border-[#e9c98a]/20',
// //     closed: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
// //     lost: 'bg-red-400/10 text-red-300 border-red-400/20',
// //   };
// //   return `inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${
// //     map[status] || 'bg-white/[0.05] text-white/50 border-white/10'
// //   }`;
// // }

// // function tempBadge(temp: string) {
// //   const map: Record<string, string> = {
// //     hot: 'bg-red-400/10 text-red-300 border-red-400/20',
// //     warm: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
// //     cold: 'bg-sky-400/10 text-sky-300 border-sky-400/20',
// //   };
// //   return `inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${
// //     map[temp] || 'bg-white/[0.05] text-white/50 border-white/10'
// //   }`;
// // }

// // export function LeadsTab({
// //   leads,
// //   loadingLeads,
// //   fetchLeads,
// // }: {
// //   leads: Lead[];
// //   loadingLeads: boolean;
// //   fetchLeads: () => void;
// // }) {
// //   const [search, setSearch] = useState('');
// //   const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>('all');
// //   const [temp, setTemp] = useState<(typeof TEMP_OPTIONS)[number]>('all');
// //   const [channel, setChannel] = useState<(typeof CHANNEL_OPTIONS)[number]>('all');
// //   const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
// //   const [showFilters, setShowFilters] = useState(true);

// //   const filtered = useMemo(() => {
// //     return leads.filter((l) => {
// //       if (status !== 'all' && l.status !== status) return false;
// //       if (temp !== 'all' && l.temperature !== temp) return false;
// //       if (channel !== 'all' && l.channel !== channel) return false;
// //       if (search.trim()) {
// //         const q = search.trim().toLowerCase();
// //         const hay = `${l.name || ''} ${l.external_user_id || ''} ${(l.preferred_locations || []).join(' ')}`.toLowerCase();
// //         if (!hay.includes(q)) return false;
// //       }
// //       return true;
// //     });
// //   }, [leads, status, temp, channel, search]);

// //   const activeFilterCount =
// //     [status, temp, channel].filter((v) => v !== 'all').length + (search.trim() ? 1 : 0);

// //   const clearFilters = () => {
// //     setSearch('');
// //     setStatus('all');
// //     setTemp('all');
// //     setChannel('all');
// //   };

// //   return (
// //     <div
// //       className="rounded-[28px] border border-white/[0.06] p-6"
// //       style={{ background: 'linear-gradient(180deg, #16171c 0%, #1b1c22 100%)' }}
// //     >
// //       {/* Header */}
// //       <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
// //         <div>
// //           <h2 className="text-base font-bold text-white">Leads Directory</h2>
// //           <p className="mt-0.5 text-xs text-white/40">
// //             {filtered.length} of {leads.length} leads
// //           </p>
// //         </div>
// //         <div className="flex items-center gap-2">
// //           <button
// //             onClick={() => setShowFilters((s) => !s)}
// //             className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white/70 transition-colors hover:bg-white/[0.07]"
// //           >
// //             <SlidersHorizontal size={13} />
// //             Filters
// //             {activeFilterCount > 0 && (
// //               <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#d4af6a] text-[10px] font-bold text-[#16171c]">
// //                 {activeFilterCount}
// //               </span>
// //             )}
// //           </button>
// //           <button
// //             onClick={fetchLeads}
// //             className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white/70 transition-colors hover:bg-white/[0.07]"
// //           >
// //             <RefreshCw size={13} /> Refresh
// //           </button>
// //         </div>
// //       </div>

// //       {/* Filter bar */}
// //       {showFilters && (
// //         <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
// //           <div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2">
// //             <Search size={13} className="text-white/35" />
// //             <input
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               placeholder="Search name, ID, location..."
// //               className="w-full bg-transparent text-xs text-white/80 placeholder:text-white/30 outline-none"
// //             />
// //           </div>

// //           <FilterPill
// //             label="Status"
// //             value={status}
// //             options={STATUS_OPTIONS}
// //             onChange={(v) => setStatus(v as (typeof STATUS_OPTIONS)[number])}
// //           />
// //           <FilterPill
// //             label="Temp"
// //             value={temp}
// //             options={TEMP_OPTIONS}
// //             onChange={(v) => setTemp(v as (typeof TEMP_OPTIONS)[number])}
// //           />
// //           <FilterPill
// //             label="Channel"
// //             value={channel}
// //             options={CHANNEL_OPTIONS}
// //             onChange={(v) => setChannel(v as (typeof CHANNEL_OPTIONS)[number])}
// //           />

// //           {activeFilterCount > 0 && (
// //             <button
// //               onClick={clearFilters}
// //               className="flex items-center gap-1 rounded-full px-3 py-2 text-[11px] font-semibold text-white/40 transition-colors hover:text-white/70"
// //             >
// //               <X size={12} /> Clear
// //             </button>
// //           )}
// //         </div>
// //       )}

// //       {/* Table */}
// //       {loadingLeads ? (
// //         <p className="py-8 text-center text-[13px] text-white/40">Loading leads...</p>
// //       ) : filtered.length === 0 ? (
// //         <div className="flex flex-col items-center gap-2.5 py-14 text-white/25">
// //           <Users size={28} />
// //           <p className="text-[13px]">{leads.length === 0 ? 'No leads yet.' : 'No leads match these filters.'}</p>
// //         </div>
// //       ) : (
// //         <div className="overflow-x-auto">
// //           <table className="w-full border-collapse text-[13px]">
// //             <thead>
// //               <tr>
// //                 {['Name / ID', 'Channel', 'Intent', 'Budget', 'Locations', 'Status', 'Temp', 'Score', 'Last Active'].map(
// //                   (h) => (
// //                     <th
// //                       key={h}
// //                       className="border-b border-white/[0.06] px-3 pb-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-white/30"
// //                     >
// //                       {h}
// //                     </th>
// //                   ),
// //                 )}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {filtered.map((l) => (
// //                 <tr
// //                   key={l.id}
// //                   onClick={() => setSelectedLead(l)}
// //                   className="cursor-pointer transition-colors hover:bg-white/[0.03]"
// //                 >
// //                   <td className="border-b border-white/[0.04] px-3 py-3.5 font-semibold text-white/90">
// //                     {l.name || l.external_user_id}
// //                   </td>
// //                   <td className="border-b border-white/[0.04] px-3 py-3.5 capitalize text-white/60">{l.channel}</td>
// //                   <td className="border-b border-white/[0.04] px-3 py-3.5 text-white/60">{l.intent || '—'}</td>
// //                   <td className="border-b border-white/[0.04] px-3 py-3.5 text-white/60">
// //                     {l.budget_max ? `₹${(l.budget_max / 100000).toFixed(1)}L` : '—'}
// //                   </td>
// //                   <td className="border-b border-white/[0.04] px-3 py-3.5 text-white/60">
// //                     {(l.preferred_locations || []).join(', ') || '—'}
// //                   </td>
// //                   <td className="border-b border-white/[0.04] px-3 py-3.5">
// //                     <span className={statusBadge(l.status)}>{l.status}</span>
// //                   </td>
// //                   <td className="border-b border-white/[0.04] px-3 py-3.5">
// //                     <span className={tempBadge(l.temperature)}>{l.temperature}</span>
// //                   </td>
// //                   <td className="border-b border-white/[0.04] px-3 py-3.5 font-bold text-[#e9c98a]">
// //                     {l.lead_score ?? 0}
// //                   </td>
// //                   <td className="border-b border-white/[0.04] px-3 py-3.5 text-xs text-white/35">
// //                     {new Date(l.updated_at).toLocaleString()}
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {/* Detail slide-over */}
// //       {selectedLead && <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />}
// //     </div>
// //   );
// // }

// // function FilterPill({
// //   label,
// //   value,
// //   options,
// //   onChange,
// // }: {
// //   label: string;
// //   value: string;
// //   options: readonly string[];
// //   onChange: (v: string) => void;
// // }) {
// //   return (
// //     <select
// //       value={value}
// //       onChange={(e) => onChange(e.target.value as T)}
// //       className={[
// //         'rounded-full border bg-white/[0.03] px-3.5 py-2 text-[11px] font-semibold capitalize outline-none transition-colors',
// //         value !== 'all' ? 'border-[#d4af6a]/40 text-[#e9c98a]' : 'border-white/[0.08] text-white/55',
// //       ].join(' ')}
// //     >
// //       <option value="all" className="bg-[#1b1c22] text-white">
// //         {label}: All
// //       </option>
// //       {options
// //         .filter((o) => o !== 'all')
// //         .map((o) => (
// //           <option key={o} value={o} className="bg-[#1b1c22] text-white">
// //             {o}
// //           </option>
// //         ))}
// //     </select>
// //   );
// // }

// import React, { useMemo, useState } from 'react';
// import Link from 'next/link';
// import { ArrowUpRight, RefreshCw, Search, Users } from 'lucide-react';
// import { statusBadgeClass, tempBadgeClass } from '@/lib/dashboard/styles';
// import { Lead } from '@/types/dashboard';

// const TEMP_FILTERS = ['all', 'HOT', 'WARM', 'COLD'] as const;

// const th = 'border-b border-[#ece4d0] px-3 pb-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-faint';
// const td = 'border-b border-[#f0ede4] px-3 py-3.5 text-ink';

// export function LeadsTab({
//   leads,
//   loadingLeads,
//   fetchLeads,
// }: {
//   leads: Lead[];
//   loadingLeads: boolean;
//   fetchLeads: () => void;
// }) {
//   const [search, setSearch] = useState('');
//   const [tempFilter, setTempFilter] = useState<(typeof TEMP_FILTERS)[number]>('all');
//   const [channelFilter, setChannelFilter] = useState<string>('all');
//   const [statusFilter, setStatusFilter] = useState<string>('all');

//   const channels = useMemo(() => {
//     const set = new Set<string>(leads.map((l) => l.channel).filter(Boolean));
//     return ['all', ...Array.from(set)];
//   }, [leads]);

//   const statuses = useMemo(() => {
//     const set = new Set<string>(leads.map((l) => l.status).filter(Boolean));
//     return ['all', ...Array.from(set)];
//   }, [leads]);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return leads.filter((l) => {
//       if (tempFilter !== 'all' && l.temperature !== tempFilter) return false;
//       if (channelFilter !== 'all' && l.channel !== channelFilter) return false;
//       if (statusFilter !== 'all' && l.status !== statusFilter) return false;
//       if (q) {
//         const haystack = `${l.name || ''} ${l.phone || ''} ${l.external_user_id || ''}`.toLowerCase();
//         if (!haystack.includes(q)) return false;
//       }
//       return true;
//     });
//   }, [leads, search, tempFilter, channelFilter, statusFilter]);

//   return (
//     <div
//       className="rounded-[32px] border border-[#ece4d0] bg-white p-6 md:p-7"
//       style={{ boxShadow: '0 30px 60px -30px rgba(120,95,40,0.14)' }}
//     >
//       {/* Header */}
//       <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
//         <h2 className="text-base font-bold text-ink">Leads Directory</h2>
//         <button
//           onClick={fetchLeads}
//           className="flex items-center gap-1.5 rounded-full border border-[#e8e1cf] bg-white px-3.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-[#dcb673]/60 hover:text-ink"
//         >
//           <RefreshCw size={13} /> Refresh
//         </button>
//       </div>

//       {/* Search */}
//       <div className="relative mb-4">
//         <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search by name, phone or ID…"
//           className="w-full rounded-full border border-[#e8e1cf] bg-[#fbf8f1] py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors focus:border-[#dcb673] focus:bg-white"
//         />
//       </div>

//       {/* Filters */}
//       <div className="mb-6 flex flex-wrap items-center gap-2.5">
//         <div className="flex gap-1 rounded-full bg-[#f4eee0] p-1">
//           {TEMP_FILTERS.map((t) => (
//             <button
//               key={t}
//               onClick={() => setTempFilter(t)}
//               className={[
//                 'rounded-full px-3 py-1 text-[11px] font-semibold capitalize transition-colors',
//                 tempFilter === t ? 'bg-ink text-white shadow-sm' : 'text-muted hover:text-ink',
//               ].join(' ')}
//             >
//               {t === 'all' ? 'All' : t}
//             </button>
//           ))}
//         </div>

//         <select
//           value={channelFilter}
//           onChange={(e) => setChannelFilter(e.target.value)}
//           className="rounded-full border border-[#e8e1cf] bg-white px-3.5 py-1.5 text-xs font-medium capitalize text-ink outline-none"
//         >
//           {channels.map((c) => (
//             <option key={c} value={c}>
//               {c === 'all' ? 'All channels' : c}
//             </option>
//           ))}
//         </select>

//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="rounded-full border border-[#e8e1cf] bg-white px-3.5 py-1.5 text-xs font-medium capitalize text-ink outline-none"
//         >
//           {statuses.map((s) => (
//             <option key={s} value={s}>
//               {s === 'all' ? 'All statuses' : s}
//             </option>
//           ))}
//         </select>

//         {(search || tempFilter !== 'all' || channelFilter !== 'all' || statusFilter !== 'all') && (
//           <button
//             onClick={() => {
//               setSearch('');
//               setTempFilter('all');
//               setChannelFilter('all');
//               setStatusFilter('all');
//             }}
//             className="text-[11px] font-medium text-faint hover:text-muted"
//           >
//             Clear filters
//           </button>
//         )}

//         <span className="ml-auto text-[11px] text-faint">
//           {filtered.length} of {leads.length}
//         </span>
//       </div>

//       {/* Table */}
//       {loadingLeads ? (
//         <p className="text-[13px] text-muted">Loading leads...</p>
//       ) : filtered.length === 0 ? (
//         <div className="flex flex-col items-center gap-2.5 py-14 text-faint">
//           <Users size={28} />
//           <p className="text-[13px]">{leads.length === 0 ? 'No leads yet.' : 'No leads match these filters.'}</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-[13px] text-ink">
//             <thead>
//               <tr>
//                 <th className={th}>Name / ID</th>
//                 <th className={th}>Channel</th>
//                 <th className={th}>Intent</th>
//                 <th className={th}>Budget</th>
//                 <th className={th}>Status</th>
//                 <th className={th}>Temp</th>
//                 <th className={th}>Score</th>
//                 <th className={th}>Last Active</th>
//                 <th className={th}></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((l) => (
//                 <tr key={l.id} className="transition-colors hover:bg-[#fbf8f1]">
//                   <td className={`${td} font-semibold`}>{l.name || l.external_user_id}</td>
//                   <td className={`${td} capitalize`}>{l.channel}</td>
//                   <td className={td}>{l.intent || '—'}</td>
//                   <td className={td}>{l.budget_max ? `₹${(l.budget_max / 100000).toFixed(1)}L` : '—'}</td>
//                   <td className={td}>
//                     <span className={statusBadgeClass(l.status)}>{l.status}</span>
//                   </td>
//                   <td className={td}>
//                     <span className={tempBadgeClass(l.temperature)}>{l.temperature}</span>
//                   </td>
//                   <td className={`${td} font-bold`}>{l.lead_score ?? 0}</td>
//                   <td className={`${td} text-xs text-faint`}>{new Date(l.updated_at).toLocaleDateString()}</td>
//                   <td className={td}>
//                     <Link
//                       href={`/dashboard/leads/${l.id}`}
//                       className="flex items-center gap-1 whitespace-nowrap rounded-full border border-[#e8e1cf] px-3 py-1 text-[11px] font-semibold text-[#a3762f] transition-colors hover:border-[#dcb673] hover:bg-[#faf3e4]"
//                     >
//                       View <ArrowUpRight size={12} />
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, RefreshCw, Search, Users } from 'lucide-react';
import { statusBadgeClass, tempBadgeClass } from '@/lib/dashboard/styles';
import { Lead } from '@/types/dashboard';

const TEMP_FILTERS = ['all', 'HOT', 'WARM', 'COLD'] as const;

const th = 'border-b border-[#ece4d0] px-4 pb-3 text-left text-xs font-bold uppercase tracking-wide text-faint';
const td = 'border-b border-[#f0ede4] px-4 py-4 text-[15px] text-ink';

export function LeadsTab({
  leads,
  loadingLeads,
  fetchLeads,
}: {
  leads: Lead[];
  loadingLeads: boolean;
  fetchLeads: () => void;
}) {
  const [search, setSearch] = useState('');
  const [tempFilter, setTempFilter] = useState<(typeof TEMP_FILTERS)[number]>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const channels = useMemo(() => {
    const set = new Set<string>(leads.map((l) => l.channel).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [leads]);

  const statuses = useMemo(() => {
    const set = new Set<string>(leads.map((l) => l.status).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [leads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (tempFilter !== 'all' && l.temperature !== tempFilter) return false;
      if (channelFilter !== 'all' && l.channel !== channelFilter) return false;
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (q) {
        const haystack = `${l.name || ''} ${l.phone || ''} ${l.external_user_id || ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [leads, search, tempFilter, channelFilter, statusFilter]);

  return (
    <div
      className="rounded-[32px] border border-[#ece4d0] bg-white p-7 md:p-8"
      style={{ boxShadow: '0 30px 60px -30px rgba(120,95,40,0.14)' }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">Leads Directory</h2>
        <button
          onClick={fetchLeads}
          className="flex items-center gap-2 rounded-full border border-[#e8e1cf] bg-white px-4 py-2 text-sm font-semibold text-muted transition-colors hover:border-[#dcb673]/60 hover:text-ink"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone or ID…"
          className="w-full rounded-full border border-[#e8e1cf] bg-[#fbf8f1] py-3.5 pl-12 pr-4 text-base text-ink outline-none transition-colors focus:border-[#dcb673] focus:bg-white"
        />
      </div>

      {/* Filters */}
      <div className="mb-7 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-full bg-[#f4eee0] p-1.5">
          {TEMP_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setTempFilter(t)}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors',
                tempFilter === t ? 'bg-ink text-white shadow-sm' : 'text-muted hover:text-ink',
              ].join(' ')}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>

        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="rounded-full border border-[#e8e1cf] bg-white px-4 py-2 text-sm font-medium capitalize text-ink outline-none"
        >
          {channels.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? 'All channels' : c}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full border border-[#e8e1cf] bg-white px-4 py-2 text-sm font-medium capitalize text-ink outline-none"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All statuses' : s}
            </option>
          ))}
        </select>

        {(search || tempFilter !== 'all' || channelFilter !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setTempFilter('all');
              setChannelFilter('all');
              setStatusFilter('all');
            }}
            className="text-sm font-medium text-faint hover:text-muted"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto text-sm text-faint">
          {filtered.length} of {leads.length}
        </span>
      </div>

      {/* Table */}
      {loadingLeads ? (
        <p className="text-[15px] text-muted">Loading leads...</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-faint">
          <Users size={32} />
          <p className="text-[15px]">{leads.length === 0 ? 'No leads yet.' : 'No leads match these filters.'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[15px] text-ink">
            <thead>
              <tr>
                <th className={th}>Name / ID</th>
                <th className={th}>Channel</th>
                <th className={th}>Intent</th>
                <th className={th}>Budget</th>
                <th className={th}>Status</th>
                <th className={th}>Temp</th>
                <th className={th}>Score</th>
                <th className={th}>Last Active</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="transition-colors hover:bg-[#fbf8f1]">
                  <td className={`${td} font-semibold`}>{l.name || l.external_user_id}</td>
                  <td className={`${td} capitalize`}>{l.channel}</td>
                  <td className={td}>{l.intent || '—'}</td>
                  <td className={td}>{l.budget_max ? `₹${(l.budget_max / 100000).toFixed(1)}L` : '—'}</td>
                  <td className={td}>
                    <span className={statusBadgeClass(l.status)}>{l.status}</span>
                  </td>
                  <td className={td}>
                    <span className={tempBadgeClass(l.temperature)}>{l.temperature}</span>
                  </td>
                  <td className={`${td} font-bold`}>{l.lead_score ?? 0}</td>
                  <td className={`${td} text-sm text-faint`}>{new Date(l.updated_at).toLocaleDateString()}</td>
                  <td className={td}>
                    <Link
                      href={`/dashboard/leads/${l.id}`}
                      className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#e8e1cf] px-4 py-1.5 text-sm font-semibold text-[#a3762f] transition-colors hover:border-[#dcb673] hover:bg-[#faf3e4]"
                    >
                      View <ArrowUpRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}