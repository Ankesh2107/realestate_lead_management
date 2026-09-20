import React from 'react';
import { CalendarClock, RefreshCw, UserPlus } from 'lucide-react';
import { iconBtnClass, panelClass } from '@/lib/dashboard/styles';
import { Escalation, SiteVisit } from '@/types/dashboard';

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
          <button onClick={fetchOps} className={iconBtnClass}>
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
                  <span>Visit #{v.id.slice(0, 6)}</span>
                  <span className="text-success">{v.status || 'Scheduled'}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Date: {new Date(v.scheduled_time || v.visit_date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={panelClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Human Escalations &amp; Support</h2>
          <button onClick={fetchOps} className={iconBtnClass}>
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
                  <span>Escalation #{e.id.slice(0, 6)}</span>
                  <span className="text-danger">{e.status || 'Pending'}</span>
                </div>
                <p className="mt-1 text-xs text-muted">Reason: {e.reason || 'Human agent requested by customer'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
