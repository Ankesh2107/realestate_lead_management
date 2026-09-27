import React from 'react';
import { Building, CheckCircle2, ClipboardList, PhoneCall, Sparkles, Users, XCircle } from 'lucide-react';
import { TabButton } from '@/components/dashboard/ui/TabButton';
import { healthBadgeStyle } from '@/lib/dashboard/styles';
import { ActiveTab, HealthState } from '@/types/dashboard';

export function DashboardHeader({
  health, 
  activeTab,
  setActiveTab,
}: {
  health: HealthState;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}) {
  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles style={{ color: '#3b82f6' }} /> Realty AI
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
            Multilingual Real Estate Sales Agent &amp; Omnichannel CRM — WhatsApp, Instagram, Facebook &amp; Voice (Sarvam AI)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
         <div className={healthBadgeStyle(health.dbOk)}>
            {health.dbOk ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Supabase DB: {health.dbOk ? 'Connected' : 'Disconnected'}
          </div>
          <div className={healthBadgeStyle(health.dbOk)}>
            {health.geminiOk ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Gemini AI Engine: {health.geminiOk ? 'Active' : 'Offline'}
          </div>
        </div>
      </header>

      <nav style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #232f48', paddingBottom: '12px', marginBottom: '24px' }}>
        <TabButton icon={<PhoneCall size={16} />} label="Voice Call Agent (Sarvam AI)" active={activeTab === 'voice'} onClick={() => setActiveTab('voice')} />
        <TabButton icon={<Users size={16} />} label="Leads CRM" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />
        <TabButton icon={<Building size={16} />} label="Property Catalog" active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} />
        <TabButton icon={<ClipboardList size={16} />} label="Ops & Escalations" active={activeTab === 'ops'} onClick={() => setActiveTab('ops')} />
      </nav>
    </>
  );
}
