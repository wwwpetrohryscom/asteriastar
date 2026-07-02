import { engine } from "@/platform/data-engine";
import { getEntityById } from "@/knowledge-graph";
import type { ConsensusLevel } from "@/knowledge-graph/data/cosmology-catalog/types";

/**
 * Cosmology discovery collections — curated reading lists over the Cosmology &
 * Universe knowledge graph. Cards carry the topic's consensus level where it has
 * one. Reused graph entities (e.g. General Relativity, Planck, Euclid) are
 * linked by id, never duplicated.
 */
export interface CosmoCard { slug: string; name: string; kind: string; consensus?: ConsensusLevel; href: string; }
export interface CosmoDiscovery { slug: string; title: string; description: string; cards: () => CosmoCard[]; }

const c = engine.cosmology;

/** Build a card from a cosmology slug. */
function card(slug: string): CosmoCard | null {
  const d = c.resolve(slug);
  if (!d) return null;
  const href = `/cosmology/${slug}`;
  const kind = d.kind === "concept" ? kindLabel(d.record.category)
    : d.kind === "model" ? "Cosmological model"
      : d.kind === "object" ? "Astrophysical object"
        : d.kind === "program" ? "Observational program" : "Physicist";
  const consensus = (d.kind === "concept" || d.kind === "model" || d.kind === "object") ? d.record.consensus : undefined;
  return { slug, name: d.record.name, kind, consensus, href };
}
function kindLabel(cat: string): string {
  return cat === "epoch" ? "Cosmic epoch" : cat === "law" ? "Physical law" : cat === "theory" ? "Theory"
    : cat === "physical-concept" ? "Physical concept" : cat === "quantity" ? "Measured quantity" : "Concept";
}
/** Build a card from a full id of a REUSED graph entity. */
function reused(id: string, kind: string): CosmoCard | null {
  const e = getEntityById(id);
  if (!e) return null;
  return { slug: id, name: e.name, kind, href: e.entryPath ?? `/explore/entity/${id.replace(":", "/")}` };
}
function cards(slugs: string[]): CosmoCard[] { return slugs.map(card).filter((x): x is CosmoCard => Boolean(x)); }
function mix(items: (CosmoCard | null)[]): CosmoCard[] { return items.filter((x): x is CosmoCard => Boolean(x)); }

export const COSMO_DISCOVERIES: CosmoDiscovery[] = [
  { slug: "cosmology", title: "Cosmology", description: "The scientific study of the Universe as a whole — its origin, contents, structure, and fate.", cards: () => cards(c.concepts().map((x) => x.slug)) },
  { slug: "big-bang", title: "The Big Bang", description: "How the Universe began and evolved through its earliest epochs.", cards: () => cards(["the-big-bang", "cosmic-inflation", "big-bang-nucleosynthesis", "recombination", "cosmic-microwave-background", "age-of-the-universe"]) },
  { slug: "dark-matter", title: "Dark Matter", description: "The unseen matter that shapes galaxies and the cosmic web.", cards: () => mix([card("dark-matter"), card("dark-matter-halo"), card("structure-formation"), card("galaxy-cluster"), card("modified-newtonian-dynamics"), reused("historical_discovery:evidence-for-dark-matter", "Discovery"), reused("astronomer:vera-rubin", "Scientist")]) },
  { slug: "dark-energy", title: "Dark Energy", description: "The mysterious component accelerating the expansion of the Universe.", cards: () => mix([card("dark-energy"), card("cosmological-constant"), card("cosmic-expansion"), card("hubble-tension"), card("baryon-acoustic-oscillations"), reused("historical_discovery:accelerating-universe", "Discovery")]) },
  { slug: "black-holes", title: "Black Holes", description: "From event horizons to the first black-hole image.", cards: () => cards(["black-hole", "supermassive-black-hole", "intermediate-mass-black-hole", "stellar-black-hole", "primordial-black-hole", "event-horizon", "singularity", "hawking-radiation", "accretion-disk", "schwarzschild-radius"]) },
  { slug: "neutron-stars", title: "Neutron Stars & Stellar Remnants", description: "The dense remnants left when stars die.", cards: () => cards(["neutron-star", "magnetar", "white-dwarf", "brown-dwarf"]) },
  { slug: "relativity", title: "Relativity", description: "Einstein's theories of space, time, and gravity — the foundation of cosmology.", cards: () => mix([card("special-relativity"), card("spacetime"), card("gravity"), card("quantum-gravity"), card("albert-einstein"), reused("astronomical_theory:general-relativity", "Theory")]) },
  { slug: "gravitational-waves", title: "Gravitational Waves", description: "Ripples in spacetime and the new astronomy they opened.", cards: () => mix([card("gravitational-waves"), card("stellar-black-hole"), card("neutron-star"), card("kagra"), reused("historical_discovery:gravitational-waves", "Discovery"), reused("observatory:ligo-hanford", "Observatory")]) },
  { slug: "structure-formation", title: "Structure Formation", description: "How gravity built galaxies, clusters, and the cosmic web.", cards: () => cards(["structure-formation", "cosmic-web", "large-scale-structure", "galaxy-cluster", "supercluster", "cosmic-filament", "void", "dark-matter-halo", "baryon-acoustic-oscillations"]) },
  { slug: "galaxy-evolution", title: "Galaxy Evolution", description: "From the first stars to today's galaxies and their active cores.", cards: () => cards(["cosmic-dawn", "reionization", "structure-formation", "quasar", "active-galactic-nucleus", "blazar", "galaxy-cluster"]) },
  { slug: "cosmic-microwave-background", title: "The Cosmic Microwave Background", description: "The oldest light in the Universe and what it reveals.", cards: () => mix([card("cosmic-microwave-background"), card("recombination"), card("cobe"), card("wmap"), reused("space_telescope:planck", "Space telescope"), reused("historical_discovery:cosmic-microwave-background", "Discovery")]) },
  { slug: "universe-timeline", title: "Universe Timeline", description: "The history of the cosmos, from the Big Bang to the present, in order.", cards: () => cards(c.epochs().map((x) => x.slug)) },
  { slug: "cosmological-models", title: "Cosmological Models", description: "The standard model and the alternatives — kept honestly distinct.", cards: () => cards(c.models().map((x) => x.slug)) },
  { slug: "scientific-debates", title: "Scientific Debates", description: "Where cosmologists actively disagree about the evidence.", cards: () => cards(["hubble-tension", "modified-newtonian-dynamics", "cosmological-constant", "cosmic-inflation"]) },
  { slug: "open-questions", title: "Open Questions", description: "The great unsolved problems at the frontier of cosmology.", cards: () => cards(["dark-matter", "dark-energy", "cosmic-inflation", "quantum-gravity", "hawking-radiation", "hubble-tension", "singularity", "primordial-black-hole"]) },
  { slug: "future-cosmology-missions", title: "Future Cosmology Missions", description: "The observatories and surveys mapping dark energy, structure, and spacetime.", cards: () => mix([card("desi"), card("kagra"), card("event-horizon-telescope"), reused("space_telescope:euclid", "Space telescope"), reused("observatory:vera-rubin-observatory", "Observatory"), reused("space_telescope:james-webb-space-telescope", "Space telescope")]) },
];

const BY_SLUG = new Map(COSMO_DISCOVERIES.map((d) => [d.slug, d]));
export function getCosmoDiscovery(slug: string): CosmoDiscovery | undefined {
  return BY_SLUG.get(slug);
}
