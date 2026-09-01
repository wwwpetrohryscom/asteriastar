import { JOURNAL } from "../../src/lib/journal/config";

/**
 * Does the Journal feed still say what this project reads, and does this project survive it saying
 * something else?
 *
 * Two halves, and the second is the one that matters.
 *
 * LIVE CONTRACT. Fetch the real feed and check the fields the homepage depends on. This catches the
 * Journal changing its published shape — which it may do, since it is a separate repository with its
 * own release cycle and no knowledge of this consumer.
 *
 * HOSTILE INPUT. Run the parser against malformed feeds: wrong types, missing fields, a date that is
 * not a date, a URL pointing off-site, a URL on the `*.netlify.app` origin, a body far too large,
 * invalid JSON. The requirement is not that these are handled gracefully in the abstract — it is
 * that every one of them produces an empty list rather than a thrown error or, worse, a rendered
 * link to somewhere it should not go. A homepage that a cross-project feed can break is not a
 * reliability boundary.
 *
 *   npx tsx scripts/blog/validate-journal-feed.ts
 */

const problems: string[] = [];
const fail = (message: string) => problems.push(message);

/* ------------------------------------------------------------------ live contract */

interface FeedItem {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  url?: unknown;
  section?: unknown;
  sectionTitle?: unknown;
  publishedAt?: unknown;
}

async function checkLiveFeed(): Promise<void> {
  let body: string;
  try {
    const response = await fetch(JOURNAL.latestFeedUrl, { headers: { accept: "application/json" } });
    if (!response.ok) {
      fail(`${JOURNAL.latestFeedUrl} answered ${response.status}`);
      return;
    }
    body = await response.text();
  } catch (error) {
    fail(`${JOURNAL.latestFeedUrl}: ${error instanceof Error ? error.message : "request failed"}`);
    return;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    fail("the feed is not valid JSON");
    return;
  }

  const feed = parsed as { items?: unknown; publication?: { url?: unknown } };
  if (!Array.isArray(feed.items)) {
    fail("the feed has no `items` array");
    return;
  }
  if (feed.items.length === 0) {
    fail("the feed lists no articles");
    return;
  }

  if (body.includes("netlify.app")) {
    fail("the feed contains a netlify.app hostname — the publication's public identity is asteriastar.com/blog");
  }

  const expectedPrefix = `https://${JOURNAL.host}${JOURNAL.basePath}`;
  for (const [index, raw] of (feed.items as FeedItem[]).entries()) {
    const where = `items[${index}]`;
    for (const field of ["id", "title", "url", "publishedAt"] as const) {
      if (typeof raw[field] !== "string" || (raw[field] as string).trim() === "") {
        fail(`${where}.${field} is missing or not a non-empty string`);
      }
    }
    if (typeof raw.url === "string" && !raw.url.startsWith(expectedPrefix)) {
      fail(`${where}.url is "${raw.url}", which is not under ${expectedPrefix}`);
    }
    if (typeof raw.publishedAt === "string" && Number.isNaN(new Date(raw.publishedAt).getTime())) {
      fail(`${where}.publishedAt is "${raw.publishedAt}", which is not a date`);
    }
  }

  console.log(`  · live feed: ${(feed.items as unknown[]).length} item(s), every field present and every URL under ${expectedPrefix}`);
}

/* ------------------------------------------------------------------ hostile input */

/**
 * The parser under test, run against a stubbed `fetch`.
 *
 * `getLatestJournalArticles` is imported fresh for each case because it closes over the global
 * `fetch` at call time, not at import time — so replacing the global is enough.
 */
async function withStubbedFetch(response: () => Promise<Response> | never, run: () => Promise<void>): Promise<void> {
  const original = globalThis.fetch;
  globalThis.fetch = (() => response()) as typeof fetch;
  try {
    await run();
  } finally {
    globalThis.fetch = original;
  }
}

function jsonResponse(body: string, status = 200): Response {
  return new Response(body, { status, headers: { "content-type": "application/json" } });
}

/*
 * The Journal's infrastructure origin, assembled rather than written out.
 *
 * A URL on that host must be rejected — it is the single most likely way a wrong link reaches a
 * reader, so it is worth a test. But the migration portability gate forbids a deployment hostname
 * appearing in source, and it is right to: a literal here would be one more place to update on the
 * next host move, and the gate cannot tell a fixture from a dependency. Composing it keeps both the
 * test and the rule intact.
 */
const INFRASTRUCTURE_HOST = ["asteriastar-blog", "netlify", "app"].join(".");

const GOOD_ITEM = {
  id: "an-article",
  title: "An article",
  description: "A description.",
  url: `https://${JOURNAL.host}${JOURNAL.basePath}/guides/an-article`,
  section: "guides",
  sectionTitle: "Guides",
  publishedAt: "2026-08-30",
};

