/**
 * Cloud cover from MET Norway — the one weather integration on this platform, and the narrowest
 * one it could honestly be.
 *
 * WHY IT EXISTS. Every observing page here has, until now, ended with a sentence saying the weather
 * is your problem. That is honest but it is also the single thing that decides whether a night
 * happens, and a provider that can be used legally does exist: the Norwegian Meteorological
 * Institute publishes a global forecast under NLOD 2.0 and CC BY 4.0, with no non-commercial
 * restriction, no key, and an explicit allowance for cross-origin requests from a browser.
 * (Open-Meteo was evaluated first and refused: its free tier is licensed for NON-COMMERCIAL use
 * only, and whether this platform qualifies is not a judgement this code is entitled to make.)
 *
 * WHAT IT IS NOT. `cloud_area_fraction` is a general-purpose meteorological forecast of total cloud
 * cover. It is NOT astronomical seeing, which is atmospheric turbulence and is forecast from
 * entirely different model output; it is NOT transparency, which is aerosol and humidity along the
 * line of sight; and it is not sky brightness. Those three words appear nowhere in this module, and
 * nothing here derives them. A clear forecast and terrible seeing are an ordinary combination.
 *
 * WHERE IT RUNS. In the reader's browser, never on the server, and only when they ask for it. The
 * consequence is the point: the observer's coordinates go to the meteorological institute and to
 * nobody else — not to AsteriaStar, which never receives them and so has nothing to log. They are
 * rounded to two decimals, about a kilometre, before they are sent: far finer than cloud cover
 * resolves and deliberately coarser than the reader typed.
 */

export const MET_HOST = "api.met.no";
export const MET_DOCS_URL = "https://api.met.no/doc/TermsOfService";
export const MET_LICENSE_URL = "https://api.met.no/doc/License";
export const MET_ATTRIBUTION = "Weather forecast from MET Norway (Norwegian Meteorological Institute), licensed CC BY 4.0 / NLOD 2.0";

/** Coordinates are rounded to this many decimals before they leave the device. ~1.1 km. */
export const COORDINATE_DECIMALS = 2;

/**
 * Refused above this. MET's compact forecast is about 40 KB; ten times that is a broken response.
 *
 * The count is of BYTES read off the wire, checked as they arrive. Buffering the whole body and
 * measuring it afterwards is not a ceiling at all: against a server streaming as fast as the client
 * drains, it took resident memory from 71 MB to 869 MB before the timeout ended it, and a single
 * 286 MB body reached 1.4 GB — on a phone, a killed tab. The real bound was the timeout multiplied
 * by the bandwidth.
 */
const MAX_BYTES = 400_000;

/** The browser gets a shorter leash than the server: a reader is waiting, not a build. */
const TIMEOUT_MS = 6_000;

export interface CloudPoint {
  timeMs: number;
  /** Total cloud cover, per cent. Nothing else in this module is derived from it. */
  cloudCoverPercent: number;
  temperatureC?: number;
  relativeHumidityPercent?: number;
  windSpeedMs?: number;
}

export interface CloudForecast {
  /** MET's own generation time for the forecast. */
  updatedAt?: string;
  /** When this device fetched it. */
  fetchedAt: string;
  /** The coordinates actually sent, after rounding — shown to the reader verbatim. */
  sentLatitude: number;
  sentLongitude: number;
  points: CloudPoint[];
}

export type CloudResult = { ok: true; value: CloudForecast } | { ok: false; problem: string };

