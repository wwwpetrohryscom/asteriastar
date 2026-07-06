import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Astroinformatics & Virtual Research Ecosystem data model (Program BH) — the software, computing,
 * and data practices that turn astronomical data into science. It REUSES the Virtual Observatory and
 * its TAP protocol, the FITS and VOTable standards, the MAST/VizieR/SIMBAD archives, the
 * reproducibility-and-FAIR / persistent-identifiers / data-pipelines / cross-matching open-science
 * practices, the machine-learning methods and workflows, the Rubin Observatory and LSST survey, the
 * SKA and Gaia already in the graph. The new entities are the research-software packages, the
 * research-computing infrastructure, and the astroinformatics concepts. Nothing is fabricated; only
 * well-established practice is stated, and unknown values are left empty.
 */

export type AstroinformaticsKind =
  | "software" // a research-software package or ecosystem
  | "computing" // a research-computing infrastructure
  | "concept"; // an astroinformatics concept or practice

export const KIND_ENTITY_TYPE: Record<AstroinformaticsKind, EntityType> = {
  software: "research_software",
  computing: "research_computing",
  concept: "astroinformatics_concept",
};

export const KIND_LABEL: Record<AstroinformaticsKind, string> = {
  software: "Research software",
  computing: "Research computing",
  concept: "Astroinformatics",
};

export interface AstroinformaticsRecord {
  id: string;
  slug: string;
  name: string;
  kind: AstroinformaticsKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  symbolLabel?: string; // e.g. "Python" / "FITS" — only when well established
  definition?: string;
  highlights?: string[];
}
