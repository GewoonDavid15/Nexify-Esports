'use client';

import { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon';

export interface UpcomingItem { date: string; end?: string; name: string; kind: string; url?: string; note?: string }

const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

/** Event list that hides past entries in the browser too (pages are built ahead of time). */
export function UpcomingList({ items, locale, details, newTab }: { items: UpcomingItem[]; locale: string; details: string; newTab: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => setNow(today()), []);
  const list = now ? items.filter((e) => (e.end ?? e.date) >= now) : items;
  if (!list.length) return null;
  const fmt = (s: string) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(new Date(`${s}T12:00:00`));
  return (
    <ol className="events">
      {list.map((e) => (
        <li key={`${e.date}-${e.name}`} className="event" data-spot="">
          <time className="event__date" dateTime={e.date}>
            <span className="event__day">{new Date(`${e.date}T12:00:00`).getDate()}</span>
            <span className="event__month">{new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(`${e.date}T12:00:00`))}</span>
          </time>
          <div className="event__body">
            <p className="event__kind">{e.kind}{e.end ? ` · ${fmt(e.date)} – ${fmt(e.end)}` : ''}</p>
            <h3 className="event__name">{e.name}</h3>
            {e.note ? <p className="event__note">{e.note}</p> : null}
          </div>
          {e.url ? (
            <a className="event__link" href={e.url} target="_blank" rel="noopener noreferrer">
              {details}<Icon name="arrowUpRight" /><span className="sr-only"> {newTab}</span>
            </a>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
