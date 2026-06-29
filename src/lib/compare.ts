import {
  ENTITY_TYPE_LABELS,
  entityGraphPath,
  getConnections,
  getEntityById,
  getEntityForPath,
  type GraphEntity,
} from "@/knowledge-graph";
import { getEntryByPath } from "@/content/entries";
import type { SourceKey } from "@/lib/sources";

/**
 * Entity comparison engine.
 *
 * Comparisons are graph- and content-driven. A side can be a graph entity, a
 * content entry, or a clearly-labeled concept (for boundary comparisons like
 * Astronomy vs Astrology). Shared characteristics are derived from shared graph
 * connections — never fabricated metrics.
 */

interface FactPair {
  label: string;
  value: string;
}

type ComparisonSideSpec =
  | { entityId: string }
  | { entryPath: string }
  | { concept: { name: string; kindLabel: string; description: string; facts: FactPair[]; sources?: SourceKey[] } };

export interface Comparison {
  slug: string;
  title: string;
  description: string;
  left: ComparisonSideSpec;
  right: ComparisonSideSpec;
}

export interface ResolvedSide {
  name: string;
  kindLabel: string;
  description: string;
  facts: FactPair[];
  href?: string;
  entityId?: string;
  sources: SourceKey[];
}

export const COMPARISONS: Comparison[] = [
  {
    slug: "mars-vs-venus",
    title: "Mars vs Venus",
    description: "Two terrestrial neighbors of Earth — a cold desert world and a scorching greenhouse.",
    left: { entityId: "planet:mars" },
    right: { entityId: "planet:venus" },
  },
  {
    slug: "saturn-vs-jupiter",
    title: "Saturn vs Jupiter",
    description: "The two largest planets — both gas giants, with strikingly different characters.",
    left: { entityId: "planet:saturn" },
    right: { entityId: "planet:jupiter" },
  },
  {
    slug: "jwst-vs-hubble",
    title: "James Webb vs Hubble",
    description: "Two great space observatories — infrared pioneer and optical icon.",
    left: { entityId: "space_telescope:james-webb-space-telescope" },
    right: { entityId: "space_telescope:hubble-space-telescope" },
  },
  {
    slug: "betelgeuse-vs-rigel",
    title: "Betelgeuse vs Rigel",
    description: "Orion's two beacons — a cool red supergiant and a hot blue supergiant.",
    left: { entityId: "star:betelgeuse" },
    right: { entityId: "star:rigel" },
  },
  {
    slug: "galaxy-vs-nebula",
    title: "Galaxy vs Nebula",
    description: "Two very different deep-sky objects often confused with one another.",
    left: { entryPath: "/encyclopedia/glossary/galaxy" },
    right: { entryPath: "/encyclopedia/glossary/nebula" },
  },
  {
    slug: "astronomy-vs-astrology",
    title: "Astronomy vs Astrology",
    description: "The defining distinction on Asteria Star: evidence-based science versus interpretive cultural tradition.",
    left: {
      concept: {
        name: "Astronomy",
        kindLabel: "Science",
        description: "The scientific study of the universe — objects, physics, and how we observe them. Evidence-based and sourced.",
        facts: [
          { label: "Nature", value: "Natural science" },
          { label: "Basis", value: "Evidence and observation" },
          { label: "Status", value: "Scientifically established" },
        ],
        sources: ["nasa", "esa", "iau"],
      },
    },
    right: {
      concept: {
        name: "Astrology",
        kindLabel: "Cultural tradition",
        description: "A cultural and symbolic tradition relating celestial positions to human affairs. Presented as heritage, not science.",
        facts: [
          { label: "Nature", value: "Cultural / interpretive tradition" },
          { label: "Basis", value: "Symbolism and tradition" },
          { label: "Status", value: "Not scientifically proven" },
        ],
        sources: ["britannica"],
      },
    },
  },
];

const BY_SLUG = new Map(COMPARISONS.map((c) => [c.slug, c]));
export function getComparison(slug: string): Comparison | undefined {
  return BY_SLUG.get(slug);
}

function resolveEntity(entity: GraphEntity): ResolvedSide {
  const entry = entity.entryPath ? getEntryByPath(entity.entryPath) : undefined;
  return {
    name: entity.name,
    kindLabel: ENTITY_TYPE_LABELS[entity.type],
    description: entry?.excerpt ?? entity.description ?? "",
    facts: entry?.facts ?? [],
    href: entityGraphPath(entity),
    entityId: entity.id,
    sources: entry?.sources ?? entity.sources ?? [],
  };
}

export function resolveSide(spec: ComparisonSideSpec): ResolvedSide | null {
  if ("entityId" in spec) {
    const entity = getEntityById(spec.entityId);
    return entity ? resolveEntity(entity) : null;
  }
  if ("entryPath" in spec) {
    const entry = getEntryByPath(spec.entryPath);
    if (!entry) return null;
    const entity = getEntityForPath(spec.entryPath);
    return {
      name: entry.title,
      kindLabel: entry.kind === "interpretive" ? "Interpretive" : "Reference",
      description: entry.excerpt,
      facts: entry.facts,
      href: entry.path,
      entityId: entity?.id,
      sources: entry.sources,
    };
  }
  const c = spec.concept;
  return { name: c.name, kindLabel: c.kindLabel, description: c.description, facts: c.facts, sources: c.sources ?? [] };
}

/** Graph entities both sides connect to (shared characteristics). */
export function getSharedConnections(left: ResolvedSide, right: ResolvedSide): GraphEntity[] {
  if (!left.entityId || !right.entityId) return [];
  const rightNeighbors = new Set(getConnections(right.entityId).map((c) => c.other.id));
  const shared = getConnections(left.entityId)
    .map((c) => c.other)
    .filter((e) => rightNeighbors.has(e.id));
  // dedupe
  return Array.from(new Map(shared.map((e) => [e.id, e])).values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

/** Union of source keys across both sides. */
export function getComparisonSources(left: ResolvedSide, right: ResolvedSide): SourceKey[] {
  return Array.from(new Set([...left.sources, ...right.sources]));
}
