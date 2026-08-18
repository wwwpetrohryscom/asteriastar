/**
 * Global search regression tests.
 *
 *   npm run search:test
 *
 * Runs representative queries against the GENERATED index — the same bytes the
 * browser downloads — rather than against the in-process registries, so a
 * ranking regression or a broken index both fail here.
 *
 * Each case asserts the expected destination appears within a position budget.
 * Position, not "is somewhere in the results", because a result at rank 40 is
 * a failure from the visitor's point of view.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runSearch } from "@/lib/search/query";
import type { SearchDoc, SearchShard } from "@/lib/search/types";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "public/search-index");

function load(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const shard of ["core", "catalogue"]) {
    const parsed = JSON.parse(readFileSync(join(OUT, `${shard}.json`), "utf8")) as SearchShard;
    docs.push(...parsed.docs);
  }
  return docs;
}

type Case = {
  q: string;
  /** substring the winning URL must contain */ expect: string;
  /** worst acceptable 1-based rank */ within?: number;
  note?: string;
};

/** The queries named in the product brief, plus the typo variants. */
const CASES: Case[] = [
  { q: "Sun", expect: "/sun", within: 3 },
  { q: "Moon", expect: "moon", within: 3 },
  { q: "Mars", expect: "mars", within: 2 },
  { q: "Jupiter", expect: "jupiter", within: 2 },
  { q: "M31", expect: "andromeda", within: 2, note: "Messier identifier" },
  { q: "Messier 31", expect: "andromeda", within: 3 },
  { q: "Andromeda", expect: "andromeda", within: 5 },
  { q: "NGC 224", expect: "andromeda", within: 2, note: "NGC identifier" },
  { q: "Betelgeuse", expect: "betelgeuse", within: 2 },
  { q: "Sirius", expect: "sirius", within: 2 },
  { q: "TRAPPIST-1", expect: "trappist-1", within: 3 },
  { q: "JWST", expect: "webb", within: 4, note: "abbreviation → James Webb" },
  { q: "James Webb", expect: "webb", within: 4 },
  { q: "Hubble", expect: "hubble", within: 4 },
  { q: "67P", expect: "churyumov", within: 3, note: "comet designation → canonical page" },
  { q: "Halley", expect: "halley", within: 3 },
  { q: "Orion", expect: "orion", within: 5 },
  { q: "Pleiades", expect: "pleiades", within: 3 },
  { q: "black hole", expect: "black-hole", within: 6 },
  { q: "moon phase", expect: "moon-phase", within: 4 },
  { q: "escape velocity", expect: "escape-velocity", within: 3 },
  { q: "Gaia DR3", expect: "gaia", within: 6 },
  { q: "Apollo 11", expect: "apollo-11", within: 3 },
  { q: "Voyager 1", expect: "voyager-1", within: 3 },

  /* identifier forms that must normalise to the same thing */
  { q: "m 31", expect: "andromeda", within: 3, note: "spaced identifier" },
  { q: "ngc224", expect: "andromeda", within: 3, note: "unspaced identifier" },
  { q: "HD 128620", expect: "rigil-kentaurus", within: 3, note: "Henry Draper number" },

  /* partial / prefix queries */
  { q: "betel", expect: "betelgeuse", within: 3 },
  { q: "trapp", expect: "trappist", within: 5 },
  { q: "andro", expect: "andromeda", within: 6 },

  /* typo tolerance — must still land the intended page */
  { q: "betelgeuze", expect: "betelgeuse", within: 4, note: "typo" },
  { q: "andromeda galexy", expect: "andromeda", within: 5, note: "typo" },
  { q: "plieades", expect: "pleiades", within: 5, note: "transposition" },
  { q: "jupiter planet", expect: "jupiter", within: 6, note: "extra token" },
  { q: "halleys comet", expect: "halley", within: 6, note: "missing apostrophe" },

  /* unicode punctuation must fold to ASCII */
  { q: "Barnard’s Star", expect: "barnard", within: 5, note: "curly apostrophe" },
  { q: "67P–Churyumov", expect: "churyumov", within: 5, note: "en dash" },
];

function main() {
  const docs = load();
  let failed = 0;
  const rows: string[] = [];

  for (const c of CASES) {
    const outcome = runSearch(docs, c.q, { limit: 50 });
    const budget = c.within ?? 5;
    const at = outcome.hits.findIndex((h) => h.doc.u.toLowerCase().includes(c.expect.toLowerCase()));
    const ok = at >= 0 && at < budget;
    if (!ok) failed++;
    const top = outcome.hits[0];
    rows.push(
      `${ok ? "  ok  " : "  FAIL"} ${c.q.padEnd(22)} → ${
        at >= 0 ? `#${at + 1}` : "not found"
      }`.padEnd(52) +
        `top: ${top ? `${top.doc.t} (${top.doc.u})` : "—"}${c.note ? `   [${c.note}]` : ""}`,
    );
  }

  console.log(`[search:test] ${CASES.length} cases over ${docs.length} documents\n`);
  for (const r of rows) console.log(r);

  if (failed > 0) {
    console.error(`\n✗ ${failed}/${CASES.length} search regression case(s) failed`);
    process.exit(1);
  }
  console.log(`\n✓ all ${CASES.length} search regression cases passed`);
}

main();
