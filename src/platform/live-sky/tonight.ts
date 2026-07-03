import { computedEnvelope, withStaleness, type Enveloped } from "@/platform/live-sky/schema";
import type { TonightObservingData, TonightPlanet, TonightWindow } from "@/platform/live-sky/models";
import {
  resolveLocation,
  isValidIanaTimeZone,
  timezoneOffsetMinutes,
  type LocationInput,
  type LocationField,
  type ResolvedLocation,
} from "@/platform/live-sky/location";
import { sun } from "@/platform/live-sky/sun";
import { moon } from "@/platform/live-sky/moon";
import { planets } from "@/platform/live-sky/planets";
import { darknessSummary, moonDarkOverlap } from "@/platform/live-sky/observing-windows";
import { planetObservabilityScore, moonlightImpact } from "@/platform/live-sky/observability-score";

/**
 * Tonight Observing Dashboard (Program T). A COMPOSITION layer: it calls the
 * computed Sun, Moon, and Planet engine surfaces (sun/moon/planets.forLocationDate)
 * and aggregates them into one honest "what can I observe tonight?" answer. It adds
 * NO new astronomy — it only classifies the night, ranks the planets with a
 * documented score, and works out the Moon's impact. A sub-engine failure leaves
 * that section null with a clear limitation; nothing is ever fabricated, and no
 * weather, cloud, seeing, transparency, light-pollution, ISS, aurora, meteor, or
 * comet data is invented. Location is only ever what the caller passes in.
 */

const pad = (n: number): string => String(n).padStart(2, "0");

const CALC_NOTES =
  "A composite of the computed Sun & Twilight, Moon, and Planet engines (no new astronomy). Night classification uses the Sun's astronomical-darkness minutes (below −18°). The Moon's impact: low if illumination < 35% or the Moon is below the horizon during the dark window, high if > 70% and up during it, else moderate. The planet observability score (0–100) weights altitude-in-darkness 0.5, brightness 0.3, and Sun elongation 0.2. Positions and the Moon's altitude are for the reference time (now for a current query, else local noon of the requested date).";

const ACCURACY_NOTES =
  "Computed observing GUIDANCE, not a guarantee. It inherits the sub-engines' accuracy (~1–2 min for rise/set/twilight, ~0.1° for positions, ~±0.3–0.5 mag). It does NOT model weather, cloud cover, atmospheric seeing or transparency, or light pollution, and does not include ISS passes, aurora, meteor showers, or comets.";

function localDateOf(instant: Date, timezone: string | undefined): string {
  const off = timezone && isValidIanaTimeZone(timezone) ? timezoneOffsetMinutes(timezone, instant) : 0;
  const local = new Date(instant.getTime() + off * 60_000);
  return `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}`;
}
function localNoon(loc: ResolvedLocation): Date {
  return new Date(Date.UTC(loc.year, loc.month - 1, loc.day, 12, 0, 0) - loc.utcOffsetMinutes * 60_000);
}
/** The civil date one day after a YYYY-MM-DD string (UTC arithmetic). */
function addDays(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const nd = new Date(Date.UTC(y, m - 1, d) + 86_400_000);
  return `${nd.getUTCFullYear()}-${pad(nd.getUTCMonth() + 1)}-${pad(nd.getUTCDate())}`;
}
const msOf = (iso: string | null | undefined): number | null => (iso ? new Date(iso).getTime() : null);

/** Human-readable local time of an ISO instant in the resolved timezone. */
function localClock(loc: ResolvedLocation, iso: string | null): string | null {
  if (!iso) return null;
  const instant = new Date(iso);
  const off = loc.timezoneProvided ? timezoneOffsetMinutes(loc.timezone, instant) : 0;
  const wall = new Date(instant.getTime() + off * 60_000);
  return `${pad(wall.getUTCHours())}:${pad(wall.getUTCMinutes())}`;
}

export type TonightResult =
  | { ok: true; value: Enveloped<TonightObservingData> }
  | { ok: false; field: LocationField; message: string };

