import nodemailer from 'nodemailer';
import { PUBLIC_CONTACT_EMAIL } from '../config.js';

/**
 * Email delivery. Configure ONE provider with server-side environment
 * variables / platform secrets (never in frontend code or source control):
 *
 *   Resend (HTTPS API):  RESEND_API_KEY, CONTACT_FROM_EMAIL
 *   SMTP:                SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_FROM_EMAIL
 *                        (optional SMTP_SECURE=true for port 465)
 *
 * CONTACT_TO_EMAIL optionally overrides the recipient (defaults to the public
 * contact email in src/config.js).
 */
export function getProvider(env = process.env) {
  if (env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL) return 'resend';
  if (env.SMTP_HOST && env.CONTACT_FROM_EMAIL) return 'smtp';
  return null;
}

export function isConfigured(env = process.env) {
  return getProvider(env) !== null;
}

function buildEmail({ name, email, subject, message }, lang) {
  const text = [
    `New message from the Nexify website contact form.`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    `Site language: ${lang}`,
    ``,
    message,
    ``,
    `— Reply directly to this email to answer ${name}.`,
  ].join('\n');
  return { subject: `[Nexify website] ${subject}`.slice(0, 200), text };
}

/** Throws on failure; resolves with a provider message id only after the provider accepted the email. */
export async function sendContactEmail(values, { lang = 'en', env = process.env, fetchImpl = fetch } = {}) {
  const provider = getProvider(env);
  if (!provider) {
    const err = new Error('Email provider not configured');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }
  const to = env.CONTACT_TO_EMAIL || PUBLIC_CONTACT_EMAIL;
  const from = env.CONTACT_FROM_EMAIL;
  const { subject, text } = buildEmail(values, lang);

  if (provider === 'resend') {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: values.email, subject, text }),
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.id) {
      const err = new Error(`Resend responded with status ${res.status}`);
      err.code = 'DELIVERY_FAILED';
      throw err;
    }
    return { id: data.id };
  }

  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 587),
    secure: String(env.SMTP_SECURE).toLowerCase() === 'true',
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
  try {
    const info = await transport.sendMail({ from, to, replyTo: { name: values.name, address: values.email }, subject, text });
    if (!info.accepted || info.accepted.length === 0) {
      const err = new Error('SMTP server did not accept the recipient');
      err.code = 'DELIVERY_FAILED';
      throw err;
    }
    return { id: info.messageId };
  } catch (e) {
    if (!e.code || e.code !== 'DELIVERY_FAILED') e.code = 'DELIVERY_FAILED';
    throw e;
  } finally {
    transport.close();
  }
}
