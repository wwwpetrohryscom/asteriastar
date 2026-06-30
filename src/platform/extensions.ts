/**
 * Platform extension architecture.
 *
 * The core is closed for modification but open for extension: new entity types,
 * datasets, calculators, timelines, galleries, learning paths, and explorers
 * register against a typed extension point without changing the core. This file
 * defines the contract and the registry; it does NOT implement a plugin runtime.
 */

export type ExtensionPoint =
  | "entity-type"
  | "dataset"
  | "calculator"
  | "timeline"
  | "gallery"
  | "learning-path"
  | "explorer"
  | "metadata-provider"
  | "search-provider";

export interface ExtensionPointDef {
  point: ExtensionPoint;
  name: string;
  description: string;
}

export const EXTENSION_POINTS: ExtensionPointDef[] = [
  { point: "entity-type", name: "Entity Type", description: "Register a new typed entity kind in the graph schema." },
  { point: "dataset", name: "Dataset", description: "Expose a new open dataset as a view over graph entities." },
  { point: "calculator", name: "Calculator", description: "Add a scientific calculator backed by entity data." },
  { point: "timeline", name: "Timeline", description: "Contribute a sourced chronology of events and entities." },
  { point: "gallery", name: "Gallery", description: "Add a provenance-first image gallery for entities." },
  { point: "learning-path", name: "Learning Path", description: "Define a structured journey across entities." },
  { point: "explorer", name: "Explorer", description: "Add a way to traverse or browse the graph." },
  { point: "metadata-provider", name: "Metadata Provider", description: "Generate additional machine metadata for entities." },
  { point: "search-provider", name: "Search Provider", description: "Index an entity-derived result source for universal search." },
];

const POINTS = new Set(EXTENSION_POINTS.map((p) => p.point));

export interface Extension {
  /** Namespaced unique id, e.g. "core:datasets" or "community:asteroid-tracker". */
  id: string;
  point: ExtensionPoint;
  name: string;
  description: string;
  version: string;
  status: "core" | "official" | "community" | "planned";
}

/**
 * The platform's capabilities modeled as extensions — proof the contract is real
 * and populated. Shipped capabilities are `core`; capabilities whose interactive
 * runtime is not implemented yet (e.g. calculator computation) are `planned`.
 */
const REGISTERED: Extension[] = [
  { id: "core:graph-schema", point: "entity-type", name: "Core entity types", description: "The built-in entity type vocabulary.", version: "1.0.0", status: "core" },
  { id: "core:datasets", point: "dataset", name: "Core datasets", description: "Stars, planets, galaxies, missions, and more.", version: "1.0.0", status: "core" },
  { id: "core:physics-calculators", point: "calculator", name: "Physics calculators", description: "Physics calculator pages (interactive computation planned).", version: "1.0.0", status: "planned" },
  { id: "core:timelines", point: "timeline", name: "Core timelines", description: "Curated, sourced chronologies.", version: "1.0.0", status: "core" },
  { id: "core:galleries", point: "gallery", name: "Entity galleries", description: "Provenance-first image galleries.", version: "1.0.0", status: "core" },
  { id: "core:learning-paths", point: "learning-path", name: "Core learning paths", description: "Structured learning journeys.", version: "1.0.0", status: "core" },
  { id: "core:explore", point: "explorer", name: "Knowledge explorer", description: "Topic, entity, and connection explorers.", version: "1.0.0", status: "core" },
  { id: "core:metadata", point: "metadata-provider", name: "Universal metadata", description: "Canonical, SEO, citation, and machine metadata.", version: "1.0.0", status: "core" },
  { id: "core:search", point: "search-provider", name: "Universal search core", description: "Entity-derived search providers.", version: "1.0.0", status: "core" },
];

const REGISTRY = new Map<string, Extension>(REGISTERED.map((e) => [e.id, e]));

/** Register an extension (architecture demo of the contract). Throws on dup/invalid. */
export function registerExtension(ext: Extension): void {
  if (REGISTRY.has(ext.id)) throw new Error(`duplicate extension id: ${ext.id}`);
  if (!POINTS.has(ext.point)) throw new Error(`unknown extension point: ${ext.point}`);
  REGISTRY.set(ext.id, ext);
}

export function getExtensions(point?: ExtensionPoint): Extension[] {
  const all = [...REGISTRY.values()];
  return point ? all.filter((e) => e.point === point) : all;
}

export function validateExtensions(items = getExtensions()): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const e of items) {
    if (seen.has(e.id)) issues.push(`duplicate extension id: ${e.id}`);
    seen.add(e.id);
    if (!POINTS.has(e.point)) issues.push(`${e.id}: unknown extension point "${e.point}"`);
    if (!/^[a-z0-9-]+:[a-z0-9-]+$/.test(e.id)) issues.push(`${e.id}: invalid namespaced id`);
    if (!e.name?.trim()) issues.push(`${e.id}: missing name`);
  }
  return issues;
}

export const EXTENSION_STATS = {
  points: EXTENSION_POINTS.length,
  registered: REGISTRY.size,
} as const;
