import type { SourceKey } from "@/lib/sources";
import { CITATION_RECORDS } from "@/lib/citations/records";

/**
 * Scientific citation infrastructure.
 *
 * The model for attaching authoritative references to graph entities, datasets,
 * and provenance records. Every citation is REAL and verifiable — a source-backed
 * reference with a canonical URL, and a DOI only where the DOI is known and
 * verified. No fabricated fields; missing metadata is omitted, never invented.
 * Program O expands this registry across the platform's flagship knowledge areas.
 */

/** The kind of thing a citation points at. */
export type CitationType =
  | "institutional_page"
  | "dataset"
  | "mission_page"
  | "archive_page"
  | "peer_reviewed_paper"
  | "catalogue"
  | "technical_report"
  | "press_release"
  | "historical_reference"
  | "image_archive"
  | "standards_reference";

export const CITATION_TYPES: CitationType[] = [
  "institutional_page",
  "dataset",
  "mission_page",
  "archive_page",
  "peer_reviewed_paper",
  "catalogue",
  "technical_report",
  "press_release",
  "historical_reference",
  "image_archive",
  "standards_reference",
];

export const CITATION_TYPE_LABELS: Record<CitationType, string> = {
  institutional_page: "Institutional page",
  dataset: "Dataset",
  mission_page: "Mission page",
  archive_page: "Archive page",
  peer_reviewed_paper: "Peer-reviewed paper",
  catalogue: "Catalogue",
  technical_report: "Technical report",
  press_release: "Press release",
  historical_reference: "Historical reference",
  image_archive: "Image archive",
  standards_reference: "Standards reference",
};

export interface Citation {
  id: string;
  title: string;
  authors?: string[];
  /** Publishing organization or database. */
  organization: string;
  /** Journal/proceedings/dataset name, if applicable. */
  publication?: string;
  url: string;
  /** ISO date or year. */
  date?: string;
  /** Digital Object Identifier (syntactically validated; never invented). */
  doi?: string;
  license?: string;
  notes?: string;
  /** The kind of reference this is. */
  type: CitationType;
  /** Link to the source-registry key this citation comes from. */
  source?: SourceKey;
  /** Knowledge-graph entity ids this citation supports. */
  entityIds?: string[];
  /** Dataset slugs this citation supports. */
  datasetIds?: string[];
  /** Provenance record ids this citation backs. */
  provenanceIds?: string[];
}

/** A syntactically-valid DOI: "10." registrant "/" suffix. */
export const DOI_RE = /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/;

/** Authoritative reference sources the citation system is designed around. */
export const CITATION_SOURCE_KEYS: SourceKey[] = [
  "nasa", "esa", "iau", "noirlab", "eso", "simbad", "ned", "mpc", "jpl",
];

/** The real citation registry (Program N + Program O). */
export const CITATIONS: Citation[] = CITATION_RECORDS;

const BY_ID = new Map(CITATIONS.map((c) => [c.id, c]));
export function getCitation(id: string): Citation | undefined {
  return BY_ID.get(id);
}

/** Citations that support a given entity (via entityIds). */
export function citationsForEntity(entityId: string): Citation[] {
  return CITATIONS.filter((c) => c.entityIds?.includes(entityId));
}
/** Citations that support a given dataset (via datasetIds). */
export function citationsForDataset(datasetId: string): Citation[] {
  return CITATIONS.filter((c) => c.datasetIds?.includes(datasetId));
}
/** Citations that back a given provenance record. */
export function citationsForProvenance(provenanceId: string): Citation[] {
  return CITATIONS.filter((c) => c.provenanceIds?.includes(provenanceId));
}

/** Validate citation records (structure, types, DOIs, and orphan links). */
export function validateCitations(citations: Citation[] = CITATIONS): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const c of citations) {
    if (seen.has(c.id)) issues.push(`duplicate citation id: ${c.id}`);
    seen.add(c.id);
    if (!c.title?.trim()) issues.push(`${c.id}: missing title`);
    if (!c.organization?.trim()) issues.push(`${c.id}: missing organization`);
    if (!c.url?.trim()) issues.push(`${c.id}: missing url`);
    if (!CITATION_TYPES.includes(c.type)) issues.push(`${c.id}: invalid citation type "${c.type}"`);
    // A DOI, if present, must be syntactically valid (never invented).
    if (c.doi !== undefined && !DOI_RE.test(c.doi)) issues.push(`${c.id}: invalid DOI syntax "${c.doi}"`);
    // A doi.org URL must match the record's DOI (no mismatched identifiers).
    if (c.doi && c.url.includes("doi.org/") && !c.url.endsWith(c.doi)) {
      issues.push(`${c.id}: doi.org URL does not match the record's DOI`);
    }
    // A peer-reviewed paper must have a DOI or a non-doi canonical URL, and authors.
    if (c.type === "peer_reviewed_paper" && !(c.authors?.length)) {
      issues.push(`${c.id}: peer-reviewed paper is missing authors`);
    }
    // No orphan citations: every citation must connect to a source, entity,
    // dataset, or provenance record.
    const linked = Boolean(c.source) || (c.entityIds?.length ?? 0) > 0 || (c.datasetIds?.length ?? 0) > 0 || (c.provenanceIds?.length ?? 0) > 0;
    if (!linked) issues.push(`${c.id}: orphan citation (links no source, entity, dataset, or provenance)`);
  }
  return issues;
}

