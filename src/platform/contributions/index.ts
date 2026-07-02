/**
 * Scientific Contributions & Review Workflow (Program M).
 *
 * A controlled, review-first workflow that turns every proposed improvement into
 * a structured, traceable, versioned proposal attached to real knowledge-graph
 * objects. The graph stays the source of truth; contributions are proposals, not
 * truth. Pure, deterministic, framework-independent, graph/source/version-aware.
 * No authentication, no database, no live submissions, no fabricated data.
 */
export * from "@/platform/contributions/schema";
export * from "@/platform/contributions/states";
export * from "@/platform/contributions/roles";
export * from "@/platform/contributions/proposals";
export * from "@/platform/contributions/changesets";
export * from "@/platform/contributions/review";
export * from "@/platform/contributions/quality";
export * from "@/platform/contributions/conflicts";
export * from "@/platform/contributions/notifications";
export * from "@/platform/contributions/audit";
export * from "@/platform/contributions/security";
export * from "@/platform/contributions/portal";
export { validateContribution, validateContributions, validateContributionArchitecture } from "@/platform/contributions/validation";

import { CONTRIBUTION_TYPES, CONTRIBUTION_TYPE_BY_ID, PROPOSALS, type ContributionType } from "@/platform/contributions/schema";
import { CONTRIBUTION_STATES, TRANSITIONS, STATE_LABELS, STATE_DESCRIPTIONS, nextStates, canTransition, validateStateHistory } from "@/platform/contributions/states";
import { ROLES, rolesAllowedToEnter } from "@/platform/contributions/roles";
import { CHANGE_KINDS, CHANGESETS } from "@/platform/contributions/changesets";
import { reviewTrackFor, requiresScientificReview, availableDecisions, rolesForTrack, REVIEW_NOTES } from "@/platform/contributions/review";
import { IMPACT_CATEGORIES, contributionImpact } from "@/platform/contributions/quality";
import { detectChangesetConflicts, detectDuplicateProposals } from "@/platform/contributions/conflicts";
import { NOTIFICATION_EVENTS, recipientsFor } from "@/platform/contributions/notifications";
import { AUDIT_LOG, validateAuditTrail } from "@/platform/contributions/audit";
import { SECURITY_CONTROLS } from "@/platform/contributions/security";
import { validateContribution, validateContributions, validateContributionArchitecture } from "@/platform/contributions/validation";

/**
 * The unified contributions surface, exposed as `engine.contributions`.
 * Read-only and deterministic; it exposes the workflow architecture and the
 * (empty) live registries, never mutating anything.
 */
export const contributionsEngine = {
  // registry
  types: () => CONTRIBUTION_TYPES,
  typeById: (id: ContributionType) => CONTRIBUTION_TYPE_BY_ID[id],
  states: () => CONTRIBUTION_STATES,
  transitions: () => TRANSITIONS,
  stateLabel: (s: (typeof CONTRIBUTION_STATES)[number]) => STATE_LABELS[s],
  roles: () => ROLES,
  changeKinds: () => CHANGE_KINDS,
  impactCategories: () => IMPACT_CATEGORIES,
  securityControls: () => SECURITY_CONTROLS,
  notificationEvents: () => NOTIFICATION_EVENTS,

  // workflow logic
  nextStates,
  canTransition,
  availableDecisions,
  reviewTrackFor,
  requiresScientificReview,
  rolesForTrack,
  rolesAllowedToEnter,
  contributionImpact,
  recipientsFor,

  // validation
  validateContribution,
  validateContributions,
  validateStateHistory,
  validateAuditTrail,
  validate: validateContributionArchitecture,

  // conflict detection
  detectChangesetConflicts,
  detectDuplicateProposals,

  // live registries (all empty — no fabricated data)
  proposals: () => PROPOSALS,
  changesets: () => CHANGESETS,
  reviewNotes: () => REVIEW_NOTES,
  auditLog: () => AUDIT_LOG,

  // guidelines bundle for the read-only API
  guidelines: () => ({
    principle: "No contribution changes the knowledge graph directly. Every contribution is a proposal that must be validated and reviewed before any versioned graph update.",
    types: CONTRIBUTION_TYPES.map((t) => ({ id: t.id, label: t.label, description: t.description, track: t.track, requiredTargets: t.requiredTargets, requiresSource: t.requiresSource, impact: t.impact })),
    states: CONTRIBUTION_STATES.map((s) => ({ id: s, label: STATE_LABELS[s], description: STATE_DESCRIPTIONS[s], next: nextStates(s) })),
    roles: ROLES.map((r) => ({ id: r.id, label: r.label, description: r.description, capabilities: r.capabilities })),
    security: SECURITY_CONTROLS.map((c) => ({ id: c.id, label: c.label, stage: c.stage, description: c.description })),
  }),

  stats: {
    types: CONTRIBUTION_TYPES.length,
    states: CONTRIBUTION_STATES.length,
    roles: ROLES.length,
    changeKinds: CHANGE_KINDS.length,
    impactCategories: IMPACT_CATEGORIES.length,
    securityControls: SECURITY_CONTROLS.length,
    proposals: PROPOSALS.length,
    changesets: CHANGESETS.length,
    reviewNotes: REVIEW_NOTES.length,
    auditEntries: AUDIT_LOG.length,
  },
} as const;
