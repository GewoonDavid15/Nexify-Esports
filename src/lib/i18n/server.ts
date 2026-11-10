import 'server-only';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { DEFAULT_LANG, LANG_HEADER, isLang, siteUrl, type Lang } from '../config';
import { getDict, type Dict } from '.';

/** Props every page/layout under app/[lang] receives. */
export interface LangParams { params: Promise<{ lang: string }> }

/** Pages are statically generated per language; proxy.ts rewrites /x → /{lang}/x. */
export async function i18nFromParams(params: LangParams['params']): Promise<{ lang: Lang; d: Dict }> {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return { lang, d: getDict(lang) };
}

/** Only for dynamically rendered routes (e.g. not-found): language chosen by proxy.ts. */
export async function getLang(): Promise<Lang> {
  const v = (await headers()).get(LANG_HEADER);
  return isLang(v) ? v : DEFAULT_LANG;
}

export function getBaseUrl(): string {
  return siteUrl('http://localhost:3000');
}
