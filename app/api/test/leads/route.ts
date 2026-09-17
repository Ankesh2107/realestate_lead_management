import { NextResponse } from 'next/server';
import { listLeads } from '@/lib/services/leadService';

export async function GET() {
  try {
    const leads = await listLeads({ limit: 200 });
    return NextResponse.json(leads);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
