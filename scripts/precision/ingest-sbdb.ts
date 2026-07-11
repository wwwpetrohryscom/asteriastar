/**
 * Program 3 — JPL Small-Body Database ingestion.
 *
 * Queries the JPL SBDB once per asteroid and comet and records the full osculating
 * orbit (elements with per-element sigma + epoch), physical parameters and the
 * authoritative NEO/PHA/orbit-class flags — all VERBATIM. `full-prec=1` keeps every
 * digit. A field SBDB does not provide is `null`. Deterministic, snapshot-based.
 *   npx tsx scripts/precision/ingest-sbdb.ts
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFileSync, mkdirSync } from "node:fs";
import { MINOR_BODY_RECORDS } from "../../src/knowledge-graph/data/asteroids-catalog";
import { COMET_RECORDS } from "../../src/knowledge-graph/data/comets-catalog";
import type { SbdbRow, SbdbValue } from "../../src/knowledge-graph/data/small-body-precision/types";

const pExecFile = promisify(execFile);
const OUT = "src/knowledge-graph/data/small-body-precision/snapshots/sbdb.ts";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const num = (v: unknown): number | null => (v == null || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));

/** Derive the SBDB `sstr` key from a catalogue designation/name. */
export function sbdbKey(designation: string | undefined, name: string | undefined): string | null {
  const d = designation?.trim();
  if (d) {
    const numbered = d.match(/^\((\d+)\)/); // "(4) Vesta" → "4"
    if (numbered) return numbered[1];
    const periodic = d.match(/^(\d+[PDI])\//); // "67P/…" → "67P"
    if (periodic) return periodic[1];
    const provisional = d.match(/^([CPDXAI]\/\S+\s+\S+)/); // "C/1995 O1 (…)" → "C/1995 O1"
    if (provisional) return provisional[1];
    return d.replace(/\s*\(.*\)$/, "").trim();
  }
  return name?.trim() ?? null;
}

async function sbdb(key: string): Promise<Record<string, unknown> | null> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { stdout } = await pExecFile(
        "curl", ["-sS", "--compressed", "--max-time", "40", "-G",
          "--data-urlencode", `sstr=${key}`, "--data-urlencode", "phys-par=1", "--data-urlencode", "full-prec=1",
          "https://ssd-api.jpl.nasa.gov/sbdb.api"],
        { maxBuffer: 16 * 1024 * 1024, encoding: "utf8" },
      );
      const json = JSON.parse(stdout) as Record<string, unknown>;
      return json.orbit ? json : null; // no orbit = not resolved
    } catch {
      if (attempt === 3) return null;
      await sleep(1500 * attempt);
    }
  }
  return null;
}

function elem(orbit: Record<string, unknown>, name: string): SbdbValue | null {
  const els = (orbit.elements ?? []) as { name: string; value: unknown; sigma: unknown; units: unknown }[];
  const el = els.find((e) => e.name === name);
  if (!el) return null;
  const v = num(el.value);
  return v == null ? null : { value: v, sigma: num(el.sigma), unit: (el.units as string) ?? null };
}
function phys(d: Record<string, unknown>, name: string): SbdbValue | null {
  const pp = (d.phys_par ?? []) as { name: string; value: unknown; sigma: unknown; units: unknown }[];
  const p = pp.find((x) => x.name === name);
  if (!p) return null;
  const v = num(p.value);
  return v == null ? null : { value: v, sigma: num(p.sigma), unit: (p.units as string) ?? null };
}

async function main() {
  // Only records with a formal small-body DESIGNATION are actual bodies; classes,
  // families, reservoirs and (crucially) space missions have none — querying a mission
  // by name would wrongly resolve to an asteroid named after it (7367 Giotto, 103 Hera).
  const bodies: { bodyId: string; kind: string; key: string }[] = [];
  for (const r of [...MINOR_BODY_RECORDS, ...COMET_RECORDS]) {
    if (!r.designation) continue;
    // A satellite/moonlet (e.g. Dimorphos) has no independent heliocentric orbit — its
    // designation resolves to the PRIMARY's SBDB entry, so attaching that orbit to the
    // satellite would be misleading. Skip bodies that orbit another body.
    if ("parentBodySlug" in r && r.parentBodySlug) continue;
    const key = sbdbKey(r.designation, r.name);
    if (key) bodies.push({ bodyId: r.id, kind: r.kind, key });
  }
  console.log(`SBDB: ${bodies.length} small bodies to query`);

  const rows: SbdbRow[] = [];
  let i = 0;
  for (const b of bodies) {
    const d = await sbdb(b.key);
    i++;
    if (d) {
      const obj = (d.object ?? {}) as Record<string, unknown>;
      const orbit = (d.orbit ?? {}) as Record<string, unknown>;
      const oc = (obj.orbit_class ?? {}) as Record<string, unknown>;
      rows.push({
        key: b.key, bodyId: b.bodyId, kind: b.kind, fullname: String(obj.fullname ?? ""),
        spkid: obj.spkid != null ? String(obj.spkid) : null,
        neo: typeof obj.neo === "boolean" ? obj.neo : null, pha: typeof obj.pha === "boolean" ? obj.pha : null,
        orbitClassCode: (oc.code as string) ?? null, orbitClassName: (oc.name as string) ?? null,
        epochJd: num(orbit.epoch), moidAu: num(orbit.moid), conditionCode: orbit.condition_code != null ? String(orbit.condition_code) : null,
        dataArcDays: num(orbit.data_arc), nObsUsed: num(orbit.n_obs_used), producer: (orbit.producer as string) ?? null,
        a: elem(orbit, "a"), e: elem(orbit, "e"), i: elem(orbit, "i"), om: elem(orbit, "om"), w: elem(orbit, "w"),
        ma: elem(orbit, "ma"), q: elem(orbit, "q"), ad: elem(orbit, "ad"), per: elem(orbit, "per"), tp: elem(orbit, "tp"),
        H: phys(d, "H"), albedo: phys(d, "albedo"), diameter: phys(d, "diameter"), rotPer: phys(d, "rot_per"), density: phys(d, "density"),
      });
    } else {
      console.log(`  (no SBDB match for ${b.bodyId} via "${b.key}")`);
    }
    if (i % 10 === 0) console.log(`  ${i}/${bodies.length} (matched: ${rows.length})`);
    await sleep(300);
  }

  // Code-point-stable order (locale-independent) so the snapshot is byte-for-byte deterministic.
  rows.sort((a, b) => (a.bodyId < b.bodyId ? -1 : a.bodyId > b.bodyId ? 1 : 0));
  mkdirSync("src/knowledge-graph/data/small-body-precision/snapshots", { recursive: true });
  const header =
    `import type { SbdbRow } from "@/knowledge-graph/data/small-body-precision/types";\n\n` +
    `// Generated by scripts/precision/ingest-sbdb.ts from the JPL Small-Body Database.\n` +
    `// Every orbital element carries its own sigma and the body's osculating epoch; values\n` +
    `// verbatim (full precision); null = no SBDB value. Do not edit by hand.\n\n` +
    `export const SBDB_RETRIEVED_AT = ${JSON.stringify(new Date().toISOString().slice(0, 10))};\n\n` +
    `export const SBDB_ROWS: SbdbRow[] = `;
  writeFileSync(OUT, header + JSON.stringify(rows, null, 0) + ";\n");
  console.log(`SBDB: wrote ${rows.length} rows → ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
