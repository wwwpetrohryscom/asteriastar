import type { DistanceRecord } from "@/knowledge-graph/data/distance-ladder-catalog/types";

/** Measurement programmes — created with the EXISTING observational-programme type (like DESI),
 *  never a parallel type. Each links to the REUSED methods, standard candles, and cosmology
 *  concepts it measures. */
const prog = (r: Omit<DistanceRecord, "kind" | "id" | "sources"> & { slug: string; sources?: DistanceRecord["sources"] }): DistanceRecord => ({ sources: ["stsci"], ...r, kind: "program", id: `observational_program:${r.slug}` });

export const programs: DistanceRecord[] = [
  prog({ slug: "sh0es", name: "SH0ES", altNames: ["Supernovae, H0, for the Equation of State"], relatedKeys: ["astronomy_method:cosmic-distance-ladder", "astronomy_method:cepheid-distance-scale", "transient_class:type-ia-supernova", "cosmology_concept:hubble-constant", "cosmology_concept:hubble-tension", "space_telescope:hubble-space-telescope"], description: "The programme that measures the Hubble constant from the local distance ladder — anchoring Cepheids with parallax, using them to calibrate Type Ia supernovae, and reading the expansion rate from supernovae in the smooth Hubble flow. Its value comes out consistently higher than the one inferred from the early universe, and that gap is the Hubble tension.", sources: ["stsci"], highlights: ["The local-ladder measurement at the heart of the Hubble tension"] }),
];
