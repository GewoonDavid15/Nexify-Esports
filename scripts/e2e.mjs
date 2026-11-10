/**
 * Browser checks with Playwright: every route x language x viewport for console
 * errors, horizontal overflow and broken internal links, plus key interactions.
 * Usage: npm run test:e2e   (set SCREENSHOTS=dir to save screenshots)
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { createApp } from '../server.js';
import { routes } from '../src/routes.js';

const { chromium, devices } = createRequire(import.meta.url)('playwright');
const shotDir = process.env.SCREENSHOTS;
if (shotDir) fs.mkdirSync(shotDir, { recursive: true });

const server = await new Promise((r) => { const s = createApp({ env: {} }).listen(0, '127.0.0.1', () => r(s)); });
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const failures = [];
const fail = (msg) => { failures.push(msg); console.error(`✗ ${msg}`); };
const checkedLinks = new Map();

async function checkLink(href) {
  if (checkedLinks.has(href)) return checkedLinks.get(href);
  const res = await fetch(href, { redirect: 'manual' });
  checkedLinks.set(href, res.status);
  return res.status;
}

const viewports = [
  { name: 'desktop', options: { viewport: { width: 1440, height: 900 } } },
  { name: 'tablet', options: { viewport: { width: 820, height: 1180 } } },
  { name: 'mobile', options: { ...devices['iPhone 13'] } },
];

for (const vp of viewports) {
  for (const lang of ['en', 'nl', 'pt']) {
    const context = await browser.newContext(vp.options);
    await context.addCookies([{ name: 'nexify_lang', value: lang, url: base }]);
    const page = await context.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(e.message));
    for (const r of routes) {
      await page.goto(base + r.path, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) fail(`${vp.name}/${lang} ${r.path}: horizontal overflow ${overflow}px`);
      const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
      for (const h of hrefs) {
        if (h.startsWith('/')) {
          const st = await checkLink(base + h);
          if (st >= 400) fail(`${r.path}: broken link ${h} (${st})`);
        }
      }
      if (shotDir && (lang === 'en' || r.path === '/')) {
        await page.evaluate(() => document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible')));
        await page.screenshot({ path: path.join(shotDir, `${vp.name}-${lang}${r.path === '/' ? '-home' : r.path.replace(/\//g, '-')}.png`), fullPage: true });
      }
    }
    if (errors.length) fail(`${vp.name}/${lang}: console errors: ${errors.join(' | ')}`);
    await context.close();
  }
}

// ---- Interactions ----
{
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();
  await page.goto(`${base}/skills`);
  // Mobile menu via keyboard
  const toggle = page.locator('[data-menu-toggle]');
  await toggle.focus();
  await page.keyboard.press('Enter');
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') fail('mobile menu did not open with Enter');
  if (!(await page.locator('#site-nav .nav-link').first().isVisible())) fail('mobile menu links not visible');
  await page.keyboard.press('Escape');
  if ((await toggle.getAttribute('aria-expanded')) !== 'false') fail('mobile menu did not close with Escape');
  // Language switch keeps current page
  await toggle.click();
  await page.locator('#site-nav [data-lang="nl"]').click();
  await page.waitForURL(`${base}/skills`);
  if ((await page.getAttribute('html', 'lang')) !== 'nl') fail('language switch did not apply NL');
  await page.reload();
  if ((await page.getAttribute('html', 'lang')) !== 'nl') fail('language not remembered after reload');
  await page.goto(`${base}/about`);
  if ((await page.getAttribute('html', 'lang')) !== 'nl') fail('language not remembered across navigation');
  // CV download (mobile)
  await page.goto(`${base}/resume`);
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('a[download]').first().click()]);
  if (download.suggestedFilename() !== 'Nexify-CV.pdf') fail(`unexpected download name ${download.suggestedFilename()}`);
  // Contact client-side validation + not-configured state
  await page.goto(`${base}/contact`);
  if (!(await page.locator('[data-submit]').isDisabled())) fail('submit should be disabled when no provider is configured');
  await page.fill('#f-email', 'not-an-email');
  await page.locator('#f-email').blur();
  const err = await page.textContent('[data-error-for="email"]');
  if (!err || !err.trim()) fail('client-side email validation message missing');
  await context.close();
}
{
  // Desktop: CV download + keyboard focus visible on nav
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  await page.goto(`${base}/resume`);
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('a[download]').first().click()]);
  const file = await download.path();
  if (!fs.readFileSync(file).subarray(0, 5).toString().startsWith('%PDF')) fail('downloaded CV is not a PDF');
  await page.goto(`${base}/`);
  await page.keyboard.press('Tab');
  const skipVisible = await page.evaluate(() => document.activeElement.classList.contains('skip-link'));
  if (!skipVisible) fail('first Tab should focus the skip link');
  await context.close();
}
{
  // Reduced motion: reveal content is visible immediately
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(`${base}/achievements`);
  const hidden = await page.$$eval('.reveal', (els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
  if (hidden) fail(`reduced motion: ${hidden} elements not fully visible`);
  await context.close();
}

await browser.close();
server.close();
console.log(failures.length ? `\n${failures.length} problem(s) found.` : `\nAll browser checks passed (${checkedLinks.size} internal links checked).`);
process.exit(failures.length ? 1 : 0);
