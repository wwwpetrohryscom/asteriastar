import { engine } from "@/platform/data-engine";
import { formatHistYear } from "@/knowledge-graph/data/history-catalog/types";

/**
 * History discovery collections — curated reading lists over the History of
 * Astronomy knowledge graph. Each produces a uniform set of cards from real
 * entities via the engine; nothing is fabricated.
 */
export interface HistoryCard { slug: string; name: string; kind: string; meta?: string; href: string; }
export interface HistoryDiscovery { slug: string; title: string; description: string; cards: () => HistoryCard[]; }

const h = engine.history;

/** Build a uniform card from any routable history slug. */
function cardFor(slug: string): HistoryCard | null {
  const d = h.resolve(slug);
  if (!d) return null;
  const href = `/history/${slug}`;
  switch (d.kind) {
    case "astronomer": return { slug, name: d.record.name, kind: "Astronomer", meta: d.lifespan ?? d.record.nationality, href };
    case "discovery": return { slug, name: d.record.name, kind: "Discovery", meta: d.yearLabel, href };
    case "publication": return { slug, name: d.record.name, kind: "Publication", meta: d.yearLabel, href };
    case "theory": return { slug, name: d.record.name, kind: "Theory", meta: d.yearLabel, href };
    case "catalogue": return { slug, name: d.record.name, kind: "Catalogue", meta: d.yearLabel, href };
    case "era": return { slug, name: d.record.name, kind: "Era", meta: eraRange(d.record.startYear, d.record.endYear), href };
    case "event": return { slug, name: d.record.name, kind: "Event", meta: d.yearLabel, href };
    case "award": return { slug, name: d.record.name, kind: "Award", href };
  }
}
function eraRange(start?: number, end?: number): string | undefined {
  const s = formatHistYear(start); const e = end != null ? formatHistYear(end) : "present";
  return s ? `${s} – ${e}` : undefined;
}
function cards(slugs: string[]): HistoryCard[] {
  return slugs.map(cardFor).filter((c): c is HistoryCard => Boolean(c));
}

/** Aggregate the astronomers, discoveries, publications, and catalogues of one or more eras. */
function eraCards(...eraSlugs: string[]): HistoryCard[] {
  const out: HistoryCard[] = [];
  const seen = new Set<string>();
  const add = (slug: string) => { if (seen.has(slug)) return; seen.add(slug); const c = cardFor(slug); if (c) out.push(c); };
  for (const es of eraSlugs) {
    const m = h.membersOfEra(es);
    for (const a of m.astronomers.slice().sort((x, y) => (x.birthYear ?? 9e9) - (y.birthYear ?? 9e9))) add(a.slug);
    for (const d of m.discoveries) add(d.slug);
    for (const p of m.publications) add(p.slug);
    for (const c of m.catalogues.filter((c) => !c.existing)) add(c.slug);
  }
  return out;
}

