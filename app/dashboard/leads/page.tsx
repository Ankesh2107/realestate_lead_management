'use client';

import React from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { LeadsTab } from '@/components/dashboard/tabs/LeadsTab';
import { useDashboardLists } from '@/hooks/useDashboardLists';

export default function LeadsPage() {
  const { leads, loadingLeads, fetchLeads } = useDashboardLists('leads');

  return (
    <div>
      <PageHeader title="Leads CRM" subtitle="Every inbound lead across WhatsApp, Instagram, Facebook and Voice." />
      <LeadsTab leads={leads} loadingLeads={loadingLeads} fetchLeads={fetchLeads} />
    </div>
  );
}
