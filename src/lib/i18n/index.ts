import en, { type Dict } from './en';
import nl from './nl';
import pt from './pt';
import { DEFAULT_LANG, isLang, type Lang } from '../config';

export type { Dict };
export const dictionaries: Record<Lang, Dict> = { en, nl, pt };

export const locales: Record<Lang, string> = { en: 'en', nl: 'nl', pt: 'pt-PT' };

export function getDict(lang: string | null | undefined): Dict {
  return dictionaries[isLang(lang) ? lang : DEFAULT_LANG];
}

export { fmt } from './fmt';
