import { loadProduct } from "../../src/platform/live-providers/client";
import { clearCache, peek } from "../../src/platform/live-providers/cache";
import { clearHealth, getHealth } from "../../src/platform/live-providers/health";
import { checkProviderUrl } from "../../src/platform/live-providers/fetch";
import type { ParseResult } from "../../src/platform/live-providers/client";

/**
 * PERMANENT GATE — failure-mode tests for the live-provider runtime.
 *
 * Every one of these is a way a real provider has failed for somebody, and every one of them must
 * produce an honest empty or honestly-stale answer rather than a fabricated one or an exception.
 * The network is stubbed, so this is deterministic, offline, and safe to run in CI.
 *
 * The rule being tested throughout: a failure may cost the reader a value; it may never give them
 * a wrong one, and it may never take down the page.
 */

const failures: string[] = [];
const passed: string[] = [];

function check(name: string, condition: boolean, detail: string): void {
  if (condition) passed.push(name);
  else failures.push(`${name}: ${detail}`);
}

/** The real fetch, restored after every case. */
const realFetch = globalThis.fetch;

type Stub = () => Promise<Response> | Response;
function withStub(stub: Stub): void {
  globalThis.fetch = (() => Promise.resolve(stub())) as typeof fetch;
}
function restore(): void {
  globalThis.fetch = realFetch;
}

/** The product used throughout: a real registered SWPC product, so the registry path is exercised. */
const PRODUCT = "swpc:solar-wind-speed";

interface Reading { speedKmS: number; observedAt: string }

const parse = (raw: unknown): ParseResult<Reading> => {
  const rows = Array.isArray(raw) ? raw : [];
  const first = rows[0] as Record<string, unknown> | undefined;
  const speed = typeof first?.proton_speed === "number" ? first.proton_speed : undefined;
  const at = typeof first?.time_tag === "string" ? first.time_tag : undefined;
  if (speed === undefined || !at) return { ok: false, problem: "missing proton_speed or time_tag" };
  return { ok: true, value: { speedKmS: speed, observedAt: at }, observedAt: new Date(at).toISOString() };
};

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  });
}

