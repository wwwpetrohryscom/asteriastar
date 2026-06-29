import { MediaGallery } from "@/components/media/MediaGallery";
import { getImagesForEntryPath } from "@/lib/media/registry";

/**
 * Entry gallery. Renders verified, openly-licensed images when present
 * (with full credit + license), otherwise an honest placeholder — never a
 * fabricated or unlicensed photo. See src/lib/media.
 */
export function EntryGallery({ name, entryPath }: { name: string; entryPath: string }) {
  const assets = getImagesForEntryPath(entryPath);
  return (
    <section aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="font-display text-xl font-semibold text-fg">
        Gallery
      </h2>
      <div className="mt-4">
        <MediaGallery assets={assets} subject={name} />
      </div>
    </section>
  );
}
