import type { Dict } from '@/lib/i18n';
import { locales } from '@/lib/i18n';
import type { Lang } from '@/lib/config';
import { events, localized } from '@/lib/events';
import { SectionHead } from './Blocks';
import { UpcomingList } from './Upcoming';

/** "Coming up" section; renders nothing while there are no upcoming events. */
export function Events({ d, lang }: { d: Dict; lang: Lang }) {
  const built = new Date().toISOString().slice(0, 10);
  const items = events
    .filter((e) => (e.end ?? e.date) >= built)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({ date: e.date, end: e.end, name: e.name, kind: d.events.kinds[e.kind], url: e.url, note: localized(e.note, lang) }));
  if (!items.length) return null;
  return (
    <section className="sec" aria-labelledby="events-title">
      <div className="wrap wrap--narrow">
        <SectionHead badge={d.events.badge} title={d.events.title} lead={d.events.lead} id="events-title" />
        <UpcomingList items={items} locale={locales[lang]} details={d.events.details} newTab={d.common.newTab} />
      </div>
    </section>
  );
}
