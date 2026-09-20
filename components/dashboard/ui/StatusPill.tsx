import React from 'react';
import { VoiceStatus } from '@/types/dashboard';

const CONFIG: Record<VoiceStatus, { label: string; className: string }> = {
  idle: { label: 'Ready for Call', className: 'bg-[#f1efe7] text-muted border border-border' },
  connecting: { label: 'Connecting Agent...', className: 'bg-warning-soft text-warning border border-warning/25' },
  listening: { label: '🎙️ Listening to You...', className: 'bg-success-soft text-success border border-success/25' },
  processing: { label: '⚡ Thinking & Querying...', className: 'bg-primary-soft text-primary border border-primary/25' },
  speaking: { label: '🔊 Agent Speaking...', className: 'bg-violet-soft text-violet border border-violet/25' },
  ended: { label: 'Call Ended', className: 'bg-danger-soft text-danger border border-danger/25' },
};

export function StatusPill({ status }: { status: VoiceStatus }) {
  const cfg = CONFIG[status] || CONFIG.idle;
  return (
    <span className={`inline-block rounded-full px-4 py-1.5 text-[13px] font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
