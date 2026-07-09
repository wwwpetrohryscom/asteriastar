import type { CSSProperties } from "react";
import type { AccentToken } from "@/lib/content/types";

/**
 * Accent palette. Each section has an accent used for gradients, badges, and
 * hover glows. Because Tailwind cannot generate class names dynamically, we
 * expose accent colors as CSS custom properties via `accentVars()` and read
 * them in components with arbitrary-value utilities like `text-[var(--accent)]`.
 */
export const ACCENTS: Record<AccentToken, { from: string; to: string; solid: string }> = {
  // Monochrome starlight — every accent is a shade of silver/white so nothing
  // reads as colour. Kept faintly distinct (cool/warm/neutral) for legibility.
  nebula: { from: "#e6ecf8", to: "#aeb9d2", solid: "#c6d0e6" },
  aurora: { from: "#e2e9f0", to: "#a9b6c6", solid: "#c2ccd8" },
  ember: { from: "#efe7d6", to: "#c6bba4", solid: "#d8cdb8" },
  plasma: { from: "#e8e4ee", to: "#b4adc4", solid: "#cbc6d6" },
  stone: { from: "#cbd3e0", to: "#8f9bb2", solid: "#9aa6c0" },
  halo: { from: "#eff3fa", to: "#c2cbdd", solid: "#d7deec" },
  comet: { from: "#e3ecea", to: "#a7bcb8", solid: "#bfccc9" },
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
