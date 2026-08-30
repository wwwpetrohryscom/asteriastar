import type { LiveDatum, LiveEnvelope } from "@/platform/live-providers/envelope";
import { NO_VALUE_STATUSES, refreshStatus } from "@/platform/live-providers/envelope";
import { getLiveProduct, getLiveProvider, LIVE_PRODUCTS, LIVE_PROVIDERS, providerState, type LiveProviderDescriptor } from "@/platform/live-providers/registry";
import { allHealth, getHealth, type ProviderHealth } from "@/platform/live-providers/health";
import * as swpc from "@/platform/space-weather/swpc";
import * as donki from "@/platform/space-weather/donki";
import type {
  KpPoint, NoaaScaleDay, SolarEventsSnapshot, SolarWindNow, SpaceWeatherAlert, SpaceWeatherSnapshot,
} from "@/platform/space-weather/model";

/**
 * The space-weather service (Program CJ).
 *
 * Composes the provider clients into the shapes the pages and the API need. Every composition
 * here is total: a failed provider degrades one field and leaves the rest of the snapshot intact,
 * because each field is its own envelope. Nothing in this file can produce a value — it only
 * arranges values the clients obtained, or reports their absence.
 */

/* ------------------------------------------------------------- snapshots */

/**
 * Fetch every space-weather product in parallel. `Promise.all` is safe here precisely because
 * `loadProduct` never rejects: one provider timing out cannot take the page down with it.
 */
export async function spaceWeatherSnapshot(): Promise<SpaceWeatherSnapshot> {
  const [solarWindSpeed, solarWindField, solarWindSeries, kpObserved, kpForecast, scales, alerts, xrayFlare, activeRegions, radioFlux, aurora] = await Promise.all([
    swpc.solarWindSpeed(),
    swpc.solarWindField(),
    swpc.solarWindSeries(),
    swpc.kpObserved(),
    swpc.kpForecast(),
    swpc.noaaScales(),
    swpc.alerts(),
    swpc.xrayFlare(),
    swpc.activeRegions(),
    swpc.radioFlux(),
    swpc.auroraForecast(),
  ]);
  return { solarWindSpeed, solarWindField, solarWindSeries, kpObserved, kpForecast, scales, alerts, xrayFlare, activeRegions, radioFlux, aurora };
}

/** The subset needed for a compact status module — three small products, not eleven. */
export async function compactSnapshot(): Promise<Pick<SpaceWeatherSnapshot, "solarWindSpeed" | "kpObserved" | "scales" | "xrayFlare">> {
  const [solarWindSpeed, kpObserved, scales, xrayFlare] = await Promise.all([
    swpc.solarWindSpeed(),
    swpc.kpObserved(),
    swpc.noaaScales(),
    swpc.xrayFlare(),
  ]);
  return { solarWindSpeed, kpObserved, scales, xrayFlare };
}

export async function solarEventsSnapshot(): Promise<SolarEventsSnapshot> {
  const [flares, cmes, storms, sepEvents] = await Promise.all([
    donki.flares(),
    donki.cmes(),
    donki.geomagneticStorms(),
    donki.sepEvents(),
  ]);
  return { flares, cmes, storms, sepEvents };
}

/** Just the solar-wind products, for the solar-wind page. */
export async function solarWindSnapshot(): Promise<Pick<SpaceWeatherSnapshot, "solarWindSpeed" | "solarWindField" | "solarWindSeries">> {
  const [solarWindSpeed, solarWindField, solarWindSeries] = await Promise.all([
    swpc.solarWindSpeed(),
    swpc.solarWindField(),
    swpc.solarWindSeries(),
  ]);
  return { solarWindSpeed, solarWindField, solarWindSeries };
}

/** Just the geomagnetic products. */
export async function geomagneticSnapshot(): Promise<Pick<SpaceWeatherSnapshot, "kpObserved" | "kpForecast" | "scales" | "alerts">> {
  const [kpObserved, kpForecast, scales, alerts] = await Promise.all([
    swpc.kpObserved(),
    swpc.kpForecast(),
    swpc.noaaScales(),
    swpc.alerts(),
  ]);
  return { kpObserved, kpForecast, scales, alerts };
}

