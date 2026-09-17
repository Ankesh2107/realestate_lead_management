import { NextResponse } from 'next/server';
import { supabase } from '@/lib/config/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('escalations')
      .select('*, leads(name, phone, channel, status)')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
