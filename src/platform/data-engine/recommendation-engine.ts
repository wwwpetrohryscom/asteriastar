import {
  getRecommendations,
  getConnections,
  getSiblingEntities,
  getEntityById,
  type Recommendation,
  type GraphEntity,
  type RelationType,
} from "@/knowledge-graph";

/**
 * Recommendation Engine — graph-derived suggestions only (never random).
 * Delegates to the graph scorer (distance-2 shared connections + shared type)
 * and adds focused "shared via X" helpers.
 */
export const recommendationEngine = {
  /** Scored recommendations with honest, graph-derived reasons. */
  for: (id: string, limit = 6): Recommendation[] => getRecommendations(id, limit),

  /** Same-type siblings (the "same category" strategy). */
  sameType: (id: string, limit = 6): GraphEntity[] => {
    const e = getEntityById(id);
    return e ? getSiblingEntities(e, limit) : [];
  },

  /**
   * Entities that share a neighbor reached by `type` (e.g. shared mission,
   * shared constellation, shared galaxy), excluding the entity itself.
   */
  sharedVia: (id: string, type: RelationType): GraphEntity[] => {
    const hubs = getConnections(id).filter((c) => c.relation.type === type).map((c) => c.other.id);
    const out = new Map<string, GraphEntity>();
    for (const hubId of hubs) {
      for (const c of getConnections(hubId)) {
        if (c.other.id !== id && c.relation.type === type) out.set(c.other.id, c.other);
      }
    }
    return [...out.values()].sort((a, b) => a.name.localeCompare(b.name));
  },
};
