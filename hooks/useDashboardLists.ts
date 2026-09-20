'use client';

import { useEffect, useState } from 'react';
import { ActiveTab, Escalation, Lead, Property, SiteVisit } from '@/types/dashboard';

/** Fetches Leads / Properties / Ops data, refetching whenever the matching tab becomes active. */
export function useDashboardLists(activeTab: ActiveTab) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState<boolean>(false);

  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loadingOps, setLoadingOps] = useState<boolean>(false);

  async function fetchLeads() {
    setLoadingLeads(true);
    try {
      const res = await fetch('/api/test/leads');
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      setLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  }

  async function fetchProperties() {
    setLoadingProperties(true);
    try {
      const res = await fetch('/api/test/properties');
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch {
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  }

  async function fetchOps() {
    setLoadingOps(true);
    try {
      const [vRes, eRes] = await Promise.all([fetch('/api/test/site-visits'), fetch('/api/test/escalations')]);
      setSiteVisits(Array.isArray(await vRes.json()) ? await vRes.clone().json() : []);
      setEscalations(Array.isArray(await eRes.json()) ? await eRes.clone().json() : []);
    } catch {
      setSiteVisits([]);
      setEscalations([]);
    } finally {
      setLoadingOps(false);
    }
  }

  useEffect(() => {
    if (activeTab === 'leads') fetchLeads();
    if (activeTab === 'properties') fetchProperties();
    if (activeTab === 'ops') fetchOps();
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
