import { accuracyPct, pointsFor, tierFor } from './scoring.js';

/**
 * Pure quiz state machine. Phases: answering -> feedback -> (answering | finished).
 * A question only needs `id` and `correctIndex`. `selectedIndex === null` means timeout.
 */
export function startSession(total) {
  return {
    index: 0,
    total,
    score: 0,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    answers: [],
    lastAnswer: null,
    phase: 'answering',
  };
}

export function answerQuestion(session, question, selectedIndex, secondsRemaining) {
  if (session.phase !== 'answering') return session;
  const correct = selectedIndex !== null && selectedIndex === question.correctIndex;
  const points = correct ? pointsFor({ secondsRemaining, streak: session.streak }) : 0;
  const streak = correct ? session.streak + 1 : 0;
  const answer = { questionId: question.id, selectedIndex, correct, points };
  return {
    ...session,
    score: session.score + points,
    streak,
    maxStreak: Math.max(session.maxStreak, streak),
    correctCount: session.correctCount + (correct ? 1 : 0),
    answers: [...session.answers, answer],
    lastAnswer: answer,
    phase: 'feedback',
  };
}

export function advance(session) {
  if (session.phase !== 'feedback') return session;
  const last = session.index + 1 >= session.total;
  return last
    ? { ...session, phase: 'finished' }
    : { ...session, index: session.index + 1, phase: 'answering', lastAnswer: null };
}

export function summarize(session) {
  return {
    score: session.score,
    correctCount: session.correctCount,
    total: session.total,
    accuracyPct: accuracyPct(session.correctCount, session.total),
    maxStreak: session.maxStreak,
    tier: tierFor(session.score),
  };
}
