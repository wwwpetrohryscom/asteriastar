import type { ScientificValue, ValueStatus } from "./scientific-value";
import { validateScientificValue } from "./scientific-value";
import type { SourceKey } from "@/lib/sources";
import { STAR_PRECISION } from "@/knowledge-graph/data/star-catalog/precision";
import { DEEP_SKY_PRECISION } from "@/knowledge-graph/data/deep-sky-catalog/precision";
import { SMALL_BODY_PRECISION } from "@/knowledge-graph/data/small-body-precision";
import { MISSION_PRECISION } from "@/knowledge-graph/data/mission-precision";
import { collectDerived } from "@/knowledge-graph/data/derived-values";

/**
 * Field-level provenance registry (Program 5).
 *
 * Unifies every per-field `ScientificValue` produced by the four precision domains
 * (stars · deep sky · small bodies · missions) into one queryable surface, so the
 * platform can answer "where did this value come from?" for any entity, expose it as
 * Open Data, and gate it with a single cross-domain honesty check.
 */

export type ProvenanceDomain = "star" | "deep-sky" | "small-body" | "mission" | "solar-system" | "exoplanet";

export interface ProvenanceEntry {
  entityId: string;
  domain: ProvenanceDomain;
  field: string;
  value: ScientificValue<number | string>;
}

function isScientificValue(x: unknown): x is ScientificValue<number | string> {
  return !!x && typeof x === "object" && "sourceRef" in x && "status" in x && "value" in x;
}

function collectFrom(map: Map<string, Record<string, unknown>>, domain: ProvenanceDomain, idKey: string): ProvenanceEntry[] {
  const out: ProvenanceEntry[] = [];
  for (const rec of map.values()) {
    const entityId = String(rec[idKey]);
    for (const [field, v] of Object.entries(rec))
      if (isScientificValue(v)) out.push({ entityId, domain, field, value: v });
  }
  return out;
}

/** Every field-level value across all domains, deterministically ordered. */
export function collectProvenance(): ProvenanceEntry[] {
  type AnyMap = Map<string, Record<string, unknown>>;
  const all = [
    ...collectFrom(STAR_PRECISION as unknown as AnyMap, "star", "starId"),
    ...collectFrom(DEEP_SKY_PRECISION as unknown as AnyMap, "deep-sky", "dsId"),
    ...collectFrom(SMALL_BODY_PRECISION as unknown as AnyMap, "small-body", "bodyId"),
    ...collectFrom(MISSION_PRECISION as unknown as AnyMap, "mission", "recordId"),
    // Derived values (gravity/escape/density/axis-ratio/duration) — full DerivedScientificValues.
    ...collectDerived().map((e) => ({ entityId: e.entityId, domain: e.domain, field: e.field, value: e.value as ScientificValue<number | string> })),
  ];
  all.sort((a, b) => (a.entityId + a.field < b.entityId + b.field ? -1 : 1));
  return all;
}

// Per-entity index, built once, so a lookup is O(1) rather than rebuilding the registry.
const PROVENANCE_BY_ENTITY: Map<string, ProvenanceEntry[]> = (() => {
  const m = new Map<string, ProvenanceEntry[]>();
  for (const e of collectProvenance()) (m.get(e.entityId) ?? m.set(e.entityId, []).get(e.entityId)!).push(e);
  return m;
})();

export function provenanceForEntity(entityId: string): ProvenanceEntry[] {
  return PROVENANCE_BY_ENTITY.get(entityId) ?? [];
}

/** Aggregate coverage/quality metrics for the report and the export manifest. */
export function provenanceStats() {
  const all = collectProvenance();
  const byDomain: Record<string, number> = {};
  const byStatus: Partial<Record<ValueStatus, number>> = {};
  const bySource: Partial<Record<SourceKey, number>> = {};
  const bibcodes = new Set<string>();
  let withUncertainty = 0, withEpoch = 0, entities = new Set<string>().size;
  const entitySet = new Set<string>();
  for (const e of all) {
    byDomain[e.domain] = (byDomain[e.domain] ?? 0) + 1;
    byStatus[e.value.status] = (byStatus[e.value.status] ?? 0) + 1;
    bySource[e.value.sourceRef] = (bySource[e.value.sourceRef] ?? 0) + 1;
    if (e.value.uncertainty) withUncertainty++;
    if (e.value.epoch) withEpoch++;
    if (e.value.bibcode) bibcodes.add(e.value.bibcode);
    entitySet.add(e.entityId);
  }
  entities = entitySet.size;
  return { total: all.length, entities, byDomain, byStatus, bySource, distinctBibcodes: bibcodes.size, withUncertainty, withEpoch };
}

/**
 * Cross-domain provenance gate: runs the per-value structural honesty check
 * (`validateScientificValue` already covers a known source, a well-formed bibcode/DOI,
 * a documented method for derived/calculated values, and non-negative uncertainty)
 * and adds the one registry-level invariant it does not: a bare Wikidata QID must
 * never be shown as a value. Rejects only fabrication-shaped data, never mere absence.
 */
export function validateAllProvenance(): string[] {
  const issues: string[] = [];
  for (const e of collectProvenance()) {
    const label = `${e.entityId}.${e.field}`;
    for (const m of validateScientificValue(e.value, label)) issues.push(m);
    if (typeof e.value.value === "string" && /^Q\d+$/.test(e.value.value)) issues.push(`${label}: bare Wikidata QID shown as a value`);
  }
  return issues;
}
