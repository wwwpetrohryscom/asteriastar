import { spaceWeatherSnapshot, solarEventsSnapshot, currentSolarWind, latestObservedKp, currentScales, liveProviderReports } from "../../src/platform/space-weather/service";
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

  const weather = await spaceWeatherSnapshot();
  const events = await solarEventsSnapshot();

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
