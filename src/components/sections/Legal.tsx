import type { Dict } from '@/lib/i18n';
import { LANG_COOKIE } from '@/lib/config';
import { Icon } from '../ui/Icon';
import { Rich } from '../ui/Rich';
import { PageHero } from './Blocks';

type Ns = 'privacy' | 'terms' | 'cookiesPage' | 'disclaimer';

export function LegalPage({ d, ns }: { d: Dict; ns: Ns }) {
  const page = d[ns];
  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <div className="wrap wrap--narrow legal">
        <aside className="draft" aria-labelledby="draft-title" data-reveal="">
          <Icon name="alert" />
          <div>
            <p className="draft__title" id="draft-title"><span className="badge badge--warn">{d.common.draftBadge}</span> {d.legal.draftTitle}</p>
            <p>{d.legal.draftText}</p>
            <p className="draft__missing">{d.legal.missingTitle}</p>
            <ul>{page.missing.map((m) => <li key={m}>{m}</li>)}</ul>
          </div>
        </aside>
        <div className="legal__body">
          {ns === 'cookiesPage' ? (
            <div className="table-wrap" data-reveal="">
              <table className="ctable">
                <caption>{d.cookiesPage.tableCaption}</caption>
                <thead><tr><th scope="col">{d.cookiesPage.colName}</th><th scope="col">{d.cookiesPage.colPurpose}</th><th scope="col">{d.cookiesPage.colDuration}</th><th scope="col">{d.cookiesPage.colType}</th></tr></thead>
                <tbody><tr><td><code>{LANG_COOKIE}</code></td><td>{d.cookiesPage.cookiePurpose}</td><td>{d.cookiesPage.cookieDuration}</td><td>{d.cookiesPage.cookieType}</td></tr></tbody>
              </table>
            </div>
          ) : null}
          {page.sections.map((s, i) => (
            <section key={s.h} className="lsec" aria-labelledby={`ls-${i}`} data-reveal="">
              <span className="lsec__n" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 id={`ls-${i}`}>{s.h}</h2>
                {'p' in s && s.p ? s.p.map((p) => <Rich key={p} as="p" html={p} />) : null}
                {'list' in s && s.list ? <ul>{s.list.map((l) => <li key={l}>{l}</li>)}</ul> : null}
              </div>
            </section>
          ))}
          <p className="legal__updated">{d.legal.updated}</p>
        </div>
      </div>
    </>
  );
}
