import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createParticipantRecord, validateRegistration } from '../src/domain/participant.js';

// Anonymised placeholders only (InfoSec guardrail: no real PII in tests).
const valid = {
  name: ' Test   Person ', role: 'Role', company: 'Example Co',
  email: 'test.person@example.com', phone: '+55 (11) 90000-0000',
  consentShare: true, newsletterOptIn: false,
};

test('valid input is normalized', () => {
  const r = validateRegistration(valid);
  assert.equal(r.valid, true);
  assert.equal(r.value.name, 'Test Person');
});

test('every required field reports an i18n error key', () => {
  const r = validateRegistration({});
  assert.deepEqual(Object.keys(r.errors).sort(), ['company', 'consent', 'email', 'name', 'phone', 'role']);
});

test('consent is mandatory, newsletter is optional', () => {
  assert.equal(validateRegistration({ ...valid, consentShare: false }).errors.consent, 'errConsent');
  assert.equal(validateRegistration({ ...valid, newsletterOptIn: false }).valid, true);
});

test('email and phone formats are enforced', () => {
  assert.ok(validateRegistration({ ...valid, email: 'nope' }).errors.email);
  assert.ok(validateRegistration({ ...valid, phone: '123' }).errors.phone);
  assert.ok(validateRegistration({ ...valid, phone: '=1+1' }).errors.phone);
  assert.ok(validateRegistration({ ...valid, phone: '55 11 abcd 0000' }).errors.phone);
});

test('record is built from injected id and clock', () => {
  const registration = validateRegistration(valid).value;
  const record = createParticipantRecord({
    id: 'id-1', registration, language: 'pt',
    summary: { score: 5000, accuracyPct: 80 }, now: new Date('2026-01-02T03:04:05Z'),
  });
  assert.equal(record.createdAt, '2026-01-02T03:04:05.000Z');
  assert.equal(record.score, 5000);
  assert.equal(record.id, 'id-1');
});
