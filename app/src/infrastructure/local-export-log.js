export const EXPORT_LOG_KEY = 'tw-platform-quiz:v1:last-export';

/**
 * Remembers when the CSV was last exported on this iPad, so the staff panel can
 * warn before deleting data nobody has exported.
 *
 * @param {Storage} storage
 * @returns {import('../application/ports.js').ExportLog}
 */
export function createLocalExportLog(storage = globalThis.localStorage) {
  return {
    get: () => storage.getItem(EXPORT_LOG_KEY),
    set: (iso) => storage.setItem(EXPORT_LOG_KEY, iso),
  };
}
