import type { ModelRecord } from "@/knowledge-graph/data/cosmology-catalog/types";

/**
 * Cosmological models. The standard model (ΛCDM) is kept distinct from
 * alternatives and from speculative hypotheses; each carries an honest
 * consensus level and standing.
 */
export const MODELS: ModelRecord[] = [
  {
    slug: "lambda-cdm", name: "The Lambda-CDM Model", consensus: "strong-evidence", standing: "standard",
    definition: "The standard model of cosmology: a flat, expanding Universe dominated by a cosmological constant (Λ) and cold dark matter (CDM).",
    overview: "ΛCDM is the simplest model that fits nearly all cosmological observations — the cosmic microwave background, large-scale structure, the light-element abundances, and the accelerating expansion — with just six parameters. It describes a Universe that is about 68% dark energy, 27% dark matter, and 5% ordinary matter.",
    scientificStatus: "The standard model of cosmology, supported by strong and diverse evidence. It is not complete: the nature of dark matter and dark energy is unknown, and tensions (notably the Hubble tension) may point to physics beyond it.",
    historicalDevelopment: "Emerged in the late 1990s as dark-energy evidence combined with CMB and structure data; refined to percent-level precision by WMAP and Planck.",
    evidence: ["Fits the full CMB power spectrum (Planck)", "Reproduces large-scale structure and BAO", "Matches Big Bang nucleosynthesis and the accelerating expansion"],
    openQuestions: ["What are dark matter and dark energy?", "Is the Hubble tension a sign of new physics?", "Is dark energy truly a constant?"],
    measurements: [
      { label: "Dark energy (Λ)", value: "≈ 68%", source: "planck" },
      { label: "Cold dark matter", value: "≈ 27%", source: "planck" },
      { label: "Ordinary matter", value: "≈ 5%", source: "planck" },
      { label: "Geometry", value: "Flat (Ω ≈ 1)", source: "planck" },
    ],
    dependsOn: ["cosmic-inflation"],
    relatedConcepts: ["dark-matter", "dark-energy", "cosmological-constant", "the-big-bang", "cosmic-microwave-background"],
    sources: ["planck", "nasa"],
  },
  {
    slug: "modified-newtonian-dynamics", name: "Modified Newtonian Dynamics (MOND)", consensus: "debate", standing: "alternative",
    definition: "An alternative proposal that modifies the law of gravity at very low accelerations instead of invoking dark matter.",
    overview: "MOND, proposed by Mordehai Milgrom in 1983, adjusts Newton's second law at tiny accelerations to explain flat galaxy rotation curves without dark matter. It succeeds remarkably at the scale of individual galaxies.",
    scientificStatus: "A minority alternative under scientific debate. MOND works well for galaxies but struggles with galaxy clusters, gravitational lensing (e.g. the Bullet Cluster), and the cosmic microwave background, where dark matter succeeds — so most cosmologists favour dark matter.",
    openQuestions: ["Can any relativistic version of MOND match the CMB and clusters?"],
    relatedConcepts: ["dark-matter"],
    sources: ["nasa"],
  },
  {
    slug: "multiverse", name: "The Multiverse", consensus: "speculative", standing: "speculative",
    definition: "The hypothesis that our observable Universe is one of many, or of infinitely many, universes.",
    overview: "Several ideas — eternal inflation, the string-theory landscape, and interpretations of quantum mechanics — suggest our Universe may be one region among a vast ensemble with different properties. It is sometimes invoked to explain why physical constants appear fine-tuned for structure.",
    scientificStatus: "A speculative hypothesis. By most formulations, other universes are unobservable in principle, so whether the idea is testable science at all is itself debated.",
    openQuestions: ["Is the multiverse testable, even in principle?", "Does eternal inflation necessarily produce one?"],
    relatedConcepts: ["cosmic-inflation"],
    sources: ["nasa"],
  },
  {
    slug: "cyclic-universe", name: "Cyclic & Bouncing Cosmologies", consensus: "speculative", standing: "speculative",
    definition: "Models in which the Universe undergoes repeated cycles of expansion and contraction, or a 'bounce' instead of a singular beginning.",
    overview: "Cyclic and bouncing models propose that the Big Bang was not the absolute beginning but a transition from a previous phase, potentially avoiding the initial singularity. Examples include the ekpyrotic model and various quantum-bounce scenarios.",
    scientificStatus: "Speculative hypotheses. They are actively explored theoretically but lack distinctive observational support, and the standard hot Big Bang with inflation remains the mainstream picture.",
    openQuestions: ["Could a bounce leave an observable imprint?", "Do such models solve the problems inflation solves?"],
    relatedConcepts: ["the-big-bang", "cosmic-inflation"],
    sources: ["nasa"],
  },
];
