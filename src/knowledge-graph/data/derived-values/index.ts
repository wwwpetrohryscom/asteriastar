import type { DerivedScientificValue } from "@/lib/provenance/derived-value";
import { validateDerivedValue } from "@/lib/provenance/derived-value";
import { deriveValue, CONSTANTS } from "@/lib/provenance/formulas";
import type { SourceKey } from "@/lib/sources";
import { GRAPH_RELEASED } from "@/knowledge-graph/version";
import { BODY_RECORDS } from "@/knowledge-graph/data/solar-system-catalog";
import { EXOPLANET_RECORDS } from "@/knowledge-graph/data/exoplanet-catalog";
import { DEEP_SKY_RECORDS } from "@/knowledge-graph/data/deep-sky-catalog";
import { EXPLORATION_RECORDS } from "@/knowledge-graph/data/exploration-catalog";

/**
 * Unified derived-value registry (Program: derived-value migration).
 *
 * Every value the platform derives at display time — solar surface gravity & escape
 * velocity, exoplanet bulk density, deep-sky projected axis ratio, mission duration &
 * elapsed time — is produced here as a `DerivedScientificValue`, with its formula,
 * versioned implementation, source-backed inputs and a fixed reference instant. This
 * is the single source of truth the pages render from and the provenance registry
 * collects, replacing the ad-hoc inline computations that previously lived in the
 * page components.
 */

export const CALC_IMPL_VERSION = "1.0.0";
/** Reference instant for time-dependent calculations — a fixed data-release date, so an
 *  elapsed time is "as of {this}", never a silently-changing timeless number. */
const REFERENCE_INSTANT = `${GRAPH_RELEASED}T00:00:00Z`;

export type DerivedDomain = "solar-system" | "exoplanet" | "deep-sky" | "mission";

export interface DerivedProvenanceEntry {
  entityId: string;
  domain: DerivedDomain;
  field: string;
  value: DerivedScientificValue<number>;
}

const G = CONSTANTS.G.value; // 6.674e-11
const M_EARTH = CONSTANTS.M_earth.value; // 5.972e24 kg
const R_EARTH = CONSTANTS.R_earth.value; // 6.371e6 m

/* --------------------------------------------------------- solar bodies */

function solarDerived(): DerivedProvenanceEntry[] {
  const out: DerivedProvenanceEntry[] = [];
  for (const b of BODY_RECORDS) {
    if (b.kind === "mission" || b.kind === "spacecraft") continue;
    const m = b.mass1e24Kg, r = b.radiusKm;
    if (m == null || m <= 0 || r == null || r <= 0) continue; // never a missing / zero-underflow input
    const src = (b.sources[0] ?? "nasa") as SourceKey;
    const inputs = [
      { field: "mass1e24Kg", value: m, unit: "×10²⁴ kg", provenanceRef: `${b.id} · ${src}`, sourceRef: src },
      { field: "radiusKm", value: r, unit: "km", provenanceRef: `${b.id} · ${src}`, sourceRef: src },
    ];
    const mKg = m * 1e24, rM = r * 1000;
    const limitations = ["Assumes a spherical, non-rotating body.", "Inputs carry no catalogued uncertainty, so none is propagated."];
    if (b.gravityMs2 == null) {
      out.push({ entityId: b.id, domain: "solar-system", field: "surfaceGravity", value: deriveValue({
        formulaId: "surface-gravity", value: (G * mKg) / rM ** 2, unit: "m/s²",
        calculatedAt: REFERENCE_INSTANT, calcImplVersion: CALC_IMPL_VERSION, inputs,
        assumptions: [`G = ${CONSTANTS.G.value} ${CONSTANTS.G.unit} (${CONSTANTS.G.source})`], limitations,
        objectIdentifier: b.name,
      }) });
    }
    if (b.escapeVelocityKms == null) {
      out.push({ entityId: b.id, domain: "solar-system", field: "escapeVelocity", value: deriveValue({
        formulaId: "escape-velocity", value: Math.sqrt((2 * G * mKg) / rM) / 1000, unit: "km/s",
        calculatedAt: REFERENCE_INSTANT, calcImplVersion: CALC_IMPL_VERSION, inputs,
        assumptions: [`G = ${CONSTANTS.G.value} ${CONSTANTS.G.unit} (${CONSTANTS.G.source})`], limitations,
        objectIdentifier: b.name,
      }) });
    }
  }
  return out;
}

/* --------------------------------------------------------- exoplanets */

