import { getImagesForEntity } from "@/lib/media/registry";
import { IMAGE_LICENSE_LABELS } from "@/lib/media/types";
import { MediaLightbox, type MediaItem } from "@/components/media/MediaLightbox";
import { JsonLd } from "@/components/seo/JsonLd";
import { imageObjectSchema } from "@/lib/seo/jsonld";

/**
 * Automatic imagery block for any knowledge-graph entity. Resolves the entity's
 * real, openly-licensed observation images and renders a hero + expandable
 * lightbox gallery, plus an ImageObject JSON-LD for the hero. Renders nothing
 * when the entity has no images, so it is safe to drop onto every entity page.
 */
export function EntityImagery({
  entityId,
  heading = "Imagery",
  className = "",
}: {
  entityId: string;
  heading?: string;
  className?: string;
}) {
  const assets = getImagesForEntity(entityId);
  if (assets.length === 0) return null;

  const items: MediaItem[] = assets.map((a) => ({
    url: a.url!,
    alt: a.alt,
    width: a.width ?? 1600,
    height: a.height ?? 900,
    blurDataURL: a.blurDataURL,
    title: a.title,
    caption: a.caption,
    credit: a.credit,
    licenseLabel: IMAGE_LICENSE_LABELS[a.license],
    sourceUrl: a.sourceUrl,
    originalUrl: a.originalUrl,
    object: a.object,
    provider: a.provider,
    instrument: a.instrument,
    mission: a.mission,
    captureDate: a.captureDate,
  }));

  const hero = assets[0];

  return (
    <section className={className} aria-label={heading}>
      <h2 className="mb-4 flex items-center gap-2.5 font-display text-2xl font-bold sm:text-3xl">{heading}</h2>
      <MediaLightbox items={items} />
      <JsonLd
        data={imageObjectSchema({
          url: hero.url!,
          contentUrl: hero.url!,
          caption: hero.caption,
          alt: hero.alt,
          credit: hero.credit,
          license: hero.sourceUrl,
          acquireLicensePage: hero.sourceUrl,
          width: hero.width,
          height: hero.height,
          dateCreated: hero.captureDate,
        })}
      />
    </section>
  );
}
