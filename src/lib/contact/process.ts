import { validateContact, type Field, type FieldError, type ContactValues } from './validate';
import { checkToken, rateLimiter } from './spam';
import { isConfigured, sendToDiscord, DeliveryError } from './discord';

export type ContactErrorKey = 'summary' | 'notConfigured' | 'delivery' | 'rateLimited' | 'expired' | 'rejected';
export interface ContactResult {
  ok: boolean;
  status: number;
  error?: ContactErrorKey;
  errors?: Partial<Record<Field, FieldError>>;
  values?: ContactValues;
}

/** Used by the contact server action. Never logs message contents. */
export async function processContact(
  input: Record<string, unknown>,
  { ip = 'unknown', lang = 'en', env = process.env as Record<string, string | undefined>, fetchImpl = fetch as typeof fetch } = {},
): Promise<ContactResult> {
  if (!rateLimiter.hit(ip)) return { ok: false, status: 429, error: 'rateLimited' };
  if (typeof input.website === 'string' && input.website.trim() !== '') return { ok: false, status: 400, error: 'rejected' };

  const { values, errors } = validateContact(input);
  if (Object.keys(errors).length) return { ok: false, status: 422, error: 'summary', errors, values };
  if (checkToken(input.token) !== 'ok') return { ok: false, status: 400, error: 'expired', values };
  if (!isConfigured(env)) return { ok: false, status: 503, error: 'notConfigured', values };

  try {
    await sendToDiscord(values, { lang, env, fetchImpl });
    return { ok: true, status: 200 };
  } catch (err) {
    const code = err instanceof DeliveryError ? err.code : 'UNKNOWN';
    console.error(`[contact] delivery failed: ${code}`);
    return { ok: false, status: code === 'NOT_CONFIGURED' ? 503 : 502, error: code === 'NOT_CONFIGURED' ? 'notConfigured' : 'delivery', values };
  }
}
