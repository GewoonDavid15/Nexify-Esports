import { pageHero, emptyState, button } from '../components.js';
import { icon } from '../icons.js';
import { socials } from '../../config.js';

export default function portfolio(t) {
  const yt = socials.find((s) => s.id === 'youtube');
  return `
  ${pageHero(t, { eyebrow: t('portfolio.eyebrow'), title: t('portfolio.title'), lead: t('portfolio.lead') })}
  <section class="section section--flush"><div class="container narrow">
    ${emptyState({
      iconName: 'folder', title: t('portfolio.emptyTitle'),
      text: `${t('portfolio.emptyText')}</p><p class="muted">${t('portfolio.emptyHint')}`,
      actions: `<a class="btn btn--ghost" href="${yt.href}" target="_blank" rel="noopener noreferrer">${icon('youtube')}<span>${t('portfolio.youtube')}</span><span class="sr-only"> ${t('common.newTab')}</span></a>${button(t('common.contactMe'), '/contact')}`,
    })}
  </div></section>
  `;
}
