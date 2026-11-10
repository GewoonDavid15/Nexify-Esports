import { pageHero, callout, chipList, ctaBand, button, marquee, sectionHead } from '../components.js';
import { skillGroups, tools } from '../../resume.js';
import { icon } from '../icons.js';

export default function skills(t) {
  return `
  ${pageHero(t, { eyebrow: t('skillsPage.eyebrow'), title: t('skillsPage.title'), lead: t('skillsPage.lead') })}
  <div class="container">
    ${callout(t('common.selfReported'), t('skillsPage.disclaimer'))}
    <div class="hairgrid hairgrid--2">
      ${skillGroups.map((g, i) => `
      <section class="hairgrid__cell skill-group reveal" aria-labelledby="sg-${g.id}">
        <p class="label label--accent">${String(i + 1).padStart(2, '0')}</p>
        <h2 class="skill-group__title" id="sg-${g.id}">${t(`skillsPage.groups.${g.id}.title`)}</h2>
        <p class="skill-group__text">${t(`skillsPage.groups.${g.id}.text`)}</p>
        ${chipList(g.skills.map((k) => t(`skills.${k}`)))}
        ${g.id === 'player' ? `<p class="note">${icon('info')}<span>${t('skillsPage.playerNote')}</span></p>` : ''}
      </section>`).join('')}
      <section class="hairgrid__cell skill-group reveal" aria-labelledby="sg-tools">
        <p class="label label--accent">${String(skillGroups.length + 1).padStart(2, '0')}</p>
        <h2 class="skill-group__title" id="sg-tools">${t('skillsPage.groups.tools.title')}</h2>
        <p class="skill-group__text">${t('skillsPage.groups.tools.text')}</p>
        ${chipList(tools, 'chips--tools')}
      </section>
    </div>
  </div>
  <section class="sec sec--marquee" aria-hidden="true">${marquee(tools)}</section>
  ${ctaBand(t, { title: t('services.ctaTitle'), text: t('services.ctaText'), secondary: button(t('nav.services'), '/services', { variant: 'dark-ghost' }) })}
  `;
}
