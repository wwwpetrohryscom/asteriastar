import { getAllGraphEntities, relations, type EntityDomain } from "@/knowledge-graph";
import { validateSources } from "@/lib/sources";
import { validateCitations, CITATIONS } from "@/lib/citations";
import { validateProvenance, PROVENANCE } from "@/platform/authority/provenance";
import { validateReviews, REVIEWS } from "@/platform/authority/review";
import { validateVersions } from "@/platform/authority/versioning";
import { SCIENCE_EVIDENCE_LEVELS } from "@/platform/authority/evidence";

/**
 * Platform integrity for the authority layer. Rejects: duplicate provenance/
 * review/version ids, missing evidence levels, invalid review states, scientific
 * facts without source placeholders, interpretive facts marked scientific, and
 * broken citation / version / provenance references.
 */
export function validateAuthority(): string[] {
  const entities = getAllGraphEntities();
  const entityIds = new Set(entities.map((e) => e.id));
  const domainById = new Map<string, EntityDomain>(entities.map((e) => [e.id, e.domain]));
  const relationshipIds = new Set(relations.map((r) => r.id));
  const citationIds = new Set(CITATIONS.map((c) => c.id));

  const issues: string[] = [];
  issues.push(...validateSources());
  issues.push(...validateCitations());
  issues.push(
    ...validateProvenance(PROVENANCE, {
      entityIds,
      relationshipIds,
      citationIds,
      getDomain: (id) => domainById.get(id),
    }),
  );
  issues.push(...validateReviews(REVIEWS, entityIds));
  issues.push(...validateVersions());

  // Evidence-framework consistency: interpretive must never be a science level.
  if (SCIENCE_EVIDENCE_LEVELS.includes("interpretive")) {
    issues.push("evidence: interpretive level leaked into scientific levels");
  }
  return issues;
}