async function main(): Promise<void> {
  /* ---------------------------------------------------------- 1. provider unreachable */
  clearCache();
  clearHealth();
  withStub(() => {
    throw new TypeError("fetch failed: getaddrinfo ENOTFOUND");
  });
  {
    const env = await loadProduct<Reading>(PRODUCT, parse);
    restore();
    check("network failure returns no data", env.data === undefined, `returned ${JSON.stringify(env.data)}`);
    check("network failure is reported as unavailable", env.status === "unavailable", `status was "${env.status}"`);
    check("network failure carries a reason", Boolean(env.error), "no error message");
    check("network failure is not marked stale", env.stale === false, "marked stale with no cached value behind it");
    check("network failure is recorded in health", (getHealth(PRODUCT)?.consecutiveFailures ?? 0) === 1, "health did not record the failure");
  }

  /* ------------------------------------------------------------- 2. provider 500s */
  clearCache();
  clearHealth();
  withStub(() => new Response("upstream is having a bad day", { status: 503 }));
  {
    const env = await loadProduct<Reading>(PRODUCT, parse);
    restore();
    check("HTTP 503 returns no data", env.data === undefined, "returned data from an error response");
    check("HTTP 503 is reported as unavailable", env.status === "unavailable", `status was "${env.status}"`);
    check("HTTP 503 names the status code", (env.error ?? "").includes("503"), `error was "${env.error}"`);
  }

  /* ------------------------------------------- 3. provider answers with an HTML error page */
  clearCache();
  clearHealth();
  withStub(() => new Response("<html><body>Service Unavailable</body></html>", { status: 200, headers: { "content-type": "text/html" } }));
  {
    const env = await loadProduct<Reading>(PRODUCT, parse);
    restore();
    check("HTML answer is refused", env.data === undefined, "parsed an HTML page as data");
    check("HTML answer is a provider error", env.status === "provider_error", `status was "${env.status}"`);
    check("HTML answer never reaches a parser", (env.error ?? "").includes("expected JSON"), `error was "${env.error}"`);
  }

  /* -------------------------------------------------------- 4. provider answers malformed JSON */
  clearCache();
  clearHealth();
  withStub(() => new Response("{ this is not json", { status: 200, headers: { "content-type": "application/json" } }));
  {
    const env = await loadProduct<Reading>(PRODUCT, parse);
    restore();
    check("malformed JSON returns no data", env.data === undefined, "returned data from unparseable JSON");
    check("malformed JSON is a provider error", env.status === "provider_error", `status was "${env.status}"`);
  }

  /* --------------------------------------------------------------- 5. the schema changed */
  clearCache();
  clearHealth();
  withStub(() => jsonResponse([{ wind_speed_kilometres_per_second: 430, timestamp: "2026-08-29T20:00:00Z" }]));
  {
    const env = await loadProduct<Reading>(PRODUCT, parse);
    restore();
    check("a renamed field returns no data", env.data === undefined, "coerced an unrecognised shape into a value");
    check("a renamed field is a provider error", env.status === "provider_error", `status was "${env.status}"`);
    check("a schema change is recorded as such", getHealth(PRODUCT)?.schemaState === "changed", `schemaState was "${getHealth(PRODUCT)?.schemaState}"`);
  }

  /* --------------------------------------------------------------- 6. an enormous response */
  clearCache();
  clearHealth();
  withStub(() => jsonResponse([{ proton_speed: 430, time_tag: "2026-08-29T20:00:00Z", padding: "x".repeat(200_000) }]));
  {
    const env = await loadProduct<Reading>(PRODUCT, parse);
    restore();
    // swpc:solar-wind-speed declares a 16 KB ceiling; 200 KB must be refused, not buffered.
    check("an oversized response is refused", env.data === undefined, "buffered a response past its declared ceiling");
    check("an oversized response is reported", (env.error ?? "").includes("ceiling"), `error was "${env.error}"`);
  }

  /* -------------------------------------- 7. a value whose timestamp is impossibly in the future */
  clearCache();
  clearHealth();
  {
    const future = new Date(Date.now() + 3 * 3600 * 1000).toISOString();
    withStub(() => jsonResponse([{ proton_speed: 430, time_tag: future }]));
    const env = await loadProduct<Reading>(PRODUCT, parse);
    restore();
    check("a far-future timestamp is not treated as fresh", env.status !== "live" && env.status !== "recent", `status was "${env.status}"`);
    check("a far-future timestamp is a provider error", env.status === "provider_error", `status was "${env.status}"`);
  }

  /* ------------------------------ 8. the stale-cache fallback: a real past value, honestly aged */
  clearCache();
  clearHealth();
  {
    const observedAt = new Date(Date.now() - 120_000).toISOString();
    withStub(() => jsonResponse([{ proton_speed: 512, time_tag: observedAt }]));
    const first = await loadProduct<Reading>(PRODUCT, parse);
    restore();
    check("a good response is served", first.data?.speedKmS === 512, `got ${JSON.stringify(first.data)}`);
    check("a good response is live", first.status === "live", `status was "${first.status}"`);
    check("a good response is cached", peek(PRODUCT) !== undefined, "nothing was cached");

    // Age the cache past its TTL so the next call must refresh — then make that refresh fail.
    const entry = peek<{ value: Reading }>(PRODUCT);
    if (entry) entry.storedAtMs -= 10 * 60 * 1000;

    withStub(() => {
      throw new TypeError("fetch failed");
    });
    const second = await loadProduct<Reading>(PRODUCT, parse);
    restore();

    check("the fallback returns the real cached value", second.data?.speedKmS === 512, `got ${JSON.stringify(second.data)}`);
    check("the fallback is marked stale", second.status === "stale" && second.stale === true, `status was "${second.status}", stale=${second.stale}`);
    check("the fallback says it came from cache", second.servedFromCache === true, "servedFromCache was not set");
    check("the fallback keeps the original fetch time", second.fetchedAt === first.fetchedAt, "the cached value's fetch time was restamped as if it were new");
    check("the fallback explains itself", (second.provenance ?? "").includes("last value that was successfully fetched"), "no explanation of why the value is stale");
    check("the fallback records the failure", (getHealth(PRODUCT)?.consecutiveFailures ?? 0) > 0, "the failed refresh was not recorded");
  }

  /* --------------------------------------- 9. a failure never substitutes another provider's value */
  clearCache();
  clearHealth();
  withStub(() => {
    throw new TypeError("fetch failed");
  });
  {
    const env = await loadProduct<Reading>(PRODUCT, parse);
    restore();
    check("a failed provider is still named", env.provider.includes("NOAA"), `provider was "${env.provider}"`);
    check("a failed provider keeps its own source URL", env.sourceUrl.includes("services.swpc.noaa.gov"), `sourceUrl was "${env.sourceUrl}"`);
    check("a failed provider substitutes nothing", env.data === undefined, "a value appeared from somewhere");
  }

  /* ----------------------------------------------------- 10. the request guard refuses unsafe URLs */
  {
    const cases: [string, string][] = [
      ["http://services.swpc.noaa.gov/x.json", "plain HTTP"],
      ["https://evil.example.com/x.json", "a host not on the allowlist"],
      ["https://user:pass@services.swpc.noaa.gov/x.json", "credentials in the URL"],
      ["https://services.swpc.noaa.gov:8080/x.json", "a non-standard port"],
      ["file:///etc/passwd", "a file URL"],
      ["not a url at all", "a malformed URL"],
      ["https://services.swpc.noaa.gov.evil.example.com/x.json", "a lookalike host"],
    ];
    for (const [url, why] of cases) {
      const result = checkProviderUrl(url);
      check(`the guard refuses ${why}`, result.ok === false, `it accepted ${url}`);
    }
    const good = checkProviderUrl("https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json");
    check("the guard accepts a real product URL", good.ok === true, "it refused a legitimate URL");
  }

  /* ---------------------------------------------------------------------------------- report */
  restore();
  if (failures.length > 0) {
    console.error(`\n✗ Failure-mode tests failed — ${failures.length} of ${failures.length + passed.length}:`);
    for (const f of failures) console.error(`  • ${f}`);
    process.exit(1);
  }
  console.log(`✓ Failure modes handled — ${passed.length} cases: provider down, HTTP error, HTML answer, malformed JSON, schema change, oversized response, future timestamp, stale-cache fallback, no substitution, and seven unsafe URLs refused.`);
}

void main();
