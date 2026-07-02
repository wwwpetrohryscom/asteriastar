import { ROLES, type RoleId } from "@/platform/contributions/roles";

/**
 * Notifications model — ARCHITECTURE ONLY.
 *
 * Defines the events a future review system would emit and which roles should
 * receive them. There is no delivery, no channel, no queue, and no stored
 * message here — only the model. Nothing is sent.
 */

export type NotificationEventType =
  | "proposal_submitted"
  | "proposal_triaged"
  | "sources_requested"
  | "changes_requested"
  | "editorial_review_started"
  | "scientific_review_started"
  | "proposal_accepted"
  | "proposal_rejected"
  | "proposal_superseded"
  | "conflict_detected";

export interface NotificationEventDef {
  type: NotificationEventType;
  label: string;
  /** Roles that should be notified when this event occurs. */
  recipients: RoleId[];
}

export const NOTIFICATION_EVENTS: NotificationEventDef[] = [
  { type: "proposal_submitted", label: "Proposal submitted", recipients: ["editor", "maintainer"] },
  { type: "proposal_triaged", label: "Proposal triaged", recipients: ["contributor"] },
  { type: "sources_requested", label: "Sources requested", recipients: ["contributor"] },
  { type: "changes_requested", label: "Changes requested", recipients: ["contributor"] },
  { type: "editorial_review_started", label: "Editorial review started", recipients: ["editor", "contributor"] },
  { type: "scientific_review_started", label: "Scientific review started", recipients: ["scientific_reviewer", "contributor"] },
  { type: "proposal_accepted", label: "Proposal accepted", recipients: ["contributor", "maintainer"] },
  { type: "proposal_rejected", label: "Proposal rejected", recipients: ["contributor"] },
  { type: "proposal_superseded", label: "Proposal superseded", recipients: ["contributor", "maintainer"] },
  { type: "conflict_detected", label: "Conflict detected", recipients: ["editor", "maintainer"] },
];

export const NOTIFICATION_EVENT_BY_TYPE: Record<NotificationEventType, NotificationEventDef> =
  Object.fromEntries(NOTIFICATION_EVENTS.map((e) => [e.type, e])) as Record<NotificationEventType, NotificationEventDef>;

export function recipientsFor(type: NotificationEventType): RoleId[] {
  return NOTIFICATION_EVENT_BY_TYPE[type]?.recipients ?? [];
}

/** Self-check: every recipient is a real role. */
export function validateNotificationModel(): string[] {
  const issues: string[] = [];
  const roleIds = new Set<RoleId>(ROLES.map((r) => r.id));
  for (const e of NOTIFICATION_EVENTS) {
    if (e.recipients.length === 0) issues.push(`notification ${e.type} has no recipients`);
    for (const r of e.recipients) {
      if (!roleIds.has(r)) issues.push(`notification ${e.type} references unknown role ${r}`);
    }
  }
  return issues;
}
