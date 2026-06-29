import { entities } from "@/knowledge-graph/entities";
import { relations } from "@/knowledge-graph/relations";
import type {
  EntityDomain,
  EntityType,
  GraphEntity,
  GraphRelation,
} from "@/knowledge-graph/schema";

/**
 * Query helpers over the knowledge graph. Maps are built once at module load.
 * These are pure graph operations (no dependency on the content registry);
 * the entry ↔ graph bridge helpers live in src/content/entries/index.ts.
 */

const ENTITY_BY_ID = new Map<string, GraphEntity>(entities.map((e) => [e.id, e]));
const ENTITY_BY_PATH = new Map<string, GraphEntity>(
  entities.filter((e) => e.entryPath).map((e) => [e.entryPath as string, e]),
);

export function getEntityById(id: string): GraphEntity | undefined {
  return ENTITY_BY_ID.get(id);
}

/** Find the entity linked to a content entry's canonical path, if any. */
export function getEntityForPath(path: string): GraphEntity | undefined {
  return ENTITY_BY_PATH.get(path);
}

/** The canonical entry path for an entity (undefined if it has no entry yet). */
export function getEntityCanonicalPath(id: string): string | undefined {
  return ENTITY_BY_ID.get(id)?.entryPath;
}

/** All relations touching an entity (incoming or outgoing). */
export function getRelationsForEntity(id: string): GraphRelation[] {
  return relations.filter((r) => r.from === id || r.to === id);
}

export function getScienceRelations(id: string): GraphRelation[] {
  return getRelationsForEntity(id).filter((r) => r.domain === "science");
}

export function getCulturalRelations(id: string): GraphRelation[] {
  return getRelationsForEntity(id).filter((r) => r.domain === "culture");
}

export function getAstrologyRelations(id: string): GraphRelation[] {
  return getRelationsForEntity(id).filter((r) => r.domain === "astrology");
}

/** Unique entities connected to the given entity by any relation. */
export function getRelatedEntities(id: string): GraphEntity[] {
  const seen = new Set<string>();
  const out: GraphEntity[] = [];
  for (const r of getRelationsForEntity(id)) {
    const otherId = r.from === id ? r.to : r.from;
    if (otherId === id || seen.has(otherId)) continue;
    const other = ENTITY_BY_ID.get(otherId);
    if (other) {
      seen.add(otherId);
      out.push(other);
    }
  }
  return out;
}

/** A relation paired with the entity on its other end (relative to `id`). */
export interface Connection {
  relation: GraphRelation;
  other: GraphEntity;
  /** True when `id` is the relation's `from` (the relation reads forward). */
  outgoing: boolean;
}

/** All connections for an entity, resolved to the entity on the other end. */
export function getConnections(id: string): Connection[] {
  const out: Connection[] = [];
  for (const relation of getRelationsForEntity(id)) {
    const outgoing = relation.from === id;
    const otherId = outgoing ? relation.to : relation.from;
    const other = ENTITY_BY_ID.get(otherId);
    if (other) out.push({ relation, other, outgoing });
  }
  return out;
}

/** Connections grouped by domain — used to render them in separate, labeled sections. */
export function getConnectionsByDomain(id: string): {
  science: Connection[];
  culture: Connection[];
  astrology: Connection[];
} {
  const all = getConnections(id);
  return {
    science: all.filter((c) => c.relation.domain === "science"),
    culture: all.filter((c) => c.relation.domain === "culture"),
    astrology: all.filter((c) => c.relation.domain === "astrology"),
  };
}

/* -------------------------------------------------- listing & discovery */

export function getAllGraphEntities(): GraphEntity[] {
  return entities;
}

export function getGraphEntitiesByType(type: EntityType): GraphEntity[] {
  return entities.filter((e) => e.type === type);
}

export function getGraphEntitiesByDomain(domain: EntityDomain): GraphEntity[] {
  return entities.filter((e) => e.domain === domain);
}

