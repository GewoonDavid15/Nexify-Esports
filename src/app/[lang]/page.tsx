import type { CSSProperties } from 'react';
import { i18nFromParams, type LangParams } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { Button, CvButton } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Typewriter } from '@/components/motion/Typewriter';
import { Avatar } from '@/components/ui/Avatar';
import { DiscordStatus, NowPlaying } from '@/components/sections/DiscordStatus';
import { Events } from '@/components/sections/Events';
import { AvailabilityBadge, CtaBand, SectionHead, StatBar, Tile, TileIcon } from '@/components/sections/Blocks';
import { Highlights } from '@/components/sections/Experience';
import { availability } from '@/lib/status';
import { Socials } from '@/components/sections/Socials';

export const generateMetadata = ({ params }: LangParams) => pageMeta(params, 'home', '/');

const floaters: { icon: IconName; cls: string }[] = [
  { icon: 'code', cls: 'fl--1' }, { icon: 'gamepad', cls: 'fl--2' }, { icon: 'spark', cls: 'fl--3' }, { icon: 'bot', cls: 'fl--4' },
];

export default async function Home({ params }: LangParams) {
  const { d, lang } = await i18nFromParams(params);
  const h = d.home;
  const what = [
    { icon: 'gamepad' as const, title: d.about.playerTitle, text: d.about.playerText, href: '/achievements' },
    { icon: 'megaphone' as const, title: d.about.contentTitle, text: d.about.contentText, href: '/services' },
    { icon: 'bot' as const, title: d.about.techTitle, text: d.about.techText, href: '/skills' },
  ];

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__clouds" aria-hidden><span className="hero__cloud hero__cloud--1" /><span className="hero__cloud hero__cloud--2" /></div>
        <div className="hero__floaters" aria-hidden>
          {floaters.map((f) => <span key={f.cls} className={`fl ${f.cls}`}><Icon name={f.icon} /></span>)}
        </div>
        <div className="wrap hero__inner">
          <div className="hero__me rise" style={{ '--d': 0 } as CSSProperties}>
            <Avatar size={88} alt={d.common.avatarAlt} className="avatar--hero" />
            <AvailabilityBadge d={d} />
            <DiscordStatus handle="officialnexify" t={{ label: d.common.discordLabel, online: d.common.discordOnline, idle: d.common.discordIdle, dnd: d.common.discordDnd, offline: d.common.discordOffline, playing: d.common.discordPlaying }} />
          </div>
          <h1 id="hero-title" className="hero__title rise" style={{ '--d': 1 } as CSSProperties}>
            <span className="hero__line">{h.heroLine}</span>
            <span className="hero__typed accent"><Typewriter words={h.roles.map((r) => `${r}.`)} /></span>
          </h1>
          <p className="hero__lead rise" style={{ '--d': 2 } as CSSProperties}>{h.lead}</p>
          <div className="actions actions--center rise" style={{ '--d': 3 } as CSSProperties}>
            <Button href="/contact">{d.common.hireMe}</Button>
            <Button href="/resume" variant="ghost" icon="folder" iconFirst>{d.common.viewResume}</Button>
          </div>
          <a className="hero__down" href="#stats" aria-label={h.exploreTitle}><Icon name="arrow" /></a>
        </div>
      </section>

      <div className="wrap" id="stats">
        <StatBar items={[
          { icon: 'users', value: h.discordStat.value, label: h.discordStat.label },
          { icon: 'layers', value: h.facts[1].value, label: h.facts[1].label },
          { icon: 'calendar', value: h.facts[0].value, label: h.facts[0].label },
        ]} />
        <p className="hero__status" data-reveal="">{availability(d).text}</p>
        <NowPlaying t={{ title: d.common.nowPlaying, text: d.common.nowPlayingText }} />
      </div>

      <Events d={d} lang={lang} />

      <section className="sec" aria-labelledby="what-title">
        <div className="wrap">
          <SectionHead badge={h.what.badge} title={h.what.title} lead={h.what.lead} id="what-title" />
          <div className="grid grid--3">
            {what.map((w, i) => (
              <Tile key={w.href} href={w.href} more={d.common.moreInfo} className="card--glow">
                <TileIcon name={w.icon} />
                <p className="card__label">{h.what.labels[i]}</p>
                <h3 className="card__title">{w.title}</h3>
                <p className="card__text">{w.text}</p>
              </Tile>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="hl-title">
        <div className="wrap">
          <SectionHead badge={h.hl.badge} title={h.hl.title} lead={h.hl.lead} id="hl-title" />
          <Highlights d={d} cols={4} />
        </div>
      </section>

      <section className="sec" aria-labelledby="social-title">
        <div className="wrap">
          <SectionHead badge={d.common.footerFind} title={h.socialTitle} id="social-title" />
          <div data-reveal=""><Socials d={d} /></div>
        </div>
      </section>

      <CtaBand d={d} title={h.ctaTitle} text={h.ctaText} secondary={<CvButton label={d.common.downloadCv} variant="ghost" />} />
    </>
  );
}
