/**
 * Browser checks against a production build (`npm run build` first).
 * Starts `next start`, then checks every route x language x viewport for console
 * errors (incl. CSP), horizontal overflow and broken internal links, plus key
 * interactions. Usage: npm run test:e2e
 */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const { chromium, devices } = createRequire(import.meta.url)('playwright');
const PORT = 3999;
const base = `http://127.0.0.1:${PORT}`;
const routes = ['/', '/about', '/achievements', '/resume', '/skills', '/services', '/portfolio', '/testimonials', '/contact', '/nexify-dev', '/privacy', '/terms', '/cookies', '/disclaimer', '/media-kit'];

// Spawn node directly (not npx) so killing it really stops the server.
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(PORT), '-H', '127.0.0.1'], { stdio: 'ignore', detached: true, env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
// Kill the whole process group (next start forks a next-server child).
const stopServer = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
for (let i = 0; i < 60; i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }

const browser = await chromium.launch();
const failures = [];
const fail = (m) => { failures.push(m); console.error(`✗ ${m}`); };
const checked = new Map();
const check = async (href) => {
  if (!checked.has(href)) checked.set(href, (await fetch(base + href, { redirect: 'manual' })).status);
  return checked.get(href);
};

try {
  for (const vp of [{ name: 'desktop', o: { viewport: { width: 1440, height: 900 } } }, { name: 'tablet', o: { viewport: { width: 820, height: 1180 } } }, { name: 'mobile', o: { ...devices['iPhone 13'] } }]) {
    for (const lang of ['en', 'nl', 'pt']) {
      const ctx = await browser.newContext(vp.o);
      await ctx.addCookies([{ name: 'nexify_lang', value: lang, url: base }]);
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', (e) => errors.push(e.message));
      for (const r of routes) {
        await page.goto(base + r, { waitUntil: 'networkidle' });
        const html = await page.getAttribute('html', 'lang');
        if (html !== { en: 'en', nl: 'nl', pt: 'pt-PT' }[lang]) fail(`${vp.name}/${lang} ${r}: html lang ${html}`);
        const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (ov > 1) fail(`${vp.name}/${lang} ${r}: horizontal overflow ${ov}px`);
        for (const h of await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')))) {
          const st = await check(h);
          if (st >= 400) fail(`${r}: broken link ${h} (${st})`);
        }
      }
      if (errors.length) fail(`${vp.name}/${lang}: console errors: ${[...new Set(errors)].join(' | ')}`);
      await ctx.close();
    }
  }

  // Interactions (mobile)
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'] });
    const page = await ctx.newPage();
    await page.goto(`${base}/skills`, { waitUntil: 'networkidle' });
    const toggle = page.locator('.hdr__toggle');
    await toggle.click();
    await page.waitForSelector('#mobile-menu .mmenu__link');
    if ((await toggle.getAttribute('aria-expanded')) !== 'true') fail('menu did not open');
    await page.keyboard.press('Escape');
    if ((await toggle.getAttribute('aria-expanded')) !== 'false') fail('menu did not close with Escape');
    await page.waitForSelector('#mobile-menu', { state: 'detached', timeout: 4000 }).catch(() => fail('menu still in DOM after Escape'));
    await toggle.click();
    await page.locator('#mobile-menu [data-lang="nl"]').click();
    await page.waitForFunction(() => document.documentElement.lang === 'nl');
    if (!page.url().endsWith('/skills')) fail(`language switch left the page: ${page.url()}`);
    await page.reload();
    if ((await page.getAttribute('html', 'lang')) !== 'nl') fail('language not remembered after reload');
    await page.goto(`${base}/resume`);
    const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('a[download]').first().click()]);
    if (!fs.readFileSync(await dl.path()).subarray(0, 4).toString().startsWith('%PDF')) fail('CV download is not a PDF');
    await page.goto(`${base}/contact`, { waitUntil: 'networkidle' });
    if (!(await page.locator('.cform button[type=submit]').isDisabled())) fail('submit should be disabled without a provider');
    await page.fill('#f-email', 'not-an-email');
    await page.locator('#f-email').blur();
    await page.waitForTimeout(200);
    if (!(await page.textContent('#f-email-err'))?.trim()) fail('client-side validation message missing');
    await ctx.close();
  }
  // Client-side navigation keeps the language and animates in
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addCookies([{ name: 'nexify_lang', value: 'pt', url: base }]);
    const page = await ctx.newPage();
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.hdr__nav a[href="/about"]').click();
    await page.waitForURL(`${base}/about`);
    await page.waitForTimeout(800);
    const title = await page.textContent('h1');
    if (!/Sobre/.test(title || '')) fail(`client navigation lost language: "${title}"`);
    await page.keyboard.press('Tab');
    if (!(await page.evaluate(() => document.activeElement?.classList.contains('skip')))) {
      await page.goto(base); await page.keyboard.press('Tab');
      if (!(await page.evaluate(() => document.activeElement?.classList.contains('skip')))) fail('first Tab should focus the skip link');
    }
    await ctx.close();
  }
  // Command palette, language suggestion, media kit PDFs
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'nl-NL' });
    const page = await ctx.newPage();
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    const banner = page.locator('.lsug');
    await banner.waitFor({ timeout: 4000 }).catch(() => fail('language suggestion did not appear for a Dutch browser'));
    if (await banner.count()) {
      await banner.locator('button').click();
      const cookies = await ctx.cookies();
      if (!cookies.some((c) => c.name === 'nexify_lang' && c.value === 'en')) fail('"No thanks" did not store the language');
    }
    await page.keyboard.press('Control+k');
    await page.waitForSelector('.cmdk__input:focus').catch(() => fail('Ctrl+K did not open the palette'));
    await page.keyboard.type('resume');
    await page.waitForSelector('.cmdk__item.is-active');
    await page.keyboard.press('Enter');
    await page.waitForURL(`${base}/resume`, { timeout: 5000 }).catch(() => fail('palette did not navigate to /resume'));
    for (const l of ['EN', 'NL', 'PT']) {
      const r = await fetch(`${base}/media-kit/Nexify-Media-Kit-${l}.pdf`);
      if (r.status !== 200 || !(r.headers.get('content-type') || '').includes('pdf')) fail(`media kit ${l} PDF not served`);
    }
    const ds = await (await fetch(`${base}/api/discord-status`)).json();
    if (typeof ds.enabled !== 'boolean' || (ds.enabled && !['online', 'idle', 'dnd', 'offline'].includes(ds.status))) fail(`unexpected discord status payload: ${JSON.stringify(ds)}`);
    if (Object.keys(ds).some((k) => !['enabled', 'status', 'game'].includes(k))) fail('discord status leaks extra fields');
    await ctx.close();
  }
  // Reduced motion: nothing stays hidden
  {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(`${base}/achievements`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    const hidden = await page.$$eval('[data-reveal]', (els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
    if (hidden) fail(`reduced motion: ${hidden} elements hidden`);
    await ctx.close();
  }
} finally {
  await browser.close();
  stopServer();
}
console.log(failures.length ? `\n${failures.length} problem(s).` : `\nAll browser checks passed (${checked.size} internal links).`);
process.exit(failures.length ? 1 : 0);
