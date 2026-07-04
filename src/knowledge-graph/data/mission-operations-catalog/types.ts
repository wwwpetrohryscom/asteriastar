import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Ground Segment & Mission Operations Encyclopedia data model (Program AF) — the
 * operational infrastructure behind every mission: the control centres and the operational
 * functions that fly spacecraft. Curated from NASA, ESA, JAXA, ISRO, Roscosmos, and CNSA.
 * Organizations, tracking networks, and missions are REUSED from the existing graph; only
 * the operations-centre and operations-function entities are created here. Nothing is
 * fabricated — unknown values are omitted.
 */

export type OpsKind =
  | "center" // a mission operations / control centre
  | "function"; // an operational function / activity / lifecycle phase

export const KIND_ENTITY_TYPE: Record<OpsKind, EntityType> = {
  center: "mission_operations_center",
  function: "operations_function",
};

export const KIND_LABEL: Record<OpsKind, string> = {
  center: "Operations centre",
  function: "Operations function",
};

export type OpsCategory = "center" | "control" | "dynamics" | "planning" | "health" | "lifecycle";

export interface OpsRecord {
  id: string;
  slug: string;
  name: string;
  kind: OpsKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];

  /* cross-references (reuse existing entities) */
  operatorKey?: string; // full organization id (operated_by) — the agency
  networkKeys?: string[]; // full tracking_network ids (associated_with) — DSN/Estrack ops
  relatedKeys?: string[]; // full ids (associated_with) — centres, functions, missions

  /* display specs, all optional */
  category?: OpsCategory;
  locationLabel?: string;
  countryLabel?: string;
  agencyLabel?: string;
  role?: string;
  definition?: string;
  highlights?: string[];
}
