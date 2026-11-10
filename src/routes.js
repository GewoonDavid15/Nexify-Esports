/** Route table — one entry per page. `main` = shown in the primary navigation. */
export const routes = [
  { path: '/', key: 'home', main: false },
  { path: '/about', key: 'about', main: true },
  { path: '/achievements', key: 'achievements', main: true },
  { path: '/resume', key: 'resume', main: true },
  { path: '/skills', key: 'skills', main: true },
  { path: '/services', key: 'services', main: true },
  { path: '/portfolio', key: 'portfolio', main: true },
  { path: '/nexify-dev', key: 'nexifyDev', main: true },
  { path: '/contact', key: 'contact', main: false },
  // Kept out of the primary navigation until real testimonials exist.
  { path: '/testimonials', key: 'testimonials', main: false },
  { path: '/privacy', key: 'privacy', main: false, legal: true },
  { path: '/terms', key: 'terms', main: false, legal: true },
  { path: '/cookies', key: 'cookies', main: false, legal: true },
  { path: '/disclaimer', key: 'disclaimer', main: false, legal: true },
];

export const routePaths = new Set(routes.map((r) => r.path));
