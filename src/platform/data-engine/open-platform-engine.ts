import {
  BX_RECORDS,
  BX_BY_SLUG,
  BX_STATS,
  capabilities,
  CATEGORY_LABEL,
  STATUS_LABEL,
  entryPathFor,
  type PlatformCapabilityRecord,
  type PlatformCategory,
  type PlatformStatus,
} from "@/knowledge-graph/data/open-platform-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById, GRAPH_VERSION_INFO } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Open Astronomy Platform Engine (engine.openPlatform) — the resolver and query surface for the open,
 * research-grade data platform's capability entities. It describes what the platform offers and its
 * honest status (available / architecture-ready / planned), and carries the graph release. It reuses the
 * existing open-data API, exports, datasets, sources, and citation engines — it duplicates none of them.
 * The real download manifest (with computed checksums) lives in src/lib/open-platform/downloads.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: PlatformCapabilityRecord, b: PlatformCapabilityRecord) => a.name.localeCompare(b.name);

export interface ResolvedCapability {
  record: PlatformCapabilityRecord;
  entryPath: string;
  related: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: PlatformCapabilityRecord): ResolvedCapability {
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

export const openPlatformEngine = {
  count: BX_RECORDS.length,
  capabilityCount: capabilities.length,
  stats: BX_STATS,
  version: GRAPH_VERSION_INFO,
  all: (): PlatformCapabilityRecord[] => BX_RECORDS.slice().sort(byName),
  get: (slug: string): PlatformCapabilityRecord | undefined => BX_BY_SLUG.get(slug),
  byCategory: (c: PlatformCategory): PlatformCapabilityRecord[] => BX_RECORDS.filter((r) => r.category === c).sort(byName),
  byStatus: (s: PlatformStatus): PlatformCapabilityRecord[] => BX_RECORDS.filter((r) => r.status === s).sort(byName),
  available: (): PlatformCapabilityRecord[] => BX_RECORDS.filter((r) => r.status === "available").sort(byName),
  categories: (): PlatformCategory[] => ["api", "graph", "datasets", "downloads", "licenses", "sdk", "federation", "standards"],
  categoryLabel: (c: PlatformCategory): string => CATEGORY_LABEL[c],
  statusLabel: (s: PlatformStatus): string => STATUS_LABEL[s],
  resolveEntry: (slug: string): ResolvedCapability | null => {
    const r = BX_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
