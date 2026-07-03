import { engine } from "@/platform/data-engine";
import type { MinorBodyRecord } from "@/knowledge-graph/data/asteroids-catalog/types";

/**
 * Engine-driven discovery hubs for the Asteroids & Minor Planets Encyclopedia. Every
 * hub is a pure query over engine.asteroids; filters are honest — a body with an
 * unknown value (e.g. no measured diameter or taxonomy) is simply excluded rather
 * than assigned an invented one. Hubs that would require data the catalog does not
 * hold (close-approach distances, rotation periods) are deliberately not built.
 */
export interface AsteroidDiscovery {
  slug: string;
  title: string;
  description: string;
  view: "table" | "cards";
  get: () => MinorBodyRecord[];
}

const e = engine.asteroids;

// Bodies most often discussed as resource / mining candidates (a curated reference
// list of real bodies, not a claim that mining is planned or feasible).
const MINING_CANDIDATES = ["psyche", "bennu", "ryugu", "eros"];

export const ASTEROID_DISCOVERIES: AsteroidDiscovery[] = [
  { slug: "all-asteroids", title: "All Minor Planets", description: "Every asteroid, dwarf planet, and minor body modelled in the encyclopedia.", view: "table", get: () => e.asteroids() },
  { slug: "largest", title: "Largest Asteroids", description: "The most massive minor planets, led by the dwarf planet Ceres and the giant main-belt asteroids Vesta and Pallas.", view: "table", get: () => e.largest(20) },
  { slug: "near-earth-objects", title: "Near-Earth Objects", description: "Asteroids whose orbits bring them close to Earth — the Apollo, Aten, Amor, and Atira classes.", view: "cards", get: () => e.byCategory("near-earth") },
  { slug: "potentially-hazardous", title: "Potentially Hazardous Asteroids", description: "Near-Earth asteroids large enough and close enough to warrant tracking, under the objective PHA criterion — a monitoring category, not a prediction of impact.", view: "cards", get: () => e.potentiallyHazardous() },
  { slug: "main-belt", title: "Main-Belt Asteroids", description: "Bodies of the main asteroid belt between Mars and Jupiter.", view: "table", get: () => e.byGroup("main-belt") },
  { slug: "dwarf-planets", title: "Dwarf Planets", description: "The minor-planet dwarf planets — Ceres in the asteroid belt, and Pluto, Haumea, Makemake, and Eris beyond Neptune.", view: "cards", get: () => e.byCategory("dwarf-planet") },
  { slug: "trojans", title: "Trojan Asteroids", description: "Minor planets sharing a giant planet's orbit at its Lagrange points, chiefly the Jupiter Trojans.", view: "cards", get: () => e.byCategory("trojan") },
  { slug: "centaurs", title: "Centaurs", description: "Icy bodies orbiting among the giant planets, transitional between the Kuiper Belt and the comets.", view: "cards", get: () => e.byCategory("centaur") },
  { slug: "trans-neptunian", title: "Trans-Neptunian Objects", description: "Icy minor planets beyond Neptune — Kuiper Belt, scattered-disc, and detached objects.", view: "cards", get: () => e.byCategory("trans-neptunian") },
  { slug: "kuiper-belt", title: "Kuiper Belt Objects", description: "Bodies of the broad icy ring beyond Neptune's orbit.", view: "cards", get: () => e.byGroup("kuiper-belt") },
  { slug: "metallic-asteroids", title: "Metallic Asteroids", description: "Metal-rich (M-type) asteroids, such as the mission target 16 Psyche.", view: "cards", get: () => e.byTaxonomy("metallic") },
  { slug: "carbonaceous-asteroids", title: "Carbonaceous Asteroids", description: "Dark, primitive, carbon-rich (C-type and related) asteroids — the most common kind.", view: "cards", get: () => e.byTaxonomy("carbonaceous") },
  { slug: "silicaceous-asteroids", title: "Silicaceous Asteroids", description: "Stony (S-type) asteroids, common in the inner main belt and among near-Earth objects.", view: "cards", get: () => e.byTaxonomy("silicaceous") },
  { slug: "binary-systems", title: "Binary Asteroids", description: "Asteroids with a single moon, such as Didymos and its moonlet Dimorphos.", view: "cards", get: () => e.binaries() },
  { slug: "triple-systems", title: "Triple Systems", description: "Asteroids with two moons — led by 87 Sylvia, the first triple asteroid system found.", view: "cards", get: () => e.triples() },
  { slug: "most-explored", title: "Most-Explored Asteroids", description: "Minor planets that have been visited by a spacecraft.", view: "cards", get: () => e.visited() },
  { slug: "sample-return-targets", title: "Sample-Return Targets", description: "Asteroids from which spacecraft have returned samples to Earth — Itokawa, Ryugu, and Bennu.", view: "cards", get: () => e.sampleReturnTargets() },
  { slug: "mission-targets", title: "Mission Targets", description: "Minor planets that have been, or are being, visited by a mission.", view: "cards", get: () => e.missionTargets() },
  { slug: "historic-discoveries", title: "Historic Discoveries", description: "The minor planets found in the nineteenth century, from Ceres (1801) onward.", view: "table", get: () => e.historicDiscoveries() },
  { slug: "mining-candidates", title: "Resource & Mining Interest", description: "Real bodies frequently discussed as candidates for future resource use — metal-rich or volatile-rich, and relatively accessible. Inclusion is not a claim that mining is planned or feasible.", view: "cards", get: () => e.bySlugs(MINING_CANDIDATES) },
];

const BY_SLUG = new Map(ASTEROID_DISCOVERIES.map((d) => [d.slug, d]));
export function getAsteroidDiscovery(slug: string): AsteroidDiscovery | undefined {
  return BY_SLUG.get(slug);
}
