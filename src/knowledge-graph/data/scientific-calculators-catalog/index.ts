import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/scientific-calculators-catalog/legacy-relations";
import type { CalculatorRecord, CalcCategory } from "@/knowledge-graph/data/scientific-calculators-catalog/types";
import { orbital } from "@/knowledge-graph/data/scientific-calculators-catalog/data/orbital";
import { stellar } from "@/knowledge-graph/data/scientific-calculators-catalog/data/stellar";
import { observational } from "@/knowledge-graph/data/scientific-calculators-catalog/data/observational";
import { exoplanet } from "@/knowledge-graph/data/scientific-calculators-catalog/data/exoplanet";
import { cosmology } from "@/knowledge-graph/data/scientific-calculators-catalog/data/cosmology";
import { instrument } from "@/knowledge-graph/data/scientific-calculators-catalog/data/instrument";

/**
 * Scientific Calculators catalog (Program BP). It CREATES the calculator entities — each a first-class
 * knowledge-graph node carrying a published formula and a pure compute function — and links each to
 * the REUSED physics concepts (gravitation, Kepler, Roche/Hill, the HR diagram, parallax, redshift,
 * the transit method, the habitable zone). Nothing is fabricated: results are derived from measured
 * constants and inputs, and the validator recomputes every worked example to check the formula
 * against a known textbook value.
 */

export const BP_RECORDS: CalculatorRecord[] = [...orbital, ...stellar, ...observational, ...exoplanet, ...cosmology, ...instrument];
export const BP_BY_ID = new Map(BP_RECORDS.map((r) => [r.id, r]));
export const BP_BY_SLUG = new Map(BP_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<CalculatorRecord, "slug">): string {
  return `/calculators/${r.slug}`;
}

export const entities: GraphEntity[] = BP_RECORDS.filter((r) => !r.existing).map((r) => ({
  id: r.id,
  type: "scientific_calculator" as EntityType,
  name: r.name,
  domain: "science" as const,
  entryPath: entryPathFor(r),
  description: r.description,
  aliases: r.altNames,
  sources: r.sources,
}));

const derived: GraphRelation[] = [];
const seenRel = new Set<string>();
function add(from: string | undefined, type: RelationType, to: string | undefined) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (LEGACY_RELATION_IDS.has(id) || seenRel.has(id)) return;
  seenRel.add(id);
  derived.push(rel(from, type, to, "confirmed", "science"));
}

for (const r of BP_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const CATEGORIES: CalcCategory[] = ["orbital", "stellar", "observational", "exoplanet", "cosmology", "instrument"];

export const BP_STATS = {
  records: BP_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byCategory: Object.fromEntries(CATEGORIES.map((c) => [c, BP_RECORDS.filter((r) => r.category === c).length])) as Record<CalcCategory, number>,
} as const;

export function validateScientificCalculators(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const cats = new Set(CATEGORIES);
  for (const r of BP_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate calculator id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate calculator slug: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (r.id !== `scientific_calculator:${r.slug}`) issues.push(`${r.id}: id does not match slug ${r.slug}`);
    if (!cats.has(r.category)) issues.push(`${r.id}: unknown category ${r.category}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    if (!r.formula) issues.push(`${r.id}: missing formula`);
    if (!r.variables?.length) issues.push(`${r.id}: no variables`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
    // Validate the formula: recompute the worked example from the variable defaults and check it
    // against the known textbook value. This validates the equation, not merely asserts it.
    const inputs: Record<string, number> = {};
    for (const v of r.variables) inputs[v.symbol] = v.default;
    let result: number;
    try {
      result = r.compute(inputs);
    } catch (e) {
      issues.push(`${r.id}: compute threw ${(e as Error).message}`);
      continue;
    }
    if (!Number.isFinite(result)) issues.push(`${r.id}: compute returned non-finite ${result}`);
    else if (Math.abs(result - r.example.expected) > r.example.tol) {
      issues.push(`${r.id}: formula check failed — computed ${result.toPrecision(6)} but expected ${r.example.expected} ± ${r.example.tol}`);
    }
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { CalculatorRecord, CalcCategory, CalcVariable } from "@/knowledge-graph/data/scientific-calculators-catalog/types";
export { CATEGORY_LABEL } from "@/knowledge-graph/data/scientific-calculators-catalog/types";
export { orbital, stellar, observational, exoplanet, cosmology, instrument };
