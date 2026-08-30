/**
 * Regenerates `scripts/events/reference/almanac-reference.json`.
 *
 * The accuracy gate measures AsteriaStar's computed events against instants published by two
 * independent authorities: NASA/GSFC's Moon-phase tables and the US Naval Observatory's Earth's
 * Seasons API. Those instants are fetched HERE, once, and pinned — never fetched by the gate itself,
 * which must run offline and give the same answer every time.
 *
 * Run it only to extend the range or after a publisher changes a format:
 *
 *   npx tsx scripts/events/fetch-reference.ts
 *
 * Then read the diff. A reference value that moves is either a publisher correcting itself or this
 * script misreading a page, and both deserve a human look before the gate is allowed to agree.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const FIRST_YEAR = 2026;
const LAST_YEAR = 2028;

const PHASE_TABLE_URL = "https://eclipse.gsfc.nasa.gov/phase/phases2001.html";
const SEASONS_API = "https://aa.usno.navy.mil/api/seasons";
const HORIZONS_API = "https://ssd.jpl.nasa.gov/api/horizons.api";

/** Horizons body codes for the platform's planets and the Sun. */
const HORIZONS_BODIES: [string, string][] = [
  ["mercury", "199"], ["venus", "299"], ["mars", "499"], ["jupiter", "599"],
  ["saturn", "699"], ["uranus", "799"], ["neptune", "899"], ["sun", "10"],
];

/** Four epochs spread across the reference range, at times that are not all midnight. */
const HORIZONS_EPOCHS = ["2026-03-15 00:00", "2026-09-01 12:00", "2027-05-20 06:00", "2028-01-10 18:00"];

const AU_KM = 149_597_870.7;

/**
 * Geometric geocentric positions from JPL Horizons, in the J2000 ecliptic.
 *
 * `VEC_CORR='NONE'` matters: the platform's series produces geometric positions, uncorrected for
 * light-time and aberration, so an astrometric or apparent comparison would report a systematic
 * difference of tens of arcseconds that is not an error in either party.
 */
async function positions(): Promise<{ body: string; epochTdb: string; longitudeJ2000Deg: number; latitudeJ2000Deg: number; distanceAu: number }[]> {
  const out: { body: string; epochTdb: string; longitudeJ2000Deg: number; latitudeJ2000Deg: number; distanceAu: number }[] = [];
  for (const [body, command] of HORIZONS_BODIES) {
    for (const epoch of HORIZONS_EPOCHS) {
      const query = new URLSearchParams({
        format: "text", COMMAND: `'${command}'`, OBJ_DATA: "'NO'", MAKE_EPHEM: "'YES'",
        EPHEM_TYPE: "'VECTORS'", CENTER: "'500@399'", REF_PLANE: "'ECLIPTIC'",
        VEC_CORR: "'NONE'", VEC_TABLE: "'1'", TLIST: `'${epoch}'`,
      });
      const text = await fetchText(`${HORIZONS_API}?${query.toString()}`);
      const m = /X =\s*(-?[\d.E+]+)\s*Y =\s*(-?[\d.E+]+)\s*Z =\s*(-?[\d.E+]+)/.exec(text);
      if (!m) throw new Error(`Horizons returned no vector for ${body} at ${epoch}`);
      const [x, y, z] = m.slice(1, 4).map((v) => Number(v) / AU_KM);
      const r = Math.hypot(x, y, z);
      out.push({
        body,
        epochTdb: `${epoch.replace(" ", "T")}:00Z`,
        longitudeJ2000Deg: Number(((Math.atan2(y, x) * 180) / Math.PI + 360).toFixed(6)) % 360,
        latitudeJ2000Deg: Number(((Math.asin(z / r) * 180) / Math.PI).toFixed(6)),
        distanceAu: Number(r.toFixed(9)),
      });
    }
  }
  return out;
}

const MONTHS = new Map(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => [m, i + 1]));

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { headers: { "user-agent": "asteriastar-reference-fixture/1.0" } });
  if (!response.ok) throw new Error(`${url} responded ${response.status}`);
  return response.text();
}

/**
 * NASA prints four phases per row in fixed columns. Which column a date sits in is what says whether
 * it is a new Moon or a last quarter, so the cells are read by their offset under the header rather
 * than by assuming the phases alternate in a particular order.
 */
