import type { StarCategory } from "@/knowledge-graph/data/star-catalog/types";

/**
 * Real, general science about stellar classes and categories — used to give
 * every star page a substantial, accurate Scientific Overview and Evolution
 * section. These describe the TYPE (a definition), not invented per-star claims.
 */

export const SPECTRAL_CLASS_INFO: Record<string, { label: string; color: string; tempK: string; blurb: string }> = {
  O: { label: "Class O", color: "blue", tempK: "≥ 30,000 K", blurb: "Extremely hot, luminous blue stars. They are massive, short-lived, and rare, pouring out ultraviolet light." },
  B: { label: "Class B", color: "blue-white", tempK: "10,000–30,000 K", blurb: "Hot, blue-white stars. Massive and luminous, they often light up the regions where they form." },
  A: { label: "Class A", color: "white", tempK: "7,500–10,000 K", blurb: "White stars with strong hydrogen lines. Many of the brightest stars in the sky are class A." },
  F: { label: "Class F", color: "yellow-white", tempK: "6,000–7,500 K", blurb: "Yellow-white stars, somewhat hotter and more massive than the Sun." },
  G: { label: "Class G", color: "yellow", tempK: "5,200–6,000 K", blurb: "Yellow stars like the Sun. On the main sequence they steadily fuse hydrogen into helium." },
  K: { label: "Class K", color: "orange", tempK: "3,700–5,200 K", blurb: "Cooler orange stars. Long-lived and abundant; many are stable hosts for planets." },
  M: { label: "Class M", color: "red", tempK: "2,400–3,700 K", blurb: "Cool red stars. The most common type in the galaxy, ranging from red dwarfs to red giants." },
  W: { label: "Wolf-Rayet", color: "blue", tempK: "≥ 30,000 K", blurb: "Evolved, massive stars shedding their outer layers in powerful stellar winds." },
  D: { label: "White dwarf", color: "white", tempK: "varies", blurb: "The dense, Earth-sized remnant of a Sun-like star, slowly cooling over billions of years." },
  L: { label: "Class L", color: "red", tempK: "1,300–2,400 K", blurb: "Very cool, dim objects on the boundary between the smallest stars and brown dwarfs." },
  T: { label: "Class T", color: "magenta", tempK: "600–1,300 K", blurb: "Cool brown dwarfs with methane in their atmospheres." },
  C: { label: "Class C (carbon star)", color: "deep red", tempK: "≤ 3,200 K", blurb: "Cool carbon stars — evolved red giants whose atmospheres hold more carbon than oxygen, giving them a striking deep-red, ruby colour." },
  S: { label: "Class S", color: "red", tempK: "≤ 3,500 K", blurb: "Cool giant stars intermediate between class M and the carbon stars, showing zirconium-oxide bands in their spectra." },
};

export const CATEGORY_INFO: Partial<Record<StarCategory, string>> = {
  "main-sequence": "A main-sequence star fuses hydrogen into helium in its core. It will remain on the main sequence for most of its life before evolving into a giant.",
  "red-dwarf": "A red dwarf is a small, cool, low-mass main-sequence star. Red dwarfs burn their fuel so slowly that they can shine for tens of billions of years — far longer than the present age of the universe.",
  "yellow-dwarf": "A yellow dwarf is a G-type main-sequence star like the Sun. After about ten billion years it will swell into a red giant and finally leave behind a white dwarf.",
  "white-dwarf": "A white dwarf is the hot, dense core left when a Sun-like star sheds its outer layers. No longer fusing, it cools and fades over billions of years.",
  "blue-giant": "A blue giant is a hot, massive, highly luminous star that has evolved off the main sequence. Such stars are short-lived on cosmic timescales.",
  "blue-supergiant": "A blue supergiant is among the most luminous stars known — enormous, hot, and massive. Many end their lives as supernovae.",
  "red-giant": "A red giant is an evolved star that has exhausted core hydrogen and expanded enormously, cooling at its surface as it fuses heavier elements in shells.",
  "red-supergiant": "A red supergiant is a colossal, cool, luminous evolved star. The largest known stars are red supergiants, and many end as supernovae.",
  hypergiant: "A hypergiant is an exceptionally massive and luminous star, losing mass at a tremendous rate. Hypergiants are extraordinarily rare and short-lived.",
  "wolf-rayet": "A Wolf-Rayet star is a hot, evolved, massive star driving away its outer layers in fierce stellar winds, often a prelude to a supernova.",
  subgiant: "A subgiant has begun to evolve off the main sequence, brightening and expanding as core hydrogen fusion ends.",
  "brown-dwarf": "A brown dwarf is a substellar object — too small to sustain hydrogen fusion, bridging the gap between the largest planets and the smallest stars.",
};

export function spectralInfo(spectralClass: string | undefined) {
  return spectralClass ? SPECTRAL_CLASS_INFO[spectralClass] : undefined;
}
