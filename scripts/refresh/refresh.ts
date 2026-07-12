/**
 * Scientific snapshot refresh orchestrator (Program: automated refresh).
 *
 *   npx tsx scripts/refresh/refresh.ts --provider <snapshot-id> [--candidate <file>] [--report-dir <dir>]
 *
 * For one provider snapshot it: backs up the committed snapshot, regenerates it from the
 * REAL source (or a supplied candidate), computes a semantic diff, and decides. Honest
 * failure behaviour is the core guarantee:
 *  - a fetch/ingest failure NEVER empties or deletes data — the committed snapshot is
 *    restored and the run is marked FAILED (never "refreshed", never "no matches");
 *  - a run with no meaningful scientific change reverts the retrieval-date churn and
 *    proposes nothing (no empty PR);
 *  - a run with meaningful change keeps it, writes a machine + human report, and flags
 *    whether it is within safe auto-merge thresholds or needs review.
 */
import { copyFileSync, rmSync, mkdirSync, writeFileSync, appendFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { SNAPSHOT_BY_ID } from "./snapshots";
import { readSnapshotRows, diffSnapshots, renderDiffMarkdown } from "./diff-snapshot";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function setOutput(k: string, v: string) {
  const out = process.env.GITHUB_OUTPUT;
  if (out) appendFileSync(out, `${k}=${v}\n`);
}

function finish(status: "failed" | "no-changes" | "changes", report: Record<string, unknown>, reportDir: string, snapshotId: string, file?: string): never {
  mkdirSync(reportDir, { recursive: true });
  writeFileSync(join(reportDir, `${snapshotId}.json`), JSON.stringify(report, null, 2));
  setOutput("status", status);
  setOutput("hasChanges", String(status === "changes"));
  setOutput("requiresReview", String(report.requiresReview === true));
  if (file && status === "changes") setOutput("file", file);
  console.log(`\n[refresh:${snapshotId}] status=${status}`);
  process.exit(status === "failed" ? 2 : 0);
}

function main() {
  const providerId = arg("provider");
  const reportDir = arg("report-dir") ?? "refresh-reports";
  const candidate = arg("candidate"); // test hook: diff against a pre-made candidate file instead of fetching
  const snap = providerId ? SNAPSHOT_BY_ID.get(providerId) : undefined;
  if (!snap) {
    console.error(`Unknown --provider. Known: ${[...SNAPSHOT_BY_ID.keys()].join(", ")}`);
    process.exit(1);
  }
  const runAt = new Date().toISOString();
  const oldRows = readSnapshotRows(snap.file);
  const bak = `${snap.file}.bak`;
  copyFileSync(snap.file, bak);
  const restore = () => { copyFileSync(bak, snap.file); rmSync(bak, { force: true }); };

  // 1) Regenerate the snapshot from the real source (or, for a test, from a candidate).
  try {
    if (candidate) {
      copyFileSync(candidate, snap.file);
    } else {
      execFileSync("npx", ["tsx", snap.ingest], { stdio: "inherit", maxBuffer: 256 * 1024 * 1024 });
    }
  } catch (err) {
    restore(); // NEVER leave a partial/empty snapshot; keep the last validated one.
    finish("failed", {
      snapshotId: snap.id, provider: snap.provider, runAt, ok: false,
      error: `ingest failed: ${(err as Error).message?.slice(0, 300)}`,
      note: "Committed snapshot preserved. This run did NOT refresh the dataset and made no data change.",
    }, reportDir, snap.id);
  }

  // 2) Read the candidate and validate its identity (right shape, non-empty, same key field).
  let newRows: Record<string, unknown>[];
  try {
    newRows = readSnapshotRows(snap.file);
    if (!Array.isArray(newRows) || newRows.length === 0) throw new Error("candidate snapshot is empty");
    if (!(snap.keyField in (newRows[0] ?? {}))) throw new Error(`candidate missing key field ${snap.keyField}`);
  } catch (err) {
    restore();
    finish("failed", {
      snapshotId: snap.id, provider: snap.provider, runAt, ok: false,
      error: `candidate validation failed: ${(err as Error).message}`,
      note: "Committed snapshot preserved.",
    }, reportDir, snap.id);
  }

  // 3) Semantic diff.
  const diff = diffSnapshots(snap, oldRows, newRows!);

  if (!diff.hasMeaningfulChanges) {
    // Only the retrieval date churned — revert so the committed snapshot stays identical.
    restore();
    finish("no-changes", { ...diff, provider: snap.provider, runAt, ok: true, note: "No meaningful scientific change; retrieval-date churn reverted, no PR." }, reportDir, snap.id);
  }

  // 4) Meaningful change: keep it, remove the backup, write reports, run validators.
  rmSync(bak, { force: true });
  const md = renderDiffMarkdown(diff);
  writeFileSync(join(reportDir || ".", `${snap.id}.md`), md);
  try {
    execFileSync("npm", ["run", "validate"], { stdio: "inherit" });
  } catch {
    // A validator failure on the new data is itself review-worthy, not an auto-merge.
    finish("changes", { ...diff, provider: snap.provider, runAt, ok: true, requiresReview: true, reviewReasons: [...diff.reviewReasons, "validators failed on the candidate"], markdown: md }, reportDir, snap.id, snap.file);
  }
  finish("changes", { ...diff, provider: snap.provider, runAt, ok: true, markdown: md }, reportDir, snap.id, snap.file);
}

// Ensure a report dir exists even for early errors.
mkdirSync(dirname(join(arg("report-dir") ?? "refresh-reports", "x")), { recursive: true });
main();
