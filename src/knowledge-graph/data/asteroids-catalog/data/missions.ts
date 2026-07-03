import type { MinorBodyRecord } from "@/knowledge-graph/data/asteroids-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Small-body missions not yet present in the graph. These are created as reused-type
 * `space_mission` entities WITHOUT a dedicated /asteroids page (they resolve to the
 * standalone /explore graph page), purely so the asteroids they explore can be
 * connected. The nine small-body missions already in the graph (Dawn, Hayabusa,
 * Hayabusa2, OSIRIS-REx, DART, Psyche, Lucy, Rosetta, New Horizons) are REUSED and
 * never redefined here.
 */
type M = { slug: string; name: string; agency: string; launchYear?: string; sources?: SourceKey[]; alt?: string[]; description: string };
const mk = (m: M): MinorBodyRecord => ({
  id: `space_mission:${m.slug}`,
  slug: m.slug,
  name: m.name,
  kind: "mission",
  altNames: m.alt,
  description: m.description,
  sources: m.sources ?? ["nasa"],
  discoveryLocation: m.agency, // reused field to carry the operating agency
  discoveryYear: m.launchYear,
});

export const missions: MinorBodyRecord[] = [
  mk({ slug: "near-shoemaker", name: "NEAR Shoemaker", agency: "NASA", launchYear: "1996", sources: ["nasa", "jpl"], alt: ["NEAR", "Near Earth Asteroid Rendezvous"], description: "NASA's Near Earth Asteroid Rendezvous mission, the first spacecraft to orbit an asteroid (433 Eros, 2000) and the first to soft-land on one (2001)." }),
  mk({ slug: "hera", name: "Hera", agency: "ESA", launchYear: "2024", sources: ["esa"], description: "ESA's planetary-defense mission to the Didymos–Dimorphos binary, launched in 2024 to survey the aftermath of NASA's DART impact in detail." }),
];
