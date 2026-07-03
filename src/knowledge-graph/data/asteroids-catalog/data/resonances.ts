import type { MinorBodyRecord } from "@/knowledge-graph/data/asteroids-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Mean-motion orbital resonances that shape minor-planet populations. Each is linked
 * from the asteroids, groups, and Trojan populations it governs (shares_orbital_
 * resonance) and to the planet it involves (a reused planet entity).
 */
type R = { slug: string; name: string; ratio: string; planet: string; sources?: SourceKey[]; description: string };
const mk = (r: R): MinorBodyRecord => ({
  id: `orbital_resonance:${r.slug}`,
  slug: r.slug,
  name: r.name,
  kind: "resonance",
  description: r.description,
  sources: r.sources ?? ["nasa", "jpl"],
  resonanceRatio: r.ratio,
  resonanceWithSlug: r.planet, // planet:{slug}
});

export const resonances: MinorBodyRecord[] = [
  mk({ slug: "jupiter-3-2", name: "3:2 resonance with Jupiter", ratio: "3:2", planet: "jupiter", description: "A mean-motion resonance in which a body completes three orbits for every two of Jupiter's, stabilising the Hilda group in the outer main belt." }),
  mk({ slug: "jupiter-1-1", name: "1:1 resonance with Jupiter", ratio: "1:1", planet: "jupiter", description: "The co-orbital resonance that traps the Jupiter Trojans at the planet's L4 and L5 Lagrange points, sharing Jupiter's orbital period." }),
  mk({ slug: "neptune-2-3", name: "2:3 resonance with Neptune", ratio: "2:3", planet: "neptune", description: "The resonance in which a body completes two orbits for every three of Neptune's — the home of the 'plutinos', including Pluto itself." }),
  mk({ slug: "neptune-1-1", name: "1:1 resonance with Neptune", ratio: "1:1", planet: "neptune", description: "The co-orbital resonance that holds the Neptune Trojans at the planet's Lagrange points." }),
];
