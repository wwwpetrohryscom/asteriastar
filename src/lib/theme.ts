import type { CSSProperties } from "react";
import type { AccentToken } from "@/lib/content/types";

/**
 * Accent palette. Each section has an accent used for gradients, badges, and
 * hover glows. Because Tailwind cannot generate class names dynamically, we
 * expose accent colors as CSS custom properties via `accentVars()` and read
 * them in components with arbitrary-value utilities like `text-[var(--accent)]`.
 */
export const ACCENTS: Record<AccentToken, { from: string; to: string; solid: string }> = {
  // NASA/ESA scientific palette — deep navy, NASA blue, steel, silver, and a
  // reserved soft gold. No purple. Each hub reads as a distinct but restrained
  // blue/steel/silver/gold tint so the platform stays premium, not a rainbow.
  nebula: { from: "#9cc4ff", to: "#3f74c9", solid: "#6ba1f0" }, // NASA blue
  aurora: { from: "#c3d6ea", to: "#6f92b8", solid: "#8fb0d4" }, // steel blue
  ember: { from: "#f4e2b8", to: "#caa858", solid: "#e6c987" }, // soft gold
  plasma: { from: "#b6c6e4", to: "#586f9e", solid: "#7f9bd0" }, // slate blue
  stone: { from: "#c2ccdd", to: "#828ea6", solid: "#9aa6be" }, // silver-slate
  halo: { from: "#eaf1fb", to: "#b7c8e2", solid: "#d4e0f4" }, // starlight
  comet: { from: "#cfe6f2", to: "#6fa2c2", solid: "#a3c6de" }, // ice blue
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
