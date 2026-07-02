import { LICENSE_BY_SLUG, SOURCE_BY_SLUG } from "@/knowledge-graph/data/image-catalog";
import type { ImageRecord, LicenseDef, SourceDef } from "@/knowledge-graph/data/image-catalog/types";

/**
 * Provenance assembly — the strongest scientific feature. For any image it
 * gathers the original source, institution, license, credit, publication, and
 * last-verification date, so the page can display a complete, honest provenance
 * record and link to the official archive. Never fabricates a field.
 */
export interface Provenance {
  credit: string;
  institution: string;
  license?: LicenseDef;
  source?: SourceDef;
  archiveUrl?: string;
  copyright?: string;
  publication?: string;
  lastVerified: string;
  note: string;
  /** True only for genuinely open/public-domain licensing. */
  openlyLicensed: boolean;
}

export function imageProvenance(img: ImageRecord): Provenance {
  const license = LICENSE_BY_SLUG.get(img.licenseSlug);
  const source = SOURCE_BY_SLUG.get(img.sourceSlug);
  return {
    credit: img.credit,
    institution: img.institution,
    license,
    source,
    archiveUrl: source?.archiveUrl,
    copyright: img.copyright,
    publication: img.publicationYear ? String(img.publicationYear) : undefined,
    lastVerified: img.lastVerified,
    note: img.provenanceNote,
    openlyLicensed: Boolean(license?.open),
  };
}
