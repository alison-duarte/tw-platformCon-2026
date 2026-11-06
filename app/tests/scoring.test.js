import assert from 'node:assert/strict';
import { test } from 'node:test';
import { accuracyPct, pointsFor, tierFor } from '../src/domain/scoring.js';

test('points: base + time bonus + streak bonus', () => {
  assert.equal(pointsFor({ secondsRemaining: 30, streak: 0 }), 1000 + 30 * 50);
  assert.equal(pointsFor({ secondsRemaining: 10, streak: 2 }), 1000 + 10 * 50 + 2 * 150);
});

test('points: seconds are clamped to 0..30', () => {
  assert.equal(pointsFor({ secondsRemaining: -4, streak: 0 }), 1000);
  assert.equal(pointsFor({ secondsRemaining: 99, streak: 0 }), 1000 + 30 * 50);
});

test('tiers switch at 6300 and 11200 (7-question scale)', () => {
  assert.equal(tierFor(6299), 'explorer');
  assert.equal(tierFor(6300), 'hero');
  assert.equal(tierFor(11199), 'hero');
  assert.equal(tierFor(11200), 'visionary');
});

test('accuracy rounds and handles empty totals', () => {
  assert.equal(accuracyPct(3, 5), 60);
  assert.equal(accuracyPct(1, 3), 33);
  assert.equal(accuracyPct(0, 0), 0);
});
