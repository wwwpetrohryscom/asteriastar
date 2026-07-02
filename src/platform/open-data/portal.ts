import { GRAPH_VERSION_INFO } from "@/knowledge-graph/version";

/**
 * Portal metadata: the sub-pages of the public data portal (/data/*) and the
 * developer docs (/developers/*), plus the honest versioning policy and
 * changelog. Content-only — no fabricated releases; the platform is at 1.0.0.
 */

/**
 * The honest status vocabulary shared by the data & developer portals. Defined
 * here in the platform layer so components can depend on it (never the reverse).
 */
export type PortalStatus =
  | "implemented"
  | "stable"
  | "available"
  | "prepared"
  | "planned"
  | "architecture"
  | "deprecated";

export interface PortalSection {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
}

export const DATA_SECTIONS: PortalSection[] = [
  { slug: "datasets", title: "Datasets", eyebrow: "Catalogue", description: "The full open-data catalogue with real record counts, formats, licenses, and honest status." },
  { slug: "entities", title: "Entities", eyebrow: "Data model", description: "The entity model, stable identifiers, and how to read entities from the graph and API." },
  { slug: "relationships", title: "Relationships", eyebrow: "Data model", description: "Typed, domain-tagged relationships between entities, each with a confidence level." },
  { slug: "schemas", title: "Schemas & identifiers", eyebrow: "Reference", description: "Entity and relationship schemas, the version policy, and the stable-identifier guide." },
  { slug: "exports", title: "Exports", eyebrow: "Downloads", description: "Pre-generated, checksummed data files — real downloads with a SHA-256 you can verify." },
  { slug: "changelog", title: "Changelog", eyebrow: "Versioning", description: "The versioning policy and what shipped in each data, schema, and API release." },
  { slug: "licensing", title: "Licensing", eyebrow: "Terms", description: "Every dataset's license, and the upstream terms that apply to underlying source data." },
  { slug: "attribution", title: "Attribution", eyebrow: "Terms", description: "How to credit Asteria Star and the authoritative sources behind the data." },
  { slug: "provenance", title: "Provenance", eyebrow: "How it works", description: "How data flows from authoritative sources through the engine to the API and exports." },
  { slug: "quality", title: "Data quality", eyebrow: "Assurance", description: "Coverage, review state, the evidence framework, and known limitations — shown honestly." },
];

export const DATA_SECTION_SLUGS = DATA_SECTIONS.map((s) => s.slug);
export function getDataSection(slug: string): PortalSection | undefined {
  return DATA_SECTIONS.find((s) => s.slug === slug);
}

export interface DeveloperDoc {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  status: PortalStatus;
}

export const DEVELOPER_DOCS: DeveloperDoc[] = [
  { slug: "openapi", title: "OpenAPI", eyebrow: "Reference", status: "implemented", description: "The machine-readable OpenAPI 3.1 description of every implemented endpoint." },
  { slug: "status", title: "API status", eyebrow: "Overview", status: "implemented", description: "What is implemented, prepared, and planned across the API — no surprises." },
  { slug: "changelog", title: "API changelog", eyebrow: "Versioning", status: "implemented", description: "Release notes and the versioning policy for the data and the API." },
  { slug: "rate-limits", title: "Rate limits", eyebrow: "Usage", status: "architecture", description: "There are no rate limits today. The API is read-only, static, and cacheable." },
  { slug: "sdk", title: "SDK", eyebrow: "Clients", status: "planned", description: "Typed client libraries for the read-only API. Planned; not yet published." },
];

export const DEVELOPER_DOC_SLUGS = DEVELOPER_DOCS.map((d) => d.slug);
export function getDeveloperDoc(slug: string): DeveloperDoc | undefined {
  return DEVELOPER_DOCS.find((d) => d.slug === slug);
}

/* ------------------------------------------------------------ versioning */
export interface VersionPolicy {
  name: string;
  current: string;
  bumps: string;
}

export const VERSIONING_POLICY: VersionPolicy[] = [
  { name: "Schema version", current: GRAPH_VERSION_INFO.schemaVersion, bumps: "Bumps on any breaking change to entity or relationship shape." },
  { name: "Graph version", current: GRAPH_VERSION_INFO.graphVersion, bumps: "Bumps on any change to the graph's data (entities or relationships)." },
  { name: "Dataset version", current: GRAPH_VERSION_INFO.datasetVersion, bumps: "Bumps on a published dataset snapshot." },
  { name: "API version", current: "v0", bumps: "Path-versioned. Breaking response changes ship under a new version (v1, …); v0 may evolve additively." },
];

export interface ChangelogEntry {
  version: string;
  date: string;
  area: "api" | "dataset" | "graph" | "schema";
  title: string;
  changes: string[];
}

/**
 * Honest changelog. Everything is at 1.0.0 / v0 as of the initial public
 * release — there is no invented version history.
 */
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v0",
    date: GRAPH_VERSION_INFO.released,
    area: "api",
    title: "Read-only Open Data API v0",
    changes: [
      "Ten read-only endpoints: entities, entity by id, relationships, search, traversal, datasets, dataset by id, images, live-sky providers, and the OpenAPI document.",
      "Every response carries a provenance envelope (apiVersion, schemaVersion, dataVersion, generatedAt, source, license, attribution).",
      "OpenAPI 3.1 document generated from implemented endpoints only.",
      "Deterministic, non-semantic search and cycle-safe traversal — engine-backed, never fabricated.",
    ],
  },
  {
    version: GRAPH_VERSION_INFO.datasetVersion,
    date: GRAPH_VERSION_INFO.released,
    area: "dataset",
    title: "Dataset catalogue & checksummed exports",
    changes: [
      "Unified catalogue of domain and graph-level datasets, each with a real record count and license.",
      "Pre-generated export files (entities, relationships, sources, images, providers) with real SHA-256 checksums in an export manifest.",
    ],
  },
  {
    version: GRAPH_VERSION_INFO.graphVersion,
    date: GRAPH_VERSION_INFO.released,
    area: "graph",
    title: "Initial public graph snapshot",
    changes: [
      `First public snapshot: ${GRAPH_VERSION_INFO.entityCount.toLocaleString()} entities and ${GRAPH_VERSION_INFO.relationCount.toLocaleString()} relationships.`,
      "Full graph available as JSON and JSON-LD; per-dataset JSON and CSV exports.",
    ],
  },
  {
    version: GRAPH_VERSION_INFO.schemaVersion,
    date: GRAPH_VERSION_INFO.released,
    area: "schema",
    title: "Initial schema",
    changes: [
      "Stable type:slug identifier scheme; typed entities and typed, domain-tagged relationships with confidence.",
      "No breaking changes have been made yet.",
    ],
  },
];
