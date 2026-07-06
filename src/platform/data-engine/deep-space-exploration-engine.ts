import {
  BI_RECORDS,
  BI_BY_SLUG,
  architecture,
  challenges,
  type DeepExplorationRecord,
} from "@/knowledge-graph/data/deep-space-exploration-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Deep-Space Exploration Engine — resolver and query surface for the Deep-Space Human Exploration &
 * Habitation Encyclopedia (engine.deepSpaceExploration). Pure, deterministic, framework-free. It
 * resolves the exploration-architecture and deep-space-challenge entities and REUSES the Artemis
 * program, the Lunar Gateway, in-situ resource utilisation, the habitats, the countermeasures, the
 * ECLSS and closed-loop life support, the construction processes, nuclear-thermal propulsion,
 * planetary protection, the Deep Space Network, and the space-medicine topics via the graph,
 * fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: DeepExplorationRecord, b: DeepExplorationRecord) => a.name.localeCompare(b.name);

export interface ResolvedDeepSpaceExploration {
  record: DeepExplorationRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other BI entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: DeepExplorationRecord): ResolvedDeepSpaceExploration {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BI_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const deepSpaceExplorationEngine = {
  count: BI_RECORDS.length,
  architectureCount: architecture.length,
  all: (): DeepExplorationRecord[] => BI_RECORDS.slice(),
  get: (slug: string): DeepExplorationRecord | undefined => BI_BY_SLUG.get(slug),
  architecture: (): DeepExplorationRecord[] => architecture.slice().sort(byName),
  challenges: (): DeepExplorationRecord[] => challenges.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedDeepSpaceExploration | null => {
    const r = BI_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
