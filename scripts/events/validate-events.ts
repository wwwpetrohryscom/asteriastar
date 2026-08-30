import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { computedEvents } from "../../src/platform/events/computed";
import { eclipseEvents, parseLunarCatalogue, parseSolarCatalogue } from "../../src/platform/events/eclipses";
import { launchEvents, parseLaunches } from "../../src/platform/events/launches";
import { meteorShowerEvents, DATEABLE_SHOWERS, UNDATEABLE_SHOWERS } from "../../src/platform/events/showers";
import { toIcs } from "../../src/platform/events/ics";
import { compareEvents, eventProblems, type AstronomicalEvent } from "../../src/platform/events/model";
import { offlineEvents, clearEventCache } from "../../src/platform/events/service";
import { LIVE_PRODUCTS, getLiveProvider } from "../../src/platform/live-providers/registry";
import { planetGeocentric, sunGeocentric, type PlanetKey } from "../../src/platform/live-sky/providers/planetary-position";

/**
 * The permanent events gate (Program CM).
 *
 * Offline and deterministic. It runs in `npm run validate`, so it must never reach the network and
 * must never depend on today's date landing conveniently.
 *
 * It does two different jobs. The first is structural: every event obeys the rules the model states,
 * planned dates are never dressed up as confirmed, computed events name their algorithm, and the
 * calendar file that leaves the site says the same things the page does.
 *
 * The second is the one that matters more. It MEASURES the computed events against instants
 * published independently by NASA and the US Naval Observatory, and fails if the error exceeds what
 * the pages claim. Every event on this platform states an uncertainty; without this the statement
 * would be an assertion. With it, the claim is checked on every build against a hundred and
 * forty-nine lunar phases and eighteen season instants that AsteriaStar had no hand in producing.
 */

interface ReferenceDocument {
  fetchedAt: string;
  moonPhases: { sourceUrl: string; publisher: string; entries: { type: string; utc: string }[] };
  seasons: { sourceUrl: string; publisher: string; entries: { phenom: string; utc: string }[] };
  positions: {
    sourceUrl: string;
    publisher: string;
    entries: { body: string; epochTdb: string; longitudeJ2000Deg: number; latitudeJ2000Deg: number; distanceAu: number }[];
  };
}

const problems: string[] = [];
const notes: string[] = [];
const fail = (message: string): void => void problems.push(message);

/* ------------------------------------------------------------------ tolerances */

/**
 * How far a computed instant may fall from the published one before the gate fails.
 *
 * These are not aspirations. They are the errors actually measured against the pinned references,
 * with enough headroom that an innocuous change does not trip the build, and they are the numbers
 * the pages quote. Raising one to make a failing build pass is a change to a published claim and
 * must be made deliberately, in the same commit as the wording it invalidates.
 */
const TOLERANCE_MINUTES = {
  /** Lunar phases: the low-precision lunar theory is the limit. Pages say "about 15 minutes". */
  phase: 45,
  /** Equinoxes and solstices. Pages say "about 15 minutes". */
  season: 20,
  /** Earth's apsides, where the distance is nearly stationary. Pages say "about six hours". */
  apsis: 6 * 60,
};

/**
 * How far a planet's computed position may fall from JPL Horizons, in arcminutes.
 *
 * The planetary events — oppositions, conjunctions, elongations, planet pairs — have no published
 * table of instants to check against the way the phases and the equinoxes do. What they do have is a
 * position series, and that CAN be checked: this bounds the error in the thing the event times are
 * derived from, so the hours quoted on those events follow from a measurement rather than from
 * confidence. The measured worst is Saturn at just under five arcminutes.
 */
const POSITION_TOLERANCE_ARCMIN = 8;

/** Distances are the weaker part of a low-precision series; Uranus is the worst at ~300 ppm. */
const DISTANCE_TOLERANCE_PPM = 1000;

