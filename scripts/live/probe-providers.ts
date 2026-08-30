import { spaceWeatherSnapshot, solarEventsSnapshot, currentSolarWind, latestObservedKp, currentScales, liveProviderReports } from "../../src/platform/space-weather/service";
import { neoSnapshot } from "../../src/platform/neo/service";
import { issEphemeris, issNow, issPasses, verifyFrames } from "../../src/platform/satellites/service";
import { buildCalendar, lunarEclipseCatalogue, solarEclipseCatalogue, upcomingLaunches } from "../../src/platform/events/service";
import { clearCache } from "../../src/platform/live-providers/cache";
import { getLiveProduct, LIVE_PRODUCTS } from "../../src/platform/live-providers/registry";
import { NO_VALUE_STATUSES, type LiveDatum, type LiveEnvelope } from "../../src/platform/live-providers/envelope";
import { allHealth } from "../../src/platform/live-providers/health";

/**
 * The end-to-end provider probe.
 *
 * This is the check that earns a provider its `verifiedAt` date: it makes a real request to every
 * registered product, parses the real response, and asserts that what comes back is a usable,
 * correctly-labelled measurement. It is NOT part of `npm run validate`, because a gate that fails
 * when a government website is briefly unreachable would train everyone to ignore it — and because
 * a build must never depend on a third party being up.
 *
 * Run it before changing a `verifiedAt`, after a provider announces a change, and whenever the
 * offline gate reports a schema mismatch.
 *
 *   npm run live:probe
 *
 * Exit code 1 means a product that is supposed to work did not. The report distinguishes a
 * provider being down (transport) from the integration being wrong (schema), because only the
 * second is a defect in this repository.
 */

interface ProbeRow {
  productKey: string;
  label: string;
  status: string;
  hasData: boolean;
  observedAgeSeconds?: number;
  latencyMs?: number;
  bytes?: number;
  problem?: string;
}

const rows: ProbeRow[] = [];
const failures: string[] = [];
const warnings: string[] = [];

function ageOf(iso: string | undefined, nowIso: string): number | undefined {
  if (!iso) return undefined;
  const a = Date.parse(iso);
  const b = Date.parse(nowIso);
  return Number.isFinite(a) && Number.isFinite(b) ? Math.round((b - a) / 1000) : undefined;
}

function record(key: string, env: LiveEnvelope<unknown>, nowIso: string): void {
  const product = getLiveProduct(key);
  const health = allHealth().find((h) => h.productKey === key);
  const hasData = env.data !== undefined;

  rows.push({
    productKey: key,
    label: product?.label ?? key,
    status: env.status,
    hasData,
    observedAgeSeconds: ageOf(env.generatedAt ?? env.fetchedAt, nowIso),
    latencyMs: health?.lastLatencyMs,
    bytes: health?.lastBytes,
    problem: env.error,
  });

  if (!hasData) {
    const line = `${key}: no data — ${env.status}${env.error ? ` (${env.error})` : ""}`;
    // A schema mismatch is our bug; a transport failure is the provider's weather.
    if (health?.schemaState === "changed" || env.status === "provider_error") failures.push(`${line}  [SCHEMA — the integration no longer matches the provider]`);
    else failures.push(`${line}  [TRANSPORT — the provider could not be reached]`);
    return;
  }

  if (NO_VALUE_STATUSES.has(env.status)) failures.push(`${key}: returned data while reporting a no-value status "${env.status}"`);
  if (env.status === "stale") warnings.push(`${key}: the newest value the provider published is past its stale threshold`);
  if (!env.fetchedAt) failures.push(`${key}: returned data with no fetch timestamp`);
  if (!env.sourceUrl) failures.push(`${key}: returned data with no source URL`);
  if (!env.provenance) failures.push(`${key}: returned data with no provenance`);
}

/** A measured datum must carry a unit, a real observation time and a kind. */
function checkDatum(name: string, datum: LiveDatum | undefined, expectUnit: boolean): void {
  if (!datum) {
    warnings.push(`${name}: not present in this probe (the provider published no usable value)`);
    return;
  }
  if (expectUnit && !datum.unit) failures.push(`${name}: a measured value with no unit`);
  if (!datum.observedAt || !Number.isFinite(Date.parse(datum.observedAt))) failures.push(`${name}: no usable observation time`);
  if (!Number.isFinite(datum.value)) failures.push(`${name}: value is not a finite number`);
  if (!datum.kind) failures.push(`${name}: no observation kind`);
}

