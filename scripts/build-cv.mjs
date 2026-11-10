/**
 * Builds public/cv/Nexify-CV.pdf from the official resume DOCX in
 * attached_assets/ (Nexify_Resume*.docx), converted unchanged with LibreOffice.
 * Replace the DOCX there and re-run to update the download.
 *
 * Usage: npm run build:cv   (requires `soffice` / LibreOffice)
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = path.join(root, 'attached_assets');
const outFile = path.join(root, 'public/cv/Nexify-CV.pdf');

const docx = fs.existsSync(assetsDir)
  ? fs.readdirSync(assetsDir).filter((f) => /^Nexify_Resume.*\.docx$/i.test(f)).sort().pop()
  : null;
if (!docx) {
  console.error('No attached_assets/Nexify_Resume*.docx found — nothing to convert.');
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nexify-cv-'));
execFileSync('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', tmp, path.join(assetsDir, docx)], { stdio: 'inherit' });
const pdf = fs.readdirSync(tmp).find((f) => f.endsWith('.pdf'));
if (!pdf) {
  console.error('LibreOffice did not produce a PDF.');
  process.exit(1);
}
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.copyFileSync(path.join(tmp, pdf), outFile);
console.log(`Converted ${docx} -> ${path.relative(root, outFile)}`);
