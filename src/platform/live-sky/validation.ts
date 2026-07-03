import { getEntityById } from "@/knowledge-graph";
import type { Enveloped, SkyEnvelope } from "@/platform/live-sky/schema";
import { meteorShowers, METEOR_SHOWERS } from "@/platform/live-sky/meteorShowers";
import { moon, MOON_PHASES } from "@/platform/live-sky/moon";
import { sun } from "@/platform/live-sky/sun";
import { computeMoon } from "@/platform/live-sky/providers/computed-moon";
import { moonTopocentric } from "@/platform/live-sky/providers/lunar-position";
import { equatorialToHorizontal } from "@/platform/live-sky/providers/planetary-position";
import type { MoonPhaseName, SolarDayCondition } from "@/platform/live-sky/models";
import { timezoneOffsetMinutes, type LocationInput } from "@/platform/live-sky/location";
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

  // 7. The computed Sun & Twilight integration (Program Q) — location-aware, honest.
  issues.push(...validateSun());

  // 8. The location-aware Moon integration (Program R) — moonrise/set/position, honest.
  issues.push(...validateMoonPosition());

  // 9. The computed planet-visibility integration (Program S) — location-aware, honest.
  issues.push(...validatePlanets());

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

/** UTC minutes-of-day of an ISO instant, or null. */
function minuteOfDayUTC(iso: string | null): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

interface SunFixture {
  city: string;
  input: LocationInput;
  expect: SolarDayCondition; // the primary condition that must be present
  /** For polar day/night: sunrise/sunset must be null. For normal: must be present. */
  polar: boolean;
  /** Optional extra conditions that must be present. */
  also?: SolarDayCondition[];
  /** Optional expected sunrise UTC minute-of-day (± tolerance) — a numeric correctness anchor. */
  sunriseUtcMin?: number;
}

/**
 * Validate the computed Sun & Twilight integration: the honesty envelope, the
 * data contract, event ordering, durations, polar-condition handling, invalid
 * input, and numeric correctness against known cities. Deterministic — a fixed
 * `now`, fixed locations, fixed dates.
 */
