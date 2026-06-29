import {
  ASTROLOGY_ONLY_RELATIONS,
  CONFIDENCES,
  CULTURE_ONLY_RELATIONS,
  DOMAINS,
  ENTITY_DOMAINS,
  ENTITY_TYPES,
  RELATION_TYPES,
  SCIENCE_ONLY_RELATIONS,
  type GraphEntity,
  type GraphRelation,
} from "@/knowledge-graph/schema";

/**
 * Validate the knowledge graph. Returns a list of issues (empty when valid).
 *
 * The boundary rules are the point: astrology relations can never be marked as
 * science, and interpretive relations can never be presented as confirmed
 * science. These are checked structurally, not by convention.
 */
export function validateGraph(
  entities: GraphEntity[],
  relations: GraphRelation[],
): string[] {
  const issues: string[] = [];

  const entityIds = new Set<string>();
  for (const e of entities) {
    if (entityIds.has(e.id)) issues.push(`duplicate entity id: ${e.id}`);
    entityIds.add(e.id);
    if (!ENTITY_TYPES.includes(e.type)) issues.push(`${e.id}: invalid entity type "${e.type}"`);
    if (!ENTITY_DOMAINS.includes(e.domain)) issues.push(`${e.id}: invalid entity domain "${e.domain}"`);
    if (!e.name?.trim()) issues.push(`${e.id}: missing name`);
  }

  const relationIds = new Set<string>();
  for (const r of relations) {
    if (relationIds.has(r.id)) issues.push(`duplicate relation id: ${r.id}`);
    relationIds.add(r.id);

    if (!RELATION_TYPES.includes(r.type)) issues.push(`${r.id}: invalid relation type "${r.type}"`);
    if (!DOMAINS.includes(r.domain)) issues.push(`${r.id}: invalid domain "${r.domain}"`);
    if (!CONFIDENCES.includes(r.confidence)) issues.push(`${r.id}: invalid confidence "${r.confidence}"`);

    // Endpoints must exist.
    if (!entityIds.has(r.from)) issues.push(`${r.id}: "from" endpoint not found → ${r.from}`);
    if (!entityIds.has(r.to)) issues.push(`${r.id}: "to" endpoint not found → ${r.to}`);

    // Boundary rules.
    if (r.domain === "astrology" && r.confidence !== "interpretive") {
      issues.push(`${r.id}: astrology relations must be confidence "interpretive" (is "${r.confidence}")`);
    }
    if (r.domain === "science" && r.confidence === "interpretive") {
      issues.push(`${r.id}: science relations cannot be "interpretive" (interpretive links must not be confirmed science)`);
    }
    if (SCIENCE_ONLY_RELATIONS.has(r.type) && r.domain !== "science") {
      issues.push(`${r.id}: relation "${r.type}" must be domain "science" (is "${r.domain}")`);
    }
    if (ASTROLOGY_ONLY_RELATIONS.has(r.type) && r.domain !== "astrology") {
      issues.push(`${r.id}: relation "${r.type}" must be domain "astrology" (is "${r.domain}")`);
    }
    if (CULTURE_ONLY_RELATIONS.has(r.type) && r.domain !== "culture") {
      issues.push(`${r.id}: relation "${r.type}" must be domain "culture" (is "${r.domain}")`);
    }
  }

  // No isolated nodes: every entity must participate in at least one relation.
  const connected = new Set<string>();
  for (const r of relations) {
    connected.add(r.from);
    connected.add(r.to);
  }
  for (const e of entities) {
    if (!connected.has(e.id)) issues.push(`${e.id}: isolated node (no relations)`);
  }

  return issues;
}
