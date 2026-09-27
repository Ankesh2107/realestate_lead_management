import React from 'react';

const TINTS: Record<string, string> = {
  blue: 'bg-primary-soft text-primary',
  green: 'bg-success-soft text-success',
  amber: 'bg-warning-soft text-warning',
  violet: 'bg-violet-soft text-violet',
};

export function StatCard({
  label,
  value,
  icon,
  tint,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  tint: 'blue' | 'green' | 'amber' | 'violet';
}) {
  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-muted">{label}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-[9px] ${TINTS[tint]}`}>{icon}</div>
      </div>
      <span className="text-[28px] font-bold tracking-tight text-ink">{value}</span>
    </div>
  );
}
