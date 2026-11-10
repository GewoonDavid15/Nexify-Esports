import type { Lang } from './config';

/**
 * Upcoming tournaments, streams and events, shown on the home page as "Coming up".
 * Add real entries only. Past entries hide themselves; the section is hidden while
 * nothing is upcoming. Dates are YYYY-MM-DD (local time).
 *
 * Example:
 *   { date: '2026-12-05', name: 'FNCS Grand Finals', kind: 'tournament', url: 'https://…', note: { en: 'Duos with …' } },
 */
export type Localized = string | ({ en: string } & Partial<Record<Lang, string>>);
export interface EventItem {
  date: string;
  end?: string;
  name: string;
  kind: 'tournament' | 'stream' | 'event';
  url?: string;
  note?: Localized;
}

export const events: EventItem[] = [];

export const localized = (v: Localized | undefined, lang: Lang) => (v === undefined ? undefined : typeof v === 'string' ? v : v[lang] ?? v.en);
