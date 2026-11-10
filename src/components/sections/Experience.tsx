import type { Dict } from '@/lib/i18n';
import { experience } from '@/lib/resume';
import { Icon } from '../ui/Icon';
import { TimelineLine } from '../motion/TimelineLine';
import { Counter } from '../motion/Counter';

/** Newest first, alternating sides on wide screens; line grows with scroll. */
export function Timeline({ d }: { d: Dict }) {
  const items = [...experience].reverse();
  return (
    <TimelineLine>
      <ol className="tl__list">
        {items.map((e, i) => (
          <li key={e.id} className={`tl__item ${i % 2 ? 'tl__item--r' : 'tl__item--l'}`} data-reveal="">
            <span className="tl__dot" aria-hidden />
            <article className="tl__card" data-spot="">
              <p className="tl__period">{d.periods[e.period]}</p>
              <h3 className="tl__org">{e.org}</h3>
              <p className="tl__role">{d.roles[e.role]}</p>
              <ul className="tl__points">{d.experiencePoints[e.id].map((p) => <li key={p}>{p}</li>)}</ul>
              <div className="tl__meta">
                <span className="tl__loc"><Icon name="pin" />{e.countries.map((c) => d.countries[c]).join(' · ')}</span>
                <ul className="tl__tags">{e.tags.map((t) => <li key={t} className={`tag tag--${t}`}>{d.tags[t]}</li>)}</ul>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </TimelineLine>
  );
}

export function Highlights({ d, cols = 4 }: { d: Dict; cols?: 2 | 4 }) {
  return (
    <div className={`bento bento--hl bento--${cols}`}>
      {d.highlights.map((h) => (
        <article key={h.title} className="tile tile--hl" data-spot="" data-reveal="">
          <Counter value={h.value} className="hl__value" />
          <h3 className="tile__title">{h.title}</h3>
          <p className="tile__text">{h.text}</p>
        </article>
      ))}
    </div>
  );
}
