import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Space Policy, Sustainability & Space Economy data model (Program BC) — the institutional and
 * operational layer of modern space activity. It REUSES the on-orbit-servicing process, the
 * in-situ-resource-utilisation domain, the planetary-protection topic and its contamination
 * measures, the space-weather satellite-impact, and NASA already in the graph. The new entities are
 * the space-law treaties, the policy and sustainability topics, and the space-economy topics; the
 * governing organisations (UNOOSA, COSPAR, the ITU, the IAF) are created with the existing
 * organization type. Nothing is fabricated; treaty years are historical facts.
 */

export type PolicyKind =
  | "treaty" // a space-law treaty or accord
  | "topic" // a space-policy / sustainability topic
  | "economy" // a space-economy topic
  | "organization"; // a governing organisation (reused organization type)

export const KIND_ENTITY_TYPE: Record<PolicyKind, EntityType> = {
  treaty: "space_treaty",
  topic: "space_policy_topic",
  economy: "space_economy_topic",
  organization: "organization",
};

export const KIND_LABEL: Record<PolicyKind, string> = {
  treaty: "Treaty / accord",
  topic: "Policy & sustainability",
  economy: "Space economy",
  organization: "Organisation",
};

export interface PolicyRecord {
  id: string;
  slug: string;
  name: string;
  kind: PolicyKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  tagLabel?: string; // e.g. "1967 treaty" / "Sustainability" / "UN body" — only when well established
  definition?: string;
  highlights?: string[];
}
