import { pageHero, emptyState, button } from '../components.js';

/** Add real testimonials here (with permission) — never placeholders. */
export const testimonials = [];

export default function testimonialsPage(t) {
  return `
  ${pageHero(t, { eyebrow: t('testimonials.eyebrow'), title: t('testimonials.title'), lead: t('testimonials.lead') })}
  <section class="section section--flush"><div class="container narrow">
    ${emptyState({ iconName: 'quote', title: t('testimonials.emptyTitle'), text: t('testimonials.emptyText'), actions: button(t('testimonials.emptyCta'), '/contact') })}
  </div></section>
  `;
}