export const CITATION_STATS = {
  total: CITATIONS.length,
  withDoi: CITATIONS.filter((c) => c.doi).length,
  peerReviewed: CITATIONS.filter((c) => c.type === "peer_reviewed_paper").length,
  entitiesWithCitations: new Set(CITATIONS.flatMap((c) => c.entityIds ?? [])).size,
  datasetsWithCitations: new Set(CITATIONS.flatMap((c) => c.datasetIds ?? [])).size,
  byType: Object.fromEntries(CITATION_TYPES.map((t) => [t, CITATIONS.filter((c) => c.type === t).length])) as Record<CitationType, number>,
} as const;

/* -------------------------------------------------------- citation engine */

/**
 * Reusable citation engine. Generates standard reference formats from a
 * structured Citation — it NEVER fabricates fields. If authors or a date are
 * absent, the output simply omits them (or uses the organization / "n.d.").
 */
export type CitationStyle = "apa" | "chicago" | "mla" | "harvard" | "bibtex" | "ris";

export const CITATION_STYLES: { id: CitationStyle; name: string }[] = [
  { id: "apa", name: "APA" },
  { id: "chicago", name: "Chicago" },
  { id: "mla", name: "MLA" },
  { id: "harvard", name: "Harvard" },
  { id: "bibtex", name: "BibTeX" },
  { id: "ris", name: "RIS" },
];

function year(c: Citation): string {
  const m = c.date?.match(/\d{4}/);
  return m ? m[0] : "n.d.";
}

/** Join author strings with style-appropriate separators (or fall back to org). */
function authorList(c: Citation, style: CitationStyle): string {
  const a = c.authors?.filter(Boolean) ?? [];
  if (a.length === 0) return c.organization;
  if (style === "mla") {
    return a.length === 1 ? a[0] : `${a[0]}, et al`;
  }
  if (a.length === 1) return a[0];
  if (a.length === 2) return `${a[0]} & ${a[1]}`;
  return `${a.slice(0, -1).join(", ")}, & ${a[a.length - 1]}`;
}

/** Format a citation in a given style. Output is plain text. */
export function formatCitation(c: Citation, style: CitationStyle): string {
  const y = year(c);
  const pub = c.publication ? `${c.publication}. ` : "";
  switch (style) {
    case "apa":
      return `${authorList(c, "apa")} (${y}). ${c.title}. ${pub}${c.organization}. ${c.url}`;
    case "chicago":
      return `${authorList(c, "chicago")}. "${c.title}." ${pub}${c.organization}, ${y}. ${c.url}.`;
    case "mla":
      return `${authorList(c, "mla")}. "${c.title}." ${pub}${c.organization}, ${y}, ${c.url}.`;
    case "harvard":
      return `${authorList(c, "harvard")} (${y}) '${c.title}'. ${pub}${c.organization}. Available at: ${c.url}.`;
    case "bibtex": {
      const fields = [
        `  title        = {${c.title}}`,
        c.authors?.length ? `  author       = {${c.authors.join(" and ")}}` : null,
        `  organization = {${c.organization}}`,
        c.publication ? `  howpublished = {${c.publication}}` : null,
        `  year         = {${y}}`,
        c.doi ? `  doi          = {${c.doi}}` : null,
        `  url          = {${c.url}}`,
        c.notes ? `  note         = {${c.notes}}` : null,
      ].filter(Boolean);
      return `@misc{${c.id},\n${fields.join(",\n")}\n}`;
    }
    case "ris": {
      const lines = [
        "TY  - GEN",
        `TI  - ${c.title}`,
        ...(c.authors ?? []).map((a) => `AU  - ${a}`),
        `PB  - ${c.organization}`,
        c.publication ? `JO  - ${c.publication}` : null,
        c.date ? `PY  - ${y}` : null,
        c.doi ? `DO  - ${c.doi}` : null,
        `UR  - ${c.url}`,
        "ER  - ",
      ].filter(Boolean);
      return lines.join("\n");
    }
  }
}

/** Format a citation in every supported style. */
export function formatCitationAll(c: Citation): { style: CitationStyle; name: string; text: string }[] {
  return CITATION_STYLES.map((s) => ({ style: s.id, name: s.name, text: formatCitation(c, s.id) }));
}
