import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_MS } from '@/lib/utils/session';

function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.includes('YOUR_')) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD is not configured on the server.' }, { status: 500 });
  }

  const { password } = await req.json().catch(() => ({ password: '' }));
  if (typeof password !== 'string' || !timingSafeEqualString(password, adminPassword)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  let token: string;
  try {
    token = await createSessionToken();
  } catch {
    return NextResponse.json({ error: 'SESSION_SECRET is not configured on the server.' }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return res;
}
