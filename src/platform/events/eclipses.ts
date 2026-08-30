import { num } from "@/platform/live-providers/normalise";
import type { ParseResult } from "@/platform/live-providers/client";
import type { AstronomicalEvent, EventSource } from "@/platform/events/model";

/**
 * NASA's Five Millennium Catalog of Eclipses, read as published.
 *
 * Eclipse prediction is a Besselian-elements calculation of a kind this platform has no business
 * reimplementing: the answer depends on the lunar limb profile, on ΔT extrapolated centuries ahead,
 * and on a shadow geometry where a small error moves a totality path across a country. Espenak and
 * Meeus did that work for five thousand years of eclipses and NASA/GSFC publishes the result. So
 * these events are SOURCE-BACKED: reproduced from the catalogue, attributed, and linked — not
 * recomputed here and quietly presented as ours.
 *
 * Two details in the catalogue are easy to get wrong and both are handled explicitly:
 *
 *  - **The times are Terrestrial Dynamical Time, not UTC.** The catalogue publishes ΔT alongside
 *    each eclipse precisely so the conversion can be made; UTC = TD − ΔT. For 2026 that is 75
 *    seconds. Ignoring it would put every eclipse a minute and a quarter late, which is more than
 *    the width of second contact.
 *  - **The century tables and the five-millennium text file do not have the same columns.** The
 *    century tables omit the Sun's azimuth. Every field this parser needs is taken from the
 *    left-hand prefix the two layouts share, and the central duration is matched by its shape
 *    rather than by counting from the right. Nothing is read by position from the end of a row.
 */

/** Where the eclipse tables live, and what the columns mean. Both are quoted in the provenance. */
export const SOLAR_CATALOGUE_URL = "https://eclipse.gsfc.nasa.gov/SEcat5/SE2001-2100.html";
export const LUNAR_CATALOGUE_URL = "https://eclipse.gsfc.nasa.gov/LEcat5/LE2001-2100.html";
export const SOLAR_KEY_URL = "https://eclipse.gsfc.nasa.gov/SEcat5/catkey.html";
export const LUNAR_KEY_URL = "https://eclipse.gsfc.nasa.gov/LEcat5/LEcatkey.html";

const MONTHS = new Map<string, number>(
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => [m, i]),
);

/**
 * The shared left-hand prefix of both catalogues:
 * catalogue number, calendar date, TD of greatest eclipse, ΔT, lunation, Saros, type, then the
 * quincena parameter. Anchored to the start of the row so a trailing column that exists in one
 * layout and not the other can never shift a value.
 *
 * The eclipse-type cell is one or TWO characters with no space between them — `T`, but also `An`,
 * `Pb`, `H3`, `T+`, `A-`, `Nx`. Requiring whitespace after the first character silently dropped
 * thirteen solar and thirty-three lunar eclipses from the century, including the total lunar
 * eclipses of 2007 and 2011, and left a catalogue that looked entirely healthy. The strict row
 * accounting below exists because of that: a row that looks like a catalogue row and does not parse
 * is now an error, not a shrug.
 */
const ROW_RE =
  /^\s*(\d{4,5})\s+(\d{4})\s+([A-Z][a-z]{2})\s+(\d{1,2})\s+(\d{2}):(\d{2}):(\d{2})\s+(-?\d+)\s+(-?\d+)\s+(\d+)\s+([NPATH])(\S?)\s+(\S+)\s+(.*)$/;

/** Anything shaped like `NNNNN  YYYY Mon DD ` at the start of a row is a catalogue entry. */
const CANDIDATE_RE = /^\s*\d{4,5}\s+\d{4}\s+[A-Z][a-z]{2}\s+\d{1,2}\s/;

/** `02m18s` — the central duration of a solar eclipse, recognised by shape, never by position. */
const DURATION_RE = /(\d{1,3})m(\d{2})s\s*$/;

/** Strips the anchors NASA wraps individual cells in, leaving the plain columnar row. */
function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export interface CatalogueEclipse {
  catalogueNumber: string;
  /** Instant of greatest eclipse, converted from TD to UTC using the catalogue's own ΔT. */
  greatestEclipseUtc: string;
  deltaTSeconds: number;
  lunationNumber: number;
  sarosSeries: number;
  /** `N` penumbral, `P` partial, `A` annular, `T` total, `H` hybrid. */
  typeCode: string;
  gamma?: number;
  /** Solar: eclipse magnitude. Lunar: umbral magnitude, with the penumbral value alongside. */
  magnitude?: number;
  penumbralMagnitude?: number;
  /** Latitude and longitude of greatest eclipse, as the catalogue formats them (e.g. `65N`, `25W`). */
  greatestLatitude?: string;
  greatestLongitude?: string;
  /** The same point in signed decimal degrees, for machine-readable use. */
  greatestLatitudeDeg?: number;
  greatestLongitudeDeg?: number;
  /** Solar only: duration of central eclipse, in seconds. */
  centralDurationSeconds?: number;
  /** Lunar only: the published phase durations, in minutes. */
  penumbralMinutes?: number;
  partialMinutes?: number;
  totalMinutes?: number;
}

