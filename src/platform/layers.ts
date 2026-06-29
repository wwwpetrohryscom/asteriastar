/**
 * Asteria Platform Core — layer model.
 *
 * The platform is organized as a stack of independent layers. The website is
 * just one Presentation client; every future interface (mobile, desktop, API,
 * AI apps, planetariums, education) consumes the same lower layers.
 *
 * Conceptual consumption view (top consumes below):
 *
 *   Presentation → Explorer → Knowledge → Graph → Registry → Data → Source
 *
 * The invariant that matters and that validation enforces: the dependency graph
 * is ACYCLIC and the Graph layer (the operating core) never imports a layer
 * above it. Each layer declares the path prefixes it owns; the dependency
 * checker in scripts/check-architecture.ts classifies every core module by these
 * prefixes and fails the build on a cycle or an illegal upward import.
 */

export type LayerId =
  | "presentation"
  | "explorer"
  | "knowledge"
  | "graph"
  | "registry"
  | "data"
  | "source";

export interface PlatformLayer {
  id: LayerId;
  name: string;
  /** Depth in the conceptual stack (0 = Presentation, 6 = Source). */
  level: number;
  role: string;
  /** Source path prefixes (relative to src/) that belong to this layer. */
  owns: string[];
  /** Layers this layer is allowed to depend on (by id). Forms a DAG. */
  mayDependOn: LayerId[];
}

export const LAYERS: PlatformLayer[] = [
  {
    id: "presentation",
    name: "Presentation Layer",
    level: 0,
    role: "Views and interfaces. The website is one client; mobile, desktop, and embeds are future clients. Pages are views — entities are reality.",
    owns: ["app", "components"],
    mayDependOn: ["explorer", "knowledge", "graph", "registry", "data", "source"],
  },
  {
    id: "explorer",
    name: "Explorer Layer",
    level: 1,
    role: "Discovery, search, comparison, recommendations — the ways humans and machines traverse the graph.",
    owns: ["lib/discovery", "lib/search", "lib/compare"],
    mayDependOn: ["knowledge", "graph", "data", "source"],
  },
  {
    id: "knowledge",
    name: "Knowledge Layer",
    level: 2,
    role: "Editorial knowledge built on entities: content entries, the section/category taxonomy, learning paths, and timelines.",
    owns: ["content", "lib/content", "lib/learn", "lib/timelines"],
    mayDependOn: ["graph", "data", "source"],
  },
  {
    id: "graph",
    name: "Graph Layer",
    level: 3,
    role: "The operating core: the canonical knowledge graph of entities and typed relations. Everything references entities; nothing references pages.",
    owns: ["knowledge-graph"],
    mayDependOn: ["source"],
  },
  {
    id: "registry",
    name: "Registry Layer",
    level: 4,
    role: "The platform core: the universal registry-of-registries, entity runtime, metadata generation, localization, search core, and extension points.",
    owns: ["platform"],
    mayDependOn: ["graph", "knowledge", "explorer", "data", "source"],
  },
  {
    id: "data",
    name: "Data Layer",
    level: 5,
    role: "Open datasets, image-asset metadata, and citations — machine-readable views generated from the graph.",
    owns: ["lib/datasets", "lib/media", "lib/citations"],
    mayDependOn: ["graph", "source"],
  },
  {
    id: "source",
    name: "Source Layer",
    level: 6,
    role: "Authoritative source organizations (NASA, ESA, IAU, NOIRLab, ESO, SIMBAD, NED, …). The leaf layer; depends on nothing.",
    owns: ["lib/sources"],
    mayDependOn: [],
  },
];

const BY_ID = new Map(LAYERS.map((l) => [l.id, l]));
export function getLayer(id: LayerId): PlatformLayer {
  const l = BY_ID.get(id);
  if (!l) throw new Error(`unknown layer: ${id}`);
  return l;
}

/**
 * Classify a src-relative module path into the layer that owns it (or null for
 * cross-cutting utilities like lib/routes, lib/site, lib/seo, lib/navigation).
 * Matching is segment-boundary aware (`lib/content` matches `lib/content/x` but
 * not `lib/contentX`) and the most specific (longest) prefix wins.
 */
export function classifyModule(srcRelativePath: string): LayerId | null {
  const path = srcRelativePath.replace(/\.(ts|tsx)$/, "").replace(/\/index$/, "");
  let best: { id: LayerId; len: number } | null = null;
  for (const layer of LAYERS) {
    for (const owned of layer.owns) {
      const prefix = owned.replace(/\/+$/, ""); // tolerate a stray trailing slash
      if (path === prefix || path.startsWith(prefix + "/")) {
        if (!best || prefix.length > best.len) best = { id: layer.id, len: prefix.length };
      }
    }
  }
  return best?.id ?? null;
}

/** Whether `from` may import `to` per the layer dependency allowlist. */
export function mayDepend(from: LayerId, to: LayerId): boolean {
  if (from === to) return true;
  return getLayer(from).mayDependOn.includes(to);
}

export const LAYER_ORDER: LayerId[] = LAYERS.map((l) => l.id);
