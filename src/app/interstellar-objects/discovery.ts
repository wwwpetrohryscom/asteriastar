import { engine } from "@/platform/data-engine";
import type { InterstellarRecord } from "@/knowledge-graph/data/interstellar-catalog/types";

/**
 * Engine-driven discovery hubs for the Interstellar & Hyperbolic Objects Encyclopedia.
 * Every hub is a pure query over engine.interstellarObjects and is SINGLE-STATUS by design:
 * confirmed objects, candidates/debated claims, and hyperbolic Solar-System comets are
 * never listed together, so the four scientific statuses stay visually separated.
 */
export interface InterstellarDiscovery {
  slug: string;
  title: string;
  description: string;
  view: "table" | "cards";
  get: () => InterstellarRecord[];
}

const e = engine.interstellarObjects;

export const INTERSTELLAR_DISCOVERIES: InterstellarDiscovery[] = [
  {
    slug: "confirmed",
    title: "Confirmed Interstellar Objects",
    description: "The objects whose strongly hyperbolic orbits unambiguously establish an origin beyond the Solar System, each with an IAU interstellar designation: 1I/ʻOumuamua, 2I/Borisov, and 3I/ATLAS.",
    view: "cards",
    get: () => e.confirmedInterstellarObjects(),
  },
  {
    slug: "candidates",
    title: "Candidate Interstellar Objects",
    description: "Objects proposed to be interstellar but not confirmed — kept strictly separate from the confirmed objects, each with an explicit uncertainty note.",
    view: "cards",
    get: () => e.candidateInterstellarObjects(),
  },
  {
    slug: "debated",
    title: "Debated Interstellar Claims",
    description: "Interstellar claims whose underlying data are disputed, such as the CNEOS 2014-01-08 bolide. Presented as debated, never as confirmed.",
    view: "cards",
    get: () => e.debatedObjects(),
  },
  {
    slug: "hyperbolic-comets",
    title: "Hyperbolic Comets",
    description: "Solar-System comets on hyperbolic or near-parabolic orbits — a small eccentricity above 1 caused by planetary perturbations, not an interstellar origin.",
    view: "cards",
    get: () => e.hyperbolicComets(),
  },
];

const BY_SLUG = new Map(INTERSTELLAR_DISCOVERIES.map((d) => [d.slug, d]));
export function getInterstellarDiscovery(slug: string): InterstellarDiscovery | undefined {
  return BY_SLUG.get(slug);
}
