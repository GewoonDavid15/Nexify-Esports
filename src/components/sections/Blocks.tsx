import { Fragment, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import type { Dict } from '@/lib/i18n';
import { Icon, type IconName } from '../ui/Icon';
import { Button } from '../ui/Button';
import { Rich } from '../ui/Rich';
import { Counter } from '../motion/Counter';

/** "*word*" is rendered in the accent colour. Without markers, the last word is. */
export function Accent({ text }: { text: string }) {
  if (text.includes('*')) {
    return <>{text.split('*').map((part, i) => (i % 2 ? <span key={i} className="accent">{part}</span> : <Fragment key={i}>{part}</Fragment>))}</>;
  }
  const at = text.lastIndexOf(' ');
  if (at < 0) return <>{text}</>;
  return <>{text.slice(0, at + 1)}<span className="accent">{text.slice(at + 1)}</span></>;
}
export const plain = (text: string) => text.replace(/\*/g, '');

export function Badge({ children, live = false }: { children: ReactNode; live?: boolean }) {
  return <span className={`badge${live ? ' badge--live' : ''}`}>{live ? <span className="pulse" aria-hidden /> : null}{children}</span>;
}

export function PageHero({ eyebrow, title, lead, actions, extra }: { eyebrow: string; title: string; lead?: string; actions?: ReactNode; extra?: ReactNode }) {
  return (
    <section className="phero" aria-labelledby="page-title">
      <div className="wrap phero__inner">
        <div className="rise" style={{ '--d': 0 } as CSSProperties}><Badge>{eyebrow}</Badge></div>
        <h1 id="page-title" className="phero__title rise" style={{ '--d': 1 } as CSSProperties}><Accent text={title} /></h1>
        {lead ? <p className="phero__lead rise" style={{ '--d': 2 } as CSSProperties}>{lead}</p> : null}
        {actions ? <div className="actions actions--center rise" style={{ '--d': 3 } as CSSProperties}>{actions}</div> : null}
        {extra ? <div className="rise" style={{ '--d': 3 } as CSSProperties}>{extra}</div> : null}
      </div>
    </section>
  );
}

export function SectionHead({ title, lead, id, badge, align = 'center' }: { title: string; lead?: string; id?: string; badge?: string; align?: 'center' | 'left' }) {
  return (
    <div className={`shead shead--${align}`} data-reveal="">
      {badge ? <Badge>{badge}</Badge> : null}
      <h2 className="shead__title" id={id}><Accent text={title} /></h2>
      {lead ? <p className="shead__lead">{lead}</p> : null}
    </div>
  );
}

/** Card; with href the whole card is a link and shows "More info ↗". */
export function Tile({ children, className = '', href, more, as = 'div' }: { children: ReactNode; className?: string; href?: string; more?: string; as?: 'div' | 'article' | 'section' }) {
  if (href) {
    return (
      <Link className={`card card--link ${className}`} href={href} data-spot="" data-reveal="">
        {children}
        {more ? <span className="card__more">{more} <Icon name="arrowUpRight" /></span> : null}
      </Link>
    );
  }
  const Tag = as;
  return <Tag className={`card ${className}`} data-spot="" data-reveal="">{children}</Tag>;
}

export function TileIcon({ name }: { name: IconName }) {
  return <span className="card__icon" aria-hidden><Icon name={name} /></span>;
}

export function StatBar({ items }: { items: { icon: IconName; value: string; label: string; live?: boolean }[] }) {
  return (
    <dl className="stats" data-reveal="">
      {items.map((s) => (
        <div key={s.label} className="stats__item">
          <dt>{s.live ? <span className="pulse" aria-hidden /> : null}{s.label}</dt>
          <dd><Icon name={s.icon} className="stats__icon" /><Counter value={s.value} className="stats__value" /></dd>
        </div>
      ))}
    </dl>
  );
}

export function Callout({ title, text, tone = 'info' }: { title: string; text: string; tone?: 'info' | 'warn' }) {
  return (
    <aside className={`callout callout--${tone}`} data-reveal="">
      <Icon name={tone === 'warn' ? 'alert' : 'info'} />
      <div><p className="callout__title">{title}</p><p>{text}</p></div>
    </aside>
  );
}

export function Chips({ items, mono = false, small = false }: { items: string[]; mono?: boolean; small?: boolean }) {
  return <ul className={`chips${mono ? ' chips--mono' : ''}${small ? ' chips--sm' : ''}`}>{items.map((i) => <li key={i} className="chip">{i}</li>)}</ul>;
}

export function Quote({ d }: { d: Dict }) {
  return (
    <figure className="quote" data-reveal="">
      <Icon name="quote" className="quote__icon" />
      <blockquote lang="en"><p>{d.quote.text}</p></blockquote>
      {d.quote.translation ? <p className="quote__tr">{d.quote.translation}</p> : null}
      <figcaption>Nexify · {d.quote.label}</figcaption>
    </figure>
  );
}

export function CtaBand({ d, title, text, secondary }: { d: Dict; title: string; text: string; secondary?: ReactNode }) {
  return (
    <section className="sec" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="cta" data-reveal="" data-spot="">
          <h2 className="cta__title" id="cta-title"><Accent text={title} /></h2>
          <p className="cta__text">{text}</p>
          <div className="actions actions--center">
            <Button href="/contact" icon="arrow">{d.common.hireMe}</Button>
            {secondary}
          </div>
        </div>
      </div>
    </section>
  );
}

export function EmptyState({ icon, title, text, hint, actions }: { icon: IconName; title: string; text: string; hint?: string; actions?: ReactNode }) {
  return (
    <div className="empty" data-reveal="">
      <span className="card__icon card__icon--lg" aria-hidden><Icon name={icon} /></span>
      <h2 className="empty__title">{title}</h2>
      <p>{text}</p>
      {hint ? <p className="empty__hint">{hint}</p> : null}
      {actions ? <div className="actions actions--center">{actions}</div> : null}
    </div>
  );
}

export function AvailabilityBadge({ d }: { d: Dict }) {
  return <p className="avail" role="note"><span className="pulse" aria-hidden /><Rich html={d.common.availability} /></p>;
}

/** Legacy helper kept for the dev page title. */
export function SplitText({ text }: { text: string }) { return <>{text}</>; }
export function Chip({ children }: { children: ReactNode }) { return <Badge>{children}</Badge>; }
export function Marquee({ items }: { items: string[]; reverse?: boolean }) { return <Chips items={items} mono />; }
