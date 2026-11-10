import { i18nFromParams, type LangParams } from '@/lib/i18n/server';
import { pageMeta } from '@/lib/meta';
import { experience, skillGroups, tools } from '@/lib/resume';
import { site, socials } from '@/lib/config';
import { availability } from '@/lib/status';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { Rich } from '@/components/ui/Rich';
import { Badge, Chips } from '@/components/sections/Blocks';
import { PrintButton } from '@/components/sections/PrintButton';

export const generateMetadata = ({ params }: LangParams) => pageMeta(params, 'mediaKit', '/media-kit');

/** One-pager for teams; prints to a clean A4 PDF (files in /public/media-kit). */
export default async function MediaKit({ params }: LangParams) {
  const { d, lang } = await i18nFromParams(params);
  const k = d.mediaKit;
  const a = availability(d);
  const roles = [...experience].reverse();
  const pdf = `/media-kit/Nexify-Media-Kit-${lang.toUpperCase()}.pdf`;
  return (
    <section className="mk-wrap" aria-labelledby="mk-title">
      <div className="wrap">
        <div className="mk-actions noprint">
          <Badge>{k.eyebrow}</Badge>
          <div className="actions">
            <a className="btn btn--primary btn--sm" href={pdf} download><Icon name="download" /><span>{k.download}</span></a>
            <PrintButton label={k.print} />
          </div>
        </div>
        <article className="mk" data-reveal="">
          <header className="mk__head">
            <Avatar size={112} alt={d.common.avatarAlt} />
            <div>
              <h1 id="mk-title" className="mk__name">Nexify</h1>
              <p className="mk__roles">{d.home.roles.join(' · ')}</p>
              <p className={`avail${a.free ? '' : ' avail--signed'}`}><span className="pulse" aria-hidden /><Rich html={a.badge} /></p>
            </div>
          </header>
          <div className="mk__grid">
            <div>
              <h2 className="mk__h">{k.profile}</h2>
              <p>{d.resume.profileText}</p>
              <dl className="mk__facts">
                {d.resume.details.map((x) => <div key={x.label}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}
              </dl>
              <h2 className="mk__h">{k.highlights}</h2>
              <ul className="mk__hl">{d.highlights.map((h) => <li key={h.title}><strong>{h.value}</strong> {h.text}</li>)}</ul>
            </div>
            <div>
              <h2 className="mk__h">{k.experience}</h2>
              <ol className="mk__exp">
                {roles.map((r) => <li key={r.id}><strong>{r.org}</strong><span>{d.roles[r.role]}</span><em>{d.periods[r.period]}</em></li>)}
              </ol>
              <h2 className="mk__h">{k.skills}</h2>
              <Chips items={skillGroups.filter((g) => g.id !== 'languages').flatMap((g) => g.skills.slice(0, 3)).map((s) => d.skills[s])} small />
              <h2 className="mk__h">{k.tools}</h2>
              <Chips items={tools} small mono />
              <h2 className="mk__h">{k.languages}</h2>
              <p>{skillGroups.find((g) => g.id === 'languages')!.skills.map((s) => d.skills[s]).join(' · ')}</p>
            </div>
          </div>
          <footer className="mk__foot">
            <h2 className="mk__h">{k.contact}</h2>
            <ul>
              <li><Icon name="mail" />{site.contactEmail}</li>
              {socials.map((s) => <li key={s.id}><Icon name={s.id} />{s.href ? s.href.replace('https://', '') : s.handle}</li>)}
            </ul>
            <p className="mk__note">{k.note}</p>
          </footer>
        </article>
      </div>
    </section>
  );
}
