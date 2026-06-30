import { engine } from "@/platform/data-engine";
import type { DeepSkyRecord } from "@/knowledge-graph/data/deep-sky-catalog/types";

/** Discovery lists — every list is generated from the engine over real data. */
export interface DeepSkyDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => DeepSkyRecord[];
}

const byMag = (a: DeepSkyRecord, b: DeepSkyRecord) => (a.apparentMagnitude ?? 99) - (b.apparentMagnitude ?? 99);
const allNebulae = (): DeepSkyRecord[] => engine.deepSky.all().filter((d) => d.entityType === "nebula").sort(byMag);

export const DEEP_SKY_DISCOVERIES: DeepSkyDiscovery[] = [
  { slug: "all-galaxies", title: "All Galaxies", description: "Galaxies in the encyclopedia, from spirals to ellipticals.", get: () => engine.deepSky.byType("galaxy") },
  { slug: "all-nebulae", title: "All Nebulae", description: "Emission, reflection, planetary, and supernova-remnant nebulae.", get: allNebulae },
  { slug: "open-clusters", title: "Open Clusters", description: "Loose clusters of young stars in the galactic disc.", get: () => engine.deepSky.byType("open-cluster") },
  { slug: "globular-clusters", title: "Globular Clusters", description: "Dense, ancient spherical clusters in the galactic halo.", get: () => engine.deepSky.byType("globular-cluster") },
  { slug: "planetary-nebulae", title: "Planetary Nebulae", description: "Glowing shells cast off by dying Sun-like stars.", get: () => engine.deepSky.byType("planetary-nebula") },
  { slug: "supernova-remnants", title: "Supernova Remnants", description: "The expanding debris of exploded stars.", get: () => engine.deepSky.byType("supernova-remnant") },
  { slug: "messier-objects", title: "Messier Objects", description: "Charles Messier's catalogue of bright deep-sky objects.", get: () => engine.deepSky.byCatalog("messier") },
  { slug: "caldwell-objects", title: "Caldwell Objects", description: "Patrick Moore's catalogue of bright objects Messier missed.", get: () => engine.deepSky.byCatalog("caldwell") },
  { slug: "bright-deep-sky", title: "Bright Deep-Sky Objects", description: "The brightest deep-sky objects (magnitude 7 and brighter).", get: () => engine.deepSky.brightest(250).filter((d) => d.apparentMagnitude != null && d.apparentMagnitude <= 7) },
  { slug: "largest-galaxies", title: "Largest Galaxies", description: "Galaxies with the greatest apparent size in the sky.", get: () => engine.deepSky.largestGalaxies(50) },
  { slug: "beginner-targets", title: "Beginner Targets", description: "Easy objects for the naked eye, binoculars, or a small telescope.", get: () => engine.deepSky.byDifficulty("beginner", 250) },
  { slug: "advanced-targets", title: "Advanced Targets", description: "Faint objects for larger telescopes and dark skies.", get: () => engine.deepSky.byDifficulty("advanced", 250) },
  { slug: "visible-in-summer", title: "Visible in Summer", description: "Deep-sky objects prominent in the Northern-Hemisphere summer sky.", get: () => engine.deepSky.bySeason("Summer", 250) },
  { slug: "visible-in-winter", title: "Visible in Winter", description: "Deep-sky objects prominent in the Northern-Hemisphere winter sky.", get: () => engine.deepSky.bySeason("Winter", 250) },
  { slug: "northern-hemisphere", title: "Northern Hemisphere", description: "Objects best placed for northern observers.", get: () => engine.deepSky.byHemisphere("northern", 250) },
  { slug: "southern-hemisphere", title: "Southern Hemisphere", description: "Objects best placed for southern observers.", get: () => engine.deepSky.byHemisphere("southern", 250) },
];

const BY_SLUG = new Map(DEEP_SKY_DISCOVERIES.map((d) => [d.slug, d]));
export function getDeepSkyDiscovery(slug: string): DeepSkyDiscovery | undefined {
  return BY_SLUG.get(slug);
}
