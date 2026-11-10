import { pageHero, button } from '../components.js';
export default function notFound(t) {
  return pageHero(t, { eyebrow: t('notFound.eyebrow'), title: t('notFound.title'), lead: t('notFound.text'), actions: button(t('common.backHome'), '/') });
}
