export const QUESTION_TIME_SECONDS = 30;
export const BASE_POINTS = 1000;
export const TIME_BONUS_PER_SECOND = 50;
export const STREAK_BONUS = 150;

export const TIER_THRESHOLDS = Object.freeze({ visionary: 11200, hero: 6300 });

/** Points for a correct answer. `streak` is the streak before this answer. */
export function pointsFor({ secondsRemaining, streak }) {
  const seconds = Math.min(QUESTION_TIME_SECONDS, Math.max(0, Math.floor(secondsRemaining)));
  return BASE_POINTS + seconds * TIME_BONUS_PER_SECOND + streak * STREAK_BONUS;
}

export function tierFor(score) {
  if (score >= TIER_THRESHOLDS.visionary) return 'visionary';
  if (score >= TIER_THRESHOLDS.hero) return 'hero';
  return 'explorer';
}

export function accuracyPct(correctCount, total) {
  return total === 0 ? 0 : Math.round((correctCount / total) * 100);
}