export const HISTORY_DISCOVERIES: HistoryDiscovery[] = [
  { slug: "ancient-astronomy", title: "Ancient Astronomy", description: "The earliest astronomy — from Babylon, Egypt, Greece, China, India, and the Maya.", cards: () => eraCards("babylonian-astronomy", "egyptian-astronomy", "greek-astronomy", "roman-astronomy", "chinese-astronomy", "indian-astronomy", "mayan-astronomy") },
  { slug: "greek-astronomy", title: "Greek Astronomy", description: "The Greco-Roman thinkers who made astronomy a geometric science.", cards: () => eraCards("greek-astronomy", "roman-astronomy") },
  { slug: "islamic-astronomy", title: "Islamic Golden Age Astronomy", description: "The astronomers who preserved and transformed the science across the medieval Islamic world.", cards: () => eraCards("islamic-golden-age") },
  { slug: "renaissance-astronomy", title: "Renaissance Astronomy", description: "Copernicus, Tycho, and the reopening of the cosmos to bold reform.", cards: () => eraCards("renaissance-astronomy") },
  { slug: "modern-astronomy", title: "Modern Astronomy", description: "Spectroscopy, photography, and the discovery of galaxies and the expanding universe.", cards: () => eraCards("modern-astronomy") },
  { slug: "women-in-astronomy", title: "Women in Astronomy", description: "Astronomers whose work reshaped our understanding of the universe.", cards: () => h.women().map((a) => cardFor(a.slug)).filter((c): c is HistoryCard => Boolean(c)) },
  { slug: "astronomers-a-z", title: "Astronomers A–Z", description: "Every astronomer in the encyclopedia, alphabetically.", cards: () => h.astronomersAZ().map((a) => cardFor(a.slug)).filter((c): c is HistoryCard => Boolean(c)) },
  { slug: "scientific-discoveries", title: "Scientific Discoveries", description: "The great discoveries in the history of astronomy, in chronological order.", cards: () => h.discoveries().map((d) => cardFor(d.slug)).filter((c): c is HistoryCard => Boolean(c)) },
  { slug: "historic-publications", title: "Historic Publications", description: "The landmark books and treatises that changed astronomy.", cards: () => h.publications().map((p) => cardFor(p.slug)).filter((c): c is HistoryCard => Boolean(c)) },
  { slug: "history-of-telescopes", title: "History of Telescopes", description: "From the first spyglass to space observatories.", cards: () => cards(["invention-of-the-telescope", "galileo-galilei", "moons-of-jupiter", "isaac-newton", "william-herschel", "discovery-of-uranus", "jwst-first-images"]) },
  { slug: "history-of-observatories", title: "History of Observatories", description: "The great observatories, from Maragha and Samarkand to Greenwich and Paranal.", cards: () => cards(["nasir-al-din-al-tusi", "ulugh-beg", "zij-i-sultani", "tycho-brahe", "giovanni-cassini", "founding-of-greenwich-observatory", "edwin-hubble"]) },
  { slug: "history-of-space-exploration", title: "History of Space Exploration", description: "Discoveries of the space age, when astronomy left the atmosphere behind.", cards: () => cards(["cosmic-microwave-background", "pulsars", "quasars", "first-exoplanet-sunlike-star", "gravitational-waves", "jwst-first-images"]) },
  { slug: "history-of-cosmology", title: "History of Cosmology", description: "How we came to understand the origin, expansion, and contents of the universe.", cards: () => cards(["heliocentrism", "general-relativity", "expansion-of-the-universe", "big-bang-theory", "cosmic-microwave-background", "evidence-for-dark-matter", "accelerating-universe"]) },
  { slug: "history-of-exoplanets", title: "History of Exoplanets", description: "The discovery of worlds beyond the Solar System.", cards: () => cards(["first-exoplanet-sunlike-star", "michel-mayor", "didier-queloz"]) },
  { slug: "history-of-black-holes", title: "History of Black Holes", description: "From a theoretical prediction to the first image of a black hole.", cards: () => cards(["general-relativity", "subrahmanyan-chandrasekhar", "stephen-hawking", "galactic-center-black-hole", "reinhard-genzel", "andrea-ghez", "first-black-hole-image", "gravitational-waves"]) },
  { slug: "nobel-prize-astronomy", title: "Nobel Prize Laureates in Astronomy", description: "Astronomers in this encyclopedia honoured with the Nobel Prize in Physics.", cards: () => h.nobelLaureates().map((n): HistoryCard | null => { const c = cardFor(n.record.slug); return c ? { ...c, meta: n.year ? `Nobel Prize ${n.year}` : c.meta } : null; }).filter((c): c is HistoryCard => c !== null) },
];

const BY_SLUG = new Map(HISTORY_DISCOVERIES.map((d) => [d.slug, d]));
export function getHistoryDiscovery(slug: string): HistoryDiscovery | undefined {
  return BY_SLUG.get(slug);
}
