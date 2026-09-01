/**
 * Wire format for the generated global search index.
 *
 * Keys are single letters because every one of them is repeated across ~9,000
 * documents and each byte is transferred to the client. The shape is
 * deliberately minimal: nothing here is a scientific claim, only enough to
 * rank a row, render it, and navigate to the real page that owns the data.
 *
 * CLIENT-SAFE: this module and everything under `lib/search/` except
 * `build.ts` must never import `@/knowledge-graph`, `@/platform/data-engine`
 * or `@/lib/routes`. Those pull the multi-megabyte data layer into the browser
 * bundle. `scripts/validate-search-index.ts` enforces this.
 */

/**
 * Result groups shown in the UI, in display order.
 *
 * `journal` holds rows from AsteriaStar Journal. They are not in the generated shards — the Journal
 * is a separate deployment and its index is fetched at runtime — so this group is empty until that
 * request lands, and stays empty if it fails. Both the panel and the results page filter to groups
 * that actually have rows, so an empty group renders nothing rather than an empty heading.
 */
export const SEARCH_GROUPS = [
  "solar-system",
  "stars-exoplanets",
  "deep-sky",
  "missions",
  "observatories",
  "science",
  "guides",
  "journal",
  "tools",
  "data",
  "history",
  "reference",
] as const;

export type SearchGroupId = (typeof SEARCH_GROUPS)[number];

export const SEARCH_GROUP_LABELS: Record<SearchGroupId, string> = {
  "solar-system": "Solar System",
  "stars-exoplanets": "Stars & Exoplanets",
  "deep-sky": "Deep Sky",
  missions: "Missions & Spacecraft",
  observatories: "Telescopes & Observatories",
  science: "Science & Methods",
  guides: "Guides & Learning",
  journal: "AsteriaStar Journal",
  tools: "Tools & Calculators",
  data: "Data & API",
  history: "History & Culture",
  reference: "Reference",
};

/**
 * One searchable document.
 *
 * `p` (priority) is a build-time editorial weight, not a popularity metric —
 * there is no traffic data on this platform and inventing one would be
 * fabrication. It encodes only "how canonical is this page for its own name":
 * a hub outranks a catalogue leaf of the same name, and a named object
 * outranks an anonymous catalogue row.
 */
export interface SearchDoc {
  /** stable search id, unique across the whole index */ i: string;
  /** title */ t: string;
  /** canonical URL (site-relative) */ u: string;
  /** human-readable kind, e.g. "Star", "Guide" */ k: string;
  /** display group */ g: SearchGroupId;
  /** short description, trimmed at build time */ d?: string;
  /** aliases and catalogue identifiers (M31, HD 48915, 67P, JWST…) */ a?: string[];
  /** editorial priority, 0–100 */ p: number;
  /** 1 when the page is cultural/interpretive rather than scientific */ c?: 1;
}

export interface SearchShard {
  /** index format version — bumped when the shape changes */ version: number;
  /** shard name, e.g. "core" */ shard: string;
  /** number of docs in this shard */ count: number;
  /** FNV-1a checksum of the serialised docs, for staleness detection */ checksum: string;
  docs: SearchDoc[];
}

export interface SearchManifest {
  version: number;
  /** total docs across every shard */ total: number;
  /** checksum over all shard checksums */ checksum: string;
  shards: { shard: string; count: number; checksum: string; path: string }[];
  /** per-group totals, for the full results page */ groups: Record<string, number>;
}

export const SEARCH_INDEX_VERSION = 1;
export const SEARCH_INDEX_DIR = "/search-index";
export const SEARCH_MANIFEST_PATH = `${SEARCH_INDEX_DIR}/manifest.json`;

export function shardPath(shard: string): string {
  return `${SEARCH_INDEX_DIR}/${shard}.json`;
}

/**
 * FNV-1a, 32-bit, hex. Deterministic and dependency-free — the same input
 * always produces the same checksum, so a rebuild that changes nothing
 * produces a byte-identical index.
 */
export function checksum(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
