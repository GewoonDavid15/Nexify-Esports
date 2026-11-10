// Verifies that nl.js and pt.js have exactly the same keys (and array lengths) as en.js,
// and that no translated string is empty (except intentionally empty quote.translation in en).
import { dictionaries } from '../src/i18n/index.js';

const problems = [];
function walk(ref, other, lang, p = '') {
  if (Array.isArray(ref)) {
    if (!Array.isArray(other)) return problems.push(`${lang}: ${p} should be an array`);
    if (ref.length !== other.length) problems.push(`${lang}: ${p} has ${other.length} items, en has ${ref.length}`);
    ref.forEach((v, i) => walk(v, other[i], lang, `${p}[${i}]`));
  } else if (ref && typeof ref === 'object') {
    if (!other || typeof other !== 'object') return problems.push(`${lang}: ${p} missing`);
    for (const k of Object.keys(ref)) walk(ref[k], other[k], lang, p ? `${p}.${k}` : k);
    for (const k of Object.keys(other)) if (!(k in ref)) problems.push(`${lang}: extra key ${p ? `${p}.${k}` : k}`);
  } else if (typeof other !== typeof ref) {
    problems.push(`${lang}: ${p} missing or wrong type`);
  } else if (typeof other === 'string' && other.trim() === '' && !(lang === 'en' || p === 'quote.translation')) {
    problems.push(`${lang}: ${p} is empty`);
  }
  // Placeholders must match.
  if (typeof ref === 'string' && typeof other === 'string') {
    const ph = (s) => (s.match(/\{\w+\}/g) || []).sort().join(',');
    if (ph(ref) !== ph(other)) problems.push(`${lang}: ${p} placeholders differ (${ph(ref)} vs ${ph(other)})`);
  }
}
for (const lang of Object.keys(dictionaries)) if (lang !== 'en') walk(dictionaries.en, dictionaries[lang], lang);

if (problems.length) {
  console.error(`i18n check failed:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`i18n OK — ${Object.keys(dictionaries).join(', ')} have matching keys.`);
