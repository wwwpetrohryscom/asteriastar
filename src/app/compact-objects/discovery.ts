import { engine } from "@/platform/data-engine";
import type { CompactRecord } from "@/knowledge-graph/data/compact-objects-catalog/types";

/** Engine-driven discovery hubs for the Black Holes, Neutron Stars & Compact Objects Encyclopedia. */
export interface BzDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => CompactRecord[];
}

const e = engine.compactObjects;

export const BZ_DISCOVERIES: BzDiscovery[] = [
  { slug: "black-hole-physics", title: "Black-Hole Physics", description: "The strange geometry and processes of black holes — the ergosphere and photon sphere, the innermost stable circular orbit, the singularity and the no-hair theorem, frame-dragging and gravitational redshift, spaghettification, relativistic jets, the Blandford–Znajek mechanism, and quasi-periodic oscillations.", get: () => e.blackHolePhysics() },
  { slug: "neutron-stars-and-pulsars", title: "Neutron Stars & Pulsars", description: "Matter at the edge of collapse — neutron degeneracy pressure and the uncertain equation of state, the pulsar mechanism and glitches, magnetar fields, and the pulsar family: ordinary, millisecond, X-ray, and rotation-powered.", get: () => e.neutronStarPhysics() },
  { slug: "compact-objects", title: "Named Compact Objects", description: "The classic objects — the black holes Cygnus X-1 (the first widely accepted) and V404 Cygni, and the neutron stars: the Crab and Vela pulsars, the very first pulsar PSR B1919+21, and the massive PSR J0740+6620.", get: () => e.objects() },
];

const BY_SLUG = new Map(BZ_DISCOVERIES.map((d) => [d.slug, d]));
export function getBzDiscovery(slug: string): BzDiscovery | undefined {
  return BY_SLUG.get(slug);
}
