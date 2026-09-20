// Shared Tailwind class fragments used across the dashboard.
// Keeping these centralized means one edit here reskins every tab.

export const panelClass = 'bg-surface rounded-2xl border border-border shadow-md p-5 md:p-6';

export const iconBtnClass =
  'inline-flex items-center gap-1.5 rounded-[10px] border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-surface-alt cursor-pointer';

export const tableClass = 'w-full border-collapse text-[13px] text-ink';

export function healthBadgeClass(ok: boolean) {
  return [
    'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold',
    ok ? 'bg-success-soft text-success border-success/20' : 'bg-danger-soft text-danger border-danger/20',
  ].join(' ');
}

// export function statusBadgeClass(status: string) {
//   const isHot = status === 'qualified' || status === 'visit_scheduled';
//   return [
//     'rounded-md px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide',
//     isHot ? 'bg-success-soft text-success' : 'bg-[#f1efe7] text-muted',
//   ].join(' ');
// }
export function statusBadgeClass(status: string) {
  const isHot = status === 'qualified' || status === 'visit_scheduled';
  return [
    'rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wide',
    isHot ? 'bg-success-soft text-success' : 'bg-[#f1efe7] text-muted',
  ].join(' ');
}

export function tempBadgeClass(temp: string) {
  const isHot = temp === 'HOT';
  const isWarm = temp === 'WARM';
  return [
    'rounded-md px-3 py-1 text-xs font-bold',
    isHot ? 'bg-danger-soft text-danger' : isWarm ? 'bg-warning-soft text-warning' : 'bg-primary-soft text-primary',
  ].join(' ');
}
// export function tempBadgeClass(temp: string) {
//   const isHot = temp === 'HOT';
//   const isWarm = temp === 'WARM';
//   return [
//     'rounded-md px-2.5 py-0.5 text-[11px] font-bold',
//     isHot ? 'bg-danger-soft text-danger' : isWarm ? 'bg-warning-soft text-warning' : 'bg-primary-soft text-primary',
//   ].join(' ');
// }
