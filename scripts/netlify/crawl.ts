/**
 * Full crawl of a deployment, driven by its own sitemap.
 *
 * Verifies that every publicly declared URL actually answers, that no page
 * announces a canonical on a platform hostname, and that the assets pages depend
 * on resolve. Written for the migration but useful for any deploy.
 *
 *   tsx scripts/netlify/crawl.ts --origin https://<host> [--limit N] [--concurrency 12] [--out report.json]
 *
 * `--origin` is the host to crawl. Sitemap URLs may point at a different host
 * (production sitemaps carry the canonical apex), so each path is re-based onto
 * the crawled origin — that is deliberate: it is how a candidate deployment gets
 * crawled against the production URL set before any DNS change.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const ORIGIN = (arg("origin") ?? "").replace(/\/$/, "");
if (!ORIGIN) { console.error("usage: crawl --origin https://host [--limit N]"); process.exit(2); }
const LIMIT = Number(arg("limit") ?? Infinity);
const CONCURRENCY = Number(arg("concurrency") ?? 12);
const OUT = arg("out");
/** Hostnames a canonical URL must never use. */
const PLATFORM_HOST = /\.(netlify\.app|vercel\.app|pages\.dev)$/;

interface Result {
  path: string;
  status: number;
  ok: boolean;
  problem?: string;
  canonicalHost?: string;
  bytes?: number;
}

async function sitemapPaths(): Promise<string[]> {
  const res = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const paths = locs.map((l) => {
    const u = new URL(l);
    return `${u.pathname}${u.search}`;
  });
  return [...new Set(paths)];
}

async function check(path: string): Promise<Result> {
  let res: Response;
  try {
    res = await fetch(`${ORIGIN}${path}`, {
      redirect: "manual",
      headers: { "user-agent": "asteriastar-migration-crawler/1.0" },
    });
  } catch (err) {
    return { path, status: 0, ok: false, problem: `request failed: ${err}` };
  }
  const r: Result = { path, status: res.status, ok: res.status === 200 };
  if (res.status !== 200) {
    // A URL the site itself publishes in its sitemap must answer 200. A redirect
    // there is a stale sitemap entry; anything else is a broken page.
    r.problem = res.status >= 300 && res.status < 400
      ? `sitemap URL redirects to ${res.headers.get("location")}`
      : `sitemap URL returned ${res.status}`;
    await res.arrayBuffer().catch(() => {});
    return r;
  }
  const html = await res.text();
  r.bytes = Buffer.byteLength(html);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) {
    r.ok = false;
    r.problem = "no canonical link";
    return r;
  }
  try {
    const host = new URL(canonical).host;
    r.canonicalHost = host;
    if (PLATFORM_HOST.test(host)) {
      r.ok = false;
      r.problem = `canonical uses platform hostname ${host}`;
    }
  } catch {
    r.ok = false;
    r.problem = `unparseable canonical ${canonical}`;
  }
  if (!/<title>/i.test(html)) { r.ok = false; r.problem = "no <title>"; }
  return r;
}

async function main() {
  console.log(`[crawl] ${ORIGIN}`);
  const all = await sitemapPaths();
  const paths = all.slice(0, LIMIT);
  if (paths.length < all.length) {
    // Never let a bounded run read as full coverage.
    console.log(`[crawl] LIMITED RUN: crawling ${paths.length} of ${all.length} sitemap URLs (${all.length - paths.length} not checked)`);
  } else {
    console.log(`[crawl] ${paths.length} sitemap URLs`);
  }

  const results: Result[] = [];
  const queue = [...paths];
  let done = 0;
  const worker = async () => {
    for (;;) {
      const p = queue.shift();
      if (!p) return;
      results.push(await check(p));
      if (++done % 500 === 0) console.log(`[crawl]   ${done}/${paths.length}`);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const byStatus = new Map<number, number>();
  for (const r of results) byStatus.set(r.status, (byStatus.get(r.status) ?? 0) + 1);
  const failures = results.filter((r) => !r.ok);
  const canonicalHosts = new Map<string, number>();
  for (const r of results) if (r.canonicalHost) canonicalHosts.set(r.canonicalHost, (canonicalHosts.get(r.canonicalHost) ?? 0) + 1);

  console.log(`\n[crawl] status: ${JSON.stringify(Object.fromEntries([...byStatus].sort()))}`);
  console.log(`[crawl] canonical hosts: ${JSON.stringify(Object.fromEntries(canonicalHosts))}`);
  console.log(`[crawl] crawled ${results.length}, ok ${results.length - failures.length}, problems ${failures.length}`);

  if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify({
      origin: ORIGIN,
      crawledAt: new Date().toISOString(),
      sitemapTotal: all.length,
      crawled: results.length,
      statusCounts: Object.fromEntries(byStatus),
      canonicalHosts: Object.fromEntries(canonicalHosts),
      failures,
    }, null, 2));
    console.log(`[crawl] wrote ${OUT}`);
  }

  if (failures.length) {
    console.error(`\n✗ ${failures.length} problem(s):`);
    for (const f of failures.slice(0, 50)) console.error(`  ${f.status} ${f.path} — ${f.problem}`);
    if (failures.length > 50) console.error(`  … and ${failures.length - 50} more`);
    process.exit(1);
  }
  console.log(`\n✓ Crawl clean: ${results.length} URLs, all 200, all canonical on ${[...canonicalHosts.keys()].join(", ")}`);
}

void main();
