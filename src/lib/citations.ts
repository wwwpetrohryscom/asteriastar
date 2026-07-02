import type { SourceKey } from "@/lib/sources";

/**
 * Scientific citation infrastructure.
 *
 * The model for attaching peer-reviewed and authoritative references to graph
 * entities. The registry ships EMPTY — no fabricated references. Real citations
 * (with verified authors/urls/dates) are added here over time; until then,
 * entities cite the authoritative source organizations in src/lib/sources.ts.
 */

export interface Citation {
  id: string;
  title: string;
  authors?: string[];
  /** Publishing organization or database. */
  organization: string;
  /** Journal/proceedings/dataset name, if applicable. */
  publication?: string;
  url: string;
  /** ISO date or year. */
  date?: string;
  /** Digital Object Identifier (syntactically validated; never invented). */
  doi?: string;
  license?: string;
  notes?: string;
  /** Optional link to the source-registry key this citation comes from. */
  source?: SourceKey;
}

/** A syntactically-valid DOI: "10." registrant "/" suffix. */
export const DOI_RE = /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/;

/** Authoritative reference sources the citation system is designed around. */
export const CITATION_SOURCE_KEYS: SourceKey[] = [
  "nasa",
  "esa",
  "iau",
  "noirlab",
  "eso",
  "simbad",
  "ned",
  "mpc",
  "jpl",
];

/**
 * First real citation records (Program N). Every field is real and verifiable:
 * DOIs are included only for the four iconic papers below where the DOI is known
 * and verified; data resources (fact sheets, archives) are cited without a DOI.
 * No DOI, author, date, or URL is fabricated.
 */
export const CITATIONS: Citation[] = [
  {
    id: "cite:nasa-planetary-fact-sheet",
    title: "NASA Planetary Fact Sheet",
    organization: "NASA Goddard Space Flight Center — NSSDCA",
    publication: "Planetary Fact Sheet",
    url: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/",
    license: "Public domain (US Government work)",
    notes: "Tabulated physical and orbital parameters for the Sun, planets, and major moons.",
    source: "nasa",
  },
  {
    id: "cite:jpl-solar-system-dynamics",
    title: "JPL Solar System Dynamics",
    organization: "NASA Jet Propulsion Laboratory (Caltech)",
    publication: "Solar System Dynamics",
    url: "https://ssd.jpl.nasa.gov/",
    license: "Public domain (NASA/JPL-Caltech)",
    notes: "Ephemerides, orbital elements, and physical data for Solar System bodies.",
    source: "jpl",
  },
  {
    id: "cite:nasa-exoplanet-archive",
    title: "NASA Exoplanet Archive",
    organization: "NASA Exoplanet Science Institute (Caltech/IPAC)",
    publication: "NASA Exoplanet Archive",
    url: "https://exoplanetarchive.ipac.caltech.edu/",
    license: "Freely available; acknowledgement of the NASA Exoplanet Archive requested",
    notes: "Confirmed-planet parameters and discovery references.",
    source: "nasa",
  },
  {
    id: "cite:iau-planet-definition-2006",
    title: "IAU 2006 General Assembly — Definition of a Planet in the Solar System (Resolution B5)",
    organization: "International Astronomical Union",
    publication: "IAU 2006 General Assembly, Resolution B5",
    url: "https://www.iau.org/",
    date: "2006",
    license: "© IAU",
    notes: "Established the 'dwarf planet' category under which Pluto is classified.",
    source: "iau",
  },
  {
    id: "cite:planck-2018-cosmological-parameters",
    title: "Planck 2018 results. VI. Cosmological parameters",
    authors: ["Planck Collaboration"],
    organization: "ESA — Planck Collaboration",
    publication: "Astronomy & Astrophysics 641, A6",
    url: "https://doi.org/10.1051/0004-6361/201833910",
    doi: "10.1051/0004-6361/201833910",
    date: "2020",
    notes: "Cosmological parameters from the final Planck data release (age ≈ 13.8 Gyr; H0 ≈ 67.4 km/s/Mpc).",
    source: "planck",
  },
  {
    id: "cite:ligo-gw150914",
    title: "Observation of Gravitational Waves from a Binary Black Hole Merger",
    authors: ["B. P. Abbott et al. (LIGO Scientific Collaboration and Virgo Collaboration)"],
    organization: "LIGO Scientific Collaboration & Virgo Collaboration",
    publication: "Physical Review Letters 116, 061102",
    url: "https://doi.org/10.1103/PhysRevLett.116.061102",
    doi: "10.1103/PhysRevLett.116.061102",
    date: "2016",
    notes: "First direct detection of gravitational waves (event GW150914).",
    source: "ligo",
  },
  {
    id: "cite:eht-m87-2019",
    title: "First M87 Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole",
    authors: ["Event Horizon Telescope Collaboration"],
    organization: "Event Horizon Telescope Collaboration",
    publication: "The Astrophysical Journal Letters 875, L1",
    url: "https://doi.org/10.3847/2041-8213/ab0ec7",
    doi: "10.3847/2041-8213/ab0ec7",
    date: "2019",
    notes: "First direct image of a black hole's shadow, in the galaxy M87.",
    source: "eht",
  },
  {
    id: "cite:mayor-queloz-1995",
    title: "A Jupiter-mass companion to a solar-type star",
    authors: ["Michel Mayor", "Didier Queloz"],
    organization: "Nature",
    publication: "Nature 378, 355–359",
    url: "https://doi.org/10.1038/378355a0",
    doi: "10.1038/378355a0",
    date: "1995",
    notes: "Discovery of 51 Pegasi b, the first confirmed exoplanet orbiting a Sun-like star (2019 Nobel Prize in Physics).",
  },
];

