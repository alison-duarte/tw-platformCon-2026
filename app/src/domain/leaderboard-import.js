/**
 * Reads a CSV exported by this app (or a sheet with the same columns) for the
 * leaderboard. Only Nome, Email, Pontuacao and Data_Hora are kept; the other
 * columns are read and dropped, so phone and company never reach the board.
 * Values are plain text. Nothing here is written back to the source file.
 */

export const REQUIRED_HEADERS = Object.freeze(['Nome', 'Email', 'Pontuacao', 'Data_Hora']);

/**
 * RFC 4180 style parser: quoted fields, doubled quotes, CRLF or LF rows, UTF-8 BOM.
 * @returns {string[][]}
 */
export function parseCsvText(text) {
  const source = String(text ?? '').replace(/^﻿/, '');
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"' && source[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\r' || ch === '\n') {
      if (ch === '\r' && source[i + 1] === '\n') i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ''));
}

/** Turns one data row into a leaderboard entry, or null when it is not usable. */
function toEntry(cells, index) {
  const name = (cells[index.Nome] ?? '').trim();
  const email = (cells[index.Email] ?? '').trim();
  const rawScore = (cells[index.Pontuacao] ?? '').trim();
  const createdAt = Date.parse((cells[index.Data_Hora] ?? '').trim());
  if (name === '' || !/^[^\s@]+@[^\s@]+$/.test(email) || !/^\d+$/.test(rawScore) || Number.isNaN(createdAt)) {
    return null;
  }
  return { name, email, score: Number(rawScore), createdAt: new Date(createdAt).toISOString() };
}

/**
 * @param {string} text file content
 * @returns {{ok: true, entries: Array<{name: string, email: string, score: number, createdAt: string}>, rejected: number}
 *   | {ok: false, reason: 'header' | 'empty'}}
 */
export function parseLeaderboardCsv(text) {
  const [headerRow, ...dataRows] = parseCsvText(text);
  if (!headerRow) return { ok: false, reason: 'empty' };
  const columns = headerRow.map((cell) => cell.trim());
  if (!REQUIRED_HEADERS.every((name) => columns.includes(name))) return { ok: false, reason: 'header' };

  const index = Object.fromEntries(REQUIRED_HEADERS.map((name) => [name, columns.indexOf(name)]));
  const entries = [];
  let rejected = 0;
  for (const cells of dataRows) {
    const entry = toEntry(cells, index);
    if (entry) entries.push(entry);
    else rejected += 1;
  }
  return { ok: true, entries, rejected };
}
