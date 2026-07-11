/**
 * Program 4 — Wikidata mission engineering ingestion.
 *
 * For every mission/spacecraft record, resolves the name to a Wikidata entity that is
 * TYPE-VERIFIED (an instance/subclass of spacecraft or spaceflight) and UNAMBIGUOUS
 * (exactly one such entity), then records launch date, international designator,
 * operator, manufacturer and launch mass VERBATIM. A name with zero or several
 * spacecraft-typed matches is skipped (honest empty) — this is what prevents a
 * homonym ("Voyager 1" the music EP) from being ingested. Deterministic, snapshot-based.
 *   npx tsx scripts/precision/ingest-wikidata-missions.ts
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFileSync, mkdirSync } from "node:fs";
import { EXPLORATION_RECORDS } from "../../src/knowledge-graph/data/exploration-catalog";
import type { WikidataMissionRow } from "../../src/knowledge-graph/data/mission-precision/types";

const pExecFile = promisify(execFile);
const OUT = "src/knowledge-graph/data/mission-precision/snapshots/wikidata-missions.ts";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const num = (v: unknown): number | null => (v == null || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));

// Throws after exhausting retries so a transient fetch/parse failure is never silently
// mistaken for a genuine "no match" (which would drop a resolvable mission).
async function curlJson(url: string, params: [string, string][]): Promise<Record<string, unknown>> {
  const args = ["-sS", "--compressed", "--max-time", "60", "-G", "--retry", "2"];
  for (const [k, v] of params) args.push("--data-urlencode", `${k}=${v}`);
  args.push("-H", "Accept: application/sparql-results+json", "-A", "AsteriaStar-precision/1.0", url);
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try { return JSON.parse((await pExecFile("curl", args, { maxBuffer: 32 * 1024 * 1024, encoding: "utf8" })).stdout); }
    catch (e) { lastErr = e; if (attempt < 5) await sleep(2000 * attempt); }
  }
  throw lastErr;
}

const isQid = (s: string): boolean => /^Q\d+$/.test(s.trim());

async function searchQids(name: string): Promise<string[]> {
  const d = await curlJson("https://www.wikidata.org/w/api.php", [
    // A generous limit so a common-name spacecraft (e.g. "Juno", "Lucy") still appears
    // among results for the type filter, even when goddesses/asteroids/films rank higher.
    ["action", "wbsearchentities"], ["search", name], ["language", "en"], ["type", "item"], ["format", "json"], ["limit", "50"],
  ]);
  return ((d?.search ?? []) as { id: string }[]).map((x) => x.id);
}

// Type-verified structured fields for the candidate set. Roots: spacecraft (Q40218)
// and spaceflight (Q5916) cover probes, telescopes, satellites and crewed missions.
async function structured(qids: string[]): Promise<Map<string, Record<string, unknown[]>>> {
  const values = qids.map((q) => `wd:${q}`).join(" ");
  // Mass is read via the SI-normalised statement value (psn:P2067 → quantityAmount),
  // which Wikibase always expresses in kilograms — so the "kg" unit is never assumed.
  // The label service falls back en → mul (Wikidata's multilingual default) before it
  // would otherwise emit a bare QID.
  const query =
    `SELECT ?item ?itemLabel ?launch ?cospar ?opLabel ?manLabel ?mass WHERE { ` +
    `VALUES ?item { ${values} } ?item wdt:P31/wdt:P279* ?root. VALUES ?root { wd:Q40218 wd:Q5916 } ` +
    `OPTIONAL { ?item wdt:P619 ?launch. } OPTIONAL { ?item wdt:P247 ?cospar. } ` +
    `OPTIONAL { ?item wdt:P137 ?op. } OPTIONAL { ?item wdt:P176 ?man. } ` +
    `OPTIONAL { ?item p:P2067/psn:P2067/wikibase:quantityAmount ?mass. } ` +
    `SERVICE wikibase:label { bd:serviceParam wikibase:language "en,mul". } }`;
  const d = await curlJson("https://query.wikidata.org/sparql", [["query", query]]);
  const rows = ((d as { results?: { bindings?: Record<string, { value: string }>[] } })?.results?.bindings) ?? [];
  const byQid = new Map<string, Record<string, unknown[]>>();
  for (const b of rows) {
    const qid = b.item.value.split("/").pop()!;
    const rec = byQid.get(qid) ?? { label: [], launch: [], cospar: [], op: [], man: [], mass: [] };
    // A label-service fallback to a bare QID means the entity has no usable name → drop it.
    if (b.itemLabel && !isQid(b.itemLabel.value) && !rec.label.includes(b.itemLabel.value)) rec.label.push(b.itemLabel.value);
    if (b.opLabel && !isQid(b.opLabel.value) && !rec.op.includes(b.opLabel.value)) rec.op.push(b.opLabel.value);
    if (b.manLabel && !isQid(b.manLabel.value) && !rec.man.includes(b.manLabel.value)) rec.man.push(b.manLabel.value);
    for (const [k, key] of [["launch", "launch"], ["cospar", "cospar"], ["mass", "mass"]] as const)
      if (b[k] && !rec[key].includes(b[k].value)) rec[key].push(b[k].value);
    byQid.set(qid, rec);
  }
  return byQid;
}

const single = (arr: unknown[]): string | null => { const u = [...new Set(arr as string[])]; return u.length === 1 ? u[0] : null; };

/** Resolve one record. Throws on fetch failure (so it can be retried, not lost). */
async function resolveOne(r: (typeof EXPLORATION_RECORDS)[number]): Promise<WikidataMissionRow | { status: "unmatched" | "ambiguous" }> {
  const qids = await searchQids(r.name);
  const byQid = qids.length ? await structured(qids) : new Map<string, Record<string, unknown[]>>();
  const typed = [...byQid.keys()]; // only spacecraft/spaceflight-typed entities survive the SPARQL filter
  // Prefer the entity whose label EXACTLY matches the record name (the mission itself,
  // not its orbiter/lander); fall back to a lone typed candidate.
  const nameLc = r.name.trim().toLowerCase();
  const exact = typed.filter((q) => String((byQid.get(q)!.label[0] ?? "")).trim().toLowerCase() === nameLc);
  const chosen = exact.length === 1 ? exact[0] : typed.length === 1 ? typed[0] : null;
  if (typed.length === 0) return { status: "unmatched" };
  if (!chosen) return { status: "ambiguous" };
  const rec = byQid.get(chosen)!;
  const distinctMass = [...new Set((rec.mass as string[]).map(num).filter((x): x is number => x != null))];
  // Every multi-valued field is OMITTED on conflict (like mass), never picked arbitrarily.
  return {
    recordId: r.id, name: r.name, qid: chosen, qidLabel: (rec.label[0] as string) ?? r.name,
    launchDate: single(rec.launch) ? String(single(rec.launch)).slice(0, 10) : null,
    cospar: single(rec.cospar), operator: single(rec.op), manufacturer: single(rec.man),
    launchMassKg: distinctMass.length === 1 ? distinctMass[0] : null, massValues: distinctMass,
  };
}

