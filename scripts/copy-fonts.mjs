// Copies the self-hosted font CSS + only the woff2 files it references into
// public/fonts, so fonts are plain static files (works on any host, incl. Vercel).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const name of ['sora', 'inter']) {
  const src = path.join(root, 'node_modules/@fontsource-variable', name);
  const dest = path.join(root, 'public/fonts', name);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.join(dest, 'files'), { recursive: true });
  const css = fs.readFileSync(path.join(src, 'index.css'), 'utf8');
  for (const [, file] of css.matchAll(/url\(\.\/files\/([^)]+\.woff2)\)/g)) {
    fs.copyFileSync(path.join(src, 'files', file), path.join(dest, 'files', file));
  }
  fs.writeFileSync(path.join(dest, 'index.css'), css);
  fs.copyFileSync(path.join(src, 'LICENSE'), path.join(dest, 'LICENSE'));
}
console.log('Fonts copied to public/fonts');
