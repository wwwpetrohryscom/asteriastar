import { getEntityById } from "@/knowledge-graph";
import type { Enveloped, SkyEnvelope } from "@/platform/live-sky/schema";
import { meteorShowers, METEOR_SHOWERS } from "@/platform/live-sky/meteorShowers";
import { moon } from "@/platform/live-sky/moon";
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
  add("moon.currentPhase", moon.currentPhase());
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

  return issues;
}
