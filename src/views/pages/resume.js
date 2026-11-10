import { pageHero, sectionHead, cvButton, timeline, chipList, quoteBlock, callout } from '../components.js';
import { resumeSkills, tools } from '../../resume.js';

export default function resume(t) {
  const details = t('resume.details');
  return `
  ${pageHero(t, {
    eyebrow: t('resume.eyebrow'), title: t('resume.title'), lead: t('resume.lead'),
    actions: `${cvButton(t)}<span class="label">${t('common.downloadCvNote')}</span>`,
  })}
  <div class="container resume-layout">
    <div class="resume-main">
      <section class="sec sec--flush" aria-labelledby="profile-title">
        ${sectionHead(t('resume.profileTitle'), { id: 'profile-title', num: 1 })}
        <p class="resume-profile reveal">${t('resume.profileText')}</p>
        <dl class="stats stats--2 reveal">${details.map((d) => `<div class="stat"><dt>${d.label}</dt><dd>${d.value}</dd></div>`).join('')}</dl>
      </section>
      <section class="sec sec--flush" aria-labelledby="exp-title">
        ${sectionHead(t('resume.experienceTitle'), { id: 'exp-title', num: 2 })}
        ${timeline(t)}
        ${callout(t('achievements.clarifyTitle'), t('resume.note'))}
      </section>
    </div>
    <aside class="resume-side">
      <section class="panel reveal" aria-labelledby="rskills-title">
        <h2 class="panel__title" id="rskills-title">${t('resume.skillsTitle')}</h2>
        ${chipList(resumeSkills.map((k) => t(`skills.${k}`)))}
      </section>
      <section class="panel reveal" aria-labelledby="rtools-title">
        <h2 class="panel__title" id="rtools-title">${t('resume.toolsTitle')}</h2>
        ${chipList(tools, 'chips--tools')}
      </section>
      <section class="panel panel--accent reveal" aria-labelledby="rdl-title">
        <h2 class="panel__title" id="rdl-title">${t('resume.downloadTitle')}</h2>
        <p>${t('resume.downloadText')}</p>
        ${cvButton(t)}
      </section>
    </aside>
  </div>
  <section class="sec sec--quote" aria-label="${t('resume.mottoTitle')}">
    <div class="container">${quoteBlock(t)}</div>
  </section>
  `;
}
