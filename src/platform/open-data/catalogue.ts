import { DATASETS } from "@/lib/datasets";
import { SOURCES } from "@/lib/sources";
import { CITATIONS } from "@/lib/citations";
import { GRAPH_STATS } from "@/knowledge-graph";
import { GRAPH_VERSION_INFO, GRAPH_RELEASED } from "@/knowledge-graph/version";
import { imagesEngine } from "@/platform/data-engine/images-engine";
import { liveSkyEngine } from "@/platform/data-engine/live-sky-engine";
import { EVIDENCE_LEVELS } from "@/platform/authority/evidence";
import type { LicenseId } from "@/platform/open-data/licenses";
import manifestJson from "@/platform/open-data/export-manifest.json";
import { DATA_GENERATED_AT, API_ATTRIBUTION } from "@/platform/open-data/api";

/**
 * Unified open-data catalogue.
 *
 * A superset view over the 50 domain datasets plus the graph-level "meta"
 * datasets (entities, relationships, sources, images, live-sky providers,
 * citations, evidence framework). Every record count is real (computed from the
 * engine/graph), and where a pre-generated export file exists, its size and
 * sha256 come straight from the export manifest — never fabricated. Datasets
 * with no published records are marked "planned"/"architecture", not faked.
 */

interface ManifestEntry { file: string; bytes: number; sha256: string; recordCount: number; format: string; license: string }
const MANIFEST = manifestJson as { generatedAt: string; exports: Record<string, ManifestEntry> };

export type DatasetStatus = "stable" | "prepared" | "planned" | "architecture";

export interface FormatRef {
  format: string;
  status: "available" | "planned";
  href?: string;
  bytes?: number;
  sha256?: string;
}

export interface CatalogueEntry {
  id: string;
  title: string;
  description: string;
  status: DatasetStatus;
  version: string;
  schemaVersion: string;
  /** Real record count, or null when nothing is published yet. */
  recordCount: number | null;
  formats: FormatRef[];
  license: LicenseId;
  attribution: string;
  /** Source-registry keys (or upstream references) this dataset draws on. */
  sources: string[];
  generatedAt: string;
  limitations?: string;
  updatePolicy: string;
}

/** A downloadable JSON format backed by a real, checksummed export file. */
function exportFormat(exportId: string): FormatRef {
  const m = MANIFEST.exports[exportId];
  if (!m) return { format: "JSON", status: "planned" };
  return { format: "JSON", status: "available", href: m.file, bytes: m.bytes, sha256: m.sha256 };
}

const DEFAULT_UPDATE = "Regenerated with each graph release; version bumps follow semantic versioning.";

