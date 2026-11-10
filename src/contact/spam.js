import crypto from 'node:crypto';

// Signs the time the form was rendered, so the server can reject submissions
// that arrive implausibly fast (bots) or long after the page was loaded.
// FORM_SECRET is optional; without it a random per-process secret is used,
// which simply means open forms expire when the server restarts.
const SECRET = process.env.FORM_SECRET || crypto.randomBytes(32).toString('hex');
export const MIN_FILL_MS = 3000;
export const MAX_AGE_MS = 2 * 60 * 60 * 1000;

const sign = (ts) => crypto.createHmac('sha256', SECRET).update(String(ts)).digest('base64url');

export function issueToken(now = Date.now()) {
  return `${now}.${sign(now)}`;
}

/** Returns 'ok' | 'invalid' | 'too_fast' | 'expired'. */
export function checkToken(token, now = Date.now()) {
  if (typeof token !== 'string' || !/^\d{10,16}\.[\w-]{20,64}$/.test(token)) return 'invalid';
  const [tsStr, sig] = token.split('.');
  const expected = sign(tsStr);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return 'invalid';
  const age = now - Number(tsStr);
  if (age < MIN_FILL_MS) return 'too_fast';
  if (age > MAX_AGE_MS) return 'expired';
  return 'ok';
}

/**
 * Tiny in-memory sliding-window rate limiter. IP addresses are only held in
 * memory for the window length (documented on the privacy page) and never
 * written to disk or logs.
 */
export function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 5 } = {}) {
  const hits = new Map();
  const timer = setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [key, list] of hits) {
      const kept = list.filter((t) => t > cutoff);
      if (kept.length) hits.set(key, kept); else hits.delete(key);
    }
  }, 60 * 1000);
  timer.unref();
  return {
    windowMs,
    /** Records an attempt; returns false when the limit is exceeded. */
    hit(key, now = Date.now()) {
      const list = (hits.get(key) || []).filter((t) => t > now - windowMs);
      if (list.length >= max) { hits.set(key, list); return false; }
      list.push(now);
      hits.set(key, list);
      return true;
    },
    reset() { hits.clear(); },
  };
}
