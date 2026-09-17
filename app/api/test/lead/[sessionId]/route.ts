import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/config/supabase';

const ORG_ID = process.env.ORG_ID;

export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const channel = req.nextUrl.searchParams.get('channel') || 'web_test';
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('org_id', ORG_ID)
      .eq('channel', channel)
      .eq('external_user_id', params.sessionId)
      .maybeSingle();
    if (error) throw error;
    return NextResponse.json(data || null);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
