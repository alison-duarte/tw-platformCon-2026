import { createAccessControl } from '../application/create-access-control.js';
import { createQuizApp } from '../application/create-quiz-app.js';
import { en } from '../content/messages.en.js';
import { pt } from '../content/messages.pt.js';
import { QUESTIONS } from '../content/questions.js';
import { STAFF_ACCOUNTS } from '../content/staff-accounts.js';
import { createConfettiEffect } from '../infrastructure/confetti-effect.js';
import { createFileDownloader } from '../infrastructure/file-downloader.js';
import { createLocalAccessStore } from '../infrastructure/local-access-store.js';
import { createLocalExportLog } from '../infrastructure/local-export-log.js';
import { createLocalLeaderboardImport } from '../infrastructure/local-leaderboard-import.js';
import { createLocalStorageParticipantRepository } from '../infrastructure/local-storage-participant-repository.js';
import { verifyPassword } from '../infrastructure/password-hash.js';
import { systemClock, uuidGenerator } from '../infrastructure/system.js';
import { createToneAudio } from '../infrastructure/tone-audio.js';
import { createI18n } from '../kernel/i18n.js';
import { screens } from './screens.js';

/** The only place that wires adapters to the application core. */
export function createContext() {
  const i18n = createI18n({ pt, en }, 'pt');
  const access = createAccessControl({
    accounts: STAFF_ACCOUNTS,
    verifyPassword,
    store: createLocalAccessStore(globalThis.localStorage),
    clock: systemClock,
  });
  const app = createQuizApp({
    questions: QUESTIONS,
    repository: createLocalStorageParticipantRepository(globalThis.localStorage),
    access,
    downloader: createFileDownloader(),
    exportLog: createLocalExportLog(globalThis.localStorage),
    leaderboardImport: createLocalLeaderboardImport(globalThis.localStorage),
    teamEmails: STAFF_ACCOUNTS.map((account) => account.email),
    clock: systemClock,
    ids: uuidGenerator,
    getLanguage: () => i18n.lang,
  });
  return { app, i18n, audio: createToneAudio(), effects: createConfettiEffect(), screens };
}
