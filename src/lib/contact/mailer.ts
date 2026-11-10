import nodemailer from 'nodemailer';
import { PUBLIC_CONTACT_EMAIL } from '../config';
import type { ContactValues } from './validate';

/**
 * Email delivery. Configure ONE provider with server-side environment variables
 * (Vercel → Project → Settings → Environment Variables). Never in client code.
 *   Resend: RESEND_API_KEY, CONTACT_FROM_EMAIL
 *   SMTP:   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_FROM_EMAIL (SMTP_SECURE=true for 465)
 * CONTACT_TO_EMAIL optionally overrides the recipient.
 */
type Env = Record<string, string | undefined>;

export function getProvider(env: Env = process.env): 'resend' | 'smtp' | null {
  if (env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL) return 'resend';
  if (env.SMTP_HOST && env.CONTACT_FROM_EMAIL) return 'smtp';
  return null;
}
export const isConfigured = (env: Env = process.env) => getProvider(env) !== null;

export class MailError extends Error {
  constructor(public code: 'NOT_CONFIGURED' | 'DELIVERY_FAILED', message: string) { super(message); }
}

function buildEmail(v: ContactValues, lang: string) {
  const text = [
    'New message from the Nexify website contact form.', '',
    `Name: ${v.name}`, `Email: ${v.email}`, `Subject: ${v.subject}`, `Site language: ${lang}`, '',
    v.message, '', `— Reply directly to this email to answer ${v.name}.`,
  ].join('\n');
  return { subject: `[Nexify website] ${v.subject}`.slice(0, 200), text };
}

/** Resolves only after the provider accepted the message; throws MailError otherwise. */
export async function sendContactEmail(v: ContactValues, { lang = 'en', env = process.env as Env, fetchImpl = fetch } = {}) {
  const provider = getProvider(env);
  if (!provider) throw new MailError('NOT_CONFIGURED', 'Email provider not configured');
  const to = env.CONTACT_TO_EMAIL || PUBLIC_CONTACT_EMAIL;
  const from = env.CONTACT_FROM_EMAIL as string;
  const { subject, text } = buildEmail(v, lang);

  if (provider === 'resend') {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: v.email, subject, text }),
      signal: AbortSignal.timeout(15000),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    if (!res.ok || !data.id) throw new MailError('DELIVERY_FAILED', `Resend responded with status ${res.status}`);
    return { id: data.id };
  }

  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 587),
    secure: String(env.SMTP_SECURE).toLowerCase() === 'true',
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 20000,
  });
  try {
    const info = await transport.sendMail({ from, to, replyTo: { name: v.name, address: v.email }, subject, text });
    if (!info.accepted || info.accepted.length === 0) throw new MailError('DELIVERY_FAILED', 'Recipient not accepted');
    return { id: info.messageId };
  } catch (e) {
    if (e instanceof MailError) throw e;
    throw new MailError('DELIVERY_FAILED', (e as Error).message);
  } finally {
    transport.close();
  }
}
