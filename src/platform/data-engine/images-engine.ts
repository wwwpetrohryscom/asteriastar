import { getEntityById } from "@/knowledge-graph";
import {
  imageSearch, imageCollections, imageProvenance, imageMetadataRows, unrecordedFields,
  relatedImages, IMAGE_PROVIDERS, getImageProvider, IMAGE_STATS, capturedById,
  type ImageRecord, type Provenance,
} from "@/platform/images";
import type { MetaRow } from "@/platform/images/metadata";
import type { ImageProviderInfo } from "@/platform/images/providers";

/**
 * Images Engine — the Scientific Data Engine's window onto the Scientific Image
 * Platform (engine.images). Pure, typed, framework-independent. Resolves the
 * graph entity ids that image records reference into renderable refs, and
 * exposes the provenance-first surface. Never fabricates image data.
 */
export type Ref = { id: string; name: string; href: string; type: string };
function entRef(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  if (!e) return undefined;
  return { id, name: e.name, href: e.entryPath ?? `/explore/entity/${id.replace(":", "/")}`, type: e.type };
}
function refs(ids: (string | undefined)[]): Ref[] {
  return ids.map(entRef).filter((r): r is Ref => Boolean(r));
}

export interface ResolvedImage {
  record: ImageRecord;
  provenance: Provenance;
  metadata: MetaRow[];
  unrecorded: string[];
  depicts?: Ref;
  capturedBy?: Ref;
  takenAt?: Ref;
  relatedDiscovery?: Ref;
  related: Ref[];         // extra related entities
  connections: Ref[];     // all linked graph entities
  relatedImages: ImageRecord[];
}

function resolve(slug: string): ResolvedImage | null {
  const record = imageSearch.get(slug);
  if (!record) return null;
  return {
    record,
    provenance: imageProvenance(record),
    metadata: imageMetadataRows(record),
    unrecorded: unrecordedFields(record),
    depicts: entRef(record.objectEntityId),
    capturedBy: entRef(capturedById(record)),
    takenAt: entRef(record.observatoryId),
    relatedDiscovery: entRef(record.relatedDiscoveryId),
    related: refs(record.relatedEntityIds ?? []),
    connections: refs([record.objectEntityId, capturedById(record), record.observatoryId, record.relatedDiscoveryId, ...(record.relatedEntityIds ?? [])]),
    relatedImages: relatedImages(slug),
  };
}

export const imagesEngine = {
  count: IMAGE_STATS.images,
  stats: IMAGE_STATS,
  resolve,
  slugs: (): string[] => imageSearch.all().map((i) => i.slug),
  all: imageSearch.all,
  latest: imageSearch.latest,
  search: imageSearch,
  collections: imageCollections,
  providers: (): ImageProviderInfo[] => IMAGE_PROVIDERS,
  getProvider: getImageProvider,
  ref: entRef,
  refs,
};
