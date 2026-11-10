/**
 * Renders /media-kit in each language to public/media-kit/Nexify-Media-Kit-{LANG}.pdf.
 * Requires a production build (`npm run build`). Usage: npm run build:mediakit
 */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/media-kit');
fs.mkdirSync(out, { recursive: true });
const PORT = 3998;
const base = `http://127.0.0.1:${PORT}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(PORT), '-H', '127.0.0.1'], { cwd: root, stdio: 'ignore', detached: true, env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
try {
  for (let i = 0; i < 60; i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }
  const { chromium } = createRequire(import.meta.url)('playwright');
  const browser = await chromium.launch();
  for (const lang of ['en', 'nl', 'pt']) {
    const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } });
    await page.goto(`${base}/media-kit?lang=${lang}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
    const file = path.join(out, `Nexify-Media-Kit-${lang.toUpperCase()}.pdf`);
    await page.pdf({ path: file, format: 'A4', printBackground: true, scale: 0.78, margin: { top: '8mm', bottom: '8mm', left: '8mm', right: '8mm' } });
    console.log(`${path.relative(root, file)} ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
    await page.close();
  }
  await browser.close();
} finally { stop(); }
