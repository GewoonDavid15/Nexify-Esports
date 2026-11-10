import { beforeEach, describe, expect, it } from 'vitest';
import { validateContact } from '../src/lib/contact/validate';
import { checkToken, issueToken, rateLimiter } from '../src/lib/contact/spam';
import { processContact } from '../src/lib/contact/process';

const HOOK = 'https://discord.com/api/webhooks/123456789012345678/abcDEF_123-xyz';
const env = { DISCORD_WEBHOOK_URL: HOOK };
let sent: { url: string; body: any }[] = [];
let respond = 200;
const fakeFetch = (async (url: string, init: RequestInit) => {
  sent.push({ url, body: JSON.parse(String(init.body)) });
  return new Response('{}', { status: respond });
}) as unknown as typeof fetch;
beforeEach(() => { rateLimiter.reset(); sent = []; respond = 200; });

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
    const r = await processContact(body({ website: 'http://spam.example' }), { env, fetchImpl: fakeFetch });
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
  it('success only after Discord accepts the message', async () => {
    const r = await processContact(body(), { env, fetchImpl: fakeFetch });
    expect(r).toEqual({ ok: true, status: 200 });
    expect(sent).toHaveLength(1);
    expect(sent[0].url).toBe(`${HOOK}?wait=true`);
    expect(sent[0].body.allowed_mentions).toEqual({ parse: [] });
    expect(sent[0].body.embeds[0].description).toBe('Hello Nexify, this is a test message.');
    expect(JSON.stringify(sent[0].body)).toMatch(/visitor@example\.test/);
  });
  it('Discord failure: 502 delivery error', async () => {
    respond = 404;
    const r = await processContact(body(), { env, fetchImpl: fakeFetch });
    expect(r).toMatchObject({ ok: false, status: 502, error: 'delivery' });
  });
  it('ignores a webhook URL that is not Discord', async () => {
    const r = await processContact(body(), { env: { DISCORD_WEBHOOK_URL: 'https://evil.example/api/webhooks/1/x' }, fetchImpl: fakeFetch });
    expect(r).toMatchObject({ ok: false, status: 503, error: 'notConfigured' });
    expect(sent).toHaveLength(0);
  });
  it('invalid input: 422 with field errors', async () => {
    const r = await processContact(body({ email: 'x', message: 'hi' }), { env, fetchImpl: fakeFetch });
    expect(r.status).toBe(422);
    expect(r.errors?.email?.key).toBe('emailInvalid');
    expect(r.errors?.message?.key).toBe('messageTooShort');
  });
});
