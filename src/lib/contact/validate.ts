/** Contact-form limits — shared by the server and the client form. */
export const LIMITS = {
  name: { max: 100 },
  email: { max: 200 },
  subject: { max: 150 },
  message: { min: 10, max: 5000 },
} as const;

export const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

export type Field = 'name' | 'email' | 'subject' | 'message';
export type ErrorKey =
  | 'nameRequired' | 'nameTooLong' | 'emailRequired' | 'emailInvalid' | 'emailTooLong'
  | 'subjectRequired' | 'subjectTooLong' | 'messageRequired' | 'messageTooShort' | 'messageTooLong';
export interface FieldError { key: ErrorKey; vars?: Record<string, number> }
export type ContactValues = Record<Field, string>;

const clean = (v: unknown) => (typeof v === 'string' ? v.replace(/\r\n?/g, '\n').trim() : '');
// eslint-disable-next-line no-control-regex
const singleLine = (v: unknown) => clean(v).replace(/[\u0000-\u001f\u007f]+/g, ' ');

export function validateField(field: Field, raw: string): FieldError | null {
  const v = raw.trim();
  switch (field) {
    case 'name':
      if (!v) return { key: 'nameRequired' };
      if (v.length > LIMITS.name.max) return { key: 'nameTooLong', vars: { max: LIMITS.name.max } };
      return null;
    case 'email':
      if (!v) return { key: 'emailRequired' };
      if (v.length > LIMITS.email.max) return { key: 'emailTooLong', vars: { max: LIMITS.email.max } };
      if (!EMAIL_RE.test(v)) return { key: 'emailInvalid' };
      return null;
    case 'subject':
      if (!v) return { key: 'subjectRequired' };
      if (v.length > LIMITS.subject.max) return { key: 'subjectTooLong', vars: { max: LIMITS.subject.max } };
      return null;
    case 'message':
      if (!v) return { key: 'messageRequired' };
      if (v.length < LIMITS.message.min) return { key: 'messageTooShort', vars: { min: LIMITS.message.min } };
      if (v.length > LIMITS.message.max) return { key: 'messageTooLong', vars: { max: LIMITS.message.max } };
      return null;
  }
}

export function validateContact(input: Record<string, unknown>): { values: ContactValues; errors: Partial<Record<Field, FieldError>> } {
  const values: ContactValues = {
    name: singleLine(input.name),
    email: singleLine(input.email),
    subject: singleLine(input.subject),
    // eslint-disable-next-line no-control-regex
    message: clean(input.message).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ''),
  };
  const errors: Partial<Record<Field, FieldError>> = {};
  (Object.keys(values) as Field[]).forEach((f) => {
    const e = validateField(f, values[f]);
    if (e) errors[f] = e;
  });
  return { values, errors };
}