function minutesBetween(a: string, b: string): number {
  return Math.abs(Date.parse(a) - Date.parse(b)) / 60_000;
}

/* ------------------------------------------------------------------ 1. accuracy */

const reference = JSON.parse(
  readFileSync(resolve(process.cwd(), "scripts/events/reference/almanac-reference.json"), "utf8"),
) as ReferenceDocument;

const referenceYears = [...new Set(reference.moonPhases.entries.map((e) => Number(e.utc.slice(0, 4))))].sort();
const firstYear = referenceYears[0];
const lastYear = referenceYears[referenceYears.length - 1];

clearEventCache();
const computed = computedEvents(Date.UTC(firstYear, 0, 1), Date.UTC(lastYear + 1, 0, 1)).sort(compareEvents);

/** Nearest computed event of a type, so a missing event is reported as missing rather than as drift. */
function nearest(type: string, utc: string): AstronomicalEvent | undefined {
  let best: AstronomicalEvent | undefined;
  let bestGap = Infinity;
  for (const event of computed) {
    if (event.eventType !== type) continue;
    const gap = minutesBetween(event.start, utc);
    if (gap < bestGap) { bestGap = gap; best = event; }
  }
  return best;
}

let worstPhase = { minutes: 0, detail: "" };
for (const entry of reference.moonPhases.entries) {
  const match = nearest(entry.type, entry.utc);
  if (!match) { fail(`accuracy: no computed ${entry.type} anywhere near NASA's ${entry.utc}`); continue; }
  const gap = minutesBetween(match.start, entry.utc);
  if (gap > worstPhase.minutes) worstPhase = { minutes: gap, detail: `${entry.type} ${entry.utc} vs computed ${match.start}` };
  if (gap > TOLERANCE_MINUTES.phase) {
    fail(`accuracy: computed ${entry.type} ${match.start} is ${gap.toFixed(0)} min from NASA's ${entry.utc} (tolerance ${TOLERANCE_MINUTES.phase} min)`);
  }
}

// The count must match too: a phase the finder skipped would never be compared above.
for (const year of referenceYears) {
  for (const type of ["new-moon", "first-quarter-moon", "full-moon", "last-quarter-moon"]) {
    const published = reference.moonPhases.entries.filter((e) => e.type === type && e.utc.startsWith(String(year))).length;
    const found = computed.filter((e) => e.eventType === type && e.start.startsWith(String(year))).length;
    if (published !== found) fail(`accuracy: ${found} computed ${type} events in ${year}, NASA publishes ${published}`);
  }
}

/** USNO reports "Equinox" and "Solstice" without saying which; the month settles it unambiguously. */
const SEASON_BY_MONTH: Record<string, string> = { "03": "march-equinox", "06": "june-solstice", "09": "september-equinox", "12": "december-solstice" };

let worstSeason = { minutes: 0, detail: "" };
let worstApsis = { minutes: 0, detail: "" };
for (const entry of reference.seasons.entries) {
  const month = entry.utc.slice(5, 7);
  const type =
    entry.phenom === "Perihelion" ? "earth-perihelion" : entry.phenom === "Aphelion" ? "earth-aphelion" : SEASON_BY_MONTH[month];
  if (!type) { fail(`accuracy: USNO reports "${entry.phenom}" in month ${month}, which this gate does not know how to match`); continue; }
  const match = nearest(type, entry.utc);
  if (!match) { fail(`accuracy: no computed ${type} anywhere near USNO's ${entry.utc}`); continue; }
  const gap = minutesBetween(match.start, entry.utc);
  const apsis = type.startsWith("earth-");
  const tolerance = apsis ? TOLERANCE_MINUTES.apsis : TOLERANCE_MINUTES.season;
  const worst = apsis ? worstApsis : worstSeason;
  if (gap > worst.minutes) {
    const record = { minutes: gap, detail: `${type} ${entry.utc} vs computed ${match.start}` };
    if (apsis) worstApsis = record; else worstSeason = record;
  }
  if (gap > tolerance) {
    fail(`accuracy: computed ${type} ${match.start} is ${gap.toFixed(0)} min from USNO's ${entry.utc} (tolerance ${tolerance} min)`);
  }
}

