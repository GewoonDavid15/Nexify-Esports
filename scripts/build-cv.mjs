/**
 * Builds public/cv/Nexify-CV.pdf.
 *
 * 1. Preferred: if the original resume DOCX exists in attached_assets/, it is
 *    converted to PDF unchanged with LibreOffice (`soffice --headless`).
 * 2. Fallback: a PDF is rendered (via Playwright/Chromium) from the resume
 *    facts in src/resume.js + src/i18n/en.js only — nothing is added.
 *
 * Usage: npm run build:cv
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import { experience, resumeSkills, tools } from '../src/resume.js';
import { translator } from '../src/i18n/index.js';
import { site, socials } from '../src/config.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/cv');
const outFile = path.join(outDir, site.cv.fileName);
fs.mkdirSync(outDir, { recursive: true });

const assetsDir = path.join(root, 'attached_assets');
const docx = fs.existsSync(assetsDir)
  ? fs.readdirSync(assetsDir).find((f) => /^Nexify_Resume.*\.docx$/i.test(f))
  : null;

if (docx) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nexify-cv-'));
  execFileSync('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', tmp, path.join(assetsDir, docx)], { stdio: 'inherit' });
  const pdf = fs.readdirSync(tmp).find((f) => f.endsWith('.pdf'));
  fs.copyFileSync(path.join(tmp, pdf), outFile);
  console.log(`Converted ${docx} -> ${path.relative(root, outFile)}`);
  process.exit(0);
}

console.warn('Original DOCX not found in attached_assets/ — rendering the CV from the resume facts in src/.');
const t = translator('en');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const contactLines = [
  `Email: ${site.contactEmail}`,
  ...socials.map((s) => `${s.label}: ${s.href ? s.href.replace(/^https:\/\//, '') : s.handle}`),
];

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Nexify — CV</title>
<style>
  @page { size: A4; margin: 16mm 16mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; color: #1d1712; font-size: 10.5pt; line-height: 1.5; margin: 0; }
  header { border-bottom: 3px solid #ff8a3d; padding-bottom: 10pt; margin-bottom: 14pt; display: flex; justify-content: space-between; gap: 20pt; }
  h1 { font-size: 30pt; margin: 0; letter-spacing: -0.03em; color: #1d1712; }
  .title { color: #c2541a; font-weight: 600; margin: 2pt 0 6pt; font-size: 11.5pt; }
  .status { display: inline-block; font-size: 9pt; font-weight: 700; padding: 2pt 8pt; border-radius: 10pt; background: #fff1e4; color: #a24412; border: 1px solid #ffc9a1; }
  .contact { font-size: 9pt; color: #4a3f36; text-align: right; line-height: 1.6; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 0.12em; color: #c2541a; margin: 16pt 0 6pt; border-bottom: 1px solid #f0dccb; padding-bottom: 3pt; }
  .role { display: grid; grid-template-columns: 1fr auto; gap: 2pt 12pt; padding: 5pt 0; border-bottom: 1px dotted #ead8c8; break-inside: avoid; }
  .role b { font-size: 11pt; } .role .when { color: #6b5a4c; font-weight: 600; text-align: right; } .role .what { color: #3a2f27; } .role .where { color: #6b5a4c; text-align: right; font-size: 9.5pt; }
  ul.chips { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 4pt; }
  ul.chips li { border: 1px solid #f0d2b8; background: #fff8f1; border-radius: 8pt; padding: 1pt 7pt; font-size: 9.5pt; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16pt; }
  blockquote { margin: 16pt 0 0; padding: 10pt 14pt; border-left: 3px solid #ff8a3d; background: #fff6ee; font-style: italic; color: #3a2f27; }
  dl { display: grid; grid-template-columns: auto 1fr; gap: 2pt 12pt; margin: 6pt 0 0; } dt { color: #6b5a4c; font-weight: 600; } dd { margin: 0; }
</style></head><body>
<header>
  <div><h1>Nexify</h1><p class="title">Fortnite Player · Esports Social Media Manager</p><span class="status">${esc(t('home.statusValue'))}</span></div>
  <div class="contact">${contactLines.map(esc).join('<br>')}</div>
</header>
<h2>${esc(t('resume.profileTitle'))}</h2>
<p>${esc(t('resume.profileText'))}</p>
<dl>${t('resume.details').map((d) => `<dt>${esc(d.label)}</dt><dd>${esc(d.value)}</dd>`).join('')}</dl>
<h2>${esc(t('resume.experienceTitle'))}</h2>
${[...experience].reverse().map((e) => `<div class="role"><b>${esc(e.org)}</b><span class="when">${esc(t(`periods.${e.period}`))}</span><span class="what">${esc(t(`roles.${e.role}`))}</span><span class="where">${esc(e.countries.map((c) => t(`countries.${c}`)).join(', '))}</span></div>`).join('')}
<div class="cols">
  <div><h2>${esc(t('resume.skillsTitle'))}</h2><ul class="chips">${resumeSkills.map((k) => `<li>${esc(t(`skills.${k}`))}</li>`).join('')}</ul></div>
  <div><h2>${esc(t('resume.toolsTitle'))}</h2><ul class="chips">${tools.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
</div>
<blockquote>“${esc(t('quote.text'))}”</blockquote>
</body></html>`;

// Playwright may be installed globally (resolved via NODE_PATH) or locally.
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.pdf({ path: outFile, format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(`Rendered ${path.relative(root, outFile)}`);
