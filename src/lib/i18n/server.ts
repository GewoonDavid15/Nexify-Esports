import 'server-only';
import { headers } from 'next/headers';
import { DEFAULT_LANG, LANG_HEADER, PATH_HEADER, isLang, siteUrl, type Lang } from '../config';
import { getDict, type Dict } from '.';

/** Language chosen by proxy.ts (query > cookie > English). */
export async function getLang(): Promise<Lang> {
  const h = await headers();
  const v = h.get(LANG_HEADER);
  return isLang(v) ? v : DEFAULT_LANG;
}

export async function getI18n(): Promise<{ lang: Lang; d: Dict }> {
  const lang = await getLang();
  return { lang, d: getDict(lang) };
}

export async function getPathname(): Promise<string> {
  const h = await headers();
  return h.get(PATH_HEADER) || '/';
}

export async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000';
  const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return siteUrl(`${proto}://${host}`);
}
