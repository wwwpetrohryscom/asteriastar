/**
 * Privacy-first explicit location model (Program Q).
 *
 * Location is ONLY ever what the caller explicitly passes in — a latitude, a
 * longitude, a date, and (optionally) an IANA timezone. This module never
 * infers, guesses, geolocates, IP-locates, stores, or logs a location. It only
 * validates the inputs and resolves a timezone offset deterministically.
 *
 * The calculator is validated for years 1901–2099 (the NOAA solar algorithm's
 * range), so dates outside that are rejected rather than silently extrapolated.
 */

/** Latitude/longitude bounds, exported so validators and the API share one source of truth. */
export const LATITUDE_RANGE = { min: -90, max: 90 } as const;
export const LONGITUDE_RANGE = { min: -180, max: 180 } as const;
export const YEAR_RANGE = { min: 1901, max: 2099 } as const;

export interface LocationInput {
  latitude: number;
  longitude: number;
  /**
   * Civil date at the location, YYYY-MM-DD (or an ISO-8601 string, whose date part
   * is used). Optional at the type level so callers that default it themselves
   * (e.g. the location-aware Moon endpoint's "today") can omit it; `resolveLocation`
   * still requires a valid date and returns a structured error if it is missing.
   */
  date?: string;
  /** Optional IANA timezone id (e.g. "Europe/Prague"). When omitted, times are UTC. */
  timezone?: string;
}

export interface ResolvedLocation {
  latitude: number;
  longitude: number;
  /** Normalised YYYY-MM-DD. */
  date: string;
  year: number;
  month: number;
  day: number;
  /** The resolved IANA id, or "UTC" when none was supplied. */
  timezone: string;
  /** Whether an explicit timezone was supplied (vs the UTC default). */
  timezoneProvided: boolean;
  /** Representative UTC offset (minutes) at 12:00 UTC on the date; 0 for UTC. */
  utcOffsetMinutes: number;
}

export type LocationField = "latitude" | "longitude" | "date" | "timezone";
export type LocationResult =
  | { ok: true; location: ResolvedLocation }
  | { ok: false; field: LocationField; message: string };

/** True if `tz` is an IANA timezone id the runtime recognises. Pure, no network. */
export function isValidIanaTimeZone(tz: string): boolean {
  if (!tz || tz === "UTC") return tz === "UTC";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * The UTC offset in minutes for an IANA timezone at a specific instant
 * (DST-correct, deterministic). "UTC" (or an empty zone) returns 0.
 */
export function timezoneOffsetMinutes(timezone: string, at: Date): number {
  if (!timezone || timezone === "UTC") return 0;
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(at);
  const get = (t: string): number => Number(parts.find((p) => p.type === t)?.value);
  const asUTC = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asUTC - at.getTime()) / 60_000);
}

function parseCalendarDate(input: string): { year: number; month: number; day: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(input.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  // Reject impossible calendar dates (e.g. 2025-02-31) via a UTC round-trip.
  const d = new Date(Date.UTC(year, month - 1, day));
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) return null;
  return { year, month, day };
}

const pad = (n: number): string => String(n).padStart(2, "0");

/**
 * Validate and resolve an explicit location. Returns a structured error (never a
 * guessed value) on any invalid field. Nothing is stored.
 */
export function resolveLocation(input: LocationInput): LocationResult {
  const { latitude, longitude } = input;
  if (typeof latitude !== "number" || !Number.isFinite(latitude) || latitude < LATITUDE_RANGE.min || latitude > LATITUDE_RANGE.max) {
    return { ok: false, field: "latitude", message: `latitude must be a number between ${LATITUDE_RANGE.min} and ${LATITUDE_RANGE.max}.` };
  }
  if (typeof longitude !== "number" || !Number.isFinite(longitude) || longitude < LONGITUDE_RANGE.min || longitude > LONGITUDE_RANGE.max) {
    return { ok: false, field: "longitude", message: `longitude must be a number between ${LONGITUDE_RANGE.min} and ${LONGITUDE_RANGE.max}.` };
  }
  const parsed = parseCalendarDate(input.date ?? "");
  if (!parsed) {
    return { ok: false, field: "date", message: "date must be a valid calendar date in YYYY-MM-DD (or ISO-8601) form." };
  }
  if (parsed.year < YEAR_RANGE.min || parsed.year > YEAR_RANGE.max) {
    return { ok: false, field: "date", message: `date year must be between ${YEAR_RANGE.min} and ${YEAR_RANGE.max} (the calculator's validated range).` };
  }

  const timezoneProvided = Boolean(input.timezone && input.timezone !== "UTC");
  const timezone = input.timezone && input.timezone.length > 0 ? input.timezone : "UTC";
  if (timezoneProvided && !isValidIanaTimeZone(timezone)) {
    return { ok: false, field: "timezone", message: `timezone must be a valid IANA id (e.g. "Europe/Prague") or omitted for UTC.` };
  }

  const date = `${parsed.year}-${pad(parsed.month)}-${pad(parsed.day)}`;
  const noonUtc = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day, 12, 0, 0));
  const utcOffsetMinutes = timezoneProvided ? timezoneOffsetMinutes(timezone, noonUtc) : 0;

  return {
    ok: true,
    location: {
      latitude,
      longitude,
      date,
      year: parsed.year,
      month: parsed.month,
      day: parsed.day,
      timezone: timezoneProvided ? timezone : "UTC",
      timezoneProvided,
      utcOffsetMinutes,
    },
  };
}
