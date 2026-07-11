import type { ReactNode } from "react";
import type { AccentToken } from "@/lib/content/types";
import { accentVars } from "@/lib/theme";
import { Container } from "@/components/ui/Container";
import { PhotoBackdrop } from "@/components/cosmos/PhotoBackdrop";

/**
 * Page hero / header. This is the shared non-home editorial header for hubs,
 * tools, docs, indexes, and legacy route families.
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
        "relative isolate overflow-hidden border-b border-white/10 bg-black",
        backdrop && !compact ? "flex min-h-[560px] flex-col justify-end sm:min-h-[680px]" : "",
        compact ? "pt-14 pb-8 sm:pt-16 sm:pb-10" : "pt-24 pb-16 sm:pt-32 sm:pb-20",
      ].join(" ")}
    >
      {backdrop && <PhotoBackdrop variant="hero" priority={!compact} />}
      {!backdrop && (
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.32]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(245,247,248,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,248,0.04) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div className="absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full border border-white/[0.06]" />
          <div className="absolute -right-20 top-28 h-[20rem] w-[20rem] rounded-full border border-nasa/20" />
          <div className="absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-nasa/50" />
        </div>
      )}
      <Container className="relative">
        {eyebrow && (
          <div className="mb-6 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white">
            <span aria-hidden className="inline-block h-4 w-1 rounded-full bg-nasa-red" />
            {eyebrow}
          </div>
        )}
        <h1
          className={
            compact
              ? "max-w-4xl font-display text-4xl font-bold leading-[1.04] text-white sm:text-5xl"
              : "max-w-5xl font-display text-5xl font-bold leading-[1.01] text-white sm:text-7xl"
          }
        >
          {title}
        </h1>
        {lead && (
          <p
            className={`mt-6 max-w-3xl leading-relaxed text-muted ${compact ? "text-lg" : "text-lg sm:text-xl"}`}
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