export interface EclipseCatalogue {
  kind: "solar" | "lunar";
  sourceUrl: string;
  eclipses: CatalogueEclipse[];
}

/**
 * Latitude/longitude cells look like `65N` or `171W`. Returns both the display form and signed
 * decimal degrees; anything else is left out rather than guessed at.
 */
function coordinate(value: string | undefined, axis: "NS" | "EW"): { text: string; degrees: number } | undefined {
  if (!value) return undefined;
  const m = new RegExp(`^(\\d{1,3}(?:\\.\\d)?)([${axis}])$`).exec(value);
  if (!m) return undefined;
  const magnitude = Number(m[1]);
  const negative = m[2] === "S" || m[2] === "W";
  const limit = axis === "NS" ? 90 : 180;
  if (!Number.isFinite(magnitude) || magnitude > limit) return undefined;
  return { text: `${m[1]}°${m[2]}`, degrees: negative ? -magnitude : magnitude };
}

/** Both forms are set together, or neither is: a half-parsed coordinate is worse than none. */
function applyCoordinates(
  entry: CatalogueEclipse,
  latitude: { text: string; degrees: number } | undefined,
  longitude: { text: string; degrees: number } | undefined,
): void {
  if (!latitude || !longitude) return;
  entry.greatestLatitude = latitude.text;
  entry.greatestLongitude = longitude.text;
  entry.greatestLatitudeDeg = latitude.degrees;
  entry.greatestLongitudeDeg = longitude.degrees;
}

function parseCatalogue(kind: "solar" | "lunar", raw: unknown, sourceUrl: string): ParseResult<EclipseCatalogue> {
  if (typeof raw !== "string") return { ok: false, problem: "expected the eclipse catalogue as text" };
  const eclipses: CatalogueEclipse[] = [];
  let candidates = 0;

  for (const rawLine of raw.split(/\r?\n/)) {
    const row = stripTags(rawLine);
    if (CANDIDATE_RE.test(row)) candidates += 1;
    const m = ROW_RE.exec(row);
    if (!m) continue;
    const month = MONTHS.get(m[3]);
    if (month === undefined) continue;

    const deltaT = num(m[8]);
    const year = num(m[2]);
    const day = num(m[4]);
    if (deltaT === undefined || year === undefined || day === undefined) continue;
    /*
     * ΔT is bounded before it is used.
     *
     * The capture is `(-?\d+)`, so a mangled cell can be any magnitude. An enormous one made
     * `toISOString()` throw a RangeError — contained by the runtime, but the outcome was that a
     * single bad character deleted all two hundred and twenty-four eclipses. A merely absurd one
     * was worse: ΔT = 999,999,999 silently dated a 2026 eclipse to 1994 and everything downstream
     * believed it. Across the catalogue's five-millennium span ΔT runs from about +46,000 s to
     * −20 s, so ±100,000 admits every real value and nothing else. A row outside it is not read.
     */
    if (!Number.isFinite(deltaT) || Math.abs(deltaT) > 100_000) continue;
    // TD → UTC. The catalogue publishes ΔT for exactly this conversion; skipping it would place
    // every eclipse ΔT seconds late without any other symptom.
    const td = Date.UTC(year, month, day, Number(m[5]), Number(m[6]), Number(m[7]));
    const utc = td - deltaT * 1000;
    if (!Number.isFinite(td) || !Number.isFinite(utc)) continue;

    const rest = m[14].trim().split(/\s+/);
    const durationMatch = DURATION_RE.exec(m[14].trim());
    const entry: CatalogueEclipse = {
      catalogueNumber: m[1],
      greatestEclipseUtc: new Date(utc).toISOString().replace(".000", ""),
      deltaTSeconds: deltaT,
      lunationNumber: num(m[9]) ?? 0,
      sarosSeries: num(m[10]) ?? 0,
      typeCode: m[11],
      gamma: num(rest[0]),
    };

    if (kind === "solar") {
      entry.magnitude = num(rest[1]);
      applyCoordinates(entry, coordinate(rest[2], "NS"), coordinate(rest[3], "EW"));
      if (durationMatch) entry.centralDurationSeconds = Number(durationMatch[1]) * 60 + Number(durationMatch[2]);
    } else {
      entry.penumbralMagnitude = num(rest[1]);
      entry.magnitude = num(rest[2]);
      entry.penumbralMinutes = num(rest[3]);
      entry.partialMinutes = num(rest[4]);
      entry.totalMinutes = num(rest[5]);
      // The last two cells are the sub-lunar point; a dash stands in for a phase that does not occur.
      applyCoordinates(entry, coordinate(rest[rest.length - 2], "NS"), coordinate(rest[rest.length - 1], "EW"));
    }
    eclipses.push(entry);
  }

  if (eclipses.length < 100) {
    return { ok: false, problem: `only ${eclipses.length} eclipse rows parsed from the century catalogue; the layout has probably changed` };
  }
  /*
   * Every row that LOOKS like a catalogue entry must have become one.
   *
   * A parser that skips what it does not understand degrades into silence: the page still renders,
   * the count still looks plausible, and the eclipses that happen to sit in the unhandled shape
   * simply do not exist. Refusing the whole response is the honest failure, and the runtime already
   * knows how to say a product is unavailable.
   */
  if (eclipses.length !== candidates) {
    return {
      ok: false,
      problem: `${candidates} rows in the catalogue look like eclipse entries but ${eclipses.length} parsed; the column layout has changed and the missing eclipses would be invisible rather than wrong`,
    };
  }
  eclipses.sort((a, b) => Date.parse(a.greatestEclipseUtc) - Date.parse(b.greatestEclipseUtc));
  return { ok: true, value: { kind, sourceUrl, eclipses }, generatedAt: undefined };
}

