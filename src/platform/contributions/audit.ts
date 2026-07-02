import { validateTransition, validateStateHistory, type ContributionState } from "@/platform/contributions/states";
import { requiredCapabilityForState, roleHasCapability, type RoleId } from "@/platform/contributions/roles";

/**
 * Audit trail — the immutable record of what happened to each proposal.
 *
 * Every state change is an audit entry. The trail is ordered per proposal by a
 * monotonic `sequence` (not a wall-clock time — the workflow is deterministic and
 * has no backend clock). The registry is EMPTY: there is no fabricated approval
 * history. Validation rejects any impossible or unauthorized transition.
 */

export interface AuditEntry {
  id: string;
  proposalId: string;
  /** Monotonic per-proposal order (0, 1, 2, …) — not a timestamp. */
  sequence: number;
  actorRole: RoleId;
  fromState: ContributionState | null;
  toState: ContributionState;
  note?: string;
}

/** Live audit trail — intentionally EMPTY. No fabricated approval history. */
export const AUDIT_LOG: AuditEntry[] = [];

/**
 * Validate an audit trail: entries group by proposal, order by sequence, and the
 * resulting state history must be a legal, authorized walk of the state machine.
 */
export function validateAuditTrail(entries: AuditEntry[] = AUDIT_LOG): string[] {
  const issues: string[] = [];
  const byProposal = new Map<string, AuditEntry[]>();
  for (const e of entries) {
    const list = byProposal.get(e.proposalId) ?? [];
    list.push(e);
    byProposal.set(e.proposalId, list);
  }

  for (const [proposalId, group] of byProposal) {
    const ordered = group.slice().sort((a, b) => a.sequence - b.sequence);

    // Sequences must be unique and contiguous from 0.
    ordered.forEach((e, i) => {
      if (e.sequence !== i) issues.push(`${proposalId}: audit sequence gap/dup at index ${i} (got ${e.sequence})`);
    });

    // Each entry's fromState must equal the previous toState.
    for (let i = 0; i < ordered.length; i++) {
      const e = ordered[i];
      const prevTo = i === 0 ? null : ordered[i - 1].toState;
      if (e.fromState !== prevTo) {
        issues.push(`${proposalId}: audit entry ${e.sequence} fromState ${e.fromState} != previous toState ${prevTo}`);
      }
      // The transition itself must be legal (except the initial draft/submitted entry).
      if (e.fromState) {
        const err = validateTransition(e.fromState, e.toState);
        if (err) issues.push(`${proposalId}: audit entry ${e.sequence}: ${err}`);
      }
      // The actor must be permitted to enter the target state.
      const cap = requiredCapabilityForState(e.toState);
      if (cap && !roleHasCapability(e.actorRole, cap)) {
        issues.push(`${proposalId}: audit entry ${e.sequence}: role ${e.actorRole} cannot move to ${e.toState}`);
      }
    }

    // The full history must be a legal walk.
    issues.push(...validateStateHistory(ordered.map((e) => e.toState)).map((m) => `${proposalId}: ${m}`));
  }
  return issues;
}
