import { getI18n } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { Chips, CtaBand, PageHero, SectionHead, Tile, TileIcon } from '@/components/sections/Blocks';
import type { IconName } from '@/components/ui/Icon';

export const generateMetadata = () => pageMeta('services', '/services');

const items: { id: 'social' | 'community' | 'editing' | 'branding' | 'tech' | 'ops'; icon: IconName; tools: string[] }[] = [
  { id: 'social', icon: 'megaphone', tools: ['Notion', 'Trello', 'Canva'] },
  { id: 'community', icon: 'users', tools: ['Discord'] },
  { id: 'editing', icon: 'film', tools: ['Premiere Pro', 'CapCut'] },
  { id: 'branding', icon: 'palette', tools: ['Photoshop', 'Canva'] },
  { id: 'tech', icon: 'bot', tools: ['BDFD', 'OBS Studio', 'Lua', 'Python'] },
  { id: 'ops', icon: 'gear', tools: ['Discord', 'Notion', 'Microsoft Office'] },
];

export default async function Services() {
  const { d } = await getI18n();
  const s = d.services;
  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      <div className="wrap">
        <div className="bento bento--3">
          {items.map((it, i) => (
            <Tile key={it.id} as="article" className="svc">
              <div className="sk__head"><TileIcon name={it.icon} /><span className="kicker">{String(i + 1).padStart(2, '0')}</span></div>
              <h2 className="tile__title">{s.items[it.id].title}</h2>
              <p className="tile__text">{s.items[it.id].text}</p>
              <p className="kicker svc__tools">{s.toolsLabel}</p>
              <Chips items={it.tools} mono small />
            </Tile>
          ))}
        </div>
      </div>
      <section className="sec" aria-labelledby="process-title">
        <div className="wrap">
          <SectionHead title={s.processTitle} id="process-title" kicker="01" />
          <ol className="steps">
            {s.steps.map((st, i) => (
              <li key={st.title} className="step" data-reveal="">
                <span className="step__num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="tile__title">{st.title}</h3>
                <p className="tile__text">{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand d={d} title={s.ctaTitle} text={s.ctaText} />
    </>
  );
}
