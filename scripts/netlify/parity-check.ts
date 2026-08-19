/**
 * Semantic production-parity checker for the Vercel → Netlify migration.
 *
 * Fetches every target in the parity corpus from two origins and compares the
 * things a hosting move must never change: status, content type, canonical URL,
 * title, headings, structured-data types, JSON response shape, redirect targets,
 * and the exact bodies of protocol files.
 *
 * It deliberately does NOT require byte-identical HTML: framework and runtime
 * differences (chunk hashes, RSC payload ordering, build ids) produce harmless
 * differences. What must match is the semantic contract.
 *
 * Usage
 *   tsx scripts/netlify/parity-check.ts --baseline <origin> --out <file.json>
 *   tsx scripts/netlify/parity-check.ts --baseline <origin> --candidate <origin>
 *
 * With only --baseline it records a snapshot. With both it compares them and
 * exits non-zero on any semantic difference.
 */
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createHash } from "node:crypto";
import { PARITY_CORPUS, type ParityTarget } from "./parity-corpus.js";

interface Snapshot {
  path: string;
  group: string;
  kind: ParityTarget["kind"];
  status: number;
  contentType: string;
  /** Only for redirects — the raw Location header. */
  location?: string;
  /** Semantic facts extracted per kind. */
  facts: Record<string, unknown>;
  /** Response headers we require to survive the move. */
  headers: Record<string, string>;
  error?: string;
}

const TRACKED_HEADERS = [
  "content-type",
  "cache-control",
  "x-content-type-options",
  "referrer-policy",
  "strict-transport-security",
  "content-security-policy",
  "permissions-policy",
  "x-frame-options",
  "access-control-allow-origin",
  "link",
];

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function text(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

/** Strip a leading origin so canonicals from two hosts stay comparable by path. */
function stripOrigin(u: string | null): string | null {
  if (!u) return u;
  try {
    const parsed = new URL(u);
    return `${parsed.pathname}${parsed.search}` || "/";
  } catch {
    return u;
  }
}

function jsonShape(value: unknown, depth = 0): unknown {
  if (depth > 3) return "…";
  if (Array.isArray(value)) return value.length === 0 ? [] : [jsonShape(value[0], depth + 1)];
  if (value === null) return "null";
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as object).sort()) {
      out[k] = jsonShape((value as Record<string, unknown>)[k], depth + 1);
    }
    return out;
  }
  return typeof value;
}

async function snapshot(origin: string, target: ParityTarget): Promise<Snapshot> {
  const url = `${origin.replace(/\/$/, "")}${target.path}`;
  const base: Snapshot = {
    path: target.path,
    group: target.group,
    kind: target.kind,
    status: 0,
    contentType: "",
    facts: {},
    headers: {},
  };
  let res: Response;
  try {
    res = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": "asteriastar-migration-parity/1.0" },
    });
  } catch (err) {
    return { ...base, error: String(err) };
  }

  base.status = res.status;
  base.contentType = (res.headers.get("content-type") ?? "").split(";")[0].trim();
  for (const h of TRACKED_HEADERS) {
    const v = res.headers.get(h);
    if (v) base.headers[h] = v;
  }
  if (res.status >= 300 && res.status < 400) {
    base.location = stripOrigin(res.headers.get("location")) ?? undefined;
    return base;
  }

  const body = await res.text();

  switch (target.kind) {
    case "page": {
      base.facts = {
        title: text(body, /<title>([^<]*)<\/title>/),
        canonical: stripOrigin(text(body, /<link rel="canonical" href="([^"]+)"/)),
        ogUrl: stripOrigin(text(body, /<meta property="og:url" content="([^"]+)"/)),
        ogTitle: text(body, /<meta property="og:title" content="([^"]+)"/),
        description: text(body, /<meta name="description" content="([^"]*)"/),
        robots: text(body, /<meta name="robots" content="([^"]+)"/),
        h1: (body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/g) ?? []).map((h) =>
          h.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
        ),
        h2Count: (body.match(/<h2[^>]*>/g) ?? []).length,
        jsonLdTypes: (body.match(/"@type"\s*:\s*"([^"]+)"/g) ?? [])
          .map((m) => m.split('"')[3])
          .sort(),
        jsonLdBlocks: (body.match(/<script type="application\/ld\+json">/g) ?? []).length,
        // Analytics must appear exactly once, and only the approved tracker.
        webmasterIdRefs: (body.match(/webmasterid\.com\/tracker/g) ?? []).length,
        webmasterSiteIds: Array.from(new Set(body.match(/wm_[a-z0-9]+/g) ?? [])),
        // No deployment host may leak into the HTML.
        vercelAppRefs: (body.match(/[a-z0-9-]+\.vercel\.app/g) ?? []).filter(
          (h) => h !== "webmasterid-ingest-api.vercel.app",
        ).length,
        netlifyAppRefs: (body.match(/[a-z0-9-]+\.netlify\.app/g) ?? []).length,
        imageCount: (body.match(/<img\b/g) ?? []).length,
        // Optimised-image endpoint usage, platform-independent.
        optimisedImages: (body.match(/\/_next\/image\?/g) ?? []).length,
      };
      break;
    }
    case "json": {
      try {
        const parsed = JSON.parse(body);
        base.facts = { shape: jsonShape(parsed), keys: Object.keys(parsed ?? {}).sort() };
      } catch {
        base.facts = { parseError: true, snippet: body.slice(0, 200) };
      }
      break;
    }
    case "text": {
      base.facts = {
        sha256: createHash("sha256").update(body).digest("hex"),
        bytes: Buffer.byteLength(body),
        // Host-scoped lines differ only if the canonical identity changed.
        body: body.length <= 4096 ? body : undefined,
        lineCount: body.split("\n").length,
      };
      break;
    }
    case "xml": {
      const locs = (body.match(/<loc>([^<]+)<\/loc>/g) ?? []).map((l) =>
        l.replace(/<\/?loc>/g, ""),
      );
      base.facts = {
        locCount: locs.length,
        hosts: Array.from(new Set(locs.map((l) => new URL(l).origin))).sort(),
        imageCount: (body.match(/<image:loc>/g) ?? []).length,
        // Order-independent digest of the URL set.
        locSetSha256: createHash("sha256").update([...locs].sort().join("\n")).digest("hex"),
      };
      break;
    }
    case "asset": {
      base.facts = { bytes: Buffer.byteLength(body) };
      break;
    }
    case "redirect":
      break;
  }
  return base;
}

