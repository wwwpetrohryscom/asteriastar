import { loadProduct, type ParseResult } from "@/platform/live-providers/client";
import { array, boundedNum, line, num, record } from "@/platform/live-providers/normalise";
import type { LiveEnvelope } from "@/platform/live-providers/envelope";
import {
  distanceFromAu, sizeFromAbsoluteMagnitude,
  type CloseApproach, type NeoCandidate, type ObjectSize, type RecentNeo, type SentryObject,
} from "@/platform/neo/model";

/**
 * JPL SSD/CNEOS and IAU Minor Planet Center clients.
 *
 * These providers return columnar data — an array of `fields` names and an array of row arrays —
 * so every parser reads its columns BY NAME from the header the response carries. JPL adds and
 * reorders fields between API versions, and a positional parser would go on working silently while
 * reading velocity as distance.
 *
 * Time scales are preserved, not normalised. JPL publishes close-approach times in TDB and Sentry's
 * last-observation times in UTC; collapsing them into one "date" would lose a distinction worth
 * about 69 seconds and, more importantly, worth stating.
 */

/* -------------------------------------------------------------- column access */

/** Read a columnar JPL response into row objects keyed by the header names it declares. */
function columnar(raw: unknown, required: string[]): { rows: Record<string, unknown>[]; problem?: string } {
  const o = record(raw);
  if (!o) return { rows: [], problem: "expected an object with fields and data" };
  const fields = array(o.fields).map((f) => (typeof f === "string" ? f : ""));
  if (fields.length === 0) return { rows: [], problem: "response declares no field names" };
  const missing = required.filter((f) => !fields.includes(f));
  if (missing.length > 0) return { rows: [], problem: `response is missing expected column(s): ${missing.join(", ")}` };

  const rows: Record<string, unknown>[] = [];
  for (const r of array(o.data)) {
    const cells = array(r);
    if (cells.length !== fields.length) continue; // a row that does not match its own header
    const row: Record<string, unknown> = {};
    fields.forEach((name, i) => {
      row[name] = cells[i];
    });
    rows.push(row);
  }
  return { rows };
}

/** JPL pads `fullname` with leading spaces and wraps unnumbered designations in brackets. */
function fullName(value: unknown): string | undefined {
  const l = line(value, 120);
  return l ? l.replace(/\s+/g, " ").trim() : undefined;
}

/**
 * JPL's close-approach calendar date, e.g. "2026-Aug-30 17:37". It is TDB, and it is returned as an
 * ISO-shaped string WITHOUT a zone designator — deliberately. Appending "Z" would assert UTC, which
 * is exactly the 69-second lie this parser exists to avoid; the string is only ever rendered
 * alongside the letters TDB.
 */
const MONTH: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

function tdbCalendarDate(value: unknown): string | undefined {
  const l = line(value, 32);
  if (!l) return undefined;
  const m = /^(\d{4})-([A-Za-z]{3})-(\d{2})\s+(\d{2}):(\d{2})$/.exec(l);
  if (!m) return undefined;
  const month = MONTH[m[2]];
  if (!month) return undefined;
  return `${m[1]}-${month}-${m[3]}T${m[4]}:${m[5]}`;
}

/** A comparable instant for ordering TDB values. Never shown; TDB is not UTC and is not claimed to be. */
export function tdbSortKey(approachTdb: string): number {
  const t = Date.parse(`${approachTdb}Z`);
  return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
}

/** Prefer a measured diameter; fall back to the magnitude estimate; otherwise say nothing. */
function sizeOf(diameterKm: number | undefined, sigmaKm: number | undefined, h: number | undefined): ObjectSize | undefined {
  if (diameterKm !== undefined) {
    return {
      kind: "measured",
      km: diameterKm,
      uncertaintyKm: sigmaKm,
      note: "A diameter from the provider's own physical-parameters record — measured or modelled from radar, thermal infrared or occultation data, not inferred from brightness.",
    };
  }
  return h !== undefined ? sizeFromAbsoluteMagnitude(h) : undefined;
}

/* ------------------------------------------------------------ close approaches */

