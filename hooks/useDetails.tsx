// 'use client';

// import { useCallback, useEffect, useState } from 'react';
// import { Lead, LeadMessage } from '@/types/dashboard';

// /** Fetches one lead's full record plus its conversation history by lead id. */
// export function useLeadDetail(leadId: string) {
//   const [lead, setLead] = useState<Lead>(null);
//   const [messages, setMessages] = useState<LeadMessage[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [leadRes, msgRes] = await Promise.all([
//         fetch(`/api/test/leads/${leadId}`),
//         fetch(`/api/test/leads/${leadId}/messages`),
//       ]);
//       const leadData = await leadRes.json();
//       const msgData = await msgRes.json();
//       if (leadData?.error) throw new Error(leadData.error);
//       setLead(leadData);
//       setMessages(Array.isArray(msgData) ? msgData : []);
//     } catch (err: any) {
//       setError(err.message || 'Failed to load lead');
//     } finally {
//       setLoading(false);
//     }
//   }, [leadId]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   return { lead, messages, loading, error, refetch: load };
// }
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Lead, LeadMessage } from '@/types/dashboard';

/** Fetches one lead's full record plus its conversation history by lead id. */
export function useLeadDetail(leadId: string | undefined) {
  const [lead, setLead] = useState<Lead>(null);
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!leadId) {
      setError('No lead ID provided.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [leadRes, msgRes] = await Promise.all([
        fetch(`/api/test/leads/${leadId}`),
        fetch(`/api/test/leads/${leadId}/messages`),
      ]);
      const leadData = await leadRes.json();
      const msgData = await msgRes.json();
      if (leadData?.error) throw new Error(leadData.error);
      setLead(leadData);
      setMessages(Array.isArray(msgData) ? msgData : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load lead');
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    load();
  }, [load]);

  return { lead, messages, loading, error, refetch: load };
}