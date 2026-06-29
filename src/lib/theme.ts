import type { CSSProperties } from "react";
import type { AccentToken } from "@/lib/content/types";

/**
 * Accent palette. Each section has an accent used for gradients, badges, and
 * hover glows. Because Tailwind cannot generate class names dynamically, we
 * expose accent colors as CSS custom properties via `accentVars()` and read
 * them in components with arbitrary-value utilities like `text-[var(--accent)]`.
 */
export const ACCENTS: Record<AccentToken, { from: string; to: string; solid: string }> = {
  nebula: { from: "#8b8cf0", to: "#c084fc", solid: "#a78bfa" },
  aurora: { from: "#22d3ee", to: "#2dd4bf", solid: "#34d3d3" },
  ember: { from: "#fbbf24", to: "#fb7185", solid: "#fb9a4b" },
  plasma: { from: "#e879f9", to: "#a855f7", solid: "#d06bf2" },
  stone: { from: "#94a3b8", to: "#7c8aa8", solid: "#9aa6c0" },
  halo: { from: "#38bdf8", to: "#818cf8", solid: "#56b6f6" },
  comet: { from: "#34d399", to: "#22d3ee", solid: "#36cfb0" },
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