notes.push(`worst lunar phase error: ${worstPhase.minutes.toFixed(1)} min (${worstPhase.detail})`);
notes.push(`worst equinox/solstice error: ${worstSeason.minutes.toFixed(1)} min (${worstSeason.detail})`);
notes.push(`worst Earth apsis error: ${(worstApsis.minutes / 60).toFixed(1)} h (${worstApsis.detail})`);


/* ------------------------------------------------------------------ 1b. planetary positions */

const D2R = Math.PI / 180;
const OBLIQUITY = 23.43928 * D2R;

/** Equatorial J2000 to ecliptic J2000, the frame Horizons was asked for. */
function eclipticJ2000(rightAscensionDeg: number, declinationDeg: number): { lon: number; lat: number } {
  const ra = rightAscensionDeg * D2R;
  const dec = declinationDeg * D2R;
  const x = Math.cos(dec) * Math.cos(ra);
  const y = Math.cos(dec) * Math.sin(ra) * Math.cos(OBLIQUITY) + Math.sin(dec) * Math.sin(OBLIQUITY);
  const z = Math.sin(dec) * Math.cos(OBLIQUITY) - Math.cos(dec) * Math.sin(ra) * Math.sin(OBLIQUITY);
  return { lon: ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360, lat: (Math.asin(z) * 180) / Math.PI };
}

let worstPosition = { arcmin: 0, detail: "" };
let worstDistance = { ppm: 0, detail: "" };
for (const entry of reference.positions.entries) {
  const at = new Date(entry.epochTdb);
  const computedPosition = entry.body === "sun" ? sunGeocentric(at) : planetGeocentric(entry.body as PlanetKey, at);
  const ecliptic = eclipticJ2000(computedPosition.rightAscensionDeg, computedPosition.declinationDeg);
  // Longitude differences are scaled by cos(latitude) so the comparison is a real angle on the sky
  // rather than a coordinate difference that inflates near the poles.
  const dLon = Math.abs(((ecliptic.lon - entry.longitudeJ2000Deg + 540) % 360) - 180) * Math.cos(entry.latitudeJ2000Deg * D2R);
  const separationArcmin = Math.hypot(dLon, ecliptic.lat - entry.latitudeJ2000Deg) * 60;
  const distancePpm = (Math.abs(computedPosition.distanceAu - entry.distanceAu) / entry.distanceAu) * 1e6;

  if (separationArcmin > worstPosition.arcmin) worstPosition = { arcmin: separationArcmin, detail: `${entry.body} at ${entry.epochTdb}` };
  if (distancePpm > worstDistance.ppm) worstDistance = { ppm: distancePpm, detail: `${entry.body} at ${entry.epochTdb}` };
  if (separationArcmin > POSITION_TOLERANCE_ARCMIN) {
    fail(`accuracy: ${entry.body} at ${entry.epochTdb} is ${separationArcmin.toFixed(2)}\u2032 from JPL Horizons (tolerance ${POSITION_TOLERANCE_ARCMIN}\u2032)`);
  }
  if (distancePpm > DISTANCE_TOLERANCE_PPM) {
    fail(`accuracy: ${entry.body} at ${entry.epochTdb} differs from Horizons by ${distancePpm.toFixed(0)} ppm in distance (tolerance ${DISTANCE_TOLERANCE_PPM})`);
  }
}
notes.push(`worst planetary position error: ${worstPosition.arcmin.toFixed(2)}\u2032 (${worstPosition.detail}), distance ${worstDistance.ppm.toFixed(0)} ppm (${worstDistance.detail})`);

/* ------------------------------------------------------------------ 2. structure */

