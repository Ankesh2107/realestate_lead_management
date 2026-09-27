import React from 'react';
import { CalendarClock, ExternalLink, RefreshCw, UserPlus } from 'lucide-react';
import { iconBtnClass, panelClass } from '@/lib/dashboard/styles';
import { Escalation, SiteVisit } from '@/types/dashboard';

function formatVisitDate(v: SiteVisit): string {
  if (!v.requested_date) return 'Date not confirmed yet';
  const time = v.requested_time ? ` at ${v.requested_time}` : '';
  return `${v.requested_date}${time}`;
}

export function OpsTab({
  siteVisits,
  escalations,
  loadingOps,
  fetchOps,
}: {
  siteVisits: SiteVisit[];
  escalations: Escalation[];
  loadingOps: boolean;
  fetchOps: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className={panelClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Scheduled Site Visits</h2>
          <button onClick={() => fetchOps()} className={iconBtnClass}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        {loadingOps ? (
          <p className="text-[13px] text-muted">Loading...</p>
        ) : siteVisits.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 py-10 text-faint">
            <CalendarClock size={26} />
            <p className="text-[13px]">No site visits recorded yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {siteVisits.map((v) => (
              <div key={v.id} className="rounded-xl border border-border bg-surface-alt px-3.5 py-3">
                <div className="flex justify-between text-sm font-semibold text-ink">
                  <span>{v.leads?.name || v.leads?.phone || 'Unnamed lead'}</span>
                  <span
                    className={
                      v.status === 'confirmed'
                        ? 'text-success'
                        : v.status === 'cancelled'
                        ? 'text-danger'
                        : 'text-warning'
                    }
                  >
                    {v.status || 'requested'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {v.properties?.project_name ? `${v.properties.project_name} · ` : ''}
                  {formatVisitDate(v)}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-faint">
                  {v.leads?.phone && <span>{v.leads.phone}</span>}
                  {v.leads?.channel && <span className="capitalize">· {v.leads.channel}</span>}
                  {v.event_link && (
                    <a
                      href={v.event_link}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto flex items-center gap-1 text-primary hover:underline"
                    >
                      Calendar <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={panelClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Human Escalations &amp; Support</h2>
          <button onClick={() => fetchOps()} className={iconBtnClass}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        {loadingOps ? (
          <p className="text-[13px] text-muted">Loading...</p>
        ) : escalations.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 py-10 text-faint">
            <UserPlus size={26} />
            <p className="text-[13px]">No escalated leads pending.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {escalations.map((e) => (
              <div key={e.id} className="rounded-xl border border-border bg-surface-alt px-3.5 py-3">
                <div className="flex justify-between text-sm font-semibold text-ink">
                  <span>{e.leads?.name || e.leads?.phone || 'Unnamed lead'}</span>
                  <span className={e.status === 'resolved' ? 'text-success' : 'text-danger'}>
                    {e.status || 'open'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">Reason: {e.reason || 'Human agent requested by customer'}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-faint">
                  {e.leads?.phone && <span>{e.leads.phone}</span>}
                  {e.leads?.channel && <span className="capitalize">· {e.leads.channel}</span>}
                  {e.urgency && <span className="capitalize">· {e.urgency} urgency</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
