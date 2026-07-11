import Image from "next/image";
import Link from "next/link";
import { getHeroImageForEntity } from "@/lib/media/registry";
import { entityHref } from "@/lib/gallery";

type Ref = { id: string; name?: string; href?: string; typeLabel?: string };

/**
 * "Related objects" as premium image cards (never plain text links). Prefers a
 * real thumbnail per entity; falls back to a quiet lettered tile when an entity
 * has no image, so the row always reads as an editorial gallery.
 */
export function RelatedObjects({
  items,
  heading = "Related objects",
  max = 8,
  className = "",
}: {
  items: Ref[];
  heading?: string;
  max?: number;
  className?: string;
}) {
  const cards = items.slice(0, max).map((r) => {
    const h = getHeroImageForEntity(r.id);
    return {
      id: r.id,
      name: r.name ?? h?.object ?? h?.title ?? r.id.split(":")[1],
      typeLabel: r.typeLabel,
      href: r.href ?? entityHref(r.id),
      img: h?.url ? { url: h.url, alt: h.alt, blurDataURL: h.blurDataURL } : null,
    };
  });
  if (cards.length === 0) return null;

  return (
    <section className={className} aria-label={heading}>
      <h2 className="mb-6 flex items-center gap-2.5 font-display text-2xl font-bold text-fg sm:text-3xl">
        <span aria-hidden className="inline-block h-4 w-1 rounded-full bg-nasa-red" />
        {heading}
      </h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.id}>
            <Link
              href={c.href}
              className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-bg-elevated/70 transition duration-300 hover:-translate-y-0.5 hover:border-white/25"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                {c.img ? (
                  <Image
                    src={c.img.url}
                    alt={c.img.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    placeholder={c.img.blurDataURL ? "blur" : "empty"}
                    blurDataURL={c.img.blurDataURL}
                    loading="lazy"
                    className="object-cover transition duration-500 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-surface">
                    <span className="font-display text-3xl font-bold text-white/25">{c.name?.[0] ?? "★"}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/24" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                {c.typeLabel && <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-faint">{c.typeLabel}</p>}
                <h3 className="font-display text-base font-semibold leading-snug text-fg transition group-hover:text-nasa">{c.name}</h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
