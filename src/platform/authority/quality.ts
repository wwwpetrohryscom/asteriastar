import {
  getRelationsForEntity,
  entityGraphPath,
  type GraphEntity,
} from "@/knowledge-graph";
import { getImagesForEntity } from "@/lib/media/registry";
import { TIMELINES } from "@/lib/timelines";
import { getReviewForEntity } from "@/platform/authority/review";
import { PROVENANCE } from "@/platform/authority/provenance";

/**
 * Data quality framework.
 *
 * Quality is NOT an invented score — it is structured completeness derived from
 * what actually exists for an entity (description, sources, relationships,
 * review, imagery, citations, timeline). Honest gaps stay visible.
 *
 * ---------------------------------------------------------------------------
 * Why this model reports a BAND and not a percentage
 * ---------------------------------------------------------------------------
 * An earlier version averaged eight dimensions into a percentage, which
 * produced readings like "13% complete" on pages that were not 13% of anything.
 * Three specific defects made that number indefensible, and all three are fixed
 * here:
 *
 *   1. FALSE PRECISION. Averaging eight three-valued dimensions yields only 17
 *      distinct outcomes. Rendering one of them as "13%" implies a measurement
 *      resolution the model does not have. This version reports a band —
 *      Early / Partial / Substantial / Complete — plus the raw counts the band
 *      is derived from, so the reader sees the actual evidence.
 *
 *   2. PENALISING LEGITIMATE ABSENCE. No resolved photograph exists of any
 *      exoplanet, and none exists of the overwhelming majority of catalogue
 *      stars. Scoring those entities down for "missing" imagery reported a
 *      defect where reality is simply that the observation cannot be made.
 *      Dimensions that cannot meaningfully apply are now `not-applicable` and
 *      are excluded from the denominator entirely.
 *
 *   3. A UNIFORM DIMENSION CARRYING ZERO INFORMATION. Localization coverage was
 *      `none` for all 7,000+ entities, because the translation registry ships
 *      empty by design — so it subtracted the same amount from every entity
 *      while distinguishing nothing. It has been removed from the model rather
 *      than left in to depress every score identically. Platform localization
 *      status belongs on a platform page, not on every entity.
 *
 * The dimension formerly called "completeness" is now "description", because
 * that is all it measured. A dimension named Completeness reading "Complete"
 * next to an overall "13% complete" was an internal contradiction visible to
 * readers.
 */

export type CoverageLevel = "complete" | "partial" | "none" | "not-applicable";

/** Categorical quality state. Deterministic, and free of false precision. */
export type QualityBand = "early" | "partial" | "substantial" | "complete";

export type QualityDimension =
  | "description"
  | "sourceCoverage"
  | "citationCoverage"
  | "relationshipCoverage"
  | "reviewCoverage"
  | "imageCoverage"
  | "timelineCoverage";

export const QUALITY_DIMENSION_LABELS: Record<QualityDimension, string> = {
  description: "Description",
  sourceCoverage: "Source coverage",
  citationCoverage: "Citation coverage",
  relationshipCoverage: "Relationship coverage",
  reviewCoverage: "Review coverage",
  imageCoverage: "Image coverage",
  timelineCoverage: "Timeline coverage",
};

export const QUALITY_BAND_LABELS: Record<QualityBand, string> = {
  early: "Early",
  partial: "Partial",
  substantial: "Substantial",
  complete: "Complete",
};

export const QUALITY_BAND_ACCENT: Record<QualityBand, string> = {
  early: "stone",
  partial: "comet",
  substantial: "nebula",
  complete: "halo",
};

/** One-line explanation of what each band means, shown to readers. */
export const QUALITY_BAND_MEANING: Record<QualityBand, string> = {
  early: "Identified and described, with little supporting structure yet.",
  partial: "Some applicable coverage in place; substantial gaps remain.",
  substantial: "Most applicable coverage in place.",
  complete: "Every dimension that can apply to this entity is complete.",
};

export interface EntityQuality {
  entityId: string;
  indicators: Record<QualityDimension, CoverageLevel>;
  /** Dimensions that can meaningfully apply to this entity. */
  applicableCount: number;
  /** Applicable dimensions rated `complete`. */
  completeCount: number;
  /** Applicable dimensions rated `partial`. */
  partialCount: number;
  /** Deterministic categorical state — no false precision. */
  band: QualityBand;
  overall: CoverageLevel;
}

const DIMENSIONS: QualityDimension[] = [
  "description",
  "sourceCoverage",
  "citationCoverage",
  "relationshipCoverage",
  "reviewCoverage",
  "imageCoverage",
  "timelineCoverage",
];

/* -------------------------------------------------------- applicability */

/**
 * Entity types for which an authentic photograph or observation routinely
 * exists. Absence of imagery on one of these is a real, closeable gap.
 *
 * Everything NOT in this set is treated as image-not-applicable *unless* an
 * image actually exists for it — so a famous named star with a verified image
 * still reports `complete`, while the ~2,970 catalogue stars with no resolved
 * imagery in existence are not marked deficient for a photograph nobody can
 * take. Exoplanets, host stars and planetary systems are deliberately excluded:
 * zero of them have resolved imagery, and none can.
 */
const IMAGE_ELIGIBLE_TYPES = new Set<string>([
  "planet", "dwarf_planet", "moon", "galaxy", "nebula", "star_cluster",
  "supernova_remnant", "comet", "asteroid", "meteorite", "surface_feature",
  "constellation", "space_mission", "spacecraft", "launch_vehicle", "satellite",
  "space_telescope", "telescope", "observatory", "astronaut",
  "space_weather_phenomenon", "space_station", "interstellar_object",
]);

