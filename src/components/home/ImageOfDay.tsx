"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * A rotating "featured observation" panel — real images cross-fade on the left
 * while the title/credit/link update in sync on the right. Auto-advances (unless
 * reduced-motion), with clickable progress dots.
 */
export type FeaturedItem = {
  url: string;
  alt: string;
  blurDataURL?: string;
  title: string;
  blurb: string;
  credit: string;
  licenseLabel: string;
  href: string;
};

export function ImageOfDay({ items, intervalMs = 7500 }: { items: FeaturedItem[]; intervalMs?: number }) {
  const [i, setI] = useState(0);
  const n = items.length;

  useEffect(() => {
    if (n < 2) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), intervalMs);
    return () => clearInterval(t);
  }, [n, intervalMs]);

  if (n === 0) return null;
  const it = items[i];

  return (
    <div className="grid items-stretch overflow-hidden rounded-xl border border-white/10 bg-bg-elevated/70 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative aspect-[16/10] w-full bg-black lg:aspect-auto lg:h-full lg:min-h-[400px]">
        {items.map((x, idx) => (
          <Image
            key={x.url}
            src={x.url}
            alt={idx === i ? x.alt : ""}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            placeholder={x.blurDataURL ? "blur" : "empty"}
            blurDataURL={x.blurDataURL}
            loading={idx === 0 ? "eager" : "lazy"}
            className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${idx === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
      <div className="flex flex-col p-7 lg:p-9">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-nasa">
          <span className="inline-block h-3 w-1 rounded-full bg-nasa-red" />
          Featured observation
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-fg sm:text-3xl">{it.title}</h2>
        <p className="mt-3 leading-relaxed text-muted">{it.blurb}</p>
        <p className="mt-4 text-xs text-faint">{it.credit} · {it.licenseLabel}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={it.href} className="inline-flex items-center justify-center rounded-lg bg-nasa-red px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
            Open the object
          </Link>
          <Link href="/gallery" className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-fg transition hover:border-nasa/50">
            More imagery
          </Link>
        </div>
        <div className="mt-6 flex gap-2">
          {items.map((x, idx) => (
            <button
              key={x.url}
              type="button"
              aria-label={`Show ${x.title}`}
              aria-current={idx === i}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === i ? "w-7 bg-nasa-red" : "w-2 bg-white/25 hover:bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
