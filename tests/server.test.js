import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { SMTPServer } from 'smtp-server';

import { createApp } from '../server.js';
import { routes } from '../src/routes.js';
import { issueToken, createRateLimiter } from '../src/contact/spam.js';
import { validateContact } from '../src/contact/validate.js';

const listen = (app) => new Promise((resolve) => {
  const server = app.listen(0, '127.0.0.1', () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` }));
});

let smtp; let smtpPort; const received = []; let smtpReject = false;
let plain; let configured;

before(async () => {
  smtp = new SMTPServer({
    authOptional: true,
    disabledCommands: ['STARTTLS'],
    onRcptTo(address, session, cb) { return smtpReject ? cb(new Error('Mailbox unavailable')) : cb(); },
    onData(stream, session, cb) {
      let data = '';
      stream.on('data', (c) => { data += c; });
      stream.on('end', () => { received.push(data); cb(); });
    },
  });
  await new Promise((r) => smtp.listen(0, '127.0.0.1', r));
  smtpPort = smtp.server.address().port;

  plain = await listen(createApp({ env: {} }));
  configured = await listen(createApp({
    env: { SMTP_HOST: '127.0.0.1', SMTP_PORT: String(smtpPort), CONTACT_FROM_EMAIL: 'Nexify Website <site@example.test>', CONTACT_TO_EMAIL: 'inbox@example.test' },
    rateLimiter: createRateLimiter({ max: 100 }),
  }));
});

after(() => { plain.server.close(); configured.server.close(); smtp.close(); });

const validBody = (extra = {}) => ({
  name: 'Test Visitor', email: 'visitor@example.test', subject: 'Opportunity', message: 'Hello Nexify, this is a test message.',
  website: '', token: issueToken(Date.now() - 10_000), ...extra,
});
const postJson = (base, body, headers = {}) => fetch(`${base}/api/contact`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers }, body: JSON.stringify(body),
});

test('every route renders in every language with the right <html lang>', async () => {
  for (const [lang, locale] of [['en', 'en'], ['nl', 'nl'], ['pt', 'pt-PT']]) {
    for (const r of routes) {
      const res = await fetch(`${plain.base}${r.path}?lang=${lang}`);
      assert.equal(res.status, 200, `${r.path} ${lang}`);
      const body = await res.text();
      assert.match(body, new RegExp(`<html lang="${locale}"`), `${r.path} ${lang}`);
      assert.match(body, /<title>[^<]+<\/title>/);
      assert.ok(!/\b(?:home|common|meta|contact)\.[a-zA-Z]+\b/.test(body.replace(/<[^>]+>/g, ' ').replace(/[\w.-]+@[\w.-]+/g, '')), `untranslated key on ${r.path} ${lang}`);
    }
  }
});

test('English is the default; language choice persists via cookie', async () => {
  const res = await fetch(`${plain.base}/about`);
  assert.match(await res.text(), /<html lang="en"/);
  const sw = await fetch(`${plain.base}/lang/pt?next=/skills`, { redirect: 'manual' });
  assert.equal(sw.status, 303);
  assert.equal(sw.headers.get('location'), '/skills');
  const cookie = sw.headers.get('set-cookie');
  assert.match(cookie, /nexify_lang=pt/);
  const again = await fetch(`${plain.base}/skills`, { headers: { cookie: cookie.split(';')[0] } });
  assert.match(await again.text(), /<html lang="pt-PT"/);
});

test('language redirect rejects external targets', async () => {
  for (const next of ['//evil.example', 'https://evil.example', '/\\evil.example']) {
    const res = await fetch(`${plain.base}/lang/nl?next=${encodeURIComponent(next)}`, { redirect: 'manual' });
    assert.equal(res.headers.get('location'), '/');
  }
});

test('unknown routes return 404', async () => {
  assert.equal((await fetch(`${plain.base}/does-not-exist`)).status, 404);
});

test('server-side validation rejects bad input', () => {
  const { errors } = validateContact({ name: '', email: 'nope', subject: 'x'.repeat(151), message: 'short' });
  assert.deepEqual(Object.keys(errors).sort(), ['email', 'message', 'name', 'subject']);
  assert.equal(Object.keys(validateContact(validBody()).errors).length, 0);
});

test('contact: invalid data -> 422 with field errors', async () => {
  const res = await postJson(configured.base, validBody({ email: 'not-an-email', message: 'hi' }));
  assert.equal(res.status, 422);
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.equal(data.errors.email.key, 'emailInvalid');
  assert.equal(data.errors.message.key, 'messageTooShort');
});

test('contact: honeypot and too-fast submissions are rejected, never "successful"', async () => {
  const hp = await postJson(configured.base, validBody({ website: 'http://spam.example' }));
  assert.equal(hp.status, 400);
  assert.equal((await hp.json()).ok, false);
  const fast = await postJson(configured.base, validBody({ token: issueToken(Date.now()) }));
  assert.equal(fast.status, 400);
  assert.equal((await fast.json()).error, 'expired');
  const forged = await postJson(configured.base, validBody({ token: `${Date.now() - 10000}.forgedsignatureforgedsig` }));
  assert.equal(forged.status, 400);
});

test('contact: cross-origin posts are rejected', async () => {
  const res = await postJson(configured.base, validBody(), { Origin: 'https://evil.example' });
  assert.equal(res.status, 403);
});

test('contact: without a provider the server says so (503), no fake success', async () => {
  const res = await postJson(plain.base, validBody());
  assert.equal(res.status, 503);
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.equal(data.error, 'notConfigured');
  const page = await (await fetch(`${plain.base}/contact`)).text();
  assert.match(page, /data-submit disabled/);
});

test('contact: success only after the SMTP server accepts the message', async () => {
  received.length = 0;
  const res = await postJson(configured.base, validBody());
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(received.length, 1);
  assert.match(received[0], /To: inbox@example\.test/);
  assert.match(received[0], /Reply-To: .*visitor@example\.test/);
  assert.match(received[0], /Hello Nexify, this is a test message\./);
});

test('contact: provider failure -> 502 delivery error', async () => {
  smtpReject = true;
  try {
    const res = await postJson(configured.base, validBody());
    assert.equal(res.status, 502);
    assert.equal((await res.json()).error, 'delivery');
  } finally { smtpReject = false; }
});

test('contact: works without JavaScript (form post renders status page)', async () => {
  const form = new URLSearchParams(validBody());
  const res = await fetch(`${configured.base}/contact`, { method: 'POST', body: form, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  assert.equal(res.status, 200);
  assert.match(await res.text(), /form-status--success/);
});

test('contact: rate limiting kicks in', async () => {
  const app = createApp({ env: {}, rateLimiter: createRateLimiter({ max: 2 }) });
  const { server, base } = await listen(app);
  try {
    await postJson(base, validBody());
    await postJson(base, validBody());
    const third = await postJson(base, validBody());
    assert.equal(third.status, 429);
  } finally { server.close(); }
});

test('CV download is served as a PDF', async () => {
  const res = await fetch(`${plain.base}/cv/Nexify-CV.pdf`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'application/pdf');
  const buf = Buffer.from(await res.arrayBuffer());
  assert.equal(buf.subarray(0, 5).toString(), '%PDF-');
});