interface Diff {
  path: string;
  group: string;
  field: string;
  baseline: unknown;
  candidate: unknown;
  severity: "critical" | "warn";
}

/** Fields that legitimately differ between two live deployments of the same code. */
const TOLERATED = new Set([
  // Live Sky and other computed endpoints embed the real computation time.
  "facts.shape.envelope.computedAt",
  "headers.cache-control",
]);

/** Endpoint groups whose *values* change with wall-clock time; shape must still match. */
const TIME_DEPENDENT = new Set(["api-live-sky", "api-data-health", "api-live-status"]);

function compare(a: Snapshot[], b: Snapshot[]): Diff[] {
  const diffs: Diff[] = [];
  const byPath = new Map(b.map((s) => [s.path, s]));
  for (const base of a) {
    const cand = byPath.get(base.path);
    if (!cand) {
      diffs.push({ path: base.path, group: base.group, field: "presence", baseline: "present", candidate: "missing", severity: "critical" });
      continue;
    }
    if (base.error || cand.error) {
      diffs.push({ path: base.path, group: base.group, field: "fetch", baseline: base.error ?? "ok", candidate: cand.error ?? "ok", severity: "critical" });
      continue;
    }
    if (base.status !== cand.status) {
      diffs.push({ path: base.path, group: base.group, field: "status", baseline: base.status, candidate: cand.status, severity: "critical" });
    }
    if (base.contentType !== cand.contentType) {
      diffs.push({ path: base.path, group: base.group, field: "contentType", baseline: base.contentType, candidate: cand.contentType, severity: "critical" });
    }
    if (base.location !== cand.location) {
      diffs.push({ path: base.path, group: base.group, field: "location", baseline: base.location, candidate: cand.location, severity: "critical" });
    }

    const timeDependent = TIME_DEPENDENT.has(base.group);
    const walk = (x: unknown, y: unknown, trail: string) => {
      if (TOLERATED.has(trail)) return;
      const same = JSON.stringify(x) === JSON.stringify(y);
      if (same) return;
      if (
        x && y && typeof x === "object" && typeof y === "object" &&
        !Array.isArray(x) && !Array.isArray(y)
      ) {
        const keys = new Set([...Object.keys(x), ...Object.keys(y)]);
        for (const k of keys) {
          walk((x as Record<string, unknown>)[k], (y as Record<string, unknown>)[k], `${trail}.${k}`);
        }
        return;
      }
      // For a time-dependent endpoint the JSON *shape* is compared, so a leaf
      // difference there is a genuine contract change, not clock drift.
      diffs.push({ path: base.path, group: base.group, field: trail, baseline: x, candidate: y, severity: timeDependent && trail.startsWith("facts.shape") ? "critical" : "critical" });
    };
    walk(base.facts, cand.facts, "facts");

    for (const h of TRACKED_HEADERS) {
      if (h === "cache-control") continue; // reported separately, see caching report
      const bv = base.headers[h];
      const cv = cand.headers[h];
      if (bv !== cv) {
        diffs.push({ path: base.path, group: base.group, field: `headers.${h}`, baseline: bv ?? null, candidate: cv ?? null, severity: h === "content-type" ? "critical" : "warn" });
      }
    }
    if (base.headers["cache-control"] !== cand.headers["cache-control"]) {
      diffs.push({ path: base.path, group: base.group, field: "headers.cache-control", baseline: base.headers["cache-control"] ?? null, candidate: cand.headers["cache-control"] ?? null, severity: "warn" });
    }
  }
  return diffs;
}

