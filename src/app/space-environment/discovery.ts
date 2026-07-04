import { engine } from "@/platform/data-engine";
import type { EnvRecord } from "@/knowledge-graph/data/space-environment-catalog/types";

/** Engine-driven discovery hubs for the Space Environment & Hazards Encyclopedia. */
export interface EnvDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => EnvRecord[];
}

const e = engine.spaceEnvironment;

export const ENV_DISCOVERIES: EnvDiscovery[] = [
  { slug: "space-weather", title: "Space Weather", description: "The Sun-driven phenomena — solar wind, flares, coronal mass ejections, geomagnetic storms, and auroras — that shape near-Earth space.", get: () => e.phenomena() },
  { slug: "radiation", title: "Radiation Environments", description: "The particle-radiation hazards of space — the Van Allen belts, galactic cosmic rays, and solar energetic particles.", get: () => e.radiationEnvironments() },
  { slug: "hazards", title: "Spacecraft Hazards", description: "The physical hazards that threaten spacecraft — orbital debris, micrometeoroids, charging, and atomic oxygen.", get: () => e.hazards() },
  { slug: "indices", title: "Indices & Scales", description: "The indices and scales that quantify space weather — Kp, Dst, and the NOAA G/S/R scales.", get: () => e.indices() },
];

const BY_SLUG = new Map(ENV_DISCOVERIES.map((d) => [d.slug, d]));
export function getEnvDiscovery(slug: string): EnvDiscovery | undefined {
  return BY_SLUG.get(slug);
}
