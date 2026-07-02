import type { EvidenceLevel } from "@/platform/authority/evidence";
import { validateEvidenceAssignment } from "@/platform/authority/evidence";
import type { SourceKey } from "@/lib/sources";
import type { Confidence, EntityDomain } from "@/knowledge-graph";
import { SEED_PROVENANCE } from "@/platform/authority/data/flagship-provenance";

/**
 * Scientific provenance system.
 *
 * The typed model for "where a fact comes from". Every scientific statement can
 * eventually carry its evidence, sources, review, and change history. The
 * registry ships EMPTY — no fabricated facts, no invented certainty. Records are
 * added only when backed by real, verified sources.
 */

export interface ProvenanceReference {
  organization: string;
  publication?: string;
  authors?: string[];
  publicationDate?: string;
  doi?: string;
  url?: string;
  license?: string;
  /** Link to the source registry, when the reference is one of our sources. */
  source?: SourceKey;
}

export interface ProvenanceChange {
  date: string;
  reason: string;
  reviewer?: string;
}

export interface ProvenanceRecord {
  /** Permanent provenance id, e.g. "prov:planet-mars-radius". */
  id: string;
  entityId: string;
  /** Optional relationship this fact supports. */
  relationshipId?: string;
  /** The scientific statement this record substantiates. */
  statement: string;
  evidenceLevel: EvidenceLevel;
  confidence?: Confidence;
  primarySource?: ProvenanceReference;
  secondarySources?: ProvenanceReference[];
  /** Citation ids into the citation registry. */
  citationIds?: string[];
  reviewDate?: string;
  reviewer?: string;
  editorialNote?: string;
  version: string;
  changeHistory?: ProvenanceChange[];
}

/**
 * Real, source-backed provenance records. Program N seeds the first batch for
 * flagship entities (SEED_PROVENANCE); nothing is fabricated.
 */
export const PROVENANCE: ProvenanceRecord[] = [...SEED_PROVENANCE];

export interface ProvenanceValidationContext {
  /** Known entity ids (provenance must reference a real entity). */
  entityIds?: Set<string>;
  /** Known relationship ids. */
  relationshipIds?: Set<string>;
  /** Known citation ids (provenance citationIds must resolve). */
  citationIds?: Set<string>;
  /** Resolve an entity's domain to enforce evidence/domain separation. */
  getDomain?: (entityId: string) => EntityDomain | undefined;
}

/** Validate provenance records (structure, evidence, and reference integrity). */
export function validateProvenance(
  records: ProvenanceRecord[] = PROVENANCE,
  ctx: ProvenanceValidationContext = {},
): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const r of records) {
    if (seen.has(r.id)) issues.push(`duplicate provenance id: ${r.id}`);
    seen.add(r.id);
    if (!r.statement?.trim()) issues.push(`${r.id}: missing statement`);
    if (!r.version?.trim()) issues.push(`${r.id}: missing version`);
    if (!r.evidenceLevel) issues.push(`${r.id}: missing evidence level`);

    if (ctx.entityIds && !ctx.entityIds.has(r.entityId)) {
      issues.push(`${r.id}: unknown entity id ${r.entityId}`);
    }
    if (r.relationshipId && ctx.relationshipIds && !ctx.relationshipIds.has(r.relationshipId)) {
      issues.push(`${r.id}: unknown relationship id ${r.relationshipId}`);
    }
    for (const cid of r.citationIds ?? []) {
      if (ctx.citationIds && !ctx.citationIds.has(cid)) {
        issues.push(`${r.id}: broken citation reference ${cid}`);
      }
    }

    // Evidence/domain separation: a scientific statement must not be interpretive,
    // and an interpretive entity's record must be interpretive.
    const domain = ctx.getDomain?.(r.entityId);
    if (domain && r.evidenceLevel) {
      issues.push(...validateEvidenceAssignment(r.evidenceLevel, domain, r.id));
    }

    // A scientific fact must carry a source placeholder (primary, secondary, or citation).
    const hasSource =
      Boolean(r.primarySource) ||
      (r.secondarySources?.length ?? 0) > 0 ||
      (r.citationIds?.length ?? 0) > 0;
    if (domain === "science" && r.evidenceLevel !== "unknown" && !hasSource) {
      issues.push(`${r.id}: scientific fact has no source placeholder`);
    }
  }
  return issues;
}

export const PROVENANCE_STATS = {
  records: PROVENANCE.length,
} as const;