function parseCloseApproaches(raw: unknown): ParseResult<CloseApproach[]> {
  const o = record(raw);
  // A CAD response with no approaches in the window has `count: 0` and NO `data` key at all. That
  // is a real answer — "nothing comes that close in the next sixty days" — not a broken response.
  if (o && num(o.count) === 0) return { ok: true, value: [] };

  const { rows, problem } = columnar(raw, ["des", "cd", "dist", "v_rel"]);
  if (problem) return { ok: false, problem };

  const approaches: CloseApproach[] = [];
  for (const r of rows) {
    const designation = line(r.des, 40);
    const approachTdb = tdbCalendarDate(r.cd);
    // Anything beyond a few au is not a close approach; anything at zero is a parsing artefact.
    const au = boundedNum(r.dist, 0, 2);
    if (!designation || !approachTdb || au === undefined) continue;

    const h = boundedNum(r.h, -5, 40);
    const diameterKm = boundedNum(r.diameter, 0, 2000);
    const minAu = boundedNum(r.dist_min, 0, 2);
    const maxAu = boundedNum(r.dist_max, 0, 2);

    approaches.push({
      designation,
      fullName: fullName(r.fullname),
      orbitId: line(r.orbit_id, 16),
      approachTdb,
      timeUncertainty: line(r.t_sigma_f, 24),
      distance: distanceFromAu(au),
      distanceMin: minAu !== undefined ? distanceFromAu(minAu) : undefined,
      distanceMax: maxAu !== undefined ? distanceFromAu(maxAu) : undefined,
      relativeVelocityKmS: boundedNum(r.v_rel, 0, 100),
      velocityInfinityKmS: boundedNum(r.v_inf, 0, 100),
      absoluteMagnitude: h,
      size: sizeOf(diameterKm, boundedNum(r.diameter_sigma, 0, 2000), h),
    });
  }

  approaches.sort((a, b) => tdbSortKey(a.approachTdb) - tdbSortKey(b.approachTdb));
  return { ok: true, value: approaches };
}

export function closeApproaches(): Promise<LiveEnvelope<CloseApproach[]>> {
  return loadProduct("jpl:close-approaches", parseCloseApproaches);
}

/* ------------------------------------------------------------------- Sentry */

function parseSentry(raw: unknown): ParseResult<SentryObject[]> {
  const o = record(raw);
  if (!o) return { ok: false, problem: "expected an object with a data array" };
  const rows = array(o.data).map(record).filter((r): r is Record<string, unknown> => Boolean(r));
  // Sentry's default mode returns objects, not the columnar form the other JPL endpoints use.
  if (rows.length === 0) return { ok: false, problem: "no usable rows in the Sentry response" };

  const objects: SentryObject[] = [];
  for (const r of rows) {
    const designation = line(r.des, 40);
    if (!designation) continue;
    objects.push({
      designation,
      fullName: fullName(r.fullname),
      impactProbability: boundedNum(r.ip, 0, 1),
      potentialImpacts: boundedNum(r.n_imp, 0, 1e6),
      yearRange: line(r.range, 32),
      // The Palermo scale is logarithmic and is essentially always negative for real objects.
      palermoCumulative: boundedNum(r.ps_cum, -20, 10),
      palermoMaximum: boundedNum(r.ps_max, -20, 10),
      torinoMaximum: boundedNum(r.ts_max, 0, 10),
      velocityInfinityKmS: boundedNum(r.v_inf, 0, 100),
      absoluteMagnitude: boundedNum(r.h, -5, 40),
      diameterKm: boundedNum(r.diameter, 0, 2000),
      lastObservationUtc: line(r.last_obs, 32),
    });
  }
  if (objects.length === 0) return { ok: false, problem: "no row carried a designation" };

  // Most hazardous first, by the scale designed for exactly that comparison.
  objects.sort((a, b) => (b.palermoCumulative ?? -99) - (a.palermoCumulative ?? -99));
  return { ok: true, value: objects };
}

export function sentryTable(): Promise<LiveEnvelope<SentryObject[]>> {
  return loadProduct("jpl:sentry", parseSentry);
}

/* --------------------------------------------------------- recent NEO entries */

