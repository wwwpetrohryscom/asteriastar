import type { DistanceRecord } from "@/knowledge-graph/data/distance-ladder-catalog/types";

/** Cosmology concepts introduced by this programme — created with the EXISTING cosmology-concept
 *  type, never a parallel type. Proposed resolutions to the Hubble tension are labelled clearly as
 *  unconfirmed; the Hubble constant and Hubble tension themselves are reused, not recreated. */
const con = (r: Omit<DistanceRecord, "kind" | "id" | "sources"> & { slug: string; sources?: DistanceRecord["sources"] }): DistanceRecord => ({ sources: ["nasa"], ...r, kind: "concept", id: `cosmology_concept:${r.slug}` });

export const concepts: DistanceRecord[] = [
  con({ slug: "early-dark-energy", name: "Early Dark Energy", altNames: ["EDE"], relatedKeys: ["cosmology_concept:hubble-tension", "cosmology_concept:dark-energy", "cosmology_concept:cosmic-microwave-background"], description: "A proposed but unconfirmed resolution of the Hubble tension in which a small, transient dark-energy-like component acts in the early universe around the time of recombination, shrinking the sound horizon and so raising the Hubble constant inferred from the CMB toward the local value. It is one of several competing ideas — alongside extra relativistic species and modified gravity — and none is yet established.", sources: ["nasa"], highlights: ["One proposed, unconfirmed resolution of the Hubble tension"] }),
];
