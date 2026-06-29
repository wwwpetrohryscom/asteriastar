import {
  GRAPH_STATS,
  ENTITY_TYPES,
  RELATION_TYPES,
} from "@/knowledge-graph";
import { DATASETS } from "@/lib/datasets";
import { TOPICS } from "@/lib/discovery";
import { LEARNING_PATHS } from "@/lib/learn";
import { TIMELINES } from "@/lib/timelines";
import { IMAGES } from "@/lib/media/registry";
import { CITATIONS } from "@/lib/citations";
import { SOURCES } from "@/lib/sources";
import { LOCALES } from "@/platform/localization";
import { EXTENSION_STATS } from "@/platform/extensions";
import { COMPONENT_STATS } from "@/platform/component-registry";
import type { LayerId } from "@/platform/layers";

/**
 * The Universal Registry — a registry of registries.
 *
 * Nothing exists outside a registry. Every collection in the platform (entities,
 * relationships, datasets, schema, components, explorers, learning, timelines,
 * images, citations, sources, locales, extensions) registers here with a typed
 * descriptor and a live count, so any client can enumerate the platform's
 * capabilities programmatically.
 */

export interface PlatformRegistry {
  id: string;
  name: string;
  description: string;
  layer: LayerId;
  count: number;
  href?: string;
}

export const REGISTRIES: PlatformRegistry[] = [
  { id: "entity", name: "Entity Registry", description: "Every entity in the knowledge graph.", layer: "graph", count: GRAPH_STATS.entityCount, href: "/entity-index" },
  { id: "relationship", name: "Relationship Registry", description: "Every typed relation between entities.", layer: "graph", count: GRAPH_STATS.relationCount, href: "/registry" },
  { id: "schema", name: "Schema Registry", description: "Entity and relation type definitions.", layer: "graph", count: ENTITY_TYPES.length + RELATION_TYPES.length, href: "/registry" },
  { id: "dataset", name: "Dataset Registry", description: "Open datasets generated from the graph.", layer: "data", count: DATASETS.length, href: "/datasets" },
  { id: "image", name: "Image Registry", description: "Provenance-first image assets.", layer: "data", count: IMAGES.length, href: "/observatory" },
  { id: "citation", name: "Citation Registry", description: "Peer-reviewed and authoritative references.", layer: "data", count: CITATIONS.length, href: "/sources-policy" },
  { id: "source", name: "Source Registry", description: "Authoritative source organizations.", layer: "source", count: Object.keys(SOURCES).length, href: "/sources-policy" },
  { id: "explorer", name: "Explorer Registry", description: "Ways to traverse and browse the graph.", layer: "explorer", count: TOPICS.length, href: "/explore" },
  { id: "learning", name: "Learning Registry", description: "Structured learning paths.", layer: "knowledge", count: LEARNING_PATHS.length, href: "/learn" },
  { id: "timeline", name: "Timeline Registry", description: "Curated, sourced chronologies.", layer: "knowledge", count: TIMELINES.length, href: "/timelines" },
  { id: "component", name: "Component Registry", description: "Reusable platform presentation modules.", layer: "presentation", count: COMPONENT_STATS.total, href: "/platform" },
  { id: "locale", name: "Locale Registry", description: "Supported and planned languages.", layer: "registry", count: LOCALES.length, href: "/platform" },
  { id: "extension", name: "Extension Registry", description: "Registered platform extensions.", layer: "registry", count: EXTENSION_STATS.registered, href: "/platform" },
];

const BY_ID = new Map(REGISTRIES.map((r) => [r.id, r]));
export function getRegistry(id: string): PlatformRegistry | undefined {
  return BY_ID.get(id);
}

export function validateRegistries(items = REGISTRIES): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const r of items) {
    if (seen.has(r.id)) issues.push(`duplicate registry id: ${r.id}`);
    seen.add(r.id);
    if (!r.name?.trim()) issues.push(`${r.id}: missing name`);
    if (typeof r.count !== "number" || r.count < 0) issues.push(`${r.id}: invalid count`);
  }
  return issues;
}

export const REGISTRY_STATS = {
  registries: REGISTRIES.length,
  totalItems: REGISTRIES.reduce((sum, r) => sum + r.count, 0),
} as const;
