'use client';

import { useEffect, useState } from 'react';
import { HealthState } from '@/types/dashboard';

/** Polls the backend health endpoint every 15s and exposes DB/Gemini status. */
export function useHealthCheck() {
  const [health, setHealth] = useState<HealthState>({ dbOk: false, geminiOk: false });

  async function checkHealth() {
    try {
      const res = await fetch('/api/test/health');
      const data = await res.json();
      setHealth({ dbOk: !!data.dbOk, geminiOk: !!data.envOk?.gemini });
    } catch {
      setHealth({ dbOk: false, geminiOk: false });
    }
  }

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return { health };
}
