import type { ContactValues } from './validate';

/**
 * Delivers contact-form messages to a private Discord channel via a webhook.
 * Set DISCORD_WEBHOOK_URL as a server-side environment variable in Vercel
 * (Project → Settings → Environment Variables). Never in client code.
 */
type Env = Record<string, string | undefined>;
const WEBHOOK = /^https:\/\/(?:canary\.|ptb\.)?(?:discord|discordapp)\.com\/api\/webhooks\/\d+\/[\w-]+$/;

export const webhookUrl = (env: Env = process.env) => {
  const url = (env.DISCORD_WEBHOOK_URL || '').trim();
  return WEBHOOK.test(url) ? url : null;
};
export const isConfigured = (env: Env = process.env) => webhookUrl(env) !== null;

export class DeliveryError extends Error {
  constructor(public code: 'NOT_CONFIGURED' | 'DELIVERY_FAILED', message: string) { super(message); }
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export function buildPayload(v: ContactValues, lang: string) {
  return {
    username: 'Nexify website',
    // Never ping anyone, whatever the visitor typed.
    allowed_mentions: { parse: [] as string[] },
    embeds: [{
      title: clip(v.subject, 256),
      description: clip(v.message, 4000),
      color: 0xb08bff,
      fields: [
        { name: 'Name', value: clip(v.name, 1024), inline: true },
        { name: 'Email', value: clip(v.email, 1024), inline: true },
        { name: 'Language', value: lang, inline: true },
      ],
      timestamp: new Date().toISOString(),
    }],
  };
}

/** Resolves only after Discord accepted the message; throws DeliveryError otherwise. */
export async function sendToDiscord(v: ContactValues, { lang = 'en', env = process.env as Env, fetchImpl = fetch } = {}) {
  const url = webhookUrl(env);
  if (!url) throw new DeliveryError('NOT_CONFIGURED', 'Discord webhook not configured');
  let res: Response;
  try {
    res = await fetchImpl(`${url}?wait=true`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(buildPayload(v, lang)),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new DeliveryError('DELIVERY_FAILED', 'Discord unreachable');
  }
  if (!res.ok) throw new DeliveryError('DELIVERY_FAILED', `Discord responded ${res.status}`);
}
