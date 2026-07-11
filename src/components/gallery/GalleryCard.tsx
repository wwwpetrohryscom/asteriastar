import Link from "next/link";
import Image from "next/image";
import type { GalleryImage } from "@/lib/gallery";

/**
 * A gallery card showing a real, openly-licensed, self-hosted photograph of an
 * actual object, linking to that object's page (where the full multi-image
 * gallery + provenance live). Credit and licence are shown on the card.
 */
export function GalleryCard({ img }: { img: GalleryImage }) {
  return (
    <Link
      href={img.href}
      className="group flex flex-col overflow-hidden rounded-lg border border-silver/12 bg-bg-elevated/80 shadow-[0_14px_50px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:border-nasa/50"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
        <Image
          src={img.url}
          alt={img.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          placeholder={img.blurDataURL ? "blur" : "empty"}
          blurDataURL={img.blurDataURL}
          loading="lazy"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
          {img.object}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-fg transition group-hover:text-nasa">{img.title}</h3>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.7rem] text-faint">
          <span className="rounded-full border border-white/10 px-2 py-0.5">{img.licenseLabel}</span>
          <span className="truncate">{img.credit}</span>
        </div>
      </div>
    </Link>
  );
}
