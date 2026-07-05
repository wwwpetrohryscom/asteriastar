import type { MmRecord } from "@/knowledge-graph/data/multi-messenger-catalog/types";

/** Gravitational-wave detection methods — the ways gravitational waves are caught, across the
 *  frequency spectrum. Each is a child of the REUSED gravitational-wave-detection method and links
 *  to the detectors that use it. */
const det = (r: Omit<MmRecord, "kind" | "id" | "sources"> & { slug: string; sources?: MmRecord["sources"] }): MmRecord => ({ sources: ["ligo"], ...r, kind: "detection", id: `gw_detection_method:${r.slug}` });

export const detectionMethods: MmRecord[] = [
  det({ slug: "laser-interferometry", name: "Laser Interferometry", relatedKeys: ["astronomy_method:gravitational-wave-detection", "astronomy_method:interferometry", "observatory:ligo-hanford"], description: "The technique behind the ground-based detectors: a laser beam is split down two perpendicular kilometre-scale arms and recombined, and a passing gravitational wave stretches one arm and squeezes the other by a fraction of a proton's width, shifting the interference pattern. LIGO, Virgo, and KAGRA all work this way.", sources: ["ligo"], highlights: ["Measuring a change smaller than a proton's width"] }),
  det({ slug: "space-interferometry", name: "Space Interferometry", relatedKeys: ["astronomy_method:gravitational-wave-detection", "mission_concept:lisa"], description: "Laser interferometry carried out between spacecraft millions of kilometres apart, free of the ground noise that limits Earth-based detectors. It opens the low-frequency gravitational-wave band — the mergers of massive black holes and the whir of compact binaries — that the ground detectors cannot reach. LISA is the leading example.", sources: ["nasa"] }),
  det({ slug: "pulsar-timing-array", name: "Pulsar Timing Array", altNames: ["PTA"], relatedKeys: ["astronomy_method:gravitational-wave-detection"], description: "Using an array of millisecond pulsars — nature's most precise clocks — as a galaxy-sized gravitational-wave detector. A passing nanohertz gravitational wave subtly shifts the arrival times of the pulsars' pulses in a correlated way; timing arrays have found evidence for a background of such waves from supermassive black-hole binaries.", sources: ["nasa"], highlights: ["A gravitational-wave detector the size of the galaxy"] }),
];
