/**
 * Site-wide configuration — the single place to update public details.
 *
 * PUBLIC_CONTACT_EMAIL is the general public contact address. It is shown on
 * the site and is the default recipient of contact-form messages. It is NOT a
 * legal or privacy contact; legal pages deliberately do not use it.
 */
export const PUBLIC_CONTACT_EMAIL = 'gewoon.davidd@gmail.com';

export const site = {
  name: 'Nexify',
  contactEmail: PUBLIC_CONTACT_EMAIL,
  cv: { href: '/cv/Nexify-CV.pdf', fileName: 'Nexify-CV.pdf' },
  ogImage: '/og-image.png',
};

/**
 * ONE switch for availability — change this when you sign with a team.
 *   { state: 'free' }                                   → "Free agent — open to …"
 *   { state: 'signed', team: 'Team Name', role: 'Social Media Manager' } → "Signed — … at Team Name"
 */
export const status: { state: 'free' | 'signed'; team?: string; role?: string } = { state: 'free' };

/**
 * Live Discord status (via Lanyard, https://github.com/Phineas/lanyard).
 * Fill in your numeric Discord user ID (Discord → Settings → Advanced →
 * Developer Mode → right-click your name → Copy User ID) and join the Lanyard
 * Discord server once. Can also be set with the DISCORD_USER_ID env var.
 * Empty = the status card is hidden.
 */
export const DISCORD_USER_ID = '';

export type SocialId = 'youtube' | 'x' | 'discord' | 'tracker';
export interface Social {
  id: SocialId;
  label: string;
  short?: string;
  handle: string;
  href?: string;
  /** Value copied to the clipboard instead of opening a link. */
  copy?: string;
}

/** Verified public profiles only. Do not add unverified links. */
export const socials: Social[] = [
  { id: 'youtube', label: 'YouTube', handle: '@nex1fytv', href: 'https://youtube.com/@nex1fytv' },
  { id: 'x', label: 'X (Twitter)', short: 'X', handle: '@OfficialNexify', href: 'https://x.com/OfficialNexify' },
  { id: 'discord', label: 'Discord', handle: 'officialnexify', copy: 'officialnexify' },
  { id: 'tracker', label: 'Fortnite Tracker', handle: 'Nexifyy', href: 'https://fortnitetracker.com/profile/all/Nexifyy' },
];

export const LANGS = ['en', 'nl', 'pt'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';
export const LANG_COOKIE = 'nexify_lang';
export const LANG_HEADER = 'x-nexify-lang';
export const PATH_HEADER = 'x-nexify-path';

export const isLang = (v: unknown): v is Lang => typeof v === 'string' && (LANGS as readonly string[]).includes(v);

/** Base URL for canonical/OG/sitemap links. */
export function siteUrl(fallbackOrigin = ''): string {
  const fromEnv = process.env.PUBLIC_SITE_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
  return (fromEnv || fallbackOrigin).replace(/\/+$/, '');
}
