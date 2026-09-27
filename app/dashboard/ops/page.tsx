'use client';

import React from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { OpsTab } from '@/components/dashboard/tabs/OpsTab';
import { useDashboardLists } from '@/hooks/useDashboardLists';

export default function OpsPage() {
  const { siteVisits, escalations, loadingOps, fetchOps } = useDashboardLists('ops');

  return (
    <div>
      <PageHeader title="Ops & Escalations" subtitle="Scheduled site visits and leads that asked for a human." />
      <OpsTab siteVisits={siteVisits} escalations={escalations} loadingOps={loadingOps} fetchOps={fetchOps} />
    </div>
  );
}
