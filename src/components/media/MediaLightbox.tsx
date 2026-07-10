"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A responsive scientific image gallery with a premium lightbox.
 *
 * Images use `next/image` (responsive AVIF/WebP, blur-up placeholder, hero is
 * priority + 16:9 cinematic, the rest lazy) — no layout shift. The lightbox
 * supports click-to-zoom, keyboard (←/→/Esc), touch swipe, and links to open or
 * download the original from the source archive. Mobile: large tap targets.
 */

export type MediaItem = {
  url: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  title: string;
  caption?: string;
  credit: string;
  licenseLabel: string;
  sourceUrl: string;
  originalUrl?: string;
  object?: string;
  provider?: string;
  instrument?: string;
  mission?: string;
  captureDate?: string;
};

function Meta({ item, dark = false }: { item: MediaItem; dark?: boolean }) {
  const bits = [item.instrument, item.mission, item.captureDate?.slice(0, 4)].filter(Boolean).join(" · ");
  const caption = item.caption && item.caption.trim() !== item.title.trim() ? item.caption : null;
  return (
    <>
      {caption && <p className={`text-sm leading-relaxed ${dark ? "text-white/80" : "text-muted"}`}>{caption}</p>}
      {bits && <p className={`mt-1 text-xs ${dark ? "text-white/55" : "text-faint"}`}>{bits}</p>}
      <p className={`mt-2 text-xs ${dark ? "text-white/55" : "text-faint"}`}>
        {item.credit} · {item.licenseLabel}
      </p>
    </>
  );
}

export function MediaLightbox({ items, heroSizes = "(min-width: 1024px) 66vw, 100vw" }: { items: MediaItem[]; heroSizes?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const touchX = useRef<number | null>(null);
  const hero = items[0];
  const rest = items.slice(1);

  const close = useCallback(() => { setOpen(null); setZoom(false); }, []);
  const step = useCallback(
    (d: number) => { setZoom(false); setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)); },
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close, step]);

  if (!hero) return null;
  const active = open === null ? null : items[open];

  return (
    <div>
      <figure className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black">
        <button type="button" onClick={() => setOpen(0)} aria-label={`Enlarge image: ${hero.title}`} className="block w-full cursor-zoom-in">
          <div className="relative aspect-video w-full">
            <Image
              src={hero.url}
              alt={hero.alt}
              fill
              sizes={heroSizes}
              placeholder={hero.blurDataURL ? "blur" : "empty"}
              blurDataURL={hero.blurDataURL}
              priority
              className="object-cover transition duration-700 group-hover:scale-[1.02]"
            />
          </div>
        </button>
        <figcaption className="border-t border-white/10 bg-bg/60 px-4 py-3 backdrop-blur-md">
          <p className="text-sm font-medium text-fg">{hero.title}</p>
          <Meta item={hero} />
          <p className="mt-2 text-xs text-faint">
            <a href={hero.sourceUrl} target="_blank" rel="noreferrer" className="text-nasa underline underline-offset-2 hover:text-fg">Source archive ↗</a>
          </p>
        </figcaption>
      </figure>

      {rest.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {rest.map((item, i) => (
            <li key={item.url}>
              <button type="button" onClick={() => setOpen(i + 1)} aria-label={`Enlarge image: ${item.title}`} className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-black">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, 48vw"
                    placeholder={item.blurDataURL ? "blur" : "empty"}
                    blurDataURL={item.blurDataURL}
                    loading="lazy"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={close}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 55) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
          className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-end gap-2 p-3 sm:p-4" onClick={(e) => e.stopPropagation()}>
            {active.originalUrl && (
              <a href={active.originalUrl} target="_blank" rel="noreferrer" download className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10">Download ↓</a>
            )}
            <a href={active.sourceUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10">Source ↗</a>
            <button type="button" onClick={close} aria-label="Close" className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10">Close ✕</button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 sm:px-14" onClick={(e) => e.stopPropagation()}>
            {items.length > 1 && (
              <>
                <button type="button" aria-label="Previous" onClick={() => step(-1)} className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-lg text-white hover:bg-white/10 sm:left-3">‹</button>
                <button type="button" aria-label="Next" onClick={() => step(1)} className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-lg text-white hover:bg-white/10 sm:right-3">›</button>
              </>
            )}
            <Image
              src={active.url}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="95vw"
              placeholder={active.blurDataURL ? "blur" : "empty"}
              blurDataURL={active.blurDataURL}
              onClick={() => setZoom((z) => !z)}
              className={`max-h-full w-auto select-none object-contain transition-transform duration-300 ${zoom ? "scale-[1.9] cursor-zoom-out" : "cursor-zoom-in"}`}
            />
          </div>

          <div className="mx-auto w-full max-w-3xl px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-medium text-white">{active.title}</p>
            <Meta item={active} dark />
            {items.length > 1 && <p className="mt-2 text-xs text-white/45">{open! + 1} / {items.length}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
