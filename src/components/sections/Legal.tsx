import type { Dict } from '@/lib/i18n';
import { locales } from '@/lib/i18n';
import { fmt } from '@/lib/i18n/fmt';
import { LANG_COOKIE, LEGAL, type Lang } from '@/lib/config';
import { Rich } from '../ui/Rich';
import { PageHero } from './Blocks';

type Ns = 'privacy' | 'terms' | 'cookiesPage' | 'disclaimer';

export function LegalPage({ d, ns, lang }: { d: Dict; ns: Ns; lang: Lang }) {
  const page = d[ns];
  const vars = { name: LEGAL.name, email: LEGAL.email, days: LEGAL.retentionDays };
  const date = new Intl.DateTimeFormat(locales[lang], { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(LEGAL.updated));
  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <div className="wrap wrap--narrow legal">
        <Rich as="p" className="legal__who" html={fmt(d.legal.responsible, vars)} />
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
                {'p' in s && s.p ? s.p.map((p) => <Rich key={p} as="p" html={fmt(p, vars)} />) : null}
                {'list' in s && s.list ? <ul>{s.list.map((l) => <li key={l}>{l}</li>)}</ul> : null}
              </div>
            </section>
          ))}
          <p className="legal__updated">{fmt(d.legal.updated, { date })}</p>
        </div>
      </div>
    </>
  );
}
