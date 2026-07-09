import { engine } from "@/platform/data-engine";
import type { CfRecord } from "@/knowledge-graph/data/reference-systems-catalog/types";

/** Engine-driven discovery hubs for the Astronomical Coordinates, Time & Reference Systems Encyclopedia. */
export interface CfDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => CfRecord[];
}

const e = engine.referenceSystems;

export const CF_DISCOVERIES: CfDiscovery[] = [
  { slug: "coordinate-systems", title: "Coordinate Systems", description: "How positions on the sky are measured — right ascension and declination, the equatorial, galactic, ecliptic, horizontal, and supergalactic systems, and the celestial sphere they are drawn on.", get: () => e.coordinates() },
  { slug: "reference-frames", title: "Reference Frames", description: "The frames that anchor coordinates in space — the FK4 and FK5 fundamental catalogues and the quasar-based ICRF3 that realises the modern ICRS.", get: () => e.frames() },
  { slug: "time-representation", title: "Time Representation", description: "How astronomers timestamp observations — the Julian date, a single continuous count of days used throughout astronomy.", get: () => e.timescales() },
  { slug: "astrometric-effects", title: "Astrometric Effects", description: "The effects that shift a star's measured place — precession and nutation of the Earth's axis, the aberration of light, atmospheric refraction, light-time, and the Earth orientation parameters.", get: () => e.effects() },
  { slug: "defining-bodies", title: "Defining Bodies", description: "The organisations that define and maintain the reference systems — the IAU and the IERS.", get: () => e.bodies() },
];

const BY_SLUG = new Map(CF_DISCOVERIES.map((d) => [d.slug, d]));
export function getCfDiscovery(slug: string): CfDiscovery | undefined {
  return BY_SLUG.get(slug);
}
