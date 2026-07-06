import type { SourceKey } from "@/lib/sources";

/**
 * Open Astronomy Platform data model (Program BX). Each capability is a first-class entity describing a
 * facet of AsteriaStar as an open, research-grade data platform — the public Graph API, dataset and
 * bulk exports, versioned releases, licensing, and the standards it is prepared for (JSON-LD/RDF,
 * SPARQL, GraphQL, VO/TAP-ADQL, DOI releases, SDKs, federation). The honesty envelope is the `status`:
 * `available` capabilities work today over the real graph; `architecture-ready` capabilities have a
 * defined interface but are not yet live; `planned` ones are on the roadmap. Nothing is faked: an
 * `architecture-ready` capability serves no data, and every `available` download carries a REAL size,
 * checksum, licence, and release. These are platform-feature meta-nodes (excluded from scientific
 * graph traversal). Unknown values are left empty.
 */

export type PlatformCategory = "api" | "graph" | "datasets" | "downloads" | "licenses" | "sdk" | "federation" | "standards";

export const CATEGORY_LABEL: Record<PlatformCategory, string> = {
  api: "Public API",
  graph: "Graph exports",
  datasets: "Datasets",
  downloads: "Downloads & releases",
  licenses: "Licensing",
  sdk: "SDKs",
  federation: "Federation",
  standards: "Standards",
};

/** The honesty envelope for an open-platform capability. */
export type PlatformStatus = "available" | "architecture-ready" | "planned";

export const STATUS_LABEL: Record<PlatformStatus, string> = {
  available: "Available now",
  "architecture-ready": "Architecture-ready",
  planned: "Planned",
};

export interface PlatformCapabilityRecord {
  /** Stable graph id, "platform_capability:<slug>". */
  id: string;
  slug: string;
  name: string;
  category: PlatformCategory;
  altNames?: string[];
  /** Required plain-language description. */
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /** The honesty status of the capability. */
  status: PlatformStatus;
  /** A live endpoint or export URL, when the capability is available. */
  endpoint?: string;
  /** The format or standard this capability speaks (e.g. "JSON-LD", "OpenAPI 3.1", "SPARQL 1.1"). */
  standard?: string;
  /** Honest limitations — especially what an architecture-ready capability does NOT yet do. */
  limitations?: string;

  /* cross-references */
  relatedKeys?: string[]; // full ids of sibling capabilities / reused entities (associated_with)

  /* display */
  highlights?: string[];
}
