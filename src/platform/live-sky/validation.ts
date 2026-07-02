import { getEntityById } from "@/knowledge-graph";
import type { Enveloped, SkyEnvelope } from "@/platform/live-sky/schema";
import { meteorShowers, METEOR_SHOWERS } from "@/platform/live-sky/meteorShowers";
import { moon, MOON_PHASES } from "@/platform/live-sky/moon";
import { computeMoon } from "@/platform/live-sky/providers/computed-moon";
import type { MoonPhaseName } from "@/platform/live-sky/models";
import { planets } from "@/platform/live-sky/planets";
import { eclipses } from "@/platform/live-sky/eclipses";
import { comets } from "@/platform/live-sky/comets";
import { asteroids } from "@/platform/live-sky/asteroids";
import { iss } from "@/platform/live-sky/iss";
import { aurora } from "@/platform/live-sky/aurora";
import { spaceWeather } from "@/platform/live-sky/spaceWeather";
import { observingCalendar } from "@/platform/live-sky/observingCalendar";

/**
 * Live Sky validation — the honesty gate. It proves the platform ships NO
 * fabricated live data: every "prepared" datum has a null value and no
 * timestamp, no datum is falsely marked "live", every envelope carries a source
 * and provenance, and every graph link resolves (no orphan live-sky object).
 */

/** Every graph entity id the live-sky layer links to. */
export function collectLinkedEntityIds(): string[] {
  const ids = new Set<string>();
  for (const id of moon.linkedEntityIds) ids.add(id);
  for (const id of planets.linkedEntityIds) ids.add(id);
  for (const id of eclipses.linkedEntityIds) ids.add(id);
  for (const id of comets.linkedEntityIds) ids.add(id);
  for (const id of asteroids.linkedEntityIds) ids.add(id);
  for (const id of iss.linkedEntityIds) ids.add(id);
  for (const id of aurora.linkedEntityIds) ids.add(id);
  for (const id of spaceWeather.linkedEntityIds) ids.add(id);
  for (const id of observingCalendar.linkedEntityIds) ids.add(id);
  for (const s of METEOR_SHOWERS) for (const id of meteorShowers.linkedEntityIds(s)) ids.add(id);
  return [...ids];
}

/** Envelopes that must be "reference" (timeless facts, with a compilation date). */
function referenceEnvelopes(): { ctx: string; env: SkyEnvelope }[] {
  return [
    { ctx: "meteorShowers", env: meteorShowers.envelope },
    { ctx: "eclipses.types", env: eclipses.typesEnvelope },
    { ctx: "aurora.reference", env: aurora.referenceEnvelope },
    { ctx: "spaceWeather.scales", env: spaceWeather.scalesEnvelope },
    { ctx: "observingCalendar", env: observingCalendar.envelope },
  ];
}

/** Every prepared datum (must have null data and no fabricated timestamp). */
function preparedData(): { ctx: string; e: Enveloped<unknown> }[] {
  const out: { ctx: string; e: Enveloped<unknown> }[] = [];
  const add = (ctx: string, e: Enveloped<unknown> | Enveloped<unknown>[]) => {
    for (const x of Array.isArray(e) ? e : [e]) out.push({ ctx, e: x });
  };
  add("planets.currentVisibility", planets.currentVisibility());
  add("eclipses.upcoming", eclipses.upcoming());
  add("comets.currentlyVisible", comets.currentlyVisible());
  add("asteroids.closeApproaches", asteroids.closeApproaches());
  add("iss.passes", iss.passes());
  add("aurora.forecast", aurora.forecast());
  add("spaceWeather.recentFlares", spaceWeather.recentFlares());
  add("spaceWeather.geomagneticStorms", spaceWeather.geomagneticStorms());
  return out;
}

function checkEnvelope(env: SkyEnvelope, ctx: string, issues: string[]) {
  if (!env.source || env.source.length === 0) issues.push(`${ctx}: envelope has no source`);
  if (!env.provenance?.trim()) issues.push(`${ctx}: envelope has no provenance`);
  if (!env.licenseNotes?.trim()) issues.push(`${ctx}: envelope has no license notes`);
}

