export const LIMITS = Object.freeze({ text: 120, email: 254, phone: 32 });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Must start with +, a digit or "("; only digits and common separators after.
const PHONE = /^(\+|\(|\d)[\d\s().-]*$/;

/** Returns `{ valid, errors, value }`. Error values are i18n message keys. */
export function validateRegistration(input) {
  const value = {
    name: clean(input.name),
    role: clean(input.role),
    company: clean(input.company),
    email: clean(input.email),
    phone: clean(input.phone),
    consentShare: input.consentShare === true,
    newsletterOptIn: input.newsletterOptIn === true,
  };
  const errors = {};
  if (!value.name || value.name.length > LIMITS.text) errors.name = 'errName';
  if (!value.role || value.role.length > LIMITS.text) errors.role = 'errRole';
  if (!value.company || value.company.length > LIMITS.text) errors.company = 'errCompany';
  if (!EMAIL.test(value.email) || value.email.length > LIMITS.email) errors.email = 'errEmail';
  const digits = value.phone.replace(/\D/g, '').length;
  if (!PHONE.test(value.phone) || digits < 8 || digits > 15 || value.phone.length > LIMITS.phone) {
    errors.phone = 'errPhone';
  }
  if (!value.consentShare) errors.consent = 'errConsent';
  return { valid: Object.keys(errors).length === 0, errors, value };
}

function clean(raw) {
  return String(raw ?? '').trim().replace(/\s+/g, ' ');
}

/** Builds the persisted record. Pure: id and timestamp are injected. */
export function createParticipantRecord({ id, registration, summary, language, now }) {
  return {
    id,
    name: registration.name,
    company: registration.company,
    role: registration.role,
    email: registration.email,
    phone: registration.phone,
    score: summary.score,
    accuracyPct: summary.accuracyPct,
    newsletterOptIn: registration.newsletterOptIn,
    consentShare: registration.consentShare,
    language,
    createdAt: now.toISOString(),
  };
}
