import type { MinorBodyRecord } from "@/knowledge-graph/data/asteroids-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Terrestrial impact events — factual, non-sensational records of well-studied
 * asteroid/meteoroid impacts and airbursts. Each links to Earth (a reused planet
 * entity). Figures are given only where scientifically established; nothing is
 * exaggerated.
 */
type I = { slug: string; name: string; date?: string; location?: string; energy?: string; impactor?: string; crater?: string; sources?: SourceKey[]; alt?: string[]; description: string };
const mk = (i: I): MinorBodyRecord => ({
  id: `impact_event:${i.slug}`,
  slug: i.slug,
  name: i.name,
  kind: "impact",
  altNames: i.alt,
  description: i.description,
  sources: i.sources ?? ["nasa"],
  category: "impactor",
  impactDate: i.date,
  impactLocation: i.location,
  energyLabel: i.energy,
  impactorSizeLabel: i.impactor,
  craterLabel: i.crater,
});

export const impacts: MinorBodyRecord[] = [
  mk({ slug: "chicxulub", name: "Chicxulub impact", date: "≈ 66 million years ago", location: "Yucatán Peninsula, Mexico", impactor: "≈ 10–15 km asteroid", crater: "≈ 180 km crater", sources: ["nasa", "britannica"], description: "The impact of a ~10-kilometre asteroid that formed the Chicxulub crater and is widely linked to the Cretaceous–Paleogene mass extinction, including the end of the non-avian dinosaurs." }),
  mk({ slug: "tunguska", name: "Tunguska event", date: "30 June 1908", location: "Siberia, Russia", impactor: "≈ 50–60 m object (airburst)", sources: ["nasa", "britannica"], description: "A large airburst over remote Siberia that flattened roughly 2,000 square kilometres of forest without leaving an impact crater — the largest asteroid or comet impact in recorded history." }),
  mk({ slug: "chelyabinsk", name: "Chelyabinsk meteor", date: "15 February 2013", location: "Chelyabinsk Oblast, Russia", impactor: "≈ 20 m object (airburst)", energy: "≈ 400–500 kilotons TNT", sources: ["nasa"], description: "The airburst of a ~20-metre near-Earth object over Russia, whose shock wave shattered windows and injured around 1,500 people — the most damaging modern impact event, and a spur to planetary-defense efforts." }),
];
