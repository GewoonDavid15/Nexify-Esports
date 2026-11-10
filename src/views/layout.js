import { html, esc } from './html.js';
import { icon, logoMark } from './icons.js';
import { routes } from '../routes.js';
import { LANGS, site, socials } from '../config.js';
import { dictionaries } from '../i18n/index.js';

function navLink(t, route, currentPath, extraClass = '') {
  const current = route.path === currentPath;
  return `<a class="nav-link ${extraClass}" href="${route.path}"${current ? ' aria-current="page"' : ''}>${t(`nav.${route.key}`)}</a>`;
}

export function langSwitch(t, currentPath, id) {
  const items = LANGS.map((code) => {
    const d = dictionaries[code];
    const current = code === t.lang;
    return `<li><a class="lang-link" href="/lang/${code}?next=${encodeURIComponent(currentPath)}" hreflang="${d.locale}" lang="${d.locale}"
      ${current ? `aria-current="true"` : ''} data-lang="${code}">
      <span aria-hidden="true">${d.langShort}</span><span class="sr-only">${d.langName}${current ? ` (${t('common.languageCurrent')})` : ''}</span></a></li>`;
  }).join('');
  return `<div class="lang-switch" role="group" aria-labelledby="${id}"><span id="${id}" class="sr-only">${t('common.language')}</span><ul>${items}</ul></div>`;
}

export function socialLinks(t, { compact = false } = {}) {
  return `<ul class="socials${compact ? ' socials--compact' : ''}">${socials.map((s) => {
    if (s.copy) {
      return `<li><button type="button" class="social social--copy" data-copy="${esc(s.copy)}"
        data-copied="${esc(t('common.copied'))}" data-failed="${esc(t('common.copyFailed', { value: s.copy }))}">
        ${icon(s.id)}<span class="social__text"><span class="social__label">${s.label}</span>${compact ? '' : `<span class="social__handle">${esc(s.handle)}</span>`}</span><span class="sr-only"> — ${t('common.copyDiscord')}</span>${compact ? '' : icon('copy', { className: 'social__end' })}
        <span class="social__done" aria-hidden="true">${icon('check')}</span>
        </button></li>`;
    }
    return `<li><a class="social" href="${s.href}" target="_blank" rel="noopener noreferrer me">
      ${icon(s.id)}<span class="social__text"><span class="social__label">${compact && s.short ? s.short : s.label}</span>${compact ? '' : `<span class="social__handle">${esc(s.handle)}</span>`}</span>${compact ? '' : icon('external', { className: 'social__end' })}<span class="sr-only"> ${t('common.newTab')}</span></a></li>`;
  }).join('')}</ul>`;
}

/** Pages long enough to get a reading-progress bar. */
const LONG_PAGES = ['resume', 'achievements', 'privacy', 'terms', 'cookies', 'disclaimer', 'services', 'about'];

