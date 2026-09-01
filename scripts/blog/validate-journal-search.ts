import { fetchJournalSearchDocs } from "../../src/lib/journal/search";
import { JOURNAL } from "../../src/lib/journal/config";
import { runSearch } from "../../src/lib/search/query";
import type { SearchDoc } from "../../src/lib/search/types";

/**
 * Does global search actually find Journal articles?
 *
 * The integration contract existed for a while before anything consumed it. A published index and a
 * documented shape are not an integration, and "the contract exists" is exactly the assumption this
 * gate refuses to make: it fetches the live index, ranks a real article title through the platform's
 * own ranking function, and requires the article to come back.
 *
 * It also checks the failure direction, which matters more. The Journal is a separate deployment and
 * will sometimes be unavailable. When it is, platform search must be unaffected — not degraded, not
 * erroring, simply without Journal rows.
 *
 *   npx tsx scripts/blog/validate-journal-search.ts
 */

const problems: string[] = [];
const fail = (message: string) => problems.push(message);

/** A few platform documents, so ranking has something to rank Journal rows against. */
const PLATFORM_DOCS: SearchDoc[] = [
  { i: "star:sirius", t: "Sirius", u: "/stars/sirius", k: "Star", g: "stars-exoplanets", p: 96 },
  { i: "hub:exoplanets", t: "Exoplanets", u: "/exoplanets", k: "Hub", g: "stars-exoplanets", p: 100 },
  { i: "hub:data", t: "Data Portal", u: "/data", k: "Hub", g: "data", p: 100 },
];

async function run(): Promise<void> {
  console.log("Journal search gate\n");

  const docs = await fetchJournalSearchDocs();

  if (docs.length === 0) {
    fail(`${JOURNAL.searchIndexUrl} produced no searchable documents`);
  } else {
    console.log(`  · index: ${docs.length} Journal document(s) mapped into the platform's shape`);
  }

  for (const doc of docs) {
    if (!doc.i.startsWith("journal:")) fail(`${doc.i}: a Journal document must carry the journal: id prefix`);
    if (doc.g !== "journal") fail(`${doc.i}: group is "${doc.g}", expected "journal"`);
    if (!doc.u.startsWith(`${JOURNAL.basePath}/`) && doc.u !== JOURNAL.basePath) {
      fail(`${doc.i}: URL "${doc.u}" is outside the Journal's namespace`);
    }
    if (doc.u.includes("netlify.app")) fail(`${doc.i}: URL carries the infrastructure hostname`);
    if (!doc.t.trim()) fail(`${doc.i}: empty title`);
  }

  /*
   * The real test: search for an article by its own title and require it back.
   *
   * The title comes from the live index rather than being hard-coded, so this keeps working as the
   * corpus changes and cannot pass by matching something that is no longer published.
   */
  if (docs.length > 0) {
    const target = docs[0];
    const merged = [...PLATFORM_DOCS, ...docs];
    const flat = runSearch(merged, target.t).hits;
    const found = flat.find((hit) => hit.doc.i === target.i);

    if (!found) {
      fail(`searching "${target.t}" through the platform's ranking did not return the article`);
    } else {
      const rank = flat.indexOf(found) + 1;
      console.log(`  · ranking: "${target.t}" → found at position ${rank} of ${flat.length}, linking to ${found.doc.u}`);
    }

    /*
     * A Journal article must not outrank the platform page that IS its subject. Editorial writing
     * about a thing is a useful second answer, never a better first one.
     */
    const subject = runSearch(merged, "Exoplanets").hits;
    const hub = subject.findIndex((r) => r.doc.i === "hub:exoplanets");
    const firstJournal = subject.findIndex((r) => r.doc.i.startsWith("journal:"));
    if (hub !== -1 && firstJournal !== -1 && firstJournal < hub) {
      fail(`a Journal article outranks the Exoplanets hub for the query "Exoplanets"`);
    }
  }

  /* -------------------------------------------------- the Journal being unavailable */

  const original = globalThis.fetch;
  const cases: { name: string; stub: typeof fetch }[] = [
    { name: "a 503", stub: (async () => new Response("", { status: 503 })) as typeof fetch },
    { name: "a network failure", stub: (() => Promise.reject(new Error("ECONNREFUSED"))) as typeof fetch },
    { name: "invalid JSON", stub: (async () => new Response("{oops")) as typeof fetch },
    { name: "the wrong shape", stub: (async () => new Response(JSON.stringify({ documents: "no" }))) as typeof fetch },
  ];

  for (const testCase of cases) {
    globalThis.fetch = testCase.stub;
    try {
      const empty = await fetchJournalSearchDocs();
      if (!Array.isArray(empty) || empty.length !== 0) {
        fail(`${testCase.name}: expected no documents, got ${Array.isArray(empty) ? empty.length : "a non-array"}`);
      }
      // Platform search must still answer normally with no Journal rows present.
      const still = runSearch([...PLATFORM_DOCS, ...empty], "Sirius").hits;
      if (!still.some((r) => r.doc.i === "star:sirius")) {
        fail(`${testCase.name}: platform search stopped answering when the Journal was unavailable`);
      }
    } catch (error) {
      fail(`${testCase.name}: threw instead of degrading — ${error instanceof Error ? error.message : "unknown"}`);
    } finally {
      globalThis.fetch = original;
    }
  }
  console.log(`  · unavailable Journal: ${cases.length} failure modes, platform search unaffected in each`);

  if (problems.length > 0) {
    console.error(`\n✗ Journal search gate failed — ${problems.length} problem(s):`);
    for (const problem of problems) console.error(`  • ${problem}`);
    process.exit(1);
  }
  console.log("\n✓ Global search finds Journal articles, and keeps working when the Journal does not.");
}

void run();
