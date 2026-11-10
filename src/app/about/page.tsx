import { getI18n } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { Button } from '@/components/ui/Button';
import { Counter } from '@/components/motion/Counter';
import { CtaBand, PageHero, Quote, SectionHead, Tile, TileIcon, Chips } from '@/components/sections/Blocks';

export const generateMetadata = () => pageMeta('about', '/about');

export default async function About() {
  const { d } = await getI18n();
  const a = d.about;
  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title} lead={a.lead} />
      <section className="sec sec--top0" aria-labelledby="tracks-title">
        <div className="wrap">
          <SectionHead title={a.tracksTitle} id="tracks-title" />
          <div className="bento bento--3">
            <Tile as="article"><TileIcon name="gamepad" /><h3 className="card__title">{a.playerTitle}</h3><p className="card__text">{a.playerText}</p></Tile>
            <Tile as="article"><TileIcon name="megaphone" /><h3 className="card__title">{a.contentTitle}</h3><p className="card__text">{a.contentText}</p></Tile>
            <Tile as="article"><TileIcon name="bot" /><h3 className="card__title">{a.techTitle}</h3><p className="card__text">{a.techText}</p></Tile>
          </div>
          <div className="bento bento--origin">
            <Tile as="article" className="origin">
              <span className="origin__year" aria-hidden>2020</span>
              <div><h3 className="card__title">{a.founderTitle}</h3><p className="card__text">{a.founderText}</p></div>
            </Tile>
            <Tile as="article" className="b-stat">
              <Counter value={d.home.discordStat.value} className="big-num" />
              <p className="card__text">{d.home.discordStat.label}</p>
            </Tile>
          </div>
        </div>
      </section>
      <section className="sec" aria-labelledby="now-title">
        <div className="wrap">
          <div className="now" data-reveal="" data-spot="">
            <SectionHead title={a.nowTitle} id="now-title" />
            <div className="now__body">
              <p className="now__big">{a.nowText1}</p>
              <p>{a.nowText2}</p>
              <Chips items={[d.skills.ptNative, d.skills.dutch, d.skills.english]} />
              <div className="actions">
                <Button href="/achievements" variant="ghost">{d.nav.achievements}</Button>
                <Button href="/skills" variant="ghost">{d.nav.skills}</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="sec sec--quote" aria-label={a.motivationTitle}><div className="wrap"><Quote d={d} /></div></section>
      <CtaBand d={d} title={d.home.ctaTitle} text={d.home.ctaText} />
    </>
  );
}
