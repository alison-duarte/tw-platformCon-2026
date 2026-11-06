// Test doubles. No browser storage, no network. Passwords here are throwaway test values.
import { derivePasswordHash, randomSalt } from '../src/infrastructure/password-hash.js';
import { QUESTIONS } from '../src/content/questions.js';

export { QUESTIONS };

export const registration = {
  name: 'Participante Teste', role: 'Engenheiro', company: 'Empresa Exemplo', email: 'participante@example.com',
  phone: '+55 11 90000-0000', consentShare: true, newsletterOptIn: false,
};

export function memoryRepository(initial = []) {
  const records = [...initial];
  return {
    records,
    async add(record) { records.push(record); },
    async list() { return [...records]; },
    async clear() { records.length = 0; },
  };
}

export function memoryAccessStore(session = null, lockout = { failures: 0, lockedUntil: 0 }) {
  const state = { session, lockout };
  return {
    state,
    getSession: () => state.session,
    setSession: (s) => { state.session = s; },
    getLockout: () => state.lockout,
    setLockout: (l) => { state.lockout = l; },
  };
}

/** Builds an account the same way scripts/staff-account.mjs does, with few iterations for speed. */
export async function testAccount(label, email, password) {
  const salt = randomSalt();
  const iterations = 1000;
  return { label, email, salt, iterations, hash: await derivePasswordHash(password, salt, iterations) };
}

export function fixedClock(ms) {
  let now = ms;
  return { now: () => new Date(now), advance: (by) => { now += by; } };
}
