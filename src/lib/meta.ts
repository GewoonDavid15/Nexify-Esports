import 'server-only';
import type { Metadata } from 'next';
import { LANGS, site, type Lang } from './config';
import { locales, type Dict } from './i18n';
import { getBaseUrl, getI18n } from './i18n/server';

/** Title, description, canonical + hreflang alternates and social cards for a page. */
export async function pageMeta(key: keyof Dict['meta'], path: string, { noindex = false } = {}): Promise<Metadata> {
  const { lang, d } = await getI18n();
  const base = await getBaseUrl();
  const m = d.meta[key];
  const title = key === 'home' ? m.title : `${m.title} · ${site.name}`;
  const url = (code: Lang) => `${base}${path}${code === 'en' ? '' : `?lang=${code}`}`;
  const languages: Record<string, string> = Object.fromEntries(LANGS.map((c) => [locales[c], url(c)]));
  languages['x-default'] = url('en');
  return {
    metadataBase: new URL(base),
    title: { absolute: title },
    description: m.description,
    robots: noindex ? { index: false } : undefined,
    alternates: noindex ? undefined : { canonical: url(lang), languages },
    openGraph: {
      type: 'website', siteName: site.name, title, description: m.description, url: url(lang),
      locale: locales[lang].replace('-', '_'),
      images: [{ url: `${base}${site.ogImage}`, width: 1200, height: 630, alt: 'Nexify — Esports Social Media Manager & Competitive Fortnite Player' }],
    },
    twitter: { card: 'summary_large_image', site: '@OfficialNexify', title, description: m.description, images: [`${base}${site.ogImage}`] },
  };
}
