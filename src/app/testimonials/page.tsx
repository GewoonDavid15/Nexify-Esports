import { getI18n } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { Button } from '@/components/ui/Button';
import { EmptyState, PageHero } from '@/components/sections/Blocks';

export const generateMetadata = () => pageMeta('testimonials', '/testimonials');

export default async function Testimonials() {
  const { d } = await getI18n();
  const t = d.testimonials;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="sec sec--top0"><div className="wrap wrap--narrow">
        <EmptyState icon="quote" title={t.emptyTitle} text={t.emptyText} actions={<Button href="/contact">{t.emptyCta}</Button>} />
      </div></section>
    </>
  );
}
