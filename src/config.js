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
  // Base URL for canonical/og/sitemap links. PUBLIC_SITE_URL wins; on Vercel the
  // production URL is used; otherwise it is derived from the request host.
  url: (process.env.PUBLIC_SITE_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  ).replace(/\/+$/, ''),
  ogImage: '/og-image.png',
  contactEmail: PUBLIC_CONTACT_EMAIL,
  cv: {
    href: '/cv/Nexify-CV.pdf',
    fileName: 'Nexify-CV.pdf',
  },
};

/** Verified public profiles only. Do not add unverified links. */
export const socials = [
  { id: 'youtube', label: 'YouTube', handle: '@nex1fytv', href: 'https://youtube.com/@nex1fytv' },
  { id: 'x', label: 'X (Twitter)', short: 'X', handle: '@OfficialNexify', href: 'https://x.com/OfficialNexify' },
  { id: 'discord', label: 'Discord', handle: 'nexifytv', href: null, copy: 'nexifytv' },
  { id: 'tracker', label: 'Fortnite Tracker', handle: 'Nexifyy', href: 'https://fortnitetracker.com/profile/all/Nexifyy' },
];

export const LANGS = ['en', 'nl', 'pt'];
export const DEFAULT_LANG = 'en';
export const LANG_COOKIE = 'nexify_lang';
