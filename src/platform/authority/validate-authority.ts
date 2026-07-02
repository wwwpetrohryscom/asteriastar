import { getAllGraphEntities, relations, GRAPH_RELEASED, type EntityDomain } from "@/knowledge-graph";
import { validateSources } from "@/lib/sources";
import { validateCitations, CITATIONS, DOI_RE } from "@/lib/citations";
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

  // No future dates: citation and provenance source dates must not postdate the
  // graph release. No invalid DOIs on provenance references either.
  const releaseYear = Number(GRAPH_RELEASED.slice(0, 4));
  const yearOf = (d?: string): number | undefined => {
    const m = d?.match(/\d{4}/);
    return m ? Number(m[0]) : undefined;
  };
  for (const c of CITATIONS) {
    const y = yearOf(c.date);
    if (y !== undefined && y > releaseYear) issues.push(`citation ${c.id}: future date ${c.date}`);
  }
  for (const rv of REVIEWS) {
    const y = yearOf(rv.reviewDate);
    if (y !== undefined && y > releaseYear) issues.push(`review ${rv.entityId}: future reviewDate ${rv.reviewDate}`);
  }
  for (const r of PROVENANCE) {
    for (const ref of [r.primarySource, ...(r.secondarySources ?? [])]) {
      if (!ref) continue;
      const y = yearOf(ref.publicationDate);
      if (y !== undefined && y > releaseYear) issues.push(`provenance ${r.id}: future source date ${ref.publicationDate}`);
      if (ref.doi !== undefined && !DOI_RE.test(ref.doi)) issues.push(`provenance ${r.id}: invalid DOI syntax "${ref.doi}"`);
    }
  }

  // Evidence-framework consistency: interpretive must never be a science level.
  if (SCIENCE_EVIDENCE_LEVELS.includes("interpretive")) {
    issues.push("evidence: interpretive level leaked into scientific levels");
  }
  return issues;
}
