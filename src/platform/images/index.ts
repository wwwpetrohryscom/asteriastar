/**
 * Scientific Image Platform — assembly and public surface.
 *
 * The image DATA and its graph-entity derivation live in the knowledge layer
 * (`@/knowledge-graph/data/image-catalog`) so images are first-class graph
 * entities without a layer violation. This platform layer adds the engine-side
 * logic — providers, metadata, provenance, collections, deduplication, search,
 * and recommendations — and is exposed through the Scientific Data Engine as
 * engine.images. Framework-independent, pure, typed. It never fabricates image
 * data and holds no image binaries — only verified provenance and links to
 * official source archives.
 */
export {
  IMAGES, LICENSES, IMAGE_SOURCES, COLLECTIONS, ACTIVE_COLLECTIONS,
  IMAGE_BY_SLUG, LICENSE_BY_SLUG, SOURCE_BY_SLUG, COLLECTION_BY_SLUG,
  IMAGES_BY_COLLECTION, IMAGE_STATS, validateImages, dedupeKey,
  imageId, collectionId, licenseId, sourceId, capturedById, imageLinks,
} from "@/knowledge-graph/data/image-catalog";
export type { ImageRecord, LicenseDef, SourceDef, CollectionDef, ImageType, ImageCategory } from "@/knowledge-graph/data/image-catalog/types";

export { IMAGE_PROVIDERS, getImageProvider } from "@/platform/images/providers";
export type { ImageProviderInfo, ImageProviderKey } from "@/platform/images/providers";
export { imageMetadataRows, unrecordedFields } from "@/platform/images/metadata";
export { imageProvenance, type Provenance } from "@/platform/images/provenance";
export { imageCollections } from "@/platform/images/collections";
export { findDuplicateGroups, hasDuplicates } from "@/platform/images/deduplication";
export { imageSearch } from "@/platform/images/search";
export { relatedImages } from "@/platform/images/recommendations";
