import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { IMAGE_LEGACY_RELATION_IDS } from "@/knowledge-graph/data/image-catalog/legacy-relations";
import { IMAGES } from "@/knowledge-graph/data/image-catalog/data/images";
import { LICENSES } from "@/knowledge-graph/data/image-catalog/data/licenses";
import { IMAGE_SOURCES } from "@/knowledge-graph/data/image-catalog/data/sources";
import { COLLECTIONS } from "@/knowledge-graph/data/image-catalog/data/collections";
import { dedupeKey, type ImageRecord } from "@/knowledge-graph/data/image-catalog/types";

/**
 * Scientific Image catalog (Program K).
 *
 * Curated, verifiably-sourced images drive the derivation of first-class graph
 * entities (scientific_image, image_collection, image_license, image_source) and
 * typed, provenance-bearing relations (depicts, captured_by, taken_at,
 * licensed_by, published_by, part_of_collection, related_discovery, related_to).
 * Nothing is fabricated; existing objects, missions, telescopes, observatories,
 * and discoveries are reused by id; every image links to at least one entity;
 * every relation is deduped against every edge defined earlier.
 */

export { IMAGES, LICENSES, IMAGE_SOURCES, COLLECTIONS, dedupeKey };

export const imageId = (slug: string) => `scientific_image:${slug}`;
export const collectionId = (slug: string) => `image_collection:${slug}`;
export const licenseId = (slug: string) => `image_license:${slug}`;
export const sourceId = (slug: string) => `image_source:${slug}`;

export const IMAGE_BY_SLUG = new Map(IMAGES.map((i) => [i.slug, i]));
export const LICENSE_BY_SLUG = new Map(LICENSES.map((l) => [l.slug, l]));
export const SOURCE_BY_SLUG = new Map(IMAGE_SOURCES.map((s) => [s.slug, s]));
export const COLLECTION_BY_SLUG = new Map(COLLECTIONS.map((c) => [c.slug, c]));

/** Images in each collection. */
export const IMAGES_BY_COLLECTION = new Map<string, ImageRecord[]>();
for (const img of IMAGES) for (const c of img.collections) (IMAGES_BY_COLLECTION.get(c) ?? IMAGES_BY_COLLECTION.set(c, []).get(c)!).push(img);

/** Only collections that actually contain images become entities/pages. */
export const ACTIVE_COLLECTIONS = COLLECTIONS.filter((c) => (IMAGES_BY_COLLECTION.get(c.slug)?.length ?? 0) > 0);

/** The single capturing facility for an image (instrument/telescope, else facility, else mission). */
export function capturedById(img: ImageRecord): string | undefined {
  return img.telescopeId ?? img.facilityId ?? img.missionId;
}

/** All graph entity ids an image links to (for no-orphan checks). */
export function imageLinks(img: ImageRecord): string[] {
  return [img.objectEntityId, capturedById(img), img.observatoryId, img.relatedDiscoveryId, ...(img.relatedEntityIds ?? [])]
    .filter((x): x is string => Boolean(x));
}

/* ---------------------------------------------------------------- entities */
function shorten(t: string, max = 220): string { return t.length <= max ? t : t.slice(0, t.lastIndexOf(" ", max)) + "…"; }

const imageEntities: GraphEntity[] = IMAGES.map((i) => ({
  id: imageId(i.slug), type: "scientific_image" as EntityType, name: i.title, domain: "science" as const,
  entryPath: `/images/${i.slug}`, description: shorten(i.caption),
  sources: [SOURCE_BY_SLUG.get(i.sourceSlug)?.sourceKey].filter((x): x is NonNullable<typeof x> => Boolean(x)),
}));

const collectionEntities: GraphEntity[] = ACTIVE_COLLECTIONS.map((c) => ({
  id: collectionId(c.slug), type: "image_collection" as EntityType, name: c.name, domain: "science" as const,
  entryPath: `/images/collections/${c.slug}`, description: shorten(c.description), sources: ["nasa"],
}));

const licenseEntities: GraphEntity[] = LICENSES.map((l) => ({
  id: licenseId(l.slug), type: "image_license" as EntityType, name: l.name, domain: "science" as const,
  description: shorten(l.note),
}));

const sourceEntities: GraphEntity[] = IMAGE_SOURCES.map((s) => ({
  id: sourceId(s.slug), type: "image_source" as EntityType, name: s.name, domain: "science" as const,
  description: shorten(s.note), sources: [s.sourceKey],
}));

