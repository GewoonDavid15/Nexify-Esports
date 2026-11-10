import { icon } from './icons.js';
import { site } from '../config.js';
import { experience } from '../resume.js';

export function availabilityBanner(t) {
  return `<div class="availability" role="note"><span class="pulse" aria-hidden="true"></span><span>${t('common.availability')}</span></div>`;
}

export function pageHero(t, { eyebrow, title, lead, actions = '', extra = '', id = 'page-title', ghost }) {
  return `<section class="page-hero" aria-labelledby="${id}">
    <span class="page-hero__ghost" aria-hidden="true">${ghost ?? eyebrow}</span>
    <div class="container">
      <p class="eyebrow reveal">${eyebrow}</p>
      <h1 id="${id}" class="page-title reveal">${title}</h1>
      ${lead ? `<p class="lead reveal">${lead}</p>` : ''}
      ${actions ? `<div class="actions reveal">${actions}</div>` : ''}
      ${extra}
    </div>
  </section>`;
}

export function sectionHead(title, { lead = '', id } = {}) {
  return `<div class="section-head reveal"><h2 class="section-title"${id ? ` id="${id}"` : ''}>${title}</h2>${lead ? `<p class="section-lead">${lead}</p>` : ''}</div>`;
}

export function button(label, href, { variant = 'primary', iconName = 'arrow', attrs = '' } = {}) {
  return `<a class="btn btn--${variant}" href="${href}" ${attrs}><span>${label}</span>${iconName ? icon(iconName) : ''}</a>`;
}

export function cvButton(t, variant = 'primary') {
  return `<a class="btn btn--${variant}" href="${site.cv.href}" download="${site.cv.fileName}" type="application/pdf">${icon('download')}<span>${t('common.downloadCv')}</span></a>`;
}

export function linkCard({ href, title, text, iconName }) {
  return `<a class="card card--link reveal" href="${href}">
    <span class="card__icon">${icon(iconName)}</span>
    <span class="card__title">${title}</span>
    <span class="card__text">${text}</span>
    <span class="card__arrow">${icon('arrow')}</span>
  </a>`;
}

export function ctaBand(t, { title, text, secondary = '' }) {
  return `<section class="section"><div class="container"><div class="cta-band reveal">
    <div><h2 class="cta-band__title">${title}</h2><p>${text}</p></div>
    <div class="actions">${button(t('common.hireMe'), '/contact')}${secondary}</div>
  </div></div></section>`;
}

export function emptyState({ iconName, title, text, actions = '', titleId }) {
  return `<div class="empty-state reveal">
    <div class="empty-state__orb" aria-hidden="true">${icon(iconName)}</div>
    <h2 class="empty-state__title"${titleId ? ` id="${titleId}"` : ''}>${title}</h2>
    <p>${text}</p>
    ${actions ? `<div class="actions actions--center">${actions}</div>` : ''}
  </div>`;
}

export function quoteBlock(t) {
  const translation = t('quote.translation');
  return `<figure class="quote reveal">
    ${icon('quote', { className: 'quote__mark' })}
    <blockquote lang="en"><p>“${t('quote.text')}”</p></blockquote>
    ${translation ? `<p class="quote__translation">${translation}</p>` : ''}
    <figcaption>— Nexify · ${t('quote.label')}</figcaption>
  </figure>`;
}

export function callout(title, text, { iconName = 'info', tone = 'info' } = {}) {
  return `<aside class="callout callout--${tone} reveal">${icon(iconName)}<div><p class="callout__title">${title}</p><p>${text}</p></div></aside>`;
}

export function timeline(t, { compact = false } = {}) {
  const items = [...experience].reverse();
  return `<ol class="timeline${compact ? ' timeline--compact' : ''}">${items.map((e) => `
    <li class="timeline__item reveal">
      <div class="timeline__dot" aria-hidden="true"></div>
      <article class="timeline__card">
        <p class="timeline__period">${t(`periods.${e.period}`)}</p>
        <h3 class="timeline__org">${e.org}</h3>
        <p class="timeline__role">${t(`roles.${e.role}`)}</p>
        <p class="timeline__loc">${icon('pin')}<span>${e.countries.map((c) => t(`countries.${c}`)).join(' · ')}</span></p>
        ${compact ? '' : `<ul class="tags">${e.tags.map((g) => `<li class="tag tag--${g}">${t(`tags.${g}`)}</li>`).join('')}</ul>`}
      </article>
    </li>`).join('')}
  </ol>`;
}

export function chipList(items, className = '') {
  return `<ul class="chips ${className}">${items.map((i) => `<li class="chip">${i}</li>`).join('')}</ul>`;
}