async function main() {
  const cohort = EXPLORATION_RECORDS.filter((r) => r.kind === "mission" || r.kind === "spacecraft");
  console.log(`Wikidata missions: ${cohort.length} records`);
  const rows: WikidataMissionRow[] = [];
  const byId = new Map(cohort.map((r) => [r.id, r]));
  let queue = cohort.map((r) => r.id);
  let ambiguous = 0, unmatched = 0;
  for (let pass = 1; pass <= 3 && queue.length; pass++) {
    const retry: string[] = [];
    let i = 0;
    for (const id of queue) {
      i++;
      const r = byId.get(id)!;
      try {
        const res = await resolveOne(r);
        if ("status" in res) { if (res.status === "ambiguous") ambiguous++; else unmatched++; }
        else rows.push(res);
      } catch { retry.push(id); } // transient fetch failure → retry, never a silent no-match
      if (i % 15 === 0) console.log(`  pass ${pass}: ${i}/${queue.length} (matched: ${rows.length})`);
      await sleep(300);
    }
    if (retry.length) console.log(`  pass ${pass}: ${retry.length} fetch failures → retrying`);
    queue = retry;
    if (queue.length) await sleep(5000);
  }
  if (queue.length) throw new Error(`Wikidata: ${queue.length} records still failing after retries: ${queue.join(", ")} — aborting to avoid a silently-incomplete snapshot`);
  console.log(`resolved ${rows.length}; ${ambiguous} ambiguous, ${unmatched} genuine no-match (all left empty)`);

  rows.sort((a, b) => (a.recordId < b.recordId ? -1 : a.recordId > b.recordId ? 1 : 0));
  mkdirSync("src/knowledge-graph/data/mission-precision/snapshots", { recursive: true });
  const header =
    `import type { WikidataMissionRow } from "@/knowledge-graph/data/mission-precision/types";\n\n` +
    `// Generated by scripts/precision/ingest-wikidata-missions.ts from Wikidata (type-verified,\n` +
    `// unambiguous matches only). Values verbatim; null = no value. Do not edit by hand.\n\n` +
    `export const WIKIDATA_MISSIONS_RETRIEVED_AT = ${JSON.stringify(new Date().toISOString().slice(0, 10))};\n\n` +
    `export const WIKIDATA_MISSION_ROWS: WikidataMissionRow[] = `;
  writeFileSync(OUT, header + JSON.stringify(rows, null, 0) + ";\n");
  console.log(`Wikidata missions: wrote ${rows.length} rows → ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
