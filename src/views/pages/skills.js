import { pageHero, callout, chipList, ctaBand, button } from '../components.js';
import { skillGroups, tools } from '../../resume.js';
import { icon } from '../icons.js';

const groupIcons = { core: 'spark', social: 'layers', community: 'users', ops: 'gear', player: 'user', tools: 'code' };

export default function skills(t) {
  const group = (id, items, extra = '') => `
    <section class="card skill-group reveal" aria-labelledby="sg-${id}">
      <div class="skill-group__head"><span class="card__icon">${icon(groupIcons[id])}</span>
      <div><h2 class="card__title" id="sg-${id}">${t(`skillsPage.groups.${id}.title`)}</h2><p class="card__text">${t(`skillsPage.groups.${id}.text`)}</p></div></div>
      ${chipList(items, id === 'tools' ? 'chips--tools' : '')}
      ${extra}
    </section>`;
  return `
  ${pageHero(t, { eyebrow: t('skillsPage.eyebrow'), title: t('skillsPage.title'), lead: t('skillsPage.lead') })}
  <div class="container">
    ${callout(t('common.selfReported'), t('skillsPage.disclaimer'))}
    <div class="grid grid--2 skill-grid">
      ${skillGroups.map((g) => group(g.id, g.skills.map((k) => t(`skills.${k}`)), g.id === 'player' ? `<p class="note">${icon('info')}<span>${t('skillsPage.playerNote')}</span></p>` : '')).join('')}
      ${group('tools', tools)}
    </div>
  </div>
  ${ctaBand(t, { title: t('services.ctaTitle'), text: t('services.ctaText'), secondary: button(t('nav.services'), '/services', { variant: 'ghost' }) })}
  `;
}
