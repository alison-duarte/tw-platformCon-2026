import assert from 'node:assert/strict';
import { test } from 'node:test';
import { advance, answerQuestion, startSession, summarize } from '../src/domain/quiz-session.js';

const Q = [{ id: 1, correctIndex: 2 }, { id: 2, correctIndex: 0 }, { id: 3, correctIndex: 3 }];

test('streak bonus uses the streak from before the answer', () => {
  let s = startSession(3);
  s = answerQuestion(s, Q[0], 2, 30);
  assert.equal(s.lastAnswer.points, 2500);
  s = advance(s);
  s = answerQuestion(s, Q[1], 0, 30);
  assert.equal(s.lastAnswer.points, 2500 + 150);
  assert.equal(s.streak, 2);
});

test('wrong answer and timeout score zero and reset the streak', () => {
  let s = answerQuestion(startSession(3), Q[0], 2, 20);
  s = advance(s);
  s = answerQuestion(s, Q[1], 1, 20);
  assert.equal(s.lastAnswer.points, 0);
  assert.equal(s.streak, 0);
  assert.equal(s.maxStreak, 1);
  s = advance(s);
  s = answerQuestion(s, Q[2], null, 0);
  assert.equal(s.lastAnswer.correct, false);
  assert.equal(s.lastAnswer.selectedIndex, null);
});

test('a question cannot be answered twice', () => {
  const once = answerQuestion(startSession(3), Q[0], 2, 30);
  assert.equal(answerQuestion(once, Q[0], 2, 25), once);
});

test('advance finishes after the last question and summarize reports it', () => {
  let s = startSession(1);
  s = answerQuestion(s, Q[0], 2, 30);
  s = advance(s);
  assert.equal(s.phase, 'finished');
  assert.deepEqual(summarize(s), { score: 2500, correctCount: 1, total: 1, accuracyPct: 100, maxStreak: 1, tier: 'explorer' });
});

test('advance is a no-op while answering', () => {
  const s = startSession(3);
  assert.equal(advance(s), s);
});
