import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Observatories & telescopes data model.
 *
 * Records are hand-curated from authoritative public sources (NASA, ESA, ESO,
 * NOIRLab, NSF, NRAO, NAOJ, STScI, Caltech/IPAC, observatory pages). Every
 * factual field — aperture, altitude, first light, operator, instruments,
 * wavelength coverage — is optional and omitted when not reliably sourced.
 * Nothing is invented. Cross-references use catalogue slugs, resolved to graph
 * ids (and deduplicated against existing entities) in the index.
 */

export type ObsKind =
  | "observatory"
  | "telescope"
  | "space-telescope"
  | "instrument"
  | "survey"
  | "band"
  | "site"
  | "organization";

export const KIND_ENTITY_TYPE: Record<ObsKind, EntityType> = {
  observatory: "observatory",
  telescope: "telescope",
  "space-telescope": "space_telescope",
  instrument: "scientific_instrument",
  survey: "sky_survey",
  band: "wavelength_band",
  site: "observing_site",
  organization: "organization",
};

export const KIND_LABEL: Record<ObsKind, string> = {
  observatory: "Observatory",
  telescope: "Telescope",
  "space-telescope": "Space telescope",
  instrument: "Instrument",
  survey: "Sky survey",
  band: "Observing band",
  site: "Observing site",
  organization: "Organization",
};

export const KIND_PLURAL: Record<ObsKind, string> = {
  observatory: "Observatories",
  telescope: "Telescopes",
  "space-telescope": "Space telescopes",
  instrument: "Instruments",
  survey: "Sky surveys",
  band: "Observing bands",
  site: "Observing sites",
  organization: "Organizations",
};

export interface ObsRecord {
  /** Graph entity id, "<type>:<slug>" (existing reused, else created). */
  id: string;
  slug: string;
  name: string;
  kind: ObsKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  /** True when this id already exists in the graph (enrich, don't create). */
  existing?: boolean;

  /* --- cross-references by catalogue slug (resolved in the index) --- */
  operatorSlug?: string;
  partnerOperatorSlugs?: string[];
  builtBySlug?: string;
  siteSlug?: string;
  observatorySlug?: string;
  hostSlug?: string;
  bandSlugs?: string[];
  instrumentSlugs?: string[];
  telescopeSlugs?: string[];
  surveySlugs?: string[];
  conductedBySlug?: string;
  predecessorSlug?: string;
  /** Graph entity ids of objects observed/related that already exist. */
  relatedKeys?: string[];

  /* --- structured display fields (all optional, never invented) --- */
  status?: string;
  observatoryType?: string;
  location?: string;
  country?: string;
  coordinates?: string;
  altitudeM?: number;
  firstLight?: string;
  operationalPeriod?: string;
  apertureM?: number;
  mirrorSize?: string;
  telescopeClass?: string;
  wavelength?: string;
  orbit?: string;
  objectives?: string[];
  discoveries?: string[];
  highlights?: string[];
}
