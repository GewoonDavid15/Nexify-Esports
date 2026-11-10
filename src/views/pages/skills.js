import { pageHero, callout, chipList, ctaBand, button, marquee } from '../components.js';
import { skillGroups, tools } from '../../resume.js';

export default function skills(t) {
  const groups = [
    ...skillGroups.filter((g) => g.id !== 'languages').map((g) => ({ id: g.id, items: g.skills.map((k) => t(`skills.${k}`)) })),
    { id: 'tools', items: tools, tools: true },
    ...skillGroups.filter((g) => g.id === 'languages').map((g) => ({ id: g.id, items: g.skills.map((k) => t(`skills.${k}`)) })),
  ];
  return `
  ${pageHero(t, { eyebrow: t('skillsPage.eyebrow'), title: t('skillsPage.title'), lead: t('skillsPage.lead') })}
  <div class="container">
    ${callout(t('common.selfReported'), t('skillsPage.disclaimer'))}
    <div class="hairgrid hairgrid--2">
      ${groups.map((g, i) => `
      <section class="hairgrid__cell skill-group reveal" aria-labelledby="sg-${g.id}">
        <p class="label label--accent">${String(i + 1).padStart(2, '0')}</p>
        <h2 class="skill-group__title" id="sg-${g.id}">${t(`skillsPage.groups.${g.id}.title`)}</h2>
        <p class="skill-group__text">${t(`skillsPage.groups.${g.id}.text`)}</p>
        ${chipList(g.items, g.tools ? 'chips--tools' : '')}
      </section>`).join('')}
    </div>
  </div>
  <section class="sec sec--marquee">${marquee([...tools, 'Discord', 'BDFD', 'Lua', 'Python'])}</section>
  ${ctaBand(t, { title: t('services.ctaTitle'), text: t('services.ctaText'), secondary: button(t('nav.services'), '/services', { variant: 'dark-ghost' }) })}
  `;
}
