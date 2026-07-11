import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { getHeroImageForEntity } from "@/lib/media/registry";
import { IMAGE_LICENSE_LABELS } from "@/lib/media/types";

export type HeroFact = { label: string; value: ReactNode };

/**
 * A full-width cinematic editorial hero. When the entity has a real image it
 * becomes an immersive image banner (dark gradient overlay, large title,
 * subtitle, a row of quick scientific facts, and an image credit). Without an
 * image it falls back to a clean, spacious text hero on the black theme.
 *
 * Server Component; the hero image is priority-loaded (LCP) with a blur-up
 * placeholder and no layout shift.
 */
export function EditorialHero({
  entityId,
  eyebrow,
  title,
  subtitle,
  facts,
  actions,
}: {
  entityId?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  facts?: HeroFact[];
  actions?: ReactNode;
}) {
  const img = entityId ? getHeroImageForEntity(entityId) : undefined;
  const hasImage = Boolean(img?.url);
  const shownFacts = (facts ?? []).filter((f) => f.value !== undefined && f.value !== null && f.value !== "").slice(0, 8);

  return (
    <section className={`relative isolate overflow-hidden ${hasImage ? "min-h-[70svh] sm:min-h-[82svh]" : ""}`}>
      {hasImage && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image
            src={img!.url!}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            placeholder={img!.blurDataURL ? "blur" : "empty"}
            blurDataURL={img!.blurDataURL}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/75 via-bg/20 to-transparent" />
        </div>
      )}

      <Container
        className={
          hasImage
            ? "flex min-h-[70svh] flex-col justify-end pb-14 pt-28 sm:min-h-[82svh] sm:pb-20"
            : "pt-16 pb-8 sm:pt-24"
        }
      >
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-4 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              <span aria-hidden className="inline-block h-3 w-1 rounded-full bg-nasa-red" />
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-4xl font-bold leading-[1.03] text-white sm:text-6xl lg:text-7xl">{title}</h1>
          {subtitle && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">{subtitle}</p>}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>

        {shownFacts.length > 0 && (
          <dl className="mt-10 grid max-w-4xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-3 lg:grid-cols-4">
            {shownFacts.map((f, i) => (
              <div key={i}>
                <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">{f.label}</dt>
                <dd className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Container>

      {hasImage && (img!.credit || img!.license) && (
        <p className="pointer-events-none absolute bottom-3 right-4 z-10 max-w-[60%] truncate text-right text-[10px] text-white/45">
          {img!.credit}
          {img!.license ? ` · ${IMAGE_LICENSE_LABELS[img!.license]}` : ""}
        </p>
      )}
    </section>
  );
}