function exoplanetDerived(): DerivedProvenanceEntry[] {
  const out: DerivedProvenanceEntry[] = [];
  for (const e of EXOPLANET_RECORDS) {
    const m = e.massEarth, r = e.radiusEarth;
    if (m == null || m <= 0 || r == null || r <= 0) continue;
    const rho = (m * M_EARTH) / ((4 / 3) * Math.PI * (r * R_EARTH) ** 3) / 1000; // g/cm³
    // No planetary composition exceeds ~30 g/cm³: a higher value means the archive's
    // mass and radius come from inconsistent measurements → no honest density.
    if (!(rho > 0) || rho > 30) continue;
    out.push({ entityId: e.id, domain: "exoplanet", field: "bulkDensity", value: deriveValue({
      formulaId: "bulk-density", value: rho, unit: "g/cm³",
      calculatedAt: REFERENCE_INSTANT, calcImplVersion: CALC_IMPL_VERSION,
      inputs: [
        { field: "massEarth", value: m, unit: "M⊕", provenanceRef: `${e.id} · NASA Exoplanet Archive`, sourceRef: "nasa" },
        { field: "radiusEarth", value: r, unit: "R⊕", provenanceRef: `${e.id} · NASA Exoplanet Archive`, sourceRef: "nasa" },
      ],
      assumptions: [`M⊕ = ${M_EARTH} kg, R⊕ = ${R_EARTH} m (IAU 2015 B3 nominal)`, "Assumes a uniform sphere."],
      limitations: ["Withheld above 30 g/cm³ (inconsistent mass/radius inputs).", "Archive mass/radius carry no propagated uncertainty here."],
      objectIdentifier: e.name,
    }) });
  }
  return out;
}

/* --------------------------------------------------------- deep sky */

function deepSkyDerived(): DerivedProvenanceEntry[] {
  const out: DerivedProvenanceEntry[] = [];
  for (const d of DEEP_SKY_RECORDS) {
    const maj = d.sizeMajorArcmin, min = d.sizeMinorArcmin;
    if (maj == null || maj <= 0 || min == null || min <= 0) continue;
    out.push({ entityId: d.id, domain: "deep-sky", field: "axisRatio", value: deriveValue({
      formulaId: "projected-axis-ratio", value: min / maj, unit: "",
      calculatedAt: REFERENCE_INSTANT, calcImplVersion: CALC_IMPL_VERSION,
      inputs: [
        { field: "sizeMinorArcmin", value: min, unit: "′", provenanceRef: `${d.id} · OpenNGC`, sourceRef: "openngc" },
        { field: "sizeMajorArcmin", value: maj, unit: "′", provenanceRef: `${d.id} · OpenNGC`, sourceRef: "openngc" },
      ],
      limitations: ["Sky-projected (apparent) ratio, not the intrinsic 3-D shape."],
      objectIdentifier: d.name,
    }) });
  }
  return out;
}

/* --------------------------------------------------------- missions */

function daysBetween(aIso: string, bIso: string): number | null {
  const a = new Date(aIso).getTime(), b = new Date(bIso).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return (b - a) / 86_400_000;
}

function missionDerived(): DerivedProvenanceEntry[] {
  const out: DerivedProvenanceEntry[] = [];
  for (const r of EXPLORATION_RECORDS) {
    if (r.kind !== "mission") continue;
    const launch = r.launchDate;
    if (!launch) continue;
    // Not yet launched (as of the reference instant) → no span, even if a planned end
    // date is present. This preserves the guard the old inline code enforced.
    const sinceLaunch = daysBetween(launch, REFERENCE_INSTANT);
    if (sinceLaunch == null || sinceLaunch < 0) continue;
    const src = (r.sources[0] ?? "nasa") as SourceKey;
    const provRef = `${r.id} · mission catalogue · ${src}`;
    const launchInput = { field: "launchDate", value: new Date(launch).getTime() / 86_400_000, unit: "days (JD-like)", provenanceRef: provRef, sourceRef: src };
    if (r.endDate) {
      const days = daysBetween(launch, r.endDate);
      if (days == null || days < 0) continue; // impossible chronology → not derived
      out.push({ entityId: r.id, domain: "mission", field: "missionDuration", value: deriveValue({
        formulaId: "mission-duration", value: days, unit: "d", status: "calculated",
        calculatedAt: REFERENCE_INSTANT, calcImplVersion: CALC_IMPL_VERSION,
        inputs: [launchInput, { field: "endDate", value: new Date(r.endDate).getTime() / 86_400_000, unit: "days (JD-like)", provenanceRef: provRef, sourceRef: src }],
        notes: "Actual mission duration (a fixed span between two catalogued dates).",
        limitations: ["Distinguishes actual duration from planned/extended-mission periods, which are not modelled here."],
        objectIdentifier: r.name,
      }) });
    } else if (r.status === "Active" || r.status === "En route") {
      const days = daysBetween(launch, REFERENCE_INSTANT);
      if (days == null || days < 0) continue;
      out.push({ entityId: r.id, domain: "mission", field: "timeSinceLaunch", value: deriveValue({
        formulaId: "mission-elapsed", value: days, unit: "d", status: "calculated",
        calculatedAt: REFERENCE_INSTANT, calcImplVersion: CALC_IMPL_VERSION, inputs: [launchInput],
        notes: `Elapsed time since launch, as of the ${REFERENCE_INSTANT.slice(0, 10)} data release (a still-active mission).`,
        limitations: ["A time-dependent value: it is elapsed time as of the stated reference instant, not a fixed total.", "Elapsed time since launch is not the same as time spent operating at the target."],
        objectIdentifier: r.name,
      }) });
    }
  }
  return out;
}