/** Just the solar-activity products. */
export async function solarActivitySnapshot(): Promise<Pick<SpaceWeatherSnapshot, "xrayFlare" | "activeRegions" | "radioFlux"> & Pick<SolarEventsSnapshot, "flares" | "cmes">> {
  const [xrayFlare, activeRegions, radioFlux, flares, cmes] = await Promise.all([
    swpc.xrayFlare(),
    swpc.activeRegions(),
    swpc.radioFlux(),
    donki.flares(),
    donki.cmes(),
  ]);
  return { xrayFlare, activeRegions, radioFlux, flares, cmes };
}

/** Just the aurora products: the OVATION summary plus the Kp that drives the oval's size. */
export async function auroraSnapshot(): Promise<Pick<SpaceWeatherSnapshot, "aurora" | "kpObserved" | "kpForecast">> {
  const [aurora, kpObserved, kpForecast] = await Promise.all([
    swpc.auroraForecast(),
    swpc.kpObserved(),
    swpc.kpForecast(),
  ]);
  return { aurora, kpObserved, kpForecast };
}

/* ------------------------------------------------------------- composition */

/**
 * Current solar-wind conditions assembled from three products. Each field keeps the `kind` of the
 * product it came from: speed and field are L1 observations, density and temperature come from
 * the propagated model, and the difference is on the page rather than buried here.
 */
export function currentSolarWind(snapshot: Pick<SpaceWeatherSnapshot, "solarWindSpeed" | "solarWindField" | "solarWindSeries">): SolarWindNow {
  const out: SolarWindNow = {};

  const speed = snapshot.solarWindSpeed;
  if (speed.data && !NO_VALUE_STATUSES.has(speed.status)) {
    out.speed = { value: speed.data.speedKmS, unit: "km/s", observedAt: speed.data.observedAt, kind: "observation", status: speed.status, product: "Real-time solar wind summary" };
  }

  const field = snapshot.solarWindField;
  if (field.data && !NO_VALUE_STATUSES.has(field.status)) {
    out.bt = { value: field.data.btNt, unit: "nT", observedAt: field.data.observedAt, kind: "observation", status: field.status, product: "Real-time IMF summary" };
    out.bz = { value: field.data.bzNt, unit: "nT", observedAt: field.data.observedAt, kind: "observation", status: field.status, product: "Real-time IMF summary" };
  }

  const series = snapshot.solarWindSeries;
  if (series.data && series.data.length > 0 && !NO_VALUE_STATUSES.has(series.status)) {
    // The newest row that actually carries a density; a row may be present but incomplete.
    const withDensity = [...series.data].reverse().find((p) => p.densityPerCm3 !== undefined);
    if (withDensity?.densityPerCm3 !== undefined) {
      out.density = {
        value: withDensity.densityPerCm3,
        unit: "cm^-3",
        observedAt: withDensity.observedAt,
        kind: "model",
        status: series.status,
        product: "Solar wind propagated to the bow shock",
        quality: "Observed at L1 and advected to Earth's bow shock nose by SWPC's propagation model.",
      };
    }
  }

  return out;
}

/** The most recent OBSERVED Kp value, with its interval start. Never a predicted one. */
export function latestObservedKp(env: LiveEnvelope<KpPoint[]>): LiveDatum | undefined {
  if (!env.data || NO_VALUE_STATUSES.has(env.status)) return undefined;
  const observed = env.data.filter((p) => p.provenance === "observed");
  const last = observed[observed.length - 1];
  if (!last) return undefined;
  return {
    value: last.kp,
    unit: "", // Kp is a dimensionless quasi-logarithmic index
    observedAt: last.at,
    kind: "index",
    status: env.status,
    product: "Planetary K-index (observed)",
    quality: "A planetary average over the three-hour interval beginning at the stated time.",
  };
}

/** The forecast Kp points that lie in the future, in time order. */
export function futureKp(env: LiveEnvelope<KpPoint[]>, nowIso: string): KpPoint[] {
  if (!env.data) return [];
  return env.data.filter((p) => p.provenance === "predicted" && p.at > nowIso);
}

/** The highest forecast Kp in the window, if any is forecast. */
export function peakForecastKp(env: LiveEnvelope<KpPoint[]>, nowIso: string): KpPoint | undefined {
  const future = futureKp(env, nowIso);
  if (future.length === 0) return undefined;
  return future.reduce((a, b) => (b.kp > a.kp ? b : a));
}

/** The current-conditions block from the NOAA scales product (day offset 0). */
export function currentScales(env: LiveEnvelope<NoaaScaleDay[]>): NoaaScaleDay | undefined {
  if (!env.data || NO_VALUE_STATUSES.has(env.status)) return undefined;
  return env.data.filter((d) => d.provenance === "observed").sort((a, b) => a.date.localeCompare(b.date)).pop();
}

