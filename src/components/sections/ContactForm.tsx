'use client';

import { useActionState, useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { submitContact, type ContactState } from '@/lib/contact/actions';
import { LIMITS, validateField, type Field, type FieldError } from '@/lib/contact/validate';
import { fmt } from '@/lib/i18n/fmt';
import type { Dict } from '@/lib/i18n/en';
import { site } from '@/lib/config';
import { Icon } from '../ui/Icon';

type Labels = Dict['contact'];
const FIELDS: Field[] = ['name', 'email', 'subject', 'message'];

export function ContactForm({ t, token, configured }: { t: Labels; token: string; configured: boolean }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: 'idle' });
  const [errors, setErrors] = useState<Partial<Record<Field, FieldError>>>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [count, setCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const msg = (e?: FieldError) => (e ? fmt(t.errors[e.key], e.vars ?? {}) : '');

  // Server result: show server field errors, reset on success, focus status.
  useEffect(() => {
    if (state.status === 'idle') return;
    if (state.errors) setErrors(state.errors);
    if (state.status === 'success') { formRef.current?.reset(); setErrors({}); setTouched({}); setCount(0); }
    statusRef.current?.focus();
  }, [state]);

  const check = (f: Field, value: string) => setErrors((prev) => ({ ...prev, [f]: validateField(f, value) ?? undefined }));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget);
    const next: Partial<Record<Field, FieldError>> = {};
    FIELDS.forEach((f) => { const err = validateField(f, String(fd.get(f) ?? '')); if (err) next[f] = err; });
    setErrors(next);
    setTouched({ name: true, email: true, subject: true, message: true });
    const first = FIELDS.find((f) => next[f]);
    if (first) { e.preventDefault(); formRef.current?.querySelector<HTMLElement>(`#f-${first}`)?.focus(); }
  };

  const status = state.status === 'success'
    ? { tone: 'success', title: t.successTitle, text: t.successText }
    : state.status === 'error'
      ? { tone: 'error', title: t.errorTitle, text: fmt(t.errors[state.error ?? 'rejected'], { email: site.contactEmail }) }
      : null;

  const field = (f: Field, opts: { type?: string; autoComplete?: string; textarea?: boolean }) => {
    const err = touched[f] || state.status === 'error' ? errors[f] : undefined;
    const lim = LIMITS[f] as { max: number; min?: number };
    const common = {
      id: `f-${f}`, name: f, required: true, maxLength: lim.max, minLength: lim.min,
      placeholder: t[`${f}Ph` as const], defaultValue: state.values?.[f] ?? '',
      'aria-invalid': err ? true : undefined,
      'aria-describedby': [opts.textarea ? `f-${f}-help` : '', `f-${f}-err`].filter(Boolean).join(' '),
      onBlur: (e: { target: HTMLInputElement | HTMLTextAreaElement }) => { if (e.target.value.trim()) setTouched((x) => ({ ...x, [f]: true })); check(f, e.target.value); },
      onChange: (e: { target: HTMLInputElement | HTMLTextAreaElement }) => { if (f === 'message') setCount(e.target.value.length); if (touched[f]) check(f, e.target.value); },
    };
    return (
      <div className={`field${err ? ' field--bad' : ''}`}>
        <label htmlFor={`f-${f}`}>{t[f]} <span className="field__req" aria-hidden>*</span><span className="sr-only"> ({t.required})</span></label>
        {opts.textarea
          ? <textarea {...common} rows={7} />
          : <input {...common} type={opts.type ?? 'text'} autoComplete={opts.autoComplete} {...(opts.type === 'email' ? { inputMode: 'email' as const, spellCheck: false, autoCapitalize: 'off' } : {})} />}
        {opts.textarea ? (
          <div className="field__meta">
            <span id={`f-${f}-help`}>{fmt(t.messageHelp, { min: LIMITS.message.min, max: LIMITS.message.max })}</span>
            <span className={count > LIMITS.message.max ? 'is-over' : undefined} aria-hidden>{fmt(t.counter, { count, max: LIMITS.message.max })}</span>
          </div>
        ) : null}
        <p className="field__err" id={`f-${f}-err`}>
          <AnimatePresence initial={false}>
            {err ? (
              <m.span key={err.key} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Icon name="alert" />{msg(err)}
              </m.span>
            ) : null}
          </AnimatePresence>
        </p>
      </div>
    );
  };

  return (
    <>
      {!configured ? (
        <div className="fstatus fstatus--warn" role="note">
          <Icon name="info" />
          <div><p className="fstatus__title">{t.notConfiguredTitle}</p><p>{t.notConfiguredText}</p></div>
        </div>
      ) : null}
      <div ref={statusRef} tabIndex={-1} className="fstatus-wrap" role={status?.tone === 'error' ? 'alert' : 'status'}>
        <AnimatePresence mode="wait">
          {status ? (
            <m.div key={`${state.nonce}`} className={`fstatus fstatus--${status.tone}`}
              initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}>
              {status.tone === 'success' ? (
                <svg className="icon fstatus__check" viewBox="0 0 24 24" aria-hidden>
                  <m.path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.15 }} />
                </svg>
              ) : <Icon name="alert" />}
              <div><p className="fstatus__title">{status.title}</p><p>{status.text}</p></div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
      <form ref={formRef} className="cform" action={action} onSubmit={onSubmit} noValidate aria-busy={pending}>
        <input type="hidden" name="token" value={token} />
        <div className="hp" aria-hidden="true">
          <label htmlFor="f-website">{t.honeypot}</label>
          <input type="text" id="f-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="cform__row">
          {field('name', { autoComplete: 'name' })}
          {field('email', { type: 'email', autoComplete: 'email' })}
        </div>
        {field('subject', {})}
        {field('message', { textarea: true })}
        <div className="cform__actions">
          <button type="submit" className="btn btn--primary" disabled={!configured || pending} data-magnetic="">
            {pending ? <span className="spinner" aria-hidden /> : null}
            <span>{pending ? t.sending : t.submit}</span>
            {!pending ? <Icon name="arrow" className="btn__end" /> : null}
          </button>
          <p className="cform__note" dangerouslySetInnerHTML={{ __html: t.privacyNote }} />
        </div>
      </form>
    </>
  );
}
