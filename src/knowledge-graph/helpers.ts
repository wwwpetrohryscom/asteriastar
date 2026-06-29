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
}

/** All connections for an entity, resolved to the entity on the other end. */
export function getConnections(id: string): Connection[] {
  const out: Connection[] = [];
  for (const relation of getRelationsForEntity(id)) {
    const otherId = relation.from === id ? relation.to : relation.from;
    const other = ENTITY_BY_ID.get(otherId);
    if (other) out.push({ relation, other });
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
 * Entity-less entities that have at least one connection — these get a
 * standalone graph page (and avoid thin pages: no connections, no page).
 */
export function getStandaloneEntities(): GraphEntity[] {
  return entities.filter(
    (e) => !e.entryPath && getRelationsForEntity(e.id).length > 0,
  );
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
