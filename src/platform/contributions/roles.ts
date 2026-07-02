import type { ContributionState } from "@/platform/contributions/states";

/**
 * Review roles and their permissions — ARCHITECTURE ONLY.
 *
 * No accounts, no authentication, no identities. This defines the roles a future
 * review system will grant and the capabilities each role carries, plus which
 * capability authorizes which state transition. Nothing here logs anyone in.
 */

export type RoleId =
  | "contributor"
  | "editor"
  | "scientific_reviewer"
  | "source_reviewer"
  | "image_reviewer"
  | "translator"
  | "maintainer"
  | "institutional_partner";

export type Capability =
  | "submit"
  | "triage"
  | "request_changes"
  | "request_sources"
  | "review_editorial"
  | "review_scientific"
  | "review_sources"
  | "review_images"
  | "review_translations"
  | "accept"
  | "reject"
  | "supersede"
  | "deprecate"
  | "archive"
  | "manage";

export interface RoleDef {
  id: RoleId;
  label: string;
  description: string;
  capabilities: Capability[];
}

export const ROLES: RoleDef[] = [
  { id: "contributor", label: "Contributor", description: "Anyone proposing an improvement — a researcher, educator, or enthusiast.", capabilities: ["submit"] },
  { id: "editor", label: "Editor", description: "Checks scope, clarity, policy, and routes proposals; runs editorial review.", capabilities: ["triage", "request_changes", "request_sources", "review_editorial", "reject", "archive"] },
  { id: "scientific_reviewer", label: "Scientific Reviewer", description: "A domain expert who verifies scientific accuracy and evidence.", capabilities: ["review_scientific", "request_changes", "request_sources", "accept", "reject"] },
  { id: "source_reviewer", label: "Source Reviewer", description: "Verifies that cited sources are authoritative, licensed, and correctly attributed.", capabilities: ["review_sources", "request_sources", "request_changes"] },
  { id: "image_reviewer", label: "Image Reviewer", description: "Verifies image provenance: license, credit, and source.", capabilities: ["review_images", "request_changes"] },
  { id: "translator", label: "Translator", description: "Reviews and refines localized titles and descriptions.", capabilities: ["review_translations", "request_changes"] },
  { id: "maintainer", label: "Maintainer", description: "Stewards the workflow; can accept, supersede, deprecate, and archive.", capabilities: ["triage", "review_editorial", "accept", "reject", "supersede", "deprecate", "archive", "manage"] },
  { id: "institutional_partner", label: "Institutional Partner", description: "A verified observatory, university, or agency contributing at scale.", capabilities: ["submit", "review_scientific", "review_sources"] },
];

export const ROLE_BY_ID: Record<RoleId, RoleDef> =
  Object.fromEntries(ROLES.map((r) => [r.id, r])) as Record<RoleId, RoleDef>;

export function roleHasCapability(role: RoleId, cap: Capability): boolean {
  return ROLE_BY_ID[role]?.capabilities.includes(cap) ?? false;
}

export function rolesWithCapability(cap: Capability): RoleId[] {
  return ROLES.filter((r) => r.capabilities.includes(cap)).map((r) => r.id);
}

/**
 * The capability required to move a proposal INTO a given state. A future review
 * system checks that the acting role holds this capability before applying the
 * transition. (Entering `draft`/`submitted` is the contributor's own action.)
 */
export const TRANSITION_CAPABILITY: Record<ContributionState, Capability | null> = {
  draft: null,
  submitted: "submit",
  triaged: "triage",
  needs_sources: "request_sources",
  needs_changes: "request_changes",
  under_editorial_review: "review_editorial",
  under_scientific_review: "review_scientific",
  accepted: "accept",
  rejected: "reject",
  archived: "archive",
  superseded: "supersede",
  deprecated: "deprecate",
};

export function requiredCapabilityForState(state: ContributionState): Capability | null {
  return TRANSITION_CAPABILITY[state] ?? null;
}

/** Which roles are permitted to move a proposal into `state`. */
export function rolesAllowedToEnter(state: ContributionState): RoleId[] {
  const cap = requiredCapabilityForState(state);
  if (!cap) return ROLES.map((r) => r.id);
  return rolesWithCapability(cap);
}

/** Self-check: every capability referenced by a transition is held by some role. */
export function validateRoles(): string[] {
  const issues: string[] = [];
  const allCaps = new Set(ROLES.flatMap((r) => r.capabilities));
  for (const [state, cap] of Object.entries(TRANSITION_CAPABILITY)) {
    if (cap && !allCaps.has(cap)) issues.push(`state ${state} requires capability '${cap}' that no role holds`);
  }
  const seen = new Set<RoleId>();
  for (const r of ROLES) {
    if (seen.has(r.id)) issues.push(`duplicate role id: ${r.id}`);
    seen.add(r.id);
    if (r.capabilities.length === 0) issues.push(`role ${r.id} has no capabilities`);
  }
  return issues;
}
