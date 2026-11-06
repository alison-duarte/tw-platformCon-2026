import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAccessControl } from '../src/application/create-access-control.js';
import { LOCK_MS, MAX_FAILED_ATTEMPTS, findAccount, lockRemainingMs, recordFailure } from '../src/domain/access-lock.js';
import { verifyPassword, derivePasswordHash, randomSalt } from '../src/infrastructure/password-hash.js';
import { createLocalAccessStore, SESSION_KEY, LOCKOUT_KEY } from '../src/infrastructure/local-access-store.js';
import { fixedClock, memoryAccessStore, testAccount } from './fakes.js';

const PASSWORD = 'senha-de-teste-123';

async function control({ accounts, session = null, lockout, clock = fixedClock(0) } = {}) {
  const list = accounts ?? [await testAccount('Equipe 1', 'equipe1@example.com', PASSWORD), await testAccount('Equipe 2', 'equipe2@example.com', 'outra-senha-456')];
  const store = memoryAccessStore(session, lockout);
  return { access: createAccessControl({ accounts: list, verifyPassword, store, clock }), store, clock };
}

test('password hashing: same password verifies, any other does not', async () => {
  const account = await testAccount('Equipe 1', 'e@example.com', PASSWORD);
  assert.equal(await verifyPassword(PASSWORD, account), true);
  assert.equal(await verifyPassword('senha-de-teste-124', account), false);
  assert.equal(await verifyPassword('', account), false);
});

test('the stored hash is not the password, and each salt gives a different hash', async () => {
  const a = await testAccount('Equipe 1', 'e@example.com', PASSWORD);
  const b = await testAccount('Equipe 1', 'e@example.com', PASSWORD);
  assert.notEqual(a.hash, PASSWORD);
  assert.notEqual(a.hash, b.hash);
  assert.equal(await derivePasswordHash(PASSWORD, a.salt, a.iterations), a.hash);
});

test('an account without salt or hash never verifies (fail closed)', async () => {
  assert.equal(await verifyPassword(PASSWORD, { label: 'x', email: 'x@example.com', salt: '', hash: '', iterations: 0 }), false);
});

test('a configured account unlocks; the email is case and space insensitive', async () => {
  const { access } = await control();
  assert.equal(access.isUnlocked(), false);
  assert.deepEqual(await access.login('  EQUIPE1@example.com ', PASSWORD), { ok: true });
  assert.equal(access.isUnlocked(), true);
});

test('an unknown email gets the same generic reason as a wrong password', async () => {
  const { access } = await control();
  assert.deepEqual(await access.login('ninguem@example.com', PASSWORD), { ok: false, reason: 'invalid' });
  assert.deepEqual(await access.login('equipe1@example.com', 'errada'), { ok: false, reason: 'invalid' });
});

test('with no accounts configured nobody can unlock the app', async () => {
  const { access } = await control({ accounts: [] });
  assert.deepEqual(await access.login('equipe1@example.com', PASSWORD), { ok: false, reason: 'invalid' });
  assert.equal(access.isUnlocked(), false);
});

test('five failed attempts lock the gate for 30 seconds', async () => {
  const clock = fixedClock(1_000_000);
  const { access } = await control({ clock });
  for (let i = 1; i < MAX_FAILED_ATTEMPTS; i += 1) {
    assert.deepEqual(await access.login('equipe1@example.com', 'errada'), { ok: false, reason: 'invalid' });
  }
  const fifth = await access.login('equipe1@example.com', 'errada');
  assert.equal(fifth.reason, 'locked');
  assert.equal(fifth.retryInSeconds, LOCK_MS / 1000);
  // Even the right password waits out the lock.
  assert.equal((await access.login('equipe1@example.com', PASSWORD)).reason, 'locked');
  clock.advance(LOCK_MS);
  assert.deepEqual(await access.login('equipe1@example.com', PASSWORD), { ok: true });
});

test('a successful login clears the failure count', async () => {
  const { access, store } = await control();
  await access.login('equipe1@example.com', 'errada');
  await access.login('equipe1@example.com', PASSWORD);
  assert.deepEqual(store.getLockout(), { failures: 0, lockedUntil: 0 });
});

test('lock() ends the session', async () => {
  const { access } = await control();
  await access.login('equipe1@example.com', PASSWORD);
  access.lock();
  assert.equal(access.isUnlocked(), false);
});

test('a session for an account that was removed from the config does not unlock', async () => {
  const { access } = await control({ session: { label: 'Equipe antiga' } });
  assert.equal(access.isUnlocked(), false);
});

test('pure lock rules', () => {
  const now = 10_000;
  assert.equal(lockRemainingMs({ failures: 0, lockedUntil: 0 }, now), 0);
  assert.equal(lockRemainingMs({ failures: 0, lockedUntil: 12_000 }, now), 2_000);
  assert.deepEqual(recordFailure({ failures: 1, lockedUntil: 0 }, now), { failures: 2, lockedUntil: 0 });
  assert.equal(recordFailure({ failures: MAX_FAILED_ATTEMPTS - 1, lockedUntil: 0 }, now).lockedUntil, now + LOCK_MS);
  const list = [{ email: 'A@x.com', label: 'one' }];
  assert.equal(findAccount(list, '  a@X.com '), list[0]);
  assert.equal(findAccount([{ email: 'A@x.com' }], ''), null);
});

test('the browser store keeps the session across reloads and tolerates corrupt data', () => {
  const data = new Map();
  const storage = { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => void data.set(k, String(v)), removeItem: (k) => void data.delete(k) };
  const first = createLocalAccessStore(storage);
  first.setSession({ label: 'Equipe 1' });
  assert.deepEqual(createLocalAccessStore(storage).getSession(), { label: 'Equipe 1' });
  first.setSession(null);
  assert.equal(data.has(SESSION_KEY), false);

  data.set(SESSION_KEY, '{oops');
  data.set(LOCKOUT_KEY, '[]not-an-object');
  assert.equal(createLocalAccessStore(storage).getSession(), null);
  assert.deepEqual(createLocalAccessStore(storage).getLockout(), { failures: 0, lockedUntil: 0 });
});

test('salt helper produces 16 random bytes in base64', () => {
  assert.equal(Buffer.from(randomSalt(), 'base64').length, 16);
});