/**
 * Entity types that are datable events, missions, or discoveries — the only
 * things a timeline can meaningfully contain. A spectral class or a coordinate
 * system has no date, so its absence from a timeline is not a gap.
 */
const TIMELINE_ELIGIBLE_TYPES = new Set<string>([
  "space_mission", "mission_program", "mission_milestone", "historical_discovery",
  "timeline_event", "expedition", "launch_vehicle", "space_telescope",
  "astronomer", "publication", "astronomy_era", "spacecraft", "space_station",
]);

/**
 * Types that carry measured or catalogued numeric values, for which a
 * field-level provenance record is meaningful. A concept page has no
 * measurement to cite, so citation coverage does not apply to it.
 */
const MEASURED_TYPES = new Set<string>([
  "star", "exoplanet", "host_star", "planetary_system", "planet", "dwarf_planet",
  "moon", "galaxy", "nebula", "star_cluster", "supernova_remnant", "comet",
  "asteroid", "meteorite", "satellite", "launch_vehicle", "space_telescope",
  "telescope", "observatory", "space_mission", "interstellar_object",
  "rocket_engine", "rocket_stage", "scientific_instrument",
]);

/** The entity type is the id prefix — `star:sirius` → `star`. */
export function entityTypeOf(entityId: string): string {
  return entityId.split(":")[0] ?? "";
}

// Build a path → timeline-presence index once.
const TIMELINE_PATHS = new Set<string>();
for (const t of TIMELINES) for (const ev of t.events) if (ev.href) TIMELINE_PATHS.add(ev.href);

const PROVENANCE_ENTITY_IDS = new Set(PROVENANCE.map((p) => p.entityId));

function level(n: number, partialAt = 1, completeAt = 3): CoverageLevel {
  if (n >= completeAt) return "complete";
  if (n >= partialAt) return "partial";
  return "none";
}

/** Compute structured completeness indicators for an entity (real data only). */
export function computeEntityQuality(entity: GraphEntity): EntityQuality {
  const type = entityTypeOf(entity.id);
  const path = entityGraphPath(entity);
  const review = getReviewForEntity(entity.id);
  const reviewLevel: CoverageLevel =
    review?.status === "verified" || review?.status === "reviewed"
      ? "complete"
      : review?.status === "in-review"
        ? "partial"
        : "none";

  const imageCount = getImagesForEntity(entity.id).length;
  const hasTimeline =
    TIMELINE_PATHS.has(path) || (entity.entryPath ? TIMELINE_PATHS.has(entity.entryPath) : false);
  const hasProvenance = PROVENANCE_ENTITY_IDS.has(entity.id);

  const indicators: Record<QualityDimension, CoverageLevel> = {
    description: entity.description ? "complete" : "none",
    sourceCoverage: level(entity.sources?.length ?? 0, 1, 2),
    relationshipCoverage: level(getRelationsForEntity(entity.id).length),
    reviewCoverage: reviewLevel,

    // Applicability-aware dimensions. An existing record always counts as
    // complete; absence only counts against the entity where the thing could
    // exist in the first place.
    citationCoverage: hasProvenance
      ? "complete"
      : MEASURED_TYPES.has(type)
        ? "none"
        : "not-applicable",
    imageCoverage: imageCount > 0
      ? "complete"
      : IMAGE_ELIGIBLE_TYPES.has(type)
        ? "none"
        : "not-applicable",
    timelineCoverage: hasTimeline
      ? "complete"
      : TIMELINE_ELIGIBLE_TYPES.has(type)
        ? "none"
        : "not-applicable",
  };

  const applicable = DIMENSIONS.filter((d) => indicators[d] !== "not-applicable");
  const completeCount = applicable.filter((d) => indicators[d] === "complete").length;
  const partialCount = applicable.filter((d) => indicators[d] === "partial").length;
  const applicableCount = applicable.length;

  const score =
    applicableCount === 0 ? 0 : (completeCount + partialCount * 0.5) / applicableCount;

  // "Complete" means exactly what it says: nothing applicable is outstanding.
  const band: QualityBand =
    applicableCount > 0 && completeCount === applicableCount
      ? "complete"
      : score >= 0.6
        ? "substantial"
        : score >= 0.3
          ? "partial"
          : "early";

  const overall: CoverageLevel =
    band === "complete" ? "complete" : band === "early" ? "none" : "partial";

  return { entityId: entity.id, indicators, applicableCount, completeCount, partialCount, band, overall };
}

export const COVERAGE_ACCENT: Record<CoverageLevel, string> = {
  complete: "halo",
  partial: "comet",
  none: "stone",
  "not-applicable": "stone",
};

export const COVERAGE_LABELS: Record<CoverageLevel, string> = {
  complete: "Complete",
  partial: "Partial",
  none: "None",
  "not-applicable": "Not applicable",
};

/**
 * Why a dimension does not apply — shown on hover so "Not applicable" is never
 * mistaken for "we did not bother".
 */
export const NOT_APPLICABLE_REASON: Record<QualityDimension, string> = {
  description: "",
  sourceCoverage: "",
  relationshipCoverage: "",
  reviewCoverage: "",
  citationCoverage: "This entity has no catalogued measurement for a field-level citation to attach to.",
  imageCoverage: "No authentic resolved image of this object exists — its absence is a fact about observation, not a gap in this record.",
  timelineCoverage: "This entity is not a dated event, so it has no place on a timeline.",
};