async function capture(origin: string, concurrency = 6): Promise<Snapshot[]> {
  const out: Snapshot[] = [];
  const queue = [...PARITY_CORPUS];
  const workers = Array.from({ length: concurrency }, async () => {
    for (;;) {
      const t = queue.shift();
      if (!t) return;
      out.push(await snapshot(origin, t));
    }
  });
  await Promise.all(workers);
  return out.sort((x, y) => x.path.localeCompare(y.path));
}

async function main() {
  const baseline = arg("baseline");
  const candidate = arg("candidate");
  const out = arg("out");
  const compareFile = arg("compare");

  if (!baseline && !compareFile) {
    console.error("usage: parity-check --baseline <origin> [--candidate <origin>] [--out file.json]");
    process.exit(2);
  }

  let baseSnaps: Snapshot[];
  if (compareFile) {
    baseSnaps = JSON.parse(readFileSync(compareFile, "utf-8")).snapshots;
  } else {
    console.log(`[parity] capturing baseline from ${baseline} (${PARITY_CORPUS.length} targets)…`);
    baseSnaps = await capture(baseline!);
  }

  if (out) {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify({ origin: baseline ?? compareFile, capturedAt: new Date().toISOString(), snapshots: baseSnaps }, null, 2));
    console.log(`[parity] wrote ${out}`);
  }

  const failures = baseSnaps.filter((s) => s.error);
  if (failures.length) {
    console.error(`[parity] ${failures.length} target(s) failed to fetch:`);
    for (const f of failures) console.error(`  ${f.path}: ${f.error}`);
  }

  if (!candidate) {
    const byStatus = new Map<number, number>();
    for (const s of baseSnaps) byStatus.set(s.status, (byStatus.get(s.status) ?? 0) + 1);
    console.log("[parity] status distribution:", Object.fromEntries([...byStatus].sort()));
    process.exit(failures.length ? 1 : 0);
  }

  console.log(`[parity] capturing candidate from ${candidate}…`);
  const candSnaps = await capture(candidate);
  const diffs = compare(baseSnaps, candSnaps);
  const critical = diffs.filter((d) => d.severity === "critical");
  const warn = diffs.filter((d) => d.severity === "warn");

  const report = { baseline: baseline ?? compareFile, candidate, comparedAt: new Date().toISOString(), targets: PARITY_CORPUS.length, critical, warn };
  const reportPath = arg("report");
  if (reportPath) {
    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`[parity] wrote ${reportPath}`);
  }

  for (const d of critical) {
    console.error(`✗ ${d.path} [${d.field}]\n    baseline:  ${JSON.stringify(d.baseline)?.slice(0, 300)}\n    candidate: ${JSON.stringify(d.candidate)?.slice(0, 300)}`);
  }
  for (const d of warn) {
    console.warn(`! ${d.path} [${d.field}] ${JSON.stringify(d.baseline)?.slice(0, 160)} → ${JSON.stringify(d.candidate)?.slice(0, 160)}`);
  }

  if (critical.length === 0) {
    console.log(`\n✓ Semantic parity: ${PARITY_CORPUS.length} targets, 0 critical differences, ${warn.length} advisory.`);
  } else {
    console.error(`\n✗ Semantic parity FAILED: ${critical.length} critical difference(s) across ${new Set(critical.map((d) => d.path)).size} target(s).`);
  }
  process.exit(critical.length ? 1 : 0);
}

void main();
