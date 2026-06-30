import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { getReviewForEntity, reviewStatusFor, type EntityReview, type ReviewStatus } from "@/platform/authority/review";
import { allowedEvidenceForDomain, type EvidenceLevel } from "@/platform/authority/evidence";
import { PROVENANCE, type ProvenanceRecord } from "@/platform/authority/provenance";
import { VERSIONS, type VersionRecord } from "@/platform/authority/versioning";
import { computeAuthoritySnapshot, type AuthoritySnapshot } from "@/platform/authority/authority";
import { getEntityById, GRAPH_VERSION_INFO } from "@/knowledge-graph";

/**
 * Authority Engine — one interface to evidence, sources, review, quality,
 * version, and provenance for an entity. Delegates to the Phase 9 authority
 * layer; nothing else needs to import its modules individually.
 */
export const authorityEngine = {
  quality: (id: string): EntityQuality | null => {
    const e = getEntityById(id);
    return e ? computeEntityQuality(e) : null;
  },
  review: (id: string): EntityReview | undefined => getReviewForEntity(id),
  reviewStatus: (id: string): ReviewStatus => reviewStatusFor(id),
  evidenceLevels: (id: string): EvidenceLevel[] => {
    const e = getEntityById(id);
    return e ? allowedEvidenceForDomain(e.domain) : [];
  },
  provenanceFor: (id: string): ProvenanceRecord[] => PROVENANCE.filter((p) => p.entityId === id),
  versionFor: (id: string): VersionRecord[] => VERSIONS.filter((v) => v.objectId === id),
  snapshot: (): AuthoritySnapshot => computeAuthoritySnapshot(),
  graphVersion: GRAPH_VERSION_INFO,
};
