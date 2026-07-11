import type { CSSProperties } from "react";
import type { AccentToken } from "@/lib/content/types";

/**
 * Accent palette. Each section has an accent used for badges, borders, and
 * hover glows. Because Tailwind cannot generate class names dynamically, we
 * expose accent colors as CSS custom properties via `accentVars()` and read
 * them in components with arbitrary-value utilities like `text-[var(--accent)]`.
 */
export const ACCENTS: Record<AccentToken, { from: string; to: string; solid: string }> = {
  // Final identity: black/white/red, with neutral silver aliases kept for
  // backward-compatible hub accents. Green is intentionally absent here because
  // it is reserved for positive operational/status semantics.
  nebula: { from: "#ff6a5e", to: "#b91c1c", solid: "#ff2a1a" },
  aurora: { from: "#ffffff", to: "#c9ced3", solid: "#ffffff" },
  ember: { from: "#ff2a1a", to: "#8f1111", solid: "#e10600" },
  plasma: { from: "#ffffff", to: "#8f989f", solid: "#c9ced3" },
  stone: { from: "#d9dee2", to: "#6f777d", solid: "#8f989f" },
  halo: { from: "#ffffff", to: "#d9dee2", solid: "#ffffff" },
  comet: { from: "#f5f7f8", to: "#9aa2a8", solid: "#c9ced3" },
};

/** Inline CSS variables for a given accent, applied on a wrapping element. */
export function accentVars(accent: AccentToken): CSSProperties {
  const a = ACCENTS[accent];
  return {
    ["--accent" as string]: a.solid,
    ["--accent-from" as string]: a.from,
    ["--accent-to" as string]: a.to,
  };
}
