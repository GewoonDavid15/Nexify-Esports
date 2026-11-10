import { esc } from '../html.js';
import { icon } from '../icons.js';
import { pageHero, availabilityBanner } from '../components.js';
import { socialLinks } from '../layout.js';
import { site } from '../../config.js';
import { LIMITS } from '../../contact/validate.js';

function field(t, { name, type = 'text', value = '', error, autocomplete, max, min, textarea = false }) {
  const id = `f-${name}`;
  const errId = `${id}-error`;
  const helpId = `${id}-help`;
  const errText = error ? t(`contact.errors.${error.key}`, error.vars) : '';
  const describedBy = [textarea ? helpId : '', errId].filter(Boolean).join(' ');
  const common = `id="${id}" name="${name}" required maxlength="${max}" ${min ? `minlength="${min}"` : ''}
    aria-describedby="${describedBy}" ${error ? 'aria-invalid="true"' : ''} placeholder="${esc(t(`contact.${name}Ph`))}"
    ${autocomplete ? `autocomplete="${autocomplete}"` : ''}`;
  return `<div class="field${error ? ' field--invalid' : ''}" data-field="${name}">
    <label for="${id}">${t(`contact.${name}`)} <span class="field__req" aria-hidden="true">*</span><span class="sr-only"> (${t('contact.required')})</span></label>
    ${textarea
      ? `<textarea ${common} rows="7">${esc(value)}</textarea>
         <div class="field__meta"><span id="${helpId}">${t('contact.messageHelp', { min, max })}</span><span class="counter" data-counter aria-hidden="true">${t('contact.counter', { count: value.length, max })}</span></div>`
      : `<input type="${type}" value="${esc(value)}" ${common} ${type === 'email' ? 'inputmode="email" spellcheck="false" autocapitalize="off"' : ''}>`}
    <p class="field__error" id="${errId}" data-error-for="${name}">${errText ? `${icon('alert')}<span>${errText}</span>` : ''}</p>
  </div>`;
}

/**
 * state: { configured, token, values, errors, status: 'idle'|'success'|'error', errorKey }
 */
export default function contact(t, state) {
  const { configured, token, values = {}, errors = {}, status = 'idle', errorKey } = state;
  const errorMessages = Object.fromEntries(
    Object.keys(t.dict.contact.errors).map((k) => [k, t(`contact.errors.${k}`, { email: site.contactEmail, max: '{max}', min: '{min}' })]),
  );
  const i18n = { errors: errorMessages, sending: t('contact.sending'), submit: t('contact.submit'), counter: t('contact.counter'), successTitle: t('contact.successTitle'), successText: t('contact.successText'), errorTitle: t('contact.errorTitle') };

  const statusBox = status === 'success'
    ? `<div class="form-status form-status--success" role="status" tabindex="-1" data-status>${icon('check')}<div><p class="form-status__title">${t('contact.successTitle')}</p><p>${t('contact.successText')}</p></div></div>`
    : status === 'error'
      ? `<div class="form-status form-status--error" role="alert" tabindex="-1" data-status>${icon('alert')}<div><p class="form-status__title">${t('contact.errorTitle')}</p><p>${t(`contact.errors.${errorKey}`, { email: `<a href="mailto:${site.contactEmail}">${site.contactEmail}</a>` })}</p></div></div>`
      : `<div class="form-status" role="status" tabindex="-1" data-status hidden></div>`;

  return `
  ${pageHero(t, { eyebrow: t('contact.eyebrow'), title: t('contact.title'), lead: t('contact.lead'), extra: `<div class="reveal">${availabilityBanner(t)}</div>` })}
  <div class="container contact-layout">
    <section class="panel contact-form-panel reveal" aria-labelledby="form-title">
      <h2 class="panel__title" id="form-title">${t('contact.formTitle')}</h2>
      ${configured ? '' : `<div class="form-status form-status--warn" role="note">${icon('info')}<div><p class="form-status__title">${t('contact.notConfiguredTitle')}</p><p>${t('contact.notConfiguredText')}</p></div></div>`}
      ${statusBox}
      <form class="contact-form" method="post" action="/contact" novalidate data-contact-form
        data-limits='${esc(JSON.stringify(LIMITS))}' data-i18n='${esc(JSON.stringify(i18n))}' ${status === 'success' ? 'data-sent="true"' : ''}>
        <input type="hidden" name="token" value="${token}">
        <div class="hp" aria-hidden="true">
          <label for="f-website">${t('contact.honeypot')}</label>
          <input type="text" id="f-website" name="website" tabindex="-1" autocomplete="off">
        </div>
        <div class="form-row">
          ${field(t, { name: 'name', value: values.name, error: errors.name, autocomplete: 'name', max: LIMITS.name.max })}
          ${field(t, { name: 'email', type: 'email', value: values.email, error: errors.email, autocomplete: 'email', max: LIMITS.email.max })}
        </div>
        ${field(t, { name: 'subject', value: values.subject, error: errors.subject, max: LIMITS.subject.max })}
        ${field(t, { name: 'message', value: values.message, error: errors.message, textarea: true, min: LIMITS.message.min, max: LIMITS.message.max })}
        <div class="form-actions">
          <button class="btn btn--primary" type="submit" data-submit ${configured ? '' : 'disabled aria-disabled="true"'}>
            <span class="spinner" aria-hidden="true"></span><span data-submit-label>${t('contact.submit')}</span>${icon('arrow')}
          </button>
          <p class="small muted">${t('contact.privacyNote')}</p>
        </div>
      </form>
    </section>
    <aside class="contact-side">
      <section class="panel reveal" aria-labelledby="direct-title">
        <h2 class="panel__title" id="direct-title">${t('contact.directTitle')}</h2>
        <p>${t('contact.directText')}</p>
        <a class="email-link" href="mailto:${site.contactEmail}">${icon('mail')}<span>${site.contactEmail}</span></a>
      </section>
      <section class="panel reveal" aria-labelledby="else-title">
        <h2 class="panel__title" id="else-title">${t('contact.elsewhereTitle')}</h2>
        ${socialLinks(t)}
      </section>
    </aside>
  </div>`;
}
