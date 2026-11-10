import { availabilityBanner, button, cvButton, indexList, sectionHead, ctaBand, quoteBlock } from '../components.js';
import { socialLinks } from '../layout.js';

export default function home(t) {
  const facts = t('home.facts');
  const stats = [{ label: t('home.statusTitle'), value: t('home.statusValue'), live: true }, ...facts.map((f) => ({ label: f.label, value: f.value }))];
  return `
  <section class="hero" aria-labelledby="hero-title" data-hero>
    <div class="hero__glow" aria-hidden="true"></div>
    <div class="hero__fog" aria-hidden="true"></div>
    <div class="container">
      <div class="hero__top reveal">
        ${availabilityBanner(t)}
        <p class="label hero__eyebrow">${t('home.eyebrow')}</p>
      </div>
      <h1 id="hero-title" class="hero__wordmark"><span class="sr-only">${t('home.title')}</span><span class="hero__word" aria-hidden="true">${[...t('home.title')].map((c) => `<span class="char">${c}</span>`).join('')}</span></h1>
      <div class="hero__bottom">
        <div class="hero__intro reveal">
          <p class="lead">${t('home.lead')}</p>
          <div class="actions">
            ${button(t('common.hireMe'), '/contact', { iconName: 'mail' })}
            ${button(t('common.viewResume'), '/resume', { variant: 'ghost' })}
          </div>
        </div>
        <div class="hero__stats reveal">
          <p class="label">${t('home.factsLabel')}</p>
          <dl class="stats">
            ${stats.map((s) => `<div class="stat${s.live ? ' stat--live' : ''}"><dt>${s.label}</dt><dd>${s.live ? '<span class="pulse" aria-hidden="true"></span>' : ''}${s.value}</dd></div>`).join('')}
          </dl>
          <p class="hero__status-text">${t('home.statusText')}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="sec" aria-labelledby="explore-title">
    <div class="container">
      ${sectionHead(t('home.exploreTitle'), { lead: t('home.exploreLead'), id: 'explore-title', num: 1 })}
      ${indexList([
        { href: '/achievements', title: t('home.explore.achievements.title'), text: t('home.explore.achievements.text') },
        { href: '/resume', title: t('home.explore.resume.title'), text: t('home.explore.resume.text') },
        { href: '/services', title: t('home.explore.services.title'), text: t('home.explore.services.text') },
        { href: '/contact', title: t('home.explore.contact.title'), text: t('home.explore.contact.text') },
      ])}
    </div>
  </section>

  <section class="sec sec--quote">
    <div class="container">${quoteBlock(t)}</div>
  </section>

  <section class="sec" aria-labelledby="social-title">
    <div class="container">
      ${sectionHead(t('home.socialTitle'), { id: 'social-title', num: 2 })}
      <div class="reveal">${socialLinks(t)}</div>
    </div>
  </section>

  ${ctaBand(t, { title: t('home.ctaTitle'), text: t('home.ctaText'), secondary: cvButton(t, 'dark-ghost') })}
  `;
}
