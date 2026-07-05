import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Citizen Science, Amateur Astronomy & Public Observing data model (Program AY) — the public
 * participation layer of astronomy. It REUSES the aurora, the stellar-occultation and photometry
 * methods, the meteor showers and constellations, the eruptive-variable-star class, the Stardust
 * mission, the transit exoplanet method, the galaxy-morphology-classification ML application, the
 * Rubin Observatory, and the MAST archive already in the graph. The new entities are the
 * citizen-science projects, the amateur observing activities, the observing equipment, and the
 * public-outreach activities; the amateur organisations are created with the existing organization
 * type (like the AAVSO's professional counterparts). Nothing is fabricated; projects and
 * organisations are named only where real.
 */

export type CitizenKind =
  | "project" // a citizen-science project
  | "activity" // an amateur observing activity
  | "equipment" // a piece of observing equipment
  | "outreach" // a public-outreach activity
  | "organization"; // an amateur-astronomy organisation (reused organization type)

export const KIND_ENTITY_TYPE: Record<CitizenKind, EntityType> = {
  project: "citizen_science_project",
  activity: "amateur_activity",
  equipment: "observing_equipment",
  outreach: "outreach_activity",
  organization: "organization",
};

export const KIND_LABEL: Record<CitizenKind, string> = {
  project: "Citizen-science project",
  activity: "Amateur activity",
  equipment: "Observing equipment",
  outreach: "Public outreach",
  organization: "Organisation",
};

export interface CitizenRecord {
  id: string;
  slug: string;
  name: string;
  kind: CitizenKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  platformLabel?: string; // e.g. "On Zooniverse" / "Naked-eye" — only when well established
  definition?: string;
  highlights?: string[];
}
