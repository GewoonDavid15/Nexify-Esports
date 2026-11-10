import { pageHero, sectionHead, quoteBlock, ctaBand, button } from '../components.js';

export default function about(t) {
  return `
  ${pageHero(t, { eyebrow: t('about.eyebrow'), title: t('about.title'), lead: t('about.lead') })}
  <section class="sec sec--flush" aria-labelledby="tracks-title">
    <div class="container">
      ${sectionHead(t('about.tracksTitle'), { id: 'tracks-title', num: 1 })}
      <div class="split">
        <article class="split__col reveal"><p class="label label--accent">A</p><h3 class="split__title">${t('about.playerTitle')}</h3><p>${t('about.playerText')}</p></article>
        <article class="split__col reveal"><p class="label label--accent">B</p><h3 class="split__title">${t('about.contentTitle')}</h3><p>${t('about.contentText')}</p></article>
      </div>
      <article class="origin reveal">
        <p class="origin__year" aria-hidden="true">2020</p>
        <div><h3 class="split__title">${t('about.founderTitle')}</h3><p>${t('about.founderText')}</p></div>
      </article>
    </div>
  </section>
  <section class="sec" aria-labelledby="now-title">
    <div class="container">
      <div class="honest reveal">
        ${sectionHead(t('about.nowTitle'), { id: 'now-title', num: 2 })}
        <div class="honest__body">
          <p class="honest__big">${t('about.nowText1')}</p>
          <p>${t('about.nowText2')}</p>
          <div class="actions">${button(t('nav.achievements'), '/achievements', { variant: 'ghost' })}${button(t('nav.skills'), '/skills', { variant: 'ghost' })}</div>
        </div>
      </div>
    </div>
  </section>
  <section class="sec sec--quote" aria-label="${t('about.motivationTitle')}">
    <div class="container">${quoteBlock(t)}</div>
  </section>
  ${ctaBand(t, { title: t('home.ctaTitle'), text: t('home.ctaText') })}
  `;
}