const showers = meteorShowerEvents(Date.UTC(firstYear, 0, 1), Date.UTC(lastYear + 1, 0, 1));
const sample = [...computed, ...showers];
for (const problem of sample.flatMap(eventProblems)) fail(`structure: ${problem}`);

if (DATEABLE_SHOWERS.length === 0) fail("structure: no meteor shower has a peak night the calendar can date");
for (const shower of UNDATEABLE_SHOWERS) {
  if (showers.some((e) => e.eventId.includes(shower.slug))) {
    fail(`structure: ${shower.name} has no stated peak night but appears in the dated calendar`);
  }
}

// Every computed event names an algorithm AND a version, and the versions are consistent: a bumped
// algorithm with a stale version elsewhere would make the provenance a lie in one place only.
const versions = new Set(computed.map((e) => e.method?.version));
if (versions.size !== 1) fail(`structure: computed events report ${versions.size} different algorithm versions`);
for (const event of computed) {
  if (!event.method?.algorithm || !event.method.note) fail(`structure: ${event.eventId} does not describe its calculation`);
}

// Identifiers must be unique: two events sharing one would collide in the calendar file a reader
// subscribes to, and one would silently replace the other in their software.
const ids = new Map<string, number>();
for (const event of sample) ids.set(event.eventId, (ids.get(event.eventId) ?? 0) + 1);
for (const [id, count] of ids) if (count > 1) fail(`structure: event id "${id}" is used ${count} times`);

// No event may sit outside the window it was asked for.
const windowFrom = Date.UTC(firstYear, 0, 1);
const windowTo = Date.UTC(lastYear + 1, 0, 1);
for (const event of sample) {
  const start = Date.parse(event.start);
  if (start < windowFrom || start > windowTo) fail(`structure: ${event.eventId} at ${event.start} falls outside the requested window`);
}

/*
 * Sequences that must not have holes.
 *
 * The count check above only covers the lunar phases, because only they have a published table to
 * count against. The other periodic families have no table — but they do have a shape, and a
 * missing event breaks it. Apsides strictly alternate and are about a fortnight apart; inferior and
 * superior conjunctions of a given planet strictly alternate. A gap of two intervals where there
 * should be one is a dropped event, which is exactly what the abutting per-year scan windows used to
 * produce at New Year: the Moon's apogee of 1 January 2028 existed nowhere on the site, and nothing
 * noticed, because no rule said the sequence had to be unbroken.
 *
 * This is checked through `offlineEvents` — the production path, with its per-year memoisation —
 * rather than through a single continuous call, because the defect lived in the assembly and not in
 * the finder.
 */
clearEventCache();
const sequenceEvents = offlineEvents(Date.UTC(firstYear, 0, 1), Date.UTC(lastYear + 1, 0, 1));

function checkAlternating(label: string, typeA: string, typeB: string, maxGapDays: number): void {
  const series = sequenceEvents
    .filter((e) => e.eventType === typeA || e.eventType === typeB)
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  if (series.length < 4) { fail(`sequence: only ${series.length} ${label} events across ${firstYear}\u2013${lastYear}`); return; }
  for (let i = 1; i < series.length; i++) {
    const gapDays = (Date.parse(series[i].start) - Date.parse(series[i - 1].start)) / 86_400_000;
    if (series[i].eventType === series[i - 1].eventType) {
      fail(`sequence: two consecutive ${series[i].eventType} events (${series[i - 1].start} then ${series[i].start}) — one of the pair between them is missing`);
    }
    if (gapDays > maxGapDays) {
      fail(`sequence: ${gapDays.toFixed(1)} days between ${series[i - 1].eventType} ${series[i - 1].start} and ${series[i].eventType} ${series[i].start}, which is longer than ${label} can be — an event has been dropped`);
    }
  }
}

// Anomalistic month 27.55 d, so half of it is ~13.8; 17 allows the real variation and nothing more.
checkAlternating("a lunar apsis interval", "moon-perigee", "moon-apogee", 17);
// Earth's apsides are half a year apart.
checkAlternating("half of Earth's orbit", "earth-perihelion", "earth-aphelion", 200);

