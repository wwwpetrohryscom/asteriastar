import {
  METHOD_RECORDS,
  METHOD_BY_SLUG,
  REUSED_METHODS,
  categories,
  methods,
  type MethodRecord,
} from "@/knowledge-graph/data/astronomy-methods-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Astronomy Methods Engine — resolver and query surface for the Astronomy Methods,
 * Measurements & Scientific Techniques Encyclopedia (engine.astronomyMethods). Pure,
 * deterministic, framework-free. It resolves the method-category and technique entities and
 * REUSES the exoplanet-detection methods, cosmology concepts, bands, telescopes, and catalogues
 * via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: MethodRecord, b: MethodRecord) => a.name.localeCompare(b.name);

export interface ResolvedAstronomyMethod {
  record: MethodRecord;
  category?: Ref; // for a method: its category
  related: Ref[]; // reused entities it builds on
  members: MethodRecord[]; // for a category: its new techniques
  reusedMembers: Ref[]; // for a category: the reused detection methods in it
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: MethodRecord): ResolvedAstronomyMethod {
  const entity = getEntityById(r.id);
  const reusedMembers = r.kind === "category"
    ? REUSED_METHODS.filter((rm) => rm.categorySlug === r.slug).map((rm) => refFromId(rm.id)).filter(Boolean) as Ref[]
    : [];
  return {
    record: r,
    category: r.kind === "method" ? refFromId(`method_category:${r.categorySlug}`) : undefined,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    members: r.kind === "category" ? methods.filter((x) => x.categorySlug === r.slug).sort(byName) : [],
    reusedMembers,
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const astronomyMethodsEngine = {
  count: METHOD_RECORDS.length,
  methodCount: methods.length,
  all: (): MethodRecord[] => METHOD_RECORDS.slice(),
  get: (slug: string): MethodRecord | undefined => METHOD_BY_SLUG.get(slug),
  categories: (): MethodRecord[] => categories.slice(),
  methodsList: (): MethodRecord[] => methods.slice().sort(byName),
  byCategory: (categorySlug: string): MethodRecord[] => methods.filter((x) => x.categorySlug === categorySlug).sort(byName),
  /** The full membership of a category — new techniques plus the reused detection methods. */
  memberSet: (categorySlug: string): { records: MethodRecord[]; reused: Ref[]; count: number } => {
    const records = methods.filter((x) => x.categorySlug === categorySlug).sort(byName);
    const reused = REUSED_METHODS.filter((rm) => rm.categorySlug === categorySlug).map((rm) => refFromId(rm.id)).filter(Boolean) as Ref[];
    return { records, reused, count: records.length + reused.length };
  },
  resolveEntry: (slug: string): ResolvedAstronomyMethod | null => {
    const r = METHOD_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