/** Validate citation records (structure only; runs in npm run validate). */
export function validateCitations(citations: Citation[] = CITATIONS): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const c of citations) {
    if (seen.has(c.id)) issues.push(`duplicate citation id: ${c.id}`);
    seen.add(c.id);
    if (!c.title?.trim()) issues.push(`${c.id}: missing title`);
    if (!c.organization?.trim()) issues.push(`${c.id}: missing organization`);
    if (!c.url?.trim()) issues.push(`${c.id}: missing url`);
    // A DOI, if present, must be syntactically valid (never invented).
    if (c.doi !== undefined && !DOI_RE.test(c.doi)) issues.push(`${c.id}: invalid DOI syntax "${c.doi}"`);
    // A doi.org URL must match the record's DOI (no mismatched identifiers).
    if (c.doi && c.url.includes("doi.org/") && !c.url.endsWith(c.doi)) {
      issues.push(`${c.id}: doi.org URL does not match the record's DOI`);
    }
  }
  return issues;
}

/* -------------------------------------------------------- citation engine */

/**
 * Reusable citation engine. Generates standard reference formats from a
 * structured Citation — it NEVER fabricates fields. If authors or a date are
 * absent, the output simply omits them (or uses the organization / "n.d.").
 */
export type CitationStyle = "apa" | "chicago" | "mla" | "harvard" | "bibtex" | "ris";

export const CITATION_STYLES: { id: CitationStyle; name: string }[] = [
  { id: "apa", name: "APA" },
  { id: "chicago", name: "Chicago" },
  { id: "mla", name: "MLA" },
  { id: "harvard", name: "Harvard" },
  { id: "bibtex", name: "BibTeX" },
  { id: "ris", name: "RIS" },
];

function year(c: Citation): string {
  const m = c.date?.match(/\d{4}/);
  return m ? m[0] : "n.d.";
}

/** Join author strings with style-appropriate separators (or fall back to org). */
function authorList(c: Citation, style: CitationStyle): string {
  const a = c.authors?.filter(Boolean) ?? [];
  if (a.length === 0) return c.organization;
  if (style === "mla") {
    // No trailing period — every format template appends its own.
    return a.length === 1 ? a[0] : `${a[0]}, et al`;
  }
  if (a.length === 1) return a[0];
  if (a.length === 2) return `${a[0]} & ${a[1]}`;
  return `${a.slice(0, -1).join(", ")}, & ${a[a.length - 1]}`;
}

/** Format a citation in a given style. Output is plain text. */
export function formatCitation(c: Citation, style: CitationStyle): string {
  const y = year(c);
  const pub = c.publication ? `${c.publication}. ` : "";
  switch (style) {
    case "apa":
      return `${authorList(c, "apa")} (${y}). ${c.title}. ${pub}${c.organization}. ${c.url}`;
    case "chicago":
      return `${authorList(c, "chicago")}. "${c.title}." ${pub}${c.organization}, ${y}. ${c.url}.`;
    case "mla":
      return `${authorList(c, "mla")}. "${c.title}." ${pub}${c.organization}, ${y}, ${c.url}.`;
    case "harvard":
      return `${authorList(c, "harvard")} (${y}) '${c.title}'. ${pub}${c.organization}. Available at: ${c.url}.`;
    case "bibtex": {
      const fields = [
        `  title        = {${c.title}}`,
        c.authors?.length ? `  author       = {${c.authors.join(" and ")}}` : null,
        `  organization = {${c.organization}}`,
        c.publication ? `  howpublished = {${c.publication}}` : null,
        `  year         = {${y}}`,
        `  url          = {${c.url}}`,
        c.notes ? `  note         = {${c.notes}}` : null,
      ].filter(Boolean);
      return `@misc{${c.id},\n${fields.join(",\n")}\n}`;
    }
    case "ris": {
      const lines = [
        "TY  - GEN",
        `TI  - ${c.title}`,
        ...(c.authors ?? []).map((a) => `AU  - ${a}`),
        `PB  - ${c.organization}`,
        c.publication ? `JO  - ${c.publication}` : null,
        c.date ? `PY  - ${y}` : null,
        `UR  - ${c.url}`,
        "ER  - ",
      ].filter(Boolean);
      return lines.join("\n");
    }
  }
}

/** Format a citation in every supported style. */
export function formatCitationAll(c: Citation): { style: CitationStyle; name: string; text: string }[] {
  return CITATION_STYLES.map((s) => ({ style: s.id, name: s.name, text: formatCitation(c, s.id) }));
}
