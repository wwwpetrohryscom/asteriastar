/**
 * Migration regression gate.
 *
 * The Vercel → Netlify move was safe precisely because the application had no
 * host coupling: no `runtime = "edge"`, no `VERCEL_*`/`NETLIFY_*` reads, no
 * hard-coded deployment hostname, and a canonical identity that comes from one
 * place. Those properties are easy to lose accidentally later, and a hosting
 * regression is invisible until it reaches production.
 *
 * This gate asserts them from the source tree. It is deliberately host-neutral:
 * it would fail the same way for a Netlify-specific dependency as for a Vercel
 * one, so it protects portability rather than one particular vendor.
 *
 * Run via `npm run validate` (and therefore in every build).
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dirname, "..", "..");
const SRC = join(ROOT, "src");
const SCRIPTS = join(ROOT, "scripts");

const failures: string[] = [];
const notes: string[] = [];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (/\.(ts|tsx|mjs|js)$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

// The migration tooling itself is excluded: it names these env vars, hostnames
// and runtimes on purpose (that is what it checks for), so scanning it would
// make the gate fail on its own assertions.
const MIGRATION_TOOLING = join(SCRIPTS, "netlify");
const files = [...walk(SRC), ...walk(SCRIPTS)].filter((f) => !f.startsWith(MIGRATION_TOOLING));
const read = new Map(files.map((f) => [f, readFileSync(f, "utf-8")]));
const rel = (f: string) => relative(ROOT, f);

// ---------------------------------------------------------------------------
// 1. No platform-specific runtime declarations.
// ---------------------------------------------------------------------------
// The Node runtime is the only one whose semantics are identical across hosts.
// An `edge` runtime is where a hosting move silently changes behaviour: different
// globals, different module resolution, and — on Netlify with Next 16 — an Edge
// bundling step that rejects CommonJS dependencies outright.
for (const [f, src] of read) {
  const m = src.match(/export\s+const\s+runtime\s*=\s*["']([^"']+)["']/);
  if (m && m[1] !== "nodejs") {
    failures.push(`${rel(f)} declares runtime "${m[1]}". Only "nodejs" is portable across hosts.`);
  }
}

// ---------------------------------------------------------------------------
// 2. No host-provided environment variables drive application behaviour.
// ---------------------------------------------------------------------------
// The site origin must come from NEXT_PUBLIC_SITE_URL alone. Reading a host's
// own deployment-URL variable is how a preview deployment starts emitting
// canonical URLs for a hostname that is not the site's identity.
const HOST_ENV = /process\.env\.(VERCEL[A-Z0-9_]*|NETLIFY[A-Z0-9_]*|DEPLOY_PRIME_URL|DEPLOY_URL|URL|CONTEXT|CF_PAGES[A-Z0-9_]*)\b/g;
for (const [f, src] of read) {
  for (const m of src.matchAll(HOST_ENV)) {
    failures.push(`${rel(f)} reads host-provided env "${m[1]}". Site identity must come from NEXT_PUBLIC_SITE_URL only.`);
  }
}

// ---------------------------------------------------------------------------
// 3. No deployment hostname is hard-coded.
// ---------------------------------------------------------------------------
// `webmasterid-ingest-api.vercel.app` is exempt: it is the third-party
// WebmasterID analytics ingest endpoint, i.e. someone else's infrastructure that
// merely happens to be hosted on Vercel. Rewriting it because it contains the
// word "vercel" would break analytics.
const ALLOWED_THIRD_PARTY = new Set(["webmasterid-ingest-api.vercel.app"]);
const DEPLOY_HOST = /\b([a-z0-9][a-z0-9-]*\.(?:vercel\.app|netlify\.app|pages\.dev))\b/g;
for (const [f, src] of read) {
  for (const m of src.matchAll(DEPLOY_HOST)) {
    if (!ALLOWED_THIRD_PARTY.has(m[1])) {
      failures.push(`${rel(f)} hard-codes deployment host "${m[1]}".`);
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Exactly one source of truth for the site origin.
// ---------------------------------------------------------------------------
const siteTs = read.get(join(SRC, "lib", "site.ts"));
if (!siteTs) {
  failures.push("src/lib/site.ts is missing — the single source of truth for SITE_URL.");
} else {
  if (!siteTs.includes("process.env.NEXT_PUBLIC_SITE_URL")) {
    failures.push("src/lib/site.ts no longer reads NEXT_PUBLIC_SITE_URL.");
  }
  if (!siteTs.includes('"https://asteriastar.com"')) {
    failures.push("src/lib/site.ts no longer falls back to https://asteriastar.com — canonical identity would change.");
  }
}
// Nothing else may read NEXT_PUBLIC_SITE_URL out of the environment directly:
// scripts/indexnow-submit.ts is exempt because it runs standalone in CI, outside
// the Next module graph, and so cannot import from src/lib/site.ts.
const SITE_URL_EXEMPT = new Set(["scripts/indexnow-submit.ts", "src/lib/site.ts"]);
for (const [f, src] of read) {
  if (src.includes("process.env.NEXT_PUBLIC_SITE_URL") && !SITE_URL_EXEMPT.has(rel(f))) {
    failures.push(`${rel(f)} reads NEXT_PUBLIC_SITE_URL directly; import SITE_URL from "@/lib/site" instead.`);
  }
}

// ---------------------------------------------------------------------------
// 5. IndexNow stays production-only and host-independent.
// ---------------------------------------------------------------------------
const indexnowLib = read.get(join(SRC, "lib", "indexnow.ts"));
if (!indexnowLib) {
  failures.push("src/lib/indexnow.ts is missing.");
} else {
  if (!indexnowLib.includes("process.env.INDEXNOW_KEY")) {
    failures.push("src/lib/indexnow.ts no longer reads INDEXNOW_KEY from the environment.");
  }
  // submitUrls must filter to the site's own host so no preview or alternate
  // hostname can ever be submitted to a search engine.
  if (!/host\(u\)\s*===\s*host\(/.test(indexnowLib) && !indexnowLib.includes("indexNowHost")) {
    failures.push("src/lib/indexnow.ts no longer restricts submissions to the site's own host.");
  }
}
const submitScript = readFileSync(join(SCRIPTS, "indexnow-submit.ts"), "utf-8");
if (!submitScript.includes("host(SITE_URL)")) {
  failures.push("scripts/indexnow-submit.ts no longer scopes submissions to the configured site host.");
}
if (/vercel|netlify/i.test(submitScript)) {
  failures.push("scripts/indexnow-submit.ts references a specific host; it must stay platform-neutral.");
}

// ---------------------------------------------------------------------------
// 6. The Netlify build configuration says what it must.
// ---------------------------------------------------------------------------
const tomlPath = join(ROOT, "netlify.toml");
if (!existsSync(tomlPath)) {
  failures.push("netlify.toml is missing.");
} else {
  const toml = readFileSync(tomlPath, "utf-8");
  // Directive-only view of the file. netlify.toml documents in prose what must
  // NOT be configured, and naming a setting in a comment must never be mistaken
  // for setting it — the first version of this gate failed on its own comment.
  const tomlDirectives0 = toml
    .split("\n")
    .filter((line) => !/^\s*#/.test(line))
    .join("\n");
  // Checked against the directive-only view, never the raw file: netlify.toml
  // explains each of these settings in a comment directly above it, so matching
  // the raw text would let a check pass on its own documentation.
  const require_ = (needle: string, why: string) => {
    if (!tomlDirectives0.includes(needle)) failures.push(`netlify.toml is missing ${needle} — ${why}`);
  };
  require_("@netlify/plugin-nextjs", "the official Next.js Runtime must be the adapter");
  require_('NEXT_PUBLIC_SITE_URL = "https://asteriastar.com"', "production canonical identity must be pinned");
  require_("Strict-Transport-Security", "HSTS parity with the previous production responses");
  require_("Access-Control-Allow-Origin", "Vercel served CORS on all static content; browser clients of the public API depend on it");
  // The cache-key rule is the one whose absence is silently wrong rather than
  // visibly broken: without it every parameterised API response is served from
  // a cache keyed on path alone, so callers get each other's answers.
  require_('Netlify-Vary = "query"', "API responses must be cached per full query string, not per path");
  if (!/for = "\/api\/\*"/.test(tomlDirectives0)) {
    failures.push('netlify.toml has no [[headers]] rule for "/api/*"; the API cache key would ignore query parameters.');
  }
  require_("status = 308", "the apex → www redirect must keep its original status code");
  // A publish directory set by hand fights the adapter.
  if (/^\s*publish\s*=/m.test(tomlDirectives0)) {
    failures.push("netlify.toml sets `publish` by hand; the Next.js Runtime must resolve it.");
  }
  // Preview contexts must never be able to speak as production.
  for (const ctx of ["deploy-preview", "branch-deploy"]) {
    if (!tomlDirectives0.includes(`[context.${ctx}]`)) {
      failures.push(`netlify.toml has no [context.${ctx}] build command; previews would emit production canonicals.`);
    }
    if (!tomlDirectives0.includes(`[[context.${ctx}.headers]]`)) {
      failures.push(`netlify.toml does not send X-Robots-Tag for ${ctx}; previews could be indexed.`);
    }
  }
  if (/^\s*INDEXNOW_KEY\s*=/m.test(tomlDirectives0)) {
    failures.push("netlify.toml assigns INDEXNOW_KEY a value; it must live only as a production-scoped Netlify env var.");
  }
  // Secrets scanning must stay on. The IndexNow key is excluded BY NAME because
  // it is a public verification token the protocol requires us to publish;
  // turning the scanner off entirely would also stop it catching a real
  // credential leak, which is a much worse trade than one named exclusion.
  if (/^\s*SECRETS_SCAN_ENABLED\s*=\s*"false"/m.test(tomlDirectives0)) {
    failures.push("netlify.toml disables secrets scanning wholesale; exclude specific keys or paths instead.");
  }
  if (!tomlDirectives0.includes('SECRETS_SCAN_OMIT_KEYS = "INDEXNOW_KEY"')) {
    failures.push("netlify.toml no longer omits INDEXNOW_KEY from secrets scanning; production builds will fail on the protocol-required key file.");
  }
}

// ---------------------------------------------------------------------------
// 7. No middleware crept in.
// ---------------------------------------------------------------------------
// Middleware runs on Netlify's Edge runtime, which is where Next 16 deployments
// most commonly break. The site has never had any; keep it that way knowingly.
for (const candidate of ["middleware.ts", "middleware.js", "src/middleware.ts", "src/middleware.js"]) {
  if (existsSync(join(ROOT, candidate))) {
    notes.push(`${candidate} exists — it will run on the Edge runtime. Verify its dependencies are ESM-only.`);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
if (failures.length > 0) {
  console.error("✗ Migration portability gate FAILED:\n");
  for (const f of failures) console.error(`  · ${f}`);
  console.error("");
  process.exit(1);
}

console.log(
  `✓ Migration portability gate passed — ${files.length} source files scanned; ` +
    `no edge runtime, no host env reads, no hard-coded deployment host, one site-origin source, ` +
    `IndexNow host-scoped, Netlify config complete.`,
);
for (const n of notes) console.log(`    · ${n}`);
