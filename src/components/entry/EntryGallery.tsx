import Link from "next/link";

/**
 * Entry gallery. We bundle no fabricated or unlicensed imagery, so until a
 * verified, openly-licensed image is available this renders an honest,
 * on-brand placeholder that points to the Observatory — never a fake photo.
 */
export function EntryGallery({ name }: { name: string }) {
  return (
    <section aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="font-display text-xl font-semibold text-fg">
        Gallery
      </h2>
      <div className="mt-4 flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden className="text-faint">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
          <path d="m4 17 5-4 4 3 3-2 4 3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <p className="mt-3 max-w-md text-muted">
          Verified imagery of {name} is being curated for the Observatory.
        </p>
        <p className="mt-1 max-w-md text-sm text-faint">
          We publish only openly licensed and public-domain media, with full
          credit and source for every image.
        </p>
        <Link
          href="/observatory/image-library"
          className="mt-4 text-sm font-medium text-nebula underline-offset-4 transition hover:underline"
        >
          Visit the Observatory →
        </Link>
      </div>
    </section>
  );
}
