import {
  PD_RECORDS,
  PD_BY_SLUG,
  stages,
  scales,
  methods,
  type DefenseRecord,
} from "@/knowledge-graph/data/planetary-defense-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Planetary Defense Engine — resolver and query surface for the Planetary Defense & NEO
 * Operations Encyclopedia (engine.planetaryDefense). Pure, deterministic, framework-free. It
 * resolves the pipeline-stage, risk-scale, and deflection-method entities and REUSES the surveys,
 * the Minor Planet Center and CNEOS, the DART and Hera missions, and the asteroids via the graph,
 * creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: DefenseRecord, b: DefenseRecord) => a.name.localeCompare(b.name);
const byOrder = (a: DefenseRecord, b: DefenseRecord) => (a.order ?? 0) - (b.order ?? 0);

export interface ResolvedDefense {
  record: DefenseRecord;
  related: Ref[]; // reused entities it uses
  nextStage?: Ref; // for a stage
  prevStage?: Ref; // for a stage
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: DefenseRecord): ResolvedDefense {
  const entity = getEntityById(r.id);
  const prev = r.kind === "stage" ? stages.find((s) => s.nextStageSlug === r.slug) : undefined;
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    nextStage: r.kind === "stage" && r.nextStageSlug ? refFromId(`defense_stage:${r.nextStageSlug}`) : undefined,
    prevStage: prev ? refFromId(prev.id) : undefined,
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const planetaryDefenseEngine = {
  count: PD_RECORDS.length,
  stageCount: stages.length,
  all: (): DefenseRecord[] => PD_RECORDS.slice(),
  get: (slug: string): DefenseRecord | undefined => PD_BY_SLUG.get(slug),
  stages: (): DefenseRecord[] => stages.slice().sort(byOrder),
  scales: (): DefenseRecord[] => scales.slice().sort(byName),
  methods: (): DefenseRecord[] => methods.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedDefense | null => {
    const r = PD_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
