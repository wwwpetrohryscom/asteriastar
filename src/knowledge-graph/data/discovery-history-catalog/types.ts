import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * History & Philosophy of Astronomical Discovery data model (Program BD) — how astronomy became
 * modern science, and how it knows what it knows. It REUSES the astronomers (Copernicus, Galileo,
 * Kepler, Newton, Herschel, Hubble), the astronomy eras (Greek, Renaissance, the Scientific
 * Revolution, contemporary), the spectroscopy, gravitational-wave and error-analysis methods, the
 * transit method, the Hubble tension, Sagittarius A*, the radio band, and the reproducibility
 * practice already in the graph. The new entities are the discovery methodologies, the philosophy-
 * of-science concepts, and the thematic histories. Nothing is fabricated.
 */

export type HistoryKind =
  | "methodology" // a methodology of discovery
  | "philosophy" // a philosophy-of-science concept
  | "theme"; // a thematic history

export const KIND_ENTITY_TYPE: Record<HistoryKind, EntityType> = {
  methodology: "discovery_methodology",
  philosophy: "philosophy_of_science",
  theme: "history_theme",
};

export const KIND_LABEL: Record<HistoryKind, string> = {
  methodology: "Discovery methodology",
  philosophy: "Philosophy of science",
  theme: "History of discovery",
};

export interface HistoryRecord {
  id: string;
  slug: string;
  name: string;
  kind: HistoryKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  eraLabel?: string; // e.g. "16th–17th century" / "Contemporary" — only when well established
  definition?: string;
  highlights?: string[];
}
