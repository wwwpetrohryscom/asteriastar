import type { EvidenceLevel } from "@/platform/authority/evidence";

/**
 * Scientific Contributions & Review Workflow — core schema (Program M).
 *
 * This is NOT public editing and NOT a social network. It is a controlled,
 * review-first workflow: a contribution is a structured PROPOSAL, never a direct
 * change to the knowledge graph. The graph remains the single source of truth;
 * proposals only become versioned graph updates AFTER approval.
 *
 * This module defines pure, framework-independent types and registries. There is
 * no backend, no persistence, no authentication, and no fabricated data. All
 * live registries (proposals, changesets, audit) are intentionally empty.
 */

/* ------------------------------------------------------------ target kinds */
/** The kinds of real platform objects a contribution can attach to. */
export type TargetKind =
  | "entity"
  | "relationship"
  | "dataset"
  | "source"
  | "citation"
  | "image"
  | "timeline"
  | "learning_path"
  | "api";

/** A resolved reference from a contribution to a real platform object. */
export interface TargetRef {
  kind: TargetKind;
  /** The stable id (entity `type:slug`, relationship `from|type|to`, dataset slug,
   *  source key, image slug, timeline slug, learning-path slug, or api endpoint path). */
  id: string;
}

/* -------------------------------------------------------- contribution types */
export type ContributionType =
  | "entity_correction"
  | "relationship_correction"
  | "new_relationship"
  | "new_entity"
  | "source_addition"
  | "citation_addition"
  | "provenance_improvement"
  | "image_submission"
  | "image_metadata_correction"
  | "translation_suggestion"
  | "timeline_correction"
  | "dataset_issue"
  | "api_issue"
  | "scientific_review_note"
  | "editorial_review_note";

/** Which review track a contribution flows through by default. */
export type ReviewTrack = "editorial" | "scientific" | "source" | "image" | "translation";

/** Deterministic quality dimensions an accepted contribution can improve. */
export type ImpactCategory =
  | "sourceCoverage"
  | "citationCoverage"
  | "relationshipCoverage"
  | "reviewCoverage"
  | "imageCoverage"
  | "localizationCoverage"
  | "datasetCompleteness"
  | "scientificAccuracy"
  | "historicalAccuracy";

export interface ContributionTypeDef {
  id: ContributionType;
  label: string;
  description: string;
  /** At least one of these target kinds must be referenced (no orphan proposals). */
  requiredTargets: TargetKind[];
  /** Additional target kinds that may be referenced. */
  optionalTargets: TargetKind[];
  /** The default review track. */
  track: ReviewTrack;
  /** True when the proposal makes a scientific/factual claim needing a source. */
  requiresSource: boolean;
  /** True when the proposal must carry image provenance (license + credit + source). */
  requiresImageProvenance: boolean;
  /** True when this type proposes a not-yet-existing object (new entity/relationship). */
  proposesNew: boolean;
  /** Quality dimensions an accepted contribution of this type can improve. */
  impact: ImpactCategory[];
}

