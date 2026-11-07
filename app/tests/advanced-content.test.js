import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { QUESTIONS } from '../src/content/questions.js';

// Every advanced question must have a source entry (deck slides, claims beyond the deck).
const here = dirname(fileURLToPath(import.meta.url));
const sourceMap = readFileSync(join(here, '..', '..', '.claude', 'aidlc-docs', 'inception', '07-advanced-content.md'), 'utf8');

test('every advanced question is listed in the source map with its answer letter', () => {
  for (const q of QUESTIONS.filter((item) => item.difficulty === 'advanced')) {
    const letter = 'ABCD'[q.correctIndex];
    assert.match(sourceMap, new RegExp(`\\| Q${q.id} \\|[^\\n]*\\| ${letter} \\|`), `Q${q.id} missing or letter differs in 07-advanced-content.md`);
  }
});