/* --------------------------------------------------------- registry surface */

export function collectDerived(): DerivedProvenanceEntry[] {
  const all = [...solarDerived(), ...exoplanetDerived(), ...deepSkyDerived(), ...missionDerived()];
  all.sort((a, b) => (a.entityId + a.field < b.entityId + b.field ? -1 : 1));
  return all;
}

const DERIVED_BY_ENTITY: Map<string, DerivedProvenanceEntry[]> = (() => {
  const m = new Map<string, DerivedProvenanceEntry[]>();
  for (const e of collectDerived()) (m.get(e.entityId) ?? m.set(e.entityId, []).get(e.entityId)!).push(e);
  return m;
})();

export function derivedForEntity(entityId: string): DerivedProvenanceEntry[] {
  return DERIVED_BY_ENTITY.get(entityId) ?? [];
}

/** Single source of truth for one derived field on one entity (used by page renders). */
export function derivedField(entityId: string, field: string): DerivedScientificValue<number> | undefined {
  return DERIVED_BY_ENTITY.get(entityId)?.find((e) => e.field === field)?.value;
}

export const DERIVED_STATS = (() => {
  const all = collectDerived();
  const byDomain: Record<string, number> = {};
  const byFormula: Record<string, number> = {};
  for (const e of all) {
    byDomain[e.domain] = (byDomain[e.domain] ?? 0) + 1;
    byFormula[e.value.formulaId] = (byFormula[e.value.formulaId] ?? 0) + 1;
  }
  return { total: all.length, byDomain, byFormula, withUncertainty: all.filter((e) => e.value.uncertainty).length };
})();

/**
 * Derived-value gate: the base structural check plus derivation-specific invariants
 * (formula present, versioned; input provenance complete; no missing input; output
 * consistent with a recomputation from the inputs; no duplicate derived field per
 * entity). Rejects fabrication-shaped data, never mere absence.
 */
export function validateDerivedValues(): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const e of collectDerived()) {
    const label = `${e.entityId}.${e.field}`;
    for (const m of validateDerivedValue(e.value, label)) issues.push(m);
    if (seen.has(label)) issues.push(`${label}: duplicate derived field`);
    seen.add(label);
    if (!Number.isFinite(e.value.value) || (typeof e.value.value === "number" && e.value.value <= 0 && e.field !== "axisRatio"))
      issues.push(`${label}: non-physical derived value ${e.value.value}`);
    // Output-consistency: recompute from the stored inputs and compare (≤0.5% drift).
    const recomputed = recompute(e);
    if (recomputed != null && Math.abs(recomputed - e.value.value) / Math.max(1e-9, Math.abs(e.value.value)) > 0.005)
      issues.push(`${label}: output ${e.value.value} inconsistent with recomputation ${recomputed} from stored inputs`);
  }
  return issues;
}

/** Independent recomputation from the stored inputs, used by the consistency gate. */
function recompute(e: DerivedProvenanceEntry): number | null {
  const inp = (f: string) => e.value.inputs.find((i) => i.field === f)?.value;
  switch (e.value.formulaId) {
    case "surface-gravity": { const m = inp("mass1e24Kg"), r = inp("radiusKm"); return m != null && r != null ? (G * m * 1e24) / (r * 1000) ** 2 : null; }
    case "escape-velocity": { const m = inp("mass1e24Kg"), r = inp("radiusKm"); return m != null && r != null ? Math.sqrt((2 * G * m * 1e24) / (r * 1000)) / 1000 : null; }
    case "bulk-density": { const m = inp("massEarth"), r = inp("radiusEarth"); return m != null && r != null ? (m * M_EARTH) / ((4 / 3) * Math.PI * (r * R_EARTH) ** 3) / 1000 : null; }
    case "projected-axis-ratio": { const mi = inp("sizeMinorArcmin"), ma = inp("sizeMajorArcmin"); return mi != null && ma != null ? mi / ma : null; }
    case "mission-duration": { const l = inp("launchDate"), en = inp("endDate"); return l != null && en != null ? en - l : null; }
    case "mission-elapsed": { const l = inp("launchDate"); return l != null ? new Date(REFERENCE_INSTANT).getTime() / 86_400_000 - l : null; }
    default: return null;
  }
}
