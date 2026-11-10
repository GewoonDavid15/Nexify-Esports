import Link from 'next/link';
import { getI18n } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { experience, tools } from '@/lib/resume';
import { Button, CvButton } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { LogoMark } from '@/components/ui/Logo';
import { Scramble } from '@/components/motion/Scramble';
import { RoleCycler } from '@/components/motion/RoleCycler';
import { PlayerCard } from '@/components/motion/PlayerCard';
import { Counter } from '@/components/motion/Counter';
import { AvailabilityBadge, CtaBand, Marquee, Quote, SectionHead, Tile, TileIcon } from '@/components/sections/Blocks';
import { Socials } from '@/components/sections/Socials';

export const generateMetadata = () => pageMeta('home', '/');

export default async function Home() {
  const { d } = await getI18n();
  const c = d.home.card;
  const orgs = [...experience].reverse();

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__floor" aria-hidden />
        <div className="hero__fog" aria-hidden />
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <AvailabilityBadge d={d} />
            <h1 id="hero-title" className="hero__title">
              <Scramble text="NEXIFY" className="hero__word" duration={1100} delay={150} />
            </h1>
            <RoleCycler roles={d.home.roles} label={d.home.eyebrow} />
            <p className="hero__lead">{d.home.lead}</p>
            <div className="actions">
              <Button href="/contact" icon="mail">{d.common.hireMe}</Button>
              <Button href="/resume" variant="ghost">{d.common.viewResume}</Button>
            </div>
            <dl className="hero__stats">
              {d.home.facts.map((f) => (
                <div key={f.label} className="hero__stat">
                  <dt>{f.label}</dt>
                  <dd><Counter value={f.value} /></dd>
                </div>
              ))}
            </dl>
          </div>

          <PlayerCard label={c.label}>
            <div className="pc__top">
              <LogoMark />
              <span className="pc__label">{c.label}</span>
              <span className="pc__badge"><span className="pulse" aria-hidden />{c.statusValue}</span>
            </div>
            <div className="pc__emblem" aria-hidden>
              <span className="pc__ring" />
              <span className="pc__ring pc__ring--2" />
              <span className="pc__n">N</span>
            </div>
            <p className="pc__name">NEXIFY</p>
            <dl className="pc__stats">
              <div><dt>{c.role}</dt><dd>{c.roleValue}</dd></div>
              <div><dt>{c.input}</dt><dd>{c.inputValue}</dd></div>
              <div><dt>{c.base}</dt><dd>{c.baseValue}</dd></div>
              <div><dt>{c.since}</dt><dd>2020</dd></div>
              <div className="pc__wide"><dt>{c.languages}</dt><dd>PT · NL · EN</dd></div>
            </dl>
            <p className="pc__foot"><Icon name="discord" /> officialnexify</p>
          </PlayerCard>
        </div>
        <p className="hero__status">{d.home.statusText}</p>
      </section>

      <section className="sec" aria-labelledby="explore-title">
        <div className="wrap">
          <SectionHead title={d.home.exploreTitle} lead={d.home.exploreLead} id="explore-title" kicker="01" />
          <div className="bento bento--home">
            <Tile href="/achievements" className="b-exp" label={d.home.explore.achievements.title}>
              <TileIcon name="trophy" />
              <h3 className="tile__title">{d.home.explore.achievements.title}</h3>
              <p className="tile__text">{d.home.explore.achievements.text}</p>
              <ol className="orgs">
                {orgs.map((o) => (
                  <li key={o.id}><span>{o.org}</span><span className="orgs__p">{d.periods[o.period]}</span></li>
                ))}
              </ol>
            </Tile>
            <Tile className="b-stat" as="article">
              <Counter value={d.home.discordStat.value} className="big-num" />
              <p className="tile__text">{d.home.discordStat.label}</p>
            </Tile>
            <Tile href="/resume" className="b-resume" label={d.home.explore.resume.title}>
              <TileIcon name="folder" />
              <h3 className="tile__title">{d.home.explore.resume.title}</h3>
              <p className="tile__text">{d.home.explore.resume.text}</p>
            </Tile>
            <Tile href="/services" className="b-services" label={d.home.explore.services.title}>
              <TileIcon name="spark" />
              <h3 className="tile__title">{d.home.explore.services.title}</h3>
              <p className="tile__text">{d.home.explore.services.text}</p>
              <ul className="mini-list">
                {(['social', 'community', 'tech'] as const).map((k) => <li key={k}><Icon name="check" />{d.services.items[k].title}</li>)}
              </ul>
            </Tile>
            <Tile className="b-tools" as="section">
              <h3 className="tile__title tile__title--sm">{d.skillsPage.groups.tools.title}</h3>
              <Marquee items={[...tools, 'Discord', 'BDFD', 'Lua', 'Python']} />
              <Marquee items={[d.skills.competitiveFortnite, d.skills.scrimsTournaments, d.skills.discordBots, d.skills.obsPacks, d.skills.logoBranding, d.skills.communityDiscord]} reverse />
            </Tile>
            <Tile href="/contact" className="b-contact" label={d.home.explore.contact.title}>
              <TileIcon name="mail" />
              <h3 className="tile__title">{d.home.explore.contact.title}</h3>
              <p className="tile__text">{d.home.explore.contact.text}</p>
            </Tile>
          </div>
        </div>
      </section>

      <section className="sec sec--quote" aria-label={d.quote.label}>
        <div className="wrap"><Quote d={d} /></div>
      </section>

      <section className="sec" aria-labelledby="social-title">
        <div className="wrap">
          <SectionHead title={d.home.socialTitle} id="social-title" kicker="02" />
          <div data-reveal=""><Socials d={d} /></div>
          <p className="more-link" data-reveal=""><Link href="/about">{d.nav.about} <Icon name="arrow" /></Link></p>
        </div>
      </section>

      <CtaBand d={d} title={d.home.ctaTitle} text={d.home.ctaText} secondary={<CvButton label={d.common.downloadCv} variant="outline-light" />} />
    </>
  );
}
