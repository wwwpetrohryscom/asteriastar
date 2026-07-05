import {
  BD_RECORDS,
  BD_BY_SLUG,
  methodology,
  philosophy,
  themes,
  type HistoryRecord,
} from "@/knowledge-graph/data/discovery-history-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Discovery History Engine — resolver and query surface for the History & Philosophy of
 * Astronomical Discovery Encyclopedia (engine.discoveryHistory). Pure, deterministic,
 * framework-free. It resolves the discovery-methodology, philosophy-of-science, and history-theme
 * entities and REUSES the astronomers, eras, spectroscopy/gravitational-wave/error-analysis
 * methods, the transit method, the Hubble tension, Sagittarius A*, the radio band, and the
 * reproducibility practice via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: HistoryRecord, b: HistoryRecord) => a.name.localeCompare(b.name);

export interface ResolvedDiscoveryHistory {
  record: HistoryRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other BD entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: HistoryRecord): ResolvedDiscoveryHistory {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BD_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const discoveryHistoryEngine = {
  count: BD_RECORDS.length,
  themeCount: themes.length,
  all: (): HistoryRecord[] => BD_RECORDS.slice(),
  get: (slug: string): HistoryRecord | undefined => BD_BY_SLUG.get(slug),
  methodology: (): HistoryRecord[] => methodology.slice().sort(byName),
  philosophy: (): HistoryRecord[] => philosophy.slice().sort(byName),
  themes: (): HistoryRecord[] => themes.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedDiscoveryHistory | null => {
    const r = BD_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
