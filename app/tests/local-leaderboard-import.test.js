import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createLocalLeaderboardImport } from '../src/infrastructure/local-leaderboard-import.js';

const KEY = 'tw-platform-quiz:v1:leaderboard-import';

function fakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => void data.set(k, String(v)),
    removeItem: (k) => void data.delete(k),
  };
}

const row = (name) => ({ name, email: 'participante@example.com', score: 100, createdAt: '2026-11-07T11:00:00.000Z' });

test('append, list and clear use their own storage key', async () => {
  const storage = fakeStorage();
  const imports = createLocalLeaderboardImport(storage);
  await imports.append([row('Ana Exemplo')]);
  await imports.append([row('Bia Exemplo')]);
  assert.deepEqual((await imports.list()).map((r) => r.name), ['Ana Exemplo', 'Bia Exemplo']);
  assert.ok(storage.data.has(KEY));
  assert.ok(!storage.data.has('tw-platform-quiz:v1:participants'));
  await imports.clear();
  assert.deepEqual(await imports.list(), []);
});

test('a corrupt import is moved aside, not overwritten', async () => {
  const storage = fakeStorage({ [KEY]: '{not json' });
  const imports = createLocalLeaderboardImport(storage);
  assert.deepEqual(await imports.list(), []);
  const quarantined = [...storage.data.entries()].filter(([k]) => k.startsWith(`${KEY}:corrupt:`));
  assert.deepEqual(quarantined.map(([, v]) => v), ['{not json']);
  assert.ok(!storage.data.has(KEY));
});
