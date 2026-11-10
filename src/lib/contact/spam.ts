import crypto from 'node:crypto';

// Signs the time the form was rendered, so submissions that arrive implausibly
// fast (bots) or hours later are rejected. On serverless hosts the key must be
// identical across instances: FORM_SECRET, else a hash of the provider secret.
function secret(): string {
  const provider = process.env.RESEND_API_KEY || process.env.SMTP_PASS;
  return process.env.FORM_SECRET
    || (provider ? crypto.createHash('sha256').update(`nexify-form-token:${provider}`).digest('hex') : FALLBACK);
}
const FALLBACK = crypto.randomBytes(32).toString('hex');
export const MIN_FILL_MS = 3000;
export const MAX_AGE_MS = 2 * 60 * 60 * 1000;

const sign = (ts: string | number) => crypto.createHmac('sha256', secret()).update(String(ts)).digest('base64url');

export function issueToken(now = Date.now()): string {
  return `${now}.${sign(now)}`;
}

export function checkToken(token: unknown, now = Date.now()): 'ok' | 'invalid' | 'too_fast' | 'expired' {
  if (typeof token !== 'string' || !/^\d{10,16}\.[\w-]{20,64}$/.test(token)) return 'invalid';
  const [ts, sig] = token.split('.');
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(ts));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return 'invalid';
  const age = now - Number(ts);
  if (age < MIN_FILL_MS) return 'too_fast';
  if (age > MAX_AGE_MS) return 'expired';
  return 'ok';
}

/**
 * In-memory sliding-window rate limiter. IPs are held only in memory for the
 * window length (documented on the privacy page), never written to disk/logs.
 * Per instance on serverless hosts, so it is a best-effort limit there.
 */
export function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 8 } = {}) {
  const hits = new Map<string, number[]>();
  return {
    hit(key: string, now = Date.now()): boolean {
      const list = (hits.get(key) || []).filter((t) => t > now - windowMs);
      if (list.length >= max) { hits.set(key, list); return false; }
      list.push(now);
      hits.set(key, list);
      if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => t > now - windowMs)) hits.delete(k);
      return true;
    },
    reset() { hits.clear(); },
  };
}

const g = globalThis as unknown as { __nexifyLimiter?: ReturnType<typeof createRateLimiter> };
export const rateLimiter = (g.__nexifyLimiter ??= createRateLimiter());
