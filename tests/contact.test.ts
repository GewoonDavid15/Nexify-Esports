import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { SMTPServer } from 'smtp-server';
import type { AddressInfo } from 'node:net';
import { validateContact } from '../src/lib/contact/validate';
import { checkToken, issueToken, rateLimiter } from '../src/lib/contact/spam';
import { processContact } from '../src/lib/contact/process';

let smtp: SMTPServer;
let port = 0;
const received: string[] = [];
let reject = false;

beforeAll(async () => {
  smtp = new SMTPServer({
    authOptional: true,
    disabledCommands: ['STARTTLS'],
    onRcptTo(_a, _s, cb) { cb(reject ? new Error('Mailbox unavailable') : undefined); },
    onData(stream, _s, cb) { let d = ''; stream.on('data', (c) => { d += c; }); stream.on('end', () => { received.push(d); cb(); }); },
  });
  await new Promise<void>((r) => smtp.listen(0, '127.0.0.1', () => r()));
  port = (smtp.server.address() as AddressInfo).port;
});
afterAll(() => smtp.close());
beforeEach(() => rateLimiter.reset());

const smtpEnv = () => ({ SMTP_HOST: '127.0.0.1', SMTP_PORT: String(port), CONTACT_FROM_EMAIL: 'Nexify Website <site@example.test>', CONTACT_TO_EMAIL: 'inbox@example.test' });
const body = (extra: Record<string, unknown> = {}) => ({
  name: 'Test Visitor', email: 'visitor@example.test', subject: 'Opportunity', message: 'Hello Nexify, this is a test message.',
  website: '', token: issueToken(Date.now() - 10_000), ...extra,
});

describe('validation', () => {
  it('flags every invalid field', () => {
    const { errors } = validateContact({ name: '', email: 'nope', subject: 'x'.repeat(151), message: 'short' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'subject']);
    expect(Object.keys(validateContact(body()).errors)).toHaveLength(0);
  });
});

describe('spam protection', () => {
  it('rejects too-fast, forged and expired tokens', () => {
    expect(checkToken(issueToken())).toBe('too_fast');
    expect(checkToken(`${Date.now() - 10_000}.forgedsignatureforgedsig`)).toBe('invalid');
    expect(checkToken(issueToken(Date.now() - 3 * 60 * 60 * 1000))).toBe('expired');
    expect(checkToken(issueToken(Date.now() - 10_000))).toBe('ok');
  });
  it('honeypot is rejected, never reported as success', async () => {
    const r = await processContact(body({ website: 'http://spam.example' }), { env: smtpEnv() });
    expect(r).toMatchObject({ ok: false, status: 400, error: 'rejected' });
  });
  it('rate limits repeated posts', async () => {
    for (let i = 0; i < 8; i++) await processContact(body({ email: 'bad' }), { ip: '1.2.3.4', env: {} });
    const r = await processContact(body(), { ip: '1.2.3.4', env: {} });
    expect(r.status).toBe(429);
  });
});

describe('delivery', () => {
  it('without a provider: 503 notConfigured (no fake success)', async () => {
    const r = await processContact(body(), { env: {} });
    expect(r).toMatchObject({ ok: false, status: 503, error: 'notConfigured' });
  });
  it('success only after the SMTP server accepts the message', async () => {
    received.length = 0;
    const r = await processContact(body(), { env: smtpEnv() });
    expect(r).toEqual({ ok: true, status: 200 });
    expect(received).toHaveLength(1);
    expect(received[0]).toMatch(/To: inbox@example\.test/);
    expect(received[0]).toMatch(/Reply-To: .*visitor@example\.test/);
    expect(received[0]).toMatch(/Hello Nexify, this is a test message\./);
  });
  it('provider failure: 502 delivery error', async () => {
    reject = true;
    try {
      const r = await processContact(body(), { env: smtpEnv() });
      expect(r).toMatchObject({ ok: false, status: 502, error: 'delivery' });
    } finally { reject = false; }
  });
  it('invalid input: 422 with field errors', async () => {
    const r = await processContact(body({ email: 'x', message: 'hi' }), { env: smtpEnv() });
    expect(r.status).toBe(422);
    expect(r.errors?.email?.key).toBe('emailInvalid');
    expect(r.errors?.message?.key).toBe('messageTooShort');
  });
});