export function layout({ t, path, pageKey, body, bodyClass = '', origin = '', noindex = false }) {
  const d = t.dict;
  const meta = t(`meta.${pageKey}`);
  const title = pageKey === 'home' ? meta.title : `${meta.title} · ${site.name}`;
  const mainRoutes = routes.filter((r) => r.main);
  const contactRoute = routes.find((r) => r.key === 'contact');
  const footerPages = routes.filter((r) => ['home', 'about', 'achievements', 'resume', 'skills', 'services'].includes(r.key));
  const footerMore = routes.filter((r) => ['portfolio', 'testimonials', 'nexifyDev', 'contact'].includes(r.key));
  const footerLegal = routes.filter((r) => r.legal);
  const baseUrl = site.url || origin || '';
  const langUrl = (code) => `${baseUrl}${path}${code === 'en' ? '' : `?lang=${code}`}`;
  const canonical = langUrl(t.lang);
  const alternates = LANGS.map((code) => `<link rel="alternate" hreflang="${dictionaries[code].locale}" href="${langUrl(code)}">`).join('');

  return html`<!doctype html>
<html lang="${d.locale}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(meta.description)}">
<meta name="theme-color" content="#0c0a0e">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:locale" content="${d.locale.replace('-', '_')}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${baseUrl}${site.ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Nexify — Fortnite Player &amp; Esports Social Media Manager">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${baseUrl}${site.ogImage}">
<meta name="twitter:site" content="@OfficialNexify">
${alternates}
<link rel="alternate" hreflang="x-default" href="${langUrl('en')}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/inter/files/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/sora/files/sora-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/fonts/fonts.css">
<link rel="stylesheet" href="/css/styles.css">
<script src="/js/app.js" defer></script>
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">${t('common.skip')}</a>
${LONG_PAGES.includes(pageKey) ? '<div class="scroll-progress" aria-hidden="true" data-scroll-progress><span></span></div>' : ''}
<div class="sky" aria-hidden="true"><span class="cloud c1"></span><span class="cloud c2"></span><span class="cloud c3"></span><span class="cloud c4"></span><span class="cloud c5"></span><span class="grain"></span></div>

<header class="site-header" data-header>
  <div class="container header-inner">
    <a class="brand" href="/" aria-label="${site.name} — ${t('nav.home')}">${logoMark()}<span class="brand__name">${site.name}</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-toggle
      data-label-open="${esc(t('common.menuOpen'))}" data-label-close="${esc(t('common.menuClose'))}">
      <span class="menu-toggle__icon menu-toggle__icon--open">${icon('menu')}</span>
      <span class="menu-toggle__icon menu-toggle__icon--close">${icon('close')}</span>
      <span class="sr-only" data-menu-label>${t('common.menuOpen')}</span>
    </button>
    <div class="nav-panel" id="site-nav" data-nav>
      <nav aria-label="${esc(t('common.mainNav'))}">
        <ul class="nav-list">
          ${mainRoutes.map((r) => `<li>${navLink(t, r, path)}</li>`)}
        </ul>
      </nav>
      <div class="nav-actions">
        ${langSwitch(t, path, 'lang-label-header')}
        <a class="btn btn--primary btn--sm" href="${contactRoute.path}"${path === '/contact' ? ' aria-current="page"' : ''}>${t('common.hireMe')}</a>
      </div>
    </div>
  </div>
</header>

<main id="main" tabindex="-1">
${body}
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/">${logoMark()}<span class="brand__name">${site.name}</span></a>
        <p class="footer-tagline">${t('common.footerTagline')}</p>
        <p class="footer-email">${icon('mail')}<a href="mailto:${site.contactEmail}">${site.contactEmail}</a></p>
      </div>
      <nav class="footer-nav" aria-label="${esc(t('common.footerNav'))}">
        <div><h2 class="footer-heading">${t('common.footerPages')}</h2><ul>${footerPages.map((r) => `<li>${navLink(t, r, path, 'footer-link')}</li>`)}</ul></div>
        <div><h2 class="footer-heading">${t('common.footerMore')}</h2><ul>${footerMore.map((r) => `<li>${navLink(t, r, path, 'footer-link')}</li>`)}</ul></div>
        <div><h2 class="footer-heading">${t('common.footerLegal')}</h2><ul>${footerLegal.map((r) => `<li>${navLink(t, r, path, 'footer-link')}</li>`)}</ul></div>
      </nav>
      <div class="footer-social">
        <h2 class="footer-heading">${t('common.footerFind')}</h2>
        ${socialLinks(t, { compact: true })}
        ${langSwitch(t, path, 'lang-label-footer')}
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} ${site.name}. ${t('common.footerNote')}</p>
      <p>${t('common.footerDraft')}</p>
    </div>
  </div>
</footer>
<a class="to-top" href="#main" data-to-top aria-label="${esc(t('common.backToTop'))}">${icon('arrow', { className: 'to-top__icon' })}</a>
<div class="toast" role="status" aria-live="polite" data-toast></div>
</body>
</html>`;
}
