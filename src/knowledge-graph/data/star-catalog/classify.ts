import type { StarCategory } from "@/knowledge-graph/data/star-catalog/types";

/**
 * Classification helpers. These apply STANDARD definitions to the catalogue's
 * real spectral types and coordinates — e.g. "an M-type main-sequence star is a
 * red dwarf". They derive, they never invent: when a value cannot be classified,
 * the result is undefined.
 */

export const GREEK_LETTERS: Record<string, string> = {
  Alp: "Alpha", Bet: "Beta", Gam: "Gamma", Del: "Delta", Eps: "Epsilon",
  Zet: "Zeta", Eta: "Eta", The: "Theta", Iot: "Iota", Kap: "Kappa",
  Lam: "Lambda", Mu: "Mu", Nu: "Nu", Xi: "Xi", Omi: "Omicron",
  Pi: "Pi", Rho: "Rho", Sig: "Sigma", Tau: "Tau", Ups: "Upsilon",
  Phi: "Phi", Chi: "Chi", Psi: "Psi", Ome: "Omega",
};

export function greekName(bayer: string): string | undefined {
  const key = bayer.replace(/[0-9].*$/, "").trim();
  return GREEK_LETTERS[key];
}

/** The leading spectral class letter (O B A F G K M, plus W D L T Y, S C). */
export function spectralClass(spect: string): string | undefined {
  const s = spect.trim();
  if (/^(WN|WC|WO|WR)/.test(s)) return "W";
  const m = s.match(/^(sd|d|D|g)?\s*([OBAFGKMWLTYSC])/);
  return m ? m[2] : undefined;
}

const LUM_TOKENS = ["Ia0", "Ia+", "Iab", "Ib", "Ia", "III", "II", "IV", "VI", "V", "I"];
/** The luminosity class token (Ia, Ib, II, III, IV, V …) if present. */
export function luminosityClass(spect: string): string | undefined {
  // Look only after the temperature subclass to avoid false "I"/"V" matches.
  const after = spect.replace(/^(sd|d|D|g)?\s*[OBAFGKMWLTYSC][0-9.]*/, "");
  for (const t of LUM_TOKENS) if (after.includes(t)) return t;
  return undefined;
}

/** Classify a star's category from its (real) spectral type. */
export function classifyCategory(spect: string | undefined): StarCategory | undefined {
  if (!spect) return undefined;
  const s = spect.trim();
  if (/^(WN|WC|WO|WR)/.test(s)) return "wolf-rayet";
  if (/^D[ABOZQC]/.test(s) || /^D[0-9]/.test(s)) return "white-dwarf";
  const cls = spectralClass(s);
  if (!cls) return undefined;
  if (cls === "L" || cls === "T" || cls === "Y") return "brown-dwarf";
  const lum = luminosityClass(s);

  // Hypergiants — only the explicit extreme-luminosity classes (Ia+ / Ia0).
  // (A bare "0" in the type is a temperature subclass like B0, not luminosity.)
  if (s.includes("Ia+") || s.includes("Ia0")) return "hypergiant";

  const isCool = cls === "K" || cls === "M";
  const isHot = cls === "O" || cls === "B";

  if (lum === "Ia" || lum === "Iab" || lum === "Ib" || lum === "I") {
    if (isCool) return "red-supergiant";
    if (isHot) return "blue-supergiant";
    return undefined; // A/F/G supergiants have no matching category — stay honest
  }
  if (lum === "II" || lum === "III") {
    if (isCool) return "red-giant";
    if (isHot) return "blue-giant";
    return undefined;
  }
  if (lum === "IV") return "subgiant";

  // Main sequence (class V) or unspecified dwarf.
  if (cls === "M") return "red-dwarf";
  if (cls === "G") return "yellow-dwarf";
  return "main-sequence";
}

/* ----------------------------------------------------------- visibility */

export type Hemisphere = "northern" | "southern" | "equatorial";
export type Season = "Winter" | "Spring" | "Summer" | "Autumn";

/** Primary hemisphere a star favours, from its declination. */
export function hemisphereFor(dec: number | undefined): Hemisphere | undefined {
  if (dec == null) return undefined;
  if (dec > 15) return "northern";
  if (dec < -15) return "southern";
  return "equatorial";
}

/**
 * The season a star is best placed in the evening sky (Northern-Hemisphere
 * convention), from its right ascension. A standard approximation.
 */
export function seasonFor(ra: number | undefined): Season | undefined {
  if (ra == null) return undefined;
  const h = ((ra % 24) + 24) % 24;
  if (h >= 2 && h < 8) return "Winter";
  if (h >= 8 && h < 14) return "Spring";
  if (h >= 14 && h < 22) return "Summer";
  return "Autumn";
}
