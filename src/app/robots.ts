import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { siteUrl } from '@/lib/config';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000';
  const base = siteUrl(`${h.get('x-forwarded-proto') || (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https')}://${host}`);
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/lang/'] }, sitemap: `${base}/sitemap.xml` };
}
