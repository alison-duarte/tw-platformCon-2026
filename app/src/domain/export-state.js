/**
 * Whether any participant was saved after the last CSV export. Used to warn
 * before "delete all". Timestamps are ISO 8601, so string comparison is ordered.
 * A record created at the same instant as the export counts as exported.
 *
 * @param {Array<{createdAt: string}>} records
 * @param {string | null} lastExportIso
 */
export function hasUnexportedRecords(records, lastExportIso) {
  if (records.length === 0) return false;
  if (!lastExportIso) return true;
  return records.some((record) => record.createdAt > lastExportIso);
}
