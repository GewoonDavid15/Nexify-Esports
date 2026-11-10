import en from './en.js';
import nl from './nl.js';
import pt from './pt.js';
import { LANGS, DEFAULT_LANG } from '../config.js';

export const dictionaries = { en, nl, pt };

export function isLang(value) {
  return typeof value === 'string' && LANGS.includes(value);
}

function lookup(dict, path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), dict);
}

export function interpolate(str, vars = {}) {
  return String(str).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** Create a translator for one language. Falls back to English, then to the key. */
export function translator(lang) {
  const dict = dictionaries[isLang(lang) ? lang : DEFAULT_LANG];
  const t = (path, vars) => {
    let v = lookup(dict, path);
    if (v === undefined) v = lookup(dictionaries[DEFAULT_LANG], path);
    if (v === undefined) return path;
    return typeof v === 'string' ? interpolate(v, vars) : v;
  };
  t.lang = isLang(lang) ? lang : DEFAULT_LANG;
  t.dict = dict;
  return t;
}
