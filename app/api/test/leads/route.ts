import { NextResponse } from 'next/server';
import { listLeads } from '@/lib/services/leadService';

// Without this, Next.js statically pre-renders this GET route at build time
// and serves that frozen snapshot forever — new leads would never show up.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const leads = await listLeads({ limit: 200 });
    return NextResponse.json(leads);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
