/**
 * Staff leaderboard rules (pure, no DOM, no packages).
 *
 * Input entries come from two places: this iPad's participant records and
 * imported CSV rows. Both are reduced to { name, email, score, createdAt }.
 * Output carries only { rank, displayName, score }: no e-mail, phone or company.
 */

/** Team members are excluded by account e-mail and by this company domain. */
export const TEAM_DOMAIN = 'thoughtworks.com';

/** Lower-case, accent-free, single-spaced text. Used for matching, never for display. */
export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/** First and last word of a full name, or null when there is no word. */
export function nameParts(fullName) {
  const words = String(fullName ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  return { first: words[0], last: words[words.length - 1] };
}

/** Capitalizes each word and each part after a hyphen or apostrophe. */
export function titleCase(word) {
  return word.toLowerCase().replace(/(^|[-'])(\p{L})/gu, (_, sep, letter) => sep + letter.toUpperCase());
}

/** "guilkherme felipe santos" -> "Guilkherme Santos". One-word names stay one word. */
export function displayName(fullName) {
  const parts = nameParts(fullName);
  if (!parts) return '';
  const first = titleCase(parts.first);
  const last = titleCase(parts.last);
  return first === last ? first : `${first} ${last}`;
}

export function isTeamEmail(email, teamEmails = []) {
  const normalized = normalizeText(email);
  if (normalized.endsWith(`@${TEAM_DOMAIN}`)) return true;
  return teamEmails.some((team) => normalizeText(team) === normalized);
}

/** Same person: same first name, same last name and same e-mail (normalized). */
export function personKey(name, email) {
  const parts = nameParts(name);
  if (!parts) return null;
  return `${normalizeText(parts.first)} ${normalizeText(parts.last)}|${normalizeText(email)}`;
}

const time = (entry) => Date.parse(entry.createdAt);

/** Higher score wins. On a tie, the earlier result wins. */
function isBetter(candidate, current) {
  if (candidate.score !== current.score) return candidate.score > current.score;
  return time(candidate) < time(current);
}

/**
 * Merges entries into one row per person, drops the team, and ranks the rest.
 *
 * @param {Array<{name: string, email: string, score: number, createdAt: string}>} entries
 * @param {{teamEmails?: string[]}} [options]
 * @returns {Array<{rank: number, displayName: string, score: number}>}
 */
export function buildLeaderboard(entries, { teamEmails = [] } = {}) {
  const best = new Map();
  for (const entry of entries) {
    if (isTeamEmail(entry.email, teamEmails)) continue;
    const key = personKey(entry.name, entry.email);
    if (key === null) continue;
    const current = best.get(key);
    if (!current || isBetter(entry, current)) best.set(key, entry);
  }
  return [...best.values()]
    .sort((a, b) => b.score - a.score || time(a) - time(b))
    .map((entry, index) => ({ rank: index + 1, displayName: displayName(entry.name), score: entry.score }));
}
