import { getI18n } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { socials } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { EmptyState, PageHero } from '@/components/sections/Blocks';

export const generateMetadata = () => pageMeta('portfolio', '/portfolio');

export default async function Portfolio() {
  const { d } = await getI18n();
  const p = d.portfolio;
  const yt = socials.find((s) => s.id === 'youtube')!;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
      <section className="sec sec--top0"><div className="wrap wrap--narrow">
        <EmptyState icon="folder" title={p.emptyTitle} text={p.emptyText} hint={p.emptyHint}
          actions={<><Button href={yt.href!} variant="ghost" icon="youtube" iconFirst external newTabLabel={d.common.newTab}>{p.youtube}</Button><Button href="/contact">{d.common.contactMe}</Button></>} />
      </div></section>
    </>
  );
}
