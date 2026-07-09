import type { ReactNode } from "react";
import type { AccentToken } from "@/lib/content/types";
import { accentVars } from "@/lib/theme";
import { Container } from "@/components/ui/Container";
import { CosmicBackdrop } from "@/components/cosmos/Cosmos";

/**
 * Page hero / header. `compact` switches between the large homepage hero and
 * the lighter header used at the top of hub and category pages.
 */
export function HeroSection({
  eyebrow,
  title,
  lead,
  actions,
  accent = "nebula",
  compact = false,
  backdrop = false,
  backdropVariant = "hero",
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  accent?: AccentToken;
  compact?: boolean;
  backdrop?: boolean;
  backdropVariant?: "hero" | "section" | "subtle";
  children?: ReactNode;
}) {
  return (
    <section
      style={accentVars(accent)}
      className={`${backdrop ? "relative isolate overflow-hidden" : ""} ${compact ? "pt-10 pb-2" : "pt-16 pb-10 sm:pt-24 sm:pb-14"}`}
    >
      {backdrop && <CosmicBackdrop variant={backdropVariant} />}
      <Container>
        {eyebrow && (
          <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-faint">
            {eyebrow}
          </div>
        )}
        <h1
          className={
            compact
              ? "max-w-4xl font-display text-3xl font-bold sm:text-4xl"
              : "max-w-4xl font-display text-4xl font-bold leading-[1.05] sm:text-6xl"
          }
        >
          {title}
        </h1>
        {lead && (
          <p
            className={`mt-5 max-w-2xl leading-relaxed text-muted ${compact ? "text-base" : "text-lg sm:text-xl"}`}
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
