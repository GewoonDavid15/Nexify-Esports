// Renders public/og-image.png (1200x630) — the link preview for Discord, X, etc.
// Text is language-neutral and only states facts from the resume.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Fonts are inlined as data URLs so they load inside setContent().
const font = (p) => `data:font/woff2;base64,${fs.readFileSync(path.join(root, 'public/fonts', p)).toString('base64')}`;
const html = `<!doctype html><html><head><style>
@font-face { font-family: Display; src: url(${font('bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2')}) format('woff2'); font-weight: 100 800; }
@font-face { font-family: Inter; src: url(${font('inter/files/inter-latin-wght-normal.woff2')}) format('woff2'); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; position: relative; font-family: Inter, sans-serif; color: #f4f0fb;
  background: radial-gradient(900px 520px at 92% -10%, rgba(147,51,234,.5), transparent 62%),
              radial-gradient(700px 420px at -5% 105%, rgba(217,70,239,.2), transparent 60%),
              linear-gradient(160deg, #150f22, #09070d 60%); }
.cloud { position: absolute; border-radius: 50%; filter: blur(60px); }
.c1 { width: 520px; height: 260px; right: -60px; top: 120px; background: rgba(124,58,237,.35); }
.c2 { width: 420px; height: 200px; left: 380px; bottom: -90px; background: rgba(233,213,255,.10); }
.wrap { position: absolute; inset: 0; padding: 72px 80px; display: flex; flex-direction: column; }
.top { display: flex; align-items: center; gap: 16px; font-family: Display; font-weight: 700; font-size: 30px; }
.pill { margin-left: auto; display: flex; align-items: center; gap: 12px; padding: 12px 22px; border-radius: 999px; font-size: 24px; font-weight: 600;
  background: rgba(134,227,173,.10); border: 2px solid rgba(134,227,173,.45); color: #f4f0fb; }
.dot { width: 14px; height: 14px; border-radius: 50%; background: #86e3ad; box-shadow: 0 0 18px #86e3ad; }
h1 { margin-top: auto; font-family: Display; font-weight: 760; font-size: 188px; line-height: .9; letter-spacing: -.055em;
  background: linear-gradient(100deg, #f5ecff 0%, #d8b4fe 32%, #a855f7 66%, #7c3aed 100%); -webkit-background-clip: text; color: transparent; padding-bottom: 14px; }
.sub { font-size: 38px; font-weight: 600; color: #f4f0fb; margin-top: 10px; }
.sub span { color: #c084fc; }
.meta { font-size: 24px; color: #c8c0db; margin-top: 18px; }
.bar { position: absolute; left: 0; right: 0; bottom: 0; height: 8px; background: linear-gradient(90deg, #3b1574, #7e22ce, #a21caf); }
</style></head><body>
<div class="cloud c1"></div><div class="cloud c2"></div>
<div class="wrap">
  <div class="top">
    <svg width="56" height="56" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0e2ff"/><stop offset=".55" stop-color="#c084fc"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs><rect x="1.5" y="1.5" width="37" height="37" rx="11" fill="rgba(168,85,247,.1)" stroke="url(#g)" stroke-width="1.6"/><path d="M12.5 28V12.5h.4L27 27.5h.5V12" fill="none" stroke="url(#g)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Nexify
    <div class="pill"><span class="dot"></span>Open to offers</div>
  </div>
  <h1>Nexify</h1>
  <p class="sub">Esports Social Media Manager <span>·</span> Competitive Fortnite</p>
  <p class="meta">In esports since 2020 · 7 organizations · Based in the Netherlands</p>
</div>
<div class="bar"></div>
</body></html>`;

const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(root, 'public/og-image.png') });
await browser.close();
console.log('Rendered public/og-image.png');
