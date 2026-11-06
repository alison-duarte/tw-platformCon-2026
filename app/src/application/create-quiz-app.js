import { toCsv, csvFilename } from '../domain/csv.js';
import { createParticipantRecord, validateRegistration } from '../domain/participant.js';
import { hasUnexportedRecords } from '../domain/export-state.js';
import { advance, answerQuestion, startSession, summarize } from '../domain/quiz-session.js';
import { QUESTION_TIME_SECONDS } from '../domain/scoring.js';
import { createStore } from '../kernel/store.js';

/**
 * Application facade (use cases). Features talk to this and nothing else.
 * Views: login -> registration -> question <-> feedback -> results -> registration.
 * The login view is the first screen whenever there is no unlocked team session.
 *
 * @param {{
 *   questions: ReadonlyArray<{id:number, correctIndex:number}>,
 *   repository: import('./ports.js').ParticipantRepository,
 *   access: ReturnType<typeof import('./create-access-control.js').createAccessControl>,
 *   downloader: import('./ports.js').FileDownloader,
 *   clock: import('./ports.js').Clock,
 *   ids: import('./ports.js').IdGenerator,
 *   getLanguage: () => string,
 * }} deps
 */
export function createQuizApp({
  questions,
  repository,
  access,
  downloader,
  clock,
  ids,
  getLanguage,
  exportLog = { get: () => null, set: () => {} },
}) {
  const store = createStore(idleState(access.isUnlocked() ? 'registration' : 'login'));

  function idleState(view) {
    return { view, registration: null, session: null, result: null };
  }

  async function login(email, password) {
    const outcome = await access.login(email, password);
    if (outcome.ok) store.set(idleState('registration'));
    return outcome;
  }

  /** Signs the team out and returns to the login view. Used by the staff panel. */
  function lock() {
    access.lock();
    store.set(idleState('login'));
  }

  function register(input) {
    const check = validateRegistration(input);
    if (!check.valid) return { ok: false, errors: check.errors };
    store.set({
      view: 'question',
      registration: check.value,
      session: startSession(questions.length),
      result: null,
    });
    return { ok: true };
  }

  function answer(selectedIndex, secondsRemaining) {
    const { session } = store.get();
    if (!session || session.phase !== 'answering') return;
    const question = questions[session.index];
    store.set({
      view: 'feedback',
      session: answerQuestion(session, question, selectedIndex, secondsRemaining),
    });
  }

  const timeout = () => answer(null, 0);

  async function next() {
    const { session } = store.get();
    if (!session || session.phase !== 'feedback') return;
    const advanced = advance(session);
    if (advanced.phase !== 'finished') {
      store.set({ view: 'question', session: advanced });
      return;
    }
    const summary = summarize(advanced);
    store.set({ view: 'results', session: advanced, result: { ...summary, saved: null } });
    const record = createParticipantRecord({
      id: ids.next(),
      registration: store.get().registration,
      summary,
      language: getLanguage(),
      now: clock.now(),
    });
    let saved = true;
    try {
      await repository.add(record);
    } catch {
      saved = false;
    }
    if (store.get().result) store.set({ result: { ...store.get().result, saved } });
  }

  function restart() {
    store.set(idleState('registration'));
  }

  const listParticipants = () => repository.list();

  async function exportCsv() {
    const records = await repository.list();
    if (records.length === 0) return { ok: false, count: 0 };
    downloader.download({
      filename: csvFilename(clock.now()),
      content: toCsv(records),
      mime: 'text/csv;charset=utf-8',
    });
    exportLog.set(clock.now().toISOString());
    return { ok: true, count: records.length };
  }

  /** True when some saved participant was never part of a CSV export. */
  async function hasUnexportedParticipants() {
    return hasUnexportedRecords(await repository.list(), exportLog.get());
  }

  const clearParticipants = () => repository.clear();

  return {
    questions,
    questionTimeSeconds: QUESTION_TIME_SECONDS,
    getState: store.get,
    subscribe: store.subscribe,
    isUnlocked: () => access.isUnlocked(),
    login,
    lock,
    register,
    answer,
    timeout,
    next,
    restart,
    listParticipants,
    exportCsv,
    hasUnexportedParticipants,
    clearParticipants,
  };
}
