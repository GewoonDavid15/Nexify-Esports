import type { Metadata } from 'next';
import { dictionaries } from '@/lib/i18n';
import { NotFoundBody } from '@/components/sections/NotFoundBody';

export const metadata: Metadata = { title: { absolute: 'Page not found · Nexify' }, robots: { index: false } };

export default function NotFound() {
  const pick = (l: 'en' | 'nl' | 'pt') => {
    const d = dictionaries[l];
    return { eyebrow: d.notFound.eyebrow, title: d.notFound.title, text: d.notFound.text, home: d.common.backHome, contact: d.nav.contact };
  };
  return <NotFoundBody texts={{ en: pick('en'), nl: pick('nl'), pt: pick('pt') }} />;
}
