'use client';

import { useEffect, useState } from 'react';
import { ActiveTab, Escalation, Lead, Property, SiteVisit } from '@/types/dashboard';

const POLL_MS = 5000;

/** Fetches Leads / Properties / Ops data, refetching whenever the matching tab becomes
 * active and then on a short interval so the dashboard reflects new leads/messages
 * coming in live from WhatsApp/Instagram/Facebook/Voice without needing a manual reload. */
export function useDashboardLists(activeTab: ActiveTab) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState<boolean>(false);

  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loadingOps, setLoadingOps] = useState<boolean>(false);

  async function fetchLeads(silent = false) {
    if (!silent) setLoadingLeads(true);
    try {
      const res = await fetch('/api/test/leads');
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      if (!silent) setLeads([]);
    } finally {
      if (!silent) setLoadingLeads(false);
    }
  }

  async function fetchProperties(silent = false) {
    if (!silent) setLoadingProperties(true);
    try {
      const res = await fetch('/api/test/properties');
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch {
      if (!silent) setProperties([]);
    } finally {
      if (!silent) setLoadingProperties(false);
    }
  }

  async function fetchOps(silent = false) {
    if (!silent) setLoadingOps(true);
    try {
      const [vRes, eRes] = await Promise.all([fetch('/api/test/site-visits'), fetch('/api/test/escalations')]);
      const [vData, eData] = await Promise.all([vRes.json(), eRes.json()]);
      setSiteVisits(Array.isArray(vData) ? vData : []);
      setEscalations(Array.isArray(eData) ? eData : []);
    } catch {
      if (!silent) {
        setSiteVisits([]);
        setEscalations([]);
      }
    } finally {
      if (!silent) setLoadingOps(false);
    }
  }

  useEffect(() => {
    let fetchFn: ((silent?: boolean) => Promise<void>) | null = null;
    if (activeTab === 'leads') fetchFn = fetchLeads;
    if (activeTab === 'properties') fetchFn = fetchProperties;
    if (activeTab === 'ops') fetchFn = fetchOps;
    if (!fetchFn) return;

    fetchFn(false);
    const interval = setInterval(() => fetchFn && fetchFn(true), POLL_MS);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return {
    leads,
    loadingLeads,
    fetchLeads,
    properties,
    loadingProperties,
    fetchProperties,
    siteVisits,
    escalations,
    loadingOps,
    fetchOps,
  };
}
