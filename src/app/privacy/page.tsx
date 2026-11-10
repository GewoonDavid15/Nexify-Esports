import { getI18n } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { LegalPage } from '@/components/sections/Legal';

export const generateMetadata = () => pageMeta('privacy', '/privacy');

export default async function Page() {
  const { d } = await getI18n();
  return <LegalPage d={d} ns="privacy" />;
}
