/**
 * Renders a share image per page and language: public/og/{lang}/{page}.jpg (1200x630).
 * Titles and descriptions are read from the built site, so run `npm run build` first.
 * Usage: npm run build:og-pages
 */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = createRequire(import.meta.url)('playwright');
const PORT = 3997;
const base = `http://127.0.0.1:${PORT}`;
const routes = ['/', '/about', '/achievements', '/resume', '/skills', '/services', '/portfolio', '/testimonials', '/contact', '/nexify-dev', '/privacy', '/terms', '/cookies', '/disclaimer', '/media-kit'];
const langs = ['en', 'nl', 'pt'];

const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(PORT), '-H', '127.0.0.1'], { cwd: root, stdio: 'ignore', detached: true });
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
for (let i = 0; i < 60; i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }

const font = (p) => `data:font/woff2;base64,${fs.readFileSync(path.join(root, 'node_modules/@fontsource-variable', p)).toString('base64')}`;
const avatar = `data:image/webp;base64,${fs.readFileSync(path.join(root, 'public/img/avatar.webp')).toString('base64')}`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const meta = (html, prop) => decode((html.match(new RegExp(`<meta (?:property|name)="${prop}" content="([^"]*)"`)) || [])[1] || '');

const card = ({ title, desc, kicker }) => `<!doctype html><html><head><style>
@font-face { font-family: Display; src: url(${font('archivo/files/archivo-latin-wght-normal.woff2')}) format('woff2'); font-weight: 100 800; }
@font-face { font-family: Inter; src: url(${font('inter/files/inter-latin-wght-normal.woff2')}) format('woff2'); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; position: relative; font-family: Inter, sans-serif; color: #f4f4f5;
  background: radial-gradient(900px 520px at 90% -10%, rgba(124, 82, 230, .45), transparent 62%), radial-gradient(600px 380px at 0% 110%, rgba(176, 139, 255, .16), transparent 60%), #0a0b10; }
.grid { position: absolute; inset: 0; opacity: .5; background-image: linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px); background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(70% 70% at 70% 10%, #000, transparent 80%); }
.wrap { position: absolute; inset: 0; padding: 64px 72px; display: flex; flex-direction: column; }
.top { display: flex; align-items: center; gap: 14px; font: 800 26px/1 Display; letter-spacing: .06em; text-transform: uppercase; }
.top img { margin-left: auto; width: 96px; height: 96px; border-radius: 50%; border: 2px solid rgba(176,139,255,.5); object-fit: cover; }
.kicker { margin-top: auto; font: 600 24px/1 Inter; color: #c9b0ff; letter-spacing: .02em; }
h1 { margin-top: 18px; font: 600 92px/1.02 Display; letter-spacing: -.035em; color: #fff; max-width: 1000px; }
p { margin-top: 22px; font-size: 28px; line-height: 1.4; color: #a1a1aa; max-width: 980px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.bar { position: absolute; left: 0; right: 0; bottom: 0; height: 8px; background: linear-gradient(90deg, #d4c0ff, #a77dff, #7c3aed); }
</style></head><body><div class="grid"></div><div class="wrap">
<div class="top"><svg width="48" height="48" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0e2ff"/><stop offset=".55" stop-color="#c084fc"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs><rect x="1.5" y="1.5" width="37" height="37" rx="11" fill="rgba(168,85,247,.1)" stroke="url(#g)" stroke-width="1.6"/><path d="M12.5 28V12.5h.4L27 27.5h.5V12" fill="none" stroke="url(#g)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>Nexify<img src="${avatar}" alt=""></div>
<div class="kicker">${esc(kicker)}</div><h1>${esc(title)}</h1><p>${esc(desc)}</p></div><div class="bar"></div></body></html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const lang of langs) {
    fs.mkdirSync(path.join(root, 'public/og', lang), { recursive: true });
    for (const r of routes) {
      const html = await (await fetch(`${base}${r}?lang=${lang}`)).text();
      const full = meta(html, 'og:title');
      const [title, ...rest] = full.split(' · ');
      const isHome = r === '/';
      const slug = isHome ? 'home' : r.slice(1);
      await page.setContent(card({ title: isHome ? 'Nexify' : title, desc: meta(html, 'og:description'), kicker: isHome ? full.replace(/^Nexify\s*[—–-]\s*/, '') : 'nezifyesportss.vercel.app' }), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(root, 'public/og', lang, `${slug}.jpg`), type: 'jpeg', quality: 86 });
      void rest;
    }
    console.log(`Rendered ${routes.length} images for ${lang}`);
  }
} finally { await browser.close(); stop(); }
