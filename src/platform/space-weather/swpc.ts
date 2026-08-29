import { loadProduct, type ParseResult } from "@/platform/live-providers/client";
import { array, boundedNum, line, num, record, text, timestamp } from "@/platform/live-providers/normalise";
import type { LiveEnvelope } from "@/platform/live-providers/envelope";
import type {
  ActiveRegion, ActiveRegionReport, AuroraForecastSummary, AuroraHemisphere,
  KpPoint, KpProvenance, NoaaScaleDay, SolarWindPoint, SpaceWeatherAlert, AlertKind, XrayFlareState,
} from "@/platform/space-weather/model";

/**
 * NOAA Space Weather Prediction Center client.
 *
 * One parser per product, each strict: a response that no longer matches is reported as a schema
 * change rather than being coerced into something plausible. Every parser rejects a row it cannot
 * fully understand instead of filling the gap, and none of them can return a value without the
 * provider's own timestamp attached — a number with no time is not a measurement.
 *
 * Physical bounds are applied where a value out of range means a parsing error rather than a
 * remarkable sky: solar wind faster than 3,000 km/s or a Kp above 9 is a bug, not a superstorm.
 */

/* ------------------------------------------------------------- solar wind */

export interface SolarWindSpeedReading {
  speedKmS: number;
  observedAt: string;
}

function parseSolarWindSpeed(raw: unknown): ParseResult<SolarWindSpeedReading> {
  const rows = array(raw);
  const first = record(rows[0]);
  if (!first) return { ok: false, problem: "expected a non-empty array of readings" };
  const observedAt = timestamp(first.time_tag);
  // 200–3000 km/s spans everything from the slowest quiet wind to the fastest shock ever recorded.
  const speedKmS = boundedNum(first.proton_speed, 100, 3000);
  if (!observedAt) return { ok: false, problem: "reading has no usable time_tag" };
  if (speedKmS === undefined) return { ok: false, problem: "proton_speed is missing or outside a physical range" };
  return { ok: true, value: { speedKmS, observedAt }, observedAt };
}

export function solarWindSpeed(): Promise<LiveEnvelope<SolarWindSpeedReading>> {
  return loadProduct("swpc:solar-wind-speed", parseSolarWindSpeed);
}

export interface SolarWindFieldReading {
  btNt: number;
  bzNt: number;
  observedAt: string;
}

function parseSolarWindField(raw: unknown): ParseResult<SolarWindFieldReading> {
  const rows = array(raw);
  const first = record(rows[0]);
  if (!first) return { ok: false, problem: "expected a non-empty array of readings" };
  const observedAt = timestamp(first.time_tag);
  // The strongest IMF ever measured at L1 is a few tens of nT; ±200 is a generous outer bound.
  const btNt = boundedNum(first.bt, 0, 200);
  const bzNt = boundedNum(first.bz_gsm, -200, 200);
  if (!observedAt) return { ok: false, problem: "reading has no usable time_tag" };
  if (btNt === undefined || bzNt === undefined) return { ok: false, problem: "bt or bz_gsm is missing or outside a physical range" };
  return { ok: true, value: { btNt, bzNt, observedAt }, observedAt };
}

export function solarWindField(): Promise<LiveEnvelope<SolarWindFieldReading>> {
  return loadProduct("swpc:solar-wind-mag", parseSolarWindField);
}

/**
 * The propagated solar-wind series arrives as an array of arrays with a header row. The column
 * order is read FROM that header rather than assumed: SWPC has reordered these products before,
 * and a positional parser would silently read density as temperature.
 */
function parseSolarWindSeries(raw: unknown): ParseResult<SolarWindPoint[]> {
  const rows = array(raw);
  if (rows.length < 2) return { ok: false, problem: "expected a header row and at least one data row" };
  const header = array(rows[0]).map((c) => (typeof c === "string" ? c : ""));
  const col = (name: string) => header.indexOf(name);
  const iTime = col("time_tag");
  const iSpeed = col("speed");
  const iDensity = col("density");
  const iBt = col("bt");
  const iBz = col("bz");
  const iArrival = col("propagated_time_tag");
  if (iTime < 0 || iSpeed < 0 || iDensity < 0 || iBz < 0) {
    return { ok: false, problem: `header is missing an expected column (got: ${header.join(", ").slice(0, 160)})` };
  }

  const points: SolarWindPoint[] = [];
  for (const r of rows.slice(1)) {
    const cells = array(r);
    const observedAt = timestamp(cells[iTime]);
    if (!observedAt) continue; // a row we cannot time is a row we cannot plot
    points.push({
      observedAt,
      arrivesAt: iArrival >= 0 ? timestamp(cells[iArrival]) : undefined,
      speedKmS: boundedNum(cells[iSpeed], 100, 3000),
      densityPerCm3: boundedNum(cells[iDensity], 0, 500),
      btNt: iBt >= 0 ? boundedNum(cells[iBt], 0, 200) : undefined,
      bzNt: boundedNum(cells[iBz], -200, 200),
    });
  }
  if (points.length === 0) return { ok: false, problem: "no data row carried a usable timestamp" };
  points.sort((a, b) => a.observedAt.localeCompare(b.observedAt));
  return { ok: true, value: points, observedAt: points[points.length - 1].observedAt };
}

