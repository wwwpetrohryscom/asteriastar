/**
 * Refresh test harness (Program: automated refresh). Runnable with `npm run refresh:test`.
 * There is no test framework in the repo, so this is a self-contained assertion runner
 * that exits non-zero on any failure. It covers the two things that matter most: the
 * diff classification is truthful, and a failing/empty refresh NEVER changes committed
 * data (the transient-failure → data-loss / no-match defect must be impossible).
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync, mkdtempSync } from "node:fs";
import { createHash as hash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { RefreshSnapshot } from "./snapshots";
import { REFRESH_SNAPSHOTS } from "./snapshots";
import { diffSnapshots } from "./diff-snapshot";

let failures = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) console.log(`  ✓ ${name}`);
  else { console.error(`  ✗ ${name} ${detail}`); failures++; }
}
const sha = (f: string) => hash("sha256").update(readFileSync(f)).digest("hex");

// A synthetic snapshot config for diff-engine unit tests.
const SNAP: RefreshSnapshot = {
  id: "test", provider: "test", domain: "test", cadence: "monthly",
  file: "x", constName: "X", keyField: "id", ingest: "x",
  idFields: ["id", "spkid"], classificationFields: ["neo", "pha"], statusFields: ["status"],
  metadataFields: ["bibcode", "producer"], uncertaintyMarkers: ["sigma"],
};

console.log("DIFF ENGINE — classification");
{
  const oldR = [
    { id: "a", value: 100, sigma: 5, neo: false, status: "active", bibcode: "2020A", spkid: "1" },
    { id: "b", value: 50, neo: false, spkid: "2" },
    { id: "c", value: 10, spkid: "3" },
  ];
  const newR = [
    { id: "a", value: 100.1, sigma: 4, neo: true, status: "retired", bibcode: "2021B", spkid: "1" }, // multi-class → identifier? no; neo=classification, status=status, spkid same
    { id: "b", value: 500, neo: false, spkid: "2" }, // 10x value → anomaly
    // c removed
    { id: "d", value: 7, spkid: "4" }, // added
  ];
  const d = diffSnapshots(SNAP, oldR, newR);
  const rowA = d.changed.find((c) => c.key === "a")!;
  const clsA = new Set(rowA.fields.map((f) => f.field + ":" + f.class));
  check("value 100→100.1 is precision_improvement", clsA.has("value:precision_improvement"));
  check("sigma change is uncertainty_update", clsA.has("sigma:uncertainty_update"));
  check("neo flip is classification_change", clsA.has("neo:classification_change"));
  check("status change is status_change", clsA.has("status:status_change"));
  check("bibcode change is source_metadata_only", clsA.has("bibcode:source_metadata_only"));
  check("b value 50→500 is anomaly", d.changed.find((c) => c.key === "b")!.fields.some((f) => f.class === "anomaly"));
  check("c is source_removed", d.changed.find((c) => c.key === "c")?.class === "source_removed");
  check("d is added", d.changed.find((c) => c.key === "d")?.class === "added");
  check("requiresReview (has anomaly/status/classification/removed)", d.requiresReview === true);
}

console.log("DIFF ENGINE — nested measurement objects ({value,sigma,unit}) are compared numerically");
{
  const nestedSnap = { ...SNAP, id: "sbdb-small-bodies", classificationFields: ["neo"], metadataFields: [] };
  const oldR = [{ id: "x", a: { value: 3.16, sigma: 1e-8, unit: "au" } }];
  const newR = [{ id: "x", a: { value: 25.3, sigma: 1e-8, unit: "au" } }]; // 8× semi-major axis → anomaly
  const d = diffSnapshots(nestedSnap, oldR, newR);
  check("nested a.value 8× jump is an anomaly", d.changed[0].fields[0].class === "anomaly", d.changed[0].fields[0].class);
  check("nested anomaly forces review", d.requiresReview === true);
}

console.log("DIFF ENGINE — a mass row-add requires review (blast-radius gate counts additions)");
{
  const oldR = Array.from({ length: 10 }, (_, i) => ({ id: `o${i}`, value: i }));
  const newR = [...oldR, ...Array.from({ length: 90 }, (_, i) => ({ id: `n${i}`, value: i }))]; // 10 → 100
  const d = diffSnapshots(SNAP, oldR, newR);
  check("mass-add (10→100) exceeds the change-fraction gate", d.requiresReview === true, JSON.stringify(d.reviewReasons));
}

console.log("DIFF ENGINE — no-change is not meaningful");
{
  const rows = [{ id: "a", value: 1, spkid: "1", retrievedAt: "2026-01-01" }];
  const rowsNewDateOnly = [{ id: "a", value: 1, spkid: "1", retrievedAt: "2026-07-01" }];
  const d = diffSnapshots(SNAP, rows, rowsNewDateOnly);
  check("retrievedAt-only change is NOT meaningful", d.hasMeaningfulChanges === false, JSON.stringify(d.byClass));
}

console.log("FAILURE-SAFETY — an empty/invalid candidate never changes committed data");
{
  // Pick a real snapshot and run the orchestrator with a deliberately-empty candidate.
  const target = REFRESH_SNAPSHOTS.find((s) => s.id === "wikidata-missions")!;
  const before = sha(target.file);
  const dir = mkdtempSync(join(tmpdir(), "refresh-test-"));
  const emptyCandidate = join(dir, "empty.ts");
  writeFileSync(emptyCandidate, "export const X = [];\n");
  let exitCode = 0;
  try {
    execFileSync("npx", ["tsx", "scripts/refresh/refresh.ts", "--provider", target.id, "--candidate", emptyCandidate, "--report-dir", dir], { stdio: "pipe" });
  } catch (e) { exitCode = (e as { status?: number }).status ?? 1; }
  const after = sha(target.file);
  check("empty candidate → orchestrator exits FAILED (code 2)", exitCode === 2, `exit=${exitCode}`);
  check("committed snapshot is byte-identical after a failed refresh", before === after);
  const report = JSON.parse(readFileSync(join(dir, `${target.id}.json`), "utf8"));
  check("report marks the run failed and NOT refreshed", report.ok === false && /preserved/i.test(report.note));
  check("report never claims a refresh happened", !/refreshed the dataset/i.test(report.note) || /did NOT/i.test(report.note));
  rmSync(dir, { recursive: true, force: true });
}

console.log(failures === 0 ? "\n✓ All refresh tests passed." : `\n✗ ${failures} refresh test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