/* ------------------------------------------------------------------ 3. honesty */

for (const event of sample) {
  // The word "live" belongs to observations. Nothing in a calendar is an observation.
  if (/\blive\b/i.test(event.summary)) fail(`honesty: ${event.eventId} describes a predicted event as live`);
  if (event.basis === "forecast" && !/vary|approxim|about a day|either side|not:/i.test(event.uncertainty ?? "")) {
    fail(`honesty: ${event.eventId} is a forecast but its uncertainty does not say the date is approximate`);
  }
}

/* ------------------------------------------------------------------ 4. parsers */

const SOLAR_FIXTURE = [
  // Catalogue rows carry Terrestrial Dynamical Time and the ΔT that converts it. Getting that
  // conversion backwards, or dropping it, moves every eclipse by ΔT with no other symptom.
  "09565  2026 Feb 17  12:13:06     75    323  121   A   -t  -0.9743  0.9630  65S  87E  12  616  02m20s",
  "09566  2026 Aug 12  17:47:06     75    329  126   T   -p   0.8977  1.0386  65N  25W  26  294  02m18s",
  // A two-character eclipse type. Requiring whitespace after the first character silently dropped
  // thirteen solar and thirty-three lunar eclipses from the century.
  "09538  2013 Nov 03  12:47:36     68    171  143   H3  n-   0.3272  1.0159   3N  12W  71   58  01m40s",
];
const solarProbe = parseSolarCatalogue([...SOLAR_FIXTURE, ...Array.from({ length: 100 }, (_, i) => `0${9600 + i}  2030 Jan 01  00:00:00     80    400  100   P   --   0.0000  0.5000   0N   0E   0    0  00m00s`)].join("\n"));
if (!solarProbe.ok) fail(`parser: the solar catalogue fixture no longer parses — ${solarProbe.problem}`);
else {
  const total = solarProbe.value.eclipses.find((e) => e.catalogueNumber === "09566");
  if (!total) fail("parser: the 2026 August total solar eclipse is missing from the fixture");
  else {
    if (total.greatestEclipseUtc !== "2026-08-12T17:45:51Z") {
      fail(`parser: TD→UTC conversion gives ${total.greatestEclipseUtc}, expected 2026-08-12T17:45:51Z (17:47:06 TD less 75 s)`);
    }
    if (total.typeCode !== "T") fail(`parser: eclipse type read as "${total.typeCode}", expected "T"`);
    if (total.centralDurationSeconds !== 138) fail(`parser: central duration read as ${total.centralDurationSeconds} s, expected 138`);
  }
  if (!solarProbe.value.eclipses.some((e) => e.catalogueNumber === "09538")) {
    fail("parser: a two-character eclipse type is still being dropped");
  }
}

// A row that looks like an entry and does not parse must fail the whole response rather than vanish.
const truncated = parseSolarCatalogue([...SOLAR_FIXTURE, "09567  2027 Feb 06  16:00:48  MALFORMED", ...Array.from({ length: 100 }, () => "09600  2030 Jan 01  00:00:00     80    400  100   P   --   0.0000  0.5000   0N   0E   0    0  00m00s")].join("\n"));
if (truncated.ok) fail("parser: a malformed catalogue row was skipped instead of failing the response");

