import {
  CONTRIBUTION_TYPE_BY_ID,
  type Contribution,
  type ContributionType,
  type ReviewTrack,
} from "@/platform/contributions/schema";
import { nextStates, type ContributionState } from "@/platform/contributions/states";
import { ROLES, TRANSITION_CAPABILITY, requiredCapabilityForState, rolesWithCapability, type RoleId, type Capability, roleHasCapability } from "@/platform/contributions/roles";

/**
 * Review workflow engine — pure decision logic, no side effects.
 *
 * Given a proposal's current state, this determines the valid review actions,
 * which review track applies, whether scientific review is required, and which
 * role may take an action. It never applies a change and never persists a note.
 */

export type ReviewDecision =
  | "advance_editorial"
  | "advance_scientific"
  | "request_sources"
  | "request_changes"
  | "accept"
  | "reject"
  | "archive";

/** The target state a decision moves a proposal into. */
export const DECISION_TARGET: Record<ReviewDecision, ContributionState> = {
  advance_editorial: "under_editorial_review",
  advance_scientific: "under_scientific_review",
  request_sources: "needs_sources",
  request_changes: "needs_changes",
  accept: "accepted",
  reject: "rejected",
  archive: "archived",
};

export function reviewTrackFor(type: ContributionType): ReviewTrack {
  return CONTRIBUTION_TYPE_BY_ID[type].track;
}

/**
 * Which capability conducts the specialized review for each track. The two
 * formal review STATES (editorial, scientific) are the phases every proposal
 * passes through; within them, a track's specialist — a Source, Image, or
 * Translation Reviewer — does the domain-specific check. This is what gives the
 * `review_sources` / `review_images` / `review_translations` capabilities a real
 * referent (they are not orphaned): they gate who reviews a track's proposals.
 */
export const TRACK_REVIEW_CAPABILITY: Record<ReviewTrack, Capability> = {
  editorial: "review_editorial",
  scientific: "review_scientific",
  source: "review_sources",
  image: "review_images",
  translation: "review_translations",
};

export function reviewCapabilityForTrack(track: ReviewTrack): Capability {
  return TRACK_REVIEW_CAPABILITY[track];
}

/** The roles permitted to review a contribution on a given track. */
export function rolesForTrack(track: ReviewTrack): RoleId[] {
  return rolesWithCapability(TRACK_REVIEW_CAPABILITY[track]);
}

/** Capabilities that are authority stewardship, not tied to a transition or track. */
const STEWARDSHIP_CAPABILITIES: Capability[] = ["manage"];

/**
 * Self-check: every review track maps to a capability that at least one role
 * holds, AND no capability is orphaned (every capability a role holds must be
 * referenced by a state transition, a review track, or be explicit stewardship).
 * This is what makes the specialized reviewer capabilities meaningful.
 */
export function validateReviewTracks(): string[] {
  const issues: string[] = [];
  for (const [track, cap] of Object.entries(TRACK_REVIEW_CAPABILITY) as [ReviewTrack, Capability][]) {
    if (rolesWithCapability(cap).length === 0) {
      issues.push(`review track '${track}' needs capability '${cap}' that no role holds`);
    }
  }
  const referenced = new Set<Capability>([
    ...(Object.values(TRANSITION_CAPABILITY).filter(Boolean) as Capability[]),
    ...(Object.values(TRACK_REVIEW_CAPABILITY) as Capability[]),
    ...STEWARDSHIP_CAPABILITIES,
  ]);
  for (const cap of new Set(ROLES.flatMap((r) => r.capabilities))) {
    if (!referenced.has(cap)) {
      issues.push(`capability '${cap}' is held by a role but not referenced by any transition or review track (orphaned)`);
    }
  }
  return issues;
}

/**
 * Whether a contribution must pass scientific review. Sourced factual claims in
 * the science domain, and anything on the scientific track, require it.
 */
export function requiresScientificReview(contribution: Contribution): boolean {
  const def = CONTRIBUTION_TYPE_BY_ID[contribution.type];
  return def.track === "scientific" || (def.requiresSource && contribution.domain === "science");
}

/** The review decisions available from a given state (valid transitions only). */
export function availableDecisions(from: ContributionState): ReviewDecision[] {
  const targets = new Set(nextStates(from));
  return (Object.entries(DECISION_TARGET) as [ReviewDecision, ContributionState][])
    .filter(([, to]) => targets.has(to))
    .map(([decision]) => decision);
}

/** Whether a role is permitted to take a decision (holds the required capability). */
export function roleCanDecide(role: RoleId, decision: ReviewDecision): boolean {
  const cap = requiredCapabilityForState(DECISION_TARGET[decision]);
  return cap ? roleHasCapability(role, cap) : true;
}

/* --------------------------------------------------------------- review notes */
export interface ReviewNote {
  id: string;
  proposalId: string;
  track: ReviewTrack;
  authorRole: RoleId;
  decision: ReviewDecision;
  note: string;
}

/** Live review-note registry — intentionally EMPTY. No fabricated reviews. */
export const REVIEW_NOTES: ReviewNote[] = [];

export function validateReviewNote(n: ReviewNote): string[] {
  const issues: string[] = [];
  if (!n.note?.trim()) issues.push(`${n.id}: a review note must record its reasoning`);
  if (!(n.decision in DECISION_TARGET)) issues.push(`${n.id}: unknown review decision ${n.decision}`);
  if (!roleCanDecide(n.authorRole, n.decision)) {
    issues.push(`${n.id}: role ${n.authorRole} is not permitted to ${n.decision}`);
  }
  return issues;
}

export function validateReviewNotes(notes: ReviewNote[] = REVIEW_NOTES): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const n of notes) {
    if (seen.has(n.id)) issues.push(`duplicate review note id: ${n.id}`);
    seen.add(n.id);
    issues.push(...validateReviewNote(n));
  }
  return issues;
}
