/**
 * Generate the static global search index.
 *
 *   npm run search:index
 *
 * Emits deterministic JSON shards to `public/search-index/`. Deterministic
 * means byte-identical output for identical input: documents are sorted by a
 * stable key, there is no timestamp in the payload, and the checksum is a pure
 * function of the serialised docs. A rebuild that changes nothing produces no
 * diff, so a stale index is detectable by comparing checksums rather than
 * mtimes.
 *
 * Sharding: the index is split so the overlay can render from a small "core"
 * shard immediately while the long catalogue tail streams in behind it. Both
 * are plain static JSON on the CDN — no API route, no search service.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { buildSearchDocs } from "./search/build-docs";
import {
  checksum,
  SEARCH_INDEX_VERSION,
  shardPath,
  type SearchDoc,
  type SearchManifest,
  type SearchShard,
} from "@/lib/search/types";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "public/search-index");

/**
 * Documents above this priority go in the core shard: hubs, topics, guides,
 * tools, platform pages, and the named objects most likely to be searched by
 * name. The tail shard holds the deep catalogue.
 */
const CORE_PRIORITY = 74;

function stableSort(docs: SearchDoc[]): SearchDoc[] {
  return [...docs].sort((a, b) => {
    if (a.p !== b.p) return b.p - a.p;
    if (a.t !== b.t) return a.t.localeCompare(b.t, "en");
    return a.i.localeCompare(b.i, "en");
  });
}

function writeShard(name: string, docs: SearchDoc[]): SearchShard {
  const sorted = stableSort(docs);
  const body = JSON.stringify(sorted);
  const shard: SearchShard = {
    version: SEARCH_INDEX_VERSION,
    shard: name,
    count: sorted.length,
    checksum: checksum(body),
    docs: sorted,
  };
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(shard));
  return shard;
}

function main() {
  mkdirSync(OUT, { recursive: true });

  const docs = buildSearchDocs();

  const core = docs.filter((d) => d.p >= CORE_PRIORITY);
  const tail = docs.filter((d) => d.p < CORE_PRIORITY);

  const coreShard = writeShard("core", core);
  const tailShard = writeShard("catalogue", tail);

  const groups: Record<string, number> = {};
  for (const d of docs) groups[d.g] = (groups[d.g] ?? 0) + 1;

  const manifest: SearchManifest = {
    version: SEARCH_INDEX_VERSION,
    total: docs.length,
    checksum: checksum(`${coreShard.checksum}:${tailShard.checksum}`),
    shards: [
      { shard: "core", count: coreShard.count, checksum: coreShard.checksum, path: shardPath("core") },
      { shard: "catalogue", count: tailShard.count, checksum: tailShard.checksum, path: shardPath("catalogue") },
    ],
    groups,
  };
  writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  const size = (name: string) => {
    const p = join(OUT, name);
    return existsSync(p) ? readFileSync(p).length : 0;
  };
  const kb = (n: number) => `${(n / 1024).toFixed(0)} KB`;

  console.log(`[search:index] ${docs.length} documents · checksum ${manifest.checksum}`);
  console.log(`[search:index]   core      ${String(coreShard.count).padStart(5)} docs  ${kb(size("core.json"))}`);
  console.log(`[search:index]   catalogue ${String(tailShard.count).padStart(5)} docs  ${kb(size("catalogue.json"))}`);
  console.log(`[search:index] groups: ${Object.entries(groups).map(([g, n]) => `${g}=${n}`).join(" · ")}`);
}

main();