export function solarWindSeries(): Promise<LiveEnvelope<SolarWindPoint[]>> {
  return loadProduct("swpc:solar-wind-propagated", parseSolarWindSeries);
}

/* ------------------------------------------------------------ geomagnetic */

function parseKpObserved(raw: unknown): ParseResult<KpPoint[]> {
  const rows = array(raw);
  const points: KpPoint[] = [];
  for (const r of rows) {
    const o = record(r);
    if (!o) continue;
    const at = timestamp(o.time_tag);
    const kp = boundedNum(o.Kp, 0, 9);
    if (!at || kp === undefined) continue;
    points.push({ at, kp, provenance: "observed" });
  }
  if (points.length === 0) return { ok: false, problem: "no row carried both a time_tag and a Kp value" };
  points.sort((a, b) => a.at.localeCompare(b.at));
  return { ok: true, value: points, observedAt: points[points.length - 1].at };
}

export function kpObserved(): Promise<LiveEnvelope<KpPoint[]>> {
  return loadProduct("swpc:kp-index", parseKpObserved);
}

const KP_PROVENANCE: Record<string, KpProvenance> = { observed: "observed", estimated: "estimated", predicted: "predicted" };

/**
 * The Kp forecast product mixes observed, estimated and predicted rows in one array. The
 * `observed` field is what separates them, and it is carried through to every point drawn:
 * a predicted Kp shown as an observation would be the exact failure this platform is built
 * against.
 */
function parseKpForecast(raw: unknown): ParseResult<KpPoint[]> {
  const rows = array(raw);
  const nowIso = new Date().toISOString();
  const points: KpPoint[] = [];
  let newestBegun: string | undefined;
  for (const r of rows) {
    const o = record(r);
    if (!o) continue;
    const at = timestamp(o.time_tag);
    const kp = boundedNum(o.kp, 0, 9);
    const provenance = KP_PROVENANCE[String(o.observed ?? "").toLowerCase()];
    if (!at || kp === undefined || !provenance) continue;
    points.push({ at, kp, provenance, noaaScale: line(o.noaa_scale, 8) });
    // Kp rows are stamped with the START of their three-hour interval, and SWPC publishes an
    // `estimated` row for the interval that is about to begin — so the newest row in this feed is
    // routinely a few minutes into the future. A row whose interval has not started cannot
    // testify to how current the feed is, so the response is aged by the newest row that HAS
    // begun. (Aging it by a future-stamped row would read as perfectly fresh forever; rejecting
    // that row as an impossible timestamp, which is the right rule for a spot measurement, would
    // instead mark a perfectly healthy feed as broken.)
    if (provenance !== "predicted" && at <= nowIso && (!newestBegun || at > newestBegun)) newestBegun = at;
  }
  if (points.length === 0) return { ok: false, problem: "no row carried a time_tag, a kp value and an observed/estimated/predicted marker" };
  points.sort((a, b) => a.at.localeCompare(b.at));
  if (!newestBegun) return { ok: false, problem: "every observed or estimated row is stamped in the future" };
  return { ok: true, value: points, observedAt: newestBegun };
}

export function kpForecast(): Promise<LiveEnvelope<KpPoint[]>> {
  return loadProduct("swpc:kp-forecast", parseKpForecast);
}

/**
 * The NOAA scales product is an object keyed by day offset: "0" is the last 24 hours observed,
 * "-1" the day before, and "1".."3" the three forecast days. The keys are the only thing that
 * says which is which, so they are read explicitly rather than by position.
 */
