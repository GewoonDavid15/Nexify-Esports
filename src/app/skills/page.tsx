import { getI18n } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { skillGroups, tools } from '@/lib/resume';
import { Button } from '@/components/ui/Button';
import { Callout, Chips, CtaBand, Marquee, PageHero, Tile, TileIcon } from '@/components/sections/Blocks';
import type { IconName } from '@/components/ui/Icon';

export const generateMetadata = () => pageMeta('skills', '/skills');

const icons: Record<string, IconName> = { esports: 'gamepad', social: 'megaphone', tech: 'code', tools: 'layers', languages: 'globe' };

export default async function Skills() {
  const { d } = await getI18n();
  const s = d.skillsPage;
  const groups = [
    ...skillGroups.filter((g) => g.id !== 'languages').map((g) => ({ id: g.id as string, items: g.skills.map((k) => d.skills[k]), mono: false })),
    { id: 'tools', items: tools, mono: true },
    { id: 'languages', items: skillGroups.find((g) => g.id === 'languages')!.skills.map((k) => d.skills[k]), mono: false },
  ];
  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      <div className="wrap">
        <Callout title={d.common.selfReported} text={s.disclaimer} />
        <div className="bento bento--skills">
          {groups.map((g, i) => (
            <Tile key={g.id} as="section" className={`sk sk--${g.id}`}>
              <div className="sk__head">
                <TileIcon name={icons[g.id]} />
                <span className="kicker">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h2 className="card__title">{s.groups[g.id as keyof typeof s.groups].title}</h2>
              <p className="card__text">{s.groups[g.id as keyof typeof s.groups].text}</p>
              <Chips items={g.items} mono={g.mono} />
            </Tile>
          ))}
        </div>
      </div>
      <section className="sec sec--marquee" aria-hidden>
        <Marquee items={[...tools, 'Discord', 'BDFD', 'Lua', 'Java', 'Python']} />
        <Marquee items={[d.skills.competitiveFortnite, d.skills.socialStrategy, d.skills.communityDiscord, d.skills.discordBots, d.skills.obsPacks, d.skills.logoBranding]} reverse />
      </section>
      <CtaBand d={d} title={d.services.ctaTitle} text={d.services.ctaText} secondary={<Button href="/services" variant="outline-light">{d.nav.services}</Button>} />
    </>
  );
}
