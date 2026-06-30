import {
  getConnections,
  getConnectionsByDomain,
  getRelationsForEntity,
  getRelatedEntities,
  relations,
  type Connection,
  type GraphRelation,
  type RelationType,
  type EntityDomain,
} from "@/knowledge-graph";

/**
 * Relationship Resolver — typed access to an entity's relations. Delegates to
 * the graph query helpers; the engine is the single import surface so no UI
 * reaches into graph internals directly.
 */
export const relationshipEngine = {
  /** Direction-aware connections (relation + the entity on the other end). */
  for: (id: string): Connection[] => getConnections(id),
  /** Connections grouped into science / culture / astrology. */
  byDomain: (id: string) => getConnectionsByDomain(id),
  /** Raw relations touching the entity. */
  relations: (id: string): GraphRelation[] => getRelationsForEntity(id),
  /** Unique neighbor entities. */
  neighbors: (id: string) => getRelatedEntities(id),
  /** Connections filtered by relation type. */
  ofType: (id: string, type: RelationType): Connection[] =>
    getConnections(id).filter((c) => c.relation.type === type),
  /** Connections filtered by domain. */
  inDomain: (id: string, domain: EntityDomain): Connection[] =>
    getConnections(id).filter((c) => c.relation.domain === domain),
  /** Every relation in the graph. */
  all: (): GraphRelation[] => relations,
};