/** The forecast days from the NOAA scales product, in date order. */
export function forecastScales(env: LiveEnvelope<NoaaScaleDay[]>): NoaaScaleDay[] {
  if (!env.data) return [];
  return env.data.filter((d) => d.provenance === "forecast").sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Alerts still inside their own validity window, judged against the clock passed in — never
 * against parse time, because a cached response can be read minutes after it was parsed and a
 * warning can expire in between.
 *
 * A message with no stated end is treated as NOT currently in force rather than as indefinitely
 * in force: claiming an open-ended warning still stands is a claim the message does not make.
 */
export function activeAlerts(env: LiveEnvelope<SpaceWeatherAlert[]>, nowIso: string): SpaceWeatherAlert[] {
  if (!env.data) return [];
  return env.data.filter((a) => a.validUntil && a.validUntil > nowIso && (!a.validFrom || a.validFrom <= nowIso));
}

/** The most recently issued messages, whether or not they are still in force. */
export function recentAlerts(env: LiveEnvelope<SpaceWeatherAlert[]>, limit = 10): SpaceWeatherAlert[] {
  if (!env.data) return [];
  return env.data.slice(0, limit);
}

/**
 * Re-age every envelope in a snapshot against a later clock. Rendered HTML can be served long
 * after it was produced, so a "live" badge computed at render time is a claim about the past;
 * this recomputes each status from the datum's own timestamp.
 */
export function reage<T extends object>(snapshot: T, nowIso: string): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(snapshot)) {
    // The constraint is `object` rather than a record of envelopes so that the caller's exact
    // snapshot type survives — an interface has no index signature, and widening it here would
    // erase every `data` type the pages depend on.
    const env = value as LiveEnvelope<unknown> | undefined;
    const product = env && typeof env === "object" && typeof env.productKey === "string" ? getLiveProduct(env.productKey) : undefined;
    out[key] = product && env ? refreshStatus(env, product.freshness, nowIso) : value;
  }
  return out as T;
}

/* ---------------------------------------------------------- provider health */

export interface LiveProviderReport {
  descriptor: LiveProviderDescriptor;
  state: ReturnType<typeof providerState>;
  products: {
    productKey: string;
    label: string;
    url: string;
    cacheSeconds: number;
    refreshCadenceSeconds?: number;
    staleAfterSeconds: number;
    health?: ProviderHealth;
  }[];
}

/**
 * The honest health view of every live provider: what it is, what it costs, and what this runtime
 * instance has actually observed of it. There is no uptime percentage and no reliability score —
 * this deployment retains no operational history, and a figure invented from a process that may
 * be seconds old would be worse than no figure at all.
 */
export function liveProviderReports(): LiveProviderReport[] {
  return LIVE_PROVIDERS.map((descriptor) => {
    const products = LIVE_PRODUCTS.filter((p) => p.providerKey === descriptor.providerKey);
    return {
      descriptor,
      state: providerState(descriptor, products.map((p) => p.productKey)),
      products: products.map((p) => ({
        productKey: p.productKey,
        label: p.label,
        url: p.url,
        cacheSeconds: p.cacheSeconds,
        refreshCadenceSeconds: p.refreshCadenceSeconds,
        staleAfterSeconds: p.freshness.staleAfterSeconds,
        health: getHealth(p.productKey),
      })),
    };
  });
}

/** Totals for the Data Health dashboard. Every number is counted, none is asserted. */
export function liveProviderTotals() {
  const reports = liveProviderReports();
  const health = allHealth();
  return {
    providers: reports.length,
    products: LIVE_PRODUCTS.length,
    connected: reports.filter((r) => r.state === "CONNECTED").length,
    degraded: reports.filter((r) => r.state === "DEGRADED").length,
    unavailable: reports.filter((r) => r.state === "UNAVAILABLE").length,
    planned: reports.filter((r) => r.state === "PLANNED").length,
    /** Products this instance has fetched at least once. */
    productsExercised: health.filter((h) => h.successCount > 0).length,
    productsFailing: health.filter((h) => h.consecutiveFailures > 0).length,
    schemaChanges: health.filter((h) => h.schemaState === "changed").length,
  };
}

export { getLiveProduct, getLiveProvider, LIVE_PRODUCTS, LIVE_PROVIDERS };
