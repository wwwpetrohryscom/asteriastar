import type { TimelinePoint } from "@/knowledge-graph/data/cosmology-catalog/types";

/**
 * The Universe timeline — the scientific history of the cosmos, from the Big
 * Bang to the far future. Times are the current best estimates and carry real
 * scientific uncertainty; the far-future entries are model-dependent projections
 * of the standard model, not certainties. Entries with a `slug` link to a
 * cosmology entity.
 */
export const UNIVERSE_TIMELINE: TimelinePoint[] = [
  { order: 1, time: "t = 0", title: "The Big Bang", slug: "the-big-bang",
    description: "The observable Universe begins expanding from a hot, dense state about 13.8 billion years ago." },
  { order: 2, time: "~10⁻³⁶ s", title: "Cosmic Inflation", slug: "cosmic-inflation",
    description: "A hypothesised burst of exponential expansion smooths and flattens the Universe (leading paradigm, not yet confirmed)." },
  { order: 3, time: "~3 minutes", title: "Big Bang Nucleosynthesis", slug: "big-bang-nucleosynthesis",
    description: "The first light nuclei — hydrogen, helium, and traces of lithium — form." },
  { order: 4, time: "~380,000 years", title: "Recombination & the CMB", slug: "recombination",
    description: "Atoms form and the Universe becomes transparent, releasing the cosmic microwave background." },
  { order: 5, time: "~0.38–150 million years", title: "The Cosmic Dark Ages", slug: "cosmic-dark-ages",
    description: "Neutral gas fills a starless Universe, slowly drawn together by gravity and dark matter." },
  { order: 6, time: "~100–400 million years", title: "Cosmic Dawn — First Stars", slug: "cosmic-dawn",
    description: "The first stars and galaxies ignite; JWST is now observing this era directly." },
  { order: 7, time: "~150 million–1 billion years", title: "Reionization", slug: "reionization",
    description: "Radiation from the first galaxies re-ionizes the intergalactic hydrogen." },
  { order: 8, time: "~1–10 billion years", title: "Galaxies & the Cosmic Web", slug: "structure-formation",
    description: "Galaxies grow and assemble into clusters and the filamentary cosmic web." },
  { order: 9, time: "~9.2 billion years", title: "Formation of the Solar System",
    description: "About 4.6 billion years ago, the Sun and planets form from a collapsing cloud in the Milky Way." },
  { order: 10, time: "~13.8 billion years", title: "The Present Universe", slug: "present-universe",
    description: "Today the Universe is flat, expanding ever faster, and dominated by dark energy and dark matter." },
  { order: 11, time: "Far future", title: "Future Scenarios",
    description: "If dark energy remains constant, expansion continues forever toward a cold, dilute 'heat death'. The outcome depends on the nature of dark energy — an open question, not a certainty." },
];
