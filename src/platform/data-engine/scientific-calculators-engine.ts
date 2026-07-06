import {
  BP_RECORDS,
  BP_BY_SLUG,
  type CalculatorRecord,
  type CalcCategory,
} from "@/knowledge-graph/data/scientific-calculators-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Scientific Calculators Engine — resolver, query, and evaluation surface for the Scientific
 * Calculators Encyclopedia (engine.scientificCalculators). Pure, deterministic, framework-free. It
 * resolves the calculator entities, REUSES the physics concepts they rest on via the graph, and
 * evaluates each calculator's published formula from real constants and the user's inputs. It
 * computes; it does not fabricate.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: CalculatorRecord, b: CalculatorRecord) => a.name.localeCompare(b.name);

export interface ResolvedCalculator {
  record: CalculatorRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
  /** The worked example value, recomputed from the variable defaults. */
  exampleResult: number;
}

function evaluate(r: CalculatorRecord, inputs: Record<string, number>): number {
  return r.compute(inputs);
}
function defaultsOf(r: CalculatorRecord): Record<string, number> {
  const o: Record<string, number> = {};
  for (const v of r.variables) o[v.symbol] = v.default;
  return o;
}

function resolveRecord(r: CalculatorRecord): ResolvedCalculator {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BP_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
    exampleResult: evaluate(r, defaultsOf(r)),
  };
}

export const scientificCalculatorsEngine = {
  count: BP_RECORDS.length,
  all: (): CalculatorRecord[] => BP_RECORDS.slice().sort(byName),
  get: (slug: string): CalculatorRecord | undefined => BP_BY_SLUG.get(slug),
  byCategory: (c: CalcCategory): CalculatorRecord[] => BP_RECORDS.filter((r) => r.category === c).sort(byName),
  categories: (): CalcCategory[] => ["orbital", "stellar", "observational", "exoplanet", "cosmology", "instrument"],
  /** Evaluate a calculator by slug from a set of inputs (keyed by variable symbol). Returns null for
   *  an unknown slug or non-finite result; never throws to the caller. */
  compute: (slug: string, inputs: Record<string, number>): number | null => {
    const r = BP_BY_SLUG.get(slug);
    if (!r) return null;
    try {
      const out = r.compute(inputs);
      return Number.isFinite(out) ? out : null;
    } catch {
      return null;
    }
  },
  resolveEntry: (slug: string): ResolvedCalculator | null => {
    const r = BP_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
