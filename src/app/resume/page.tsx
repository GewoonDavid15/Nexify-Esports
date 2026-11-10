import { getI18n } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { skillGroups, tools } from '@/lib/resume';
import { CvButton } from '@/components/ui/Button';
import { Callout, Chips, PageHero, Quote, SectionHead } from '@/components/sections/Blocks';
import { Highlights, Timeline } from '@/components/sections/Experience';

export const generateMetadata = () => pageMeta('resume', '/resume');

export default async function Resume() {
  const { d } = await getI18n();
  const r = d.resume;
  return (
    <>
      <PageHero eyebrow={r.eyebrow} title={r.title} lead={r.lead}
        actions={<><CvButton label={d.common.downloadCv} /><span className="kicker">{d.common.downloadCvNote}</span></>} />
      <div className="wrap resume">
        <div className="resume__main">
          <section className="sec sec--top0" aria-labelledby="profile-title">
            <SectionHead title={r.profileTitle} id="profile-title" kicker="01" />
            <p className="resume__profile" data-reveal="">{r.profileText}</p>
            <dl className="facts" data-reveal="">
              {r.details.map((x) => <div key={x.label} className="facts__item"><dt>{x.label}</dt><dd>{x.value}</dd></div>)}
            </dl>
          </section>
          <section className="sec" aria-labelledby="hl-title">
            <SectionHead title={r.highlightsTitle} id="hl-title" kicker="02" />
            <Highlights d={d} cols={2} />
          </section>
          <section className="sec" aria-labelledby="exp-title">
            <SectionHead title={r.experienceTitle} lead={r.experienceNote} id="exp-title" kicker="03" />
            <Timeline d={d} />
            <Callout title={d.achievements.clarifyTitle} text={r.note} />
          </section>
        </div>
        <aside className="resume__side">
          <section className="panel" data-reveal="" aria-labelledby="rskills-title">
            <h2 className="panel__title" id="rskills-title">{r.skillsTitle}</h2>
            {skillGroups.map((g) => (
              <div key={g.id} className="panel__group">
                <p className="kicker">{d.skillsPage.groups[g.id].title}</p>
                <Chips items={g.skills.map((k) => d.skills[k])} small />
              </div>
            ))}
          </section>
          <section className="panel" data-reveal="" aria-labelledby="rtools-title">
            <h2 className="panel__title" id="rtools-title">{r.toolsTitle}</h2>
            <Chips items={tools} mono />
          </section>
          <section className="panel panel--glow" data-reveal="" aria-labelledby="rdl-title">
            <h2 className="panel__title" id="rdl-title">{r.downloadTitle}</h2>
            <p>{r.downloadText}</p>
            <CvButton label={d.common.downloadCv} />
          </section>
        </aside>
      </div>
      <section className="sec sec--quote" aria-label={r.mottoTitle}><div className="wrap"><Quote d={d} /></div></section>
    </>
  );
}
