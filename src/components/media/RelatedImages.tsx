import Image from "next/image";
import Link from "next/link";
import { getHeroImageForEntity } from "@/lib/media/registry";
import { entityHref } from "@/lib/gallery";

/**
 * A compact grid of real, credited thumbnails for a set of related entities,
 * each linking to that object's page. Renders nothing if none of the entities
 * have imagery, so it is safe to drop onto educational / topical pages.
 */
export function RelatedImages({
  entityIds,
  heading = "In pictures",
  max = 8,
  className = "",
}: {
  entityIds: string[];
  heading?: string;
  max?: number;
  className?: string;
}) {
  const items = entityIds
    .map((id) => {
      const h = getHeroImageForEntity(id);
      return h?.url ? { id, h } : null;
    })
    .filter((x): x is { id: string; h: NonNullable<ReturnType<typeof getHeroImageForEntity>> } => x !== null)
    .slice(0, max);

  if (items.length === 0) return null;

  return (
    <section className={className} aria-label={heading}>
      <h2 className="mb-4 flex items-center gap-2.5 font-display text-xl font-semibold text-fg sm:text-2xl">
        <span aria-hidden className="inline-block h-3.5 w-1 rounded-full bg-nasa-red" />
        {heading}
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map(({ id, h }) => (
          <li key={id}>
            <Link href={entityHref(id)} className="group block overflow-hidden rounded-lg border border-white/10 bg-black">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={h.url!}
                  alt={h.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  placeholder={h.blurDataURL ? "blur" : "empty"}
                  blurDataURL={h.blurDataURL}
                  loading="lazy"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 truncate px-3 py-2 text-xs font-medium text-white">
                  {h.object ?? h.title}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
