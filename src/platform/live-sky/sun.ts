import { computedEnvelope, type Enveloped } from "@/platform/live-sky/schema";
import type { SunData, SunEvent, SolarDayCondition } from "@/platform/live-sky/models";
import {
  resolveLocation,
  timezoneOffsetMinutes,
  type LocationInput,
  type LocationField,
  type ResolvedLocation,
} from "@/platform/live-sky/location";
import {
  computeSolarDay,
  julianDayNumberUTC,
  julianDayToUnixMs,
  minutesAboveThreshold,
  type SolarDay,
} from "@/platform/live-sky/providers/solar-calculator";

/**
 * Sun & Twilight domain module (Program Q). Deterministically computes sunrise,
 * sunset, solar noon, the three twilight bands, day length, and a solar summary
 * for an explicit location and date — labelled `method: "computed"`, wrapped in
 * a source-backed honesty envelope, and honest about polar day/night (events are
 * null where they genuinely do not occur). No location is inferred or stored.
 */

export const SUN_ENTITY_ID = "star:sun";

const round = (x: number, dp: number): number => Math.round(x * 10 ** dp) / 10 ** dp;
const pad = (n: number): string => String(n).padStart(2, "0");

const CALC_NOTES =
  "Computed with the public-domain NOAA Solar Calculator algorithm, modelling the Sun's centre at −0.833° for sunrise/sunset (34′ refraction + 16′ semidiameter) and −6°/−12°/−18° for civil/nautical/astronomical twilight. Accuracy ~1 minute for years 1901–2099. Local refraction, horizon height, and terrain are not modelled. An event is null where the Sun never crosses that altitude (polar day/night, or an absent twilight boundary).";

const PROVENANCE =
  "Computed deterministically from the public-domain NOAA Solar Calculator algorithm (NOAA Global Monitoring Laboratory), which implements the low-precision solar formulae of the Astronomical Almanac (US Naval Observatory / HM Nautical Almanac Office) — not fetched from any live provider. Location is used only for this calculation and is not stored.";

const LICENSE_NOTES =
  "Computed values. The underlying solar formulae and constants are public-domain astronomical quantities; no provider data is redistributed.";

/** A wall-clock "HH:mm" for a UTC instant shifted by a timezone offset. */
function wallClock(instant: Date, offsetMinutes: number): string {
  const local = new Date(instant.getTime() + offsetMinutes * 60_000);
  return `${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}`;
}

/** The result of a Sun computation: either the enveloped data, or a structured validation error. */
export type SunResult =
  | { ok: true; value: Enveloped<SunData> }
  | { ok: false; field: LocationField; message: string };

/**
 * Anchor the solar day so that SOLAR NOON falls on the requested LOCAL civil
 * date. The events are computed relative to a UTC calendar day; naively using
 * the UTC date of the input is wrong for zones far from UTC (±12…14 h), where
 * local noon and solar noon can straddle UTC midnight. We start from the UTC day
 * that contains local clock-noon and correct by ±1 day until the computed solar
 * noon lands on the requested local date. Deterministic; at most one correction.
 */
function anchorSolarDay(loc: ResolvedLocation): { day: SolarDay; baseMs: number } {
  const off = loc.utcOffsetMinutes; // minutes east of UTC (0 for the UTC default)
  const guessMs = Date.UTC(loc.year, loc.month - 1, loc.day, 12, 0, 0) - off * 60_000;
  const g = new Date(guessMs);
  let jd = julianDayNumberUTC(g.getUTCFullYear(), g.getUTCMonth() + 1, g.getUTCDate());
  let day = computeSolarDay(jd, loc.latitude, loc.longitude);
  for (let i = 0; i < 2; i++) {
    const noonMs = julianDayToUnixMs(jd) + day.solarNoonMinutesUTC * 60_000;
    const localNoon = new Date(noonMs + off * 60_000);
    const localDate = `${localNoon.getUTCFullYear()}-${pad(localNoon.getUTCMonth() + 1)}-${pad(localNoon.getUTCDate())}`;
    if (localDate === loc.date) break;
    jd += localDate < loc.date ? 1 : -1;
    day = computeSolarDay(jd, loc.latitude, loc.longitude);
  }
  return { day, baseMs: julianDayToUnixMs(jd) };
}

