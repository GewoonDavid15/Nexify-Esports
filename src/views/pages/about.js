import { icon } from '../icons.js';
import { pageHero, sectionHead, quoteBlock, ctaBand, button, callout } from '../components.js';

export default function about(t) {
  return `
  ${pageHero(t, { eyebrow: t('about.eyebrow'), title: t('about.title'), lead: t('about.lead') })}
  <section class="section" aria-labelledby="tracks-title">
    <div class="container">
      ${sectionHead(t('about.tracksTitle'), { id: 'tracks-title' })}
      <div class="grid grid--2">
        <article class="card reveal"><span class="card__icon">${icon('gear')}</span><h3 class="card__title">${t('about.playerTitle')}</h3><p class="card__text">${t('about.playerText')}</p></article>
        <article class="card reveal"><span class="card__icon">${icon('spark')}</span><h3 class="card__title">${t('about.contentTitle')}</h3><p class="card__text">${t('about.contentText')}</p></article>
      </div>
      <article class="card card--wide reveal"><span class="card__icon">${icon('users')}</span><div><h3 class="card__title">${t('about.founderTitle')}</h3><p class="card__text">${t('about.founderText')}</p></div></article>
    </div>
  </section>
  <section class="section" aria-labelledby="now-title">
    <div class="container narrow">
      <div class="panel reveal">
        <h2 class="section-title" id="now-title">${t('about.nowTitle')}</h2>
        <p>${t('about.nowText1')}</p>
        <p>${t('about.nowText2')}</p>
        <div class="actions">${button(t('nav.achievements'), '/achievements', { variant: 'ghost' })}${button(t('nav.skills'), '/skills', { variant: 'ghost' })}</div>
      </div>
    </div>
  </section>
  <section class="section section--tight" aria-labelledby="motivation-title">
    <div class="container narrow">
      ${sectionHead(t('about.motivationTitle'), { id: 'motivation-title' })}
      ${quoteBlock(t)}
    </div>
  </section>
  ${ctaBand(t, { title: t('home.ctaTitle'), text: t('home.ctaText') })}
  `;
}
