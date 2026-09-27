import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, isValidSessionToken } from '@/lib/utils/session';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const valid = await isValidSessionToken(token);
  if (valid) return NextResponse.next();

  const isApi = req.nextUrl.pathname.startsWith('/api/');
  if (isApi) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('next', req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/test/:path*', '/api/voice/:path*'],
};
