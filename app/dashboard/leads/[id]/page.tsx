'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  Loader2,
  MapPin,
  MessageCircleOff,
  Phone,
  RefreshCw,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { statusBadgeClass, tempBadgeClass } from '@/lib/dashboard/styles';
import { useLeadDetail } from '@/hooks/useDetails';

const CHANNEL_LABEL: Record<string, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Facebook',
  voice: 'Voice Call',
  web_test: 'Web Simulator',
};

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const { lead, messages, loading, error, refetch } = useLeadDetail(params.id);
  const [notice, setNotice] = useState<string | null>(null);

  function flashNotice(text: string) {
    setNotice(text);
    setTimeout(() => setNotice(null), 2200);
  }

  const waLink = lead?.channel === 'whatsapp' && lead?.phone ? `https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}` : null;

  return (
    <div>
      <Link href="/dashboard/leads" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeft size={15} /> Back to Leads
      </Link>

      {notice && (
        <div className="mb-4 rounded-2xl border border-[#e8e1cf] bg-[#faf3e4] px-4 py-2.5 text-sm text-[#a3762f]">
          {notice}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-20 text-muted">
          <Loader2 size={18} className="animate-spin" /> Loading lead…
        </div>
      ) : error || !lead ? (
        <div className="rounded-[32px] border border-[#ece4d0] bg-white p-10 text-center text-muted">
          {error || 'Lead not found.'}
        </div>
      ) : (
        <>
          {/* Header card */}
          <div
            className="mb-6 flex flex-wrap items-center justify-between gap-5 rounded-[32px] border border-[#ece4d0] bg-white p-6 md:p-7"
            style={{ boxShadow: '0 30px 60px -30px rgba(120,95,40,0.14)' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ background: 'linear-gradient(150deg, #e9c98a 0%, #b8863f 100%)' }}
              >
                {(lead.name || lead.external_user_id || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-ink">{lead.name || lead.external_user_id}</h1>
                <p className="mt-0.5 text-xs text-faint">
                  {CHANNEL_LABEL[lead.channel] || lead.channel} · Lead #{lead.id.slice(0, 8)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={statusBadgeClass(lead.status)}>{lead.status}</span>
              <span className={tempBadgeClass(lead.temperature)}>{lead.temperature}</span>
              <span className="flex items-center gap-1 rounded-full bg-[#f4eee0] px-3 py-1 text-xs font-bold text-ink">
                <Sparkles size={12} /> {lead.lead_score ?? 0} score
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => flashNotice('Calling — this button is a placeholder for now.')}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] bg-[#141212]"
            
            >
              <Phone size={15} /> Call Lead
            </button>

            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-[#e8e1cf] bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-[#dcb673]/60"
              >
                <ExternalLink size={15} /> Open on WhatsApp
              </a>
            ) : (
              <button
                onClick={() => flashNotice(`Opening the original ${CHANNEL_LABEL[lead.channel] || lead.channel} thread isn't wired up yet.`)}
                className="flex items-center gap-2 rounded-full border border-[#e8e1cf] bg-white px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-[#dcb673]/60 hover:text-ink"
              >
                <ExternalLink size={15} /> Open Source
              </button>
            )}

            <button
              onClick={() => flashNotice('Assigning to a teammate is coming soon.')}
              className="flex items-center gap-2 rounded-full border border-[#e8e1cf] bg-white px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-[#dcb673]/60 hover:text-ink"
            >
              <Building2 size={15} /> Assign
            </button>

            <button
              onClick={refetch}
              className="ml-auto flex items-center gap-1.5 rounded-full border border-[#e8e1cf] bg-white px-4 py-2.5 text-xs font-semibold text-muted transition-colors hover:text-ink"
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
            {/* Details */}
            <div className="flex flex-col gap-5">
              <div className="rounded-[28px] border border-[#ece4d0] bg-white p-6">
                <h2 className="mb-4 text-sm font-bold text-ink">Contact</h2>
                <div className="flex flex-col gap-3 text-sm">
                  <DetailRow label="Phone" value={lead.phone || '—'} />
                  <DetailRow label="Email" value={lead.email || '—'} />
                  <DetailRow label="Language" value={lead.language || '—'} />
                  <DetailRow label="Do Not Contact" value={lead.do_not_contact ? 'Yes' : 'No'} />
                </div>
              </div>

              <div className="rounded-[28px] border border-[#ece4d0] bg-white p-6">
                <h2 className="mb-4 flex items-center gap-1.5 text-sm font-bold text-ink">
                  <Wallet size={14} /> Property Criteria
                </h2>
                <div className="flex flex-col gap-3 text-sm">
                  <DetailRow label="Intent" value={lead.intent || '—'} />
                  <DetailRow label="Purpose" value={lead.purpose || '—'} />
                  <DetailRow label="Timeline" value={lead.timeline || '—'} />
                  <DetailRow
                    label="Budget"
                    value={
                      lead.budget_min || lead.budget_max
                        ? `₹${((lead.budget_min || 0) / 100000).toFixed(1)}L – ₹${((lead.budget_max || 0) / 100000).toFixed(1)}L`
                        : '—'
                    }
                  />
                  <DetailRow
                    label="Locations"
                    value={
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="shrink-0 text-faint" />
                        {(lead.preferred_locations || []).join(', ') || '—'}
                      </span>
                    }
                  />
                  <DetailRow label="BHK" value={(lead.bhk_options || []).join(', ') || '—'} />
                  <DetailRow label="Property Type" value={lead.property_type || '—'} />
                </div>
              </div>

              {lead.notes && (
                <div className="rounded-[28px] border border-[#ece4d0] bg-white p-6">
                  <h2 className="mb-3 text-sm font-bold text-ink">Notes</h2>
                  <p className="text-sm leading-relaxed text-muted">{lead.notes}</p>
                </div>
              )}

              <div className="rounded-[28px] border border-[#ece4d0] bg-white p-6">
                <h2 className="mb-4 flex items-center gap-1.5 text-sm font-bold text-ink">
                  <Calendar size={14} /> Timeline
                </h2>
                <div className="flex flex-col gap-3 text-sm">
                  <DetailRow label="Created" value={new Date(lead.created_at).toLocaleString()} />
                  <DetailRow label="Last Updated" value={new Date(lead.updated_at).toLocaleString()} />
                </div>
              </div>
            </div>

            {/* Conversation */}
            <div className="flex min-h-[500px] flex-col rounded-[28px] border border-[#ece4d0] bg-white p-6">
              <h2 className="mb-4 text-sm font-bold text-ink">Conversation History</h2>
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
                {messages.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-faint">
                    <MessageCircleOff size={26} />
                    <p className="text-xs">No messages recorded for this lead yet.</p>
                  </div>
                ) : (
                  messages.map((m: any) => {
                    const isCustomer = m.sender === 'customer';
                    return (
                      <div key={m.id} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                        <div
                          className={[
                            'max-w-[80%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed',
                            isCustomer ? 'bg-[#f4eee0] text-ink' : m.sender === 'human' ? 'bg-[#e6efe9] text-ink' : 'bg-[#faf3e4] text-[#8a6329]',
                          ].join(' ')}
                        >
                          <p>{m.content}</p>
                          <p className="mt-1 text-[10px] opacity-60">{new Date(m.created_at).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#f0ede4] pb-3 last:border-0 last:pb-0">
      <span className="text-faint">{label}</span>
      <span className="text-right font-semibold text-ink">{value}</span>
    </div>
  );
}