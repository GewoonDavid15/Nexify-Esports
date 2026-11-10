import { icon } from '../icons.js';
import { button } from '../components.js';

export default function nexifyDev(t) {
  const c = t('nexifyDev.console');
  return `
  <section class="page-hero dev-hero" aria-labelledby="page-title">
    <div class="container dev-hero__grid">
      <div>
        <p class="eyebrow eyebrow--dev reveal">${icon('code')} ${t('nexifyDev.eyebrow')}</p>
        <h1 id="page-title" class="page-title dev-title reveal"><span class="dev-title__by">Nexify</span> <span class="dev-title__small">by</span> <span class="gradient-text">Nexify</span></h1>
        <p class="lead reveal">${t('nexifyDev.lead')}</p>
      </div>
      <figure class="console reveal" aria-labelledby="console-label">
        <figcaption class="console__bar" id="console-label"><span class="console__dots" aria-hidden="true"><i></i><i></i><i></i></span>${t('nexifyDev.consoleLabel')}</figcaption>
        <dl class="console__body">
          <div><dt>${c.project}</dt><dd>"Nexify by Nexify"</dd></div>
          <div><dt>${c.type}</dt><dd>"${c.typeValue}"</dd></div>
          <div><dt>${c.status}</dt><dd class="console__status">"${c.statusValue}"<span class="caret" aria-hidden="true"></span></dd></div>
          <div><dt>${c.releases}</dt><dd>"${c.releasesValue}"</dd></div>
        </dl>
      </figure>
    </div>
  </section>
  <section class="section section--flush"><div class="container">
    <div class="grid grid--2">
      <article class="card card--dev reveal"><h2 class="card__title">${t('nexifyDev.whatTitle')}</h2><p class="card__text">${t('nexifyDev.whatText')}</p></article>
      <article class="card card--dev reveal"><h2 class="card__title">${t('nexifyDev.statusTitle')}: <span class="badge">${t('nexifyDev.statusValue')}</span></h2><p class="card__text">${t('nexifyDev.statusText')}</p></article>
    </div>
  </div></section>
  <section class="section" aria-labelledby="log-title"><div class="container narrow">
    <h2 class="section-title reveal" id="log-title">${t('nexifyDev.logTitle')}</h2>
    <div class="log-empty reveal"><span aria-hidden="true">›</span> ${t('nexifyDev.logEmpty')}</div>
  </div></section>
  <section class="section section--tight"><div class="container narrow">
    <div class="panel reveal dev-back"><div><h2 class="panel__title">${t('nexifyDev.backTitle')}</h2><p>${t('nexifyDev.backText')}</p></div>
    <div class="actions">${button(t('nav.about'), '/about', { variant: 'ghost' })}${button(t('nav.services'), '/services', { variant: 'ghost' })}</div></div>
  </div></section>
  `;
}
