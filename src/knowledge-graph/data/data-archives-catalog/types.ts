import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Space Data Archives & Open Science Infrastructure data model (Program AT) — where the data
 * lives and how it is shared. It REUSES the archive-operating organisations (STScI, ESO,
 * Caltech/IPAC, NASA, NRAO), the telescopes whose data the archives hold, the calibration
 * method, the Harvard classification, VOEvent, and the Sloan survey already in the graph; the
 * new entities are the data archives, the data standards, the Virtual Observatory protocols,
 * and the open-science practices. Nothing is fabricated.
 */

export type ArchiveKind =
  | "archive" // a science data archive
  | "standard" // a data format / standard
  | "framework" // the Virtual Observatory interoperability framework (parent of the access protocols)
  | "protocol" // a Virtual Observatory access protocol
  | "practice"; // an open-science practice (identifiers, citation, pipelines, reproducibility)

export const KIND_ENTITY_TYPE: Record<ArchiveKind, EntityType> = {
  archive: "data_archive",
  standard: "data_standard",
  framework: "vo_framework",
  protocol: "vo_protocol",
  practice: "open_science_practice",
};

export const KIND_LABEL: Record<ArchiveKind, string> = {
  archive: "Data archive",
  standard: "Data standard",
  framework: "VO framework",
  protocol: "VO protocol",
  practice: "Open-science practice",
};

export interface ArchiveRecord {
  id: string;
  slug: string;
  name: string;
  kind: ArchiveKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  operatorLabel?: string; // e.g. "Operated by STScI" — only when well established
  definition?: string;
  highlights?: string[];
}
