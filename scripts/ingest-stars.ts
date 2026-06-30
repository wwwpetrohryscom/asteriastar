/**
 * Ingest real stars from the open HYG database (Hipparcos + Yale Bright Star +
 * Gliese), CC BY-SA 4.0. Selects a quality subset (naked-eye + named stars),
 * applies standard classification, and emits typed StarRecord shards. Every
 * value is real catalogue data; missing values are omitted, never invented.
 *
 * Usage: HYG_CSV=/path/to/hygdata_v41.csv npx tsx scripts/ingest-stars.ts
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { CONSTELLATIONS, constellationByAbbr } from "../src/knowledge-graph/data/star-catalog/constellations";
import { greekName, classifyCategory, spectralClass, luminosityClass } from "../src/knowledge-graph/data/star-catalog/classify";
import type { StarRecord } from "../src/knowledge-graph/data/star-catalog/types";

const CSV = process.env.HYG_CSV ?? "/private/tmp/claude-501/-Users-agent/61280a7f-3faf-47ba-b9c9-75bdbbd53ac9/scratchpad/hyg.csv";
const OUT_DIR = join(process.cwd(), "src/knowledge-graph/data/star-catalog/records");
const MAG_LIMIT = 5.5;

function parseCsvLine(line: string): string[] {
  const out: string[] = []; let cur = "", q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === "," && !q) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur); return out;
}

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const round = (n: number, d: number) => Math.round(n * 10 ** d) / 10 ** d;

// Existing hand-curated star ids (must not be duplicated).
function existingStarIds(): Set<string> {
  const dir = join(process.cwd(), "src/knowledge-graph");
  const ids = new Set<string>();
  const walk = (d: string) => {
    for (const f of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, f.name);
      if (f.isDirectory()) { if (!p.includes("star-catalog")) walk(p); }
      else if (f.name.endsWith(".ts")) {
        const txt = readFileSync(p, "utf8");
        for (const m of txt.matchAll(/id:\s*"(star:[a-z0-9-]+)"/g)) ids.add(m[1]);
      }
    }
  };
  walk(dir);
  return ids;
}

function main() {
  const lines = readFileSync(CSV, "utf8").split("\n");
  const header = parseCsvLine(lines[0]).map((h) => h.replace(/"/g, ""));
  const ix = Object.fromEntries(header.map((h, i) => [h, i])) as Record<string, number>;
  const existing = existingStarIds();

  const records: StarRecord[] = [];
  const usedSlugs = new Set<string>();
  let skippedCurated = 0;

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const r = parseCsvLine(lines[i]);
    const hygId = r[ix.id];
    if (hygId === "0") continue; // the Sun

    const proper = r[ix.proper]?.trim();
    const mag = r[ix.mag] !== "" ? +r[ix.mag] : undefined;
    if (!(proper || (mag != null && mag <= MAG_LIMIT))) continue;

    const conAbbr = r[ix.con]?.trim();
    const con = constellationByAbbr(conAbbr);
    if (!con) continue; // no recognised constellation → skip

    const hr = r[ix.hr]?.trim();
    const hd = r[ix.hd]?.trim();
    const hip = r[ix.hip]?.trim();
    const gl = r[ix.gl]?.trim();
    const bayerRaw = r[ix.bayer]?.trim();
    const flam = r[ix.flam]?.trim();
    const greek = bayerRaw ? greekName(bayerRaw) : undefined;

    // Display name + scientific (Bayer) designation.
    let name: string;
    let scientificName: string | undefined;
    if (greek) scientificName = `${greek} ${con.genitive}`;
    else if (flam) scientificName = `${flam} ${con.genitive}`;
    if (proper) name = proper;
    else if (scientificName) name = scientificName;
    else if (hr) name = `HR ${hr}`;
    else if (hd) name = `HD ${hd}`;
    else if (hip) name = `HIP ${hip}`;
    else continue; // anonymous → skip

    // Stable slug.
    let base: string;
    if (proper) base = slugify(proper);
    else if (greek) base = slugify(`${greek}-${con.slug}`);
    else if (flam) base = slugify(`${flam}-${con.slug}`);
    else if (hr) base = `hr-${hr}`;
    else if (hd) base = `hd-${hd}`;
    else base = `hip-${hip}`;

    let id = `star:${base}`;
    if (existing.has(id)) { skippedCurated++; continue; } // curated entity wins
    if (usedSlugs.has(base)) {
      base = `${base}-${hr || hd || hip || hygId}`;
      id = `star:${base}`;
      if (existing.has(id) || usedSlugs.has(base)) continue;
    }
    usedSlugs.add(base);

    const spect = r[ix.spect]?.trim() || undefined;
    const distPc = r[ix.dist] !== "" ? +r[ix.dist] : undefined;
    const validDist = distPc != null && distPc > 0 && distPc < 100000;
    const absmag = r[ix.absmag] !== "" ? +r[ix.absmag] : undefined;
    const lum = r[ix.lum] !== "" ? +r[ix.lum] : undefined;
    const ci = r[ix.ci] !== "" ? +r[ix.ci] : undefined;
    const ra = r[ix.ra] !== "" ? +r[ix.ra] : undefined;
    const dec = r[ix.dec] !== "" ? +r[ix.dec] : undefined;
    const varDes = r[ix.var]?.trim();
    const base_ = r[ix.base]?.trim();

    const ids: StarRecord["ids"] = {};
    if (hip) ids.hip = hip;
    if (hd) ids.hd = hd;
    if (hr) ids.hr = hr;
    if (gl) ids.gliese = gl;
    if (greek) ids.bayer = `${greek} ${con.abbr}`;
    if (flam) ids.flamsteed = `${flam} ${con.abbr}`;

    const rec: StarRecord = {
      id, slug: base, name,
      constellation: `constellation:${con.slug}`,
      constellationAbbr: con.abbr,
      ids,
      sources: ["hyg", "hipparcos"],
    };
    if (scientificName) rec.scientificName = scientificName;
    if (mag != null) rec.apparentMagnitude = round(mag, 2);
    if (absmag != null) rec.absoluteMagnitude = round(absmag, 2);
    if (validDist) {
      rec.distancePc = round(distPc as number, 2);
      rec.distanceLy = round((distPc as number) * 3.2615638, distPc! < 100 ? 2 : 1);
    }
    if (spect) {
      rec.spectralType = spect;
      const sc = spectralClass(spect); if (sc) rec.spectralClass = sc;
      const lc = luminosityClass(spect); if (lc) rec.luminosityClass = lc;
      const cat = classifyCategory(spect); if (cat) rec.category = cat;
    }
    if (lum != null && lum > 0) rec.luminositySolar = lum >= 100 ? Math.round(lum) : round(lum, 3);
    if (ci != null) rec.colorIndex = round(ci, 3);
    if (ra != null) rec.ra = round(ra, 4);
    if (dec != null) rec.dec = round(dec, 4);
    if (varDes) { rec.variable = true; rec.variableDesignation = varDes; }
    if (base_) { rec.multiple = true; rec.systemBase = base_; }

    records.push(rec);
  }

  // Stable order: by apparent magnitude (brightest first), then name.
  records.sort((a, b) => (a.apparentMagnitude ?? 99) - (b.apparentMagnitude ?? 99) || a.name.localeCompare(b.name));

  // Shard into chunks of 500.
  mkdirSync(OUT_DIR, { recursive: true });
  for (const f of readdirSync(OUT_DIR)) if (f.startsWith("chunk-")) writeFileSync(join(OUT_DIR, f), "");
  const CHUNK = 500;
  const chunkFiles: string[] = [];
  for (let c = 0; c * CHUNK < records.length; c++) {
    const slice = records.slice(c * CHUNK, (c + 1) * CHUNK);
    const name = `chunk-${String(c).padStart(2, "0")}`;
    const body = slice.map((rec) => "  " + JSON.stringify(rec)).join(",\n");
    const content =
      `import type { StarRecord } from "@/knowledge-graph/data/star-catalog/types";\n\n` +
      `// Generated from the HYG database (CC BY-SA 4.0). Do not edit by hand.\n` +
      `export const records: StarRecord[] = [\n${body},\n];\n`;
    writeFileSync(join(OUT_DIR, `${name}.ts`), content);
    chunkFiles.push(name);
  }

  // Constellations actually referenced (so we know which entities to create).
  const usedCons = new Set(records.map((r) => r.constellationAbbr));
  console.log(`Selected ${records.length} stars (skipped ${skippedCurated} that match curated entities).`);
  console.log(`Constellations referenced: ${usedCons.size} / ${CONSTELLATIONS.length}`);
  console.log(`Wrote ${chunkFiles.length} shard(s): ${chunkFiles.join(", ")}`);
  const withCat = records.filter((r) => r.category).length;
  const withDist = records.filter((r) => r.distanceLy != null).length;
  const variable = records.filter((r) => r.variable).length;
  console.log(`classified category: ${withCat} | with distance: ${withDist} | variable: ${variable}`);
}

main();