export function validateSun(): string[] {
  const issues: string[] = [];
  const now = new Date("2026-06-29T00:00:00Z");

  // Invalid inputs must return structured errors, never guessed values.
  const bad: { input: LocationInput; field: string }[] = [
    { input: { latitude: 91, longitude: 0, date: "2025-06-21" }, field: "latitude" },
    { input: { latitude: 0, longitude: 200, date: "2025-06-21" }, field: "longitude" },
    { input: { latitude: 0, longitude: 0, date: "not-a-date" }, field: "date" },
    { input: { latitude: 0, longitude: 0, date: "1200-01-01" }, field: "date" },
    { input: { latitude: 0, longitude: 0, date: "2025-06-21", timezone: "Nowhere/Nowhere" }, field: "timezone" },
  ];
  for (const b of bad) {
    const r = sun.forLocationDate(b.input, now);
    if (r.ok) issues.push(`sun: expected a ${b.field} error for ${JSON.stringify(b.input)}, got a result`);
    else if (r.field !== b.field) issues.push(`sun: expected error field ${b.field}, got ${r.field}`);
  }

  const fixtures: SunFixture[] = [
    { city: "Prague equinox", input: { latitude: 50.0755, longitude: 14.4378, date: "2025-03-20", timezone: "Europe/Prague" }, expect: "normal", polar: false },
    { city: "Quito", input: { latitude: -0.1807, longitude: -78.4678, date: "2025-06-21", timezone: "America/Guayaquil" }, expect: "normal", polar: false },
    { city: "New York solstice", input: { latitude: 40.7128, longitude: -74.006, date: "2025-06-21", timezone: "America/New_York" }, expect: "normal", polar: false, sunriseUtcMin: 9 * 60 + 25 },
    { city: "Sydney winter", input: { latitude: -33.8688, longitude: 151.2093, date: "2025-06-21", timezone: "Australia/Sydney" }, expect: "normal", polar: false },
    { city: "Reykjavik solstice", input: { latitude: 64.1466, longitude: -21.9426, date: "2025-06-21", timezone: "Atlantic/Reykjavik" }, expect: "normal", polar: false, also: ["no_astronomical_twilight"] },
    { city: "Tromso solstice", input: { latitude: 69.6492, longitude: 18.9553, date: "2025-06-21", timezone: "Europe/Oslo" }, expect: "polar_day", polar: true },
    { city: "Longyearbyen midsummer", input: { latitude: 78.2232, longitude: 15.6267, date: "2025-06-21", timezone: "Arctic/Longyearbyen" }, expect: "polar_day", polar: true },
    { city: "Longyearbyen midwinter", input: { latitude: 78.2232, longitude: 15.6267, date: "2025-12-21", timezone: "Arctic/Longyearbyen" }, expect: "polar_night", polar: true },
  ];

  for (const f of fixtures) {
    const r = sun.forLocationDate(f.input, now);
    if (!r.ok) {
      issues.push(`sun: ${f.city} returned an error (${r.field}: ${r.message})`);
      continue;
    }
    const { data, envelope } = r.value;

    // Envelope honesty.
    checkEnvelope(envelope, `sun.${f.city}`, issues);
    if (envelope.status !== "computed") issues.push(`sun.${f.city}: status must be computed, got ${envelope.status}`);
    if (envelope.stale) issues.push(`sun.${f.city}: a deterministic date computation must not be stale`);
    if (envelope.provider) issues.push(`sun.${f.city}: computed data must not claim a live provider`);
    if (!envelope.generatedAt || !envelope.validFrom || !envelope.validUntil) issues.push(`sun.${f.city}: envelope missing timestamps`);

    // Data contract.
    if (!data) {
      issues.push(`sun.${f.city}: data must not be null`);
      continue;
    }
    if (!getEntityById(data.objectEntityId)) issues.push(`sun.${f.city}: objectEntityId does not resolve: ${data.objectEntityId}`);
    if (data.method !== "computed") issues.push(`sun.${f.city}: method must be computed`);
    if (data.input.latitude !== f.input.latitude || data.input.longitude !== f.input.longitude) issues.push(`sun.${f.city}: input coordinates not echoed`);
    if (!data.status.includes(f.expect)) issues.push(`sun.${f.city}: expected status ${f.expect}, got [${data.status.join(", ")}]`);
    for (const extra of f.also ?? []) {
      if (!data.status.includes(extra)) issues.push(`sun.${f.city}: expected status ${extra}, got [${data.status.join(", ")}]`);
    }

    // Duration sanity.
    const d = data.duration;
    if (d.daylightMinutes < 0 || d.daylightMinutes > 1440) issues.push(`sun.${f.city}: daylightMinutes out of range: ${d.daylightMinutes}`);
    for (const [k, v] of Object.entries(d)) {
      if (v < 0) issues.push(`sun.${f.city}: ${k} is negative: ${v}`);
    }

    if (f.polar) {
      // The Sun does not rise or set — those events MUST be null (never faked).
      if (data.events.sunrise.iso !== null || data.events.sunset.iso !== null) issues.push(`sun.${f.city}: polar condition must have null sunrise/sunset`);
      if (f.expect === "polar_day" && d.daylightMinutes !== 1440) issues.push(`sun.${f.city}: polar day must have 1440 daylight minutes, got ${d.daylightMinutes}`);
      if (f.expect === "polar_night" && d.daylightMinutes !== 0) issues.push(`sun.${f.city}: polar night must have 0 daylight minutes, got ${d.daylightMinutes}`);
    } else {
      // Normal day: sunrise/sunset present and events strictly ordered where defined.
      if (!data.events.sunrise.iso || !data.events.sunset.iso) issues.push(`sun.${f.city}: normal day must have sunrise and sunset`);
      const order = [
        data.events.astronomicalDawn.iso, data.events.nauticalDawn.iso, data.events.civilDawn.iso,
        data.events.sunrise.iso, data.events.solarNoon.iso, data.events.sunset.iso,
        data.events.civilDusk.iso, data.events.nauticalDusk.iso, data.events.astronomicalDusk.iso,
      ].filter((x): x is string => x !== null).map((x) => new Date(x).getTime());
      for (let i = 1; i < order.length; i++) {
        if (order[i] < order[i - 1]) { issues.push(`sun.${f.city}: events out of chronological order`); break; }
      }
      // Numeric correctness anchor (sunrise UTC minute-of-day within 5 minutes).
      if (f.sunriseUtcMin !== undefined) {
        const got = minuteOfDayUTC(data.events.sunrise.iso);
        if (got === null || Math.abs(got - f.sunriseUtcMin) > 5) {
          issues.push(`sun.${f.city}: sunrise ${got} min UTC differs from expected ~${f.sunriseUtcMin} min`);
        }
      }
    }
  }

  // Local-civil-date anchoring across the full timezone range, including the
  // UTC+13/+14 and UTC−12 extremes where solar noon and clock noon straddle UTC
  // midnight. Solar noon's LOCAL calendar date must equal the requested date.
  const dateline: LocationInput[] = [
    { city: "Kiritimati", latitude: 1.87, longitude: -157.36, date: "2025-06-21", timezone: "Pacific/Kiritimati" } as LocationInput & { city: string },
    { city: "Apia", latitude: -13.83, longitude: -171.76, date: "2025-06-21", timezone: "Pacific/Apia" } as LocationInput & { city: string },
    { city: "Baker-ish (UTC-12)", latitude: 0, longitude: -177, date: "2025-06-21", timezone: "Etc/GMT+12" } as LocationInput & { city: string },
    { city: "Chatham", latitude: -43.95, longitude: -176.55, date: "2025-06-21", timezone: "Pacific/Chatham" } as LocationInput & { city: string },
  ];
  for (const input of dateline) {
    const label = (input as LocationInput & { city: string }).city;
    const r = sun.forLocationDate(input, now);
    if (!r.ok) { issues.push(`sun.${label}: returned an error (${r.field})`); continue; }
    const noonIso = r.value.data?.events.solarNoon.iso;
    if (!noonIso) { issues.push(`sun.${label}: solar noon missing`); continue; }
    const instant = new Date(noonIso);
    const local = new Date(instant.getTime() + timezoneOffsetMinutes(input.timezone as string, instant) * 60_000);
    const localDate = `${local.getUTCFullYear()}-${String(local.getUTCMonth() + 1).padStart(2, "0")}-${String(local.getUTCDate()).padStart(2, "0")}`;
    if (localDate !== input.date) issues.push(`sun.${label}: solar noon local date ${localDate} != requested ${input.date} (timezone anchoring)`);
  }

  return issues;
}

