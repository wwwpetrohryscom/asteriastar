/**
 * The routing gate — the cross-project integration test.
 *
 * This is the only check in either repository that exercises the architecture rather than reasoning
 * about it. Everything else can pass while `asteriastar.com/blog` is still broken, because everything
 * else runs on one side of a proxy that has not been tested.
 *
 * It lives in BOTH repositories, deliberately and identically. The publication needs it to prove
 * itself standalone; this platform needs it to prove the proxy rule it owns actually works, and to
 * prove that adding the rule did not capture anything else. A shared copy in one repository would
 * make one of the two projects depend on the other for its own gate, which is the coupling the whole
 * architecture exists to avoid.
 *
 * Run it against whichever origin is being proved:
 *
 *   npm run blog:routing https://asteriastar.com          # production, through the proxy
 *   npm run blog:routing <this platform's deploy-preview origin>
 *   npm run blog:routing <the blog project's own origin> --direct
 *
 * The origin is always an argument and never a constant. Deployment hostnames belong in the
 * documentation and in `netlify.toml`, not in a script meant to outlive a host — a rule this
 * repository enforces, and the reason the examples above are placeholders.
 *
 * `--direct` relaxes the two rules that only hold through the proxy — the visitor-visible origin, and
 * the absence of the blog project's own hostname from the address being requested — so the same gate
 * can prove the blog standalone before the proxy exists.
 */

/*
 * No imports, so TypeScript would treat this as a global script and its top-level `main` would
 * collide with every other script in the project. `export {}` makes it a module with its own scope.
 */
export {};

const baseOrigin = (process.argv[2] ?? "").replace(/\/$/, "");
const direct = process.argv.includes("--direct");

if (!baseOrigin.startsWith("https://")) {
  console.error("usage: validate-blog-routing <https origin> [--direct]");
  process.exit(2);
}

const problems: string[] = [];
const fail = (message: string): void => void problems.push(message);
const notes: string[] = [];

interface Fetched {
  status: number;
  headers: Headers;
  body: string;
  finalUrl: string;
  redirected: boolean;
}

async function get(path: string): Promise<Fetched | null> {
  try {
    const response = await fetch(`${baseOrigin}${path}`, { redirect: "follow" });
    return {
      status: response.status,
      headers: response.headers,
      body: await response.text(),
      finalUrl: response.url,
      redirected: response.redirected,
    };
  } catch (error) {
    /*
     * `fetch` reports a redirect loop as a bare "fetch failed", which is the least useful thing it
     * could say about the most likely way this routing can break: a rule whose `from` folds onto its
     * own `to`. A loop already reached production once, and the gate named it "fetch failed". Probe
     * once without following, so the message says what actually happened.
     */
    const message = error instanceof Error ? error.message : "unknown";
    let detail = message;
    try {
      const hop = await fetch(`${baseOrigin}${path}`, { redirect: "manual" });
      const location = hop.headers.get("location");
      if (location) {
        const target = new URL(location, `${baseOrigin}${path}`).toString();
        const self = new URL(path, baseOrigin).toString();
        detail =
          target === self
            ? `${hop.status} redirect to itself (${target}) — a redirect loop; a \`from\` rule is matching its own \`to\``
            : `${message} (first hop: ${hop.status} → ${target})`;
      }
    } catch {
      /* The follow-up probe is best-effort; the original message still gets reported. */
    }
    fail(`${path}: request failed — ${detail}`);
    return null;
  }
}

function expect(path: string, response: Fetched | null, status: number): boolean {
  if (!response) return false;
  if (response.status !== status) {
    fail(`${path}: expected ${status}, got ${response.status}`);
    return false;
  }
  return true;
}

/**
 * The URL-preservation rule, and the reason this file exists.
 *
 * A proxy that redirected instead of rewriting would still serve the right content — and would have
 * moved the publication onto a hostname it must never occupy. The test is therefore about the HOST
 * the browser ends on, and about whether a redirect happened at all.
 *
 * It is deliberately NOT "the final URL contains no netlify.app". The gate has to run against a
 * deploy preview of the platform, whose origin IS a netlify.app hostname — an earlier version failed
 * every path for that reason and reported sixteen problems where there were none. What matters is
 * that the host did not CHANGE: whatever origin the request went to is the origin the response came
 * back on. Hostname leakage into the content is a separate rule, checked on the body.
 */
