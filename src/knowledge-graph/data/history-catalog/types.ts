import type { SourceKey } from "@/lib/sources";

/**
 * History of Astronomy — data model (Program H).
 *
 * Typed, curated records for astronomers, discoveries, publications, theories,
 * catalogues, eras, events, and awards. Records drive the derivation of
 * first-class knowledge-graph entities and typed, provenance-bearing relations.
 *
 * Rules: nothing is fabricated. Every birth/death year, discovery year,
 * publication year, attribution, and award is a well-established historical
 * fact drawn from authoritative reference sources. Every optional field is
 * omitted when not known — never invented. Existing graph entities (the 16
 * astronomers already in the graph, catalogues, observatories, telescopes,
 * missions, and objects) are reused by id, never duplicated.
 */

/** A year on the astronomical/historical scale. Negative = BCE. */
export type HistYear = number;

export interface AstronomerRecord {
  /** Slug; entity id is `astronomer:<slug>`, page at /history/<slug>. */
  slug: string;
  name: string;
  /** True when the astronomer already exists in the graph (reuse, do not recreate). */
  existing?: boolean;
  fullName?: string;
  birthYear?: HistYear;
  deathYear?: HistYear;
  /** Birth/death known only approximately (renders "c."). */
  bornApprox?: boolean;
  diedApprox?: boolean;
  /** Still living — omit deathYear. */
  living?: boolean;
  nationality?: string;
  /** Primary era/tradition (`astronomy_era:<slug>`). */
  eraSlug?: string;
  fields?: string[];
  /** Free-text institution names (used in prose; not all are graph entities). */
  institutions?: string[];
  /** Short, source-backed contribution bullets shown on the page. */
  contributions?: string[];
  bio: string;
  /* graph links */
  /** Existing entity ids (observatory:/telescope:/organization:) → worked_at. */
  workedAt?: string[];
  /** Awards received → received_award (year carried as the relation note). */
  awards?: { slug: string; year?: HistYear }[];
  /** Astronomer slugs → student_of. */
  studentOf?: string[];
  /** Astronomer slugs → collaborated_with. */
  collaborators?: string[];
  /** Astronomer slugs → influenced. */
  influenced?: string[];
  /** Existing object entity ids (planet:/moon:/galaxy:/…) → observed. */
  observed?: string[];
  sources: SourceKey[];
}

export interface DiscoveryRecord {
  slug: string;
  name: string;
  year?: HistYear;
  yearApprox?: boolean;
  /** Astronomer slugs credited with the discovery → discovered. */
  by?: string[];
  /** Astronomer slugs who predicted it → predicted. */
  predictedBy?: string[];
  /** Astronomer slugs who first observed it → first_observed. */
  firstObservedBy?: string[];
  eraSlug?: string;
  /** Existing object entity ids the discovery concerns → related_to. */
  relatedEntityIds?: string[];
  /** Existing facility ids (observatory:/telescope:/space_telescope:/space_mission:) where it was made. */
  facilityIds?: string[];
  /** Theory slug this discovery confirmed → confirmed. */
  confirmsTheory?: string;
  /** Theory slug this discovery refuted → refuted. */
  refutesTheory?: string;
  description: string;
  significance?: string;
  sources: SourceKey[];
}

export interface PublicationRecord {
  slug: string;
  name: string;
  year?: HistYear;
  yearApprox?: boolean;
  /** Author astronomer slugs → published. */
  authors?: string[];
  /** Original language / note (prose only). */
  language?: string;
  eraSlug?: string;
  /** Theory slugs the work introduced → introduced. */
  introducesTheories?: string[];
  /** Discovery slugs the work first reported → introduced. */
  introducesDiscoveries?: string[];
  description: string;
  sources: SourceKey[];
}

export interface TheoryRecord {
  slug: string;
  name: string;
  year?: HistYear;
  yearApprox?: boolean;
  /** Astronomer slugs who developed it → developed. */
  by?: string[];
  /** Attribution shown in prose when the originator is not a graph astronomer. */
  attributedTo?: string;
  status?: "established" | "superseded" | "developing";
  eraSlug?: string;
  description: string;
  sources: SourceKey[];
}

export interface CatalogueRecord {
  slug: string;
  name: string;
  /** True when the catalogue already exists in the graph (e.g. catalog:messier). Entity id is `catalog:<slug>`. */
  existing?: boolean;
  year?: HistYear;
  yearApprox?: boolean;
  /** Astronomer slugs who compiled it → introduced. */
  by?: string[];
  /** Approximate object count (prose). */
  count?: string;
  eraSlug?: string;
  /** Existing mission/telescope id behind the catalogue (e.g. space_telescope:gaia) → related_to. */
  missionId?: string;
  description: string;
  sources: SourceKey[];
}

export interface EraRecord {
  slug: string;
  name: string;
  /** A chronological period, or a cultural/civilizational tradition. */
  kind: "period" | "tradition";
  startYear?: HistYear;
  endYear?: HistYear;
  /** Geographic/cultural region (traditions). */
  region?: string;
  description: string;
  sources: SourceKey[];
}

export interface EventRecord {
  slug: string;
  name: string;
  year?: HistYear;
  yearApprox?: boolean;
  eraSlug?: string;
  /** Existing entity ids related to the event → related_to. */
  relatedEntityIds?: string[];
  /** Astronomer slugs involved → associated_with (rendered as participants). */
  people?: string[];
  description: string;
  sources: SourceKey[];
}

export interface AwardRecord {
  slug: string;
  name: string;
  description: string;
  sources: SourceKey[];
}

/** A timeline-worthy dated record, unified for the History timeline. */
export interface DatedItem {
  year: HistYear;
  yearApprox?: boolean;
  label: string;
  kind: "discovery" | "publication" | "event" | "theory";
  slug: string;
}

/** Format an astronomical/historical year for display (BCE/CE, optional "c."). */
export function formatHistYear(y: HistYear | undefined, approx?: boolean): string | undefined {
  if (y == null) return undefined;
  const prefix = approx ? "c. " : "";
  return y < 0 ? `${prefix}${-y} BCE` : `${prefix}${y} CE`;
}

/** Format a life span (birth–death) for an astronomer. */
export function formatLifespan(r: Pick<AstronomerRecord, "birthYear" | "deathYear" | "bornApprox" | "diedApprox" | "living">): string | undefined {
  const b = formatHistYear(r.birthYear, r.bornApprox);
  if (r.birthYear == null && r.deathYear == null) return undefined;
  const d = r.living ? "present" : formatHistYear(r.deathYear, r.diedApprox);
  if (b && d) return `${b} – ${d}`;
  return b ?? d;
}
