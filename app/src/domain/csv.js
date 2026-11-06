/**
 * CSV export rules: UTF-8 with BOM (Excel accents), CRLF rows, every cell quoted,
 * and spreadsheet formula injection neutralized (OWASP CSV injection).
 * The phone column is exempt: registration validation restricts it to digits and
 * separators, so it cannot carry a formula or function call.
 */
const yesNo = (v) => (v ? 'Sim' : 'Não');

export const CSV_COLUMNS = Object.freeze([
  { header: 'Nome', value: (p) => p.name },
  { header: 'Empresa', value: (p) => p.company },
  { header: 'Cargo', value: (p) => p.role },
  { header: 'Email', value: (p) => p.email },
  { header: 'Telefone', value: (p) => p.phone, trusted: true },
  { header: 'Pontuacao', value: (p) => p.score },
  { header: 'Precisao', value: (p) => `${p.accuracyPct}%` },
  { header: 'Aceitou_Newsletter', value: (p) => yesNo(p.newsletterOptIn) },
  { header: 'Consentimento', value: (p) => yesNo(p.consentShare) },
  { header: 'Idioma', value: (p) => p.language },
  { header: 'Data_Hora', value: (p) => p.createdAt },
]);

export function sanitizeCell(value) {
  const text = String(value ?? '');
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
}

const quote = (text) => `"${text.replace(/"/g, '""')}"`;

export function toCsv(records) {
  const header = CSV_COLUMNS.map((c) => quote(c.header)).join(',');
  const rows = records.map((record) =>
    CSV_COLUMNS.map((c) => {
      const raw = String(c.value(record) ?? '');
      return quote(c.trusted ? raw : sanitizeCell(raw));
    }).join(','),
  );
  return '﻿' + [header, ...rows].join('\r\n');
}

export function csvFilename(now) {
  return `participantes_thoughtworks_${now.toISOString().slice(0, 10)}.csv`;
}