/** Distinct entity types present in the graph, with counts. */
export function getEntityTypeCounts(): { type: EntityType; count: number }[] {
  const counts = new Map<EntityType, number>();
  for (const e of entities) counts.set(e.type, (counts.get(e.type) ?? 0) + 1);
  return [...counts.entries()].map(([type, count]) => ({ type, count }));
}

/** Look up an entity by its split id segments (`type:slug`). */
export function getGraphEntityByTypeSlug(
  type: string,
  slug: string,
): GraphEntity | undefined {
  return ENTITY_BY_ID.get(`${type}:${slug}`);
}

/**
 * The browsable URL for an entity: its content entry if it has one, otherwise a
 * standalone graph page under /explore/entity/[type]/[slug].
 */
export function entityGraphPath(entity: GraphEntity): string {
  if (entity.entryPath) return entity.entryPath;
  const sep = entity.id.indexOf(":");
  const type = entity.id.slice(0, sep);
  const slug = entity.id.slice(sep + 1);
  return `/explore/entity/${type}/${slug}`;
}

/**
 * Entity-less entities (no content entry of their own) — these get a standalone
 * graph page under /explore/entity/[type]/[slug]. Pages stay non-thin by always
 * showing connections (when present) and sibling entities of the same type.
 */
export function getStandaloneEntities(): GraphEntity[] {
  return entities.filter((e) => !e.entryPath);
}

/** Other entities of the same type (for "More …" sections). Excludes `id`. */
export function getSiblingEntities(
  entity: GraphEntity,
  limit = 6,
): GraphEntity[] {
  return entities
    .filter((e) => e.type === entity.type && e.id !== entity.id)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit);
}

/* ------------------------------------------------ recommendations / discovery */

export interface Recommendation {
  entity: GraphEntity;
  /** Human-readable, graph-derived reason this is recommended. */
  reason: string;
  score: number;
}

/**
 * Graph-driven recommendations for an entity: candidates are scored by shared
 * connections (distance-2 neighbors) and shared type. Every recommendation has
 * an honest, graph-derived reason — nothing random or fabricated.
 */
export function getRecommendations(id: string, limit = 6): Recommendation[] {
  const entity = ENTITY_BY_ID.get(id);
  if (!entity) return [];

  const neighbors = getConnections(id).map((c) => c.other.id);
  const direct = new Set<string>([id, ...neighbors]);
  const scores = new Map<string, { score: number; reasons: string[] }>();

  const bump = (candId: string, points: number, reason: string) => {
    if (direct.has(candId)) return;
    const s = scores.get(candId) ?? { score: 0, reasons: [] };
    s.score += points;
    if (!s.reasons.includes(reason)) s.reasons.push(reason);
    scores.set(candId, s);
  };

  // Distance-2: entities that share a neighbor with this entity.
  for (const nId of neighbors) {
    const neighbor = ENTITY_BY_ID.get(nId);
    if (!neighbor) continue;
    for (const c of getConnections(nId)) {
      bump(c.other.id, 3, `Linked through ${neighbor.name}`);
    }
  }

  // Shared type.
  for (const cand of entities) {
    if (cand.type === entity.type) bump(cand.id, 1, `Also a ${entity.type.replace(/_/g, " ")}`);
  }

  return [...scores.entries()]
    .map(([candId, s]) => {
      const e = ENTITY_BY_ID.get(candId);
      return e ? { entity: e, reason: s.reasons[0], score: s.score } : null;
    })
    .filter((r): r is Recommendation => r !== null)
    .sort((a, b) => b.score - a.score || a.entity.name.localeCompare(b.entity.name))
    .slice(0, limit);
}

export const GRAPH_STATS = {
  entityCount: entities.length,
  relationCount: relations.length,
  entitiesByDomain: entities.reduce<Record<string, number>>((acc, e) => {
    acc[e.domain] = (acc[e.domain] ?? 0) + 1;
    return acc;
  }, {}),
  relationsByDomain: relations.reduce<Record<string, number>>((acc, r) => {
    acc[r.domain] = (acc[r.domain] ?? 0) + 1;
    return acc;
  }, {}),
} as const;
