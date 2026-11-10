import type { Localized } from './events';

/**
 * Selected social media work, shown on /portfolio. Real work only, shared with
 * the organization's permission. Put images in public/work/ (WebP, about 1200 px
 * wide) and give their real size so the page doesn't jump while loading.
 * Results must be real numbers you can back up; leave them out otherwise.
 *
 * Example:
 *   { id: 'haze-launch', org: 'Haze Esports', kind: 'graphic', title: { en: 'Roster announcement', nl: 'Rosteraankondiging' },
 *     image: '/work/haze-launch.webp', width: 1200, height: 1500, alt: { en: 'Announcement graphic with …' },
 *     url: 'https://x.com/…', date: '2026-05', results: [{ label: { en: 'Impressions' }, value: '25K' }] },
 */
export interface WorkItem {
  id: string;
  org: string;
  kind: 'graphic' | 'post' | 'video' | 'campaign';
  title: Localized;
  text?: Localized;
  image: string;
  width: number;
  height: number;
  alt: Localized;
  url?: string;
  date?: string;
  results?: { label: Localized; value: string }[];
}

export const work: WorkItem[] = [];
