import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/config/supabase';

export async function GET(_req: NextRequest, { params }: { params: { leadId: string } }) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('lead_id', params.leadId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}