function build(input: LocationInput, now: Date): TonightResult {
  const isCurrent = !input.date;
  const sunDate = input.date ?? localDateOf(now, input.timezone);
  const resolved = resolveLocation({ ...input, date: sunDate });
  if (!resolved.ok) return { ok: false, field: resolved.field, message: resolved.message };
  const loc = resolved.location;
  const refTime = isCurrent ? now : localNoon(loc);

  // Compose the computed sub-engines. Sun always needs an explicit date; the Moon
  // and Planets default to "now" for a current query (else the requested date).
  const sunRes = sun.forLocationDate({ ...input, date: sunDate }, now);
  const moonRes = moon.forLocationDate(input, now);
  const planetsRes = planets.forLocationDate(input, now);

  const sunData = sunRes.ok ? sunRes.value.data : null;
  const moonData = moonRes.ok ? moonRes.value.data : null;
  const planetsData = planetsRes.ok ? planetsRes.value.data : null;

  // The observing night runs from THIS date's dusk to the NEXT date's dawn, so
  // also compose the next day's Sun and Moon to close the window honestly.
  const nextDate = addDays(sunDate);
  const sunNextRes = sun.forLocationDate({ ...input, date: nextDate }, now);
  const moonNextRes = moon.forLocationDate({ ...input, date: nextDate }, now);
  const sunNextData = sunNextRes.ok ? sunNextRes.value.data : null;
  const moonNextData = moonNextRes.ok ? moonNextRes.value.data : null;

  const limitations: string[] = [];
  if (!sunRes.ok) limitations.push(`Sun & twilight data unavailable (${sunRes.message}).`);
  if (!moonRes.ok) limitations.push(`Moon data unavailable (${moonRes.message}).`);
  if (!planetsRes.ok) limitations.push(`Planet data unavailable (${planetsRes.message}).`);
  limitations.push("No weather, cloud, seeing, transparency, or light-pollution data is included.");

  // --- Sun / darkness ---
  const dark = sunData ? darknessSummary(sunData, sunNextData) : null;
  if (dark?.nightType === "no_darkness") limitations.push("The sky never gets fully dark (astronomical) on this date.");
  if (dark?.nightType === "polar_day") limitations.push("The Sun does not set on this date — there is no night.");
  if (dark?.nightType === "short_night") limitations.push(`Astronomical darkness is brief (~${dark.darknessMinutes} min).`);

  const sunSection: TonightObservingData["sun"] = sunData
    ? {
        sunrise: sunData.events.sunrise,
        sunset: sunData.events.sunset,
        solarNoon: sunData.events.solarNoon,
        civilTwilight: { dawn: sunData.events.civilDawn, dusk: sunData.events.civilDusk },
        nauticalTwilight: { dawn: sunData.events.nauticalDawn, dusk: sunData.events.nauticalDusk },
        astronomicalTwilight: { dawn: sunData.events.astronomicalDawn, dusk: sunData.events.astronomicalDusk },
        daylightMinutes: sunData.duration.daylightMinutes,
        darknessWindows: dark?.darknessWindow ? [dark.darknessWindow] : [],
      }
    : null;

  // --- Moon ---
  const overlap = sunData && moonData ? moonDarkOverlap(sunData, sunNextData, moonData, moonNextData, loc) : null;
  const moonLimitations: string[] = [];
  if (moonData?.horizon.alwaysBelowHorizon) moonLimitations.push("The Moon is below the horizon all day.");
  if (overlap?.moonUpDuringDark === null && moonData) moonLimitations.push("No astronomical-dark window to assess the Moon's impact against.");
  const moonSection: TonightObservingData["moon"] = moonData
    ? {
        phaseName: moonData.phase.phaseName,
        illuminationPercent: moonData.phase.illuminationPercent,
        moonrise: moonData.events.moonrise,
        moonset: moonData.events.moonset,
        lunarTransit: moonData.events.lunarTransit,
        currentAltitudeDeg: moonData.position.altitudeDeg,
        currentAzimuthDeg: moonData.position.azimuthDeg,
        moonlightImpact: moonlightImpact(moonData.phase.illuminationPercent, overlap ? overlap.moonUpDuringDark : null),
        limitations: moonLimitations,
      }
    : null;

  // --- Planets (ranked) ---
  const tonightPlanets: TonightPlanet[] = (planetsData?.planets ?? []).map((p) => ({
    objectEntityId: p.objectEntityId,
    planetName: p.planetName,
    visibleTonight: p.visibility.visibleTonight,
    bestTimeIso: p.visibility.bestTimeIso,
    bestAltitudeDeg: p.visibility.bestAltitudeDeg,
    altitudeDeg: p.position.altitudeDeg,
    azimuthDeg: p.position.azimuthDeg,
    apparentMagnitude: p.position.apparentMagnitude,
    limitingFactors: p.visibility.limitingFactors,
    visibilityScore: planetObservabilityScore(p),
  }));
  const ranked = tonightPlanets
    .filter((p) => p.visibleTonight && p.visibilityScore !== null)
    .sort((a, b) => (b.visibilityScore ?? 0) - (a.visibilityScore ?? 0));

  // --- Recommendations ---
  const topPlanets = ranked.slice(0, 3).map((p) => p.planetName);

  let bestMoonObservingWindow: string | null = null;
  if (moonData) {
    const phase = `${moonData.phase.phaseName}, ${moonData.phase.illuminationPercent}% lit`;
    const transitIso = moonData.events.lunarTransit.iso;
    const tT = msOf(transitIso);
    const sunsetT = msOf(sunData?.events.sunset.iso);
    const sunriseNextT = msOf(sunNextData?.events.sunrise.iso);
    // A meaningful "best placed around transit" only holds if the transit is at
    // night (after sunset, before the next sunrise) — a crescent transits near
    // the Sun in daylight, which is not an observing window.
    const transitAtNight = tT !== null && sunsetT !== null && sunriseNextT !== null && tT >= sunsetT && tT <= sunriseNextT;
    if (moonData.horizon.alwaysBelowHorizon) bestMoonObservingWindow = `The Moon (${phase}) is below the horizon all night.`;
    else if (moonData.phase.illuminationPercent < 10) bestMoonObservingWindow = `The Moon is a thin ${phase} — little to observe.`;
    else if (transitAtNight && transitIso) bestMoonObservingWindow = `The Moon (${phase}) is best placed around its transit at ${localClock(loc, transitIso)}.`;
    else bestMoonObservingWindow = `The Moon (${phase}) is up mainly outside the dark hours tonight.`;
  }

  let bestDarkSkyWindow: string | null = null;
  if (dark?.darknessWindow && overlap) {
    const start = localClock(loc, dark.darknessWindow.startIso);
    const end = localClock(loc, dark.darknessWindow.endIso);
    if (overlap.moonUpDuringDark === false) bestDarkSkyWindow = `Dark and moonless from about ${start} to ${end}.`;
    else if (overlap.moonlessDarkMinutes > 0) bestDarkSkyWindow = `Astronomical dark ${start}–${end}; about ${overlap.moonlessDarkMinutes} min of it is moonless (when the Moon is down).`;
    else bestDarkSkyWindow = `Astronomical dark ${start}–${end}, but the Moon is up throughout — a brighter sky.`;
  } else if (dark && dark.darknessMinutes <= 0) {
    bestDarkSkyWindow = "No astronomical darkness on this date.";
  }

  const notAvailable = [
    "Weather, cloud cover, and atmospheric transparency",
    "Astronomical seeing",
    "Light pollution / sky brightness",
    "ISS and satellite passes",
    "Aurora forecasts",
    "Meteor-shower activity",
    "Comet visibility",
  ];

  const bestOverallWindow: TonightWindow | null = dark?.darknessWindow ?? null;

  const data: TonightObservingData = {
    input: {
      latitude: loc.latitude,
      longitude: loc.longitude,
      date: loc.date,
      timezone: loc.timezone,
      utcOffsetMinutes: loc.utcOffsetMinutes,
    },
    referenceTimeIso: refTime.toISOString(),
    summary: {
      observingDate: loc.date,
      locationStatus: "explicit coordinates",
      darknessAvailable: (dark?.darknessMinutes ?? 0) > 0,
      darknessMinutes: dark?.darknessMinutes ?? 0,
      nightType: dark?.nightType ?? "no_darkness",
      bestOverallWindow,
      limitations,
    },
    sun: sunSection,
    moon: moonSection,
    planets: tonightPlanets,
    recommendations: { topPlanets, bestMoonObservingWindow, bestDarkSkyWindow, notAvailable },
    method: "computed_composite",
    calculationNotes: CALC_NOTES,
    accuracyNotes: ACCURACY_NOTES,
  };

  const validFrom = refTime.toISOString();
  const validUntil = isCurrent ? new Date(refTime.getTime() + 3_600_000).toISOString() : validFrom;
  let envelope = computedEnvelope({
    // The composite draws on all three engines: NOAA (Sun), USNO (almanac
    // methodology across all three), and JPL (planetary elements).
    source: ["noaa", "usno", "jpl"],
    generatedAt: now.toISOString(),
    validFrom,
    validUntil,
    confidence: "modeled",
    provenance:
      "A deterministic composite of the computed Sun & Twilight, Moon, and Planet engines (each from public-domain formulae) — not fetched from any live provider, and it invents no weather, sky, or event data. Location is used only for this calculation and is not stored.",
    licenseNotes:
      "Computed values. The underlying formulae and constants are public-domain astronomical quantities; no provider data is redistributed.",
  });
  if (isCurrent) envelope = withStaleness(envelope, now.toISOString());

  return { ok: true, value: { data, envelope } };
}

export const tonight = {
  linkedEntityIds: ["star:sun", "moon:the-moon", "planet:earth"],
  /**
   * The Tonight observing dashboard for an explicit location and date, composed
   * from the Sun, Moon, and Planet engines. `now` is the real computation time.
   */
  forLocationDate: (input: LocationInput, now: Date): TonightResult => build(input, now),
};
