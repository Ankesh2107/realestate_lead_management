'use client';

import React from 'react';
import { LucideIcon, MapPin, MessageCircle, Phone, TrendingUp, X } from 'lucide-react';
import { Lead } from '@/types/dashboard';

function statusBadge(status: string) {
  const map: Record<string, string> = {
    new: 'bg-blue-400/10 text-blue-300 border-blue-400/20',
    contacted: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
    qualified: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
    negotiating: 'bg-[#e9c98a]/10 text-[#e9c98a] border-[#e9c98a]/20',
    closed: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
    lost: 'bg-red-400/10 text-red-300 border-red-400/20',
  };
  return `inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
    map[status] || 'bg-white/[0.05] text-white/50 border-white/10'
  }`;
}

function tempBadge(temp: string) {
  const map: Record<string, string> = {
    hot: 'bg-red-400/10 text-red-300 border-red-400/20',
    warm: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
    cold: 'bg-sky-400/10 text-sky-300 border-sky-400/20',
  };
  return `inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
    map[temp] || 'bg-white/[0.05] text-white/50 border-white/10'
  }`;
}

export function LeadDetailPanel({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-white/[0.07] p-6"
        style={{ background: 'linear-gradient(180deg, #16171c 0%, #1b1c22 100%)' }}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{lead.name || lead.external_user_id}</h3>
            <p className="mt-0.5 text-xs capitalize text-white/40">{lead.channel} lead</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.05] text-white/60 transition-colors hover:bg-white/[0.1] hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        {/* Badges */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className={statusBadge(lead.status)}>{lead.status}</span>
          <span className={tempBadge(lead.temperature)}>{lead.temperature}</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#d4af6a]/20 bg-[#d4af6a]/10 px-3 py-1 text-xs font-bold text-[#e9c98a]">
            <TrendingUp size={12} /> Score {lead.lead_score ?? 0}
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <DetailRow icon={MessageCircle} label="Intent" value={lead.intent || '—'} />
          <DetailRow
            icon={TrendingUp}
            label="Budget"
            value={lead.budget_max ? `₹${(lead.budget_max / 100000).toFixed(1)}L` : '—'}
          />
          <DetailRow
            icon={MapPin}
            label="Preferred locations"
            value={(lead.preferred_locations || []).join(', ') || '—'}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <span className="text-[10.5px] font-bold uppercase tracking-wide text-white/30">External ID</span>
          <p className="mt-1 break-all text-xs text-white/55">{lead.external_user_id}</p>
        </div>

        <div className="mt-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <span className="text-[10.5px] font-bold uppercase tracking-wide text-white/30">Last active</span>
          <p className="mt-1 text-xs text-white/55">{new Date(lead.updated_at).toLocaleString()}</p>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2.5 pt-8">
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-[#16171c] transition-transform hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #e9c98a, #c9a15c)' }}
          >
            <Phone size={15} /> Call Lead
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/[0.1] py-3 text-sm font-semibold text-white/70 transition-colors hover:bg-white/[0.05]">
            <MessageCircle size={15} /> Message
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-white/50">
        <Icon size={14} />
      </span>
      <div>
        <p className="text-[10.5px] font-bold uppercase tracking-wide text-white/30">{label}</p>
        <p className="mt-0.5 text-sm text-white/85">{value}</p>
      </div>
    </div>
  );
}