/* ------------------------------------------------------- meta (graph) datasets */
const META: CatalogueEntry[] = [
  {
    id: "knowledge-graph-entities",
    title: "Knowledge Graph — Entities",
    description: "Every typed entity in the canonical graph (stars, planets, missions, people, and more) with its stable id, type, domain, and canonical path.",
    status: "stable",
    version: GRAPH_VERSION_INFO.graphVersion,
    schemaVersion: GRAPH_VERSION_INFO.schemaVersion,
    recordCount: GRAPH_STATS.entityCount,
    formats: [
      exportFormat("entities-index"),
      { format: "JSON-LD", status: "available", href: "/data/graph.jsonld" },
      { format: "API", status: "available", href: "/api/v0/entities" },
    ],
    license: "internal-asteria",
    attribution: API_ATTRIBUTION,
    sources: ["nasa", "esa", "iau", "simbad"],
    generatedAt: DATA_GENERATED_AT,
    updatePolicy: DEFAULT_UPDATE,
  },
  {
    id: "knowledge-graph-relationships",
    title: "Knowledge Graph — Relationships",
    description: "Every typed, domain-tagged relationship between entities, with confidence. Interpretive links are never presented as confirmed science.",
    status: "stable",
    version: GRAPH_VERSION_INFO.graphVersion,
    schemaVersion: GRAPH_VERSION_INFO.schemaVersion,
    recordCount: GRAPH_STATS.relationCount,
    formats: [
      exportFormat("relationships-index"),
      { format: "JSON-LD", status: "available", href: "/data/graph.jsonld" },
      { format: "API", status: "available", href: "/api/v0/relationships" },
    ],
    license: "internal-asteria",
    attribution: API_ATTRIBUTION,
    sources: ["nasa", "esa", "iau"],
    generatedAt: DATA_GENERATED_AT,
    updatePolicy: DEFAULT_UPDATE,
  },
  {
    id: "source-registry",
    title: "Source Registry",
    description: "The authoritative sources Asteria relies on — space agencies, observatories, catalogues, and unions — with scope, authority type, and canonical URLs.",
    status: "stable",
    version: GRAPH_VERSION_INFO.datasetVersion,
    schemaVersion: GRAPH_VERSION_INFO.schemaVersion,
    recordCount: Object.keys(SOURCES).length,
    formats: [exportFormat("source-registry")],
    license: "internal-asteria",
    attribution: API_ATTRIBUTION,
    sources: [],
    generatedAt: DATA_GENERATED_AT,
    updatePolicy: "Extended as new authoritative sources are adopted; existing keys are stable.",
  },
  {
    id: "scientific-images",
    title: "Scientific Images",
    description: "Catalogue of verified scientific images with their depicted object, capturing instrument, source, and license — imagery itself retains its upstream license.",
    status: "stable",
    version: GRAPH_VERSION_INFO.datasetVersion,
    schemaVersion: GRAPH_VERSION_INFO.schemaVersion,
    recordCount: imagesEngine.count,
    formats: [
      exportFormat("image-catalogue"),
      { format: "API", status: "available", href: "/api/v0/images" },
    ],
    license: "internal-asteria",
    attribution: API_ATTRIBUTION,
    sources: ["nasa", "esa", "noirlab", "eso"],
    generatedAt: DATA_GENERATED_AT,
    limitations: "Catalogue metadata is CC BY-SA 4.0; each image file retains its own upstream license (NASA/ESA/ESO). Verify per-item before reuse.",
    updatePolicy: DEFAULT_UPDATE,
  },
  {
    id: "live-sky-providers",
    title: "Live Sky — Provider Registry",
    description: "Registry of the external data providers the live-sky layer is designed to integrate. The registry is real; the integrations themselves are planned, not connected.",
    status: "prepared",
    version: GRAPH_VERSION_INFO.datasetVersion,
    schemaVersion: GRAPH_VERSION_INFO.schemaVersion,
    recordCount: liveSkyEngine.providers().length,
    formats: [
      exportFormat("live-sky-providers"),
      { format: "API", status: "available", href: "/api/v0/live-sky/providers" },
    ],
    license: "internal-asteria",
    attribution: API_ATTRIBUTION,
    sources: ["nasa", "jpl", "mpc", "imo"],
    generatedAt: DATA_GENERATED_AT,
    limitations: "No provider is currently connected; every entry describes a planned integration and its intended source terms.",
    updatePolicy: "Updated as providers move from planned to connected; status is always shown honestly.",
  },
  {
    id: "citation-registry",
    title: "Citation Registry",
    description: "Real, source-backed references attached to entities, datasets, and provenance records — with DOIs where verified. Served read-only through the API and the Citation Engine.",
    status: "stable",
    version: GRAPH_VERSION_INFO.datasetVersion,
    schemaVersion: GRAPH_VERSION_INFO.schemaVersion,
    recordCount: CITATIONS.length,
    formats: [
      { format: "JSON", status: "available", href: "/api/v0/citations" },
      { format: "API", status: "available", href: "/api/v0/citations" },
    ],
    license: "internal-asteria",
    attribution: API_ATTRIBUTION,
    sources: ["nasa", "esa", "iau", "noirlab", "eso"],
    generatedAt: DATA_GENERATED_AT,
    limitations: "Coverage is a first batch focused on flagship entities; most of the graph is not yet cited. No fabricated citations or DOIs.",
    updatePolicy: "Expanded as more claims are cited to primary sources; validated on every build.",
  },
  {
    id: "evidence-framework",
    title: "Evidence Framework",
    description: "The evidence-level model that classifies how well-supported each fact is. This is a methodology definition, not a record set — it powers quality indicators across the platform.",
    status: "architecture",
    version: GRAPH_VERSION_INFO.datasetVersion,
    schemaVersion: GRAPH_VERSION_INFO.schemaVersion,
    recordCount: EVIDENCE_LEVELS.length,
    formats: [{ format: "JSON", status: "planned" }],
    license: "internal-asteria",
    attribution: API_ATTRIBUTION,
    sources: [],
    generatedAt: DATA_GENERATED_AT,
    limitations: "Defines evidence levels only; there is no standalone downloadable dataset for the framework itself.",
    updatePolicy: "Stable methodology; changes are versioned with the schema.",
  },
];

/* --------------------------------------------------------- domain datasets (50) */
const DOMAIN: CatalogueEntry[] = DATASETS.map((d) => ({
  id: d.slug,
  title: d.title,
  description: d.description,
  status: "stable" as const,
  version: d.version,
  schemaVersion: GRAPH_VERSION_INFO.schemaVersion,
  recordCount: d.entityCount,
  formats: [
    { format: "JSON", status: "available", href: `/datasets/${d.slug}/json` },
    { format: "CSV", status: "available", href: `/datasets/${d.slug}/csv` },
    { format: "JSON-LD", status: "available", href: "/data/graph.jsonld" },
    { format: "API", status: "available", href: `/api/v0/datasets/${d.slug}` },
    { format: "RDF / Turtle", status: "planned" },
  ],
  license: "cc-by-sa-4.0" as LicenseId,
  attribution: API_ATTRIBUTION,
  sources: d.sources,
  generatedAt: DATA_GENERATED_AT,
  updatePolicy: DEFAULT_UPDATE,
}));

export const CATALOGUE: CatalogueEntry[] = [...META, ...DOMAIN];

const BY_ID = new Map(CATALOGUE.map((c) => [c.id, c]));
export function getCatalogueEntry(id: string): CatalogueEntry | undefined {
  return BY_ID.get(id);
}

export const CATALOGUE_STATS = {
  total: CATALOGUE.length,
  stable: CATALOGUE.filter((c) => c.status === "stable").length,
  prepared: CATALOGUE.filter((c) => c.status === "prepared").length,
  planned: CATALOGUE.filter((c) => c.status === "planned").length,
  architecture: CATALOGUE.filter((c) => c.status === "architecture").length,
  /** Datasets backed by a pre-generated, checksummed download. */
  withDownload: CATALOGUE.filter((c) => c.formats.some((f) => f.sha256)).length,
  generatedAt: DATA_GENERATED_AT,
  released: GRAPH_RELEASED,
};

/** The export manifest, re-exported for the /data/exports page (real checksums). */
export const EXPORT_MANIFEST = MANIFEST;
