/**
 * Pure rules for the team login gate. This slows down casual guessing on the
 * iPad. It is not a security boundary: the app is public, so the gate is UI only.
 */
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCK_MS = 30000;

export const CLEARED_LOCKOUT = Object.freeze({ failures: 0, lockedUntil: 0 });

/** Milliseconds left before another attempt is allowed (0 when allowed). */
export function lockRemainingMs(state, now) {
  return Math.max(0, (state.lockedUntil ?? 0) - now);
}

/** Lockout state after one more failed attempt at time `now`. */
export function recordFailure(state, now) {
  const failures = (state.failures ?? 0) + 1;
  if (failures >= MAX_FAILED_ATTEMPTS) return { failures: 0, lockedUntil: now + LOCK_MS };
  return { failures, lockedUntil: 0 };
}

export function normalizeEmail(raw) {
  return String(raw ?? '').trim().toLowerCase();
}

/** @returns {object | null} the configured account for this email, if any */
export function findAccount(accounts, email) {
  const wanted = normalizeEmail(email);
  if (wanted === '') return null;
  return accounts.find((account) => normalizeEmail(account.email) === wanted) ?? null;
}
