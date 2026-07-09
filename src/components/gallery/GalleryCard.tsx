import Link from "next/link";
import type { ImageRecord } from "@/knowledge-graph/data/image-catalog/types";
import { licenseLabel } from "@/lib/gallery";
import { imagePath } from "@/lib/routes";

/**
 * A gallery card for a catalogued image. Because the platform never re-hosts or
 * fabricates the photograph itself, the visual is an original, decorative
 * "poster" tile (a deterministic cosmic gradient keyed off the slug) — not the
 * image — and the card carries the real provenance (object, credit, licence)
 * and links to the image's page, which links on to the official archive.
 */
const PALETTES = [
  ["#0a1f44", "#12386e", "#0a1226"],
  ["#0d1030", "#2a1c52", "#0a0e22"],
  ["#04121f", "#0b3550", "#061019"],
  ["#160a1e", "#3a1338", "#0c0714"],
  ["#0a1a12", "#123a2c", "#07120d"],
  ["#1a1204", "#3a2a0c", "#100a04"],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function Poster({ img }: { img: ImageRecord }) {
  const h = hash(img.slug);
  const [c0, c1, c2] = PALETTES[h % PALETTES.length];
  const gid = `gp-${img.slug}`;
  const dots = Array.from({ length: 16 }, (_, i) => {
    const r = hash(img.slug + i);
    return { x: (r % 300), y: ((r >> 4) % 170), rr: ((r >> 8) % 3) / 2 + 0.4, o: ((r >> 10) % 60) / 100 + 0.2 };
  });
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden">
      <svg viewBox="0 0 300 170" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
        <defs>
          <radialGradient id={gid} cx="0.35" cy="0.3" r="0.9">
            <stop offset="0" stopColor={c1} />
            <stop offset="0.6" stopColor={c0} />
            <stop offset="1" stopColor={c2} />
          </radialGradient>
        </defs>
        <rect width="300" height="170" fill={`url(#${gid})`} />
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.rr} fill="#eaf2ff" opacity={d.o} />
        ))}
        <circle cx="232" cy="52" r="30" fill="none" stroke="#f6d27a" strokeWidth="0.6" opacity="0.35" />
      </svg>
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-bg/85 via-bg/25 to-transparent p-4">
        <span className="text-xs font-medium uppercase tracking-wider text-halo/90">{img.objectName}</span>
      </div>
    </div>
  );
}

export function GalleryCard({ img }: { img: ImageRecord }) {
  return (
    <Link
      href={imagePath(img.slug)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:border-halo/40"
    >
      <Poster img={img} />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-fg group-hover:text-halo">{img.title}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">{img.caption ?? img.scientificDescription ?? img.altText}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.7rem]">
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-faint">{licenseLabel(img.licenseSlug)}</span>
          <span className="truncate text-faint">{img.credit}</span>
        </div>
      </div>
    </Link>
  );
}
