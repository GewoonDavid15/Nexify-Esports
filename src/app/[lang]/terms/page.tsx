import { i18nFromParams, type LangParams } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { LegalPage } from '@/components/sections/Legal';

export const generateMetadata = ({ params }: LangParams) => pageMeta(params, 'terms', '/terms');

export default async function Page({ params }: LangParams) {
  const { d, lang } = await i18nFromParams(params);
  return <LegalPage d={d} ns="terms" lang={lang} />;
}
