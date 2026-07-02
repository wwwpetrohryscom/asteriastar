/**
 * Contribution review states and the state machine that governs them.
 *
 * The lifecycle is review-first: a proposal is validated, triaged, reviewed
 * (editorial and, where required, scientific), and only then accepted — after
 * which a versioned graph update may follow. Every state transition must be
 * valid; invalid transitions are rejected and there is no fabricated history.
 *
 * These contribution-lifecycle states are DISTINCT from the entity-level
 * `ReviewStatus` in the Authority layer (which describes how well-reviewed an
 * entity is). A contribution moving to `accepted` is what may later change an
 * entity's authority review status.
 */

export type ContributionState =
  | "draft"
  | "submitted"
  | "triaged"
  | "needs_sources"
  | "needs_changes"
  | "under_editorial_review"
  | "under_scientific_review"
  | "accepted"
  | "rejected"
  | "archived"
  | "superseded"
  | "deprecated";

export const CONTRIBUTION_STATES: ContributionState[] = [
  "draft", "submitted", "triaged", "needs_sources", "needs_changes",
  "under_editorial_review", "under_scientific_review", "accepted",
  "rejected", "archived", "superseded", "deprecated",
];

export const STATE_LABELS: Record<ContributionState, string> = {
  draft: "Draft",
  submitted: "Submitted",
  triaged: "Triaged",
  needs_sources: "Needs sources",
  needs_changes: "Needs changes",
  under_editorial_review: "Under editorial review",
  under_scientific_review: "Under scientific review",
  accepted: "Accepted",
  rejected: "Rejected",
  archived: "Archived",
  superseded: "Superseded",
  deprecated: "Deprecated",
};

export const STATE_DESCRIPTIONS: Record<ContributionState, string> = {
  draft: "Being prepared by the contributor; not yet submitted for review.",
  submitted: "Submitted for review and waiting to be triaged.",
  triaged: "Validated and routed to the appropriate review track.",
  needs_sources: "Returned to the contributor to add or strengthen sources.",
  needs_changes: "Returned to the contributor with requested changes.",
  under_editorial_review: "An editor is checking scope, clarity, and policy compliance.",
  under_scientific_review: "A scientific reviewer is checking accuracy and evidence.",
  accepted: "Approved. Eligible for a versioned graph update.",
  rejected: "Declined, with a recorded reason.",
  archived: "Closed and retained for the record.",
  superseded: "Replaced by a newer accepted contribution.",
  deprecated: "An accepted change later withdrawn or invalidated.",
};

/** Design accent token per state (reuses the platform accent vocabulary). */
export const STATE_ACCENT: Record<ContributionState, "stone" | "halo" | "comet" | "ember" | "gold" | "plasma"> = {
  draft: "stone",
  submitted: "halo",
  triaged: "halo",
  needs_sources: "ember",
  needs_changes: "ember",
  under_editorial_review: "comet",
  under_scientific_review: "comet",
  accepted: "gold",
  rejected: "ember",
  archived: "stone",
  superseded: "plasma",
  deprecated: "plasma",
};

/** Terminal states — no outgoing transitions except record-keeping to archived. */
export const TERMINAL_STATES: ContributionState[] = ["archived"];

/**
 * Valid transitions. The graph is a DAG-with-returns: proposals can be returned
 * to the contributor (needs_sources / needs_changes) and resubmitted, but the
 * flow always converges on accepted / rejected / archived.
 */
export const TRANSITIONS: Record<ContributionState, ContributionState[]> = {
  draft: ["submitted", "archived"],
  submitted: ["triaged", "rejected", "archived"],
  triaged: ["needs_sources", "needs_changes", "under_editorial_review", "rejected", "archived"],
  needs_sources: ["submitted", "under_editorial_review", "rejected", "archived"],
  needs_changes: ["submitted", "under_editorial_review", "rejected", "archived"],
  under_editorial_review: ["under_scientific_review", "needs_sources", "needs_changes", "accepted", "rejected", "archived"],
  under_scientific_review: ["accepted", "needs_sources", "needs_changes", "rejected", "archived"],
  accepted: ["superseded", "deprecated", "archived"],
  rejected: ["archived"],
  archived: [],
  superseded: ["archived"],
  deprecated: ["archived"],
};

export function nextStates(from: ContributionState): ContributionState[] {
  return TRANSITIONS[from] ?? [];
}

export function canTransition(from: ContributionState, to: ContributionState): boolean {
  return nextStates(from).includes(to);
}

export function isTerminal(state: ContributionState): boolean {
  return nextStates(state).length === 0;
}

/** Validate a single transition; returns an issue string or null. */
export function validateTransition(from: ContributionState, to: ContributionState): string | null {
  if (!CONTRIBUTION_STATES.includes(from)) return `unknown from-state: ${from}`;
  if (!CONTRIBUTION_STATES.includes(to)) return `unknown to-state: ${to}`;
  if (!canTransition(from, to)) return `invalid transition: ${from} → ${to}`;
  return null;
}

/**
 * Validate an ordered sequence of states (a proposal's real history). Every
 * consecutive pair must be a legal transition. Used by the audit trail to reject
 * any fabricated or impossible history.
 */
export function validateStateHistory(history: ContributionState[]): string[] {
  const issues: string[] = [];
  if (history.length === 0) return issues;
  if (history[0] !== "draft" && history[0] !== "submitted") {
    issues.push(`history must start at draft or submitted, not ${history[0]}`);
  }
  for (let i = 1; i < history.length; i++) {
    const err = validateTransition(history[i - 1], history[i]);
    if (err) issues.push(`step ${i}: ${err}`);
  }
  return issues;
}

/** Self-check: the transition table only references known states. */
export function validateStateMachine(): string[] {
  const issues: string[] = [];
  const known = new Set<ContributionState>(CONTRIBUTION_STATES);
  for (const [from, tos] of Object.entries(TRANSITIONS) as [ContributionState, ContributionState[]][]) {
    if (!known.has(from)) issues.push(`transition table has unknown from-state: ${from}`);
    for (const to of tos) {
      if (!known.has(to)) issues.push(`transition ${from} references unknown to-state: ${to}`);
      if (to === from) issues.push(`self-transition not allowed: ${from}`);
    }
  }
  for (const s of CONTRIBUTION_STATES) {
    if (!(s in TRANSITIONS)) issues.push(`state ${s} missing from transition table`);
    if (!(s in STATE_LABELS)) issues.push(`state ${s} missing a label`);
  }
  return issues;
}