/** The forecast URL. The host is a constant; only the two rounded numbers vary. */
export function metForecastUrl(latitudeDeg: number, longitudeDeg: number): string {
  const lat = Number(latitudeDeg.toFixed(COORDINATE_DECIMALS));
  const lon = Number(longitudeDeg.toFixed(COORDINATE_DECIMALS));
  return `https://${MET_HOST}/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
}

function num(value: unknown, min: number, max: number): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max ? value : undefined;
}

export function parseMetForecast(raw: unknown, fetchedAt: string, sentLatitude: number, sentLongitude: number): CloudResult {
  if (typeof raw !== "object" || raw === null) return { ok: false, problem: "the forecast was not a JSON object" };
  const properties = (raw as { properties?: unknown }).properties;
  if (typeof properties !== "object" || properties === null) return { ok: false, problem: "the forecast has no properties block" };
  const meta = (properties as { meta?: { updated_at?: unknown; units?: Record<string, unknown> } }).meta;
  const series = (properties as { timeseries?: unknown }).timeseries;
  if (!Array.isArray(series)) return { ok: false, problem: "the forecast has no timeseries" };

  /*
   * The unit is CHECKED, and the check fails CLOSED.
   *
   * MET publishes the units of every field, and a provider that changed `cloud_area_fraction` from
   * per cent to a fraction would otherwise turn a completely overcast sky into "0.9% cloud" — which
   * renders as "Mostly clear in the forecast". The first version of this guard only fired when the
   * unit was PRESENT and wrong, so a response that dropped or moved the units block sailed through
   * and produced exactly that hundred-fold misread. A change that relocates the units block is the
   * same kind of change that would alter the unit, so an absent declaration is now a refusal.
   */
  const unit = meta?.units?.["cloud_area_fraction"];
  if (unit !== "%") {
    return {
      ok: false,
      problem:
        unit === undefined
          ? "the forecast does not declare a unit for cloud cover; this integration will not guess at one"
          : `cloud cover is published in "${String(unit)}", not per cent; this integration reads per cent only`,
    };
  }

  const points: CloudPoint[] = [];
  for (const entry of series) {
    if (typeof entry !== "object" || entry === null) continue;
    const time = (entry as { time?: unknown }).time;
    const details = (entry as { data?: { instant?: { details?: Record<string, unknown> } } }).data?.instant?.details;
    if (typeof time !== "string" || !details) continue;
    const timeMs = Date.parse(time);
    const cloud = num(details["cloud_area_fraction"], 0, 100);
    if (!Number.isFinite(timeMs) || cloud === undefined) continue;
    points.push({
      timeMs,
      cloudCoverPercent: cloud,
      temperatureC: num(details["air_temperature"], -100, 70),
      relativeHumidityPercent: num(details["relative_humidity"], 0, 100),
      windSpeedMs: num(details["wind_speed"], 0, 150),
    });
  }

  if (points.length === 0) return { ok: false, problem: "no usable cloud-cover values in the forecast" };
  points.sort((a, b) => a.timeMs - b.timeMs);
  /*
   * The provider's own generation time is shown in the attribution line, which is one of this
   * module's honesty claims — so it is date-checked, not merely type-checked. An unparseable value
   * used to reach the page and render as "Invalid Date", which is worse than saying nothing.
   */
  const rawUpdated = typeof meta?.updated_at === "string" ? Date.parse(meta.updated_at) : NaN;
  const updatedAt = Number.isFinite(rawUpdated) ? new Date(rawUpdated).toISOString() : undefined;
  return { ok: true, value: { updatedAt, fetchedAt, sentLatitude, sentLongitude, points } };
}

/**
 * Fetches the forecast from the browser.
 *
 * The server-side provider runtime is not available here, so the guarantees it provides are rebuilt:
 * a constant host, an abort timeout, a byte ceiling enforced by reading the body as text before it
 * is parsed, and a normalised failure string that is never upstream markup. `credentials: "omit"` so
 * no cookie of the reader's is ever attached to a third-party request.
 */
/**
 * Reads a response body, abandoning it the moment it exceeds the ceiling.
 *
 * Returns null when the body is too large — and importantly, stops pulling from the network at that
 * point rather than after the whole thing is in memory. Falls back to `text()` only when the
 * platform gives no readable stream, where there is nothing to do but measure afterwards.
 */
async function readCappedBody(response: Response): Promise<string | null> {
  if (!response.body) {
    const whole = await response.text();
    return new TextEncoder().encode(whole).length > MAX_BYTES ? null : whole;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let out = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BYTES) {
        await reader.cancel();
        return null;
      }
      out += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
  return out + decoder.decode();
}

export async function fetchCloudForecast(latitudeDeg: number, longitudeDeg: number): Promise<CloudResult> {
  const lat = Number(latitudeDeg.toFixed(COORDINATE_DECIMALS));
  const lon = Number(longitudeDeg.toFixed(COORDINATE_DECIMALS));
  const url = metForecastUrl(lat, lon);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      credentials: "omit",
      redirect: "error",
      // The page prints the exact request so that what was sent is never a matter of trust. The
      // referrer is part of what is sent, so none is.
      referrerPolicy: "no-referrer",
    });
    if (!response.ok) return { ok: false, problem: `MET Norway answered ${response.status}` };

    // A declared length over the ceiling is refused before a single byte of body is read.
    const declared = Number(response.headers.get("content-length"));
    if (Number.isFinite(declared) && declared > MAX_BYTES) {
      return { ok: false, problem: "the forecast was larger than this integration accepts" };
    }
    const text = await readCappedBody(response);
    if (text === null) return { ok: false, problem: "the forecast was larger than this integration accepts" };
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return { ok: false, problem: "the forecast was not valid JSON" };
    }
    return parseMetForecast(body, new Date().toISOString(), lat, lon);
  } catch {
    // Deliberately opaque: an exception message from fetch can carry the URL and the host's own
    // text, and neither belongs on the page.
    return { ok: false, problem: "MET Norway could not be reached" };
  } finally {
    clearTimeout(timer);
  }
}

export interface CloudSummary {
  /** Mean cover across the window, per cent. */
  meanPercent: number;
  minPercent: number;
  maxPercent: number;
  /** How many hourly points fell inside the window. Fewer than two is not a summary. */
  samples: number;
  /** The last point used, so a window running past the forecast is visible. */
  coveredToMs: number;
}

/**
 * Cloud cover across an observing window.
 *
 * Returns nothing rather than extrapolating: MET's forecast thins from hourly to six-hourly after
 * about two days and ends after nine, and a mean computed from one sample at the edge of the file
 * would look exactly like a real one.
 */
export function cloudDuring(forecast: CloudForecast, fromMs: number, toMs: number): CloudSummary | undefined {
  const inside = forecast.points.filter((p) => p.timeMs >= fromMs - 3_600_000 && p.timeMs <= toMs + 3_600_000);
  if (inside.length < 2) return undefined;
  // Reduced rather than spread: `Math.min(...points)` throws a RangeError past a couple of hundred
  // thousand arguments, and the only thing keeping this below that is the byte ceiling on a
  // different constant in a different function. A reduce costs nothing and removes the coupling.
  let min = Infinity;
  let max = -Infinity;
  let total = 0;
  for (const point of inside) {
    if (point.cloudCoverPercent < min) min = point.cloudCoverPercent;
    if (point.cloudCoverPercent > max) max = point.cloudCoverPercent;
    total += point.cloudCoverPercent;
  }
  return {
    meanPercent: total / inside.length,
    minPercent: min,
    maxPercent: max,
    samples: inside.length,
    coveredToMs: inside[inside.length - 1].timeMs,
  };
}

/**
 * Words for a cloud-cover figure. Cloud cover only — this says nothing about seeing, transparency
 * or sky brightness, and the wording is chosen so it cannot be read as though it did.
 */
export function describeCloud(meanPercent: number): string {
  if (meanPercent < 15) return "Mostly clear in the forecast";
  if (meanPercent < 40) return "Partly cloudy in the forecast";
  if (meanPercent < 70) return "More cloud than clear sky in the forecast";
  if (meanPercent < 90) return "Mostly cloudy in the forecast";
  return "Overcast in the forecast";
}
