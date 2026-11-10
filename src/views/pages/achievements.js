import { pageHero, sectionHead, timeline, callout, ctaBand, cvButton } from '../components.js';
import { icon } from '../icons.js';
import { socials } from '../../config.js';

export default function achievements(t) {
  const tracker = socials.find((s) => s.id === 'tracker');
  const highlights = t('achievements.highlights');
  return `
  ${pageHero(t, { eyebrow: t('achievements.eyebrow'), title: t('achievements.title'), lead: t('achievements.lead') })}
  <div class="container">${callout(t('achievements.clarifyTitle'), t('achievements.clarifyText'), { iconName: 'alert', tone: 'warn' })}</div>
  <section class="section" aria-labelledby="hl-title"><div class="container">
    ${sectionHead(t('achievements.highlightsTitle'), { id: 'hl-title' })}
    <div class="grid grid--3">${highlights.map((h, i) => `<article class="card reveal"><span class="card__icon">${icon(['users', 'gear', 'layers'][i])}</span><h3 class="card__title">${h.title}</h3><p class="card__text">${h.text}</p></article>`).join('')}</div>
  </div></section>
  <section class="section" aria-labelledby="tl-title"><div class="container narrow">
    ${sectionHead(t('achievements.timelineTitle'), { id: 'tl-title' })}
    ${timeline(t)}
  </div></section>
  <section class="section section--tight" aria-labelledby="tracker-title"><div class="container narrow">
    <div class="panel reveal external-profile">
      <span class="card__icon">${icon('tracker')}</span>
      <div>
        <h2 class="panel__title" id="tracker-title">${t('achievements.trackerTitle')}</h2>
        <p>${t('achievements.trackerText')}</p>
        <a class="text-link" href="${tracker.href}" target="_blank" rel="noopener noreferrer">${t('achievements.trackerLink')} ${icon('external')}<span class="sr-only"> ${t('common.newTab')}</span></a>
      </div>
    </div>
  </div></section>
  ${ctaBand(t, { title: t('home.ctaTitle'), text: t('home.ctaText'), secondary: cvButton(t, 'ghost') })}
  `;
}
