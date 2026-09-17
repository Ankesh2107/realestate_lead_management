import { NextResponse } from 'next/server';
import { supabase } from '@/lib/config/supabase';

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
