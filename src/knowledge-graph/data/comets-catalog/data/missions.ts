import type { CometRecord } from "@/knowledge-graph/data/comets-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Comet missions not yet present in the graph. Created as reused-type space_mission
 * entities WITHOUT a dedicated /comets page (they resolve to the standalone /explore
 * graph page), purely so the comets they explored can be connected. Rosetta is
 * REUSED from the exploration catalog and never redefined here.
 */
type M = { slug: string; name: string; agency: string; launchYear?: string; sources?: SourceKey[]; alt?: string[]; description: string };
const mk = (m: M): CometRecord => ({
  id: `space_mission:${m.slug}`,
  slug: m.slug,
  name: m.name,
  kind: "mission",
  altNames: m.alt,
  description: m.description,
  sources: m.sources ?? ["nasa"],
  discoveredBy: m.agency, // reused field to carry the operating agency
  discoveryYear: m.launchYear,
});

export const missions: CometRecord[] = [
  mk({ slug: "giotto", name: "Giotto", agency: "ESA", launchYear: "1985", sources: ["esa"], description: "ESA's mission to Halley's Comet, which flew through the comet's coma in 1986 and returned the first close-up images of a cometary nucleus, later re-targeted to comet Grigg–Skjellerup." }),
  mk({ slug: "deep-impact", name: "Deep Impact", agency: "NASA", launchYear: "2005", sources: ["nasa"], description: "NASA's mission that fired a 370-kg impactor into comet Tempel 1 in 2005 to excavate and study the material beneath a comet's surface." }),
  mk({ slug: "stardust", name: "Stardust", agency: "NASA", launchYear: "1999", sources: ["nasa"], description: "NASA's sample-return mission that captured dust from the coma of comet Wild 2 and returned it to Earth in 2006, and later flew past Tempel 1 as Stardust-NExT." }),
  mk({ slug: "deep-space-1", name: "Deep Space 1", agency: "NASA", launchYear: "1998", sources: ["nasa"], alt: ["DS1"], description: "NASA's ion-propulsion technology demonstrator that flew past comet Borrelly in 2001, returning detailed images of its nucleus." }),
  mk({ slug: "epoxi", name: "EPOXI", agency: "NASA", launchYear: "2005", sources: ["nasa"], description: "The extended mission of the Deep Impact spacecraft, which flew past the small, hyperactive comet Hartley 2 in 2010." }),
];
