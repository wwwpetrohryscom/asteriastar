import type { SourceKey } from "@/lib/sources";

/**
 * Cosmology & Universe — data model (Program I).
 *
 * The defining rule of this encyclopedia is that every topic is explicitly
 * classified by its scientific consensus, and established science, strong
 * evidence, active research, scientific debate, and speculative hypotheses are
 * NEVER mixed. Nothing is fabricated: measurements carry their source, and the
 * scientific status of each topic is stated honestly. Entities already in the
 * graph (theories, discoveries, scientists, black holes, missions,
 * observatories) are reused by id, never duplicated.
 */

/* ------------------------------------------------- consensus classification */

export const CONSENSUS_LEVELS = ["established", "strong-evidence", "active-research", "debate", "speculative"] as const;
export type ConsensusLevel = (typeof CONSENSUS_LEVELS)[number];

export interface ConsensusMeta {
  level: ConsensusLevel;
  label: string;
  /** One-line meaning, shown in the legend and the sidebar card. */
  description: string;
  /** Badge classes (border + bg + text), using colors already in the design system. */
  classes: string;
  /** Status-dot class. */
  dot: string;
  order: number;
}

export const CONSENSUS: Record<ConsensusLevel, ConsensusMeta> = {
  established: {
    level: "established", label: "Established Science", order: 1,
    description: "Observationally confirmed and consistent across all leading models.",
    classes: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300", dot: "bg-emerald-400",
  },
  "strong-evidence": {
    level: "strong-evidence", label: "Strong Evidence", order: 2,
    description: "Strongly supported by multiple independent observations; some details remain open.",
    classes: "border-sky-400/30 bg-sky-400/10 text-sky-300", dot: "bg-sky-400",
  },
  "active-research": {
    level: "active-research", label: "Active Research", order: 3,
    description: "A leading paradigm or an area of intense study, not yet definitively settled.",
    classes: "border-amber-400/30 bg-amber-400/10 text-amber-300", dot: "bg-amber-400",
  },
  debate: {
    level: "debate", label: "Scientific Debate", order: 4,
    description: "Competing interpretations of the current evidence, with no consensus yet.",
    classes: "border-orange-400/30 bg-orange-400/10 text-orange-300", dot: "bg-orange-400",
  },
  speculative: {
    level: "speculative", label: "Speculative Hypothesis", order: 5,
    description: "A theoretical possibility with limited or no direct observational support.",
    classes: "border-amber-300/30 bg-amber-300/10 text-amber-200", dot: "bg-amber-300",
  },
};

/* ------------------------------------------------------------------ records */

export type ConceptCategory = "phenomenon" | "epoch" | "concept" | "physical-concept" | "law" | "theory" | "quantity";

export interface Measurement {
  label: string;
  value: string;
  source?: SourceKey;
  note?: string;
}

/** Relation-bearing fields shared by cosmology topics. Slugs resolve to this
 * catalog's own entities; *Ids fields hold full ids of REUSED graph entities. */
export interface TopicLinks {
  /** cosmology_concept slugs → depends_on. */
  dependsOn?: string[];
  /** cosmology_concept slugs → predicts (this topic predicts the phenomenon). */
  predicts?: string[];
  /** cosmology_concept slugs → related_to. */
  relatedConcepts?: string[];
  /** astrophysical_object_class slugs → related_to. */
  relatedObjects?: string[];
  /** cosmological_model slug → part_of_model. */
  partOfModel?: string;
  /** cosmology_concept / object slugs this contains (structure hierarchy) → contains. */
  contains?: string[];
  /** Reused astronomical_theory ids → depends_on. */
  theoryIds?: string[];
  /** Reused historical_discovery ids → confirmed_by. */
  confirmedBy?: string[];
  /** Reused historical_discovery ids → related_to. */
  relatedDiscoveries?: string[];
  /** Reused astronomer ids → studied_by. */
  studiedBy?: string[];
  /** Reused astronomer ids → (astronomer developed this topic). */
  developedBy?: string[];
  /** Full ids of reused missions/observatories/surveys OR observational_program ids → measured_by. */
  measuredBy?: string[];
  /** Reused example entity ids (black_hole:*, galaxy:*, …) → related_to. */
  examples?: string[];
}

export interface ConceptRecord extends TopicLinks {
  slug: string;
  name: string;
  category: ConceptCategory;
  consensus: ConsensusLevel;
  field?: string;
  definition: string;
  overview: string;
  /** Honest one/two-sentence statement of where this stands scientifically. */
  scientificStatus: string;
  historicalDevelopment?: string;
  evidence?: string[];
  currentResearch?: string;
  openQuestions?: string[];
  measurements?: Measurement[];
  mathematics?: string;
  /** For epochs: a human time label and an ordering key for the universe timeline. */
  epochTime?: string;
  epochOrder?: number;
  sources: SourceKey[];
}

export interface ModelRecord extends TopicLinks {
  slug: string;
  name: string;
  consensus: ConsensusLevel;
  /** The model's standing: the standard model, an alternative, historical, or speculative. */
  standing: "standard" | "alternative" | "historical" | "speculative";
  definition: string;
  overview: string;
  scientificStatus: string;
  historicalDevelopment?: string;
  evidence?: string[];
  openQuestions?: string[];
  measurements?: Measurement[];
  sources: SourceKey[];
}

export interface ObjectClassRecord extends TopicLinks {
  slug: string;
  name: string;
  plural?: string;
  consensus: ConsensusLevel;
  category: "black-hole" | "stellar-remnant" | "active-galaxy" | "substellar" | "structure" | "dark";
  definition: string;
  overview: string;
  scientificStatus: string;
  evidence?: string[];
  openQuestions?: string[];
  measurements?: Measurement[];
  sources: SourceKey[];
}

export interface ProgramRecord {
  slug: string;
  name: string;
  kind: "space-mission" | "ground-observatory" | "survey";
  years?: string;
  /** Reused organization id → operated_by. */
  operatorId?: string;
  definition: string;
  overview: string;
  /** cosmology_concept slugs this program measures → (concept measured_by program) handled on concepts; here for prose. */
  sources: SourceKey[];
}

/** A physicist essential to cosmology but not already in the graph (e.g. Einstein). */
export interface PhysicistRecord {
  slug: string;
  name: string;
  fullName?: string;
  birthYear?: number;
  deathYear?: number;
  nationality?: string;
  fields?: string[];
  bio: string;
  sources: SourceKey[];
}

/** A dated point on the Universe timeline (may carry uncertainty). */
export interface TimelinePoint {
  order: number;
  time: string;
  title: string;
  slug?: string;
  description: string;
}
