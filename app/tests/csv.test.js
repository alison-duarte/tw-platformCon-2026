import assert from 'node:assert/strict';
import { test } from 'node:test';
import { csvFilename, sanitizeCell, toCsv } from '../src/domain/csv.js';

const base = {
  id: '1', name: 'Test Person', company: 'Example Co', role: 'Dev', email: 'a@example.com',
  phone: '+55 11 90000-0000', score: 4200, accuracyPct: 60, newsletterOptIn: true,
  consentShare: true, language: 'pt', createdAt: '2026-01-02T03:04:05.000Z',
};

test('starts with a UTF-8 BOM and uses CRLF rows', () => {
  const csv = toCsv([base]);
  assert.equal(csv.charCodeAt(0), 0xfeff);
  assert.equal(csv.split('\r\n').length, 2);
});

test('header and values follow the agreed column order', () => {
  const [header, row] = toCsv([base]).slice(1).split('\r\n');
  assert.equal(header, '"Nome","Empresa","Cargo","Email","Telefone","Pontuacao","Precisao","Aceitou_Newsletter","Consentimento","Idioma","Data_Hora"');
  assert.equal(row, '"Test Person","Example Co","Dev","a@example.com","+55 11 90000-0000","4200","60%","Sim","Sim","pt","2026-01-02T03:04:05.000Z"');
});

test('quotes, commas and accents survive', () => {
  const csv = toCsv([{ ...base, name: 'José "Zé", Jr.' }]);
  assert.ok(csv.includes('"José ""Zé"", Jr."'));
});

test('formula injection is neutralized in text cells', () => {
  for (const evil of ['=HYPERLINK("x")', '+1+1', '-2+3', '@SUM(A1)']) {
    assert.equal(sanitizeCell(evil), `'${evil}`);
  }
  const csv = toCsv([{ ...base, company: '=cmd|calc' }]);
  assert.ok(csv.includes(`"'=cmd|calc"`));
});

test('validated phone numbers keep their leading plus', () => {
  assert.ok(toCsv([base]).includes('"+55 11 90000-0000"'));
});

test('empty export is header only; filename carries the date', () => {
  assert.equal(toCsv([]).split('\r\n').length, 1);
  assert.equal(csvFilename(new Date('2026-03-04T10:00:00Z')), 'participantes_thoughtworks_2026-03-04.csv');
});
