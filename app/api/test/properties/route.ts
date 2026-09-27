import { NextResponse } from 'next/server';
import { supabase } from '@/lib/config/supabase';

// Without this, Next.js statically pre-renders this GET route at build time
// and serves that frozen snapshot forever — new properties would never show up.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
