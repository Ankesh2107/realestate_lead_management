import crypto from 'crypto';

/**
 * Verifies a Meta "X-Hub-Signature-256" header against the raw request body.
 * Must be called with the RAW (unparsed) body text — Meta signs the exact bytes sent.
 */
export function verifyMetaSignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader || !secret) return false;
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')}`;
  const a = Buffer.from(signatureHeader);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
