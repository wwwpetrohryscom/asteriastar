/**
 * The migration parity corpus: one representative URL per functional class on
 * the site, plus the protocol-sensitive files that must survive a hosting move
 * byte-for-byte.
 *
 * This list is the contract the Vercel → Netlify migration is measured against.
 * `kind` drives which checks the parity runner applies (see parity-check.ts):
 *
 *  - "page"     HTML: status, title, canonical, robots meta, h1, JSON-LD @types
 *  - "json"     JSON API: status, content-type, top-level response shape
 *  - "text"     protocol file (robots/llms/IndexNow key): status + exact body
 *  - "xml"      sitemap: status, content-type, <loc> count and set
 *  - "asset"    binary/static asset: status, content-type, byte length
 *  - "redirect" expects a 3xx to a specific location (no redirect following)
 */
export interface ParityTarget {
  /** Path (or absolute URL, for host-policy checks) to request. */
  path: string;
  kind: "page" | "json" | "text" | "xml" | "asset" | "redirect";
  /** Functional class — every class must be represented before cutover. */
  group: string;
  /** For kind "redirect": the exact Location we require. */
  expectLocation?: string;
  /** Expected HTTP status when it is not 200 (e.g. a deliberate 400/404). */
  expectStatus?: number;
}

export const PARITY_CORPUS: ParityTarget[] = [
  // ---- Core pages -------------------------------------------------------
  { path: "/", kind: "page", group: "home" },
  { path: "/explore", kind: "page", group: "hub" },
  { path: "/discover", kind: "page", group: "hub" },
  { path: "/entity-index", kind: "page", group: "index" },

  // ---- Entity families (one per knowledge domain) -----------------------
  { path: "/astronomy/planets/jupiter", kind: "page", group: "planet" },
  { path: "/explore/entity/moon/europa", kind: "page", group: "moon" },
  { path: "/astronomy/stars/sirius", kind: "page", group: "star" },
  { path: "/exoplanets/kepler-452-b", kind: "page", group: "exoplanet" },
  { path: "/constellations/orion", kind: "page", group: "constellation" },
  { path: "/explore/entity/galaxy/andromeda-galaxy", kind: "page", group: "galaxy" },
  { path: "/explore/entity/nebula/orion-nebula", kind: "page", group: "nebula" },
  { path: "/astronomy/space-missions/voyager-1", kind: "page", group: "mission" },
  { path: "/explore/entity/launch_vehicle/falcon-9", kind: "page", group: "rocket" },
  { path: "/observatories/very-large-telescope", kind: "page", group: "observatory" },
  { path: "/astronomy/dwarf-planets/ceres", kind: "page", group: "asteroid" },
  { path: "/solar-system/halleys-comet", kind: "page", group: "comet" },

  // ---- Editorial / encyclopedia (the [section]/[category]/[entry] tree) --
  { path: "/astronomy", kind: "page", group: "section" },
  { path: "/astronomy/stars", kind: "page", group: "category" },
  { path: "/encyclopedia/timeline", kind: "page", group: "entry" },

  // ---- Tools and dynamic (server-rendered) pages ------------------------
  { path: "/calculators", kind: "page", group: "calculator" },
  { path: "/sky-guide/night-sky-tonight", kind: "page", group: "live-sky-page" },
  { path: "/developers/api", kind: "page", group: "developer" },
  { path: "/datasets", kind: "page", group: "dataset" },
  { path: "/images", kind: "page", group: "gallery" },
  { path: "/authority/data-health", kind: "page", group: "data-health-page" },
  { path: "/authority/data-health/sources", kind: "page", group: "data-health-page" },
  { path: "/assistant/entity", kind: "page", group: "assistant-page" },

  // ---- Open Data API (v0) ----------------------------------------------
  { path: "/api/v0/openapi.json", kind: "json", group: "openapi" },
  { path: "/api/v0/entities?limit=3", kind: "json", group: "api-entities" },
  { path: "/api/v0/search?q=jupiter&limit=3", kind: "json", group: "api-search" },
  { path: "/api/v0/sources", kind: "json", group: "api-sources" },
  { path: "/api/v0/datasets", kind: "json", group: "api-datasets" },
  { path: "/api/v0/citations?limit=3", kind: "json", group: "api-citations" },
  { path: "/api/v0/relationships?limit=3", kind: "json", group: "api-relationships" },
  { path: "/api/v0/traversal?start=planet:earth&depth=1", kind: "json", group: "api-traversal" },
  { path: "/api/v0/images?limit=3", kind: "json", group: "api-images" },
  { path: "/api/v0/review-states", kind: "json", group: "api-review-states" },
  { path: "/api/v0/live/status", kind: "json", group: "api-live-status" },
  { path: "/api/v0/contribution-types", kind: "json", group: "api-contrib" },
  { path: "/api/v0/contribution-guidelines", kind: "json", group: "api-contrib" },

  // ---- Provenance / authority ------------------------------------------
  { path: "/api/v0/authority/data-health", kind: "json", group: "api-data-health" },
  { path: "/api/v0/authority/mission-primary", kind: "json", group: "api-mission-primary" },

  // ---- Live Sky (computed, time-dependent) ------------------------------
  { path: "/api/v0/live-sky/providers", kind: "json", group: "api-live-sky" },
  { path: "/api/v0/live-sky/moon", kind: "json", group: "api-live-sky" },
  { path: "/api/v0/live-sky/sun?latitude=50.08&longitude=14.44&date=2026-08-19", kind: "json", group: "api-live-sky" },
  { path: "/api/v0/live-sky/moon?latitude=50.08&longitude=14.44&date=2026-08-19", kind: "json", group: "api-live-sky" },
  { path: "/api/v0/live-sky/planets?latitude=50.08&longitude=14.44&date=2026-08-19", kind: "json", group: "api-live-sky" },
  { path: "/api/v0/live-sky/tonight?latitude=50.08&longitude=14.44&date=2026-08-19", kind: "json", group: "api-live-sky" },

  // ---- Assistant endpoints ---------------------------------------------
  { path: "/api/v0/assistant/explain?id=planet:earth", kind: "json", group: "api-assistant" },
  { path: "/api/v0/entities/planet:earth", kind: "json", group: "api-entity-by-id" },
  { path: "/api/v0/entities/planet:earth/provenance", kind: "json", group: "api-provenance" },

  // ---- Error handling (contract, not accident) --------------------------
  { path: "/api/v0/live-sky/sun", kind: "json", group: "api-error-400", expectStatus: 400 },
  { path: "/api/v0/live-sky/planets?latitude=50&longitude=14&planet=pluto", kind: "json", group: "api-error-400", expectStatus: 400 },
  { path: "/api/v0/entities/definitely-not-a-real-entity-xyz", kind: "json", group: "api-error-404", expectStatus: 404 },
  { path: "/this-route-does-not-exist-xyz", kind: "page", group: "html-404", expectStatus: 404 },

  // ---- Protocol files (must be byte-identical) --------------------------
  { path: "/robots.txt", kind: "text", group: "robots" },
  { path: "/llms.txt", kind: "text", group: "llms" },
  { path: "/c292fa58c74f45f9ad982e152b4f7c1c.txt", kind: "text", group: "indexnow-key" },
  { path: "/sitemap.xml", kind: "xml", group: "sitemap" },
  { path: "/manifest.webmanifest", kind: "json", group: "manifest" },

  // ---- Public exports and graph endpoints -------------------------------
  { path: "/data/graph.json", kind: "json", group: "export-graph" },
  { path: "/data/graph.jsonld", kind: "json", group: "export-jsonld" },

  // ---- Brand / generated assets ----------------------------------------
  { path: "/opengraph-image", kind: "asset", group: "og-image" },
  { path: "/twitter-image", kind: "asset", group: "twitter-image" },
  { path: "/icon.svg", kind: "asset", group: "icon" },
  { path: "/favicon.ico", kind: "asset", group: "favicon" },
  { path: "/apple-icon.png", kind: "asset", group: "apple-icon" },
  { path: "/logo.svg", kind: "asset", group: "logo" },

  // ---- Search index (fetched by the client search) ----------------------
  { path: "/search-index/manifest.json", kind: "json", group: "search-index" },
];

/** Route families that must all be represented for the migration to be signed off. */
export const REQUIRED_GROUPS = Array.from(new Set(PARITY_CORPUS.map((t) => t.group))).sort();
