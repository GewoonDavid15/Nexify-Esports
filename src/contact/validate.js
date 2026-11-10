/** Contact-form limits — shared by the server and (via data attributes) the client. */
export const LIMITS = {
  name: { max: 100 },
  email: { max: 200 },
  subject: { max: 150 },
  message: { min: 10, max: 5000 },
};

// Pragmatic email check: one @, no spaces, a dot in the domain.
export const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

const clean = (v) => (typeof v === 'string' ? v.replace(/\r\n?/g, '\n').trim() : '');
// Strip control characters (keep newlines/tabs in the message only).
const singleLine = (v) => clean(v).replace(/[\u0000-\u001f\u007f]+/g, ' ');

/**
 * Returns { values, errors } where errors maps field -> { key, vars }.
 * Error keys correspond to `contact.errors.*` translations.
 */
export function validateContact(input = {}) {
  const values = {
    name: singleLine(input.name),
    email: singleLine(input.email),
    subject: singleLine(input.subject),
    message: clean(input.message).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ''),
  };
  const errors = {};
  if (!values.name) errors.name = { key: 'nameRequired' };
  else if (values.name.length > LIMITS.name.max) errors.name = { key: 'nameTooLong', vars: { max: LIMITS.name.max } };

  if (!values.email) errors.email = { key: 'emailRequired' };
  else if (values.email.length > LIMITS.email.max) errors.email = { key: 'emailTooLong', vars: { max: LIMITS.email.max } };
  else if (!EMAIL_RE.test(values.email)) errors.email = { key: 'emailInvalid' };

  if (!values.subject) errors.subject = { key: 'subjectRequired' };
  else if (values.subject.length > LIMITS.subject.max) errors.subject = { key: 'subjectTooLong', vars: { max: LIMITS.subject.max } };

  if (!values.message) errors.message = { key: 'messageRequired' };
  else if (values.message.length < LIMITS.message.min) errors.message = { key: 'messageTooShort', vars: { min: LIMITS.message.min } };
  else if (values.message.length > LIMITS.message.max) errors.message = { key: 'messageTooLong', vars: { max: LIMITS.message.max } };

  return { values, errors };
}
