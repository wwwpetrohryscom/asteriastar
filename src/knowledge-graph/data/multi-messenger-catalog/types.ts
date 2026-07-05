import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Multi-Messenger & Gravitational-Wave Operations data model (Program AZ) — the knowledge layer of
 * modern multi-messenger astronomy. It REUSES the LIGO, Virgo and KAGRA detectors and the LISA
 * concept, the gravitational-wave-detection, multi-messenger and neutrino methods and
 * interferometry, the kilonova, gamma-ray-burst, fast-radio-burst, tidal-disruption-event and
 * core-collapse-supernova transient classes, the GCN/VOEvent/TNS alert systems, the standard-siren
 * distance indicator, and the gravitational-wave and multi-messenger bands already in the graph.
 * The new entities are the gravitational-wave detectors still missing (created with the existing
 * observatory/mission-concept types), the compact-binary-merger source classes (existing
 * transient-class type), the SCiMMA and LVK alert systems (existing alert-system type), and the
 * new gravitational-wave detection methods, multi-messenger channels, follow-up stages, and data
 * products. Nothing is fabricated; proposed detectors are stated as such.
 */

export type MmKind =
  | "facility" // a gravitational-wave observatory (reused observatory / mission-concept type)
  | "detection" // a gravitational-wave detection method
  | "source" // a compact-binary-merger source class (reused transient-class type)
  | "alert" // an alert system (reused alert-system type)
  | "channel" // a multi-messenger observation channel
  | "stage" // a follow-up / observation-campaign stage
  | "product"; // a gravitational-wave scientific data product

/** Entity-type mapping for the non-facility kinds. Facilities carry their own observatory /
 *  mission-concept entity type (reused, not duplicated) resolved from the record's `facilityType`. */
export const KIND_ENTITY_TYPE: Record<Exclude<MmKind, "facility">, EntityType> = {
  detection: "gw_detection_method",
  source: "transient_class",
  alert: "alert_system",
  channel: "mm_channel",
  stage: "gw_followup_stage",
  product: "gw_data_product",
};

export const KIND_LABEL: Record<MmKind, string> = {
  facility: "GW observatory",
  detection: "Detection method",
  source: "Source class",
  alert: "Alert system",
  channel: "Multi-messenger channel",
  stage: "Follow-up stage",
  product: "Data product",
};

/** The reused entity types a facility may take. */
export type FacilityType = "observatory" | "mission_concept";

export interface MmRecord {
  id: string;
  slug: string;
  name: string;
  kind: MmKind;
  facilityType?: FacilityType; // only for kind "facility" — the reused entity type
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  statusLabel?: string; // e.g. "Proposed" / "Operating" — stated honestly, only when well established
  definition?: string;
  highlights?: string[];
}
