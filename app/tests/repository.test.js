import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createLocalStorageParticipantRepository } from '../src/infrastructure/local-storage-participant-repository.js';

function fakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => void data.set(k, String(v)),
    removeItem: (k) => void data.delete(k),
  };
}

test('add, list and clear', async () => {
  const repo = createLocalStorageParticipantRepository(fakeStorage());
  assert.deepEqual(await repo.list(), []);
  await repo.add({ id: '1' });
  await repo.add({ id: '2' });
  assert.deepEqual((await repo.list()).map((r) => r.id), ['1', '2']);
  await repo.clear();
  assert.deepEqual(await repo.list(), []);
});

test('data persists across repository instances (page reload)', async () => {
  const storage = fakeStorage();
  await createLocalStorageParticipantRepository(storage).add({ id: '1' });
  assert.equal((await createLocalStorageParticipantRepository(storage).list()).length, 1);
});

test('corrupt payload is quarantined, not silently destroyed', async () => {
  const storage = fakeStorage({ 'tw-platform-quiz:v1:participants': '{not json' });
  const repo = createLocalStorageParticipantRepository(storage);
  assert.deepEqual(await repo.list(), []);
  assert.ok([...storage.data.keys()].some((k) => k.includes(':corrupt:')));
  await repo.add({ id: '1' });
  assert.equal((await repo.list()).length, 1);
});
