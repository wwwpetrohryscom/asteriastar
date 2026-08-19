/**
 * Server-timing benchmark for the migration: measures what a hosting change can
 * actually move, on the same pages, against two origins, in the same run.
 *
 *   tsx scripts/netlify/perf.ts --baseline <origin> --candidate <origin> [--runs 5]
 *
 * Reports TTFB, full-response time, and transfer size per page. Lab Core Web
 * Vitals (LCP/CLS/INP) come from Lighthouse, run separately — this measures the
 * network-and-server half, which is the half a host is responsible for and the
 * half that is measurable without a browser.
 *
 * Cold and warm are reported separately: a CDN's first response for a path is
 * the number a migration risks regressing, and averaging it away hides that.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const BASELINE_ARG = arg("baseline");
const CANDIDATE_ARG = arg("candidate");
const RUNS = Number(arg("runs") ?? 5);
const OUT = arg("out");
if (!BASELINE_ARG || !CANDIDATE_ARG) {
  console.error("usage: perf --baseline <origin> --candidate <origin> [--runs 5]");
  process.exit(2);
}
const BASELINE = BASELINE_ARG.replace(/\/$/, "");
const CANDIDATE = CANDIDATE_ARG.replace(/\/$/, "");

/** One representative page per performance-relevant shape. */
const PAGES: { path: string; what: string }[] = [
  { path: "/", what: "homepage (image-heavy, ISR)" },
  { path: "/explore/entity/galaxy/andromeda-galaxy", what: "heavy image entity" },
  { path: "/encyclopedia/timeline", what: "long editorial page" },
  { path: "/astronomy/planets/jupiter", what: "typical entity page" },
  { path: "/developers/api", what: "developer page" },
  { path: "/authority/data-health", what: "force-dynamic, API-backed page" },
  { path: "/api/v0/search?q=jupiter&limit=10", what: "search API" },
  { path: "/api/v0/live-sky/tonight?latitude=50.08&longitude=14.44", what: "computed API" },
];

interface Sample { ttfbMs: number; totalMs: number; bytes: number; status: number; cache?: string }

async function once(origin: string, path: string): Promise<Sample> {
  const started = performance.now();
  const res = await fetch(`${origin}${path}`, {
    headers: { "user-agent": "asteriastar-perf/1.0", "cache-control": "no-cache" },
  });
  const ttfbMs = performance.now() - started;
  const body = await res.arrayBuffer();
  return {
    ttfbMs,
    totalMs: performance.now() - started,
    bytes: body.byteLength,
    status: res.status,
    cache: res.headers.get("x-nf-request-id") ? "netlify" : res.headers.get("x-vercel-cache") ?? undefined,
  };
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

interface PageResult {
  path: string;
  what: string;
  coldTtfbMs: number;
  warmTtfbMedianMs: number;
  warmTotalMedianMs: number;
  bytes: number;
  status: number;
}

async function measurePage(origin: string, p: { path: string; what: string }, idx: number): Promise<PageResult> {
  // A unique query makes this a genuine cache miss for that URL. It does NOT
  // make the serverless function cold — that only happens once per origin — so
  // "cold" here means "cold CDN cache", and the very first page measured on an
  // origin additionally pays a function cold start.
  const bust = `${p.path}${p.path.includes("?") ? "&" : "?"}__perf=${idx}-${process.pid}`;
  const cold = await once(origin, bust);
  const warm: Sample[] = [];
  for (let i = 0; i < RUNS; i++) warm.push(await once(origin, p.path));
  return {
    path: p.path,
    what: p.what,
    coldTtfbMs: Math.round(cold.ttfbMs),
    warmTtfbMedianMs: Math.round(median(warm.map((w) => w.ttfbMs))),
    warmTotalMedianMs: Math.round(median(warm.map((w) => w.totalMs))),
    bytes: warm[0].bytes,
    status: warm[0].status,
  };
}

/**
 * Measure both origins page by page, alternating which one goes first.
 *
 * Measuring one origin fully and then the other is what makes a naive benchmark
 * lie: the second origin is measured after the client, the DNS cache and the
 * local network have all warmed up, and it looks faster for reasons that have
 * nothing to do with the host. Interleaving shares that bias; alternating the
 * order shares the remaining first-request penalty too.
 */
async function measureBoth(): Promise<{ base: PageResult[]; cand: PageResult[] }> {
  const base: PageResult[] = [];
  const cand: PageResult[] = [];
  for (const [i, p] of PAGES.entries()) {
    if (i % 2 === 0) {
      base.push(await measurePage(BASELINE, p, i));
      cand.push(await measurePage(CANDIDATE, p, i));
    } else {
      cand.push(await measurePage(CANDIDATE, p, i));
      base.push(await measurePage(BASELINE, p, i));
    }
  }
  return { base, cand };
}

function pct(a: number, b: number) {
  if (a === 0) return "—";
  const d = ((b - a) / a) * 100;
  return `${d >= 0 ? "+" : ""}${d.toFixed(0)}%`;
}

async function main() {
  console.log(`[perf] baseline  ${BASELINE}`);
  console.log(`[perf] candidate ${CANDIDATE}`);
  console.log(`[perf] ${PAGES.length} pages × (1 cold + ${RUNS} warm)\n`);

  const { base, cand } = await measureBoth();

  const rows = base.map((b, i) => {
    const c = cand[i];
    return { ...b, cand: c };
  });

  console.log(
    "page".padEnd(34) +
      "cold TTFB".padStart(22) +
      "warm TTFB".padStart(22) +
      "bytes".padStart(20),
  );
  console.log("-".repeat(98));
  for (const r of rows) {
    const label = r.path.length > 32 ? r.path.slice(0, 31) + "…" : r.path;
    console.log(
      label.padEnd(34) +
        `${r.coldTtfbMs}→${r.cand.coldTtfbMs}ms ${pct(r.coldTtfbMs, r.cand.coldTtfbMs)}`.padStart(22) +
        `${r.warmTtfbMedianMs}→${r.cand.warmTtfbMedianMs}ms ${pct(r.warmTtfbMedianMs, r.cand.warmTtfbMedianMs)}`.padStart(22) +
        `${(r.bytes / 1024).toFixed(0)}→${(r.cand.bytes / 1024).toFixed(0)} KB`.padStart(20),
    );
    if (r.status !== r.cand.status) {
      console.log(`  ! status differs: ${r.status} → ${r.cand.status}`);
    }
  }

  const warmBase = median(rows.map((r) => r.warmTtfbMedianMs));
  const warmCand = median(rows.map((r) => r.cand.warmTtfbMedianMs));
  console.log(`\n[perf] median warm TTFB across pages: ${warmBase}ms → ${warmCand}ms (${pct(warmBase, warmCand)})`);
  console.log("[perf] Measured from one client location, origins interleaved page by page with alternating order.");
  console.log("[perf] Treat these as a comparison between the two origins, not as absolute numbers.");
  console.log("[perf] 'cold' = cold CDN cache for that URL; the first page measured per origin also pays a function cold start.");

  if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify({ baseline: BASELINE, candidate: CANDIDATE, runs: RUNS, measuredAt: new Date().toISOString(), rows }, null, 2));
    console.log(`[perf] wrote ${OUT}`);
  }
}

void main();
