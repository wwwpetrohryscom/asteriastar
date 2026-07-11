import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import type { AccentToken } from "@/lib/content/types";
import { accentVars } from "@/lib/theme";

export interface TopicCardImage {
  url: string;
  alt: string;
  blurDataURL?: string;
}

export interface TopicCardProps {
  title: string;
  description?: string;
  href: string;
  /** Small label above the title, e.g. the parent hub. */
  eyebrow?: string;
  /** Optional accent; controls the hover glow and border tint. */
  accent?: AccentToken;
  /** Optional trailing badge (e.g. count or status). */
  badge?: ReactNode;
  /** Optional image rendered on top (NASA/ESA-style editorial card). */
  image?: TopicCardImage;
}

/**
 * The primary navigational card used across hubs, grids, and related links.
 * The whole card is a link. When an `image` is supplied it becomes an
 * editorial image-on-top card (NASA/ESA-style); otherwise a quiet text card.
 */
export function TopicCard({
  title,
  description,
  href,
  eyebrow,
  accent,
  badge,
  image,
}: TopicCardProps) {
  return (
    <Link
      href={href}
      style={accent ? accentVars(accent) : undefined}
      className="scientific-card group flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent,#ff2a1a)_58%,transparent)]"
    >
      {image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            placeholder={image.blurDataURL ? "blur" : "empty"}
            blurDataURL={image.blurDataURL}
            loading="lazy"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-black/28" />
          {eyebrow && (
            <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
              {eyebrow}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="relative flex items-start justify-between gap-3">
          <div>
            {eyebrow && !image && (
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-faint">{eyebrow}</p>
            )}
            <h3 className="font-display text-lg font-semibold text-fg">{title}</h3>
          </div>
          <span
            aria-hidden
            className="mt-1 shrink-0 text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--accent,#ff2a1a)]"
          >
            →
          </span>
        </div>
        {description && <p className="relative mt-2 text-sm leading-relaxed text-muted">{description}</p>}
        {badge && <div className="relative mt-4">{badge}</div>}
      </div>
    </Link>
  );
}
