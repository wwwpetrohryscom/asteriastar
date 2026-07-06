import {
  BV_RECORDS,
  BV_BY_SLUG,
  BV_STATS,
  features,
  CATEGORY_LABEL,
  entryPathFor,
  type WorkspaceFeatureRecord,
  type WorkspaceCategory,
} from "@/knowledge-graph/data/workspace-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Research Workspace Engine (engine.researchWorkspace) — the resolver and query surface for the
 * privacy-first, local-only workspace's FEATURE entities. It resolves each feature and its sibling
 * links via the graph. The workspace's actual data lives only in the browser (src/lib/workspace); this
 * engine only describes the capabilities for discovery, the graph, and the pages. It stores nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: WorkspaceFeatureRecord, b: WorkspaceFeatureRecord) => a.name.localeCompare(b.name);

export interface ResolvedWorkspaceFeature {
  record: WorkspaceFeatureRecord;
  entryPath: string;
  related: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: WorkspaceFeatureRecord): ResolvedWorkspaceFeature {
  const entity = getEntityById(r.id);
  return {
    record: r,
    entryPath: entryPathFor(r),
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const researchWorkspaceEngine = {
  count: BV_RECORDS.length,
  featureCount: features.length,
  stats: BV_STATS,
  all: (): WorkspaceFeatureRecord[] => BV_RECORDS.slice().sort(byName),
  get: (slug: string): WorkspaceFeatureRecord | undefined => BV_BY_SLUG.get(slug),
  byCategory: (c: WorkspaceCategory): WorkspaceFeatureRecord[] => BV_RECORDS.filter((r) => r.category === c).sort(byName),
  categories: (): WorkspaceCategory[] => ["saving", "organising", "notes", "citations", "exports", "privacy"],
  categoryLabel: (c: WorkspaceCategory): string => CATEGORY_LABEL[c],
  resolveEntry: (slug: string): ResolvedWorkspaceFeature | null => {
    const r = BV_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