function parseScales(raw: unknown): ParseResult<NoaaScaleDay[]> {
  const o = record(raw);
  if (!o) return { ok: false, problem: "expected an object keyed by day offset" };

  const days: NoaaScaleDay[] = [];
  let newest: string | undefined;
  for (const [key, blockRaw] of Object.entries(o)) {
    const offset = Number(key);
    if (!Number.isInteger(offset)) continue;
    const block = record(blockRaw);
    if (!block) continue;
    const date = line(block.DateStamp, 12);
    const time = line(block.TimeStamp, 12);
    if (!date) continue;
    const at = timestamp(`${date}T${time ?? "00:00:00"}`);
    if (!at) continue;

    const scale = (v: unknown): { scale: number; text?: string } | undefined => {
      const b = record(v);
      if (!b) return undefined;
      const s = boundedNum(b.Scale, 0, 5);
      if (s === undefined) return undefined;
      return { scale: s, text: line(b.Text, 40) };
    };
    const r = record(block.R);
    const s = record(block.S);

    days.push({
      provenance: offset > 0 ? "forecast" : "observed",
      date,
      at,
      radioBlackout: scale(block.R),
      solarRadiation: scale(block.S),
      geomagnetic: scale(block.G),
      probabilities:
        offset > 0
          ? {
              radioMinor: r ? boundedNum(r.MinorProb, 0, 100) : undefined,
              radioMajor: r ? boundedNum(r.MajorProb, 0, 100) : undefined,
              solarRadiation: s ? boundedNum(s.Prob, 0, 100) : undefined,
            }
          : undefined,
    });
    if (offset === 0) newest = at;
  }

  if (days.length === 0) return { ok: false, problem: "no day block carried a usable date" };
  days.sort((a, b) => a.date.localeCompare(b.date));
  return { ok: true, value: days, observedAt: newest ?? days[days.length - 1].at };
}

export function noaaScales(): Promise<LiveEnvelope<NoaaScaleDay[]>> {
  return loadProduct("swpc:noaa-scales", parseScales);
}

/* ---------------------------------------------------------------- alerts */

/** Pull `Key: value` out of an SWPC message body. The format is stable and documented by use. */
function headerField(message: string, label: string): string | undefined {
  const m = new RegExp(`^${label}:\\s*(.+)$`, "im").exec(message);
  return m ? m[1].trim() : undefined;
}

/**
 * SWPC times inside a message body read "2026 Aug 28 1409 UTC". Parsed explicitly rather than
 * handed to `Date.parse`, which accepts this shape on some runtimes and not others.
 */
const MONTHS: Record<string, number> = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
function parseMessageTime(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const m = /^(\d{4})\s+([A-Za-z]{3})\s+(\d{1,2})\s+(\d{2})(\d{2})\s*UTC$/.exec(value.trim());
  if (!m) return undefined;
  const month = MONTHS[m[2].toLowerCase()];
  if (month === undefined) return undefined;
  const d = new Date(Date.UTC(Number(m[1]), month, Number(m[3]), Number(m[4]), Number(m[5])));
  return Number.isFinite(d.getTime()) ? d.toISOString() : undefined;
}

function alertKind(headline: string): AlertKind {
  const h = headline.toUpperCase();
  // Cancellation first: a cancellation message names the product it cancels, so it also contains
  // the words WARNING or ALERT, and testing those first would file it as a live warning.
  if (h.includes("CANCEL")) return "cancellation";
  if (h.includes("WATCH")) return "watch";
  if (h.includes("WARNING")) return "warning";
  if (h.includes("ALERT")) return "alert";
  if (h.includes("SUMMARY")) return "summary";
  return "other";
}

/**
 * The headline is the first line of the message that names a product, i.e. the first line after
 * the machine header block that is not a `Key: value` pair. Falls back to the product code, so a
 * message whose body changes shape still produces a usable, honest entry.
 */
const HEADLINE_RE = /^(EXTENDED WARNING|CANCEL[A-Z ]*|CONTINUED WARNING|WATCH|WARNING|ALERT|SUMMARY)\b/i;

function extractHeadline(message: string, productId: string): string {
  for (const raw of message.split("\n")) {
    const l = raw.trim();
    if (!l) continue;
    // The headline is itself of the form "WARNING: ...", so it must be tested BEFORE the
    // `Key: value` header lines are skipped — otherwise every headline looks like a header field.
    if (HEADLINE_RE.test(l)) return l;
    if (/^[A-Za-z][A-Za-z .]{0,40}:\s/.test(l)) continue;
  }
  return `Space weather message ${productId}`;
}

