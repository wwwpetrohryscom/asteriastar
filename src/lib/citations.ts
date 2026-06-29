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
