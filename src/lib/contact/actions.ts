'use server';

import { headers } from 'next/headers';
import { processContact, type ContactErrorKey } from '@/lib/contact/process';
import type { Field, FieldError, ContactValues } from '@/lib/contact/validate';
import { getLang } from '@/lib/i18n/server';

export interface ContactState {
  status: 'idle' | 'success' | 'error';
  error?: ContactErrorKey;
  errors?: Partial<Record<Field, FieldError>>;
  values?: Partial<ContactValues>;
  /** Changes on every submit so the client can re-focus the status box. */
  nonce?: number;
}

/** Server action used by the contact form (also works without JavaScript). */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const h = await headers();
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
  const input = Object.fromEntries(['name', 'email', 'subject', 'message', 'website', 'token'].map((k) => [k, formData.get(k) ?? '']));
  const result = await processContact(input, { ip, lang: await getLang() });
  if (result.ok) return { status: 'success', nonce: Date.now() };
  return { status: 'error', error: result.error, errors: result.errors, values: result.values, nonce: Date.now() };
}
