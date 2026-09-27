// Minimal signed-cookie session, built on Web Crypto so it works identically
// in both middleware (edge runtime) and normal route handlers (node runtime).

const SESSION_COOKIE = 'realty_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.includes('YOUR_')) {
    throw new Error('SESSION_SECRET is not configured in .env');
  }
  return secret;
}

async function hmacHex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createSessionToken(): Promise<string> {
  const expiry = Date.now() + SESSION_TTL_MS;
  const secret = getSecret();
  const mac = await hmacHex(String(expiry), secret);
  return `${expiry}.${mac}`;
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [expiryStr, mac] = token.split('.');
  if (!expiryStr || !mac) return false;

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  try {
    const secret = getSecret();
    const expected = await hmacHex(expiryStr, secret);
    return timingSafeEqualHex(mac, expected);
  } catch {
    return false;
  }
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export { SESSION_COOKIE, SESSION_TTL_MS };
