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
 *
 * When `excludeHero` is set (used by pages that already show the hero image as a
 * cinematic banner), the visible block shows only the remaining gallery images —
 * but the hero's ImageObject JSON-LD is still emitted for SEO.
 */
export function EntityImagery({
  entityId,
  heading = "Imagery",
  excludeHero = false,
  className = "",
}: {
  entityId: string;
  heading?: string;
  excludeHero?: boolean;
  className?: string;
}) {
  let assets = getImagesForEntity(entityId);
  let resolvedHeading = heading;
  // Astrology signs carry no photograph of their own — show the sky image of the
  // constellation of the same name (Aries → constellation:aries, …).
  if (assets.length === 0 && entityId.startsWith("astrology_sign:")) {
    const con = getImagesForEntity(`constellation:${entityId.split(":")[1]}`);
    if (con.length > 0) {
      assets = con;
      if (heading === "Imagery") resolvedHeading = "The constellation";
    }
  }
  if (assets.length === 0) return null;

  const hero = assets[0];
  const gallery = excludeHero ? assets.slice(1) : assets;

  const items: MediaItem[] = gallery.map((a) => ({
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

  return (
    <>
      {items.length > 0 && (
        <section className={className} aria-label={resolvedHeading}>
          <h2 className="mb-4 flex items-center gap-2.5 font-display text-2xl font-bold sm:text-3xl">
            {excludeHero && <span aria-hidden className="inline-block h-4 w-1 rounded-full bg-nasa-red" />}
            {resolvedHeading}
          </h2>
          <MediaLightbox items={items} />
        </section>
      )}
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
    </>
  );
}
