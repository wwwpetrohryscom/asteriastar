/**
 * Ingest confirmed exoplanets from the NASA Exoplanet Archive Planetary Systems
 * Composite Parameters table (pscomppars). Selects a quality subset, reuses
 * existing host-star entities where possible, classifies planets by radius, and
 * maps discovery facilities to existing mission/telescope entities. Real archive
 * values only — nothing inferred or synthesised.
 *
 * Usage: EXO_CSV=/path/to/nasa-exoplanets.csv npx tsx scripts/ingest-exoplanets.ts
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { entities } from "../src/knowledge-graph/entities";
import { DETECTION_METHODS } from "../src/knowledge-graph/data/exoplanet-catalog/types";
import type { ExoplanetRecord } from "../src/knowledge-graph/data/exoplanet-catalog/types";

const CSV = process.env.EXO_CSV ?? "/private/tmp/claude-501/-Users-agent/61280a7f-3faf-47ba-b9c9-75bdbbd53ac9/scratchpad/nasa-exoplanets.csv";
const OUT_DIR = join(process.cwd(), "src/knowledge-graph/data/exoplanet-catalog/records");
const TARGET = 720; // top-scored before adding system siblings

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const num = (s: string) => { const v = parseFloat(s); return Number.isFinite(v) && s.trim() !== "" ? v : undefined; };
const round = (n: number | undefined, d: number) => (n == null ? undefined : Math.round(n * 10 ** d) / 10 ** d);

function parseCSV(line: string): string[] {
  const out: string[] = []; let cur = "", q = false;
  for (const c of line) { if (c === '"') q = !q; else if (c === "," && !q) { out.push(cur); cur = ""; } else cur += c; }
  out.push(cur); return out;
}

// Existing star designations -> star id (for host reuse), and existing exoplanet slugs.
const STAR_BY_DESIG = new Map<string, string>();
const EXISTING_EXO = new Set<string>();
for (const e of entities) {
  if (e.type === "star") {
    const slug = e.id.slice(e.id.indexOf(":") + 1);
    for (const k of [e.name, slug, ...(e.aliases ?? []), ...(e.catalogNumbers ?? [])]) {
      if (k) { const n = norm(k); if (!STAR_BY_DESIG.has(n)) STAR_BY_DESIG.set(n, e.id); }
    }
  } else if (e.type === "exoplanet" && !e.entryPath?.startsWith("/exoplanets/")) {
    // Original exoplanet entities only — exclude this catalog's own (re-ingest idempotence).
    EXISTING_EXO.add(e.id.slice(e.id.indexOf(":") + 1));
  }
}

// Archive planet name (normalised) -> existing exoplanet slug (where slugs differ).
const EXO_ALIAS = new Map<string, string>(
  Object.entries({
    "Proxima Cen b": "proxima-centauri-b", "51 Peg b": "51-pegasi-b", "Kepler-22 b": "kepler-22b",
    "Kepler-186 f": "kepler-186f", "55 Cnc e": "55-cancri-e", "GJ 581 c": "gliese-581c",
  }).map(([k, v]) => [norm(k), v]),
);

// Abbreviated archive host names (normalised) -> existing star id, for famous
// stars whose Bayer/proper abbreviation does not match a catalogue designation.
const HOST_ALIAS = new Map<string, string>(
  Object.entries({
    "Proxima Cen": "star:proxima-centauri", "51 Peg": "star:51-pegasi", "tau Cet": "star:tau-ceti",
    "GJ 581": "star:gliese-581", "55 Cnc": "star:55-cancri",
  }).map(([k, v]) => [norm(k), v]),
);

// Discovery facility substring -> existing entity id.
const FACILITY_MAP: [RegExp, string][] = [
  [/transiting exoplanet survey satellite|TESS/i, "space_telescope:tess"],
  [/Kepler|K2/i, "space_telescope:kepler-space-telescope"],
  [/Hubble/i, "space_telescope:hubble-space-telescope"],
  [/Spitzer/i, "space_telescope:spitzer-space-telescope"],
  [/James Webb|JWST/i, "space_telescope:james-webb-space-telescope"],
  [/Gaia/i, "space_telescope:gaia"],
  [/W\. M\. Keck|Keck/i, "observatory:keck-observatory"],
  [/La Silla|HARPS/i, "observatory:la-silla-observatory"],
  [/Paranal|Very Large Telescope/i, "observatory:very-large-telescope"],
  [/Subaru/i, "telescope:subaru"],
  [/Gemini/i, "observatory:gemini-observatory"],
  [/Roque de los Muchachos|Gran Telescopio/i, "observatory:roque-de-los-muchachos"],
];

// Famous planets (normalised pl_name) — always included.
const FAMOUS = new Set([
  "proxima cen b", "51 peg b", "hd 209458 b", "wasp-12 b", "k2-18 b", "gj 1214 b", "gj 436 b",
  "hr 8799 b", "hr 8799 c", "hr 8799 d", "hr 8799 e", "beta pic b", "beta pic c", "55 cnc e",
  "kepler-186 f", "kepler-22 b", "kepler-452 b", "kepler-442 b", "kepler-16 b", "kepler-1649 c",
  "toi-700 d", "gj 357 d", "lhs 1140 b", "wasp-39 b", "wasp-121 b", "hd 189733 b", "pds 70 b",
  "pds 70 c", "fomalhaut b", "ross 128 b", "tau cet e", "tau cet f", "hd 40307 g", "wasp-43 b",
  "wasp-96 b", "wasp-76 b", "wasp-17 b", "kelt-9 b", "gj 1132 b", "lp 890-9 c", "trappist-1 e",
].map((x) => norm(x)));

// Source-backed potentially-habitable-zone candidates (final slug).
const HZ = new Set([
  "proxima-centauri-b", "trappist-1-d", "trappist-1-e", "trappist-1-f", "trappist-1-g",
  "kepler-186f", "kepler-442-b", "kepler-452-b", "kepler-1649-c", "k2-18-b", "toi-700-d",
  "gj-357-d", "lhs-1140-b", "ross-128-b", "wolf-1061-c", "gj-667-c-c", "teegarden-s-star-b",
  "teegarden-s-star-c", "gliese-581c", "gj-1002-b", "gj-1002-c",
]);

function classOf(rEarth: number | undefined, periodDays: number | undefined): string | undefined {
  if (rEarth == null) return undefined;
  if (rEarth >= 5.5) return periodDays != null && periodDays < 10 ? "hot-jupiter" : "gas-giant";
  if (rEarth >= 2.4) return "mini-neptune";
  if (rEarth >= 1.6) return "super-earth";
  return "terrestrial";
}

function main() {
  const lines = readFileSync(CSV, "utf8").trim().split("\n");
  const hdr = parseCSV(lines[0]);
  const ix = Object.fromEntries(hdr.map((h, i) => [h, i])) as Record<string, number>;
  const rows = lines.slice(1).map(parseCSV);

  type Raw = { r: string[]; name: string; nname: string; host: string; pnum: number; method: string; year?: number; dist?: number; rade?: number; score: number };
  const raws: Raw[] = rows.map((r) => {
    const name = r[ix.pl_name];
    const nname = norm(name);
    const method = r[ix.discoverymethod] ?? "";
    const year = num(r[ix.disc_year]);
    const dist = num(r[ix.sy_dist]);
    const rade = num(r[ix.pl_rade]);
    const pnum = num(r[ix.sy_pnum]) ?? 1;
    const facMapped = FACILITY_MAP.some(([re]) => re.test(r[ix.disc_facility] ?? ""));
    const hostExisting = STAR_BY_DESIG.has(norm(r[ix.hostname])) || HOST_ALIAS.has(norm(r[ix.hostname]));
    const slug = EXO_ALIAS.get(nname) ?? slugify(name);
    let score = 0;
    if (FAMOUS.has(nname)) score += 1000;
    if (HZ.has(slug)) score += 250;
    if (hostExisting) score += 60;
    if (/Imaging/i.test(method)) score += 80;
    if (dist != null && dist < 15) score += 55; else if (dist != null && dist < 30) score += 28;
    if (pnum >= 4) score += 42; else if (pnum === 3) score += 22; else if (pnum === 2) score += 9;
    if (/Radial Velocity/i.test(method)) score += 12;
    // Ensure every detection method is represented (rare methods score low otherwise).
    if (/Microlensing/i.test(method)) score += 35;
    if (/Pulsar Timing/i.test(method)) score += 60;
    if (/Eclipse Timing|Astrometry|Transit Timing/i.test(method)) score += 30;
    if (facMapped) score += 10;
    if (rade != null && num(r[ix.pl_bmasse]) != null && num(r[ix.pl_orbper]) != null && num(r[ix.pl_eqt]) != null) score += 15;
    if (year != null && year <= 2012) score += 10;
    return { r, name, nname, host: r[ix.hostname], pnum, method, year, dist, rade, score };
  });

  // Top-scored selection, then complete every selected multi-planet system.
  raws.sort((a, b) => b.score - a.score);
  const selectedHosts = new Set<string>();
  const chosen = new Set<Raw>();
  for (const x of raws.slice(0, TARGET)) { chosen.add(x); selectedHosts.add(x.host); }
  // Guarantee each detection method is represented (raws already sorted by score).
  for (const m of DETECTION_METHODS) {
    const want = 8;
    let have = [...chosen].filter((x) => m.archiveNames.includes(x.method)).length;
    if (have >= want) continue;
    for (const x of raws) { if (have >= want) break; if (m.archiveNames.includes(x.method) && !chosen.has(x)) { chosen.add(x); selectedHosts.add(x.host); have++; } }
  }
  for (const x of raws) if (selectedHosts.has(x.host)) chosen.add(x);

  const records: ExoplanetRecord[] = [];
  const usedSlugs = new Set<string>();
  for (const x of [...chosen].sort((a, b) => a.host.localeCompare(b.host) || a.name.localeCompare(b.name))) {
    const r = x.r;
    const slug = EXO_ALIAS.get(x.nname) ?? slugify(x.name);
    if (usedSlugs.has(slug)) continue;
    usedSlugs.add(slug);
    const existing = EXISTING_EXO.has(slug);
    // Binary/multiple-star components (e.g. "55 Cnc B", "TOI-2267 A") slugify the
    // same as planet designations ("55 Cnc b"); suffix host slugs to disambiguate.
    const hostSlug = slugify(x.host) + (/\s[A-Z]$/.test(x.host) ? "-star" : "");
    const hostExistingId = STAR_BY_DESIG.get(norm(x.host)) ?? HOST_ALIAS.get(norm(x.host));
    const facility = r[ix.disc_facility];
    const facilityId = FACILITY_MAP.find(([re]) => re.test(facility ?? ""))?.[1];
    const method = DETECTION_METHODS.find((m) => m.archiveNames.some((a) => a === x.method));
    const rade = round(num(r[ix.pl_rade]), 2);
    const rec: ExoplanetRecord = {
      id: `exoplanet:${slug}`, slug, name: x.name, existing,
      hostName: x.host, hostSlug, hostId: hostExistingId ?? `host_star:${hostSlug}`, hostExisting: Boolean(hostExistingId),
      hostSpectralType: r[ix.st_spectype]?.trim() || undefined,
      hostTeffK: round(num(r[ix.st_teff]), 0), hostRadiusSolar: round(num(r[ix.st_rad]), 3),
      hostMassSolar: round(num(r[ix.st_mass]), 3), hostMetallicity: round(num(r[ix.st_met]), 3),
      hostDistancePc: round(num(r[ix.sy_dist]), 2), systemPlanetCount: x.pnum,
      discoveryMethod: x.method || undefined, discoveryYear: x.year, discoveryFacility: facility?.trim() || undefined,
      facilityId, methodSlug: method?.slug,
      orbitalPeriodDays: round(num(r[ix.pl_orbper]), 4), semiMajorAxisAu: round(num(r[ix.pl_orbsmax]), 4),
      eccentricity: round(num(r[ix.pl_orbeccen]), 3), radiusEarth: rade, massEarth: round(num(r[ix.pl_bmasse]), 2),
      eqTempK: round(num(r[ix.pl_eqt]), 0), insolationFlux: round(num(r[ix.pl_insol]), 2),
      raDeg: round(num(r[ix.ra]), 4), decDeg: round(num(r[ix.dec]), 4),
      classSlug: classOf(rade, num(r[ix.pl_orbper])), habitableCandidate: HZ.has(slug) || undefined,
      sources: ["nasa"],
    };
    records.push(rec);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  for (const f of readdirSync(OUT_DIR)) if (f.startsWith("chunk-")) writeFileSync(join(OUT_DIR, f), "");
  const CHUNK = 350;
  const chunks: string[] = [];
  for (let c = 0; c * CHUNK < records.length; c++) {
    const slice = records.slice(c * CHUNK, (c + 1) * CHUNK);
    const name = `chunk-${String(c).padStart(2, "0")}`;
    writeFileSync(join(OUT_DIR, `${name}.ts`),
      `import type { ExoplanetRecord } from "@/knowledge-graph/data/exoplanet-catalog/types";\n\n` +
      `// Generated from the NASA Exoplanet Archive (pscomppars). Do not edit by hand.\n` +
      `export const records: ExoplanetRecord[] = [\n${slice.map((r) => "  " + JSON.stringify(r)).join(",\n")},\n];\n`);
    chunks.push(name);
  }

  const newHosts = new Set(records.filter((r) => !r.hostExisting).map((r) => r.hostSlug)).size;
  const reuseHosts = new Set(records.filter((r) => r.hostExisting).map((r) => r.hostId)).size;
  const byClass: Record<string, number> = {};
  for (const r of records) if (r.classSlug) byClass[r.classSlug] = (byClass[r.classSlug] ?? 0) + 1;
  console.log(`Selected ${records.length} exoplanets (${records.filter((r) => !r.existing).length} new, ${records.filter((r) => r.existing).length} enrich).`);
  console.log(`Hosts: ${reuseHosts} reused existing stars, ${newHosts} new host_star entities.`);
  console.log(`HZ candidates: ${records.filter((r) => r.habitableCandidate).length} | facility-mapped: ${records.filter((r) => r.facilityId).length}`);
  console.log(`By class: ${JSON.stringify(byClass)}`);
  console.log(`Wrote ${chunks.length} shard(s).`);
}

main();
