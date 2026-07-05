import {
  AX_RECORDS,
  AX_BY_SLUG,
  methods,
  applications,
  workflows,
  brokers,
  type MlRecord,
} from "@/knowledge-graph/data/astro-ml-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Astro-ML Engine — resolver and query surface for the Data Science, AI & Machine Learning in
 * Astronomy Encyclopedia (engine.astroMl). Pure, deterministic, framework-free. It resolves the
 * ML-method, application, data-engineering-workflow, and alert-broker entities and REUSES the Rubin
 * Observatory and alert stream, the alert systems, the photometry/lensing methods, the galaxy
 * morphologies, the transit method, the Type Ia supernova class, the redshift concept, and the
 * open-science practices via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: MlRecord, b: MlRecord) => a.name.localeCompare(b.name);

export interface ResolvedAstroMl {
  record: MlRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other AX entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: MlRecord): ResolvedAstroMl {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: AX_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const astroMlEngine = {
  count: AX_RECORDS.length,
  applicationCount: applications.length,
  all: (): MlRecord[] => AX_RECORDS.slice(),
  get: (slug: string): MlRecord | undefined => AX_BY_SLUG.get(slug),
  methods: (): MlRecord[] => methods.slice().sort(byName),
  applications: (): MlRecord[] => applications.slice().sort(byName),
  workflows: (): MlRecord[] => workflows.slice().sort(byName),
  brokers: (): MlRecord[] => brokers.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedAstroMl | null => {
    const r = AX_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
