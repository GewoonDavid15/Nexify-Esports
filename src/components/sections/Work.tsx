import type { Dict } from '@/lib/i18n';
import type { Lang } from '@/lib/config';
import { localized } from '@/lib/events';
import type { WorkItem } from '@/lib/work';
import { Icon } from '../ui/Icon';
import { SectionHead } from './Blocks';

export function WorkGrid({ items, d, lang }: { items: WorkItem[]; d: Dict; lang: Lang }) {
  return (
    <section className="sec sec--top0" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHead badge={d.work.badge} title={d.work.title} lead={d.work.lead} id="work-title" />
        <ul className="work">
          {items.map((w) => (
            <li key={w.id} className="work__item" data-reveal="">
              <figure className="work__fig">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.image} width={w.width} height={w.height} alt={localized(w.alt, lang)} loading="lazy" decoding="async" />
              </figure>
              <div className="work__body">
                <p className="work__meta"><span>{d.work.kinds[w.kind]}</span><span>{w.org}</span>{w.date ? <span>{w.date}</span> : null}</p>
                <h3 className="work__title">{localized(w.title, lang)}</h3>
                {w.text ? <p className="work__text">{localized(w.text, lang)}</p> : null}
                {w.results?.length ? (
                  <dl className="work__results" aria-label={d.work.results}>
                    {w.results.map((r) => <div key={r.value + localized(r.label, lang)}><dt>{localized(r.label, lang)}</dt><dd>{r.value}</dd></div>)}
                  </dl>
                ) : null}
                {w.url ? <a className="work__link" href={w.url} target="_blank" rel="noopener noreferrer">{d.work.view}<Icon name="arrowUpRight" /><span className="sr-only"> {d.common.newTab}</span></a> : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