const lunarProbe = parseLunarCatalogue(
  ["09708  2026 Mar 03  11:34:52     75    323  133   T   a-  -0.3765  2.1838  1.1507  338.6  207.2   58.3    6N  171W",
   ...Array.from({ length: 100 }, () => "09709  2030 Jan 01  00:00:00     80    400  100   N   --   0.0000  0.5000  -0.1000   10.0    -      -      0N    0E")].join("\n"),
);
if (!lunarProbe.ok) fail(`parser: the lunar catalogue fixture no longer parses — ${lunarProbe.problem}`);
else {
  const totalLunar = lunarProbe.value.eclipses.find((e) => e.catalogueNumber === "09708");
  if (!totalLunar) fail("parser: the 2026 March total lunar eclipse is missing from the fixture");
  else {
    if (totalLunar.greatestEclipseUtc !== "2026-03-03T11:33:37Z") fail(`parser: lunar TD→UTC gives ${totalLunar.greatestEclipseUtc}, expected 2026-03-03T11:33:37Z`);
    if (totalLunar.totalMinutes !== 58.3) fail(`parser: totality read as ${totalLunar.totalMinutes} min, expected 58.3`);
    if (totalLunar.penumbralMinutes !== 338.6) fail(`parser: penumbral phase read as ${totalLunar.penumbralMinutes} min, expected 338.6`);
  }
  const events = eclipseEvents(lunarProbe.value, Date.UTC(2026, 0, 1), Date.UTC(2027, 0, 1));
  for (const problem of events.flatMap(eventProblems)) fail(`parser: eclipse event ${problem}`);
  if (events.some((e) => e.basis !== "source-backed")) fail("parser: an eclipse is not labelled as a published prediction");
}

/* -------------------------------------------------------- launches, from a fixture */

const launchFixture = {
  count: 2,
  results: [
    {
      id: "aaaa-bbbb", name: "Falcon 9 | Example", status: { id: 1, name: "Go for Launch", description: "Current T-0 confirmed." },
      net: "2026-09-01T12:00:00Z", net_precision: { name: "Second" }, last_updated: "2026-08-29T09:00:00Z",
      lsp_name: "Example Corp", mission: "A payload", mission_type: "Communications", pad: "SLC-40", location: "Cape Canaveral",
      url: "https://ll.thespacedevs.com/2.2.0/launch/aaaa-bbbb/",
    },
    {
      id: "cccc-dddd", name: "Vehicle | Vague", status: { id: 2, name: "To Be Determined", description: "Date unconfirmed." },
      net: "2027-01-01T00:00:00Z", net_precision: { name: "Quarter" }, last_updated: "2025-04-10T05:42:02Z",
      // A hostile URL on a host that is not the provider: it must not survive into the page.
      url: "https://evil.example/launch/cccc-dddd/",
    },
  ],
};
const launchProbe = parseLaunches(launchFixture);
if (!launchProbe.ok) fail(`parser: the launch fixture no longer parses — ${launchProbe.problem}`);
else {
  const events = launchEvents(launchProbe.value, Date.UTC(2026, 0, 1), Date.UTC(2028, 0, 1), Date.UTC(2026, 7, 29));
  for (const problem of events.flatMap(eventProblems)) fail(`parser: launch event ${problem}`);
  if (events.some((e) => e.confirmed)) fail("honesty: a launch is marked confirmed");
  if (events.some((e) => e.basis !== "planned")) fail("honesty: a launch is not labelled as planned");
  const vague = events.find((e) => e.eventId === "launch-cccc-dddd");
  if (!vague) fail("parser: the coarsely-scheduled launch was dropped");
  else {
    if (vague.precision !== "quarter") fail(`honesty: a launch the provider dates to the quarter is shown with "${vague.precision}" precision`);
    if (vague.source?.url.includes("evil.example")) fail("security: a provider-supplied URL on an unexpected host reached the page");
    if (!/months|weeks|may have moved/i.test(vague.summary)) fail("honesty: a launch confirmed sixteen months ago does not say so");
  }
  const precise = events.find((e) => e.eventId === "launch-aaaa-bbbb");
  if (precise && precise.precision !== "minute") fail("honesty: a launch the provider dates to the second is not shown to the minute");
}

/* ------------------------------------------------------------------ 5. the calendar file */

