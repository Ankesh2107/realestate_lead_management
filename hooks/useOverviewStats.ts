'use client';

import { useEffect, useState } from 'react';
import { Lead } from '@/types/dashboard';

interface OverviewStats {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  totalProperties: number;
  pendingVisits: number;
  pendingEscalations: number;
  recentLeads: Lead[];
}

const EMPTY: OverviewStats = {
  totalLeads: 0,
  hotLeads: 0,
  warmLeads: 0,
  totalProperties: 0,
  pendingVisits: 0,
  pendingEscalations: 0,
  recentLeads: [],
};

const POLL_MS = 5000;

/** Fetches a lightweight snapshot across leads/properties/ops for the home page stat cards,
 * refreshed on a short interval so the numbers stay live as new leads/messages come in. */
export function useOverviewStats() {
  const [stats, setStats] = useState<OverviewStats>(EMPTY);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function load(silent = false) {
      if (!silent) setLoading(true);
      try {
        const [leadsRes, propsRes, visitsRes, escRes] = await Promise.all([
          fetch('/api/test/leads'),
          fetch('/api/test/properties'),
          fetch('/api/test/site-visits'),
          fetch('/api/test/escalations'),
        ]);
        const [leads, properties, visits, escalations] = await Promise.all([
          leadsRes.json(),
          propsRes.json(),
          visitsRes.json(),
          escRes.json(),
        ]);
        if (cancelled) return;

        const leadList: Lead[] = Array.isArray(leads) ? leads : [];
        const visitList = Array.isArray(visits) ? visits : [];
        const escalationList = Array.isArray(escalations) ? escalations : [];
        setStats({
          totalLeads: leadList.length,
          hotLeads: leadList.filter((l) => l.temperature === 'HOT').length,
          warmLeads: leadList.filter((l) => l.temperature === 'WARM').length,
          totalProperties: Array.isArray(properties) ? properties.length : 0,
          pendingVisits: visitList.filter((v) => v.status === 'requested').length,
          pendingEscalations: escalationList.filter((e) => e.status === 'open').length,
          recentLeads: leadList.slice(0, 5),
        });
      } catch {
        if (!cancelled && !silent) setStats(EMPTY);
      } finally {
        if (!cancelled && !silent) setLoading(false);
      }
    }

    load(false);
    const interval = setInterval(() => load(true), POLL_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return { stats, loading };
}