export const CONTRIBUTION_TYPES: ContributionTypeDef[] = [
  { id: "entity_correction", label: "Entity correction", description: "Correct a field on an existing entity (e.g. a planet's radius), backed by a source.", requiredTargets: ["entity"], optionalTargets: ["source"], track: "scientific", requiresSource: true, requiresImageProvenance: false, proposesNew: false, impact: ["scientificAccuracy", "sourceCoverage"] },
  { id: "relationship_correction", label: "Relationship correction", description: "Correct the type, confidence, domain, or note of an existing relationship.", requiredTargets: ["relationship"], optionalTargets: ["source"], track: "scientific", requiresSource: true, requiresImageProvenance: false, proposesNew: false, impact: ["relationshipCoverage", "scientificAccuracy"] },
  { id: "new_relationship", label: "New relationship suggestion", description: "Propose a new typed relationship between two existing entities.", requiredTargets: ["entity"], optionalTargets: ["source"], track: "scientific", requiresSource: true, requiresImageProvenance: false, proposesNew: true, impact: ["relationshipCoverage"] },
  { id: "new_entity", label: "New entity suggestion", description: "Propose a new entity (with a stable id) and its initial sourced metadata.", requiredTargets: [], optionalTargets: ["entity", "source"], track: "scientific", requiresSource: true, requiresImageProvenance: false, proposesNew: true, impact: ["datasetCompleteness", "scientificAccuracy"] },
  { id: "source_addition", label: "Source addition", description: "Add an authoritative source that supports an existing entity or relationship.", requiredTargets: ["entity", "relationship"], optionalTargets: ["source"], track: "source", requiresSource: true, requiresImageProvenance: false, proposesNew: false, impact: ["sourceCoverage"] },
  { id: "citation_addition", label: "Citation addition", description: "Attach a formal citation (paper, dataset, catalogue) to an entity or relationship.", requiredTargets: ["entity", "relationship"], optionalTargets: ["source", "citation"], track: "source", requiresSource: true, requiresImageProvenance: false, proposesNew: false, impact: ["citationCoverage", "sourceCoverage"] },
  { id: "provenance_improvement", label: "Provenance improvement", description: "Improve the provenance record of an entity, relationship, or image.", requiredTargets: ["entity", "relationship", "image"], optionalTargets: ["source"], track: "editorial", requiresSource: true, requiresImageProvenance: false, proposesNew: false, impact: ["sourceCoverage", "reviewCoverage"] },
  { id: "image_submission", label: "Image submission", description: "Submit a verified scientific image of an entity, with license, credit, and source.", requiredTargets: ["entity"], optionalTargets: ["source"], track: "image", requiresSource: true, requiresImageProvenance: true, proposesNew: true, impact: ["imageCoverage"] },
  { id: "image_metadata_correction", label: "Image metadata correction", description: "Correct the metadata (credit, source, instrument, provenance) of an existing image.", requiredTargets: ["image"], optionalTargets: ["source"], track: "image", requiresSource: false, requiresImageProvenance: true, proposesNew: false, impact: ["imageCoverage", "reviewCoverage"] },
  { id: "translation_suggestion", label: "Translation suggestion", description: "Suggest a localized title/description for an entity in another language.", requiredTargets: ["entity"], optionalTargets: [], track: "translation", requiresSource: false, requiresImageProvenance: false, proposesNew: false, impact: ["localizationCoverage"] },
  { id: "timeline_correction", label: "Timeline correction", description: "Correct or add an event on a sourced timeline.", requiredTargets: ["timeline"], optionalTargets: ["entity", "source"], track: "editorial", requiresSource: true, requiresImageProvenance: false, proposesNew: false, impact: ["historicalAccuracy"] },
  { id: "dataset_issue", label: "Dataset issue report", description: "Report a completeness or correctness issue with a published dataset.", requiredTargets: ["dataset"], optionalTargets: ["entity"], track: "editorial", requiresSource: false, requiresImageProvenance: false, proposesNew: false, impact: ["datasetCompleteness"] },
  { id: "api_issue", label: "API issue report", description: "Report an issue with an Open Data API endpoint or its documentation.", requiredTargets: [], optionalTargets: ["api"], track: "editorial", requiresSource: false, requiresImageProvenance: false, proposesNew: false, impact: [] },
  { id: "scientific_review_note", label: "Scientific review note", description: "A scientific reviewer's note on an entity, relationship, image, or dataset.", requiredTargets: ["entity", "relationship", "image", "dataset"], optionalTargets: ["source"], track: "scientific", requiresSource: false, requiresImageProvenance: false, proposesNew: false, impact: ["reviewCoverage", "scientificAccuracy"] },
  { id: "editorial_review_note", label: "Editorial review note", description: "An editor's note on an entity, relationship, image, dataset, or timeline.", requiredTargets: ["entity", "relationship", "image", "dataset", "timeline"], optionalTargets: [], track: "editorial", requiresSource: false, requiresImageProvenance: false, proposesNew: false, impact: ["reviewCoverage"] },
];

export const CONTRIBUTION_TYPE_BY_ID: Record<ContributionType, ContributionTypeDef> =
  Object.fromEntries(CONTRIBUTION_TYPES.map((t) => [t.id, t])) as Record<ContributionType, ContributionTypeDef>;

/* ------------------------------------------------------------ the proposal */
/** Evidence + source material backing a contribution (never fabricated). */
export interface ProposalEvidence {
  /** Free-text rationale for the change. */
  rationale: string;
  /** The evidence strength claimed for the change (validated against the domain). */
  evidenceLevel?: EvidenceLevel;
  /** Existing source keys, or free-text descriptions of a proposed source. */
  sourceRefs?: string[];
  /** For images: license id/name, credit, and source (provenance is mandatory). */
  imageProvenance?: { license?: string; credit?: string; source?: string };
}

/**
 * A structured contribution — a PROPOSAL. It carries who-role proposed it (not a
 * real account), what it targets, the proposed change as a changeset, evidence,
 * and its current review state. It never mutates anything.
 */
export interface Contribution {
  /** Stable id, conventionally `contribution:<slug>` — assigned at submission time (future). */
  id: string;
  type: ContributionType;
  title: string;
  /** The real platform objects this contribution attaches to (no orphans). */
  targets: TargetRef[];
  /** The proposed change, expressed as a changeset (see changesets.ts). */
  changesetId?: string;
  evidence: ProposalEvidence;
  /** The domain of the claim, used to enforce science/interpretive separation. */
  domain: "science" | "culture" | "astrology";
  /** Current review state (see states.ts). */
  state: import("@/platform/contributions/states").ContributionState;
  /** The role that authored the proposal (architecture only — not an account). */
  authorRole: import("@/platform/contributions/roles").RoleId;
}

/** Live proposal registry — intentionally EMPTY. No fabricated contributions. */
export const PROPOSALS: Contribution[] = [];