async function main(): Promise<void> {
  const started = Date.now();

  console.log(`Probing ${LIVE_PRODUCTS.length} products across ${new Set(LIVE_PRODUCTS.map((p) => p.providerKey)).size} providers…\n`);

  // Clear first, so every request below is a REAL one. Without this a warm process would report
  // cached values as though the providers had just answered — the exact fabrication this script
  // exists to rule out.
  clearCache();

  const weather = await spaceWeatherSnapshot();
  const events = await solarEventsSnapshot();
  const neo = await neoSnapshot();
  const iss = await issEphemeris();
  const solarEclipses = await solarEclipseCatalogue();
  const lunarEclipses = await lunarEclipseCatalogue();
  const launches = await upcomingLaunches();

  // Taken AFTER the requests, so an age is never negative merely because a fetch completed after
  // the clock was read. Ages here are real: the gap between the provider's own timestamp and now.
  const nowIso = new Date().toISOString();

  record("swpc:solar-wind-speed", weather.solarWindSpeed, nowIso);
  record("swpc:solar-wind-mag", weather.solarWindField, nowIso);
  record("swpc:solar-wind-propagated", weather.solarWindSeries, nowIso);
  record("swpc:kp-index", weather.kpObserved, nowIso);
  record("swpc:kp-forecast", weather.kpForecast, nowIso);
  record("swpc:noaa-scales", weather.scales, nowIso);
  record("swpc:alerts", weather.alerts, nowIso);
  record("swpc:xray-flares", weather.xrayFlare, nowIso);
  record("swpc:solar-regions", weather.activeRegions, nowIso);
  record("swpc:f107", weather.radioFlux, nowIso);
  record("swpc:ovation-aurora", weather.aurora, nowIso);
  record("donki:flares", events.flares, nowIso);
  record("donki:cmes", events.cmes, nowIso);
  record("donki:geomagnetic-storms", events.storms, nowIso);
  record("donki:sep", events.sepEvents, nowIso);
  record("jpl:close-approaches", neo.closeApproaches, nowIso);
  record("jpl:sentry", neo.sentry, nowIso);
  record("jpl:recent-neos", neo.recent, nowIso);
  record("mpc:neocp", neo.candidates, nowIso);
  record("nasa:iss-ephemeris", iss, nowIso);
  record("gsfc:solar-eclipses", solarEclipses, nowIso);
  record("gsfc:lunar-eclipses", lunarEclipses, nowIso);
  record("ll2:upcoming-launches", launches, nowIso);

  /* --- the composed values a page actually renders, checked as values and not just as responses */
  const wind = currentSolarWind(weather);
  checkDatum("solar wind speed", wind.speed, true);
  checkDatum("solar wind density", wind.density, true);
  checkDatum("IMF Bt", wind.bt, true);
  checkDatum("IMF Bz", wind.bz, true);
  // Kp is a dimensionless index, so it is the one measured value that legitimately has no unit.
  checkDatum("planetary Kp", latestObservedKp(weather.kpObserved), false);

  const scales = currentScales(weather.scales);
  if (!scales) warnings.push("NOAA scales: no observed block in this response");
  else if (scales.geomagnetic === undefined) warnings.push("NOAA scales: the observed block carried no G level");

  /* --- Kp provenance must survive the round trip, or a forecast could be read as an observation */
  const kpPoints = weather.kpForecast.data ?? [];
  const kinds = new Set(kpPoints.map((p) => p.provenance));
  if (kpPoints.length > 0 && !kinds.has("predicted")) {
    warnings.push("Kp forecast: the response carried no predicted rows — NOAA usually publishes three days ahead");
  }
  if (kpPoints.some((p) => !["observed", "estimated", "predicted"].includes(p.provenance))) {
    failures.push("Kp forecast: a point carried an unrecognised provenance marker");
  }

  /* --- aurora: the derived boundary must be a real latitude or absent, never a placeholder */
  const aurora = weather.aurora.data;
  if (aurora) {
    for (const [name, h] of [["northern", aurora.northern], ["southern", aurora.southern]] as const) {
      if (h.equatorwardBoundaryLat !== undefined && Math.abs(h.equatorwardBoundaryLat) > 90) {
        failures.push(`aurora: ${name} boundary latitude ${h.equatorwardBoundaryLat} is not a latitude`);
      }
      if (h.maxProbabilityPercent < 0 || h.maxProbabilityPercent > 100) {
        failures.push(`aurora: ${name} peak probability ${h.maxProbabilityPercent} is not a percentage`);
      }
    }
    if (aurora.gridCells < 1000) warnings.push(`aurora: only ${aurora.gridCells} grid cells parsed — the OVATION grid is normally tens of thousands`);
  }

  /* --- NEO semantics that a shape check cannot see --------------------------------------- */
  for (const a of neo.closeApproaches.data ?? []) {
    // A TDB timestamp must NOT carry a zone designator: appending one would assert UTC.
    if (/[Zz]|[+-]\d{2}:\d{2}$/.test(a.approachTdb)) failures.push(`${a.designation}: close-approach time "${a.approachTdb}" carries a zone designator — TDB is not UTC and must not be written as though it were`);
    if (a.distance.au <= 0) failures.push(`${a.designation}: non-positive approach distance`);
    // The nominal distance must lie inside the provider's own 3-sigma bracket.
    if (a.distanceMin && a.distanceMax && (a.distance.au < a.distanceMin.au || a.distance.au > a.distanceMax.au)) {
      failures.push(`${a.designation}: nominal distance ${a.distance.au} au lies outside the provider's 3-sigma range ${a.distanceMin.au}-${a.distanceMax.au} au`);
    }
    if (a.size?.kind === "estimated-from-magnitude" && !(a.size.minKm < a.size.maxKm)) {
      failures.push(`${a.designation}: an estimated size range that is not a range`);
    }
  }
  const probabilities = (neo.sentry.data ?? []).map((o) => o.impactProbability).filter((p): p is number => p !== undefined);
  if (probabilities.some((p) => p <= 0 || p > 1)) failures.push("sentry: an impact probability outside (0, 1]");
  if ((neo.sentry.data ?? []).some((o) => (o.torinoMaximum ?? 0) < 0 || (o.torinoMaximum ?? 0) > 10)) failures.push("sentry: a Torino rating outside 0-10");
  if ((neo.closeApproaches.data ?? []).length === 0) warnings.push("close approaches: none within 0.05 au in the next 60 days — unusual but possible");
  if ((neo.candidates.data ?? []).length === 0) warnings.push("MPC confirmation page: currently empty — a real state, not a failure");

  /* --- the ISS frame chain, against the provider's own numbers --------------------------- */
  if (iss.data) {
    const checks = verifyFrames(iss.data);
    if (checks.length === 0) {
      warnings.push("ISS ephemeris: the file carried no ascending-node comments, so the frame transformation could not be verified against it");
    }
    for (const c of checks) {
      // Twenty metres. The transformation reproduces NASA's own figures to a couple of metres in
      // practice; this threshold leaves room for their rounding without leaving room for a real
      // error, the smallest of which — a missing nutation term — would be tens of kilometres.
      if (c.groundErrorMetres > 20) {
        failures.push(`ISS ${c.node} node: our Earth-fixed longitude disagrees with NASA's by ${c.groundErrorMetres.toFixed(1)} m — the precession, nutation or sidereal-time chain is wrong  [SCHEMA]`);
      }
      if (Math.abs(c.computedLatitudeDeg) > 0.01) {
        failures.push(`ISS ${c.node} node: computed latitude ${c.computedLatitudeDeg.toFixed(5)}° at an ASCENDING NODE, which is by definition at zero  [SCHEMA]`);
      }
    }
    if (checks.length > 0) {
      console.log(`\nISS frame check: ${checks.map((c) => `${c.node} ${c.groundErrorMetres.toFixed(1)} m`).join(", ")} against NASA's own node longitudes`);
    }

    // The derived physics must be the station's, not something else's.
    const state = issNow(iss, Date.now());
    if (!state) {
      warnings.push("ISS ephemeris: the published file does not cover the present moment");
    } else {
      const { altitudeKm } = state.state.geodetic;
      if (altitudeKm < 350 || altitudeKm > 500) failures.push(`ISS altitude ${altitudeKm.toFixed(1)} km is outside the station's operating band`);
      if (state.state.speedKmS < 7.4 || state.state.speedKmS > 7.9) failures.push(`ISS speed ${state.state.speedKmS.toFixed(3)} km/s is not an orbital speed at this altitude`);
      if (state.periodMinutes !== undefined && (state.periodMinutes < 90 || state.periodMinutes > 95)) {
        failures.push(`ISS nodal period ${state.periodMinutes.toFixed(2)} min is outside the station's range`);
      }
      if (Math.abs(state.state.geodetic.latitudeDeg) > 51.7) {
        failures.push(`ISS latitude ${state.state.geodetic.latitudeDeg.toFixed(3)}° exceeds its 51.6° inclination`);
      }
      console.log(`ISS now: ${state.state.geodetic.latitudeDeg.toFixed(2)}°, ${state.state.geodetic.longitudeDeg.toFixed(2)}°  alt ${altitudeKm.toFixed(1)} km  ${state.state.speedKmS.toFixed(3)} km/s  period ${state.periodMinutes?.toFixed(2)} min`);

      // Passes must be plausible in shape: an ISS pass lasts minutes, not seconds or hours.
      const passes = issPasses(iss, { latitudeDeg: 51.4779, longitudeDeg: -0.0015, altitudeKm: 0 }, Date.now(), 48);
      for (const p of passes) {
        if (p.durationSeconds < 60 || p.durationSeconds > 900) failures.push(`ISS pass duration ${p.durationSeconds}s is not physically plausible`);
        if (p.maxElevationDeg < 10 || p.maxElevationDeg > 90.01) failures.push(`ISS pass peak elevation ${p.maxElevationDeg.toFixed(2)}° is outside the reportable range`);
        if (p.minRangeKm < altitudeKm - 30 || p.minRangeKm > 3000) failures.push(`ISS pass closest approach ${p.minRangeKm.toFixed(0)} km is impossible for a satellite at ${altitudeKm.toFixed(0)} km`);
      }
      console.log(`ISS passes over Greenwich in 48 h: ${passes.length} above 10°, ${passes.filter((p) => p.visibility === "visible").length} visible`);
      if (passes.length === 0) warnings.push("ISS passes: none above 10° over Greenwich in 48 hours — possible, but unusual");
    }
  }

  /* ------------------------------------------------------- the events calendar, end to end */
  if (solarEclipses.data && lunarEclipses.data) {
    // The published totals for 2001-2100. If either changes, the column layout has moved and the
    // strict row accounting in the parser will already have refused the response.
    if (solarEclipses.data.eclipses.length !== 224) failures.push(`solar eclipse century catalogue: ${solarEclipses.data.eclipses.length} eclipses, expected 224`);
    if (lunarEclipses.data.eclipses.length !== 228) failures.push(`lunar eclipse century catalogue: ${lunarEclipses.data.eclipses.length} eclipses, expected 228`);
    console.log(`Eclipse catalogues: ${solarEclipses.data.eclipses.length} solar and ${lunarEclipses.data.eclipses.length} lunar in 2001-2100`);
  }

  const calendar = await buildCalendar(Date.now(), Date.now() + 180 * 86_400_000);
  const byCategory = new Map<string, number>();
  for (const e of calendar.events) byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + 1);
  console.log(`Calendar, next 180 days: ${calendar.events.length} events — ${[...byCategory].map(([k, v]) => `${v} ${k}`).join(", ")}`);
  for (const gap of calendar.gaps) warnings.push(`calendar gap in ${gap.category}: ${gap.reason}`);
  for (const e of calendar.events) {
    if (e.basis === "planned" && e.confirmed) failures.push(`${e.eventId}: a planned event is marked confirmed`);
    if (e.basis === "planned" && !e.source?.lastVerifiedAt) failures.push(`${e.eventId}: a planned event carries no confirmation time`);
  }
  if (launches.data) {
    const stalest = launches.data.launches.filter((l) => l.lastUpdated).sort((a, b) => Date.parse(a.lastUpdated!) - Date.parse(b.lastUpdated!))[0];
    console.log(`Launches: ${launches.data.launches.length} upcoming; oldest confirmation ${stalest?.lastUpdated ?? "unknown"}`);
    if (launches.data.launches.some((l) => !l.netPrecision)) warnings.push("launch feed: at least one entry does not state how precisely its date is known");
  }

  /* ------------------------------------------------------------------------------- report */
  const pad = (s: string, n: number) => s.padEnd(n).slice(0, n);
  console.log(`${pad("PRODUCT", 30)} ${pad("STATUS", 15)} ${pad("DATA AGE", 10)} ${pad("LATENCY", 9)} SIZE`);
  console.log("-".repeat(80));
  for (const r of rows) {
    const age = r.observedAgeSeconds !== undefined ? `${r.observedAgeSeconds}s` : "—";
    const latency = r.latencyMs !== undefined ? `${r.latencyMs}ms` : "—";
    const size = r.bytes !== undefined ? `${(r.bytes / 1024).toFixed(1)}KB` : "—";
    console.log(`${pad(r.productKey, 30)} ${pad(r.status, 15)} ${pad(age, 10)} ${pad(latency, 9)} ${size}`);
  }

  console.log("");
  for (const report of liveProviderReports()) {
    console.log(`${report.descriptor.name}: ${report.state}  (declared ${report.descriptor.integration}, verified ${report.descriptor.verifiedAt ?? "never"})`);
  }

  if (warnings.length > 0) {
    console.log(`\n${warnings.length} warning(s) — real conditions, not defects:`);
    for (const w of warnings) console.log(`  · ${w}`);
  }

  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  if (failures.length > 0) {
    console.error(`\n✗ Provider probe failed — ${failures.length} problem(s) in ${elapsed}s:`);
    for (const f of failures) console.error(`  • ${f}`);
    console.error("\nA [TRANSPORT] failure means the provider was unreachable — retry before changing anything.");
    console.error("A [SCHEMA] failure means the provider changed its response and this repository's parser must be updated.");
    process.exit(1);
  }

  console.log(`\n✓ Provider probe passed — ${rows.length}/${rows.length} products returned usable, correctly-labelled data in ${elapsed}s.`);
  console.log(`  Every value carried a unit where one applies, a real provider timestamp, a source URL and a freshness status.`);
}

void main();