function classify(day: SolarDay): SolarDayCondition[] {
  const cos = day.thresholds.sunrise.cosHourAngle;
  if (cos < -1) return ["polar_day"]; // Sun never sinks to −0.833° — 24 h daylight
  if (cos > 1) return ["polar_night"]; // Sun never rises to −0.833° — 24 h below the horizon
  const conditions: SolarDayCondition[] = ["normal"];
  // "Too bright" summer conditions: the Sun never sinks below a twilight band's lower edge.
  if (day.thresholds.civil.cosHourAngle < -1) conditions.push("no_civil_twilight");
  if (day.thresholds.nautical.cosHourAngle < -1) conditions.push("no_nautical_twilight");
  if (day.thresholds.astronomical.cosHourAngle < -1) conditions.push("no_astronomical_twilight");
  return conditions;
}

/**
 * Compute the Sun & Twilight data for an explicit location and date. `now` is the
 * real computation time recorded in the envelope. Validation failures return a
 * structured error rather than a guessed value.
 */
function forLocationDate(input: LocationInput, now: Date): SunResult {
  const resolved = resolveLocation(input);
  if (!resolved.ok) return { ok: false, field: resolved.field, message: resolved.message };
  const loc = resolved.location;

  const { day, baseMs } = anchorSolarDay(loc);

  const event = (minutesUTC: number | null): SunEvent => {
    if (minutesUTC == null) return { iso: null, local: null };
    const instant = new Date(baseMs + minutesUTC * 60_000);
    const offset = loc.timezoneProvided ? timezoneOffsetMinutes(loc.timezone, instant) : 0;
    return { iso: instant.toISOString(), local: wallClock(instant, offset) };
  };

  const noon = day.solarNoonMinutesUTC;
  const pair = (key: "sunrise" | "civil" | "nautical" | "astronomical") => {
    const half = day.thresholds[key].halfDayMinutes;
    return {
      dawn: event(half == null ? null : noon - half),
      dusk: event(half == null ? null : noon + half),
    };
  };
  const s = pair("sunrise");
  const c = pair("civil");
  const n = pair("nautical");
  const a = pair("astronomical");

  const aboveSunrise = minutesAboveThreshold(day.thresholds.sunrise);
  const aboveCivil = minutesAboveThreshold(day.thresholds.civil);
  const aboveNautical = minutesAboveThreshold(day.thresholds.nautical);
  const aboveAstro = minutesAboveThreshold(day.thresholds.astronomical);
  const band = (x: number): number => round(Math.max(0, x), 0);

  const data: SunData = {
    objectEntityId: SUN_ENTITY_ID,
    input: {
      latitude: loc.latitude,
      longitude: loc.longitude,
      date: loc.date,
      timezone: loc.timezone,
      utcOffsetMinutes: loc.utcOffsetMinutes,
    },
    events: {
      sunrise: s.dawn,
      sunset: s.dusk,
      solarNoon: event(noon),
      civilDawn: c.dawn,
      civilDusk: c.dusk,
      nauticalDawn: n.dawn,
      nauticalDusk: n.dusk,
      astronomicalDawn: a.dawn,
      astronomicalDusk: a.dusk,
    },
    duration: {
      daylightMinutes: band(aboveSunrise),
      civilTwilightMinutes: band(aboveCivil - aboveSunrise),
      nauticalTwilightMinutes: band(aboveNautical - aboveCivil),
      astronomicalTwilightMinutes: band(aboveAstro - aboveNautical),
    },
    solar: {
      declinationDeg: round(day.declinationDeg, 2),
      equationOfTimeMinutes: round(day.eqTimeMin, 2),
      noonElevationDeg: round(day.noonElevationDeg, 2),
    },
    status: classify(day),
    method: "computed",
    calculationNotes: CALC_NOTES,
  };

  // A location-date computation is an exact, immutable POINT value — it is the
  // solar day of one date and never decays — so validFrom == validUntil == the
  // solar-noon instant (mirroring moon.at). withStaleness is deliberately not
  // applied: it is never "stale".
  const solarNoonIso = new Date(baseMs + day.solarNoonMinutesUTC * 60_000).toISOString();
  const envelope = computedEnvelope({
    source: ["noaa", "usno"],
    generatedAt: now.toISOString(),
    validFrom: solarNoonIso,
    validUntil: solarNoonIso,
    confidence: "modeled",
    provenance: PROVENANCE,
    licenseNotes: LICENSE_NOTES,
  });

  return { ok: true, value: { data, envelope } };
}

/** The Sun data surface (wrapped by engine.liveSky.sun). */
export const sun = {
  linkedEntityIds: [SUN_ENTITY_ID],
  /** Compute Sun & Twilight for an explicit location and date. */
  forLocationDate,
};