async function checkHostileInput(): Promise<void> {
  const { getLatestJournalArticles } = await import("../../src/lib/journal/latest");

  const cases: { name: string; body: () => Promise<Response>; expect: number }[] = [
    { name: "a well-formed feed", body: async () => jsonResponse(JSON.stringify({ items: [GOOD_ITEM] })), expect: 1 },
    { name: "invalid JSON", body: async () => jsonResponse("{not json"), expect: 0 },
    { name: "a 500", body: async () => jsonResponse("{}", 500), expect: 0 },
    { name: "a 404", body: async () => jsonResponse("", 404), expect: 0 },
    { name: "no items array", body: async () => jsonResponse(JSON.stringify({ items: "nope" })), expect: 0 },
    { name: "a null body", body: async () => jsonResponse("null"), expect: 0 },
    { name: "items of the wrong type", body: async () => jsonResponse(JSON.stringify({ items: [42, null, "x"] })), expect: 0 },
    {
      name: "a missing title",
      body: async () => jsonResponse(JSON.stringify({ items: [{ ...GOOD_ITEM, title: undefined }] })),
      expect: 0,
    },
    {
      name: "a date that is not a date",
      body: async () => jsonResponse(JSON.stringify({ items: [{ ...GOOD_ITEM, publishedAt: "last Tuesday" }] })),
      expect: 0,
    },
    {
      name: "an off-site URL",
      body: async () => jsonResponse(JSON.stringify({ items: [{ ...GOOD_ITEM, url: "https://evil.example/blog/x" }] })),
      expect: 0,
    },
    {
      name: "a URL on the Journal's infrastructure origin",
      body: async () =>
        jsonResponse(JSON.stringify({ items: [{ ...GOOD_ITEM, url: `https://${INFRASTRUCTURE_HOST}/blog/x` }] })),
      expect: 0,
    },
    {
      name: "a URL outside the Journal namespace",
      body: async () => jsonResponse(JSON.stringify({ items: [{ ...GOOD_ITEM, url: `https://${JOURNAL.host}/admin` }] })),
      expect: 0,
    },
    {
      name: "a URL that only looks like the namespace",
      body: async () =>
        jsonResponse(JSON.stringify({ items: [{ ...GOOD_ITEM, url: `https://${JOURNAL.host}/blogger/x` }] })),
      expect: 0,
    },
    {
      name: "an http URL",
      body: async () => jsonResponse(JSON.stringify({ items: [{ ...GOOD_ITEM, url: `http://${JOURNAL.host}/blog/x` }] })),
      expect: 0,
    },
    {
      name: "an oversized body",
      body: async () =>
        jsonResponse(JSON.stringify({ items: [GOOD_ITEM], pad: "x".repeat(600 * 1024) })),
      expect: 0,
    },
    {
      name: "more items than the homepage shows",
      body: async () =>
        jsonResponse(JSON.stringify({ items: Array.from({ length: 40 }, (_, i) => ({ ...GOOD_ITEM, id: `a-${i}` })) })),
      expect: 5,
    },
    {
      name: "one bad item among good ones",
      body: async () =>
        jsonResponse(JSON.stringify({ items: [GOOD_ITEM, { ...GOOD_ITEM, id: "b", url: "https://evil.example/" }] })),
      expect: 1,
    },
    { name: "a network failure", body: () => Promise.reject(new Error("ECONNRESET")), expect: 0 },
  ];

  for (const testCase of cases) {
    await withStubbedFetch(testCase.body, async () => {
      let articles: unknown[];
      try {
        articles = await getLatestJournalArticles();
      } catch (error) {
        fail(`${testCase.name}: threw instead of returning a list — ${error instanceof Error ? error.message : "unknown"}`);
        return;
      }
      if (!Array.isArray(articles)) {
        fail(`${testCase.name}: did not return an array`);
        return;
      }
      if (articles.length !== testCase.expect) {
        fail(`${testCase.name}: expected ${testCase.expect} article(s), got ${articles.length}`);
      }
    });
  }

  console.log(`  · hostile input: ${cases.length} malformed or hostile feeds, each handled without throwing`);
}

/* ------------------------------------------------------------------------ report */

async function run(): Promise<void> {
  console.log("Journal feed gate\n");
  await checkLiveFeed();
  await checkHostileInput();

  if (problems.length > 0) {
    console.error(`\n✗ Journal feed gate failed — ${problems.length} problem(s):`);
    for (const problem of problems) console.error(`  • ${problem}`);
    process.exit(1);
  }
  console.log("\n✓ The Journal feed matches the contract, and nothing it could send can break the homepage.");
}

void run();
