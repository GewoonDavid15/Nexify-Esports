import { icon } from '../icons.js';
import { availabilityBanner, button, cvButton, linkCard, sectionHead, ctaBand, quoteBlock } from '../components.js';
import { socialLinks } from '../layout.js';

export default function home(t) {
  const facts = t('home.facts');
  return `
  <section class="hero" aria-labelledby="hero-title">
    <div class="container hero__grid">
      <div class="hero__copy">
        ${availabilityBanner(t)}
        <p class="eyebrow reveal">${t('home.eyebrow')}</p>
        <h1 id="hero-title" class="hero__title"><span class="sr-only">${t('home.title')}</span><span class="hero__word" aria-hidden="true">${[...t('home.title')].map((c) => `<span class="char">${c}</span>`).join('')}</span></h1>
        <p class="lead reveal">${t('home.lead')}</p>
        <div class="actions reveal">
          ${button(t('common.hireMe'), '/contact', { iconName: 'mail' })}
          ${button(t('common.viewResume'), '/resume', { variant: 'ghost' })}
        </div>
      </div>
      <aside class="hero__status reveal" aria-labelledby="status-title">
        <div class="status-card">
          <div class="status-card__glow" aria-hidden="true"></div>
          <p class="status-card__label" id="status-title">${t('home.statusTitle')}</p>
          <p class="status-card__value"><span class="pulse" aria-hidden="true"></span>${t('home.statusValue')}</p>
          <p class="status-card__text">${t('home.statusText')}</p>
          <p class="facts-label">${t('home.factsLabel')}</p>
          <dl class="facts">
            ${facts.map((f) => `<div class="fact"><dt>${f.label}</dt><dd>${f.value}</dd></div>`).join('')}
          </dl>
        </div>
      </aside>
    </div>
  </section>

  <section class="section" aria-labelledby="explore-title">
    <div class="container">
      ${sectionHead(t('home.exploreTitle'), { lead: t('home.exploreLead'), id: 'explore-title' })}
      <div class="grid grid--4">
        ${linkCard({ href: '/achievements', iconName: 'layers', title: t('home.explore.achievements.title'), text: t('home.explore.achievements.text') })}
        ${linkCard({ href: '/resume', iconName: 'folder', title: t('home.explore.resume.title'), text: t('home.explore.resume.text') })}
        ${linkCard({ href: '/services', iconName: 'spark', title: t('home.explore.services.title'), text: t('home.explore.services.text') })}
        ${linkCard({ href: '/contact', iconName: 'mail', title: t('home.explore.contact.title'), text: t('home.explore.contact.text') })}
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container narrow">${quoteBlock(t)}</div>
  </section>

  <section class="section" aria-labelledby="social-title">
    <div class="container">
      ${sectionHead(t('home.socialTitle'), { id: 'social-title' })}
      <div class="reveal">${socialLinks(t)}</div>
    </div>
  </section>

  ${ctaBand(t, { title: t('home.ctaTitle'), text: t('home.ctaText'), secondary: cvButton(t, 'ghost') })}
  `;
}
