import { engine } from "@/platform/data-engine";
import type { MechanicsRecord } from "@/knowledge-graph/data/celestial-mechanics-catalog/types";

/** Engine-driven discovery hubs for the Celestial Mechanics & Timekeeping Encyclopedia. */
export interface BeDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => MechanicsRecord[];
}

const e = engine.celestialMechanics;

export const BE_DISCOVERIES: BeDiscovery[] = [
  { slug: "orbital-mechanics", title: "Orbital Mechanics", description: "How bodies move under gravity — building on Kepler's laws: the three-body problem, Lagrange points, the Hill sphere and Roche limit, resonances, tides, and orbital elements.", get: () => e.dynamics() },
  { slug: "reference-frames", title: "Reference Frames & Epochs", description: "The coordinate systems positions are measured against — the ICRS, the barycentric and geocentric frames, the ecliptic, and the J2000 and B1950 epochs.", get: () => e.frames() },
  { slug: "ephemerides", title: "Ephemerides", description: "The software and data that give the positions of Solar System bodies — the JPL Development Ephemeris, the SPICE toolkit, and Horizons.", get: () => e.ephemerides() },
  { slug: "timekeeping", title: "Timekeeping", description: "The scales of astronomical time — Terrestrial and Barycentric Dynamical Time, UT1 and the leap second, and sidereal and solar time.", get: () => e.timekeeping() },
];

const BY_SLUG = new Map(BE_DISCOVERIES.map((d) => [d.slug, d]));
export function getBeDiscovery(slug: string): BeDiscovery | undefined {
  return BY_SLUG.get(slug);
}
