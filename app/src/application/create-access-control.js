import { findAccount, lockRemainingMs, recordFailure, CLEARED_LOCKOUT } from '../domain/access-lock.js';

/**
 * Team login gate use cases. Opening the quiz needs one of the configured
 * accounts. Once unlocked, the session stays until someone signs out, so
 * participants play without interruption.
 *
 * @param {{
 *   accounts: ReadonlyArray<{label: string, email: string, salt: string, iterations: number, hash: string}>,
 *   verifyPassword: (password: string, account: object) => Promise<boolean>,
 *   store: import('./ports.js').AccessStore,
 *   clock: import('./ports.js').Clock,
 * }} deps
 */
export function createAccessControl({ accounts, verifyPassword, store, clock }) {
  const configured = (session) => Boolean(session && accounts.some((a) => a.label === session.label));

  return {
    isUnlocked() {
      return configured(store.getSession());
    },

    /** @returns {Promise<{ok: true} | {ok: false, reason: 'invalid' | 'locked', retryInSeconds?: number}>} */
    async login(email, password) {
      const now = clock.now().getTime();
      const lockout = store.getLockout();
      const remaining = lockRemainingMs(lockout, now);
      if (remaining > 0) return { ok: false, reason: 'locked', retryInSeconds: Math.ceil(remaining / 1000) };

      const account = findAccount(accounts, email);
      const matches = account ? await verifyPassword(String(password ?? ''), account) : false;
      if (matches) {
        store.setLockout(CLEARED_LOCKOUT);
        store.setSession({ label: account.label });
        return { ok: true };
      }

      const next = recordFailure(lockout, now);
      store.setLockout(next);
      if (lockRemainingMs(next, now) > 0) {
        return { ok: false, reason: 'locked', retryInSeconds: Math.ceil(lockRemainingMs(next, now) / 1000) };
      }
      return { ok: false, reason: 'invalid' };
    },

    lock() {
      store.setSession(null);
    },
  };
}
