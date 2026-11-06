import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAccessControl } from '../src/application/create-access-control.js';
import { createQuizApp } from '../src/application/create-quiz-app.js';
import { verifyPassword } from '../src/infrastructure/password-hash.js';
import { QUESTIONS, fixedClock, memoryAccessStore, memoryRepository, registration, testAccount } from './fakes.js';

const PASSWORD = 'senha-de-teste-123';

async function build({ repository = memoryRepository(), failSave = false, unlocked = true, accounts = null } = {}) {
  const account = await testAccount('Equipe 1', 'equipe1@example.com', PASSWORD);
  const store = memoryAccessStore(unlocked ? { label: 'Equipe 1' } : null);
  const clock = fixedClock(Date.parse('2026-01-02T03:04:05Z'));
  const access = createAccessControl({ accounts: accounts ?? [account], verifyPassword, store, clock });
  const downloads = [];
  let counter = 0;
  const failingRepository = {
    ...repository,
    add: async (r) => {
      if (failSave) throw new Error('quota');
      return repository.add(r);
    },
  };
  const app = createQuizApp({
    questions: QUESTIONS,
    repository: failingRepository,
    access,
    downloader: { download: (f) => downloads.push(f) },
    clock,
    ids: { next: () => `id-${++counter}` },
    getLanguage: () => 'en',
  });
  return { app, repository, downloads, store, clock };
}

async function playAll(app, pick = (q) => q.correctIndex) {
  app.register(registration);
  for (const q of QUESTIONS) {
    app.answer(pick(q), 30);
    await app.next();
  }
}

test('without an unlocked session the first view is the login gate', async () => {
  const { app } = await build({ unlocked: false });
  assert.equal(app.getState().view, 'login');
  assert.equal(app.isUnlocked(), false);
});

test('a valid login opens the quiz registration view', async () => {
  const { app } = await build({ unlocked: false });
  assert.deepEqual(await app.login('equipe1@example.com', PASSWORD), { ok: true });
  assert.equal(app.getState().view, 'registration');
});

test('a wrong password keeps the gate closed with the generic reason', async () => {
  const { app } = await build({ unlocked: false });
  assert.deepEqual(await app.login('equipe1@example.com', 'errada'), { ok: false, reason: 'invalid' });
  assert.equal(app.getState().view, 'login');
});

test('after a login, playing never asks for the login again, run after run', async () => {
  const { app, repository } = await build({ unlocked: false });
  await app.login('equipe1@example.com', PASSWORD);
  await playAll(app);
  assert.equal(app.getState().view, 'results');
  app.restart();
  assert.equal(app.getState().view, 'registration');
  assert.equal(app.isUnlocked(), true);
  await playAll(app);
  assert.equal((await repository.list()).length, 2);
});

test('lock (staff sign out) returns to the gate and drops the run in progress', async () => {
  const { app } = await build();
  app.register(registration);
  app.lock();
  assert.equal(app.getState().view, 'login');
  assert.equal(app.getState().registration, null);
  assert.equal(app.isUnlocked(), false);
});

test('registration blocks the quiz until the form is valid', async () => {
  const { app } = await build();
  assert.equal(app.register({ ...registration, consentShare: false }).ok, false);
  assert.equal(app.getState().view, 'registration');
  assert.equal(app.register(registration).ok, true);
  assert.equal(app.getState().view, 'question');
});

test('full run saves one record and shows results', async () => {
  const { app, repository } = await build();
  app.register(registration);
  await playAll(app);
  const { view, result } = app.getState();
  assert.equal(view, 'results');
  assert.equal(result.accuracyPct, 100);
  assert.equal(result.saved, true);
  const saved = await repository.list();
  assert.equal(saved.length, 1);
  assert.equal(saved[0].language, 'en');
  assert.equal(saved[0].score, result.score);
});

test('the answer window is 30 seconds', async () => {
  assert.equal((await build()).app.questionTimeSeconds, 30);
});

test('a timeout counts as incorrect', async () => {
  const { app } = await build();
  app.register(registration);
  app.timeout();
  assert.equal(app.getState().view, 'feedback');
  assert.equal(app.getState().session.lastAnswer.selectedIndex, null);
});

test('storage failure is reported, not hidden', async () => {
  const { app } = await build({ failSave: true });
  app.register(registration);
  await playAll(app);
  assert.equal(app.getState().result.saved, false);
});

test('CSV export downloads stored participants; empty store downloads nothing', async () => {
  const { app, downloads } = await build();
  assert.deepEqual(await app.exportCsv(), { ok: false, count: 0 });
  assert.equal(downloads.length, 0);
  app.register(registration);
  await playAll(app);
  assert.deepEqual(await app.exportCsv(), { ok: true, count: 1 });
  assert.match(downloads[0].filename, /^participantes_thoughtworks_2026-01-02\.csv$/);
  assert.equal(downloads[0].content.charCodeAt(0), 0xfeff);
  assert.match(downloads[0].content, /participante@example\.com/);
});

test('CSV export is built from the local store, row for row', async () => {
  const { app, repository, downloads } = await build();
  await repository.add({ id: 'a', name: 'Ana', company: 'C', role: 'R', email: 'a@example.com', phone: '+55 11 90000-0000', score: 1000, accuracyPct: 20, newsletterOptIn: true, consentShare: true, language: 'pt', createdAt: '2026-01-01T00:00:00.000Z' });
  await repository.add({ id: 'b', name: 'Bruno', company: 'C', role: 'R', email: 'b@example.com', phone: '+55 11 90000-0001', score: 2000, accuracyPct: 40, newsletterOptIn: false, consentShare: true, language: 'en', createdAt: '2026-01-01T01:00:00.000Z' });
  assert.deepEqual(await app.exportCsv(), { ok: true, count: 2 });
  assert.equal(downloads[0].content.split('\r\n').length, 3);
});

test('clearing the local data empties the store', async () => {
  const { app, repository } = await build();
  await repository.add({ id: 'x' });
  await app.clearParticipants();
  assert.equal((await app.listParticipants()).length, 0);
});

test('the answer window is 30 seconds (single source of truth)', async () => {
  const { app } = await build();
  assert.equal(app.questionTimeSeconds, 30);
});

test('delete warning: runs saved after the last CSV export are flagged', async () => {
  const exportLog = { value: null, get() { return this.value; }, set(iso) { this.value = iso; } };
  const repository = memoryRepository();
  const clock = fixedClock(Date.parse('2026-01-02T03:04:05Z'));
  const access = createAccessControl({ accounts: [await testAccount('Equipe 1', 'equipe1@example.com', PASSWORD)], verifyPassword, store: memoryAccessStore({ label: 'Equipe 1' }), clock });
  let counter = 0;
  const app = createQuizApp({ questions: QUESTIONS, repository, access, downloader: { download() {} }, clock, ids: { next: () => `id-${++counter}` }, getLanguage: () => 'pt', exportLog });

  assert.equal(await app.hasUnexportedParticipants(), false, 'nothing saved yet');
  await playAll(app);
  assert.equal(await app.hasUnexportedParticipants(), true, 'a run that was never exported');
  await app.exportCsv();
  assert.equal(await app.hasUnexportedParticipants(), false, 'exported, no warning');
  clock.advance(60_000);
  await playAll(app);
  assert.equal(await app.hasUnexportedParticipants(), true, 'a new run after the export');
});