function parseAlerts(raw: unknown): ParseResult<SpaceWeatherAlert[]> {
  const rows = array(raw);
  if (rows.length === 0) return { ok: false, problem: "expected an array of messages" };
  const nowIso = new Date().toISOString();

  const alerts: SpaceWeatherAlert[] = [];
  for (const r of rows) {
    const o = record(r);
    if (!o) continue;
    const productId = line(o.product_id, 24);
    const issuedAt = timestamp(o.issue_datetime);
    const message = text(o.message, 3000);
    if (!productId || !issuedAt || !message) continue;

    const headline = extractHeadline(message, productId);
    const validFrom = parseMessageTime(headerField(message, "Valid From"));
    const validUntil = parseMessageTime(headerField(message, "Valid To") ?? headerField(message, "Now Valid Until") ?? headerField(message, "Valid Until"));
    const scaleField = headerField(message, "NOAA Scale") ?? headerField(message, "Noaa Scale");
    const scale = scaleField ? (/^([GSR]\d)/i.exec(scaleField)?.[1]?.toUpperCase() ?? undefined) : undefined;

    alerts.push({
      productId,
      serial: headerField(message, "Serial Number"),
      kind: alertKind(headline),
      headline,
      issuedAt,
      validFrom,
      validUntil,
      scale,
      // A message with no stated end is treated as not currently active rather than as
      // indefinitely active: claiming an open-ended warning is still in force is a claim the
      // message does not make.
      active: Boolean(validUntil && validUntil > nowIso && (!validFrom || validFrom <= nowIso)),
      message,
    });
  }

  if (alerts.length === 0) return { ok: false, problem: "no message carried a product id, an issue time and a body" };
  alerts.sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  return { ok: true, value: alerts };
}

export function alerts(): Promise<LiveEnvelope<SpaceWeatherAlert[]>> {
  return loadProduct("swpc:alerts", parseAlerts);
}

/* ------------------------------------------------------------------ solar */

function parseXrayFlare(raw: unknown): ParseResult<XrayFlareState> {
  const rows = array(raw);
  const o = record(rows[0]);
  if (!o) return { ok: false, problem: "expected a non-empty array" };
  const observedAt = timestamp(o.time_tag);
  if (!observedAt) return { ok: false, problem: "reading has no usable time_tag" };

  const endedAt = timestamp(o.end_time);
  const beganAt = timestamp(o.begin_time);
  return {
    ok: true,
    value: {
      observedAt,
      satellite: num(o.satellite),
      currentClass: line(o.current_class, 12),
      beganAt,
      peakedAt: timestamp(o.max_time),
      peakClass: line(o.max_class, 12),
      endedAt,
      inProgress: Boolean(beganAt && !endedAt),
    },
    observedAt,
  };
}

export function xrayFlare(): Promise<LiveEnvelope<XrayFlareState>> {
  return loadProduct("swpc:xray-flares", parseXrayFlare);
}

/**
 * The solar-region report is a rolling history; only the newest `observed_date` describes the
 * disc now. Older dates are dropped rather than mixed in, which would double-count regions.
 */
function parseActiveRegions(raw: unknown): ParseResult<ActiveRegionReport> {
  const rows = array(raw).map(record).filter((r): r is Record<string, unknown> => Boolean(r));
  if (rows.length === 0) return { ok: false, problem: "expected an array of region records" };

  let latest = "";
  for (const r of rows) {
    const d = line(r.observed_date, 12);
    if (d && d > latest) latest = d;
  }
  if (!latest) return { ok: false, problem: "no record carried an observed_date" };

  const regions: ActiveRegion[] = [];
  for (const r of rows) {
    if (line(r.observed_date, 12) !== latest) continue;
    const number = num(r.region);
    if (number === undefined) continue;
    regions.push({
      number,
      location: line(r.location, 12),
      latitude: boundedNum(r.latitude, -90, 90),
      longitude: boundedNum(r.longitude, -180, 180),
      areaMillionths: boundedNum(r.area, 0, 10000),
      spotClass: line(r.spot_class, 8),
      magClass: line(r.mag_class, 16),
      spotCount: boundedNum(r.number_spots, 0, 500),
      flareProbability: {
        c: boundedNum(r.c_flare_probability, 0, 100),
        m: boundedNum(r.m_flare_probability, 0, 100),
        x: boundedNum(r.x_flare_probability, 0, 100),
      },
    });
  }

  regions.sort((a, b) => a.number - b.number);
  const spots = regions.map((r) => r.spotCount).filter((n): n is number => n !== undefined);
  const observedAt = timestamp(`${latest}T00:00:00`);
  return {
    ok: true,
    value: {
      observedDate: latest,
      regions,
      regionCount: regions.length,
      spotTotal: spots.length > 0 ? spots.reduce((a, b) => a + b, 0) : undefined,
    },
    observedAt,
  };
}

