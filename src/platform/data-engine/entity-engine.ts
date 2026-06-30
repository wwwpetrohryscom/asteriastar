import {
  resolveEntity,
  resolveEntityByTypeSlug,
  type RuntimeEntity,
  type ResolveOptions,
} from "@/platform/runtime";
import {
  getEntityById,
  getAllGraphEntities,
  getGraphEntitiesByType,
  getGraphEntitiesByDomain,
  type GraphEntity,
  type EntityType,
  type EntityDomain,
} from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import {
  getReviewForEntity,
  reviewStatusFor,
  type EntityReview,
  type ReviewStatus,
} from "@/platform/authority/review";
import { allowedEvidenceForDomain, type EvidenceLevel } from "@/platform/authority/evidence";
import { DEFAULT_LOCALE } from "@/platform/localization";
import { memoize } from "@/platform/data-engine/cache";

/**
 * Entity Resolver — the single way to compose an entity. Given an id, it returns
 * the full, unified view: identity, metadata, relationships, sources, evidence,
 * quality, timeline, images, datasets, learning paths, recommendations,
 * comparisons (via the comparison engine), localization, and authority.
 *
 * No component should compose entity data by hand — everything flows through
 * `engine.entity.resolve()`. This delegates to the Phase 8 runtime and the
 * Phase 9 authority layer; it does not re-implement them.
 */
export interface ResolvedEntity extends RuntimeEntity {
  quality: EntityQuality;
  review?: EntityReview;
  reviewStatus: ReviewStatus;
  /** Evidence levels permitted for this entity's domain. */
  evidenceLevels: EvidenceLevel[];
}

function compose(rt: RuntimeEntity): ResolvedEntity {
  const entity = getEntityById(rt.id) as GraphEntity;
  return {
    ...rt,
    quality: computeEntityQuality(entity),
    review: getReviewForEntity(rt.id),
    reviewStatus: reviewStatusFor(rt.id),
    evidenceLevels: allowedEvidenceForDomain(rt.domain),
  };
}

// Cache resolution by id@locale (results are deterministic, read-only by convention).
const resolveByKey = memoize<ResolvedEntity | null>((key) => {
  const [id, locale] = key.split("@");
  const rt = resolveEntity(id, { locale: locale as ResolveOptions["locale"] });
  return rt ? compose(rt) : null;
});

export const entityEngine = {
  resolve(id: string, opts: ResolveOptions = {}): ResolvedEntity | null {
    return resolveByKey(`${id}@${opts.locale ?? DEFAULT_LOCALE}`);
  },
  resolveByTypeSlug(type: string, slug: string, opts: ResolveOptions = {}): ResolvedEntity | null {
    const rt = resolveEntityByTypeSlug(type, slug, opts);
    return rt ? compose(rt) : null;
  },
  get: (id: string): GraphEntity | undefined => getEntityById(id),
  exists: (id: string): boolean => Boolean(getEntityById(id)),
  all: (): GraphEntity[] => getAllGraphEntities(),
  byType: (type: EntityType): GraphEntity[] => getGraphEntitiesByType(type),
  byDomain: (domain: EntityDomain): GraphEntity[] => getGraphEntitiesByDomain(domain),
  /** Clear the resolution cache (tests / long-lived processes). */
  clearCache: () => resolveByKey.clear(),
};
