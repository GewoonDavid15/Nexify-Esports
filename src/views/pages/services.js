import { pageHero, ctaBand, sectionHead, chipList } from '../components.js';
import { icon } from '../icons.js';

const items = [
  { id: 'social', icon: 'layers', tools: ['Canva', 'Adobe Photoshop'] },
  { id: 'planning', icon: 'calendar', tools: ['Notion', 'Trello'] },
  { id: 'community', icon: 'users', tools: ['Discord'] },
  { id: 'editing', icon: 'film', tools: ['Premiere Pro', 'CapCut', 'OBS Studio'] },
  { id: 'branding', icon: 'palette', tools: ['Adobe Photoshop', 'Canva'] },
  { id: 'ops', icon: 'gear', tools: ['Discord', 'Notion', 'Microsoft Office'] },
];

export default function services(t) {
  const steps = t('services.steps');
  return `
  ${pageHero(t, { eyebrow: t('services.eyebrow'), title: t('services.title'), lead: t('services.lead') })}
  <section class="section section--flush"><div class="container">
    <div class="grid grid--3">
      ${items.map((s) => `<article class="card service reveal">
        <span class="card__icon">${icon(s.icon)}</span>
        <h2 class="card__title">${t(`services.items.${s.id}.title`)}</h2>
        <p class="card__text">${t(`services.items.${s.id}.text`)}</p>
        <p class="service__tools-label">${t('services.toolsLabel')}</p>
        ${chipList(s.tools, 'chips--sm chips--tools')}
      </article>`).join('')}
    </div>
  </div></section>
  <section class="section" aria-labelledby="process-title"><div class="container">
    ${sectionHead(t('services.processTitle'), { id: 'process-title' })}
    <ol class="steps">${steps.map((s, i) => `<li class="step reveal"><span class="step__num" aria-hidden="true">0${i + 1}</span><h3 class="card__title">${s.title}</h3><p class="card__text">${s.text}</p></li>`).join('')}</ol>
  </div></section>
  ${ctaBand(t, { title: t('services.ctaTitle'), text: t('services.ctaText') })}
  `;
}
