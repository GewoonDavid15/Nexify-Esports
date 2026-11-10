import { icon } from '../icons.js';
import { pageHero } from '../components.js';
import { LANG_COOKIE } from '../../config.js';

function section(s, i) {
  return `<section class="legal-section" aria-labelledby="ls-${i}">
    <h2 id="ls-${i}">${s.h}</h2>
    ${(s.p || []).map((p) => `<p>${p}</p>`).join('')}
    ${s.list ? `<ul>${s.list.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
  </section>`;
}

function cookieTable(t) {
  return `<div class="table-wrap"><table class="cookie-table">
    <caption>${t('cookiesPage.tableCaption')}</caption>
    <thead><tr><th scope="col">${t('cookiesPage.colName')}</th><th scope="col">${t('cookiesPage.colPurpose')}</th><th scope="col">${t('cookiesPage.colDuration')}</th><th scope="col">${t('cookiesPage.colType')}</th></tr></thead>
    <tbody><tr><td><code>${LANG_COOKIE}</code></td><td>${t('cookiesPage.cookiePurpose')}</td><td>${t('cookiesPage.cookieDuration')}</td><td>${t('cookiesPage.cookieType')}</td></tr></tbody>
  </table></div>`;
}

/** Shared template for the four legal pages. `ns` is the translation namespace. */
export function legalPage(ns) {
  return (t) => {
    const sections = t(`${ns}.sections`);
    const missing = t(`${ns}.missing`);
    return `
    ${pageHero(t, { eyebrow: t(`${ns}.eyebrow`), title: t(`${ns}.title`), lead: t(`${ns}.lead`) })}
    <div class="container legal">
      <aside class="draft-banner reveal" aria-labelledby="draft-title">
        ${icon('alert')}
        <div>
          <p class="draft-banner__title" id="draft-title"><span class="badge badge--warn">${t('common.draftBadge')}</span> ${t('legal.draftTitle')}</p>
          <p>${t('legal.draftText')}</p>
          <p class="draft-banner__missing-title">${t('legal.missingTitle')}</p>
          <ul>${missing.map((m) => `<li>${m}</li>`).join('')}</ul>
        </div>
      </aside>
      <div class="legal-body reveal">
        ${ns === 'cookiesPage' ? cookieTable(t) : ''}
        ${sections.map(section).join('')}
        <p class="muted small">${t('legal.updated')}</p>
      </div>
    </div>`;
  };
}