function parseRecentNeos(raw: unknown): ParseResult<RecentNeo[]> {
  const o = record(raw);
  if (o && num(o.count) === 0) return { ok: true, value: [] };

  const { rows, problem } = columnar(raw, ["pdes", "first_obs", "class"]);
  if (problem) return { ok: false, problem };

  const objects: RecentNeo[] = [];
  for (const r of rows) {
    const designation = line(r.pdes, 40);
    const firstObservation = line(r.first_obs, 16);
    if (!designation || !firstObservation || !/^\d{4}-\d{2}-\d{2}$/.test(firstObservation)) continue;
    const h = boundedNum(r.H, -5, 40);
    const diameterKm = boundedNum(r.diameter, 0, 2000);
    objects.push({
      designation,
      fullName: fullName(r.full_name),
      firstObservation,
      orbitClass: line(r.class, 8),
      // The provider writes "Y"/"N"; anything else is treated as not hazardous rather than guessed.
      isPotentiallyHazardous: String(r.pha ?? "").toUpperCase() === "Y",
      absoluteMagnitude: h,
      moidAu: boundedNum(r.moid, 0, 10),
      size: sizeOf(diameterKm, undefined, h),
    });
  }

  objects.sort((a, b) => b.firstObservation.localeCompare(a.firstObservation));
  return { ok: true, value: objects };
}

export function recentNeos(): Promise<LiveEnvelope<RecentNeo[]>> {
  return loadProduct("jpl:recent-neos", parseRecentNeos);
}

/* --------------------------------------------------- MPC NEO Confirmation Page */

/**
 * The MPC gives a discovery date as year, month and FRACTIONAL day — "2026 08 28.8" is the 28th at
 * roughly 19:12 UT. The fraction is converted rather than truncated, because truncating would move
 * a late-evening discovery back to midnight and silently make every candidate look older.
 */
function fractionalDayToIso(year: number, month: number, day: number): string | undefined {
  if (!Number.isInteger(year) || month < 1 || month > 12 || day < 1 || day >= 32) return undefined;
  const whole = Math.floor(day);
  const ms = Math.round((day - whole) * 86400_000);
  const base = Date.UTC(year, month - 1, whole);
  if (!Number.isFinite(base)) return undefined;
  return new Date(base + ms).toISOString();
}

function parseCandidates(raw: unknown): ParseResult<NeoCandidate[]> {
  // An empty confirmation page is a real state — everything has been confirmed or discarded.
  if (!Array.isArray(raw)) return { ok: false, problem: "expected an array of candidate records" };

  const candidates: NeoCandidate[] = [];
  for (const r of raw) {
    const o = record(r);
    if (!o) continue;
    const temporaryDesignation = line(o.Temp_Desig, 24);
    if (!temporaryDesignation) continue;

    const year = num(o.Discovery_year);
    const month = num(o.Discovery_month);
    const day = num(o.Discovery_day);
    candidates.push({
      temporaryDesignation,
      neoScore: boundedNum(o.Score, 0, 100),
      firstObservedUtc: year !== undefined && month !== undefined && day !== undefined ? fractionalDayToIso(year, month, day) : undefined,
      raHours: boundedNum(o["R.A."], 0, 24),
      decDegrees: boundedNum(o["Decl."], -90, 90),
      apparentMagnitude: boundedNum(o.V, -5, 40),
      absoluteMagnitude: boundedNum(o.H, -5, 40),
      observationCount: boundedNum(o.NObs, 0, 100000),
      arcDays: boundedNum(o.Arc, 0, 10000),
      daysSinceLastSeen: boundedNum(o.Not_Seen_dys, 0, 10000),
      updatedNote: line(o.Updated, 80),
    });
  }

  // Highest NEO score first, then the freshest.
  candidates.sort((a, b) => (b.neoScore ?? -1) - (a.neoScore ?? -1) || (a.daysSinceLastSeen ?? 1e9) - (b.daysSinceLastSeen ?? 1e9));
  return { ok: true, value: candidates };
}

export function neoCandidates(): Promise<LiveEnvelope<NeoCandidate[]>> {
  return loadProduct("mpc:neocp", parseCandidates);
}
