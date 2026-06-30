/**
 * Ingest deep-sky objects from the open OpenNGC database (NGC/IC + Messier +
 * Caldwell), CC BY-SA 4.0. Selects a quality subset (Messier, Caldwell, and
 * bright NGC/IC), classifies them, extracts catalogue identifiers, and maps each
 * to an existing graph entity id (enrich) or a new one. Real values only.
 *
 * Usage: NGC_CSV=/path/to/NGC.csv npx tsx scripts/ingest-deep-sky.ts
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { entities as ALL_ENTITIES } from "../src/knowledge-graph/entities";
import { constellationId, constellationByAbbr } from "../src/knowledge-graph/data/star-catalog/constellations";
import { TYPE_MAP, galaxyTypeFromHubble, difficultyFromMag } from "../src/knowledge-graph/data/deep-sky-catalog/classify";
import type { DeepSkyRecord } from "../src/knowledge-graph/data/deep-sky-catalog/types";

const CSV = process.env.NGC_CSV ?? "/private/tmp/claude-501/-Users-agent/61280a7f-3faf-47ba-b9c9-75bdbbd53ac9/scratchpad/ngc.csv";
const OUT_DIR = join(process.cwd(), "src/knowledge-graph/data/deep-sky-catalog/records");
const MAG_LIMIT = 10;

const round = (n: number, d: number) => Math.round(n * 10 ** d) / 10 ** d;
/** Normalise a designation so "NGC 5139", "ngc-5139", "Omega Centauri" compare. */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Map every designation (slug, name, alias, catalogue number) of an existing
 * deep-sky graph entity to its id, so a catalogue row enriches the right entity
 * even when the existing entity is keyed by name (e.g. star_cluster:omega-centauri
 * carries alias "NGC 5139") rather than by the catalogue id we would assign.
 * Our own OpenNGC-sourced records are excluded so re-ingest stays idempotent.
 */
function existingDesignationMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const e of ALL_ENTITIES) {
    if (e.sources?.includes("openngc")) continue;
    if (!["galaxy", "nebula", "star_cluster"].includes(e.type)) continue;
    const slug = e.id.slice(e.id.indexOf(":") + 1);
    for (const key of [slug, e.name, ...(e.aliases ?? []), ...(e.catalogNumbers ?? [])]) {
      const n = key && norm(key);
      if (n && !map.has(n)) map.set(n, e.id);
    }
  }
  return map;
}

function raToHours(ra: string): number | undefined {
  const m = ra.match(/^(\d+):(\d+):([\d.]+)$/);
  if (!m) return undefined;
  return round(+m[1] + +m[2] / 60 + +m[3] / 3600, 4);
}
function decToDeg(dec: string): number | undefined {
  const m = dec.match(/^([+-]?)(\d+):(\d+):([\d.]+)$/);
  if (!m) return undefined;
  const sign = m[1] === "-" ? -1 : 1;
  return round(sign * (+m[2] + +m[3] / 60 + +m[4] / 3600), 4);
}

