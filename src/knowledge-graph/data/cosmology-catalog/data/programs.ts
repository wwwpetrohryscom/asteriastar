import type { ProgramRecord, PhysicistRecord } from "@/knowledge-graph/data/cosmology-catalog/types";

/**
 * Observational programs central to cosmology that are NOT already in the graph.
 * (Planck, Hubble, JWST, Euclid, Gaia, WISE, LIGO, Virgo, ALMA, the Vera Rubin
 * Observatory, SDSS, and the Dark Energy Survey already exist and are reused by
 * id — not recreated here.)
 */
export const PROGRAMS: ProgramRecord[] = [
  {
    slug: "cobe", name: "COBE (Cosmic Background Explorer)", kind: "space-mission", years: "1989–1993",
    operatorId: "organization:nasa",
    definition: "NASA's Cosmic Background Explorer, which measured the spectrum and first mapped the anisotropy of the cosmic microwave background.",
    overview: "COBE confirmed that the CMB has a near-perfect blackbody spectrum and, in 1992, detected its tiny temperature fluctuations — the seeds of cosmic structure. The result earned the 2006 Nobel Prize in Physics.",
    sources: ["nasa"],
  },
  {
    slug: "wmap", name: "WMAP (Wilkinson Microwave Anisotropy Probe)", kind: "space-mission", years: "2001–2010",
    operatorId: "organization:nasa",
    definition: "NASA's Wilkinson Microwave Anisotropy Probe, which mapped the CMB in detail and pinned down the cosmological parameters.",
    overview: "WMAP produced the first high-resolution full-sky map of CMB temperature fluctuations, measuring the age, composition, and geometry of the Universe to unprecedented precision and cementing the ΛCDM model.",
    sources: ["nasa"],
  },
  {
    slug: "desi", name: "DESI (Dark Energy Spectroscopic Instrument)", kind: "survey", years: "2021–",
    operatorId: "organization:noirlab",
    definition: "A spectroscopic survey measuring the redshifts of tens of millions of galaxies to map cosmic expansion and dark energy.",
    overview: "Mounted on the Mayall Telescope at Kitt Peak, DESI is building the largest 3-D map of the Universe, using baryon acoustic oscillations to trace expansion history. Its early results hint that dark energy may not be perfectly constant.",
    sources: ["desi", "noirlab"],
  },
  {
    slug: "kagra", name: "KAGRA", kind: "ground-observatory", years: "2020–",
    definition: "A Japanese underground, cryogenic gravitational-wave detector, the fourth major observatory in the global network.",
    overview: "Located deep in the Kamioka mine, KAGRA joins LIGO and Virgo to form a worldwide gravitational-wave network, improving the localisation of merging black holes and neutron stars.",
    sources: ["ligo"],
  },
  {
    slug: "event-horizon-telescope", name: "Event Horizon Telescope (EHT)", kind: "ground-observatory", years: "2017–",
    definition: "A planet-scale network of radio telescopes that images the shadows of supermassive black holes.",
    overview: "By linking dishes across the globe (including ALMA) into a single Earth-sized virtual telescope, the EHT produced the first image of a black hole — M87* in 2019 — and of the Milky Way's Sagittarius A* in 2022.",
    sources: ["eht"],
  },
];

/**
 * Physicists essential to cosmology who are not already in the graph. Created as
 * lightweight astronomer entities (the closest existing type) so relations like
 * "developed general relativity" have a real endpoint.
 */
export const PHYSICISTS: PhysicistRecord[] = [
  {
    slug: "albert-einstein", name: "Albert Einstein", fullName: "Albert Einstein",
    birthYear: 1879, deathYear: 1955, nationality: "German-American",
    fields: ["Theoretical physics", "Relativity", "Cosmology"],
    bio: "Albert Einstein reshaped our understanding of space, time, and gravity. His 1905 theory of special relativity and 1915 theory of general relativity form the foundation of modern cosmology, predicting the expansion of the Universe, black holes, and gravitational waves. His cosmological constant, introduced in 1917 and long dismissed, returned as the leading description of dark energy.",
    sources: ["nasa", "britannica"],
  },
];
