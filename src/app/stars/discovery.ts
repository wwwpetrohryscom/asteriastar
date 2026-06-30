import { engine } from "@/platform/data-engine";
import type { StarRecord } from "@/knowledge-graph/data/star-catalog/types";

/**
 * Discovery pages — every list is generated from the Scientific Data Engine over
 * real catalogue data. Rankings that would need measurement data the catalogue
 * does not hold (size, mass, age) are intentionally absent rather than faked.
 */
export interface StarDiscovery {
  slug: string;
  title: string;
  description: string;
  metric: "magnitude" | "distance";
  get: () => StarRecord[];
}

const LIMIT = 250;

export const STAR_DISCOVERIES: StarDiscovery[] = [
  { slug: "brightest", title: "Brightest Stars", description: "The brightest stars in Earth's night sky, ordered by apparent magnitude.", metric: "magnitude", get: () => engine.star.brightest(LIMIT) },
  { slug: "nearest", title: "Nearest Stars", description: "The closest stars to the Solar System, ordered by distance.", metric: "distance", get: () => engine.star.nearest(LIMIT) },
  { slug: "variable", title: "Variable Stars", description: "Stars whose brightness changes over time.", metric: "magnitude", get: () => engine.star.variableStars(LIMIT) },
  { slug: "multiple", title: "Multiple Star Systems", description: "Stars that belong to binary or multiple systems.", metric: "magnitude", get: () => engine.star.multipleStars(LIMIT) },
  { slug: "northern", title: "Stars of the Northern Sky", description: "Bright stars best seen from the Northern Hemisphere.", metric: "magnitude", get: () => engine.star.byHemisphere("northern", LIMIT) },
  { slug: "southern", title: "Stars of the Southern Sky", description: "Bright stars best seen from the Southern Hemisphere.", metric: "magnitude", get: () => engine.star.byHemisphere("southern", LIMIT) },
  { slug: "winter", title: "Winter Stars", description: "Bright stars prominent in the Northern-Hemisphere winter evening sky.", metric: "magnitude", get: () => engine.star.bySeason("Winter", LIMIT) },
  { slug: "spring", title: "Spring Stars", description: "Bright stars prominent in the Northern-Hemisphere spring evening sky.", metric: "magnitude", get: () => engine.star.bySeason("Spring", LIMIT) },
  { slug: "summer", title: "Summer Stars", description: "Bright stars prominent in the Northern-Hemisphere summer evening sky.", metric: "magnitude", get: () => engine.star.bySeason("Summer", LIMIT) },
  { slug: "autumn", title: "Autumn Stars", description: "Bright stars prominent in the Northern-Hemisphere autumn evening sky.", metric: "magnitude", get: () => engine.star.bySeason("Autumn", LIMIT) },
];

const BY_SLUG = new Map(STAR_DISCOVERIES.map((d) => [d.slug, d]));
export function getStarDiscovery(slug: string): StarDiscovery | undefined {
  return BY_SLUG.get(slug);
}

/** Rankings deliberately not offered — they require data the catalogue lacks. */
export const UNSUPPORTED_DISCOVERIES = [
  "Largest / smallest stars (need angular or physical radius)",
  "Most massive stars (need stellar mass)",
  "Oldest / youngest stars (need reliable ages)",
];
