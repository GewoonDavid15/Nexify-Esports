import { icon } from './icons.js';
import { esc } from './html.js';
import { site } from '../config.js';
import { experience } from '../resume.js';

const pad = (n) => String(n).padStart(2, '0');

export function availabilityBanner(t) {
  return `<p class="availability" role="note"><span class="pulse" aria-hidden="true"></span><span>${t('common.availability')}</span></p>`;
}

/** Inner-page header: mono label, big title, lead, optional actions. */
export function pageHero(t, { eyebrow, title, lead, actions = '', extra = '', id = 'page-title' }) {
  return `<section class="page-hero" aria-labelledby="${id}">
    <div class="container intro">
      <p class="label label--accent"><span class="label__tick" aria-hidden="true"></span>${eyebrow}</p>
      <h1 id="${id}" class="page-title">${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
      ${actions ? `<div class="actions">${actions}</div>` : ''}
      ${extra}
    </div>
  </section>`;
}

/** Section heading with an index number, e.g. "01  Explore". */
export function sectionHead(title, { lead = '', id, num } = {}) {
  return `<div class="sec-head reveal" data-split>
    ${num ? `<span class="sec-head__num" aria-hidden="true">${pad(num)}</span>` : ''}
    <div><h2 class="sec-title"${id ? ` id="${id}"` : ''}>${title}</h2>${lead ? `<p class="sec-lead">${lead}</p>` : ''}</div>
  </div>`;
}

export function button(label, href, { variant = 'primary', iconName = 'arrow', attrs = '' } = {}) {
  return `<a class="btn btn--${variant}" href="${href}" ${attrs}><span>${label}</span>${iconName ? icon(iconName) : ''}</a>`;
}

export function cvButton(t, variant = 'primary') {
  return `<a class="btn btn--${variant}" href="${site.cv.href}" download="${site.cv.fileName}" type="application/pdf">${icon('download')}<span>${t('common.downloadCv')}</span></a>`;
}

/** Large editorial link rows (used for "Explore"). */
export function indexList(items) {
  return `<ol class="index-list">${items.map((it, i) => `<li class="reveal">
    <a class="index-row" href="${it.href}">
      <span class="index-row__num" aria-hidden="true">${pad(i + 1)}</span>
      <span class="index-row__title">${it.title}</span>
      <span class="index-row__text">${it.text}</span>
      <span class="index-row__arrow" aria-hidden="true">${icon('arrow')}</span>
    </a></li>`).join('')}</ol>`;
}

/** Full-bleed orange call-to-action band. */
export function ctaBand(t, { title, text, secondary = '' }) {
  return `<section class="cta-band" aria-label="${title.replace(/"/g, '&quot;')}">
    <div class="cta-band__tex" aria-hidden="true"></div>
    <div class="container cta-band__inner reveal">
      <h2 class="cta-band__title" data-split>${title}</h2>
      <div class="cta-band__side">
        <p>${text}</p>
        <div class="actions">${button(t('common.hireMe'), '/contact', { variant: 'dark', iconName: 'mail' })}${secondary}</div>
      </div>
    </div>
  </section>`;
}

export function emptyState({ iconName, title, text, actions = '', titleId, count = '0' }) {
  return `<div class="empty-state reveal">
    <span class="empty-state__count" aria-hidden="true">${count}</span>
    <div class="empty-state__orb" aria-hidden="true">${icon(iconName)}</div>
    <h2 class="empty-state__title"${titleId ? ` id="${titleId}"` : ''}>${title}</h2>
    <p>${text}</p>
    ${actions ? `<div class="actions actions--center">${actions}</div>` : ''}
  </div>`;
}

export function quoteBlock(t) {
  const translation = t('quote.translation');
  return `<figure class="quote reveal">
    <span class="quote__mark" aria-hidden="true">“</span>
    <blockquote lang="en"><p data-split>${t('quote.text')}</p></blockquote>
    ${translation ? `<p class="quote__translation">${translation}</p>` : ''}
    <figcaption><span class="label">Nexify</span><span class="quote__sep" aria-hidden="true"></span><span class="label label--accent">${t('quote.label')}</span></figcaption>
  </figure>`;
}

export function callout(title, text, { iconName = 'info', tone = 'info' } = {}) {
  return `<aside class="callout callout--${tone} reveal">${icon(iconName)}<div><p class="callout__title">${title}</p><p>${text}</p></div></aside>`;
}

/** Experience as a "season record": newest first, one row per organization. */
export function timeline(t) {
  const items = [...experience].reverse();
  return `<ol class="record">${items.map((e) => `
    <li class="record__row reveal${e.current ? ' record__row--current' : ''}">
      <p class="record__period">${e.current ? '<span class="pulse" aria-hidden="true"></span>' : ''}${t(`periods.${e.period}`)}</p>
      <div class="record__main">
        <h3 class="record__org">${e.org}</h3>
        <p class="record__role">${t(`roles.${e.role}`)}</p>
        <ul class="record__points">${t(`experiencePoints.${e.id}`).map((pt) => `<li>${pt}</li>`).join('')}</ul>
      </div>
      <p class="record__loc">${icon('pin')}<span>${e.countries.map((c) => t(`countries.${c}`)).join(' · ')}</span></p>
      <ul class="record__tags">${e.current ? `<li class="tag tag--current">${t('tags.current')}</li>` : ''}${e.tags.map((g) => `<li class="tag tag--${g}">${t(`tags.${g}`)}</li>`).join('')}</ul>
    </li>`).join('')}
  </ol>`;
}

/** Resume highlights as big-number cells. */
export function highlights(t, cols = 2) {
  return `<div class="hairgrid hairgrid--${cols}">${t('highlights').map((h) => `
    <article class="hairgrid__cell highlight reveal">
      <span class="highlight__value" aria-hidden="true">${esc(h.value)}</span>
      <h3 class="svc__title">${h.title}</h3>
      <p class="svc__text">${h.text}</p>
    </article>`).join('')}</div>`;
}

export function chipList(items, className = '') {
  return `<ul class="chips ${className}">${items.map((i) => `<li class="chip">${i}</li>`).join('')}</ul>`;
}

/** Purely decorative scrolling strip (the same names are listed as real text
 *  elsewhere on the page); labels are drawn via CSS from data-text. */
export function marquee(items) {
  const row = (hidden) => `<ul class="marquee__group"${hidden ? ' data-dup' : ''}>${items.map((i) => `<li class="marquee__item" data-text="${i}"></li>`).join('')}</ul>`;
  return `<div class="marquee" aria-hidden="true">${row(false)}${row(true)}</div>`;
}
