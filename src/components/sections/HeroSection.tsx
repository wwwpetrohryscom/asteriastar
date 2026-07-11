import type { ReactNode } from "react";
import type { AccentToken } from "@/lib/content/types";
import { accentVars } from "@/lib/theme";
import { Container } from "@/components/ui/Container";
import { PhotoBackdrop } from "@/components/cosmos/PhotoBackdrop";

/**
 * Page hero / header. `compact` switches between the large homepage hero and
 * the lighter header used at the top of hub and category pages. When `backdrop`
 * is set the hero becomes a real-photo showcase above the global ambient layer.
 */
export function HeroSection({
  eyebrow,
  title,
  lead,
  actions,
  accent = "nebula",
  compact = false,
  backdrop = false,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  accent?: AccentToken;
  compact?: boolean;
  /** Show the cosmos photograph as a showcase backdrop for this hero. */
  backdrop?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      style={accentVars(accent)}
      className={[
        backdrop ? "relative isolate overflow-hidden" : "",
        backdrop && !compact ? "flex min-h-[560px] flex-col justify-end sm:min-h-[680px]" : "",
        compact ? "pt-12 pb-3" : "pt-[4.5rem] pb-12 sm:pt-28 sm:pb-16",
      ].join(" ")}
    >
      {backdrop && <PhotoBackdrop variant="hero" priority={!compact} />}
      <Container>
        {eyebrow && (
          <div className="mb-5 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            <span aria-hidden className="inline-block h-3 w-1 rounded-full bg-nasa-red" />
            {eyebrow}
          </div>
        )}
        <h1
          className={
            compact
              ? "max-w-4xl font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl"
              : "max-w-5xl font-display text-5xl font-bold leading-[1.02] text-white sm:text-7xl"
          }
        >
          {title}
        </h1>
        {lead && (
          <p
            className={`mt-6 max-w-2xl leading-relaxed text-muted ${compact ? "text-lg" : "text-lg sm:text-xl"}`}
          >
            {lead}
          </p>
        )}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        {children}
      </Container>
    </section>
  );
}