interface MoonPosFixture {
  city: string;
  input: LocationInput;
  /** Expect a polar/circumpolar condition (alwaysAbove or alwaysBelow). */
  expectPolar?: boolean;
  /** Numeric anchor: moonrise UTC minute-of-day (± tolerance). */
  moonriseUtcMin?: number;
  /** Numeric anchor: moonrise azimuth (± tolerance). */
  moonriseAz?: number;
  /** Numeric anchor: illumination percent (± 2). */
  illumPercent?: number;
}

/**
 * Validate the location-aware Moon integration (Program R): envelope honesty, the
 * data contract, coordinate ranges, illumination consistency, horizon-flag
 * consistency, event ordering, polar/null handling, date-line anchoring, invalid
 * input, and backward compatibility of the phase-only path. Deterministic.
 */
export function validateMoonPosition(): string[] {
  const issues: string[] = [];
  const now = new Date("2026-06-29T00:00:00Z");
  const known = new Set<MoonPhaseName>(MOON_PHASES.map((p) => p.phase));

  // Backward compatibility: the phase-only path is unchanged and never carries position.
  const phaseOnly = moon.current(now);
  if (!phaseOnly.data || "position" in (phaseOnly.data as object)) issues.push("moon.current must remain phase-only (no position) for backward compatibility");

  // Invalid inputs → structured errors, never guessed values.
  const bad: { input: LocationInput; field: string }[] = [
    { input: { latitude: 91, longitude: 0, date: "2025-06-15" }, field: "latitude" },
    { input: { latitude: 0, longitude: 200, date: "2025-06-15" }, field: "longitude" },
    { input: { latitude: 0, longitude: 0, date: "not-a-date" }, field: "date" },
    { input: { latitude: 0, longitude: 0, date: "2025-06-15", timezone: "Nowhere/Nowhere" }, field: "timezone" },
  ];
  for (const b of bad) {
    const r = moon.forLocationDate(b.input, now);
    if (r.ok) issues.push(`moonpos: expected a ${b.field} error for ${JSON.stringify(b.input)}`);
    else if (r.field !== b.field) issues.push(`moonpos: expected error field ${b.field}, got ${r.field}`);
  }

  const fixtures: MoonPosFixture[] = [
    // London 2025-03-14 is a full Moon at the equinox: it rises ~due east at ~18:28 UTC (GMT), fully lit.
    { city: "London full moon", input: { latitude: 51.5, longitude: -0.13, date: "2025-03-14", timezone: "Europe/London" }, moonriseUtcMin: 18 * 60 + 28, moonriseAz: 90, illumPercent: 100 },
    { city: "Prague", input: { latitude: 50.0755, longitude: 14.4378, date: "2025-06-15", timezone: "Europe/Prague" } },
    { city: "Quito", input: { latitude: -0.1807, longitude: -78.4678, date: "2025-06-15", timezone: "America/Guayaquil" } },
    { city: "Sydney", input: { latitude: -33.8688, longitude: 151.2093, date: "2025-06-15", timezone: "Australia/Sydney" } },
    { city: "Tromso", input: { latitude: 69.6492, longitude: 18.9553, date: "2025-06-15", timezone: "Europe/Oslo" } },
    { city: "Longyearbyen", input: { latitude: 78.2232, longitude: 15.6267, date: "2025-12-21", timezone: "Arctic/Longyearbyen" } },
    // Near the North Pole the Moon is essentially always circumpolar or never up on a given day.
    { city: "Near North Pole", input: { latitude: 89.5, longitude: 0, date: "2025-06-15", timezone: "UTC" }, expectPolar: true },
    // Date-line extremes.
    { city: "Apia UTC+13", input: { latitude: -13.83, longitude: -171.76, date: "2025-06-15", timezone: "Pacific/Apia" } },
    { city: "UTC-12", input: { latitude: 0, longitude: -177, date: "2025-06-15", timezone: "Etc/GMT+12" } },
  ];

  for (const f of fixtures) {
    const r = moon.forLocationDate(f.input, now);
    if (!r.ok) { issues.push(`moonpos.${f.city}: returned an error (${r.field}: ${r.message})`); continue; }
    const { data, envelope } = r.value;

    // Envelope honesty.
    checkEnvelope(envelope, `moonpos.${f.city}`, issues);
    if (envelope.status !== "computed") issues.push(`moonpos.${f.city}: status must be computed, got ${envelope.status}`);
    if (envelope.provider) issues.push(`moonpos.${f.city}: computed data must not claim a live provider`);
    if (!envelope.generatedAt || !envelope.validFrom || !envelope.validUntil) issues.push(`moonpos.${f.city}: envelope missing timestamps`);

    if (!data) { issues.push(`moonpos.${f.city}: data must not be null`); continue; }
    if (!getEntityById(data.objectEntityId)) issues.push(`moonpos.${f.city}: objectEntityId does not resolve`);
    if (data.method !== "computed") issues.push(`moonpos.${f.city}: method must be computed`);
    if (data.input.latitude !== f.input.latitude || data.input.longitude !== f.input.longitude) issues.push(`moonpos.${f.city}: coordinates not echoed`);

    // Position ranges.
    const p = data.position;
    if (!(p.altitudeDeg >= -90 && p.altitudeDeg <= 90)) issues.push(`moonpos.${f.city}: altitude out of range: ${p.altitudeDeg}`);
    if (!(p.azimuthDeg >= 0 && p.azimuthDeg < 360.0001)) issues.push(`moonpos.${f.city}: azimuth out of range: ${p.azimuthDeg}`);
    if (!(p.declinationDeg >= -90 && p.declinationDeg <= 90)) issues.push(`moonpos.${f.city}: declination out of range: ${p.declinationDeg}`);
    if (!(p.rightAscensionDeg >= 0 && p.rightAscensionDeg < 360.0001)) issues.push(`moonpos.${f.city}: RA out of range: ${p.rightAscensionDeg}`);
    if (!(p.distanceKm > 350000 && p.distanceKm < 410000)) issues.push(`moonpos.${f.city}: distance implausible: ${p.distanceKm}`);

    // Phase contract + illumination consistency.
    const ph = data.phase;
    if (!known.has(ph.phase)) issues.push(`moonpos.${f.city}: invalid phase ${ph.phase}`);
    if (!(ph.illuminationFraction >= 0 && ph.illuminationFraction <= 1)) issues.push(`moonpos.${f.city}: illuminationFraction out of range`);
    if (Math.abs(ph.illuminationPercent - ph.illuminationFraction * 100) > 0.6) issues.push(`moonpos.${f.city}: illumination percent/fraction inconsistent`);
    if (!(ph.phaseAngleDeg >= 0 && ph.phaseAngleDeg <= 360)) issues.push(`moonpos.${f.city}: phaseAngle out of range`);

    // Horizon-flag consistency.
    const h = data.horizon;
    if (h.aboveHorizonAtReferenceTime !== p.altitudeDeg > -0.833) issues.push(`moonpos.${f.city}: aboveHorizon flag inconsistent with altitude ${p.altitudeDeg}`);
    if (h.alwaysAboveHorizon && h.alwaysBelowHorizon) issues.push(`moonpos.${f.city}: cannot be always-above AND always-below`);
    if (h.alwaysAboveHorizon && !(h.noMoonrise && h.noMoonset)) issues.push(`moonpos.${f.city}: always-above must have no moonrise/moonset`);
    if (h.alwaysBelowHorizon && !(h.noMoonrise && h.noMoonset)) issues.push(`moonpos.${f.city}: always-below must have no moonrise/moonset`);
    if (h.noMoonrise !== (data.events.moonrise.iso === null)) issues.push(`moonpos.${f.city}: noMoonrise flag inconsistent with moonrise event`);
    if (h.noMoonset !== (data.events.moonset.iso === null)) issues.push(`moonpos.${f.city}: noMoonset flag inconsistent with moonset event`);

    // Event ordering: transit altitude must exceed lower-transit-region; rise/set azimuths sane.
    const e = data.events;
    if (e.moonrise.azimuthDeg !== null && !(e.moonrise.azimuthDeg >= 0 && e.moonrise.azimuthDeg < 360.0001)) issues.push(`moonpos.${f.city}: rise azimuth out of range`);
    if (e.lunarTransit.altitudeDeg !== null && !(e.lunarTransit.altitudeDeg >= -90 && e.lunarTransit.altitudeDeg <= 90)) issues.push(`moonpos.${f.city}: transit altitude out of range`);

    if (f.expectPolar && !(h.alwaysAboveHorizon || h.alwaysBelowHorizon)) {
      issues.push(`moonpos.${f.city}: expected a polar (always-above/below) condition near the pole`);
    }

    // A reported upper transit MUST be a genuine meridian passage: hour angle ≈ 0.
    if (e.lunarTransit.iso) {
      const ha = moonTopocentric(new Date(e.lunarTransit.iso), f.input.latitude, f.input.longitude).hourAngleDeg;
      if (Math.abs(ha) > 1) issues.push(`moonpos.${f.city}: reported transit is not a culmination (hour angle ${ha.toFixed(2)}°, expected ~0)`);
    }

    // Numeric correctness anchors.
    if (f.moonriseUtcMin !== undefined) {
      const got = minuteOfDayUTC(data.events.moonrise.iso);
      if (got === null || Math.abs(got - f.moonriseUtcMin) > 8) issues.push(`moonpos.${f.city}: moonrise ${got} min UTC differs from expected ~${f.moonriseUtcMin}`);
    }
    if (f.moonriseAz !== undefined && e.moonrise.azimuthDeg !== null && Math.abs(e.moonrise.azimuthDeg - f.moonriseAz) > 6) {
      issues.push(`moonpos.${f.city}: moonrise azimuth ${e.moonrise.azimuthDeg} differs from expected ~${f.moonriseAz}`);
    }
    if (f.illumPercent !== undefined && Math.abs(ph.illuminationPercent - f.illumPercent) > 2) {
      issues.push(`moonpos.${f.city}: illumination ${ph.illuminationPercent}% differs from expected ~${f.illumPercent}%`);
    }
  }

  // Date-line anchoring: every non-null event must land on the requested LOCAL civil
  // date, across the UTC+13/+14 and UTC−12 extremes (the off-by-a-day invariant).
  const dateline: LocationInput[] = [
    { latitude: 1.87, longitude: -157.36, date: "2025-06-15", timezone: "Pacific/Kiritimati" },
    { latitude: -13.83, longitude: -171.76, date: "2025-06-15", timezone: "Pacific/Apia" },
    { latitude: 0, longitude: -177, date: "2025-06-15", timezone: "Etc/GMT+12" },
    { latitude: -43.95, longitude: -176.55, date: "2025-06-15", timezone: "Pacific/Chatham" },
  ];
  for (const input of dateline) {
    const r = moon.forLocationDate(input, now);
    if (!r.ok) { issues.push(`moonpos.dateline ${input.timezone}: returned an error (${r.field})`); continue; }
    const ev = r.value.data?.events;
    if (!ev) continue;
    for (const [label, iso] of [["moonrise", ev.moonrise.iso], ["moonset", ev.moonset.iso], ["transit", ev.lunarTransit.iso]] as const) {
      if (!iso) continue;
      const instant = new Date(iso);
      const local = new Date(instant.getTime() + timezoneOffsetMinutes(input.timezone as string, instant) * 60_000);
      const localDate = `${local.getUTCFullYear()}-${String(local.getUTCMonth() + 1).padStart(2, "0")}-${String(local.getUTCDate()).padStart(2, "0")}`;
      if (localDate !== input.date) issues.push(`moonpos.dateline ${input.timezone}: ${label} local date ${localDate} != requested ${input.date}`);
    }
  }

  return issues;
}

