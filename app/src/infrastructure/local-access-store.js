import { CLEARED_LOCKOUT } from '../domain/access-lock.js';

export const SESSION_KEY = 'tw-platform-quiz:v1:session';
export const LOCKOUT_KEY = 'tw-platform-quiz:v1:access-lockout';

function readJson(storage, key, fallback) {
  const raw = storage.getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Where the unlocked session and the failed-attempt counter live: this device's
 * localStorage, so a page reload on the iPad does not ask for the login again.
 *
 * @param {Storage} storage
 * @returns {import('../application/ports.js').AccessStore}
 */
export function createLocalAccessStore(storage = globalThis.localStorage) {
  return {
    getSession() {
      return readJson(storage, SESSION_KEY, null);
    },
    setSession(session) {
      if (session) storage.setItem(SESSION_KEY, JSON.stringify(session));
      else storage.removeItem(SESSION_KEY);
    },
    getLockout() {
      return readJson(storage, LOCKOUT_KEY, CLEARED_LOCKOUT);
    },
    setLockout(state) {
      storage.setItem(LOCKOUT_KEY, JSON.stringify(state));
    },
  };
}
