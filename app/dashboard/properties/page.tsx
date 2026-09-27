'use client';

import React from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PropertiesTab } from '@/components/dashboard/tabs/PropertiesTab';
import { useDashboardLists } from '@/hooks/useDashboardLists';

export default function PropertiesPage() {
  const { properties, loadingProperties, fetchProperties } = useDashboardLists('properties');

  return (
    <div>
      <PageHeader title="Property Catalog" subtitle="Live inventory the AI agent pulls from when qualifying leads." />
      <PropertiesTab properties={properties} loadingProperties={loadingProperties} fetchProperties={fetchProperties} />
    </div>
  );
}
