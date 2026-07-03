import { engine } from "@/platform/data-engine";
import type { ConstellationRecord } from "@/knowledge-graph/data/constellations-catalog/types";

/**
 * Engine-driven discovery hubs for the Constellation Encyclopedia. Every hub is a
 * pure query over engine.constellations; filters are honest — a constellation with
 * an unknown value is simply excluded from that hub rather than assigned an
 * invented one. The "beginner" and "Milky Way" sets are curated reference lists of
 * well-known constellations (not fabricated data).
 */
export interface ConstellationDiscovery {
  slug: string;
  title: string;
  description: string;
  view: "table" | "cards";
  get: () => ConstellationRecord[];
}

const e = engine.constellations;

// Prominent, easy-to-find constellations for beginners (a curated reference list).
const BEGINNER = ["ursa-major", "ursa-minor", "cassiopeia", "orion", "leo", "cygnus", "scorpius", "sagittarius", "taurus", "gemini", "canis-major", "crux", "bootes", "lyra"];
// Constellations the summer/winter Milky Way passes through (a curated reference list).
const MILKY_WAY = ["cassiopeia", "perseus", "auriga", "monoceros", "puppis", "vela", "carina", "crux", "centaurus", "norma", "ara", "scorpius", "sagittarius", "scutum", "aquila", "cygnus", "cepheus"];

export const CONSTELLATION_DISCOVERIES: ConstellationDiscovery[] = [
  { slug: "all-constellations", title: "All 88 Constellations", description: "Every constellation recognised by the International Astronomical Union.", view: "table", get: () => e.all() },
  { slug: "zodiac", title: "The Zodiac", description: "The twelve constellations of the ecliptic, through which the Sun, Moon, and planets appear to travel.", view: "cards", get: () => e.zodiac() },
  { slug: "northern-hemisphere", title: "Northern Constellations", description: "Constellations centred in the northern celestial hemisphere.", view: "table", get: () => e.byHemisphere("northern") },
  { slug: "southern-hemisphere", title: "Southern Constellations", description: "Constellations centred in the southern celestial hemisphere.", view: "table", get: () => e.byHemisphere("southern") },
  { slug: "largest-constellations", title: "Largest Constellations", description: "The constellations covering the greatest area of sky, led by Hydra.", view: "table", get: () => e.largest(20) },
  { slug: "smallest-constellations", title: "Smallest Constellations", description: "The most compact constellations, led by Crux, the Southern Cross.", view: "table", get: () => e.smallest(20) },
  { slug: "winter-sky", title: "Winter Sky", description: "Constellations best placed in the northern winter evening sky (summer in the south).", view: "cards", get: () => e.bySeason("winter") },
  { slug: "spring-sky", title: "Spring Sky", description: "Constellations best placed in the northern spring evening sky.", view: "cards", get: () => e.bySeason("spring") },
  { slug: "summer-sky", title: "Summer Sky", description: "Constellations best placed in the northern summer evening sky, along the Milky Way.", view: "cards", get: () => e.bySeason("summer") },
  { slug: "autumn-sky", title: "Autumn Sky", description: "Constellations best placed in the northern autumn evening sky.", view: "cards", get: () => e.bySeason("autumn") },
  { slug: "beginner-constellations", title: "Beginner Constellations", description: "Bright, easy-to-find constellations to start learning the night sky.", view: "cards", get: () => e.bySlugs(BEGINNER) },
  { slug: "with-bright-stars", title: "Constellations with Bright Stars", description: "Constellations anchored by a prominent, named bright star.", view: "cards", get: () => e.withBrightStars() },
  { slug: "best-telescope-constellations", title: "Best Telescope Constellations", description: "Constellations richest in catalogued deep-sky objects for the telescope.", view: "cards", get: () => e.richestDeepSky(20) },
  { slug: "milky-way-constellations", title: "Milky Way Constellations", description: "Constellations the band of the Milky Way passes through.", view: "cards", get: () => e.bySlugs(MILKY_WAY) },
  { slug: "messier-rich-constellations", title: "Messier-Rich Constellations", description: "Constellations containing one or more objects from Messier's catalogue.", view: "cards", get: () => e.withMessier() },
  { slug: "galaxy-rich-constellations", title: "Galaxy-Rich Constellations", description: "Constellations containing catalogued galaxies.", view: "cards", get: () => e.withObjectType("galaxy:") },
  { slug: "nebula-rich-constellations", title: "Nebula-Rich Constellations", description: "Constellations containing catalogued nebulae.", view: "cards", get: () => e.withObjectType("nebula:") },
  { slug: "exoplanet-constellations", title: "Exoplanet Constellations", description: "Constellations whose catalogued stars host known exoplanets.", view: "cards", get: () => e.withExoplanets() },
  { slug: "meteor-shower-radiants", title: "Meteor Shower Radiants", description: "Constellations that host the radiant of a major annual meteor shower.", view: "cards", get: () => e.withMeteorRadiants() },
];

const BY_SLUG = new Map(CONSTELLATION_DISCOVERIES.map((d) => [d.slug, d]));
export function getConstellationDiscovery(slug: string): ConstellationDiscovery | undefined {
  return BY_SLUG.get(slug);
}
