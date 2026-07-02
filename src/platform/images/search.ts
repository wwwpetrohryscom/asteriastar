import { IMAGES, IMAGE_BY_SLUG, IMAGES_BY_COLLECTION } from "@/knowledge-graph/data/image-catalog";
import type { ImageRecord, ImageType } from "@/knowledge-graph/data/image-catalog/types";

/** Search and filtering over the image catalogue. Pure and deterministic. */
const byNewest = (a: ImageRecord, b: ImageRecord) => (b.publicationYear ?? 0) - (a.publicationYear ?? 0);

export const imageSearch = {
  get: (slug: string): ImageRecord | undefined => IMAGE_BY_SLUG.get(slug),
  all: (): ImageRecord[] => IMAGES.slice(),
  latest: (limit = 24): ImageRecord[] => IMAGES.slice().sort(byNewest).slice(0, limit),
  byCollection: (slug: string): ImageRecord[] => (IMAGES_BY_COLLECTION.get(slug) ?? []).slice(),
  byObject: (entityId: string): ImageRecord[] => IMAGES.filter((i) => i.objectEntityId === entityId),
  byTelescope: (telescopeId: string): ImageRecord[] => IMAGES.filter((i) => i.telescopeId === telescopeId),
  byMission: (missionId: string): ImageRecord[] => IMAGES.filter((i) => i.missionId === missionId),
  byObservatory: (observatoryId: string): ImageRecord[] => IMAGES.filter((i) => i.observatoryId === observatoryId),
  byLicense: (licenseSlug: string): ImageRecord[] => IMAGES.filter((i) => i.licenseSlug === licenseSlug),
  bySource: (sourceSlug: string): ImageRecord[] => IMAGES.filter((i) => i.sourceSlug === sourceSlug),
  byType: (type: ImageType): ImageRecord[] => IMAGES.filter((i) => i.imageType === type),
  /** Any image whose captured_by / taken_at facility is this entity id. */
  byFacility: (entityId: string): ImageRecord[] =>
    IMAGES.filter((i) => i.telescopeId === entityId || i.missionId === entityId || i.observatoryId === entityId || i.facilityId === entityId),
  /** Simple text query over title and object name. */
  query: (q: string): ImageRecord[] => {
    const n = q.trim().toLowerCase();
    if (!n) return [];
    return IMAGES.filter((i) => i.title.toLowerCase().includes(n) || i.objectName.toLowerCase().includes(n));
  },
};
