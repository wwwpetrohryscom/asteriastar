import Image from "next/image";
import { IMAGE_LICENSE_LABELS, type ImageAsset } from "@/lib/media/types";

/**
 * Renders a single licensed image with full provenance (credit, license,
 * instrument/mission/date, and a link to the source). Only ever used for
 * assets that are `published` and carry a `url`.
 */
export function ImageFigure({ asset }: { asset: ImageAsset }) {
  const meta = [asset.mission, asset.instrument, asset.captureDate].filter(Boolean).join(" · ");
  const local = asset.url?.startsWith("/");
  return (
    <figure className="overflow-hidden rounded-lg border border-silver/12 bg-bg-elevated/80 shadow-[0_16px_56px_rgba(0,0,0,0.2)]">
      <div className="relative aspect-video w-full overflow-hidden bg-surface">
        {local ? (
          <Image
            src={asset.url ?? ""}
            alt={asset.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- future remote licensed media may not be configured for next/image.
          <img src={asset.url} alt={asset.alt} loading="lazy" className="h-full w-full object-cover" />
        )}
      </div>
      <figcaption className="p-4">
        <p className="font-medium text-fg">{asset.title}</p>
        {meta && <p className="mt-1 text-xs text-faint">{meta}</p>}
        <p className="mt-2 text-xs text-muted">
          {asset.credit} · {IMAGE_LICENSE_LABELS[asset.license]}
        </p>
        <a
          href={asset.sourceUrl}
          target="_blank"
          rel="noreferrer nofollow"
          className="mt-1 inline-block text-xs text-halo underline-offset-4 hover:underline"
        >
          Source
        </a>
      </figcaption>
    </figure>
  );
}
