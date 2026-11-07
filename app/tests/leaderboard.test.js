import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildLeaderboard, displayName, personKey } from '../src/domain/leaderboard.js';

const entry = (name, email, score, createdAt = '2026-01-01T10:00:00.000Z') => ({ name, email, score, createdAt });

test('display name is first and last word, with capitalization fixed', () => {
  assert.equal(displayName('nome exemplo sobrenome'), 'Nome Sobrenome');
  assert.equal(displayName('ANA  SILVA'), 'Ana Silva');
  assert.equal(displayName('Ana Maria da Silva'), 'Ana Silva');
  assert.equal(displayName('Ana-Maria Souza'), 'Ana-Maria Souza');
  assert.equal(displayName('anna'), 'Anna');
  assert.equal(displayName('   '), '');
});

test('rows carry only rank, display name and score (no e-mail, phone or company)', () => {
  const [row] = buildLeaderboard([entry('Ana Silva', 'participante@example.com', 900)]);
  assert.deepEqual(Object.keys(row).sort(), ['displayName', 'rank', 'score']);
});

test('ranks by score, highest first, starting at 1', () => {
  const board = buildLeaderboard([
    entry('Bia Lima', 'bia@example.com', 500),
    entry('Ana Silva', 'ana@example.com', 900),
    entry('Caio Reis', 'caio@example.com', 700),
  ]);
  assert.deepEqual(board.map((r) => [r.rank, r.displayName, r.score]), [
    [1, 'Ana Silva', 900],
    [2, 'Caio Reis', 700],
    [3, 'Bia Lima', 500],
  ]);
});

test('same first name, last name and e-mail is one person, kept with the highest score', () => {
  const board = buildLeaderboard([
    entry('Ana Silva', 'participante@example.com', 400),
    entry('ANA MARIA SILVA', 'Participante@Example.com ', 900),
    entry('Ana Silva', 'participante@example.com', 650),
  ]);
  assert.equal(board.length, 1);
  assert.equal(board[0].score, 900);
});

test('same name with a different e-mail is a different person', () => {
  const board = buildLeaderboard([
    entry('Ana Silva', 'um@example.com', 400),
    entry('Ana Silva', 'outro@example.com', 900),
  ]);
  assert.equal(board.length, 2);
});

test('same e-mail with a different last name is a different person', () => {
  const board = buildLeaderboard([
    entry('Ana Silva', 'compartilhado@example.com', 400),
    entry('Ana Souza', 'compartilhado@example.com', 900),
  ]);
  assert.equal(board.length, 2);
});

test('a tie on score keeps the earlier result above the later one', () => {
  const board = buildLeaderboard([
    entry('Bia Lima', 'bia@example.com', 800, '2026-01-01T12:00:00.000Z'),
    entry('Ana Silva', 'ana@example.com', 800, '2026-01-01T09:00:00.000Z'),
  ]);
  assert.deepEqual(board.map((r) => r.displayName), ['Ana Silva', 'Bia Lima']);
});

test('a duplicate tie keeps the earlier of the two results', () => {
  const board = buildLeaderboard([
    entry('Ana Silva', 'ana@example.com', 800, '2026-01-01T12:00:00.000Z'),
    entry('Ana Silva', 'ana@example.com', 800, '2026-01-01T09:00:00.000Z'),
  ]);
  assert.equal(board.length, 1);
});

test('team accounts and the team domain are left off the board', () => {
  const board = buildLeaderboard(
    [
      entry('Equipe Um', 'equipe1@example.com', 9000),
      entry('Colega Teste', 'colega@thoughtworks.com', 8000),
      entry('Participante Real', 'participante@example.com', 100),
    ],
    { teamEmails: ['equipe1@example.com'] },
  );
  assert.deepEqual(board.map((r) => r.displayName), ['Participante Real']);
});

test('entries without a usable name are skipped', () => {
  const board = buildLeaderboard([entry('   ', 'ana@example.com', 900)]);
  assert.deepEqual(board, []);
});

test('personKey is null when there is no name', () => {
  assert.equal(personKey('', 'ana@example.com'), null);
});

test('an empty input gives an empty board', () => {
  assert.deepEqual(buildLeaderboard([]), []);
});