interface PlanetFixture {
  city: string;
  input: LocationInput;
  /** Optional: expect Venus elongation within ±3° (a numeric anchor). */
  venusElong?: number;
  /** Optional: expect this planet's window on this date. */
  expectWindow?: { planet: string; window: string };
}

/**
 * Validate the computed planet-visibility integration (Program S): envelope
 * honesty, the data contract, coordinate/elongation/magnitude ranges,
 * horizon/visibility consistency, transit-is-a-culmination, polar and date-line
 * handling, invalid input, and a numeric correctness anchor. Deterministic.
 */
export function validatePlanets(): string[] {
  const issues: string[] = [];
  const now = new Date("2026-06-29T00:00:00Z");

  // Invalid inputs → structured errors, never guessed values.
  const bad: { input: LocationInput; field: string }[] = [
    { input: { latitude: 91, longitude: 0, date: "2025-06-15" }, field: "latitude" },
    { input: { latitude: 0, longitude: 200, date: "2025-06-15" }, field: "longitude" },
    { input: { latitude: 0, longitude: 0, date: "not-a-date" }, field: "date" },
    { input: { latitude: 0, longitude: 0, date: "2025-06-15", timezone: "Nowhere/Nowhere" }, field: "timezone" },
  ];
  for (const b of bad) {
    const r = planets.forLocationDate(b.input, now);
    if (r.ok) issues.push(`planets: expected a ${b.field} error for ${JSON.stringify(b.input)}`);
    else if (r.field !== b.field) issues.push(`planets: expected error field ${b.field}, got ${r.field}`);
  }

  const fixtures: PlanetFixture[] = [
    // 2025-01-01: Venus near greatest evening elongation (~47°); Mars & Jupiter near opposition (all-night).
    { city: "Prague", input: { latitude: 50.0755, longitude: 14.4378, date: "2025-01-01", timezone: "Europe/Prague" }, venusElong: 47, expectWindow: { planet: "Jupiter", window: "all-night" } },
    { city: "Quito", input: { latitude: -0.1807, longitude: -78.4678, date: "2025-06-15", timezone: "America/Guayaquil" } },
    { city: "Sydney", input: { latitude: -33.8688, longitude: 151.2093, date: "2025-06-15", timezone: "Australia/Sydney" } },
    { city: "Tromso", input: { latitude: 69.6492, longitude: 18.9553, date: "2025-06-15", timezone: "Europe/Oslo" } },
    { city: "Longyearbyen", input: { latitude: 78.2232, longitude: 15.6267, date: "2025-12-21", timezone: "Arctic/Longyearbyen" } },
    { city: "Kiritimati UTC+14", input: { latitude: 1.87, longitude: -157.36, date: "2025-06-15", timezone: "Pacific/Kiritimati" } },
    { city: "UTC-12", input: { latitude: 0, longitude: -177, date: "2025-06-15", timezone: "Etc/GMT+12" } },
  ];

  for (const f of fixtures) {
    const r = planets.forLocationDate(f.input, now);
    if (!r.ok) { issues.push(`planets.${f.city}: returned an error (${r.field}: ${r.message})`); continue; }
    const { data, envelope } = r.value;

    checkEnvelope(envelope, `planets.${f.city}`, issues);
    if (envelope.status !== "computed") issues.push(`planets.${f.city}: status must be computed, got ${envelope.status}`);
    if (envelope.provider) issues.push(`planets.${f.city}: computed data must not claim a live provider`);
    if (!envelope.generatedAt || !envelope.validFrom || !envelope.validUntil) issues.push(`planets.${f.city}: envelope missing timestamps`);
    if (!data) { issues.push(`planets.${f.city}: data must not be null`); continue; }
    if (data.method !== "computed") issues.push(`planets.${f.city}: method must be computed`);
    if (data.input.latitude !== f.input.latitude || data.input.longitude !== f.input.longitude) issues.push(`planets.${f.city}: coordinates not echoed`);
    if (data.planets.length !== 5) issues.push(`planets.${f.city}: default response must have 5 naked-eye planets, got ${data.planets.length}`);

    for (const p of data.planets) {
      const ctx = `planets.${f.city}.${p.planetName}`;
      if (!getEntityById(p.objectEntityId)) issues.push(`${ctx}: objectEntityId does not resolve: ${p.objectEntityId}`);
      const pos = p.position;
      if (!(pos.altitudeDeg >= -90 && pos.altitudeDeg <= 90)) issues.push(`${ctx}: altitude out of range: ${pos.altitudeDeg}`);
      if (!(pos.azimuthDeg >= 0 && pos.azimuthDeg < 360.0001)) issues.push(`${ctx}: azimuth out of range: ${pos.azimuthDeg}`);
      if (!(pos.declinationDeg >= -90 && pos.declinationDeg <= 90)) issues.push(`${ctx}: declination out of range: ${pos.declinationDeg}`);
      if (!(pos.rightAscensionDeg >= 0 && pos.rightAscensionDeg < 360.0001)) issues.push(`${ctx}: RA out of range: ${pos.rightAscensionDeg}`);
      if (!(pos.elongationDeg >= 0 && pos.elongationDeg <= 180)) issues.push(`${ctx}: elongation out of range: ${pos.elongationDeg}`);
      if (!(pos.distanceAu > 0 && pos.distanceAu < 40)) issues.push(`${ctx}: distance implausible: ${pos.distanceAu}`);
      if (!(pos.apparentMagnitude > -6 && pos.apparentMagnitude < 12)) issues.push(`${ctx}: magnitude implausible: ${pos.apparentMagnitude}`);

      // Horizon / visibility consistency.
      const v = p.visibility;
      if (v.aboveHorizonAtReferenceTime !== pos.altitudeDeg > -0.5667) issues.push(`${ctx}: aboveHorizon flag inconsistent with altitude ${pos.altitudeDeg}`);
      const belowAllDay = p.status.includes("below_horizon_all_day");
      if (belowAllDay && (p.events.rise.iso !== null || p.events.set.iso !== null)) issues.push(`${ctx}: below-all-day must have null rise/set`);
      if (v.visibleTonight !== p.status.includes("normal")) issues.push(`${ctx}: visibleTonight must match a 'normal' status`);
      if (v.visibleTonight && p.status.includes("not_visible")) issues.push(`${ctx}: cannot be visible and not_visible`);

      // A reported transit must be a genuine culmination (hour angle ≈ 0).
      if (p.events.transit.iso) {
        const ha = equatorialToHorizontal(pos.rightAscensionDeg, pos.declinationDeg, f.input.latitude, f.input.longitude, new Date(p.events.transit.iso)).hourAngleDeg;
        if (Math.abs(ha) > 1) issues.push(`${ctx}: reported transit is not a culmination (hour angle ${ha.toFixed(2)}°)`);
      }
    }

    if (f.venusElong !== undefined) {
      const venus = data.planets.find((p) => p.planetName === "Venus");
      if (venus && Math.abs(venus.position.elongationDeg - f.venusElong) > 3) issues.push(`planets.${f.city}: Venus elongation ${venus.position.elongationDeg}° differs from expected ~${f.venusElong}°`);
    }
    if (f.expectWindow) {
      const pl = data.planets.find((p) => p.planetName === f.expectWindow!.planet);
      if (pl && pl.visibility.morningOrEvening !== f.expectWindow.window) issues.push(`planets.${f.city}: ${f.expectWindow.planet} window ${pl.visibility.morningOrEvening} != expected ${f.expectWindow.window}`);
    }
  }

  // Date-line anchoring: every non-null event lands on the requested LOCAL civil date.
  const dateline: LocationInput[] = [
    { latitude: 1.87, longitude: -157.36, date: "2025-06-15", timezone: "Pacific/Kiritimati" },
    { latitude: 0, longitude: -177, date: "2025-06-15", timezone: "Etc/GMT+12" },
  ];
  for (const input of dateline) {
    const r = planets.forLocationDate(input, now);
    if (!r.ok || !r.value.data) { issues.push(`planets.dateline ${input.timezone}: error`); continue; }
    for (const p of r.value.data.planets) {
      for (const [label, iso] of [["rise", p.events.rise.iso], ["transit", p.events.transit.iso], ["set", p.events.set.iso]] as const) {
        if (!iso) continue;
        const inst = new Date(iso);
        const local = new Date(inst.getTime() + timezoneOffsetMinutes(input.timezone as string, inst) * 60_000);
        const ld = `${local.getUTCFullYear()}-${String(local.getUTCMonth() + 1).padStart(2, "0")}-${String(local.getUTCDate()).padStart(2, "0")}`;
        if (ld !== input.date) issues.push(`planets.dateline ${input.timezone}: ${p.planetName} ${label} local date ${ld} != ${input.date}`);
      }
    }
  }

  return issues;
}