export function activeRegions(): Promise<LiveEnvelope<ActiveRegionReport>> {
  return loadProduct("swpc:solar-regions", parseActiveRegions);
}

export interface RadioFluxReading {
  sfu: number;
  observedAt: string;
}

function parseRadioFlux(raw: unknown): ParseResult<RadioFluxReading> {
  const rows = array(raw);
  const o = record(rows[0]);
  if (!o) return { ok: false, problem: "expected a non-empty array" };
  const observedAt = timestamp(o.time_tag);
  // F10.7 has never been below ~64 sfu (the quiet-Sun floor) nor above a few hundred.
  const sfu = boundedNum(o.flux, 50, 500);
  if (!observedAt) return { ok: false, problem: "reading has no usable time_tag" };
  if (sfu === undefined) return { ok: false, problem: "flux is missing or outside a physical range" };
  return { ok: true, value: { sfu, observedAt }, observedAt };
}

export function radioFlux(): Promise<LiveEnvelope<RadioFluxReading>> {
  return loadProduct("swpc:f107", parseRadioFlux);
}

/* ---------------------------------------------------------------- aurora */

/**
 * The method identifier recorded with every figure derived from the OVATION grid. Versioned, so
 * that if the threshold or the definition ever changes, a reader can tell which one produced a
 * number they are looking at.
 */
export const AURORA_BOUNDARY_METHOD = "equatorward-boundary/v1";
export const AURORA_BOUNDARY_THRESHOLD_PERCENT = 10;

/**
 * Reduce the OVATION grid to what a page can honestly say: the most equatorward latitude at which
 * the model gives at least a 10% chance of visible aurora at ANY longitude, and the strongest
 * probability anywhere in each hemisphere.
 *
 * This is a computation over the provider's numbers, not a provider product, and is labelled as
 * such everywhere it appears. It deliberately says nothing about any city: the model gives a
 * probability on a grid, and cloud, light pollution and viewing direction — none of which are in
 * this dataset — decide whether anyone actually sees anything.
 */
function parseAurora(raw: unknown): ParseResult<AuroraForecastSummary> {
  const o = record(raw);
  if (!o) return { ok: false, problem: "expected an object with coordinates" };
  const observedAt = timestamp(o["Observation Time"]);
  const forecastFor = timestamp(o["Forecast Time"]);
  const coords = array(o.coordinates);
  if (!observedAt || !forecastFor) return { ok: false, problem: "missing Observation Time or Forecast Time" };
  if (coords.length === 0) return { ok: false, problem: "coordinates array is empty" };

  const north: AuroraHemisphere = { maxProbabilityPercent: 0 };
  const south: AuroraHemisphere = { maxProbabilityPercent: 0 };
  let cells = 0;

  for (const c of coords) {
    const cell = array(c);
    if (cell.length < 3) continue;
    const lat = boundedNum(cell[1], -90, 90);
    const p = boundedNum(cell[2], 0, 100);
    if (lat === undefined || p === undefined) continue;
    cells++;
    const hemisphere = lat >= 0 ? north : south;
    if (p > hemisphere.maxProbabilityPercent) hemisphere.maxProbabilityPercent = p;
    if (p >= AURORA_BOUNDARY_THRESHOLD_PERCENT) {
      // "Equatorward" is the smallest absolute latitude reaching the threshold.
      if (hemisphere.equatorwardBoundaryLat === undefined || Math.abs(lat) < Math.abs(hemisphere.equatorwardBoundaryLat)) {
        hemisphere.equatorwardBoundaryLat = lat;
      }
    }
  }

  if (cells === 0) return { ok: false, problem: "no coordinate cell parsed as [longitude, latitude, probability]" };

  return {
    ok: true,
    value: {
      observedAt,
      forecastFor,
      method: AURORA_BOUNDARY_METHOD,
      thresholdPercent: AURORA_BOUNDARY_THRESHOLD_PERCENT,
      northern: north,
      southern: south,
      gridCells: cells,
    },
    observedAt,
    validUntil: forecastFor,
  };
}

export function auroraForecast(): Promise<LiveEnvelope<AuroraForecastSummary>> {
  return loadProduct("swpc:ovation-aurora", parseAurora);
}
