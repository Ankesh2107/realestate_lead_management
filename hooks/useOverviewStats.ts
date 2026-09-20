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

/** Fetches a lightweight snapshot across leads/properties/ops for the home page stat cards. */
export function useOverviewStats() {
  const [stats, setStats] = useState<OverviewStats>(EMPTY);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
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
        setStats({
          totalLeads: leadList.length,
          hotLeads: leadList.filter((l) => l.temperature === 'HOT').length,
          warmLeads: leadList.filter((l) => l.temperature === 'WARM').length,
          totalProperties: Array.isArray(properties) ? properties.length : 0,
          pendingVisits: Array.isArray(visits) ? visits.length : 0,
          pendingEscalations: Array.isArray(escalations) ? escalations.length : 0,
          recentLeads: leadList.slice(0, 5),
        });
      } catch {
        if (!cancelled) setStats(EMPTY);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading };
}