export const parseSolarCatalogue = (raw: unknown): ParseResult<EclipseCatalogue> => parseCatalogue("solar", raw, SOLAR_CATALOGUE_URL);
export const parseLunarCatalogue = (raw: unknown): ParseResult<EclipseCatalogue> => parseCatalogue("lunar", raw, LUNAR_CATALOGUE_URL);

/* ------------------------------------------------------------------ events */

/**
 * NASA conditions reuse of each catalogue on a specific acknowledgment, and the two are NOT the
 * same string — the solar tables credit Espenak alone, the lunar tables Espenak and Meeus. Both are
 * quoted exactly as NASA words them, and the right one travels with every eclipse.
 */
const ACKNOWLEDGMENT = {
  solar: "Eclipse Predictions by Fred Espenak (NASA's GSFC)",
  lunar: "Eclipse Predictions by Fred Espenak and Jean Meeus (NASA's GSFC)",
} as const;

const SOLAR_TYPE: Record<string, { name: string; summary: string }> = {
  T: { name: "Total solar eclipse", summary: "The Moon covers the Sun completely along a narrow path, where the corona becomes visible. Everywhere else in the region sees a partial eclipse." },
  A: { name: "Annular solar eclipse", summary: "The Moon is too far from Earth to cover the Sun completely, leaving a bright ring. There is no safe moment to look without a filter, at any point of an annular eclipse." },
  H: { name: "Hybrid solar eclipse", summary: "The eclipse is total along part of its path and annular along the rest, because Earth's curvature changes the distance to the Moon along the track." },
  P: { name: "Partial solar eclipse", summary: "The Moon covers part of the Sun's disc. The darkest shadow misses Earth entirely, so no part of the path sees totality." },
};

const LUNAR_TYPE: Record<string, { name: string; summary: string }> = {
  T: { name: "Total lunar eclipse", summary: "The Moon passes entirely into Earth's umbral shadow and usually turns a deep copper red, lit only by sunlight refracted through Earth's atmosphere. Safe to watch with no equipment at all." },
  P: { name: "Partial lunar eclipse", summary: "Part of the Moon enters Earth's umbral shadow, taking a distinct bite out of the disc." },
  N: { name: "Penumbral lunar eclipse", summary: "The Moon passes only through the faint outer shadow. The effect is a subtle shading across the disc, and a shallow one is genuinely hard to notice." },
};

const SAFETY =
  "Never look at the Sun without a filter made for the purpose. Sunglasses, exposed film and smoked glass are not filters, and neither is a camera, binocular or telescope without one fitted in front of the objective.";

function minutes(value: number | undefined): string | undefined {
  if (value === undefined) return undefined;
  const whole = Math.floor(value);
  return `${whole} min ${Math.round((value - whole) * 60)} s`;
}

