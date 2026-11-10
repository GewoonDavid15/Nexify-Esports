import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { LANGS, siteUrl, type Lang } from '@/lib/config';
import { locales } from '@/lib/i18n';

const paths = ['/', '/about', '/achievements', '/resume', '/skills', '/services', '/portfolio', '/testimonials', '/contact', '/nexify-dev', '/privacy', '/terms', '/cookies', '/disclaimer'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000';
  const base = siteUrl(`${h.get('x-forwarded-proto') || (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https')}://${host}`);
  const url = (p: string, c: Lang) => `${base}${p}${c === 'en' ? '' : `?lang=${c}`}`;
  return paths.flatMap((p) => LANGS.map((c) => ({
    url: url(p, c),
    alternates: { languages: Object.fromEntries([...LANGS.map((l) => [locales[l], url(p, l)]), ['x-default', url(p, 'en')]]) },
  })));
}
