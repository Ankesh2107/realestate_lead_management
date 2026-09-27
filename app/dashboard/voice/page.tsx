'use client';

import React from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { VoiceTab } from '@/components/dashboard/tabs/VoiceTab';
import { useVoiceCall } from '@/hooks/useVoiceCall';

export default function VoicePage() {
  const voice = useVoiceCall();

  return (
    <div>
      <PageHeader
        title="Voice Call Agent"
        subtitle="Sarvam AI Bulbul v3 (TTS/STT) + Gemini sales intelligence — test a live call in the browser."
      />
      <VoiceTab voice={voice} />
    </div>
  );
}