function main() {
  const lines = readFileSync(CSV, "utf8").trim().split("\n");
  const hdr = lines[0].split(";");
  const ix = Object.fromEntries(hdr.map((h, i) => [h, i])) as Record<string, number>;
  const existing = existingDesignationMap();
  const existingFullIds = new Set(
    ALL_ENTITIES.filter((e) => !e.sources?.includes("openngc") && ["galaxy", "nebula", "star_cluster"].includes(e.type)).map((e) => e.id),
  );

  const records: DeepSkyRecord[] = [];
  const usedSlugs = new Set<string>();
  const claimedExistingIds = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const r = lines[i].split(";");
    const code = r[ix.Type];
    const map = TYPE_MAP[code];
    if (!map) continue;

    const v = r[ix["V-Mag"]] !== "" ? +r[ix["V-Mag"]] : r[ix["B-Mag"]] !== "" ? +r[ix["B-Mag"]] : undefined;
    const M = r[ix.M]?.trim();
    const identifiers = r[ix.Identifiers] ?? "";
    const caldM = identifiers.match(/(?:^|,)\s*C\s?(\d+)/);
    const common = r[ix["Common names"]]?.split(",")[0]?.trim();
    // Selection: bright OR Messier OR Caldwell OR has a common name.
    if (!((v != null && v <= MAG_LIMIT) || M || caldM || common)) continue;

    let conAbbr = r[ix.Const]?.trim();
    // OpenNGC splits Serpens into Se1/Se2 (Caput/Cauda); the IAU abbreviation is Ser.
    if (conAbbr === "Se1" || conAbbr === "Se2" || conAbbr === "Ser1" || conAbbr === "Ser2") conAbbr = "Ser";
    const con = constellationByAbbr(conAbbr);
    const conId = con ? constellationId(conAbbr) : undefined;
    if (!conId) continue;

    const name = r[ix.Name];
    const ngcM = name.match(/^NGC(\d+)([A-Z]?)$/);
    const icM = name.match(/^IC(\d+)([A-Z]?)$/);

    const ids: DeepSkyRecord["ids"] = {};
    if (M) ids.messier = `M ${parseInt(M, 10)}`;
    if (ngcM) ids.ngc = `NGC ${parseInt(ngcM[1], 10)}${ngcM[2]}`;
    if (icM) ids.ic = `IC ${parseInt(icM[1], 10)}${icM[2]}`;
    if (caldM) ids.caldwell = `C ${parseInt(caldM[1], 10)}`;
    const pgcM = identifiers.match(/(?:^|,)\s*PGC\s?(\d+)/);
    if (pgcM) ids.pgc = `PGC ${parseInt(pgcM[1], 10)}`;
    const ugcM = identifiers.match(/(?:^|,)\s*UGC\s?(\d+)/);
    if (ugcM) ids.ugc = `UGC ${parseInt(ugcM[1], 10)}`;
    if (common) ids.common = common;

    // Slug: prefer Messier, then NGC, then IC — matching existing graph ids.
    let slug: string;
    if (M) slug = `messier-${parseInt(M, 10)}`;
    else if (ngcM) slug = `ngc-${parseInt(ngcM[1], 10)}${ngcM[2] ? ngcM[2].toLowerCase() : ""}`;
    else if (icM) slug = `ic-${parseInt(icM[1], 10)}${icM[2] ? icM[2].toLowerCase() : ""}`;
    else continue;

    // Match an existing entity by its designations so we enrich rather than
    // duplicate. Globally-unique catalogue ids and the slug come first; the
    // (non-unique) common name is a last resort. A given existing entity may be
    // claimed only once — a second row falls back to its own new id.
    const candidates = [ids.messier, ids.ngc, ids.ic, ids.caldwell, slug, ids.common].filter(Boolean) as string[];
    let existingId: string | undefined;
    for (const c of candidates) {
      const hit = existing.get(norm(c));
      if (hit && !claimedExistingIds.has(hit)) { existingId = hit; break; }
    }
    let id = existingId ?? `${map.entity}:${slug}`;
    // If the fallback id is itself a curated entity, this is an enrichment too.
    if (!existingId && existingFullIds.has(id) && !claimedExistingIds.has(id)) existingId = id;
    id = existingId ?? `${map.entity}:${slug}`;
    if (existingId) claimedExistingIds.add(existingId);
    if (!existingId && usedSlugs.has(slug)) continue;
    usedSlugs.add(slug);

    const displayName = common || ids.messier || ids.ngc || ids.ic || slug;
    const major = r[ix.MajAx] !== "" ? +r[ix.MajAx] : undefined;
    const minor = r[ix.MinAx] !== "" ? +r[ix.MinAx] : undefined;

    const rec: DeepSkyRecord = {
      id, slug, name: displayName,
      type: map.type,
      entityType: existingId ? (existingId.slice(0, existingId.indexOf(":")) as DeepSkyRecord["entityType"]) : map.entity,
      constellation: conId,
      constellationAbbr: conAbbr,
      ids,
      sources: ["openngc"],
      existing: Boolean(existingId),
    };
    if (v != null) rec.apparentMagnitude = round(v, 2);
    if (major != null) rec.sizeMajorArcmin = round(major, 2);
    if (minor != null) rec.sizeMinorArcmin = round(minor, 2);
    const ra = raToHours(r[ix.RA] ?? ""); if (ra != null) rec.raHours = ra;
    const dec = decToDeg(r[ix.Dec] ?? ""); if (dec != null) rec.decDeg = dec;
    const hubble = r[ix.Hubble]?.trim();
    if (hubble) rec.hubbleType = hubble;
    if (map.type === "galaxy") {
      const gt = galaxyTypeFromHubble(hubble);
      if (gt) rec.galaxyType = gt;
    }
    const diff = difficultyFromMag(rec.apparentMagnitude);
    if (diff) rec.difficulty = diff;

    records.push(rec);
  }

  records.sort((a, b) => (a.apparentMagnitude ?? 99) - (b.apparentMagnitude ?? 99) || a.name.localeCompare(b.name));

  mkdirSync(OUT_DIR, { recursive: true });
  for (const f of readdirSync(OUT_DIR)) if (f.startsWith("chunk-")) writeFileSync(join(OUT_DIR, f), "");
  const CHUNK = 300;
  const chunks: string[] = [];
  for (let c = 0; c * CHUNK < records.length; c++) {
    const slice = records.slice(c * CHUNK, (c + 1) * CHUNK);
    const name = `chunk-${String(c).padStart(2, "0")}`;
    const content =
      `import type { DeepSkyRecord } from "@/knowledge-graph/data/deep-sky-catalog/types";\n\n` +
      `// Generated from the OpenNGC database (CC BY-SA 4.0). Do not edit by hand.\n` +
      `export const records: DeepSkyRecord[] = [\n${slice.map((r) => "  " + JSON.stringify(r)).join(",\n")},\n];\n`;
    writeFileSync(join(OUT_DIR, `${name}.ts`), content);
    chunks.push(name);
  }

  const newCount = records.filter((r) => !r.existing).length;
  const byType: Record<string, number> = {};
  for (const r of records) byType[r.type] = (byType[r.type] ?? 0) + 1;
  console.log(`Selected ${records.length} deep-sky objects (${newCount} new, ${records.length - newCount} enrich existing).`);
  console.log(`Messier: ${records.filter((r) => r.ids.messier).length} | Caldwell: ${records.filter((r) => r.ids.caldwell).length} | named: ${records.filter((r) => r.ids.common).length}`);
  console.log(`By type:`, JSON.stringify(byType));
  console.log(`Wrote ${chunks.length} shard(s).`);
}

main();
