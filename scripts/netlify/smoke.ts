/**
 * Deployment smoke test — asserts the platform-level guarantees that a hosting
 * change can break, against any running origin.
 *
 *   npm run netlify:smoke -- --origin http://localhost:8888        (netlify dev)
 *   npm run netlify:smoke -- --origin https://<deploy>.netlify.app (candidate)
 *   npm run netlify:smoke -- --origin https://www.asteriastar.com  (production)
 *
 * Unlike parity-check.ts, this needs no baseline: every assertion is absolute,
 * so it is the gate that can run before a comparison origin exists. Add
 * `--expect-canonical-host <host>` to require canonical URLs on a specific host
 * (production uses asteriastar.com; a preview must NOT).
 */
import { PARITY_CORPUS } from "./parity-corpus.js";

interface Failure { target: string; detail: string }

const failures: Failure[] = [];
const passes: string[] = [];

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const ORIGIN = (arg("origin") ?? "http://localhost:8888").replace(/\/$/, "");
const EXPECT_CANONICAL_HOST = arg("expect-canonical-host");
const IS_PREVIEW = process.argv.includes("--preview");

function fail(target: string, detail: string) { failures.push({ target, detail }); }
function pass(what: string) { passes.push(what); }

async function get(path: string, init?: RequestInit) {
  return fetch(`${ORIGIN}${path}`, {
    redirect: "manual",
    headers: { "user-agent": "asteriastar-netlify-smoke/1.0" },
    ...init,
  });
}

