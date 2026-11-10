import { describe, expect, it } from 'vitest';
import { dictionaries } from '../src/lib/i18n';

// TypeScript already enforces identical keys; this also checks array lengths,
// placeholders and that nothing is left empty.
type Node = unknown;
function walk(ref: Node, other: Node, path: string, problems: string[]) {
  if (Array.isArray(ref)) {
    if (!Array.isArray(other) || other.length !== ref.length) problems.push(`${path}: array length`);
    else ref.forEach((v, i) => walk(v, other[i], `${path}[${i}]`, problems));
  } else if (ref && typeof ref === 'object') {
    for (const k of Object.keys(ref)) walk((ref as Record<string, Node>)[k], (other as Record<string, Node>)?.[k], `${path}.${k}`, problems);
  } else if (typeof ref === 'string') {
    if (typeof other !== 'string') { problems.push(`${path}: missing`); return; }
    const ph = (s: string) => (s.match(/\{\w+\}/g) || []).sort().join();
    if (ph(ref) !== ph(other)) problems.push(`${path}: placeholders differ`);
    if (!other.trim() && !path.endsWith('quote.translation')) problems.push(`${path}: empty`);
  }
}

describe('translations', () => {
  for (const lang of ['nl', 'pt'] as const) {
    it(`${lang} matches English shape, arrays and placeholders`, () => {
      const problems: string[] = [];
      walk(dictionaries.en, dictionaries[lang], lang, problems);
      expect(problems).toEqual([]);
    });
  }
});
