import type { MetadataRoute } from 'next';

/** Makes the site installable ("Add to Home Screen"). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nexify — Esports Social Media Manager & Fortnite player',
    short_name: 'Nexify',
    description: 'Portfolio of Nexify: esports social media manager and competitive Fortnite player.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0a0b10',
    theme_color: '#0a0b10',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
