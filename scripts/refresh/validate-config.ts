/**
 * Refresh-config integrity gate (Program: automated refresh). Proves the refresh
 * registry is truthful: every declared snapshot file exists, its ingest script exists,
 * its key field is actually present on the committed rows, and the field
 * classifications name real columns. Fails the build otherwise.
 *   npx tsx scripts/refresh/validate-config.ts   (npm run refresh:validate)
 */
import { existsSync } from "node:fs";
import { REFRESH_SNAPSHOTS, SNAPSHOT_BY_ID } from "./snapshots";
import { readSnapshotRows } from "./diff-snapshot";
import { VALUE_ANOMALY_REL_THRESHOLD } from "./anomaly-config";

const issues: string[] = [];
// Every per-snapshot anomaly threshold key must name a real snapshot (or "default").
for (const key of Object.keys(VALUE_ANOMALY_REL_THRESHOLD))
  if (key !== "default" && !SNAPSHOT_BY_ID.has(key)) issues.push(`anomaly-config: threshold key "${key}" is not a real snapshot id`);

for (const s of REFRESH_SNAPSHOTS) {
  if (!existsSync(s.file)) { issues.push(`${s.id}: snapshot file missing (${s.file})`); continue; }
  if (!existsSync(s.ingest)) issues.push(`${s.id}: ingest script missing (${s.ingest})`);
  let rows: Record<string, unknown>[];
  try { rows = readSnapshotRows(s.file); } catch (e) { issues.push(`${s.id}: cannot read rows — ${(e as Error).message}`); continue; }
  if (rows.length === 0) { issues.push(`${s.id}: snapshot is empty`); continue; }
  // Union of keys across ALL rows (a field absent/null on the first row must still count).
  const cols = new Set<string>();
  for (const r of rows) for (const k of Object.keys(r)) cols.add(k);
  if (!cols.has(s.keyField)) issues.push(`${s.id}: keyField "${s.keyField}" not present on rows`);
  const uniq = new Set(rows.map((r) => String(r[s.keyField])));
  if (uniq.size !== rows.length) issues.push(`${s.id}: keyField "${s.keyField}" is not unique (${uniq.size}/${rows.length})`);
  for (const f of [...s.idFields, ...s.classificationFields, ...s.statusFields, ...s.metadataFields])
    if (!cols.has(f)) issues.push(`${s.id}: declared field "${f}" not present on rows`);
}

if (issues.length) {
  console.error(`✗ ${issues.length} refresh-config issue(s):`);
  for (const i of issues) console.error(`  • ${i}`);
  process.exit(1);
}
console.log(`✓ Refresh config valid — ${REFRESH_SNAPSHOTS.length} snapshots (${REFRESH_SNAPSHOTS.map((s) => `${s.provider}/${s.cadence}`).join(", ")}); every file, ingest script, key field and classified column is real.`);
