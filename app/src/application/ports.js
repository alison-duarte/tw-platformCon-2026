/**
 * Ports: the contracts the application layer needs from the outside world.
 * Adapters in src/infrastructure implement them. Types only, no runtime code.
 *
 * @typedef {object} ParticipantRepository   Local storage of finished runs (this iPad only).
 * @property {(record: object) => Promise<void>} add
 * @property {() => Promise<object[]>} list
 * @property {() => Promise<void>} clear
 *
 * @typedef {object} LeaderboardImport      Rows imported from CSV for the staff leaderboard (this iPad only).
 * @property {(entries: object[]) => Promise<void>} append
 * @property {() => Promise<object[]>} list
 * @property {() => Promise<void>} clear
 *
 * @typedef {object} FileDownloader
 * @property {(file: {filename: string, content: string, mime: string}) => void} download
 *
 * @typedef {object} Clock
 * @property {() => Date} now
 *
 * @typedef {object} IdGenerator
 * @property {() => string} next
 *
 * @typedef {object} ExportLog               Time of the last CSV export on this iPad (ISO 8601 or null).
 * @property {() => string | null} get
 * @property {(iso: string) => void} set
 *
 * @typedef {object} AccessStore             Session and failed-attempt counter, kept on this device.
 * @property {() => ({label: string} | null)} getSession
 * @property {(session: {label: string} | null) => void} setSession
 * @property {() => {failures: number, lockedUntil: number}} getLockout
 * @property {(state: {failures: number, lockedUntil: number}) => void} setLockout
 */
export {};
