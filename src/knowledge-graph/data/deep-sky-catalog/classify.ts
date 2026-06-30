import type { DeepSkyType, GalaxyType, ObservationDifficulty } from "@/knowledge-graph/data/deep-sky-catalog/types";

/**
 * Classification helpers — apply standard definitions to OpenNGC's real type
 * codes, morphology, and magnitudes. They derive, never invent.
 */

/** Map an OpenNGC type code to a deep-sky type + the graph entity type. */
export const TYPE_MAP: Record<string, { type: DeepSkyType; entity: "galaxy" | "nebula" | "star_cluster" }> = {
  G: { type: "galaxy", entity: "galaxy" },
  GPair: { type: "galaxy-group", entity: "galaxy" },
  GTrpl: { type: "galaxy-group", entity: "galaxy" },
  GGroup: { type: "galaxy-group", entity: "galaxy" },
  OCl: { type: "open-cluster", entity: "star_cluster" },
  GCl: { type: "globular-cluster", entity: "star_cluster" },
  PN: { type: "planetary-nebula", entity: "nebula" },
  Neb: { type: "nebula", entity: "nebula" },
  HII: { type: "hii-region", entity: "nebula" },
  EmN: { type: "emission-nebula", entity: "nebula" },
  RfN: { type: "reflection-nebula", entity: "nebula" },
  DrkN: { type: "dark-nebula", entity: "nebula" },
  SNR: { type: "supernova-remnant", entity: "nebula" },
  "Cl+N": { type: "cluster-nebula", entity: "nebula" },
};

/**
 * Galaxy morphology from the Hubble-type string. CASE-SENSITIVE by design: in
 * de Vaucouleurs notation "SB…" is a barred spiral while "Sb"/"Sc" is the
 * spiral SUBTYPE — a case-insensitive match would wrongly call every spiral
 * "barred". Examples: "Sb" → spiral, "SBb" → barred spiral, "E2" → elliptical.
 */
export function galaxyTypeFromHubble(hubble: string | undefined): GalaxyType | undefined {
  if (!hubble) return undefined;
  const h = hubble.trim();
  if (/^d/.test(h)) return "dwarf";
  if (/^E/.test(h)) return "elliptical";
  if (/^(S0|SA0|SB0)/.test(h)) return "lenticular";
  if (/^(SB|SAB)/.test(h)) return "barred-spiral";
  if (/^S/.test(h)) return "spiral";
  if (/^I/.test(h)) return "irregular";
  return undefined;
}

/** Observation difficulty from apparent magnitude (standard observing guidance). */
export function difficultyFromMag(mag: number | undefined): ObservationDifficulty | undefined {
  if (mag == null) return undefined;
  if (mag <= 5) return "naked-eye";
  if (mag <= 7) return "binoculars";
  if (mag <= 9.5) return "small-telescope";
  if (mag <= 11) return "medium-telescope";
  if (mag <= 13) return "large-telescope";
  return "challenging";
}

/** Recommended minimum aperture, in mm, for a difficulty (rule of thumb). */
export const DIFFICULTY_APERTURE: Record<ObservationDifficulty, string> = {
  "naked-eye": "no equipment needed (dark sky helps)",
  binoculars: "10×50 binoculars or any small telescope",
  "small-telescope": "≈ 80–100 mm telescope",
  "medium-telescope": "≈ 150–200 mm telescope",
  "large-telescope": "≈ 250 mm+ telescope",
  challenging: "large aperture and very dark skies",
};
