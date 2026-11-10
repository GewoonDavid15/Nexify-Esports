import { i18nFromParams, type LangParams } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { testimonials } from '@/lib/testimonials';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { EmptyState, PageHero } from '@/components/sections/Blocks';

export const generateMetadata = ({ params }: LangParams) => pageMeta(params, 'testimonials', '/testimonials');

export default async function Testimonials({ params }: LangParams) {
  const { d } = await i18nFromParams(params);
  const t = d.testimonials;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="sec sec--top0"><div className="wrap">
        {testimonials.length ? (
          <div className="grid grid--3">
            {testimonials.map((q) => (
              <figure key={q.name + q.quote.slice(0, 20)} className="card quote-card" data-reveal="" data-spot="">
                <Icon name="quote" className="quote-card__icon" />
                <blockquote lang={q.lang}><p>{q.quote}</p></blockquote>
                <figcaption><strong>{q.name}</strong><span>{q.role}{q.org ? ` · ${q.org}` : ''}</span></figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="wrap--narrow" style={{ margin: '0 auto' }}>
            <EmptyState icon="quote" title={t.emptyTitle} text={t.emptyText} actions={<Button href="/contact">{t.emptyCta}</Button>} />
          </div>
        )}
      </div></section>
    </>
  );
}
