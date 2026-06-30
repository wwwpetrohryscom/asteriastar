import type { SourceKey } from "@/lib/sources";

/**
 * Scientific citation infrastructure.
 *
 * The model for attaching peer-reviewed and authoritative references to graph
 * entities. The registry ships EMPTY — no fabricated references. Real citations
 * (with verified authors/urls/dates) are added here over time; until then,
 * entities cite the authoritative source organizations in src/lib/sources.ts.
 */

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
  license?: string;
  notes?: string;
  /** Optional link to the source-registry key this citation comes from. */
  source?: SourceKey;
}

/** Authoritative reference sources the citation system is designed around. */
export const CITATION_SOURCE_KEYS: SourceKey[] = [
  "nasa",
  "esa",
  "iau",
  "noirlab",
  "eso",
  "simbad",
  "ned",
  "mpc",
  "jpl",
];

/** No fabricated references exist in this phase. */
export const CITATIONS: Citation[] = [];

/** Validate citation records (structure only; runs in npm run validate). */
export function validateCitations(citations: Citation[] = CITATIONS): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const c of citations) {
    if (seen.has(c.id)) issues.push(`duplicate citation id: ${c.id}`);
    seen.add(c.id);
    if (!c.title?.trim()) issues.push(`${c.id}: missing title`);
    if (!c.organization?.trim()) issues.push(`${c.id}: missing organization`);
    if (!c.url?.trim()) issues.push(`${c.id}: missing url`);
  }
  return issues;
}

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
    // No trailing period — every format template appends its own.
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
