import { NextResponse } from 'next/server';
import { supabase } from '@/lib/config/supabase';

// Without this, Next.js statically pre-renders this GET route at build time
// and serves that frozen snapshot forever — the health check would never
// actually re-check the database.
export const dynamic = 'force-dynamic';

export async function GET() {
  const envOk = {
    supabase: !!process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('YOUR_PROJECT'),
    gemini: !!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('YOUR_GEMINI'),
    org_id: process.env.ORG_ID,
  };
  let dbOk = false;
  try {
    const { error } = await supabase.from('organizations').select('id').limit(1);
    dbOk = !error;
  } catch (_) {
    dbOk = false;
  }
  return NextResponse.json({ envOk, dbOk });
}
