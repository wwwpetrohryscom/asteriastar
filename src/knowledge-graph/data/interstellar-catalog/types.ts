import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Interstellar & Hyperbolic Objects Encyclopedia data model (Program AB) — the coda to
 * the small-body arc (Y asteroids → Z comets → AA meteorites → AB interstellar). A
 * COMPACT authority catalogue, not a mass-page domain.
 *
 * Hand-curated from authoritative public sources — the IAU Minor Planet Center (which
 * assigns the "I" interstellar designations), the NASA/JPL Small-Body Database and
 * CNEOS, ESO/observatory reports, and the peer-reviewed discovery literature. EVERY
 * technical field is optional and omitted when not reliably known: eccentricities,
 * discovery dates, discoverers, trajectories, and compositions are NEVER invented.
 *
 * The single most important rule of this catalogue is HONEST STATUS: a confirmed
 * interstellar object, a candidate, a debated claim, and a Solar-System comet merely on
 * a (weakly) hyperbolic orbit are DIFFERENT things, typed and labelled separately, and
 * never conflated. Interstellar origin is asserted only where the excess hyperbolic
 * velocity is unambiguous and the object carries an IAU interstellar designation.
 *
 * Cross-references reuse existing graph entities — the comet dynamical classes
 * (Program Z), the sky surveys and observatories (Pan-STARRS, Vera C. Rubin / LSST),
 * and the NASA/JPL organization — and duplicate none of them.
 */

export type InterstellarKind =
  | "object" // a CONFIRMED interstellar object (1I/ʻOumuamua, 2I/Borisov, 3I/ATLAS)
  | "candidate" // a debated / unconfirmed interstellar claim (never treated as confirmed)
  | "hyperbolic-comet" // a Solar-System comet on a (weakly) hyperbolic / near-parabolic orbit
  | "detection-method" // a method used to identify interstellar / hyperbolic objects
  | "trajectory-class" // an orbital-trajectory class defined by eccentricity
  | "survey" // a detection survey (existing type reused; new ones created without a hub page)
  | "organization"; // a cataloguing body (existing type reused; new ones created likewise)

/** The graph EntityType each kind maps to. survey / organization reuse existing types. */
export const KIND_ENTITY_TYPE: Record<InterstellarKind, EntityType> = {
  object: "interstellar_object",
  candidate: "interstellar_candidate",
  "hyperbolic-comet": "hyperbolic_comet",
  "detection-method": "interstellar_detection_method",
  "trajectory-class": "trajectory_class",
  survey: "sky_survey",
  organization: "organization",
};

export const KIND_LABEL: Record<InterstellarKind, string> = {
  object: "Interstellar object",
  candidate: "Interstellar candidate",
  "hyperbolic-comet": "Hyperbolic comet",
  "detection-method": "Detection method",
  "trajectory-class": "Trajectory class",
  survey: "Sky survey",
  organization: "Organization",
};

/**
 * The scientific status of an object — the backbone of this catalogue's honesty. Drives
 * the status badge and keeps confirmed and candidate objects visually separated.
 */
export type InterstellarStatus =
  | "confirmed_interstellar" // unambiguous interstellar origin + IAU "I" designation
  | "candidate_interstellar" // proposed interstellar, not yet confirmed
  | "hyperbolic_solar_system_object" // bound to / originated in the Solar System; (weakly) hyperbolic orbit
  | "debated_origin" // interstellar origin claimed but disputed / data uncertain
  | "rejected_or_uncertain"; // interstellar origin proposed and not supported

export const STATUS_LABEL: Record<InterstellarStatus, string> = {
  confirmed_interstellar: "Confirmed interstellar",
  candidate_interstellar: "Candidate interstellar",
  hyperbolic_solar_system_object: "Hyperbolic (Solar-System origin)",
  debated_origin: "Debated origin",
  rejected_or_uncertain: "Rejected / uncertain",
};

/** Broad browse category — drives some discovery hubs (not a graph entity). */
export type InterstellarCategory =
  | "confirmed"
  | "candidate"
  | "hyperbolic-comet"
  | "method"
  | "trajectory";

export interface InterstellarRecord {
  /* --- identity / graph --- */
  id: string; // "<type>:<slug>"
  slug: string;
  name: string;
  kind: InterstellarKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  /** True when this id already exists in the graph (reference, don't create). */
  existing?: boolean;

  /* --- scientific status (object / candidate / hyperbolic-comet) --- */
  status?: InterstellarStatus;

  /* --- cross-references (resolved in the index; reuse existing entities) --- */
  trajectoryClassSlug?: string; // → trajectory_class (has_trajectory_class)
  relatedClassSlugs?: string[]; // trajectory_class → trajectory_class (related_to, the e-ladder)
  detectionMethodSlugs?: string[]; // → interstellar_detection_method (associated_with)
  surveyKeys?: string[]; // full sky_survey ids (surveyed_by) — new or reused
  cataloguedByKeys?: string[]; // full organization ids (catalogued_in) — MPC / JPL
  cometClassKeys?: string[]; // full comet_class ids (associated_with) — related comet class
  observedByKeys?: string[]; // full observatory / space_telescope ids (observed_by)
  relatedKeys?: string[]; // full ids of existing entities (associated_with)

  /* --- display specs, ALL optional, never invented --- */
  category?: InterstellarCategory;
  designation?: string; // formal designation, e.g. "1I/ʻOumuamua", "C/2019 Q4 (Borisov)"
  discoveredBy?: string; // human / team attribution (surveys are graph relations)
  discoveryDate?: string; // ISO or partial, e.g. "2017-10-19"
  discoverySurveyLabel?: string; // survey/facility label for the quick-facts row

  // orbital — never fabricated; omitted when not reliably known
  eccentricity?: number; // e (interstellar objects are strongly hyperbolic, e > 1)
  perihelionAu?: number;
  inclinationDeg?: number;
  velocityLabel?: string; // hyperbolic excess velocity v∞, as a hedged string ("≈ 26 km/s")
  perihelionDate?: string;

  // physical / descriptive — kept qualitative where quantitative values are uncertain
  sizeLabel?: string;
  compositionLabel?: string;
  activityLabel?: string; // cometary activity, coma, etc.
  originLabel?: string;

  // honesty
  uncertaintyNote?: string; // required framing for candidate / debated objects
  trajectoryLabel?: string; // human trajectory summary, e.g. "Hyperbolic (e ≈ 1.20)"

  // definitions (trajectory-class / detection-method / survey / organization)
  eccentricityRangeLabel?: string; // e.g. "e > 1", "e ≫ 1"
  definition?: string;

  highlights?: string[];
}
