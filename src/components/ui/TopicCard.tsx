import Link from "next/link";
import type { ReactNode } from "react";
import type { AccentToken } from "@/lib/content/types";
import { accentVars } from "@/lib/theme";

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
}

/**
 * The primary navigational card used across hubs, grids, and related links.
 * The whole card is a link with a quiet editorial hover state.
 */
export function TopicCard({
  title,
  description,
  href,
  eyebrow,
  accent,
  badge,
}: TopicCardProps) {
  return (
    <Link
      href={href}
      style={accent ? accentVars(accent) : undefined}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-silver/12 bg-bg-elevated/72 p-5 shadow-[0_14px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent,#c8d2e6)_38%,transparent)] hover:bg-surface/82"
    >
      <div className="relative flex items-start justify-between gap-3">
        <div>
          {eyebrow && (
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-faint">
              {eyebrow}
            </p>
          )}
          <h3 className="font-display text-lg font-semibold text-fg">{title}</h3>
        </div>
        <span
          aria-hidden
          className="mt-1 shrink-0 text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--accent,#c8d2e6)]"
        >
          →
        </span>
      </div>
      {description && (
        <p className="relative mt-2 text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}
      {badge && <div className="relative mt-4">{badge}</div>}
    </Link>
  );
}
