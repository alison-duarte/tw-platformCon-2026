import assert from 'node:assert/strict';
import { test } from 'node:test';
import { en } from '../src/content/messages.en.js';
import { pt } from '../src/content/messages.pt.js';
import { QUESTIONS } from '../src/content/questions.js';

test('5 or 7 questions (7 = 5 basic plus 2 advanced, last) with four options each', () => {
  assert.ok([5, 7].includes(QUESTIONS.length), `got ${QUESTIONS.length}`);
  const advanced = QUESTIONS.filter((q) => q.difficulty === 'advanced').length;
  assert.ok(advanced === 0 || advanced === 2, `advanced: ${advanced}`);
  const firstAdvanced = QUESTIONS.findIndex((q) => q.difficulty === 'advanced');
  if (firstAdvanced >= 0) assert.equal(firstAdvanced, QUESTIONS.length - 2);
  for (const q of QUESTIONS) assert.ok(['basic', 'advanced'].includes(q.difficulty), `Q${q.id} difficulty`);
  for (const q of QUESTIONS) assert.equal(q.options.length, 4);
});

test('correct answers spread over A to D: at most twice per letter, no repeat in a row', () => {
  const letters = QUESTIONS.map((q) => 'ABCD'[q.correctIndex]);
  for (const letter of 'ABCD') assert.ok(letters.filter((l) => l === letter).length <= 2, `letter ${letter} used more than twice`);
  for (let i = 1; i < letters.length; i += 1) assert.notEqual(letters[i], letters[i - 1], `Q${i + 1} repeats ${letters[i]}`);
});

test('every question and option exists in both languages', () => {
  for (const q of QUESTIONS) {
    for (const lang of ['pt', 'en']) {
      for (const text of [q.category[lang], q.question[lang], q.explanation[lang], ...q.options.map((o) => o[lang])]) {
        assert.ok(typeof text === 'string' && text.length > 0, `Q${q.id} ${lang}`);
      }
    }
  }
});

test('PT and EN dictionaries have identical keys', () => {
  assert.deepEqual(Object.keys(pt).sort(), Object.keys(en).sort());
});

test('PT swag text matches the spec exactly', () => {
  assert.equal(pt.swagCallout, 'Ao finalizar o quiz, retire um brinde na mesa');
});

test('placeholders match between languages', () => {
  const tokens = (s) => (s.match(/\{\w+\}/g) ?? []).sort().join();
  for (const key of Object.keys(pt)) assert.equal(tokens(pt[key]), tokens(en[key]), key);
});
