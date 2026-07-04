import {
  GEO_RECORDS,
  GEO_BY_SLUG,
  featureTypes,
  features,
  type GeoCategory,
  type GeoRecord,
} from "@/knowledge-graph/data/planetary-geology-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Planetary Geology Engine — resolver and query surface for the Planetary Geology & Surface
 * Features Encyclopedia (engine.planetaryGeology). Pure, deterministic, framework-free. It
 * resolves the feature-type and new-feature entities and REUSES the bodies and the existing
 * surface features via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: GeoRecord, b: GeoRecord) => a.name.localeCompare(b.name, "en", { numeric: true });

export interface ResolvedGeo {
  record: GeoRecord;
  featureType?: Ref;
  body?: Ref;
  related: Ref[];
  members: GeoRecord[]; // for a type: the new features of it
  reusedMembers: Ref[]; // for a type: the existing features linked to it
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: GeoRecord): ResolvedGeo {
  const entity = getEntityById(r.id);
  const conns = getConnectionsByDomain(r.id);
  const newSlugs = new Set(features.map((x) => x.slug));
  const reusedMembers = r.kind === "type"
    ? conns.science.filter((c) => !c.outgoing && c.relation.type === "member_of_group" && !newSlugs.has(c.other.id.split(":")[1]))
        .map((c) => ({ id: c.other.id, name: c.other.name, href: entityGraphPath(c.other) }))
    : [];
  return {
    record: r,
    featureType: r.kind === "feature" ? refFromId(`geological_feature_type:${r.typeSlug}`) : undefined,
    body: refFromId(r.bodyKey),
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    members: r.kind === "type" ? features.filter((x) => x.typeSlug === r.slug).sort(byName) : [],
    reusedMembers,
    connections: conns,
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const planetaryGeologyEngine = {
  count: GEO_RECORDS.length,
  featureCount: features.length,
  all: (): GeoRecord[] => GEO_RECORDS.slice(),
  get: (slug: string): GeoRecord | undefined => GEO_BY_SLUG.get(slug),
  featureTypes: (): GeoRecord[] => featureTypes.slice(),
  features: (): GeoRecord[] => features.slice().sort(byName),
  byType: (typeSlug: string): GeoRecord[] => features.filter((x) => x.typeSlug === typeSlug).sort(byName),
  byBody: (bodyKey: string): GeoRecord[] => features.filter((x) => x.bodyKey === bodyKey).sort(byName),
  byCategory: (c: GeoCategory): GeoRecord[] => GEO_RECORDS.filter((r) => r.category === c).sort(byName),
  resolveEntry: (slug: string): ResolvedGeo | null => {
    const r = GEO_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
