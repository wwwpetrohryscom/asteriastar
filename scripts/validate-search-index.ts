/**
 * Permanent global-search validators.
 *
 *   npm run search:validate
 *
 * Wired into `npm run validate`. A search result that points at a page which
 * does not exist is the single worst failure this feature can have — it looks
 * fine in the index and 404s for the visitor — so destination integrity is
 * checked against the real sitemap, not assumed.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getAllGraphEntities } from "@/knowledge-graph";
import { buildSearchDocs } from "./search/build-docs";
import { mappedEntityTypes } from "@/lib/search/groups";
import { fold } from "@/lib/search/match";
import {
  checksum,
  SEARCH_GROUPS,
  SEARCH_INDEX_VERSION,
  type SearchDoc,
  type SearchManifest,
  type SearchShard,
} from "@/lib/search/types";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "public/search-index");

const errors: string[] = [];
const notes: string[] = [];
const fail = (msg: string) => errors.push(msg);

async function main() {

/* -------------------------------------------------- generated artefacts */

if (!existsSync(join(OUT, "manifest.json"))) {
  console.error("✗ search index missing — run `npm run search:index`");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(OUT, "manifest.json"), "utf8")) as SearchManifest;
if (manifest.version !== SEARCH_INDEX_VERSION) {
  fail(`manifest version ${manifest.version} != code version ${SEARCH_INDEX_VERSION}`);
}

const docs: SearchDoc[] = [];
for (const entry of manifest.shards) {
  const path = join(OUT, `${entry.shard}.json`);
  if (!existsSync(path)) {
    fail(`manifest lists shard "${entry.shard}" but ${entry.shard}.json is missing`);
    continue;
  }
  const shard = JSON.parse(readFileSync(path, "utf8")) as SearchShard;
  if (shard.count !== shard.docs.length) {
    fail(`shard ${entry.shard}: declared count ${shard.count} != ${shard.docs.length} rows`);
  }
  if (shard.checksum !== entry.checksum) {
    fail(`shard ${entry.shard}: checksum drift between shard file and manifest`);
  }
  if (shard.checksum !== checksum(JSON.stringify(shard.docs))) {
    fail(`shard ${entry.shard}: checksum does not match its own contents`);
  }
  docs.push(...shard.docs);
}

/* ------------------------------------------------------------ staleness */

// The generated index must equal what the current registries produce. This is
// what catches "someone renamed a route and forgot to regenerate".
const fresh = buildSearchDocs();
const freshKey = checksum(JSON.stringify([...fresh].sort((a, b) => a.i.localeCompare(b.i))));
const builtKey = checksum(JSON.stringify([...docs].sort((a, b) => a.i.localeCompare(b.i))));
if (freshKey !== builtKey) {
  fail(
    `generated index is STALE (${docs.length} docs on disk vs ${fresh.length} from the registries) — run \`npm run search:index\``,
  );
}

/* ------------------------------------------------------- per-doc checks */

const seenIds = new Set<string>();
const seenUrls = new Map<string, string>();
const groupSet = new Set<string>(SEARCH_GROUPS);

for (const d of docs) {
  if (seenIds.has(d.i)) fail(`duplicate search id: ${d.i}`);
  seenIds.add(d.i);

  if (!d.t?.trim()) fail(`${d.i}: missing title`);
  if (!d.u?.startsWith("/")) fail(`${d.i}: destination is not a site-relative path: ${JSON.stringify(d.u)}`);
  if (d.u.includes("?") || d.u.includes("#")) fail(`${d.i}: destination carries a query or fragment: ${d.u}`);
  if (d.u.length > 1 && d.u.endsWith("/")) fail(`${d.i}: destination has a trailing slash: ${d.u}`);

  const prior = seenUrls.get(d.u);
  if (prior) fail(`duplicate canonical URL ${d.u} — indexed by both ${prior} and ${d.i}`);
  else seenUrls.set(d.u, d.i);

  if (!groupSet.has(d.g)) fail(`${d.i}: unknown group "${d.g}"`);
  if (typeof d.p !== "number" || d.p < 0 || d.p > 100) fail(`${d.i}: priority out of range: ${d.p}`);

  // A document whose title folds to nothing can never be found.
  if (!fold(d.t)) fail(`${d.i}: title normalises to an empty search token: ${JSON.stringify(d.t)}`);

  for (const alias of d.a ?? []) {
    if (!alias.trim()) fail(`${d.i}: empty alias`);
    if (fold(alias) === fold(d.t)) fail(`${d.i}: alias duplicates the title: ${alias}`);
  }
}

