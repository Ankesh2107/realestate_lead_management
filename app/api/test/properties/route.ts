import { NextResponse } from 'next/server';
import { supabase } from '@/lib/config/supabase';

const ORG_ID = process.env.ORG_ID;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('org_id', ORG_ID)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