/** Turns catalogue rows into calendar events for a window. */
export function eclipseEvents(catalogue: EclipseCatalogue, fromMs: number, toMs: number): AstronomicalEvent[] {
  const source: EventSource = {
    providerKey: "nasa-gsfc-eclipse",
    label: `NASA/GSFC Five Millennium Catalog of ${catalogue.kind === "solar" ? "Solar" : "Lunar"} Eclipses — ${ACKNOWLEDGMENT[catalogue.kind]}`,
    url: catalogue.sourceUrl,
    sources: ["nasa"],
  };

  return catalogue.eclipses
    .filter((e) => {
      const t = Date.parse(e.greatestEclipseUtc);
      return t >= fromMs && t <= toMs;
    })
    .map((e) => {
      const solar = catalogue.kind === "solar";
      const type = (solar ? SOLAR_TYPE : LUNAR_TYPE)[e.typeCode] ?? { name: solar ? "Solar eclipse" : "Lunar eclipse", summary: "" };
      const facts: { label: string; value: string }[] = [
        { label: "Saros series", value: String(e.sarosSeries) },
        { label: "Gamma", value: e.gamma !== undefined ? e.gamma.toFixed(4) : "not published" },
      ];
      if (solar) {
        if (e.magnitude !== undefined) facts.push({ label: "Eclipse magnitude", value: e.magnitude.toFixed(4) });
        if (e.centralDurationSeconds !== undefined) {
          facts.push({
            label: "Duration of central eclipse",
            value: `${Math.floor(e.centralDurationSeconds / 60)} min ${e.centralDurationSeconds % 60} s at greatest eclipse`,
          });
        }
      } else {
        if (e.magnitude !== undefined) facts.push({ label: "Umbral magnitude", value: e.magnitude.toFixed(4) });
        if (e.penumbralMagnitude !== undefined) facts.push({ label: "Penumbral magnitude", value: e.penumbralMagnitude.toFixed(4) });
        const total = minutes(e.totalMinutes);
        const partial = minutes(e.partialMinutes);
        const penumbral = minutes(e.penumbralMinutes);
        if (total) facts.push({ label: "Totality lasts", value: total });
        if (partial) facts.push({ label: "Partial phase lasts", value: partial });
        if (penumbral) facts.push({ label: "Penumbral phase lasts", value: penumbral });
      }
      if (e.greatestLatitude && e.greatestLongitude) {
        facts.push({
          label: solar ? "Greatest eclipse over" : "Moon overhead at",
          value: `${e.greatestLatitude}, ${e.greatestLongitude}`,
        });
      }
      facts.push({ label: "ΔT applied", value: `${e.deltaTSeconds} s, from the catalogue, converting its Terrestrial Dynamical Time to UTC` });

      return {
        eventId: `eclipse-${catalogue.kind}-${e.catalogueNumber}`,
        title: type.name,
        summary: `${type.summary}${solar ? ` ${SAFETY}` : ""}`,
        category: "eclipse",
        eventType: `${e.typeCode === "N" ? "penumbral" : e.typeCode === "P" ? "partial" : e.typeCode === "A" ? "annular" : e.typeCode === "H" ? "hybrid" : "total"}-${catalogue.kind}-eclipse`,
        basis: "source-backed",
        start: e.greatestEclipseUtc,
        precision: "minute",
        applicability: solar
          ? {
              scope: "path",
              detail: `Greatest eclipse occurs over ${e.greatestLatitude ?? "an unlisted point"}, ${e.greatestLongitude ?? ""}. Which places see totality, and which see only a partial eclipse, is set by the shadow path — AsteriaStar does not compute it, and NASA publishes the maps.`.trim(),
          }
          : {
              scope: "hemisphere",
              detail: "Visible from the whole night side of Earth at the time of greatest eclipse; the Moon is overhead at the point listed below and lower in the sky the farther you are from it.",
            },
        source,
        uncertainty:
          "As published. Instants are quoted to the second in the catalogue; the conversion to UTC uses the catalogue's own ΔT, which is itself a prediction for future dates.",
        entityIds: solar ? ["sun", "moon"] : ["moon", "earth"],
        confirmed: true,
        ...(e.greatestLatitudeDeg !== undefined && e.greatestLongitudeDeg !== undefined
          ? {
              geo: {
                latitudeDeg: e.greatestLatitudeDeg,
                longitudeDeg: e.greatestLongitudeDeg,
                name: solar
                  ? "Point of greatest eclipse — where the shadow axis passes closest to Earth's centre"
                  : "Point where the Moon is overhead at greatest eclipse",
              },
            }
          : {}),
        facts,
      } satisfies AstronomicalEvent;
    });
}
