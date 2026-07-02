import type { SourceKey } from "@/lib/sources";

/**
 * Scientific Image Platform — data model (Program K).
 *
 * A photograph here is scientific evidence, not decoration, so every image is
 * defined by its PROVENANCE. Asteria Star is an image-provenance catalogue: it
 * records verified metadata and links to each image's official source archive.
 * It does NOT re-host or hotlink image binaries it has not verified, and it
 * never fabricates a photograph, credit, license, capture date, object name, or
 * source URL. Fields that are not known with confidence are omitted — never
 * invented. Every image links to at least one real Knowledge Graph entity.
 */

export type ImageType = "observation" | "processed" | "composite" | "historic-plate" | "mission" | "diagram";
export type ProcessingLevel = "raw" | "calibrated" | "processed" | "composite";
/** Institutional/scientific imagery is kept clearly separate from astrophotography. */
export type ImageCategory = "institutional" | "astrophotography";

/** An openly-licensed or public-domain license (image_license entity). */
export interface LicenseDef {
  slug: string;
  name: string;
  shortName: string;
  url: string;
  requiresAttribution: boolean;
  /** Whether it is a genuinely open/public-domain license (the only kind allowed). */
  open: true;
  note: string;
}

/** A source archive the platform catalogues from (image_source entity). */
export interface SourceDef {
  slug: string;
  name: string;
  institution: string;
  /** The source-registry key backing this archive. */
  sourceKey: SourceKey;
  /** Stable, verifiable archive homepage (never a fabricated deep link). */
  archiveUrl: string;
  defaultLicenseSlug: string;
  note: string;
}

/** A curated collection of images (image_collection entity). */
export interface CollectionDef {
  slug: string;
  name: string;
  description: string;
}

/** A scientific image with verified provenance (scientific_image entity). */
export interface ImageRecord {
  slug: string;
  title: string;
  category: ImageCategory;
  /** Name of the depicted object/subject (free text; always present). */
  objectName: string;
  /** Depicted Knowledge Graph entity, where one exists → depicts. */
  objectEntityId?: string;
  /** Mission / space telescope that captured it → captured_by. */
  missionId?: string;
  telescopeId?: string;
  /** Ground observatory → taken_at. */
  observatoryId?: string;
  /** Any other capturing facility id (e.g. an observational_program like the EHT) → captured_by. */
  facilityId?: string;
  /** Additional related graph entity ids → related_to (e.g. the host galaxy of a black hole). */
  relatedEntityIds?: string[];
  /** Instrument name (free text; usually no entity), e.g. "NIRCam". */
  instrument?: string;
  captureDate?: string;      // omitted unless confidently known
  publicationYear?: number;
  imageType: ImageType;
  processingLevel?: ProcessingLevel;
  wavelengthBand?: string;
  resolution?: string;
  orientation?: string;
  coordinates?: string;
  exposure?: string;
  author?: string;
  /** Publishing institution (always present). */
  institution: string;
  copyright?: string;
  /** License slug (image_license) → licensed_by. Always present. */
  licenseSlug: string;
  /** Source archive slug (image_source). Always present. */
  sourceSlug: string;
  doi?: string;
  /** The exact credit line as published. Always present — never missing. */
  credit: string;
  /** Accessible alternative text. Always present — never missing. */
  altText: string;
  caption: string;
  scientificDescription: string;
  /** Related discovery entity → related_discovery. */
  relatedDiscoveryId?: string;
  relatedPublication?: string;
  /** Collection slugs → part_of_collection. */
  collections: string[];
  provenanceNote: string;
  /** ISO date this provenance record was last verified (fixed; never "now"). */
  lastVerified: string;
}

/** Deterministic catalogue-dedup key (NOT a pixel hash — no binaries are held). */
export function dedupeKey(r: Pick<ImageRecord, "objectName" | "sourceSlug" | "title" | "publicationYear">): string {
  return [r.objectName, r.sourceSlug, r.title, r.publicationYear ?? ""]
    .join("|").toLowerCase().replace(/[^a-z0-9|]+/g, "-");
}
