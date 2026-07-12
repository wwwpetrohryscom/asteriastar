/**
 * Program: primary mission engineering verification.
 *
 * For each curated official primary source, fetch the real agency page and CORROBORATE
 * the committed launch date and (Wikidata) launch mass against it — a field is
 * `confirmed_by_primary` only when the primary document actually contains that value.
 * No engineering value is transcribed or guessed; an unreachable source or an
 * unconfirmed value stays `retained_secondary`. Snapshot-based, deterministic.
 *   npx tsx scripts/precision/ingest-mission-primary.ts
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFileSync, mkdirSync } from "node:fs";
import { PRIMARY_SOURCES } from "../../src/knowledge-graph/data/mission-primary/sources";
import type { MissionPrimaryRow, FieldVerification } from "../../src/knowledge-graph/data/mission-primary/types";
import { EXPLORATION_BY_ID } from "../../src/knowledge-graph/data/exploration-catalog";
import { getMissionPrecision } from "../../src/knowledge-graph/data/mission-precision";
import { dateForms } from "../../src/knowledge-graph/data/mission-primary/date-forms";

const pExecFile = promisify(execFile);
const OUT = "src/knowledge-graph/data/mission-primary/snapshots/nasa-primary.ts";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Boundary-aware containment: the form must not be flanked by a digit, so the day-first form
 *  "5 September 1977" cannot substring-match inside "15 September 1977", and a year cannot match
 *  inside a longer number. Prevents a different date from spuriously satisfying corroboration. */
function mentions(text: string, form: string): boolean {
  return new RegExp(`(?<!\\d)${escapeRe(form)}(?!\\d)`).test(text);
}
/** The exact on-page form corroborating an ISO date, or null if the page does not state it. */
function matchDateForm(text: string, iso: string): string | null {
  return dateForms(iso).find((f) => mentions(text, f)) ?? null;
}
/** The calendar dates ±1 day from an ISO date (the UTC/local launch-date boundary). */
function adjacentDates(iso: string): string[] {
  const base = new Date(`${iso}T00:00:00Z`).getTime();
  return [-1, 1].map((off) => new Date(base + off * 86_400_000).toISOString().slice(0, 10));
}
/** Extract every mass figure (kg) the page explicitly states, verbatim — never invented. The unit
 *  must not be part of a compound unit (kg/s, kg-m, kg·m²), which would be a rate/torque, not a mass. */
function statedMassesKg(text: string): number[] {
  const out = new Set<number>();
  for (const m of text.matchAll(/([\d][\d,]*(?:\.\d+)?)\s*(?:kg|kilograms)(?![\w/·^×-])/gi)) {
    const n = Number(m[1].replace(/,/g, ""));
    if (Number.isFinite(n) && n >= 1 && n <= 100_000) out.add(n);
  }
  return [...out].sort((a, b) => a - b);
}
/** Classify a Wikidata mass against the primary's stated figures. A match within ±0.5% of any
 *  stated figure → confirmed. A conflict is asserted ONLY when the page states exactly one figure,
 *  it is the same order of magnitude as the Wikidata mass (0.5×–2× — so it is plausibly the same
 *  quantity, not an unrelated component mass) and yet disagrees by >2%. A page listing several kg
 *  figures, or a lone figure of a different magnitude, is context-ambiguous: we honestly under-claim
 *  as retained_secondary rather than guess which figure is the launch mass and risk a false conflict. */
function classifyMass(wikidata: number, stated: number[]): FieldVerification {
  if (!stated.length) return "retained_secondary";
  const rel = (a: number, b: number) => Math.abs(a - b) / Math.max(a, b);
  if (stated.some((s) => rel(s, wikidata) <= 0.005)) return "confirmed_by_primary";
  if (stated.length === 1 && rel(stated[0], wikidata) > 0.02 && stated[0] >= wikidata * 0.5 && stated[0] <= wikidata * 2) return "conflict";
  return "retained_secondary";
}

