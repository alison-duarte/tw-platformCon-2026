const KEY = 'tw-platform-quiz:v1:participants';

/**
 * Persists participants as one JSON array in localStorage (this iPad only).
 * A corrupt payload is moved aside, not overwritten, so staff can recover it.
 *
 * @param {Storage} storage
 * @returns {import('../application/ports.js').ParticipantRepository}
 */
export function createLocalStorageParticipantRepository(storage = globalThis.localStorage) {
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
    async add(record) {
      storage.setItem(KEY, JSON.stringify([...read(), record]));
    },
    async list() {
      return read();
    },
    async clear() {
      storage.removeItem(KEY);
    },
  };
}
