import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Space Agencies, Institutions & Laboratories Encyclopedia data model (Program AJ) — the
 * organizations that fund, build, and operate the world's spacecraft, and the structure
 * that connects them. The many `organization` entities already in the graph (NASA, ESA,
 * JAXA, ISRO, the commercial launch providers, the observatory operators, JPL) are REUSED
 * and enriched with their institution type; only the missing field centers and laboratories
 * are created, each linked `part_of` its parent agency. Nothing is fabricated — founding
 * years and figures are omitted when uncertain; only well-established locations and roles
 * are recorded.
 */

export type InstKind =
  | "type" // a class of institution (space agency, field center, laboratory, …)
  | "org"; // an organization (existing organization reused, or a new field center / lab)

export const KIND_ENTITY_TYPE: Record<InstKind, EntityType> = {
  type: "institution_type",
  org: "organization",
};

export const KIND_LABEL: Record<InstKind, string> = {
  type: "Institution type",
  org: "Institution",
};

export type InstCategory =
  | "agency"
  | "field-center"
  | "laboratory"
  | "institute"
  | "commercial"
  | "observatory";

export interface InstRecord {
  id: string;
  slug: string;
  name: string;
  kind: InstKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  typeSlug?: string; // → institution_type (member_of_group) — for orgs
  parentKey?: string; // full organization id (part_of) — for orgs that belong to a parent
  relatedKeys?: string[]; // full ids (associated_with) — missions/instruments/other orgs

  /* display */
  category?: InstCategory;
  locationLabel?: string; // city, region/country — established facts only
  role?: string;
  definition?: string;
  highlights?: string[];
}
