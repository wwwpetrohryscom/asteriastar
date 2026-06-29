/**
 * Editorial workflow architecture (no workflow implementation).
 *
 * The lifecycle status a page/object can carry. Architecture only — there is no
 * authoring backend; this types the states a future editorial workflow uses.
 */

export type EditorialStatus =
  | "draft"
  | "in-review"
  | "reviewed"
  | "verified"
  | "archived"
  | "superseded"
  | "deprecated";

export const EDITORIAL_STATUSES: EditorialStatus[] = [
  "draft",
  "in-review",
  "reviewed",
  "verified",
  "archived",
  "superseded",
  "deprecated",
];

export const EDITORIAL_STATUS_LABELS: Record<EditorialStatus, string> = {
  draft: "Draft",
  "in-review": "In review",
  reviewed: "Reviewed",
  verified: "Verified",
  archived: "Archived",
  superseded: "Superseded",
  deprecated: "Deprecated",
};

export const EDITORIAL_STATUS_DESCRIPTIONS: Record<EditorialStatus, string> = {
  draft: "Being written; not yet ready for review.",
  "in-review": "Under scientific and editorial review.",
  reviewed: "Reviewed for accuracy.",
  verified: "Reviewed and verified against sources.",
  archived: "Retained for the record but no longer maintained.",
  superseded: "Replaced by a newer version.",
  deprecated: "Discouraged; kept only to avoid breaking references.",
};

export const EDITORIAL_STATUS_ACCENT: Record<EditorialStatus, string> = {
  draft: "stone",
  "in-review": "comet",
  reviewed: "halo",
  verified: "halo",
  archived: "stone",
  superseded: "ember",
  deprecated: "ember",
};

/** Statuses considered "live" content for readers. */
export function isPublishedEditorialStatus(s: EditorialStatus): boolean {
  return s === "reviewed" || s === "verified";
}

export function isEditorialStatus(s: string): s is EditorialStatus {
  return (EDITORIAL_STATUSES as string[]).includes(s);
}