async function fetchText(url: string): Promise<string | null> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { stdout } = await pExecFile("curl", ["-sSL", "--compressed", "--max-time", "25", "-A", "Mozilla/5.0 AsteriaStar-research", url], { maxBuffer: 32 * 1024 * 1024, encoding: "utf8" });
      if (stdout.length < 500) throw new Error("too short");
      return stdout.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    } catch { if (attempt === 3) return null; await sleep(1500 * attempt); }
  }
  return null;
}

async function main() {
  console.log(`Mission primary: ${PRIMARY_SOURCES.length} sources`);
  const rows: MissionPrimaryRow[] = [];
  const retrievedAt = new Date().toISOString().slice(0, 10);
  let i = 0;
  for (const s of PRIMARY_SOURCES) {
    i++;
    const rec = EXPLORATION_BY_ID.get(s.missionId) as { launchDate?: string } | undefined;
    const catalogueLaunchDate = rec?.launchDate ?? null;
    const wikidataMassKg = getMissionPrecision(s.missionId)?.launchMassKg?.value ?? null;
    const text = await fetchText(s.sourceUrl);
    const reachable = text != null;
    // Corroborate: a field is confirmed only when the primary page contains the value.
    let launchDateVerification: FieldVerification = "retained_secondary";
    let primaryConfirmedLaunchDateForm: string | null = null;
    let primaryStatedLaunchDate: string | null = null;
    let massVerification: FieldVerification = "retained_secondary";
    let primaryStatedMassKg: number[] | null = null;
    if (reachable) {
      if (catalogueLaunchDate) {
        const matched = matchDateForm(text!, catalogueLaunchDate);
        if (matched) {
          launchDateVerification = "confirmed_by_primary";
          primaryConfirmedLaunchDateForm = matched;
        } else {
          // Not the exact date — is a ±1-day date present? That is a real primary-vs-catalogue
          // disagreement (the UTC/local launch-date boundary), surfaced as a conflict, both kept.
          const adj = adjacentDates(catalogueLaunchDate).find((a) => matchDateForm(text!, a) != null);
          if (adj) { launchDateVerification = "conflict"; primaryStatedLaunchDate = adj; }
        }
      }
      const stated = statedMassesKg(text!);
      primaryStatedMassKg = stated.length ? stated : null;
      if (wikidataMassKg != null) massVerification = classifyMass(wikidataMassKg, stated);
    }
    rows.push({ missionId: s.missionId, agency: s.agency, sourceUrl: s.sourceUrl, sourceTitle: s.sourceTitle, tier: s.tier, retrievedAt, reachable, catalogueLaunchDate, launchDateVerification, primaryConfirmedLaunchDateForm, primaryStatedLaunchDate, wikidataMassKg, primaryStatedMassKg, massVerification });
    console.log(`  ${i}/${PRIMARY_SOURCES.length} ${s.missionId.split(":")[1]}: reachable=${reachable} launch=${launchDateVerification}${primaryStatedLaunchDate ? `(primary ${primaryStatedLaunchDate})` : ""} mass=${massVerification}${primaryStatedMassKg ? ` states[${primaryStatedMassKg.join(",")}]kg` : ""}`);
    await sleep(400);
  }

  rows.sort((a, b) => a.missionId.localeCompare(b.missionId));
  mkdirSync("src/knowledge-graph/data/mission-primary/snapshots", { recursive: true });
  const header =
    `import type { MissionPrimaryRow } from "@/knowledge-graph/data/mission-primary/types";\n\n` +
    `// Generated by scripts/precision/ingest-mission-primary.ts. Each row records whether an\n` +
    `// official primary source corroborates the committed launch date / launch mass — nothing\n` +
    `// is transcribed from the page. Do not edit by hand.\n\n` +
    `export const NASA_PRIMARY_RETRIEVED_AT = ${JSON.stringify(retrievedAt)};\n\n` +
    `export const NASA_PRIMARY_ROWS: MissionPrimaryRow[] = `;
  writeFileSync(OUT, header + JSON.stringify(rows, null, 0) + ";\n");
  const conf = rows.filter((r) => r.launchDateVerification === "confirmed_by_primary").length;
  console.log(`Mission primary: wrote ${rows.length} rows → ${OUT} (${conf} launch dates confirmed by primary)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