export function validateLiveSky(): string[] {
  const issues: string[] = [];

  // 1. No orphan live-sky data: every linked graph id must resolve.
  for (const id of collectLinkedEntityIds()) {
    if (!getEntityById(id)) issues.push(`live-sky links a non-existent entity: ${id}`);
  }

  // 2. Meteor showers each connect to at least one existing entity.
  for (const s of METEOR_SHOWERS) {
    const linked = meteorShowers.linkedEntityIds(s);
    if (linked.length === 0) issues.push(`meteor shower has no graph links: ${s.slug}`);
    if (s.graphEntityId && !getEntityById(s.graphEntityId)) issues.push(`meteor shower ${s.slug}: graphEntityId missing: ${s.graphEntityId}`);
    if (s.parentBodyId && !getEntityById(s.parentBodyId)) issues.push(`meteor shower ${s.slug}: parentBodyId missing: ${s.parentBodyId}`);
    if (!getEntityById(s.radiantConstellationId)) issues.push(`meteor shower ${s.slug}: radiant constellation missing: ${s.radiantConstellationId}`);
  }

  // 3. Reference envelopes: timeless facts, with a compilation date, never fake-live.
  for (const { ctx, env } of referenceEnvelopes()) {
    checkEnvelope(env, ctx, issues);
    if (env.status !== "reference") issues.push(`${ctx}: expected reference status, got ${env.status}`);
    if (!env.generatedAt) issues.push(`${ctx}: reference data must carry a compilation date`);
    if (env.stale) issues.push(`${ctx}: reference data must not be stale`);
  }

  // 4. Prepared data: NO fabricated values and NO fabricated timestamps.
  for (const { ctx, e } of preparedData()) {
    checkEnvelope(e.envelope, ctx, issues);
    if (e.envelope.status !== "prepared") issues.push(`${ctx}: expected prepared status, got ${e.envelope.status}`);
    if (e.data !== null) issues.push(`${ctx}: prepared datum must have null data (no fabricated values)`);
    if (e.envelope.generatedAt !== null) issues.push(`${ctx}: prepared datum must not carry a timestamp (no fake "live now")`);
  }

  // 5. No datum anywhere is falsely marked live/stale (no provider is connected yet).
  for (const { ctx, e } of preparedData()) {
    if (e.envelope.status === "live" || e.envelope.status === "stale") issues.push(`${ctx}: no provider is connected — status must not be ${e.envelope.status}`);
  }

  // 6. The computed Moon integration (Program P) — real data, honest envelope.
  issues.push(...validateMoon());

  return issues;
}

const KNOWN_PHASES: MoonPhaseName[] = MOON_PHASES.map((p) => p.phase);

/**
 * Validate the computed Moon integration: the honesty envelope, the data
 * contract, and the CORRECTNESS of the calculation against known reference
 * phases (deterministic — never a live provider). A fixed `now` keeps this test
 * reproducible.
 */
export function validateMoon(): string[] {
  const issues: string[] = [];
  const now = new Date("2026-06-29T00:00:00Z");
  const { data, envelope } = moon.current(now);

  // Envelope honesty.
  checkEnvelope(envelope, "moon.current", issues);
  if (envelope.status !== "computed" && envelope.status !== "stale") issues.push(`moon.current: status must be computed/stale, got ${envelope.status}`);
  if (!envelope.generatedAt) issues.push("moon.current: missing generatedAt");
  if (!envelope.validFrom) issues.push("moon.current: missing validFrom");
  if (!envelope.validUntil) issues.push("moon.current: missing validUntil");
  if (envelope.provider) issues.push("moon.current: computed data must not claim a live provider");
  if (typeof envelope.stale !== "boolean") issues.push("moon.current: missing stale flag");

  // Data contract.
  if (!data) {
    issues.push("moon.current: computed data must not be null");
    return issues;
  }
  if (!getEntityById(data.objectEntityId)) issues.push(`moon.current: objectEntityId does not resolve: ${data.objectEntityId}`);
  if (!KNOWN_PHASES.includes(data.phase)) issues.push(`moon.current: invalid phase ${data.phase}`);
  if (!(data.illuminationFraction >= 0 && data.illuminationFraction <= 1)) issues.push(`moon.current: illuminationFraction out of range: ${data.illuminationFraction}`);
  if (!(data.illuminationPercent >= 0 && data.illuminationPercent <= 100)) issues.push(`moon.current: illuminationPercent out of range: ${data.illuminationPercent}`);
  if (!(data.phaseAngleDeg >= 0 && data.phaseAngleDeg <= 360)) issues.push(`moon.current: phaseAngleDeg out of range: ${data.phaseAngleDeg}`);
  if (!(data.synodicAgeDays >= 0 && data.synodicAgeDays <= 30)) issues.push(`moon.current: synodicAgeDays out of range: ${data.synodicAgeDays}`);
  if (data.method !== "computed") issues.push(`moon.current: method must be computed, got ${data.method}`);

  // Calculation correctness vs known reference phases (illumination tolerance 6%).
  const refs: { iso: string; illum: number; phase: MoonPhaseName }[] = [
    { iso: "2025-01-29T12:36:00Z", illum: 0, phase: "new-moon" },
    { iso: "2025-02-12T13:53:00Z", illum: 1, phase: "full-moon" },
    { iso: "2025-03-06T16:32:00Z", illum: 0.5, phase: "first-quarter" },
    { iso: "2025-03-22T11:29:00Z", illum: 0.5, phase: "last-quarter" },
    { iso: "2026-01-03T10:03:00Z", illum: 1, phase: "full-moon" },
  ];
  for (const r of refs) {
    const c = computeMoon(new Date(r.iso));
    if (Math.abs(c.illuminationFraction - r.illum) > 0.06) {
      issues.push(`moon calc: ${r.iso} illumination ${(c.illuminationFraction * 100).toFixed(1)}% differs from expected ~${r.illum * 100}%`);
    }
    if (c.phase !== r.phase) issues.push(`moon calc: ${r.iso} phase ${c.phase} != expected ${r.phase}`);
  }
  return issues;
}