/* --------------------------------------------- destinations must exist */

const { default: sitemap } = await import("../src/app/sitemap");
const live = new Set<string>(
  sitemap().map((r: { url: string }) => {
    const p = new URL(r.url).pathname;
    return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
  }),
);

let broken = 0;
for (const d of docs) {
  if (live.has(d.u)) continue;
  broken++;
  if (broken <= 8) fail(`${d.i}: destination is not a published route — ${d.u}`);
}
if (broken > 8) fail(`…and ${broken - 8} more documents pointing at unpublished routes`);

/* ------------------------------- every entity type must be classified */

const graphTypes = new Set(getAllGraphEntities().map((e) => e.type));
const mapped = new Set(mappedEntityTypes());
const unmapped = [...graphTypes].filter((t) => !mapped.has(t)).sort();
if (unmapped.length) {
  fail(
    `${unmapped.length} entity type(s) have no search group and would fall into "reference": ${unmapped.slice(0, 12).join(", ")}${unmapped.length > 12 ? "…" : ""}`,
  );
}

/* ------------------------------- ambiguity: identical titles need help */

const byFoldedTitle = new Map<string, SearchDoc[]>();
for (const d of docs) {
  const key = fold(d.t);
  const arr = byFoldedTitle.get(key);
  if (arr) arr.push(d);
  else byFoldedTitle.set(key, [d]);
}
let ambiguous = 0;
for (const [title, group] of byFoldedTitle) {
  if (group.length < 2) continue;
  // Colliding titles are fine as long as the rows are distinguishable on
  // screen: the kind label or the description must differ, otherwise the
  // visitor sees N identical rows and cannot tell which to open.
  const distinct = new Set(group.map((d) => `${d.k}|${d.d ?? ""}`));
  if (distinct.size === 1) {
    ambiguous++;
    if (ambiguous <= 5) {
      fail(`ambiguous title "${title}" — ${group.length} indistinguishable rows (${group.map((d) => d.u).slice(0, 3).join(", ")})`);
    }
  }
}
if (ambiguous > 5) fail(`…and ${ambiguous - 5} more ambiguous title groups`);

/* --------------------- the client bundle must stay free of the graph */

const CLIENT_SAFE = ["types.ts", "match.ts", "query.ts", "groups.ts"];
// Match real import/export statements only. A doc comment that NAMES the data
// layer in order to warn about it must not trip its own rule.
const FORBIDDEN =
  /(?:^|\n)\s*(?:import|export)[^;\n]*?["']@\/(knowledge-graph|platform\/data-engine|content\/entries|lib\/routes|lib\/content)/;
for (const file of CLIENT_SAFE) {
  const src = readFileSync(join(ROOT, "src/lib/search", file), "utf8");
  const hit = src.match(FORBIDDEN);
  if (hit) fail(`lib/search/${file} imports "@/${hit[1]}" — this module ships to the browser and must stay data-layer free`);
}
for (const file of ["GlobalSearch.tsx", "SearchExplorer.tsx", "use-search-index.ts", "analytics.ts"]) {
  const path = join(ROOT, "src/components/search", file);
  if (!existsSync(path)) continue;
  const src = readFileSync(path, "utf8");
  const hit = src.match(FORBIDDEN);
  if (hit) fail(`components/search/${file} imports "@/${hit[1]}" — client search must not pull in the data layer`);
}

/* ---------------------------------------------------------- reporting */

const groupTotals = Object.entries(manifest.groups)
  .sort((a, b) => b[1] - a[1])
  .map(([g, n]) => `${g}=${n}`)
  .join(" · ");
notes.push(`${docs.length} documents · ${manifest.shards.length} shards · checksum ${manifest.checksum}`);
notes.push(`groups: ${groupTotals}`);
notes.push(`${docs.filter((d) => d.a?.length).length} documents carry aliases or identifiers`);
notes.push(`${docs.filter((d) => d.c === 1).length} documents are labelled cultural/interpretive`);

if (errors.length) {
  console.error(`\n✗ Search index validation failed — ${errors.length} issue${errors.length === 1 ? "" : "s"}:\n`);
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}

console.log(`\n✓ Search index valid — every destination is a published route`);
for (const n of notes) console.log(`    ${n}`);
}

main();
