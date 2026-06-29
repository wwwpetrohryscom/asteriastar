import { IMAGE_LICENSE_LABELS, type ImageAsset } from "@/lib/media/types";

/**
 * Renders a single licensed image with full provenance (credit, license,
 * instrument/mission/date, and a link to the source). Only ever used for
 * assets that are `published` and carry a `url`.
 */
export function ImageFigure({ asset }: { asset: ImageAsset }) {
  const meta = [asset.mission, asset.instrument, asset.captureDate].filter(Boolean).join(" · ");
  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      {/* eslint-disable-next-line @next/next/no-img-element -- remote licensed media, intentionally unoptimized */}
      <img
        src={asset.url}
        alt={asset.alt}
        loading="lazy"
        className="aspect-video w-full object-cover"
      />
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
          className="mt-1 inline-block text-xs text-nebula underline-offset-4 hover:underline"
        >
          Source
        </a>
      </figcaption>
    </figure>
  );
}
