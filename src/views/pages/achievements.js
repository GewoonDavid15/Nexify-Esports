import { pageHero, sectionHead, timeline, callout, ctaBand, cvButton } from '../components.js';
import { icon } from '../icons.js';
import { socials } from '../../config.js';

export default function achievements(t) {
  const tracker = socials.find((s) => s.id === 'tracker');
  const highlights = t('achievements.highlights');
  return `
  ${pageHero(t, { eyebrow: t('achievements.eyebrow'), title: t('achievements.title'), lead: t('achievements.lead') })}
  <div class="container">${callout(t('achievements.clarifyTitle'), t('achievements.clarifyText'), { iconName: 'alert', tone: 'warn' })}</div>
  <section class="sec" aria-labelledby="hl-title"><div class="container">
    ${sectionHead(t('achievements.highlightsTitle'), { id: 'hl-title', num: 1 })}
    <div class="hairgrid hairgrid--3">${highlights.map((h, i) => `<article class="hairgrid__cell highlight reveal"><span class="svc__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3 class="svc__title">${h.title}</h3><p class="svc__text">${h.text}</p></article>`).join('')}</div>
  </div></section>
  <section class="sec" aria-labelledby="tl-title"><div class="container">
    ${sectionHead(t('achievements.timelineTitle'), { id: 'tl-title', num: 2 })}
    ${timeline(t)}
  </div></section>
  <section class="sec sec--tight" aria-labelledby="tracker-title"><div class="container">
    <div class="external-profile reveal">
      <span class="external-profile__icon" aria-hidden="true">${icon('tracker')}</span>
      <div>
        <p class="label label--accent">${t('common.external')}</p>
        <h2 class="panel__title" id="tracker-title">${t('achievements.trackerTitle')}</h2>
        <p>${t('achievements.trackerText')}</p>
      </div>
      <a class="btn btn--ghost" href="${tracker.href}" target="_blank" rel="noopener noreferrer"><span>${t('achievements.trackerLink')}</span>${icon('external')}<span class="sr-only"> ${t('common.newTab')}</span></a>
    </div>
  </div></section>
  ${ctaBand(t, { title: t('home.ctaTitle'), text: t('home.ctaText'), secondary: cvButton(t, 'dark-ghost') })}
  `;
}
