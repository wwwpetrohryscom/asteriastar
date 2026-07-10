import Link from "next/link";
import { ImageFigure } from "@/components/media/ImageFigure";
import type { ImageAsset } from "@/lib/media/types";

/**
 * Renders a grid of licensed images, or an honest placeholder when none are
 * available yet. Never shows fabricated or unlicensed imagery.
 */
export function MediaGallery({
  assets,
  subject,
  note = "Prepared for official NASA / ESA integration.",
}: {
  assets: ImageAsset[];
  subject: string;
  note?: string;
}) {
  if (assets.length > 0) {
    return (
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <li key={asset.id}>
            <ImageFigure asset={asset} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="flex flex-col items-center rounded-lg border border-silver/12 bg-bg-elevated/70 p-8 text-center shadow-[0_14px_50px_rgba(0,0,0,0.18)]">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden className="text-faint">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
        <path d="m4 17 5-4 4 3 3-2 4 3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <p className="mt-3 max-w-md text-muted">Verified imagery of {subject} will appear here.</p>
      <p className="mt-1 max-w-md text-sm text-faint">
        {note} We publish only openly licensed and public-domain media, with full
        credit, license, and source for every image.
      </p>
      <Link
        href="/sources-policy"
        className="mt-4 text-sm font-medium text-halo underline-offset-4 transition hover:underline"
      >
        Our sources &amp; licensing policy →
      </Link>
    </div>
  );
}
