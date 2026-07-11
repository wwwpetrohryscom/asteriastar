"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Rotating hero background — a set of real observations that cross-fade behind
 * the persistent homepage intro. First slide is priority (LCP); the rest fade in.
 * Honors prefers-reduced-motion (no auto-advance). NASA-style red progress dots.
 */
export type HeroSlide = {
  url: string;
  blurDataURL?: string;
  object: string;
  credit: string;
  href: string;
};

export function HeroCarousel({ slides, intervalMs = 6500 }: { slides: HeroSlide[]; intervalMs?: number }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n < 2) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), intervalMs);
    return () => clearInterval(t);
  }, [n, intervalMs]);

  if (n === 0) return null;
  const active = slides[i];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {slides.map((s, idx) => (
        <div key={s.url} className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${idx === i ? "opacity-100" : "opacity-0"}`}>
          <Image
            src={s.url}
            alt=""
            fill
            priority={idx === 0}
            loading={idx === 0 ? "eager" : "lazy"}
            sizes="100vw"
            placeholder={s.blurDataURL ? "blur" : "empty"}
            blurDataURL={s.blurDataURL}
            className="object-cover object-center"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/72 to-bg/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/40 to-transparent" />

      <Link
        href={active.href}
        className="pointer-events-auto absolute bottom-6 right-5 hidden max-w-[16rem] rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-right backdrop-blur-md transition hover:border-nasa/70 sm:block"
      >
        <p className="text-xs font-medium text-white">{active.object}</p>
        <p className="text-[10px] leading-snug text-white/60">{active.credit}</p>
      </Link>

      <div className="pointer-events-auto absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-20 sm:left-5 sm:translate-x-0">
        {slides.map((s, idx) => (
          <button
            key={s.url}
            type="button"
            aria-label={`Show ${slides[idx].object}`}
            aria-current={idx === i}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === i ? "w-7 bg-nasa-red" : "w-2 bg-white/40 hover:bg-white/70"}`}
          />
        ))}
      </div>
    </div>
  );
}
