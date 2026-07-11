import type { ScientificValue } from "@/lib/provenance/scientific-value";
import { validateScientificValue } from "@/lib/provenance/scientific-value";
import { EXPLORATION_BY_ID } from "@/knowledge-graph/data/exploration-catalog";
import { WIKIDATA_MISSION_ROWS, WIKIDATA_MISSIONS_RETRIEVED_AT } from "./snapshots/wikidata-missions";

/**
 * Mission precision overlay (Program 4).
 *
 * Adds the identity/engineering fields the exploration catalogue lacks — international
 * designator, operator, manufacturer, launch mass — from Wikidata, resolved to a
 * TYPE-VERIFIED, UNAMBIGUOUS entity (so no homonym is ingested). Honesty rules:
 *  - Wikidata's launch date is used only as a CROSS-CHECK against the curated catalogue,
 *    never to override it (Wikidata is crowd-sourced and demonstrably wrong for some
 *    missions, e.g. Pioneer 10); it is shown only as a confirmation when the two agree;
 *  - a launch mass with conflicting Wikidata statements is omitted, not arbitrarily picked;
 *  - values carry the exact Wikidata QID as their source row; a field with no value is absent.
 */

export interface MissionPrecision {
  recordId: string;
  qid: string;
  qidLabel: string;
  cosparId?: ScientificValue<string>;
  operator?: ScientificValue<string>;
  manufacturer?: ScientificValue<string>;
  launchMassKg?: ScientificValue;
  /** Wikidata launch date, shown only when it confirms the catalogue's date. */
  launchDateConfirmed?: string;
  /** Set when Wikidata's launch date disagrees with the catalogue's (Wikidata not shown). */
  launchDateDiscrepancy?: { catalogue: string; wikidata: string };
}

function catalogued<T>(value: T, qid: string, label: string, field: string): ScientificValue<T> {
  return {
    value, status: "catalogued", sourceRef: "wikidata", sourceDataset: "Wikidata",
    sourceTable: "wdt", sourceField: field, sourceRowId: qid, objectIdentifier: label,
    retrievedAt: WIKIDATA_MISSIONS_RETRIEVED_AT,
  };
}

function build(): Map<string, MissionPrecision> {
  const out = new Map<string, MissionPrecision>();
  for (const w of WIKIDATA_MISSION_ROWS) {
    const rec = EXPLORATION_BY_ID.get(w.recordId);
    if (!rec) continue;
    const p: MissionPrecision = { recordId: w.recordId, qid: w.qid, qidLabel: w.qidLabel };
    if (w.cospar) p.cosparId = catalogued(w.cospar, w.qid, w.qidLabel, "P247");
    if (w.operator) p.operator = catalogued(w.operator, w.qid, w.qidLabel, "P137");
    if (w.manufacturer) p.manufacturer = catalogued(w.manufacturer, w.qid, w.qidLabel, "P176");
    if (w.launchMassKg != null && w.launchMassKg > 0) {
      p.launchMassKg = { ...catalogued(w.launchMassKg, w.qid, w.qidLabel, "P2067"), unit: "kg" };
    }
    // Cross-check the launch date against the curated catalogue — never override it.
    const catDate = rec.launchDate;
    if (w.launchDate && catDate) {
      if (w.launchDate === catDate) p.launchDateConfirmed = w.launchDate;
      else p.launchDateDiscrepancy = { catalogue: catDate, wikidata: w.launchDate };
    }
    out.set(w.recordId, p);
  }
  return out;
}

export const MISSION_PRECISION: Map<string, MissionPrecision> = build();

export const MISSION_PRECISION_META = {
  retrievedAt: WIKIDATA_MISSIONS_RETRIEVED_AT,
  missions: MISSION_PRECISION.size,
  withCospar: [...MISSION_PRECISION.values()].filter((p) => p.cosparId).length,
  withMass: [...MISSION_PRECISION.values()].filter((p) => p.launchMassKg).length,
  launchDatesConfirmed: [...MISSION_PRECISION.values()].filter((p) => p.launchDateConfirmed).length,
  launchDateDiscrepancies: [...MISSION_PRECISION.values()].filter((p) => p.launchDateDiscrepancy).length,
} as const;

export function getMissionPrecision(recordId: string): MissionPrecision | undefined {
  return MISSION_PRECISION.get(recordId);
}

/**
 * Mission precision gate. Rejects fabrication-shaped data, never mere absence:
 * structural honesty of every value; a positive, plausible launch mass; and a unique
 * QID per record (a wrong resolve would map two missions to one Wikidata entity).
 * Launch-date disagreements are surfaced (in metadata) but do not fail the gate — the
 * catalogue value is authoritative and Wikidata's is never shown when it disagrees.
 */
export function validateMissionPrecision(): string[] {
  const issues: string[] = [];
  const seenQid = new Map<string, string>();
  for (const p of MISSION_PRECISION.values()) {
    if (!EXPLORATION_BY_ID.has(p.recordId)) { issues.push(`precision for unknown mission ${p.recordId}`); continue; }
    const values: [string, ScientificValue<unknown> | undefined][] = [
      ["cosparId", p.cosparId], ["operator", p.operator], ["manufacturer", p.manufacturer], ["launchMassKg", p.launchMassKg],
    ];
    for (const [name, v] of values) if (v) for (const e of validateScientificValue(v, `${p.recordId}.${name}`)) issues.push(e);
    // A bare QID means Wikidata's label service fell back for a label-less entity — that
    // is a meaningless identifier, never a name, and must not be shown as a value.
    for (const [name, v] of [["operator", p.operator], ["manufacturer", p.manufacturer], ["cosparId", p.cosparId]] as const)
      if (v && /^Q\d+$/.test(String(v.value))) issues.push(`${p.recordId}.${name}: raw Wikidata QID "${v.value}" shown as a value`);
    if (p.launchMassKg && (p.launchMassKg.value <= 0 || p.launchMassKg.value > 5_000_000))
      issues.push(`${p.recordId}: implausible launch mass ${p.launchMassKg.value} kg`);
    // A displayed launch-date confirmation must actually equal the catalogue's date.
    const rec = EXPLORATION_BY_ID.get(p.recordId);
    if (p.launchDateConfirmed && rec?.launchDate && p.launchDateConfirmed !== rec.launchDate)
      issues.push(`${p.recordId}: launchDateConfirmed ${p.launchDateConfirmed} does not match catalogue ${rec.launchDate}`);
    const prev = seenQid.get(p.qid);
    if (prev) issues.push(`Wikidata ${p.qid} maps to two missions: ${prev} and ${p.recordId}`);
    seenQid.set(p.qid, p.recordId);
  }
  return issues;
}
