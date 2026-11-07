const KEY = 'tw-platform-quiz:v1:leaderboard-import';

/**
 * Keeps the rows imported for the leaderboard in their own localStorage key, so the
 * participant records and the CSV export are untouched. A corrupt payload is moved
 * aside, not overwritten, like the participant repository.
 *
 * @param {Storage} storage
 * @returns {import('../application/ports.js').LeaderboardImport}
 */
export function createLocalLeaderboardImport(storage = globalThis.localStorage) {
  function read() {
    const raw = storage.getItem(KEY);
    if (raw === null) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fall through to quarantine
    }
    storage.setItem(`${KEY}:corrupt:${Date.now()}`, raw);
    storage.removeItem(KEY);
    return [];
  }

  return {
    async append(entries) {
      storage.setItem(KEY, JSON.stringify([...read(), ...entries]));
    },
    async list() {
      return read();
    },
    async clear() {
      storage.removeItem(KEY);
    },
  };
}
