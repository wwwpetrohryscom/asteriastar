import Image from "next/image";
import Link from "next/link";
import { getHeroImageForEntity } from "@/lib/media/registry";
import { IMAGE_LICENSE_LABELS } from "@/lib/media/types";
import { entityHref } from "@/lib/gallery";

/**
 * Astronomy Photo of the Day — a real observation chosen deterministically from
 * the day's date, so it changes automatically every day (the homepage revalidates
 * daily). No fabrication: it rotates through a curated pool of real, credited,
 * openly-licensed images already in the media library.
 */
const POOL = [
  "nebula:ngc-3372", "galaxy:andromeda-galaxy", "nebula:crab-nebula", "planet:jupiter",
  "nebula:eagle-nebula", "galaxy:whirlpool-galaxy", "planet:saturn", "nebula:orion-nebula",
  "galaxy:sombrero-galaxy", "space_telescope:james-webb-space-telescope", "moon:europa",
  "planet:mars", "galaxy:triangulum-galaxy", "star_cluster:pleiades", "nebula:ring-nebula",
  "planet:earth", "moon:titan", "galaxy:messier-87", "nebula:lagoon-nebula", "planet:neptune",
  "moon:enceladus", "star:sun", "nebula:helix-nebula", "planet:uranus", "moon:the-moon",
  "space_telescope:hubble-space-telescope", "galaxy:pinwheel-galaxy", "comet:comet-neowise",
];

function daySeed(): number {
  // Days since the Unix epoch — stable within a UTC day; updated by daily revalidate.
  return Math.floor(Date.now() / 86_400_000);
}

export function PhotoOfDay() {
  const items = POOL.map((id) => {
    const h = getHeroImageForEntity(id);
    return h?.url ? { id, h } : null;
  }).filter((x): x is { id: string; h: NonNullable<ReturnType<typeof getHeroImageForEntity>> } => x !== null);
  if (items.length === 0) return null;

  const pick = items[daySeed() % items.length];
  const { h } = pick;
  const date = new Date(daySeed() * 86_400_000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const href = entityHref(pick.id);

  return (
    <div className="grid items-stretch overflow-hidden rounded-xl border border-white/10 bg-bg-elevated/70 lg:grid-cols-[1.5fr_1fr]">
      <Link href={href} className="group relative block aspect-[16/10] w-full bg-black lg:aspect-auto lg:h-full lg:min-h-[420px]">
        <Image
          src={h.url!}
          alt={h.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          placeholder={h.blurDataURL ? "blur" : "empty"}
          blurDataURL={h.blurDataURL}
          className="object-cover transition duration-700 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-col justify-center p-7 lg:p-10">
        <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-nasa">
          <span aria-hidden className="inline-block h-3 w-1 rounded-full bg-nasa-red" />
          Astronomy Photo of the Day
        </p>
        <p className="mt-1 text-xs text-faint">{date}</p>
        <h2 className="mt-3 font-display text-2xl font-bold text-fg sm:text-3xl">{h.title}</h2>
        <p className="mt-3 leading-relaxed text-muted">{h.alt}</p>
        <p className="mt-4 text-xs text-faint">{h.credit} · {IMAGE_LICENSE_LABELS[h.license]}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={href} className="inline-flex items-center justify-center rounded-lg bg-nasa-red px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
            View the object
          </Link>
          <Link href="/gallery" className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-fg transition hover:border-nasa/50">
            Browse the gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