export const entities: GraphEntity[] = [...imageEntities, ...collectionEntities, ...licenseEntities, ...sourceEntities];

/* ---------------------------------------------------------------- relations */
const derived: GraphRelation[] = [];
const seen = new Set<string>();
function add(from: string, type: RelationType, to: string) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (IMAGE_LEGACY_RELATION_IDS.has(id) || seen.has(id)) return;
  seen.add(id);
  derived.push(rel(from, type, to, "confirmed", "science", {}));
}

for (const img of IMAGES) {
  const id = imageId(img.slug);
  if (img.objectEntityId) add(id, "depicts", img.objectEntityId);
  const cap = capturedById(img);
  if (cap) add(id, "captured_by", cap);
  if (img.observatoryId) add(id, "taken_at", img.observatoryId);
  if (img.relatedDiscoveryId) add(id, "related_discovery", img.relatedDiscoveryId);
  for (const r of img.relatedEntityIds ?? []) add(id, "related_to", r);
  add(id, "licensed_by", licenseId(img.licenseSlug));
  add(id, "published_by", sourceId(img.sourceSlug));
  for (const c of img.collections) if (COLLECTION_BY_SLUG.has(c)) add(id, "part_of_collection", collectionId(c));
}

// Each supported source archive declares its default license (connects the
// architectural source/license entities even before they hold a seeded image).
for (const s of IMAGE_SOURCES) if (LICENSE_BY_SLUG.has(s.defaultLicenseSlug)) add(sourceId(s.slug), "related_to", licenseId(s.defaultLicenseSlug));

export const relations: GraphRelation[] = derived;

/* -------------------------------------------------------------------- stats */
export const IMAGE_STATS = {
  images: IMAGES.length,
  collections: ACTIVE_COLLECTIONS.length,
  licenses: LICENSES.length,
  sources: IMAGE_SOURCES.length,
  newEntities: entities.length,
  relations: relations.length,
  institutional: IMAGES.filter((i) => i.category === "institutional").length,
  astrophotography: IMAGES.filter((i) => i.category === "astrophotography").length,
} as const;

/* ---------------------------------------------------------------- validation */
const ID_RE = /^[a-z_]+:[a-z0-9-]+$/;

export function validateImages(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const seenDedupe = new Set<string>();

  for (const e of entities) {
    if (seenId.has(e.id)) issues.push(`duplicate image id: ${e.id}`);
    seenId.add(e.id);
    if (!ID_RE.test(e.id)) issues.push(`bad id: ${e.id}`);
    const slug = e.entryPath?.startsWith("/images/") ? e.entryPath.slice("/images/".length) : undefined;
    if (slug) { if (seenSlug.has(slug)) issues.push(`duplicate /images slug: ${slug}`); seenSlug.add(slug); }
  }

  for (const img of IMAGES) {
    // No missing credit / license / alt text / source (the provenance essentials).
    if (!img.credit?.trim()) issues.push(`image ${img.slug}: missing credit`);
    if (!img.altText?.trim()) issues.push(`image ${img.slug}: missing alt text`);
    if (!img.institution?.trim()) issues.push(`image ${img.slug}: missing institution`);
    if (!img.licenseSlug || !LICENSE_BY_SLUG.has(img.licenseSlug)) issues.push(`image ${img.slug}: missing/unknown license: ${img.licenseSlug}`);
    if (!img.sourceSlug || !SOURCE_BY_SLUG.has(img.sourceSlug)) issues.push(`image ${img.slug}: missing/unknown source: ${img.sourceSlug}`);
    // Only open/public-domain licenses allowed.
    const lic = LICENSE_BY_SLUG.get(img.licenseSlug);
    if (lic && !lic.open) issues.push(`image ${img.slug}: non-open license: ${img.licenseSlug}`);
    // Every image links to at least one graph entity (no orphan images).
    if (imageLinks(img).length === 0) issues.push(`orphan image (no graph links): ${img.slug}`);
    // Collections referenced must exist.
    for (const c of img.collections) if (!COLLECTION_BY_SLUG.has(c)) issues.push(`image ${img.slug}: unknown collection: ${c}`);
    // Duplicate detection.
    const key = dedupeKey(img);
    if (seenDedupe.has(key)) issues.push(`duplicate image (dedupe key clash): ${img.slug}`);
    seenDedupe.add(key);
  }

  // No isolated derived entity.
  const connected = new Set<string>();
  for (const r of relations) { connected.add(r.from); connected.add(r.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated image-catalog entity: ${e.id}`);

  return issues;
}
