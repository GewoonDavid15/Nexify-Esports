import { i18nFromParams, type LangParams } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { Button } from '@/components/ui/Button';
import { Counter } from '@/components/motion/Counter';
import { Avatar } from '@/components/ui/Avatar';
import { CtaBand, PageHero, Quote, SectionHead, Tile, TileIcon, Chips } from '@/components/sections/Blocks';
import { Icon } from '@/components/ui/Icon';
import { Rich } from '@/components/ui/Rich';
import { experience } from '@/lib/resume';
import { availability } from '@/lib/status';
import { fmt } from '@/lib/i18n/fmt';
import { locales } from '@/lib/i18n';
import { site } from '@/lib/config';

export const generateMetadata = ({ params }: LangParams) => pageMeta(params, 'about', '/about');

export default async function About({ params }: LangParams) {
  const { d, lang } = await i18nFromParams(params);
  const a = d.about;
  const f = a.facts;
  // Facts are derived from the resume data, so they stay in sync with it.
  const countryCodes = [...new Set(experience.flatMap((r) => r.countries))];
  const countries = new Intl.ListFormat(locales[lang], { type: 'conjunction' }).format(countryCodes.map((c) => d.countriesInText[c]));
  const vars = { status: availability(d).text, countries, email: site.contactEmail };
  const facts: { k: string; v: string; wide?: boolean }[] = [
    { k: f.based, v: f.basedV }, { k: f.nationality, v: f.nationalityV }, { k: f.input, v: f.inputV }, { k: f.timezone, v: f.timezoneV },
    { k: f.since, v: '2020' }, { k: f.orgs, v: String(experience.length) }, { k: f.countries, v: fmt(f.countriesV, { n: countryCodes.length }) },
    { k: f.languages, v: f.languagesV }, { k: f.status, v: availability(d).badge, wide: true },
  ];
  const faq = a.faq.map((x) => ({ q: x.q, a: fmt(x.a, vars) }));
  const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a.replace(/<[^>]+>/g, '') } })) };
  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title} lead={a.lead} top={<Avatar size={128} alt={d.common.avatarAlt} className="avatar--about" />} />
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
      <section className="sec" aria-labelledby="facts-title">
        <div className="wrap">
          <SectionHead title={a.factsTitle} id="facts-title" />
          <dl className="qfacts" data-reveal="">
            {facts.map((x) => <div key={x.k} className={`qfacts__item${x.wide ? ' qfacts__item--wide' : ''}`} data-spot=""><dt>{x.k}</dt><Rich as="dd" html={x.v} /></div>)}
          </dl>
        </div>
      </section>
      <section className="sec" aria-labelledby="faq-title">
        <div className="wrap wrap--narrow">
          <SectionHead title={a.faqTitle} id="faq-title" />
          <div className="faq">
            {faq.map((x) => (
              <details key={x.q} className="faq__item" data-reveal="">
                <summary><span>{x.q}</span><Icon name="arrow" className="faq__chev" /></summary>
                <Rich as="p" className="faq__a" html={x.a} />
              </details>
            ))}
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      </section>
      <section className="sec sec--quote" aria-label={a.motivationTitle}><div className="wrap"><Quote d={d} /></div></section>
      <CtaBand d={d} title={d.home.ctaTitle} text={d.home.ctaText} />
    </>
  );
}
