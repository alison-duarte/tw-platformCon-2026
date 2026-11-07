import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAccessControl } from '../src/application/create-access-control.js';
import { createQuizApp } from '../src/application/create-quiz-app.js';
import { createLocalLeaderboardImport } from '../src/infrastructure/local-leaderboard-import.js';
import { verifyPassword } from '../src/infrastructure/password-hash.js';
import { QUESTIONS, fixedClock, memoryAccessStore, memoryRepository, testAccount } from './fakes.js';

const HEADER = 'Nome,Empresa,Cargo,Email,Telefone,Pontuacao,Precisao,Aceitou_Newsletter,Consentimento,Idioma,Data_Hora';

function fakeStorage() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => void data.set(k, String(v)),
    removeItem: (k) => void data.delete(k),
  };
}

async function build({ records = [], teamEmails = ['equipe1@example.com'] } = {}) {
  const account = await testAccount('Equipe 1', 'equipe1@example.com', 'senha-de-teste-123');
  const clock = fixedClock(Date.parse('2026-01-02T03:04:05Z'));
  const access = createAccessControl({ accounts: [account], verifyPassword, store: memoryAccessStore({ label: 'Equipe 1' }), clock });
  const repository = memoryRepository(records);
  const leaderboardImport = createLocalLeaderboardImport(fakeStorage());
  const app = createQuizApp({
    questions: QUESTIONS,
    repository,
    access,
    downloader: { download: () => {} },
    clock,
    ids: { next: () => 'id' },
    getLanguage: () => 'pt',
    leaderboardImport,
    teamEmails,
  });
  return { app, repository };
}

const record = (name, email, score, createdAt) => ({ id: name + score, name, email, score, createdAt, company: 'Empresa Exemplo', role: 'Dev', phone: '11999990000', accuracyPct: 86 });

test('the leaderboard merges this iPad with an imported CSV and keeps the highest score per person', async () => {
  const { app } = await build({
    records: [record('Ana Silva', 'participante@example.com', 400, '2026-11-07T10:00:00.000Z')],
  });
  const csv = [HEADER, 'Ana Silva,X,Y,participante@example.com,1,900,86%,Sim,Sim,pt,2026-11-07T11:00:00.000Z', 'Bia Lima,X,Y,bia@example.com,1,700,86%,Sim,Sim,pt,2026-11-07T11:00:00.000Z'].join('\r\n');
  const result = await app.importLeaderboardCsv(csv);
  assert.deepEqual(result, { ok: true, added: 2, rejected: 0 });
  assert.deepEqual(await app.leaderboard(), [
    { rank: 1, displayName: 'Ana Silva', score: 900 },
    { rank: 2, displayName: 'Bia Lima', score: 700 },
  ]);
});

test('team members are left off the leaderboard, including the team domain', async () => {
  const { app } = await build();
  const csv = [HEADER, 'Alison Duarte,X,Y,alison.duarte@thoughtworks.com,1,18550,100%,Sim,Sim,pt,2026-11-07T02:50:09.063Z', 'Bia Lima,X,Y,bia@example.com,1,700,86%,Sim,Sim,pt,2026-11-07T11:00:00.000Z'].join('\r\n');
  await app.importLeaderboardCsv(csv);
  assert.deepEqual((await app.leaderboard()).map((r) => r.displayName), ['Bia Lima']);
});

test('a file with the wrong columns is refused and changes nothing', async () => {
  const { app } = await build();
  assert.deepEqual(await app.importLeaderboardCsv('Nome,Email\r\nAna,participante@example.com'), { ok: false, reason: 'header' });
  assert.deepEqual(await app.leaderboard(), []);
});

test('importing from several files adds up, and re-importing the same file changes nothing', async () => {
  const { app } = await build();
  const one = [HEADER, 'Ana Silva,X,Y,participante@example.com,1,900,86%,Sim,Sim,pt,2026-11-07T11:00:00.000Z'].join('\r\n');
  const two = [HEADER, 'Bia Lima,X,Y,bia@example.com,1,700,86%,Sim,Sim,pt,2026-11-07T11:00:00.000Z'].join('\r\n');
  await app.importLeaderboardCsv(one);
  await app.importLeaderboardCsv(two);
  await app.importLeaderboardCsv(one);
  assert.equal((await app.leaderboard()).length, 2);
});

test('deleting all data also removes the imported rows, and the participant CSV source is untouched', async () => {
  const { app, repository } = await build({
    records: [record('Ana Silva', 'participante@example.com', 400, '2026-11-07T10:00:00.000Z')],
  });
  await app.importLeaderboardCsv([HEADER, 'Bia Lima,X,Y,bia@example.com,1,700,86%,Sim,Sim,pt,2026-11-07T11:00:00.000Z'].join('\r\n'));
  await app.clearParticipants();
  assert.deepEqual(await app.leaderboard(), []);
  assert.equal((await repository.list()).length, 0);
});

test('clearing the import leaves the participant records in place', async () => {
  const { app } = await build({
    records: [record('Ana Silva', 'participante@example.com', 400, '2026-11-07T10:00:00.000Z')],
  });
  await app.importLeaderboardCsv([HEADER, 'Bia Lima,X,Y,bia@example.com,1,700,86%,Sim,Sim,pt,2026-11-07T11:00:00.000Z'].join('\r\n'));
  await app.clearLeaderboardImport();
  assert.deepEqual(await app.leaderboard(), [{ rank: 1, displayName: 'Ana Silva', score: 400 }]);
});