async function moonPhases(): Promise<{ type: string; utc: string }[]> {
  const html = await fetchText(PHASE_TABLE_URL);
  const anchor = html.indexOf(`Phases of the Moon:  ${FIRST_YEAR}`);
  if (anchor < 0) throw new Error(`no phase table for ${FIRST_YEAR} on the NASA page`);
  const preStart = html.indexOf("<pre", anchor);
  const block = html.slice(preStart, html.indexOf("</pre>", preStart)).replace(/<[^>]+>/g, "");
  const lines = block.split("\n");
  const header = lines.find((l) => l.includes("New Moon") && l.includes("Last Quarter"));
  if (!header) throw new Error("the phase table header has changed");

  const columns: [string, number][] = [
    ["new-moon", header.indexOf("New Moon")],
    ["first-quarter-moon", header.indexOf("First Quarter")],
    ["full-moon", header.indexOf("Full Moon")],
    ["last-quarter-moon", header.indexOf("Last Quarter")],
  ];

  const out: { type: string; utc: string }[] = [];
  let year = 0;
  for (const line of lines.slice(lines.indexOf(header) + 1)) {
    const yearMatch = /^\s*(\d{4})\s/.exec(line);
    if (yearMatch) year = Number(yearMatch[1]);
    if (year < FIRST_YEAR || year > LAST_YEAR) continue;
    for (const [type, position] of columns) {
      const cell = line.slice(Math.max(0, position - 6), position + 22);
      const m = /([A-Z][a-z]{2})\s+(\d{1,2})\s+(\d{2}):(\d{2})/.exec(cell);
      const month = m ? MONTHS.get(m[1]) : undefined;
      if (!m || month === undefined) continue;
      out.push({ type, utc: `${year}-${String(month).padStart(2, "0")}-${m[2].padStart(2, "0")}T${m[3]}:${m[4]}Z` });
    }
  }
  return out.sort((a, b) => a.utc.localeCompare(b.utc));
}

async function seasons(): Promise<{ phenom: string; utc: string }[]> {
  const out: { phenom: string; utc: string }[] = [];
  for (let year = FIRST_YEAR; year <= LAST_YEAR; year++) {
    const body = (await (await fetch(`${SEASONS_API}?year=${year}`)).json()) as {
      data: { year: number; month: number; day: number; time: string; phenom: string }[];
    };
    for (const row of body.data) {
      out.push({
        phenom: row.phenom,
        utc: `${row.year}-${String(row.month).padStart(2, "0")}-${String(row.day).padStart(2, "0")}T${row.time}Z`,
      });
    }
  }
  return out.sort((a, b) => a.utc.localeCompare(b.utc));
}

async function main(): Promise<void> {
  const document = {
    fetchedAt: new Date().toISOString().replace(/\.\d{3}/, ""),
    note:
      "Independent published instants used to measure the accuracy of AsteriaStar's computed events. Fetched once from the publishers named below and pinned here so the gate is offline and deterministic: a validator that reached the network would fail when a government site was briefly down, and would train everyone to ignore it. Regenerate with scripts/events/fetch-reference.ts when extending the range.",
    moonPhases: {
      sourceUrl: PHASE_TABLE_URL,
      publisher: "NASA/GSFC Eclipse Web Site (Fred Espenak) — Phases of the Moon, Universal Time",
      note: "Universal Time, to the minute, as NASA publishes them.",
      entries: await moonPhases(),
    },
    seasons: {
      sourceUrl: SEASONS_API,
      publisher: "US Naval Observatory, Astronomical Applications Department — Earth's Seasons API (UT1)",
      note: "UT1, to the minute. The USNO API reports Equinox and Solstice without saying which one; the gate matches them by month, which is unambiguous for a single year.",
      entries: await seasons(),
    },
    positions: {
      sourceUrl: HORIZONS_API,
      publisher: "NASA/JPL Solar System Dynamics — Horizons system, geometric geocentric vectors (VEC_CORR='NONE') in the J2000 ecliptic",
      note:
        "Geometric positions, uncorrected for light-time and aberration, which is what the platform's series produces and therefore what it may honestly be compared against. Horizons epochs are TDB and the gate treats them as UTC; the ~70 s difference moves the fastest body here by about three arcseconds, two orders of magnitude below the tolerance.",
      entries: await positions(),
    },
  };

  const path = resolve(process.cwd(), "scripts/events/reference/almanac-reference.json");
  writeFileSync(path, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Wrote ${document.moonPhases.entries.length} phases, ${document.seasons.entries.length} season instants and ${document.positions.entries.length} Horizons positions to ${path}`);
}

void main();
