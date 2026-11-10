import { validateContact, type Field, type FieldError, type ContactValues } from './validate';
import { checkToken, rateLimiter } from './spam';
import { isConfigured, sendContactEmail, MailError } from './mailer';

export type ContactErrorKey = 'summary' | 'notConfigured' | 'delivery' | 'rateLimited' | 'expired' | 'rejected';
export interface ContactResult {
  ok: boolean;
  status: number;
  error?: ContactErrorKey;
  errors?: Partial<Record<Field, FieldError>>;
  values?: ContactValues;
}

/** Shared by the server action and the JSON API. Never logs message contents. */
export async function processContact(
  input: Record<string, unknown>,
  { ip = 'unknown', lang = 'en', env = process.env as Record<string, string | undefined> } = {},
): Promise<ContactResult> {
  if (!rateLimiter.hit(ip)) return { ok: false, status: 429, error: 'rateLimited' };
  if (typeof input.website === 'string' && input.website.trim() !== '') return { ok: false, status: 400, error: 'rejected' };

  const { values, errors } = validateContact(input);
  if (Object.keys(errors).length) return { ok: false, status: 422, error: 'summary', errors, values };
  if (checkToken(input.token) !== 'ok') return { ok: false, status: 400, error: 'expired', values };
  if (!isConfigured(env)) return { ok: false, status: 503, error: 'notConfigured', values };

  try {
    await sendContactEmail(values, { lang, env });
    return { ok: true, status: 200 };
  } catch (err) {
    const code = err instanceof MailError ? err.code : 'UNKNOWN';
    console.error(`[contact] delivery failed: ${code}`);
    return { ok: false, status: code === 'NOT_CONFIGURED' ? 503 : 502, error: code === 'NOT_CONFIGURED' ? 'notConfigured' : 'delivery', values };
  }
}
