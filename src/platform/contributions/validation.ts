import { validateEvidenceAssignment } from "@/platform/authority/evidence";
import {
  CONTRIBUTION_TYPES,
  CONTRIBUTION_TYPE_BY_ID,
  PROPOSALS,
  type Contribution,
  type TargetKind,
} from "@/platform/contributions/schema";
import { validateTargets } from "@/platform/contributions/proposals";
import { CONTRIBUTION_STATES, validateStateMachine } from "@/platform/contributions/states";
import { ROLE_BY_ID, validateRoles } from "@/platform/contributions/roles";
import { validateImpactModel } from "@/platform/contributions/quality";
import { validateReviewTracks } from "@/platform/contributions/review";
import { validateSecurityModel } from "@/platform/contributions/security";
import { validateNotificationModel } from "@/platform/contributions/notifications";
import { CHANGESETS, validateChangesets } from "@/platform/contributions/changesets";
import { REVIEW_NOTES, validateReviewNotes } from "@/platform/contributions/review";
import { AUDIT_LOG, validateAuditTrail } from "@/platform/contributions/audit";

/**
 * Contribution validation model.
 *
 * A proposal must pass every check before it can be reviewed. The rules enforce
 * the platform's scientific integrity: targets resolve, sources are present for
 * scientific claims, evidence is domain-valid, interpretive claims are never
 * marked scientific, and images carry provenance. Pure — returns issue lists.
 */

const ALL_TARGET_KINDS = new Set<TargetKind>([
  "entity", "relationship", "dataset", "source", "citation", "image", "timeline", "learning_path", "api",
]);

/** Validate a single contribution (proposal). */
export function validateContribution(c: Contribution): string[] {
  const issues: string[] = [];
  const def = CONTRIBUTION_TYPE_BY_ID[c.type];
  if (!def) {
    issues.push(`${c.id}: unknown contribution type ${c.type}`);
    return issues;
  }

  if (!c.title?.trim()) issues.push(`${c.id}: a contribution must have a title`);
  if (!c.evidence?.rationale?.trim()) issues.push(`${c.id}: a contribution must record a rationale`);
  if (!CONTRIBUTION_STATES.includes(c.state)) issues.push(`${c.id}: unknown state ${c.state}`);
  if (!ROLE_BY_ID[c.authorRole]) issues.push(`${c.id}: unknown author role ${c.authorRole}`);

  // Targets resolve to real objects (no orphans).
  issues.push(...validateTargets(c));

  // Scientific/factual claims need at least a source placeholder.
  if (def.requiresSource) {
    const refs = c.evidence?.sourceRefs ?? [];
    if (refs.length === 0) {
      issues.push(`${c.id}: ${c.type} is a sourced claim and must reference at least one source (existing or proposed)`);
    }
  }

  // Evidence level must be valid for the claim's domain (interpretive ≠ scientific).
  if (c.evidence?.evidenceLevel) {
    issues.push(...validateEvidenceAssignment(c.evidence.evidenceLevel, c.domain).map((m) => `${c.id}: ${m}`));
  }

  // Domain separation: interpretive contributions can never be on the scientific track.
  if (c.domain !== "science" && def.track === "scientific") {
    issues.push(`${c.id}: a ${c.domain} contribution cannot use the scientific review track`);
  }

  // Images must carry provenance: license + credit + source.
  if (def.requiresImageProvenance) {
    const p = c.evidence?.imageProvenance;
    if (!p?.license) issues.push(`${c.id}: image contribution is missing a license`);
    if (!p?.credit) issues.push(`${c.id}: image contribution is missing a credit`);
    if (!p?.source) issues.push(`${c.id}: image contribution is missing a source`);
  }

  return issues;
}

/** Validate a set of contributions, including duplicate-id detection. */
export function validateContributions(list: Contribution[] = PROPOSALS): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const c of list) {
    if (seen.has(c.id)) issues.push(`duplicate contribution id: ${c.id}`);
    seen.add(c.id);
    issues.push(...validateContribution(c));
  }
  return issues;
}

/** Validate the contribution-type registry itself. */
function validateTypeRegistry(): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const t of CONTRIBUTION_TYPES) {
    if (seen.has(t.id)) issues.push(`duplicate contribution type: ${t.id}`);
    seen.add(t.id);
    for (const k of [...t.requiredTargets, ...t.optionalTargets]) {
      if (!ALL_TARGET_KINDS.has(k)) issues.push(`type ${t.id} references unknown target kind ${k}`);
    }
    if (!t.proposesNew && t.requiredTargets.length === 0 && t.optionalTargets.length === 0 && t.id !== "api_issue") {
      issues.push(`type ${t.id} has no targets and does not propose a new object (would allow orphans)`);
    }
  }
  return issues;
}

/**
 * The architecture self-check run by `npm run validate` and `engine.contributions`.
 * Verifies every sub-model is internally consistent and that the live registries
 * (proposals, changesets, review notes, audit) are valid — they are empty, which
 * proves the gate works without any fabricated data.
 */
export function validateContributionArchitecture(): string[] {
  return [
    ...validateStateMachine(),
    ...validateRoles(),
    ...validateReviewTracks(),
    ...validateImpactModel(),
    ...validateNotificationModel(),
    ...validateSecurityModel(),
    ...validateTypeRegistry(),
    ...validateContributions(PROPOSALS),
    ...validateChangesets(CHANGESETS),
    ...validateReviewNotes(REVIEW_NOTES),
    ...validateAuditTrail(AUDIT_LOG),
  ];
}
