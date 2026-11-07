import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseCsvText, parseLeaderboardCsv } from '../src/domain/leaderboard-import.js';

const HEADER = '"Nome","Empresa","Cargo","Email","Telefone","Pontuacao","Precisao","Aceitou_Newsletter","Consentimento","Idioma","Data_Hora"';

test('parses quoted fields, doubled quotes, CRLF and the BOM', () => {
  const rows = parseCsvText('﻿"a","b ""x"" c"\r\n"d",e\r\n');
  assert.deepEqual(rows, [['a', 'b "x" c'], ['d', 'e']]);
});

test('blank lines are ignored', () => {
  assert.deepEqual(parseCsvText('a,b\n\n\nc,d\n'), [['a', 'b'], ['c', 'd']]);
});

test('reads the export columns and drops phone and company', () => {
  const text = [HEADER, '"Ana Exemplo","Empresa Exemplo","Engenheira","participante@example.com","11999990000","12150","86%","Sim","Sim","pt","2026-11-07T11:24:58.328Z"'].join('\r\n');
  const result = parseLeaderboardCsv(text);
  assert.equal(result.ok, true);
  assert.equal(result.rejected, 0);
  assert.deepEqual(result.entries, [
    { name: 'Ana Exemplo', email: 'participante@example.com', score: 12150, createdAt: '2026-11-07T11:24:58.328Z' },
  ]);
  assert.deepEqual(Object.keys(result.entries[0]).sort(), ['createdAt', 'email', 'name', 'score']);
});

test('a file without the required columns is refused', () => {
  const result = parseLeaderboardCsv('"Nome","Email"\r\n"Ana","participante@example.com"');
  assert.deepEqual(result, { ok: false, reason: 'header' });
});

test('an empty file is refused as empty', () => {
  assert.deepEqual(parseLeaderboardCsv('﻿'), { ok: false, reason: 'empty' });
});

test('rows that cannot be used are counted as rejected, not imported', () => {
  const text = [
    HEADER,
    '"","","","participante@example.com","","100","","Sim","Sim","pt","2026-11-07T11:00:00.000Z"',
    '"Ana Exemplo","","","sem-arroba","","100","","Sim","Sim","pt","2026-11-07T11:00:00.000Z"',
    '"Ana Exemplo","","","participante@example.com","","12.5","","Sim","Sim","pt","2026-11-07T11:00:00.000Z"',
    '"Ana Exemplo","","","participante@example.com","","100","","Sim","Sim","pt","data-invalida"',
    '"Ana Exemplo","","","participante@example.com","","100","","Sim","Sim","pt","2026-11-07T11:00:00.000Z"',
  ].join('\r\n');
  const result = parseLeaderboardCsv(text);
  assert.equal(result.entries.length, 1);
  assert.equal(result.rejected, 4);
});

test('a formula in a cell is kept as plain text and never executed', () => {
  const text = [HEADER, '"=HYPERLINK(""x"")","","","participante@example.com","","100","","Sim","Sim","pt","2026-11-07T11:00:00.000Z"'].join('\r\n');
  const result = parseLeaderboardCsv(text);
  assert.equal(result.entries[0].name, '=HYPERLINK("x")');
});

test('header matching ignores spaces around column names', () => {
  const text = ' Nome , Email , Pontuacao , Data_Hora \r\nAna Exemplo,participante@example.com,100,2026-11-07T11:00:00.000Z';
  assert.equal(parseLeaderboardCsv(text).entries.length, 1);
});