function expectSameOrigin(path: string, response: Fetched | null): void {
  if (!response || direct) return;
  const requested = new URL(`${baseOrigin}${path}`).host;
  let landed: string;
  try {
    landed = new URL(response.finalUrl).host;
  } catch {
    fail(`${path}: the final URL "${response.finalUrl}" is not parseable`);
    return;
  }
  if (landed !== requested) {
    fail(`${path}: the browser would end up on ${landed}, not ${requested} — the proxy redirected instead of rewriting`);
  }
  if (response.redirected) {
    fail(`${path}: the response was reached by a redirect; a rewrite must not move the browser`);
  }
}

async function main(): Promise<void> {
  console.log(`Routing gate — ${baseOrigin}${direct ? " (direct, pre-proxy)" : " (through the proxy)"}\n`);

  /* ---------------------------------------------------------------- pages */

  const home = await get("/blog");
  if (expect("/blog", home, 200) && home) {
    expectSameOrigin("/blog", home);
    if (!/AsteriaStar Journal/i.test(home.body)) fail("/blog: the publication name is not in the HTML");
    if (!/<h1/.test(home.body)) fail("/blog: no <h1> in the initial HTML");
    if (!home.headers.get("content-type")?.includes("text/html")) fail("/blog: content-type is not HTML");
    notes.push(`/blog → ${home.status}, ${(home.body.length / 1024).toFixed(1)} KB of HTML`);
  }

  for (const path of ["/blog/guides", "/blog/authors", "/blog/editorial-policy", "/blog/sourcing-policy", "/blog/corrections"]) {
    const response = await get(path);
    if (expect(path, response, 200) && response) {
      expectSameOrigin(path, response);
      if (!/<h1/.test(response.body)) fail(`${path}: no <h1>`);
    }
  }

  /* ---------------------------------------------------------------- an article, in full */

  const article = await get("/blog/guides/how-we-source-astronomy-and-space-science");
  if (expect("/blog/article", article, 200) && article) {
    expectSameOrigin("/blog/article", article);
    const body = article.body;
    // Everything below must be in the FIRST response. A crawler does not run JavaScript for this.
    const canonical = /rel="canonical" href="([^"]+)"/.exec(body)?.[1];
    if (canonical !== "https://asteriastar.com/blog/guides/how-we-source-astronomy-and-space-science") {
      fail(`article canonical is "${canonical}"`);
    }
    if (!/<h1[^>]*>/.test(body)) fail("article: no <h1>");
    if (!/application\/ld\+json/.test(body)) fail("article: no JSON-LD");
    if (!/"@type":"(Article|NewsArticle)"/.test(body)) fail("article: no Article or NewsArticle markup");
    if (!/datePublished/.test(body)) fail("article: no datePublished in the markup");
    if (!/id="citation-1"/.test(body)) fail("article: references are not in the initial HTML");
    if (!/<h2[^>]*>/.test(body)) fail("article: no section headings in the initial HTML");
    if (body.includes("netlify.app")) fail("article: the HTML contains a netlify.app hostname");
    // Prose must actually be present, not a shell awaiting hydration.
    if (body.length < 20_000) fail(`article: only ${body.length} bytes of HTML — the body may not be server-rendered`);
    notes.push(`article → ${article.status}, ${(body.length / 1024).toFixed(1)} KB, canonical correct`);
  }

  /* ---------------------------------------------------------------- assets */

  if (article) {
    const assets = [...article.body.matchAll(/(?:src|href)="(\/blog\/_next\/static\/[^"]+)"/g)].map((m) => m[1]);
    const unique = [...new Set(assets)];
    if (unique.length === 0) fail("article: no /blog/_next assets referenced — basePath may not be applied");
    const css = unique.filter((a) => a.endsWith(".css"));
    const js = unique.filter((a) => a.endsWith(".js"));
    if (css.length === 0) fail("article: no stylesheet referenced");
    if (js.length === 0) fail("article: no script referenced");

    for (const asset of [...css.slice(0, 1), ...js.slice(0, 2)]) {
      const response = await get(asset);
      if (expect(asset, response, 200) && response) {
        expectSameOrigin(asset, response);
        const type = response.headers.get("content-type") ?? "";
        if (asset.endsWith(".css") && !type.includes("css")) fail(`${asset}: content-type is "${type}"`);
        if (asset.endsWith(".js") && !/javascript|ecmascript/.test(type)) fail(`${asset}: content-type is "${type}"`);
        // The one thing that proves the asset came from the blog project and not from a 200-ing
        // catch-all on the main platform.
        if (response.body.trimStart().startsWith("<!DOCTYPE")) {
          fail(`${asset}: returned HTML instead of an asset — it is being served by the main platform`);
        }
      }
    }
    notes.push(`assets → ${unique.length} referenced, ${css.length} CSS and ${js.length} JS, sampled and served correctly`);
  }

  /* ---------------------------------------------------------------- feeds and sitemap */

  for (const [path, expectedType, mustContain] of [
    ["/blog/rss.xml", "xml", "<rss"],
    ["/blog/atom.xml", "xml", "<feed"],
    ["/blog/feed.json", "json", "jsonfeed.org"],
    ["/blog/latest.json", "json", '"items"'],
    ["/blog/search-index.json", "json", '"documents"'],
    ["/blog/sitemap.xml", "xml", "<urlset"],
  ] as [string, string, string][]) {
    const response = await get(path);
    if (!expect(path, response, 200) || !response) continue;
    expectSameOrigin(path, response);
    const type = response.headers.get("content-type") ?? "";
    if (!type.includes(expectedType)) fail(`${path}: content-type is "${type}", expected ${expectedType}`);
    if (!response.body.includes(mustContain)) fail(`${path}: body does not contain ${mustContain}`);
    if (response.body.includes("netlify.app")) fail(`${path}: contains a netlify.app hostname`);
    if (!response.body.includes("https://asteriastar.com/blog")) fail(`${path}: contains no production URL`);
  }

  /* ---------------------------------------------------------------- 404 is a real 404 */

  const missing = await get("/blog/this-article-does-not-exist");
  if (missing) {
    if (missing.status !== 404) {
      fail(`/blog/<nonexistent>: returned ${missing.status}, not 404 — a soft 404 is indexed as a real page`);
    }
    // And it must be THIS application's 404, not the main platform's catch-all.
    if (missing.status === 404 && !/No such article/i.test(missing.body)) {
      fail("/blog/<nonexistent>: 404 was served by something other than the publication");
    }
  }
  const missingSection = await get("/blog/nonexistent-section");
  if (missingSection && missingSection.status !== 404) {
    fail(`/blog/nonexistent-section: returned ${missingSection.status}, not 404`);
  }

  /* ---------------------------------------------------------------- the main platform is untouched */

  if (!direct) {
    for (const [path, expected] of [["/", 200], ["/sitemap.xml", 200], ["/robots.txt", 200]] as [string, number][]) {
      const response = await get(path);
      if (!expect(path, response, expected) || !response) continue;

      /*
       * That the homepage is still the PLATFORM's is checked on its identity, not on whether the
       * publication's name appears anywhere in it. An earlier version searched the body for
       * "AsteriaStar Journal" and failed the moment a navigation entry mentioned the publication —
       * which is exactly what a correct integration looks like. A title and a canonical are what
       * actually distinguish one application's page from another's.
       */
      if (path === "/") {
        const title = /<title>([^<]*)<\/title>/.exec(response.body)?.[1] ?? "";
        if (/Journal/i.test(title)) fail(`/: the homepage title is "${title}" — the blog project is serving the platform's root`);
        const canonical = /rel="canonical" href="([^"]+)"/.exec(response.body)?.[1] ?? "";
        if (canonical.includes("/blog")) fail(`/: the homepage canonical is "${canonical}"`);
        if (response.body.length < 50_000) fail(`/: only ${response.body.length} bytes — this does not look like the platform homepage`);
      }
      if (path === "/sitemap.xml" && response.body.includes("/blog/")) {
        // The platform's sitemap must not enumerate blog URLs; that coupling is what the split removes.
        fail("/sitemap.xml: the platform sitemap contains blog URLs, which would tie its build to publication");
      }
    }
    const robots = await get("/robots.txt");
    if (robots?.status === 200) {
      if (/Disallow: \/\s*$/m.test(robots.body) && !robots.body.includes("Allow")) {
        fail("/robots.txt: the apex is serving a disallow-all robots.txt — the blog project's is leaking through the proxy");
      }
      if (!robots.body.includes("/blog/sitemap.xml")) {
        notes.push("/robots.txt does not yet name the blog sitemap");
      }
    }
  }

  /* ---------------------------------------------------------------- report */

  for (const note of notes) console.log(`  · ${note}`);

  if (problems.length > 0) {
    console.error(`\n✗ Routing gate failed — ${problems.length} problem(s):`);
    for (const problem of problems) console.error(`  • ${problem}`);
    process.exit(1);
  }
  console.log(`\n✓ Routing gate passed — ${direct ? "the publication serves itself correctly" : "asteriastar.com/blog is served by the blog project, with the URL preserved"}.`);
}

void main();
