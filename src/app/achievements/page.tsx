import { getI18n } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { socials } from '@/lib/config';
import { Button, CvButton } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Callout, CtaBand, PageHero, SectionHead } from '@/components/sections/Blocks';
import { Highlights, Timeline } from '@/components/sections/Experience';

export const generateMetadata = () => pageMeta('achievements', '/achievements');

export default async function Achievements() {
  const { d } = await getI18n();
  const a = d.achievements;
  const tracker = socials.find((s) => s.id === 'tracker')!;
  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title} lead={a.lead} />
      <div className="wrap"><Callout title={a.clarifyTitle} text={a.clarifyText} tone="warn" /></div>
      <section className="sec" aria-labelledby="hl-title">
        <div className="wrap">
          <SectionHead title={a.highlightsTitle} id="hl-title" />
          <Highlights d={d} cols={4} />
        </div>
      </section>
      <section className="sec" aria-labelledby="tl-title">
        <div className="wrap">
          <SectionHead title={a.timelineTitle} lead={d.resume.experienceNote} id="tl-title" />
          <Timeline d={d} />
        </div>
      </section>
      <section className="sec sec--tight" aria-labelledby="tracker-title">
        <div className="wrap">
          <div className="extprofile" data-reveal="" data-spot="">
            <span className="card__icon" aria-hidden><Icon name="tracker" /></span>
            <div>
              <p className="kicker">{d.common.external}</p>
              <h2 className="card__title" id="tracker-title">{a.trackerTitle}</h2>
              <p className="card__text">{a.trackerText}</p>
            </div>
            <Button href={tracker.href!} variant="ghost" icon="external" external newTabLabel={d.common.newTab}>{a.trackerLink}</Button>
          </div>
        </div>
      </section>
      <CtaBand d={d} title={d.home.ctaTitle} text={d.home.ctaText} secondary={<CvButton label={d.common.downloadCv} variant="outline-light" />} />
    </>
  );
}
