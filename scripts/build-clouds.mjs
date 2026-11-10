// Renders the atmospheric cloud textures (public/img/clouds-*.webp) once, from
// SVG fractal noise in Chromium, then encodes them as WebP with Python/Pillow.
// Usage: npm run build:clouds
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nexify-clouds-'));

// alpha = clamp(k * noise + offset): k/offset shape how "puffy" the clouds are.
const layer = ({ w, h, freq, oct, seed, k, off, color, mask }) => `<!doctype html><html><body style="margin:0;background:transparent">
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <filter id="f" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" seed="${seed}" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 ${color[0]}  0 0 0 0 ${color[1]}  0 0 0 0 ${color[2]}  ${k} 0 0 0 ${off}"/>
    </filter>
    <linearGradient id="m" x1="0" y1="0" x2="0" y2="1">${mask}</linearGradient>
    <mask id="mk"><rect width="100%" height="100%" fill="url(#m)"/></mask>
  </defs>
  <rect width="100%" height="100%" filter="url(#f)" mask="url(#mk)"/>
</svg></body></html>`;

const jobs = [
  { name: 'clouds-back', w: 2400, h: 1500, freq: '0.0012 0.0024', oct: 5, seed: 11, k: 2.6, off: -1.15, color: [0.7, 0.6, 1],
    mask: '<stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#999"/><stop offset="1" stop-color="#333"/>' },
  { name: 'clouds-front', w: 2400, h: 900, freq: '0.0016 0.004', oct: 5, seed: 29, k: 2.8, off: -1.3, color: [0.86, 0.82, 1],
    mask: '<stop offset="0" stop-color="#000"/><stop offset=".35" stop-color="#666"/><stop offset=".75" stop-color="#fff"/><stop offset="1" stop-color="#fff"/>' },
];

const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
for (const j of jobs) {
  const page = await browser.newPage({ viewport: { width: j.w, height: j.h } });
  await page.setContent(layer(j));
  const png = path.join(tmp, `${j.name}.png`);
  await page.screenshot({ path: png, omitBackground: true });
  const out = path.join(root, 'public/img', `${j.name}.webp`);
  // Downscale (the texture is blurry by nature) and encode as WebP with alpha.
  execFileSync('python3', ['-I', '-c', `import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGBA')
im = im.resize((im.width // 5, im.height // 5), Image.LANCZOS)
im.save(sys.argv[2], 'WEBP', quality=55, method=6)`, png, out]);
  console.log(`${path.relative(root, out)} ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
  await page.close();
}
await browser.close();