clearEventCache();
const windowEvents = offlineEvents(Date.UTC(firstYear, 0, 1), Date.UTC(firstYear, 1, 1));
const ics = toIcs(windowEvents, { pageUrl: "https://asteriastar.com/events", calendarName: "AsteriaStar", nowMs: Date.UTC(2026, 0, 1) });
const icsLines = ics.split("\r\n");
if (!ics.startsWith("BEGIN:VCALENDAR\r\n")) fail("ics: the file does not begin with a VCALENDAR");
if (!ics.endsWith("END:VCALENDAR\r\n")) fail("ics: the file does not end with a VCALENDAR");
for (const line of icsLines) {
  if (Buffer.from(line, "utf8").length > 75 && !line.startsWith(" ")) fail(`ics: a content line exceeds 75 octets unfolded: ${line.slice(0, 40)}…`);
}
if (icsLines.filter((l) => l === "BEGIN:VEVENT").length !== windowEvents.length) fail("ics: the file does not contain one VEVENT per event");
for (const event of windowEvents) {
  if (!ics.includes(`UID:${event.eventId}@asteriastar`)) fail(`ics: ${event.eventId} has no stable UID in the export`);
}
// Tentative events must be marked tentative; a calendar client shows them differently, and this is
// the only place the basis can survive into somebody else's software.
const tentative = icsLines.filter((l) => l === "STATUS:TENTATIVE").length;
const unconfirmed = windowEvents.filter((e) => !e.confirmed).length;
if (tentative !== unconfirmed) fail(`ics: ${unconfirmed} unconfirmed events but ${tentative} marked TENTATIVE`);
// Escaping: an unescaped comma or semicolon would break the parameter grammar in the reader's client.
for (const line of icsLines) {
  if (!/^(SUMMARY|DESCRIPTION|CATEGORIES):/.test(line)) continue;
  const value = line.slice(line.indexOf(":") + 1);
  if (/(^|[^\\]),/.test(value) || /(^|[^\\]);/.test(value)) fail(`ics: an unescaped separator in ${line.slice(0, 30)}…`);
}

/* ------------------------------------------------------------------ 6. registry */

for (const productKey of ["gsfc:solar-eclipses", "gsfc:lunar-eclipses", "ll2:upcoming-launches"]) {
  const product = LIVE_PRODUCTS.find((p) => p.productKey === productKey);
  if (!product) { fail(`registry: ${productKey} is not registered`); continue; }
  const provider = getLiveProvider(product.providerKey);
  if (!provider) { fail(`registry: ${productKey} names an unregistered provider`); continue; }
  if (provider.integration === "IMPLEMENTED" && !provider.verifiedAt) {
    fail(`registry: ${provider.providerKey} claims a working integration with no verification date`);
  }
  if (!product.limitations) fail(`registry: ${productKey} states no limitations`);
  if (!product.cacheRationale) fail(`registry: ${productKey} does not justify its cache window`);
  // A rate-limited provider must back off, or an outage becomes a request storm.
  if (provider.backoffAfterFailures < 1 || provider.backoffSeconds < 30) {
    fail(`registry: ${provider.providerKey} has no meaningful failure back-off`);
  }
}
// The launch provider is not an agency and must never be described as one.
const launchProvider = getLiveProvider("thespacedevs-launchlibrary");
if (launchProvider && !/not an agency|community/i.test(launchProvider.providerCaveat ?? "")) {
  fail("registry: the launch provider does not state that it is not an agency schedule");
}

/* ------------------------------------------------------------------ report */

console.log(`Events gate — ${sample.length} computed and forecast events across ${firstYear}–${lastYear}, measured against ${reference.moonPhases.entries.length} NASA phases, ${reference.seasons.entries.length} USNO season instants and ${reference.positions.entries.length} JPL Horizons positions.`);
for (const note of notes) console.log(`  · ${note}`);

if (problems.length > 0) {
  console.error(`\n✗ Events gate failed — ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  • ${problem}`);
  process.exit(1);
}
console.log("\n✓ Events gate passed.");
