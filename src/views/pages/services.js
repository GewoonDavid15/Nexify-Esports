import { pageHero, ctaBand, sectionHead, chipList } from '../components.js';

const items = [
  { id: 'social', tools: ['Notion', 'Trello', 'Canva'] },
  { id: 'community', tools: ['Discord'] },
  { id: 'editing', tools: ['Premiere Pro', 'CapCut'] },
  { id: 'branding', tools: ['Photoshop', 'Canva'] },
  { id: 'tech', tools: ['BDFD', 'OBS Studio', 'Lua', 'Python'] },
  { id: 'ops', tools: ['Discord', 'Notion', 'Microsoft Office'] },
];

export default function services(t) {
  const steps = t('services.steps');
  return `
  ${pageHero(t, { eyebrow: t('services.eyebrow'), title: t('services.title'), lead: t('services.lead') })}
  <section class="sec sec--flush"><div class="container">
    <div class="hairgrid hairgrid--3">
      ${items.map((s, i) => `<article class="hairgrid__cell svc reveal">
        <span class="svc__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <h2 class="svc__title">${t(`services.items.${s.id}.title`)}</h2>
        <p class="svc__text">${t(`services.items.${s.id}.text`)}</p>
        <p class="label">${t('services.toolsLabel')}</p>
        ${chipList(s.tools, 'chips--sm chips--tools')}
      </article>`).join('')}
    </div>
  </div></section>
  <section class="sec" aria-labelledby="process-title"><div class="container">
    ${sectionHead(t('services.processTitle'), { id: 'process-title', num: 1 })}
    <ol class="steps">${steps.map((s, i) => `<li class="step reveal"><span class="step__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3 class="step__title">${s.title}</h3><p>${s.text}</p></li>`).join('')}</ol>
  </div></section>
  ${ctaBand(t, { title: t('services.ctaTitle'), text: t('services.ctaText') })}
  `;
}
