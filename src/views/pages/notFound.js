import { button } from '../components.js';

export default function notFound(t) {
  return `<section class="page-hero not-found" aria-labelledby="page-title">
    <div class="container not-found__inner">
      <div class="not-found__art" aria-hidden="true">
        <span class="nf-cloud nf-cloud--1"></span><span class="nf-cloud nf-cloud--2"></span><span class="nf-cloud nf-cloud--3"></span>
        <span class="not-found__code">404</span>
      </div>
      <p class="eyebrow reveal">${t('notFound.eyebrow')}</p>
      <h1 id="page-title" class="page-title reveal">${t('notFound.title')}</h1>
      <p class="lead reveal">${t('notFound.text')}</p>
      <div class="actions actions--center reveal">${button(t('common.backHome'), '/')}${button(t('nav.contact'), '/contact', { variant: 'ghost' })}</div>
    </div>
  </section>`;
}
