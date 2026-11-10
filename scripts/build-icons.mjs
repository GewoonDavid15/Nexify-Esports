/** Renders the app icons (PWA + Apple touch icon) from public/favicon.svg. Usage: npm run build:icons */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svg = fs.readFileSync(path.join(root, 'public/favicon.svg'), 'utf8');
const { chromium } = createRequire(import.meta.url)('playwright');
const out = path.join(root, 'public/icons');
fs.mkdirSync(out, { recursive: true });

// "any" icons use the logo as-is; maskable/apple icons get a full-bleed background and safe-zone padding.
const jobs = [
  { file: 'icon-192.png', size: 192, pad: 0, bg: 'transparent' },
  { file: 'icon-512.png', size: 512, pad: 0, bg: 'transparent' },
  { file: 'maskable-512.png', size: 512, pad: 0.2, bg: '#0a0b10' },
  { file: 'apple-touch-icon.png', size: 180, pad: 0.12, bg: '#0a0b10' },
];
const browser = await chromium.launch();
for (const j of jobs) {
  const page = await browser.newPage({ viewport: { width: j.size, height: j.size } });
  const inner = Math.round(j.size * (1 - 2 * j.pad));
  await page.setContent(`<html><body style="margin:0;width:${j.size}px;height:${j.size}px;display:grid;place-items:center;background:${j.bg}">
    <div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', `<svg width="${inner}" height="${inner}" `)}</div></body></html>`);
  await page.screenshot({ path: path.join(out, j.file), omitBackground: j.bg === 'transparent' });
  await page.close();
}
await browser.close();
console.log(`Rendered ${jobs.length} icons in public/icons/`);
