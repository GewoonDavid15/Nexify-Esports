import { Fragment, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import type { Dict } from '@/lib/i18n';
import { Icon, type IconName } from '../ui/Icon';
import { Button } from '../ui/Button';
import { Rich } from '../ui/Rich';
import { Scramble } from '../motion/Scramble';

/** Words rise out of a mask on first paint (CSS only — no JS needed). */
export function SplitText({ text, className }: { text: string; className?: string }) {
  const words = text.split(/\s+/);
  return (
    <span className={`split ${className ?? ''}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="split__w"><span className="split__i" style={{ '--i': i } as CSSProperties}>{w}</span></span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return <span className="chip-label"><span className="chip-label__dot" aria-hidden />{children}</span>;
}

export function PageHero({ eyebrow, title, lead, actions, extra }: { eyebrow: string; title: string; lead?: string; actions?: ReactNode; extra?: ReactNode }) {
  return (
    <section className="phero" aria-labelledby="page-title">
      <div className="phero__orbit" aria-hidden><span /><span /><span /></div>
      <div className="wrap">
        <Chip><Scramble text={eyebrow} duration={700} /></Chip>
        <h1 id="page-title" className="phero__title"><SplitText text={title} /></h1>
        {lead ? <p className="phero__lead">{lead}</p> : null}
        {actions ? <div className="actions phero__actions">{actions}</div> : null}
        {extra}
      </div>
    </section>
  );
}

export function SectionHead({ title, lead, id, kicker }: { title: string; lead?: string; id?: string; kicker?: string }) {
  return (
    <div className="shead" data-reveal="">
      {kicker ? <p className="shead__kicker">{kicker}</p> : null}
      <h2 className="shead__title" id={id}>{title}</h2>
      {lead ? <p className="shead__lead">{lead}</p> : null}
    </div>
  );
}

/** Glass bento tile with pointer spotlight. */
export function Tile({ children, className = '', href, label, as = 'div' }: { children: ReactNode; className?: string; href?: string; label?: string; as?: 'div' | 'article' | 'section' }) {
  if (href) {
    return (
      <Link className={`tile tile--link ${className}`} href={href} data-spot="" data-reveal="">
        {children}
        <span className="tile__go" aria-hidden><Icon name="arrowUpRight" /></span>
        {label ? <span className="sr-only">{label}</span> : null}
      </Link>
    );
  }
  const Tag = as;
  return <Tag className={`tile ${className}`} data-spot="" data-reveal="">{children}</Tag>;
}

export function TileIcon({ name }: { name: IconName }) {
  return <span className="tile__icon" aria-hidden><Icon name={name} /></span>;
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

export function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const group = (hidden: boolean) => (
    <ul className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((i) => <li key={i} className="marquee__item">{i}</li>)}
    </ul>
  );
  return <div className={`marquee${reverse ? ' marquee--rev' : ''}`} aria-hidden><div className="marquee__track">{group(false)}{group(true)}</div></div>;
}

export function Quote({ d }: { d: Dict }) {
  return (
    <figure className="quote" data-reveal="">
      <span className="quote__mark" aria-hidden>“</span>
      <blockquote lang="en"><p>{d.quote.text}</p></blockquote>
      {d.quote.translation ? <p className="quote__tr">{d.quote.translation}</p> : null}
      <figcaption>— Nexify · {d.quote.label}</figcaption>
    </figure>
  );
}

export function CtaBand({ d, title, text, secondary }: { d: Dict; title: string; text: string; secondary?: ReactNode }) {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="cta__panel" data-reveal="" data-spot="">
          <span className="cta__aurora" aria-hidden />
          <span className="cta__grid" aria-hidden />
          <h2 className="cta__title" id="cta-title">{title}</h2>
          <p className="cta__text">{text}</p>
          <div className="actions actions--center">
            <Button href="/contact" variant="light" icon="mail">{d.common.hireMe}</Button>
            {secondary}
          </div>
        </div>
      </div>
    </section>
  );
}

export function EmptyState({ icon, title, text, hint, actions }: { icon: IconName; title: string; text: string; hint?: string; actions?: ReactNode }) {
  return (
    <div className="empty" data-reveal="" data-spot="">
      <div className="empty__orb" aria-hidden><span /><span /><span /><Icon name={icon} /></div>
      <h2 className="empty__title">{title}</h2>
      <p>{text}</p>
      {hint ? <p className="empty__hint">{hint}</p> : null}
      {actions ? <div className="actions actions--center">{actions}</div> : null}
    </div>
  );
}

export function AvailabilityBadge({ d }: { d: Dict }) {
  return (
    <p className="avail" role="note">
      <span className="pulse" aria-hidden />
      <Rich html={d.common.availability} />
    </p>
  );
}
