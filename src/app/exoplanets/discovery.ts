import { engine } from "@/platform/data-engine";
import type { ExoplanetRecord } from "@/knowledge-graph/data/exoplanet-catalog/types";
import type { ExoSystem } from "@/knowledge-graph/data/exoplanet-catalog";

/** Discovery lists — each generated from the exoplanet engine over real archive data. */
export type ExoDiscovery =
  | { slug: string; title: string; description: string; view: "planets"; get: () => ExoplanetRecord[] }
  | { slug: string; title: string; description: string; view: "systems"; getSystems: () => ExoSystem[] };

const e = engine.exoplanets;
const byDist = (a: ExoplanetRecord, b: ExoplanetRecord) => (a.hostDistancePc ?? 9e9) - (b.hostDistancePc ?? 9e9);

export const EXO_DISCOVERIES: ExoDiscovery[] = [
  { slug: "all-exoplanets", title: "All Exoplanets", description: "Every confirmed exoplanet in this catalogue, nearest first.", view: "planets", get: () => e.all().slice().sort(byDist) },
  { slug: "nearby-exoplanets", title: "Nearby Exoplanets", description: "The closest known exoplanets to the Solar System.", view: "planets", get: () => e.nearby(120) },
  { slug: "famous-exoplanets", title: "Famous Exoplanets", description: "Landmark worlds that shaped exoplanet science.", view: "planets", get: () => e.famous(12) },
  { slug: "potentially-habitable", title: "Potentially Habitable Exoplanets", description: "Source-backed planets that lie in their star's habitable zone. Lying in the zone is not proof of habitability.", view: "planets", get: () => e.habitable() },
  { slug: "super-earths", title: "Super-Earths", description: "Rocky-to-icy planets larger than Earth but smaller than Neptune.", view: "planets", get: () => e.byClass("super-earth") },
  { slug: "mini-neptunes", title: "Mini-Neptunes", description: "Planets with thick atmospheres between super-Earths and Neptune in size.", view: "planets", get: () => e.byClass("mini-neptune") },
  { slug: "hot-jupiters", title: "Hot Jupiters", description: "Gas giants orbiting scorchingly close to their stars.", view: "planets", get: () => e.byClass("hot-jupiter") },
  { slug: "gas-giants", title: "Gas Giants", description: "Large planets dominated by hydrogen and helium.", view: "planets", get: () => e.byClass("gas-giant") },
  { slug: "terrestrial-candidates", title: "Terrestrial Candidates", description: "Small, likely rocky planets up to about 1.6 Earth radii.", view: "planets", get: () => e.byClass("terrestrial") },
  { slug: "directly-imaged", title: "Directly Imaged Exoplanets", description: "Planets captured in actual images by blocking their star's glare.", view: "planets", get: () => e.byMethod("direct-imaging") },
  { slug: "transit-exoplanets", title: "Transit Exoplanets", description: "Planets found by the dip in starlight as they cross their star.", view: "planets", get: () => e.byMethod("transit") },
  { slug: "radial-velocity-exoplanets", title: "Radial-Velocity Exoplanets", description: "Planets found by the gravitational wobble they induce in their star.", view: "planets", get: () => e.byMethod("radial-velocity") },
  { slug: "microlensing-exoplanets", title: "Microlensing Exoplanets", description: "Planets revealed when their star's gravity lenses a background star.", view: "planets", get: () => e.byMethod("microlensing") },
  { slug: "kepler-exoplanets", title: "Kepler Exoplanets", description: "Planets discovered by the Kepler space telescope.", view: "planets", get: () => e.byFacility("space_telescope:kepler-space-telescope") },
  { slug: "tess-exoplanets", title: "TESS Exoplanets", description: "Planets discovered by the TESS mission.", view: "planets", get: () => e.byFacility("space_telescope:tess") },
  { slug: "trappist-1-planets", title: "TRAPPIST-1 Planets", description: "The seven Earth-sized worlds of the TRAPPIST-1 system.", view: "planets", get: () => e.all().filter((p) => p.hostId === "star:trappist-1").slice().sort((a, b) => (a.orbitalPeriodDays ?? 9e9) - (b.orbitalPeriodDays ?? 9e9)) },
  { slug: "multi-planet-systems", title: "Multi-Planet Systems", description: "Star systems with two or more known planets, richest first.", view: "systems", getSystems: () => e.multiPlanetSystems() },
];

const BY_SLUG = new Map(EXO_DISCOVERIES.map((d) => [d.slug, d]));
export function getExoDiscovery(slug: string): ExoDiscovery | undefined {
  return BY_SLUG.get(slug);
}
