import type { MeteoriteRecord } from "@/knowledge-graph/data/meteorites-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Terrestrial impact structures — the craters left by past impacts, distinct from the
 * impact *events* (the Chicxulub, Tunguska, and Chelyabinsk events are modelled as
 * impact_event entities in Program Y and reused, not duplicated). Each structure links
 * to Earth and, where known, to its impactor meteorite.
 */
type S = { slug: string; name: string; location?: string; country?: string; diameter?: string; age?: string; related?: string[]; sources?: SourceKey[]; alt?: string[]; description: string };
const mk = (s: S): MeteoriteRecord => ({
  id: `impact_structure:${s.slug}`,
  slug: s.slug,
  name: s.name,
  kind: "impact-structure",
  altNames: s.alt,
  description: s.description,
  sources: s.sources ?? ["nasa"],
  category: "impact-structure",
  location: s.location,
  country: s.country,
  diameterLabel: s.diameter,
  ageLabel: s.age,
  relatedKeys: s.related,
});

export const structures: MeteoriteRecord[] = [
  mk({ slug: "barringer-crater", name: "Barringer Crater (Meteor Crater)", location: "Arizona", country: "United States", diameter: "~ 1.2 km", age: "~ 50,000 years", related: ["meteorite:canyon-diablo"], sources: ["nasa"], alt: ["Meteor Crater"], description: "The best-preserved impact crater on Earth, gouged out ~50,000 years ago by the Canyon Diablo iron meteorite — the site where the impact origin of craters was first firmly established." }),
  mk({ slug: "vredefort", name: "Vredefort Structure", location: "Free State", country: "South Africa", diameter: "~ 160–300 km (original)", age: "~ 2 billion years", sources: ["nasa"], description: "The largest confirmed impact structure on Earth, the deeply eroded remnant of a crater formed roughly two billion years ago by one of the largest impacts in the planet's history." }),
  mk({ slug: "sudbury", name: "Sudbury Basin", location: "Ontario", country: "Canada", diameter: "~ 130 km (original)", age: "~ 1.85 billion years", sources: ["nasa"], description: "One of the oldest and largest known impact structures, whose ancient impact melt hosts some of the world's richest nickel and copper ore deposits." }),
  mk({ slug: "ries", name: "Nördlinger Ries", location: "Bavaria", country: "Germany", diameter: "~ 24 km", age: "~ 14.8 million years", sources: ["nasa"], alt: ["Ries Crater"], description: "A well-studied mid-sized impact crater in Germany whose shocked minerals and impact glass were used by Apollo astronauts as a training ground for recognising impact features on the Moon." }),
];