// ---------------------------------------------------------------------------
// 1. Every functional class answers with the right status and content type.
// ---------------------------------------------------------------------------
async function checkCorpus() {
  const CONTENT_TYPE_BY_KIND: Record<string, RegExp> = {
    page: /^text\/html/,
    json: /^(application\/json|application\/ld\+json|application\/manifest\+json)/,
    text: /^text\/plain/,
    xml: /^(application\/xml|text\/xml)/,
    asset: /^(image|application\/octet-stream)/,
  };

  const queue = [...PARITY_CORPUS];
  const worker = async () => {
    for (;;) {
      const t = queue.shift();
      if (!t) return;
      const expected = t.expectStatus ?? 200;
      let res: Response;
      try {
        res = await get(t.path);
      } catch (err) {
        fail(t.path, `request failed: ${err}`);
        continue;
      }
      if (res.status !== expected) {
        fail(t.path, `status ${res.status}, expected ${expected}`);
        await res.arrayBuffer().catch(() => {});
        continue;
      }
      const ct = (res.headers.get("content-type") ?? "").split(";")[0].trim();
      const want = CONTENT_TYPE_BY_KIND[t.kind];
      // A 404 HTML page and a 400 JSON error still have to be typed correctly,
      // which is exactly what a misrouted host gets wrong.
      if (want && !want.test(ct)) {
        fail(t.path, `content-type "${ct}" does not match ${t.kind}`);
      }
      const body = await res.text();
      if (t.kind === "page" && expected === 200) {
        if (!/<html/i.test(body)) fail(t.path, "response is not an HTML document");
        if (!/<title>/i.test(body)) fail(t.path, "no <title>");
      }
      if (t.kind === "json" && expected === 200) {
        try { JSON.parse(body); } catch { fail(t.path, "body is not valid JSON"); }
      }
      if (res.status === 200 && body.length === 0) fail(t.path, "empty 200 response");
      pass(`${t.group} ${t.path}`);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
}

// ---------------------------------------------------------------------------
// 2. Canonical host discipline.
// ---------------------------------------------------------------------------
// The failure this catches is a deployment that starts announcing itself under
// the platform's own hostname — the single most damaging SEO regression a
// hosting migration can cause, in either direction.
async function checkCanonicalHost() {
  const res = await get("/");
  const html = await res.text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) { fail("/", "no canonical link"); return; }

  const host = new URL(canonical).host;
  const platformHost = /\.(netlify\.app|vercel\.app|pages\.dev)$/.test(host);

  if (EXPECT_CANONICAL_HOST) {
    if (host !== EXPECT_CANONICAL_HOST) {
      fail("/", `canonical host is "${host}", expected "${EXPECT_CANONICAL_HOST}"`);
    } else {
      pass(`canonical host ${host}`);
    }
  }
  if (IS_PREVIEW && !platformHost) {
    fail("/", `preview deploy emits production canonical "${canonical}" — previews must use their own origin`);
  }
  if (!IS_PREVIEW && platformHost) {
    fail("/", `production canonical points at the platform hostname "${host}"`);
  }

  // The sitemap and llms.txt must agree with the canonical host, or IndexNow and
  // crawlers would be handed URLs for a different site than the pages claim.
  const sm = await (await get("/sitemap.xml")).text();
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const smHosts = new Set(locs.map((l) => new URL(l).host));
  if (smHosts.size !== 1) fail("/sitemap.xml", `mixed hosts in sitemap: ${[...smHosts].join(", ")}`);
  else if (![...smHosts][0].endsWith(host.replace(/^www\./, ""))) {
    fail("/sitemap.xml", `sitemap host "${[...smHosts][0]}" disagrees with canonical host "${host}"`);
  } else pass(`sitemap host ${[...smHosts][0]} (${locs.length} URLs)`);
}

// ---------------------------------------------------------------------------
// 3. Analytics appears exactly once, and is the approved tracker.
// ---------------------------------------------------------------------------
async function checkAnalytics() {
  for (const path of ["/", "/astronomy/planets/jupiter"]) {
    const html = await (await get(path)).text();
    const scriptTags = [...html.matchAll(/<script[^>]*id="webmasterid-tracker"/g)].length;
    const trackerSrcRefs = [...html.matchAll(/webmasterid\.com\/tracker\.iife\.min\.js/g)].length;
    if (trackerSrcRefs === 0) fail(path, "WebmasterID tracker is absent");
    const siteIds = new Set(html.match(/wm_[a-z0-9]+/g) ?? []);
    if (siteIds.size > 1) fail(path, `multiple WebmasterID site ids: ${[...siteIds].join(", ")}`);
    if (siteIds.size === 1 && ![...siteIds][0].startsWith("wm_")) fail(path, "malformed WebmasterID site id");
    // next/script dedupes by id, so more than one *rendered* tag means the
    // component was mounted twice.
    if (scriptTags > 1) fail(path, `WebmasterID tracker rendered ${scriptTags} times`);
    // No competing analytics may be introduced by a hosting change.
    for (const rival of [/googletagmanager\.com/, /google-analytics\.com/, /netlify-rum/, /plausible\.io/, /va\.vercel-scripts\.com/]) {
      if (rival.test(html)) fail(path, `unexpected third-party analytics: ${rival}`);
    }
    pass(`analytics once on ${path}`);
  }
}

// ---------------------------------------------------------------------------
// 4. IndexNow: key file byte-correct, and the trigger cannot fire on a preview.
// ---------------------------------------------------------------------------
async function checkIndexNow() {
  const KEY = "c292fa58c74f45f9ad982e152b4f7c1c";
  const res = await get(`/${KEY}.txt`);
  if (res.status !== 200) { fail(`/${KEY}.txt`, `status ${res.status}`); return; }
  const body = await res.text();
  // IndexNow requires the file to contain exactly the key. A host that appends a
  // newline, or serves an HTML error page, silently invalidates verification.
  if (body !== KEY) {
    fail(`/${KEY}.txt`, `body is ${JSON.stringify(body.slice(0, 64))}, expected exactly the key`);
  } else pass("IndexNow key file byte-correct");

  const trigger = await get("/api/indexnow", { method: "GET" });
  if (IS_PREVIEW && trigger.status !== 503) {
    fail("/api/indexnow", `preview returned ${trigger.status}; without a key it must be 503 so no preview can notify a search engine`);
  }
  if (IS_PREVIEW && trigger.status === 503) pass("IndexNow trigger disabled on preview");
}

// ---------------------------------------------------------------------------
// 5. Freshness semantics for computed and time-dependent responses.
// ---------------------------------------------------------------------------
// These are the measured production contracts, not guesses. Live Sky answers
// "what is in the sky now": if a hosting change lets those responses be cached
// longer than they declare, the site reports a stale sky while its own honesty
// envelope claims to be current — a correctness bug, not a performance one.
// The force-dynamic pages must stay uncacheable outright.
async function checkFreshness() {
  const maxAgeOf = (cc: string) => {
    const m = cc.match(/(?:^|[,\s])max-age=(\d+)/);
    return m ? Number(m[1]) : null;
  };

  // Computed endpoints whose answer depends on *now* rather than on a date:
  // at most one hour, matching what each route declares.
  // /api/v0/live-sky/sun is deliberately absent — it defaults `date` to today and
  // returns whole-day solar events, so its own contract is a day (see DAILY).
  const HOURLY: string[] = [
    "/api/v0/live-sky/moon",
    "/api/v0/live-sky/tonight?latitude=50.08&longitude=14.44",
    "/api/v0/live-sky/planets?latitude=50.08&longitude=14.44",
    "/api/v0/authority/data-health",
  ];
  for (const path of HOURLY) {
    const res = await get(path);
    if (res.status !== 200) { fail(path, `status ${res.status}`); continue; }
    const cc = res.headers.get("cache-control") ?? "";
    const maxAge = maxAgeOf(cc);
    if (/immutable/.test(cc)) { fail(path, `computed response marked immutable: "${cc}"`); continue; }
    if (maxAge === null) { fail(path, `no max-age on a computed response: "${cc}"`); continue; }
    if (maxAge > 3600) {
      fail(path, `max-age=${maxAge} exceeds the 1 h freshness contract for an undated computed response ("${cc}")`);
    } else pass(`freshness ≤1h on ${path}`);
  }

  // With an explicit fixed date the answer is deterministic, so a day is
  // the declared contract — but no longer, and never immutable.
  const DAILY = [
    "/api/v0/live-sky/sun?latitude=50.08&longitude=14.44",
    "/api/v0/live-sky/sun?latitude=50.08&longitude=14.44&date=2026-08-19",
    "/api/v0/live-sky/tonight?latitude=50.08&longitude=14.44&date=2026-08-19",
    "/api/v0/live-sky/moon?latitude=50.08&longitude=14.44&date=2026-08-19",
  ];
  for (const path of DAILY) {
    const res = await get(path);
    if (res.status !== 200) { fail(path, `status ${res.status}`); continue; }
    const cc = res.headers.get("cache-control") ?? "";
    const maxAge = maxAgeOf(cc);
    if (maxAge === null || maxAge > 86400 || /immutable/.test(cc)) {
      fail(path, `dated computed response has cache-control "${cc}"; contract is max-age ≤ 86400, not immutable`);
    } else pass(`freshness ≤24h on ${path}`);
  }

  // force-dynamic pages were served uncacheable in production and must stay so.
  for (const path of ["/authority/data-health", "/authority/data-health/sources", "/assistant/entity"]) {
    const res = await get(path);
    if (res.status !== 200) { fail(path, `status ${res.status}`); continue; }
    const cc = res.headers.get("cache-control") ?? "";
    if (!/no-store/.test(cc)) {
      fail(path, `force-dynamic page is cacheable ("${cc}"); production served no-store`);
    } else pass(`no-store preserved on ${path}`);
  }

  // Immutable build assets must still be cacheable, or every page pays for it.
  const home = await (await get("/")).text();
  const asset = home.match(/\/_next\/static\/[^"']+\.(?:js|css)/)?.[0];
  if (asset) {
    const res = await get(asset);
    const cc = res.headers.get("cache-control") ?? "";
    if (!/max-age=31536000|immutable/.test(cc)) {
      fail(asset, `hashed build asset is not immutably cacheable (cache-control: "${cc}")`);
    } else pass("hashed static assets immutable");
  }
}

// ---------------------------------------------------------------------------
// 6. Security header parity.
// ---------------------------------------------------------------------------
async function checkHeaders() {
  const res = await get("/");
  const hsts = res.headers.get("strict-transport-security");
  // Only meaningful over TLS; skip on a local HTTP emulator.
  if (ORIGIN.startsWith("https://")) {
    if (!hsts) fail("/", "Strict-Transport-Security is missing (production served max-age=63072000)");
    else if (!/max-age=63072000/.test(hsts)) fail("/", `HSTS is "${hsts}", expected max-age=63072000`);
    else pass("HSTS parity");
  }
  // The single most destructive way this migration could fail silently: the
  // preview-only noindex header escaping into production would deindex all
  // 8,671 URLs, and nothing else in the stack would look wrong. Checked on both
  // a page and an API response, since header rules apply to function output too.
  for (const path of ["/", "/astronomy/planets/jupiter", "/api/v0/sources", "/sitemap.xml"]) {
    const r = await get(path);
    const xrt = r.headers.get("x-robots-tag");
    if (IS_PREVIEW) {
      if (!xrt || !/noindex/i.test(xrt)) {
        fail(path, `preview is missing X-Robots-Tag: noindex (got ${JSON.stringify(xrt)}) — a preview could be indexed`);
      } else pass(`preview noindex on ${path}`);
    } else if (xrt && /noindex/i.test(xrt)) {
      fail(path, `PRODUCTION sends X-Robots-Tag: ${xrt} — this would deindex the site`);
    } else pass(`no noindex header on ${path}`);
  }

  const api = await get("/api/v0/sources");
  if (api.headers.get("access-control-allow-origin") !== "*") {
    fail("/api/v0/sources", "Open Data API lost its CORS allow-origin: *");
  } else pass("Open Data CORS preserved");

  // The same check in the HTML itself: a production page must not carry a
  // noindex robots meta tag.
  const homeHtml = await (await get("/")).text();
  const robotsMeta = homeHtml.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  if (!IS_PREVIEW && robotsMeta && /noindex/i.test(robotsMeta)) {
    fail("/", `production page carries <meta name="robots" content="${robotsMeta}">`);
  } else pass("robots meta safe");
}

// ---------------------------------------------------------------------------
// 7. Media and next/image actually resolve.
// ---------------------------------------------------------------------------
async function checkMedia() {
  const home = await (await get("/")).text();
  // `srcset` packs several candidates into one attribute ("<url> 640w, <url> 750w"),
  // so the URLs have to be split out rather than matched as one blob.
  const optimised = Array.from(
    new Set(
      [...home.matchAll(/\/_next\/image\?[^"'\s\\]+/g)].map((m) =>
        m[0].replace(/&amp;/g, "&").replace(/,$/, ""),
      ),
    ),
  );
  if (optimised.length === 0) {
    fail("/", "no next/image URLs on the homepage — image optimisation may have been disabled");
  } else {
    for (const u of optimised.slice(0, 5)) {
      const res = await get(u);
      if (res.status !== 200) { fail(u, `optimised image returned ${res.status}`); continue; }
      const ct = res.headers.get("content-type") ?? "";
      if (!/^image\//.test(ct)) fail(u, `optimised image content-type "${ct}"`);
    }
    pass(`next/image serving (${optimised.length} on homepage, 5 sampled)`);
  }

  // Format negotiation, measured against production before the move: the app
  // configures only `image/webp` (Next's default), so a browser advertising AVIF
  // must still be served WebP, and a client advertising nothing must get the
  // original type back. A different image CDN is exactly where this silently
  // changes — either by ignoring Accept, or by "helpfully" serving AVIF that the
  // application never opted into.
  const sample = optimised[0];
  if (sample) {
    const negotiation: [string, RegExp][] = [
      ["image/avif,image/webp,*/*", /^image\/webp$/],
      ["image/webp,*/*", /^image\/webp$/],
      ["*/*", /^image\/(jpeg|png)$/],
    ];
    let optimisedBytes = Infinity;
    for (const [accept, wantType] of negotiation) {
      const res = await get(sample, { headers: { accept, "user-agent": "asteriastar-netlify-smoke/1.0" } });
      const ct = (res.headers.get("content-type") ?? "").split(";")[0].trim();
      if (res.status !== 200) { fail(sample, `Accept:${accept} returned ${res.status}`); continue; }
      if (!wantType.test(ct)) {
        fail(sample, `Accept:${accept} produced "${ct}", expected ${wantType}`);
      } else pass(`image negotiation ${accept} → ${ct}`);
      const bytes = (await res.arrayBuffer()).byteLength;
      if (accept.includes("webp")) optimisedBytes = Math.min(optimisedBytes, bytes);
    }
    // Optimisation must actually optimise. A CDN that passes the original
    // through still returns 200 and the right content-type.
    const originalPath = decodeURIComponent(sample.match(/[?&]url=([^&]+)/)?.[1] ?? "");
    if (originalPath) {
      const orig = await get(originalPath);
      if (orig.status === 200) {
        const originalBytes = (await orig.arrayBuffer()).byteLength;
        if (optimisedBytes >= originalBytes) {
          fail(sample, `optimised image (${optimisedBytes}B) is not smaller than the original ${originalPath} (${originalBytes}B) — optimisation is not happening`);
        } else pass(`image optimisation ${(originalBytes / 1024).toFixed(0)}KB → ${(optimisedBytes / 1024).toFixed(0)}KB`);
      }
    }
  }

  // A raw file from the 201 MB scientific media registry.
  const raw = home.match(/\/media\/[^"'?\\]+\.(?:avif|webp|jpg|png)/)?.[0];
  if (raw) {
    const res = await get(raw);
    if (res.status !== 200) fail(raw, `raw media asset returned ${res.status}`);
    else pass(`raw media asset ${raw}`);
  }
}

// ---------------------------------------------------------------------------
// 8. Search: index assets load and the API answers.
// ---------------------------------------------------------------------------
async function checkSearch() {
  const manifestRes = await get("/search-index/manifest.json");
  if (manifestRes.status !== 200) { fail("/search-index/manifest.json", `status ${manifestRes.status}`); return; }
  const manifest = await manifestRes.json() as { shards?: { file?: string; path?: string }[] };
  const shards = manifest.shards ?? [];
  if (shards.length === 0) fail("/search-index/manifest.json", "manifest declares no shards");
  for (const shard of shards) {
    const file = shard.file ?? shard.path;
    if (!file) continue;
    const p = file.startsWith("/") ? file : `/search-index/${file}`;
    const res = await get(p);
    if (res.status !== 200) fail(p, `search shard returned ${res.status}`);
  }
  pass(`search index (${shards.length} shard(s))`);

  const api = await get("/api/v0/search?q=jupiter&limit=3");
  if (api.status !== 200) { fail("/api/v0/search", `status ${api.status}`); return; }
  const json = await api.json() as { data?: { results?: unknown[] } };
  const items = json.data?.results;
  if (!Array.isArray(items) || items.length === 0) {
    fail("/api/v0/search", "a search for 'jupiter' returned no results");
  } else pass(`search API returns ${items.length} result(s) for 'jupiter'`);
}

// ---------------------------------------------------------------------------
// 9. Redirect policy: no loops, no accidental multi-hop.
// ---------------------------------------------------------------------------
async function checkRedirects() {
  const seen = new Set<string>();
  let url = `${ORIGIN}/`;
  let hops = 0;
  for (;;) {
    if (seen.has(url)) { fail(url, "redirect loop"); return; }
    seen.add(url);
    const res = await fetch(url, { redirect: "manual" });
    if (res.status < 300 || res.status >= 400) break;
    const loc = res.headers.get("location");
    if (!loc) { fail(url, `${res.status} with no Location`); return; }
    url = new URL(loc, url).toString();
    if (++hops > 4) { fail(url, `more than 4 redirect hops from ${ORIGIN}/`); return; }
  }
  if (hops > 1) fail(`${ORIGIN}/`, `${hops} redirect hops to reach a final response`);
  else pass(hops === 0 ? "homepage served directly" : "homepage reached in one hop");
}

async function main() {
  console.log(`[smoke] ${ORIGIN}${IS_PREVIEW ? " (preview)" : ""}\n`);
  await checkCorpus();
  await checkCanonicalHost();
  await checkAnalytics();
  await checkIndexNow();
  await checkFreshness();
  await checkHeaders();
  await checkMedia();
  await checkSearch();
  await checkRedirects();

  console.log(`  ${passes.length} check(s) passed`);
  if (failures.length === 0) {
    console.log(`\n✓ Netlify smoke passed against ${ORIGIN}`);
    process.exit(0);
  }
  console.error(`\n✗ ${failures.length} smoke failure(s):`);
  for (const f of failures) console.error(`  · ${f.target}\n      ${f.detail}`);
  process.exit(1);
}

void main();
