import { moonEcliptic } from "@/platform/live-sky/providers/lunar-position";
import { planetGeocentric, sunGeocentric, type PlanetKey } from "@/platform/live-sky/providers/planetary-position";
import { angularSeparationDeg, eclipticLongitudeOfDate, norm180, norm360, precessionInLongitudeDeg, OBLIQUITY_J2000_DEG } from "@/platform/events/frames";
import { findCrossings, findExtrema } from "@/platform/events/roots";
import type { AstronomicalEvent, EventMethod } from "@/platform/events/model";

/**
 * The computed half of the calendar.
 *
 * Nothing here is fetched and nothing here is tabulated. Every event is located by asking the
 * platform's existing position calculators — the same ones behind the Live Sky pages — when an angle
 * reaches a value or a distance turns around. That is deliberate: a calendar that carried its own
 * copy of the sky would drift away from the rest of the site, and the first symptom would be a Moon
 * page and a Moon calendar disagreeing about the same full Moon.
 *
 * The cost of that choice is that these events are exactly as accurate as those series and no more.
 * The series are low-precision theory: the Moon to roughly 0.05–0.2°, the planets to under five
 * arcminutes against JPL Horizons. Measured on every build against the published tables, that puts
 * the computed instants within about forty minutes for lunar phases, a quarter of an hour for the
 * equinoxes and solstices, and about six hours for Earth's apsides, where the distance is nearly
 * stationary. Every event states its own figure. None of them is presented as almanac-grade,
 * because none of them is.
 */

const HOUR = 3_600_000;
const DAY = 86_400_000;
const D2R = Math.PI / 180;

/** The astronomical unit in kilometres (IAU 2012 definition). */
const AU_KM = 149_597_870.7;

/** Bumped whenever a change here could move a published instant. */
const ALGORITHM_VERSION = "1.0.0";

const method = (algorithm: string, note: string): EventMethod => ({ algorithm, version: ALGORITHM_VERSION, note });

/**
 * Mass fraction of the Moon in the Earth-Moon system (DE440: Moon/Earth = 0.0123000371).
 *
 * The reason this constant is here at all: the JPL approximate elements describe the EARTH-MOON
 * BARYCENTRE, not Earth. Earth swings about that point by roughly 4,670 km — three parts in a
 * hundred thousand of an astronomical unit — every month. For a position on the sky that is six
 * arcseconds and hardly matters. For the date of perihelion it is decisive, because the Sun-Earth
 * distance is almost stationary there and the monthly wobble is comparable to a whole day's change
 * in the annual term. Taking the barycentre for Earth put aphelion 2026 a day and a third early
 * against the US Naval Observatory's published value; correcting for it brings the six apsides of
 * 2026-2028 to within five and a half hours, and usually within one.
 */
const MOON_MASS_FRACTION = 0.0123000371 / (1 + 0.0123000371);

export interface SunFromEarth {
  /** Geocentric ecliptic longitude, referred to the mean equinox of date. */
  longitudeDeg: number;
  /** True Earth-to-Sun distance, with the barycentre offset removed. */
  distanceAu: number;
}

/**
 * The Sun as seen from Earth's centre, rather than from the Earth-Moon barycentre.
 *
 * The correction is applied as a vector: the barycentre-to-Sun vector from the planetary series,
 * plus the Earth-to-barycentre offset, which is the Moon's geocentric vector scaled by the Moon's
 * share of the system mass. The Moon's series is referred to the equinox of date and the planetary
 * one to J2000; the 0.36° between the two frames biases a correction of three parts in a hundred
 * thousand by two parts in a billion, which is far below anything else here.
 */
export function sunFromEarth(timeMs: number): SunFromEarth {
  const s = sunGeocentric(new Date(timeMs));
  const eps = OBLIQUITY_J2000_DEG * D2R;
  const ra = s.rightAscensionDeg * D2R;
  const dec = s.declinationDeg * D2R;
  // Barycentre-to-Sun, rotated from equatorial into ecliptic rectangular coordinates.
  const cx = Math.cos(dec) * Math.cos(ra);
  const cy = Math.cos(dec) * Math.sin(ra);
  const cz = Math.sin(dec);
  const x = s.distanceAu * cx;
  const y = s.distanceAu * (cy * Math.cos(eps) + cz * Math.sin(eps));
  const z = s.distanceAu * (cz * Math.cos(eps) - cy * Math.sin(eps));

  const moon = moonEcliptic(new Date(timeMs));
  const r = moon.distanceKm / AU_KM;
  const lon = moon.longitudeDeg * D2R;
  const lat = moon.latitudeDeg * D2R;
  const ex = x + MOON_MASS_FRACTION * r * Math.cos(lat) * Math.cos(lon);
  const ey = y + MOON_MASS_FRACTION * r * Math.cos(lat) * Math.sin(lon);
  const ez = z + MOON_MASS_FRACTION * r * Math.sin(lat);

  return {
    longitudeDeg: norm360((Math.atan2(ey, ex) * 180) / Math.PI + precessionInLongitudeDeg(timeMs)),
    distanceAu: Math.sqrt(ex * ex + ey * ey + ez * ez),
  };
}

/** The Sun's geocentric ecliptic longitude referred to the mean equinox of date. */
export function solarLongitudeDeg(timeMs: number): number {
  return sunFromEarth(timeMs).longitudeDeg;
}

/** A planet's geocentric ecliptic longitude referred to the mean equinox of date. */
function planetLongitudeDeg(planet: PlanetKey, timeMs: number): number {
  const p = planetGeocentric(planet, new Date(timeMs));
  return eclipticLongitudeOfDate(p.rightAscensionDeg, p.declinationDeg, timeMs);
}

/** The Moon's geocentric ecliptic longitude — already referred to the equinox of date. */
function lunarLongitudeDeg(timeMs: number): number {
  return norm360(moonEcliptic(new Date(timeMs)).longitudeDeg);
}

/** Elongation of the Moon from the Sun, 0° at new Moon and 180° at full. */
function lunarElongationDeg(timeMs: number): number {
  return norm360(lunarLongitudeDeg(timeMs) - solarLongitudeDeg(timeMs));
}

function iso(timeMs: number): string {
  return new Date(Math.round(timeMs / 60000) * 60000).toISOString().replace(".000", "");
}

function idStamp(timeMs: number): string {
  return new Date(timeMs).toISOString().slice(0, 13).replace(/[-:]/g, "").replace("T", "t");
}

/* ------------------------------------------------------------------ lunar phases */

const PHASE_DEFS: { target: number; type: string; title: string; summary: string }[] = [
  {
    target: 0,
    type: "new-moon",
    title: "New Moon",
    summary: "The Moon passes between Earth and the Sun and its near side is unlit. The darkest skies of the month fall around this date.",
  },
  {
    target: 90,
    type: "first-quarter-moon",
    title: "First Quarter Moon",
    summary: "Half the Moon's disc is lit. It stands highest in the early evening and sets around midnight, leaving the second half of the night dark.",
  },
  {
    target: 180,
    type: "full-moon",
    title: "Full Moon",
    summary: "The Moon is opposite the Sun and fully lit, above the horizon all night. Faint objects are washed out for several nights either side.",
  },
  {
    target: 270,
    type: "last-quarter-moon",
    title: "Last Quarter Moon",
    summary: "Half the disc is lit again, on the other side. The Moon rises around midnight, so the evening sky is dark.",
  },
];

export function lunarPhaseEvents(fromMs: number, toMs: number): AstronomicalEvent[] {
  const events: AstronomicalEvent[] = [];
  for (const def of PHASE_DEFS) {
    for (const t of findCrossings(lunarElongationDeg, def.target, fromMs, toMs, 6 * HOUR)) {
      events.push({
        eventId: `moon-${def.type}-${idStamp(t)}`,
        title: def.title,
        summary: def.summary,
        category: "moon",
        eventType: def.type,
        basis: "computed",
        start: iso(t),
        precision: "minute",
        applicability: { scope: "global", detail: "The instant is the same everywhere; only the local clock time and whether the Moon is above your horizon differ." },
        method: method(
          "lunar-phase-elongation-crossing",
          "The instant the Moon's geocentric ecliptic longitude exceeds the Sun's by the phase angle, both referred to the mean equinox of date, located by bisection on the low-precision lunar and solar series.",
        ),
        uncertainty:
          "Within about forty minutes of NASA\u2019s published instant \u2014 measured, not asserted: the build checks every phase of 2026\u20132028 against NASA\u2019s own table and the largest disagreement is thirty-eight minutes. The limit is the truncated lunar theory the whole platform uses, not the search.",
        entityIds: ["moon"],
        confirmed: true,
      });
    }
  }
  return events;
}

/* ------------------------------------------------------------------ lunar apsides */

/**
 * Perigee and apogee.
 *
 * The Earth–Moon distance is not a clean sinusoid — the Sun's pull adds a large monthly wobble — so
 * the scan uses a coarse enough step to step over that wobble's ripples while still resolving the
 * apsides themselves, which are a fortnight apart. Extrema closer together than ten days are the
 * ripple, not an apsis, and the shallower of the pair is dropped.
 */
export function lunarApsisEvents(fromMs: number, toMs: number): AstronomicalEvent[] {
  const distance = (t: number): number => moonEcliptic(new Date(t)).distanceKm;
  const events: AstronomicalEvent[] = [];

  const build = (kind: "perigee" | "apogee", found: { timeMs: number; value: number }[]): void => {
    const keep: { timeMs: number; value: number }[] = [];
    for (const candidate of found) {
      const previous = keep[keep.length - 1];
      if (previous && candidate.timeMs - previous.timeMs < 10 * DAY) {
        const better = kind === "perigee" ? candidate.value < previous.value : candidate.value > previous.value;
        if (better) keep[keep.length - 1] = candidate;
        continue;
      }
      keep.push(candidate);
    }
    for (const point of keep) {
      events.push({
        eventId: `moon-${kind}-${idStamp(point.timeMs)}`,
        title: kind === "perigee" ? "Moon at perigee" : "Moon at apogee",
        summary:
          kind === "perigee"
            ? "The Moon reaches the closest point of its orbit this month, appearing marginally larger than average — a difference of a few per cent in diameter, not something the eye registers without a side-by-side comparison."
            : "The Moon reaches the farthest point of its orbit this month and appears marginally smaller than average.",
        category: "moon",
        eventType: `moon-${kind}`,
        basis: "computed",
        start: iso(point.timeMs),
        precision: "hour",
        applicability: { scope: "global", detail: "A property of the orbit, the same for every observer." },
        method: method(
          "lunar-apsis-distance-extremum",
          "A turning point of the Earth–Moon distance from the low-precision lunar series, located by bisecting the derivative after a coarse scan.",
        ),
        uncertainty:
          "The date is reliable; the hour is not. The distance curve is almost flat for a day either side, and unlike the phases and the equinoxes this one is not checked against an external table \u2014 no comparable published series is connected \u2014 so treat the time as indicative.",
        entityIds: ["moon"],
        confirmed: true,
        // Rounded to a hundred kilometres. The lunar series is good to a few hundred over the days
        // around an apsis, and printing the last kilometre would claim six figures of a number that
        // has three.
        facts: [{ label: "Distance", value: `about ${(Math.round(point.value / 100) * 100).toLocaleString("en-GB")} km, centre to centre` }],
      });
    }
  };

  build("perigee", findExtrema(distance, fromMs, toMs, 12 * HOUR, "minimum"));
  build("apogee", findExtrema(distance, fromMs, toMs, 12 * HOUR, "maximum"));
  return events;
}

/* ------------------------------------------------------------------ seasons and Earth's apsides */

const SEASON_DEFS: { target: number; type: string; title: string; summary: string }[] = [
  { target: 0, type: "march-equinox", title: "March equinox", summary: "The Sun crosses the celestial equator going north. Day and night are close to equal everywhere, and the northern spring and southern autumn begin." },
  { target: 90, type: "june-solstice", title: "June solstice", summary: "The Sun reaches its northernmost declination — the longest day in the northern hemisphere and the shortest in the southern." },
  { target: 180, type: "september-equinox", title: "September equinox", summary: "The Sun crosses the celestial equator going south, beginning the northern autumn and the southern spring." },
  { target: 270, type: "december-solstice", title: "December solstice", summary: "The Sun reaches its southernmost declination — the shortest day in the northern hemisphere and the longest in the southern." },
];

export function seasonEvents(fromMs: number, toMs: number): AstronomicalEvent[] {
  const events: AstronomicalEvent[] = [];
  for (const def of SEASON_DEFS) {
    for (const t of findCrossings(solarLongitudeDeg, def.target, fromMs, toMs, 12 * HOUR)) {
      events.push({
        eventId: `season-${def.type}-${idStamp(t)}`,
        title: def.title,
        summary: def.summary,
        category: "season",
        eventType: def.type,
        basis: "computed",
        start: iso(t),
        precision: "minute",
        applicability: { scope: "global", detail: "A single instant for the whole Earth. The calendar date it falls on depends on your time zone." },
        method: method(
          "solar-longitude-crossing",
          "The instant the Sun's apparent geocentric ecliptic longitude, referred to the mean equinox of date, reaches the quadrant boundary — which is the definition of the equinoxes and solstices.",
        ),
        uncertainty:
          "Within about fifteen minutes of the US Naval Observatory\u2019s published instant \u2014 measured on every build against their figures for 2026\u20132028, where the largest disagreement is twelve minutes.",
        entityIds: ["sun", "earth"],
        confirmed: true,
      });
    }
  }
  return events;
}

/**
 * Perihelion and aphelion of Earth's orbit.
 *
 * The Earth–Sun distance changes by only about 30 parts per million per day near the turning points,
 * so the instant is intrinsically soft: published values are given to the hour and different
 * authorities differ by more than that. The precision recorded here says so rather than printing a
 * minute that means nothing.
 */
export function earthApsisEvents(fromMs: number, toMs: number): AstronomicalEvent[] {
  const distance = (t: number): number => sunFromEarth(t).distanceAu;
  const events: AstronomicalEvent[] = [];
  const add = (kind: "perihelion" | "aphelion", points: { timeMs: number; value: number }[]): void => {
    for (const point of points) {
      events.push({
        eventId: `earth-${kind}-${idStamp(point.timeMs)}`,
        title: kind === "perihelion" ? "Earth at perihelion" : "Earth at aphelion",
        summary:
          kind === "perihelion"
            ? "Earth reaches the closest point of its orbit around the Sun. It falls in the northern winter, which is a useful reminder that the seasons are caused by axial tilt and not by distance."
            : "Earth reaches the farthest point of its orbit around the Sun, in the northern summer.",
        category: "season",
        eventType: `earth-${kind}`,
        basis: "computed",
        start: iso(point.timeMs),
        precision: "hour",
        applicability: { scope: "global", detail: "A property of Earth's orbit, the same for every observer." },
        method: method(
          "earth-apsis-distance-extremum",
          "A turning point of the true Earth–Sun distance — the JPL approximate elements give the Earth–Moon barycentre, so the Moon\u2019s monthly pull on Earth is added back before the turning point is located by bisecting the derivative.",
        ),
        uncertainty: "Within about six hours, checked against the US Naval Observatory\u2019s published instants for 2026\u20132028. The distance is very nearly stationary for days around the turning point, so no low-precision method places it more sharply than that.",
        entityIds: ["earth", "sun"],
        confirmed: true,
        // Five significant figures, matching the series: the distance is good to a few thousand
        // kilometres, and printing nine digits of it would be a precision nobody can stand behind.
        facts: [
          {
            label: "Distance",
            value: `about ${(Math.round((point.value * AU_KM) / 1000) * 1000).toLocaleString("en-GB")} km (${point.value.toFixed(5)} au)`,
          },
        ],
      });
    }
  };
  add("perihelion", findExtrema(distance, fromMs, toMs, DAY, "minimum"));
  add("aphelion", findExtrema(distance, fromMs, toMs, DAY, "maximum"));
  return events;
}

/* ------------------------------------------------------------------ planets */

const PLANET_NAME: Record<PlanetKey, string> = {
  mercury: "Mercury", venus: "Venus", mars: "Mars", jupiter: "Jupiter", saturn: "Saturn", uranus: "Uranus", neptune: "Neptune",
};

const SUPERIOR: PlanetKey[] = ["mars", "jupiter", "saturn", "uranus", "neptune"];
const INFERIOR: PlanetKey[] = ["mercury", "venus"];
/** Conjunctions between these are worth a calendar entry; the outer two are never a naked-eye pair. */
const NAKED_EYE: PlanetKey[] = ["mercury", "venus", "mars", "jupiter", "saturn"];

/** Elongation in ecliptic longitude, signed: positive east of the Sun (evening sky). */
function signedElongationDeg(planet: PlanetKey, timeMs: number): number {
  return norm180(planetLongitudeDeg(planet, timeMs) - solarLongitudeDeg(timeMs));
}

/**
 * Oppositions of the superior planets: the planet's geocentric ecliptic longitude 180° from the
 * Sun's. The planet is then above the horizon all night and at its closest and brightest for the
 * apparition, which is why this is the entry an observer actually plans around.
 */
export function oppositionEvents(fromMs: number, toMs: number): AstronomicalEvent[] {
  const events: AstronomicalEvent[] = [];
  for (const planet of SUPERIOR) {
    const longitudeDifference = (t: number): number => norm360(planetLongitudeDeg(planet, t) - solarLongitudeDeg(t));
    for (const t of findCrossings(longitudeDifference, 180, fromMs, toMs, DAY)) {
      const p = planetGeocentric(planet, new Date(t));
      events.push({
        eventId: `opposition-${planet}-${idStamp(t)}`,
        title: `${PLANET_NAME[planet]} at opposition`,
        summary: `${PLANET_NAME[planet]} lies opposite the Sun, rising as the Sun sets and visible all night. It is near its closest to Earth for this apparition and at its brightest.`,
        category: "opposition",
        eventType: "opposition",
        basis: "computed",
        start: iso(t),
        precision: "hour",
        applicability: { scope: "global", detail: "Observable from anywhere the planet rises, which for these planets is most of the inhabited world." },
        method: method(
          "planet-solar-longitude-opposition",
          "The instant the planet's geocentric ecliptic longitude differs from the Sun's by exactly 180°, both referred to the mean equinox of date, from the JPL approximate planetary elements.",
        ),
        uncertainty:
          "Within a few hours. The platform\u2019s planetary positions are checked on every build against JPL Horizons and agree to under five arcminutes, which at the rate a planet separates from the Sun is a few hours in the date. Opposition is a broad event in any case: the planet is barely changed in brightness or size for a week either side.",
        entityIds: [planet],
        confirmed: true,
        facts: [
          { label: "Distance from Earth", value: `${p.distanceAu.toFixed(3)} au` },
          { label: "Approximate magnitude", value: p.apparentMagnitude.toFixed(1) },
        ],
      });
    }
  }
  return events;
}

/**
 * Greatest elongation of Mercury and Venus — the turning point of their angular distance from the
 * Sun, and the best evening or morning apparition of each cycle.
 *
 * The maximised quantity is the TRUE elongation: the Sun–Earth–planet angle, which is what the page
 * says and what an observer sees. It is not the difference in ecliptic longitude, which is a
 * different angle whenever the planet has ecliptic latitude — and Mercury and Venus always do at
 * greatest elongation, by several degrees. Maximising the longitude difference instead published
 * Mercury's June 2028 western elongation as 22.0° at 03:27 when the elongation actually peaks at
 * 22.23° eight hours earlier, which is both a wrong angle and an instant outside the stated "few
 * hours". The Sun–Earth–planet angle was already computed by the position series; it simply was not
 * the one being maximised. The signed longitude difference is still what decides east from west,
 * which is the one thing it is the right tool for.
 */
export function greatestElongationEvents(fromMs: number, toMs: number): AstronomicalEvent[] {
  const events: AstronomicalEvent[] = [];
  for (const planet of INFERIOR) {
    const separation = (t: number): number => planetGeocentric(planet, new Date(t)).elongationDeg;
    for (const point of findExtrema(separation, fromMs, toMs, DAY, "maximum")) {
      const east = signedElongationDeg(planet, point.timeMs) > 0;
      const p = planetGeocentric(planet, new Date(point.timeMs));
      events.push({
        eventId: `elongation-${planet}-${east ? "east" : "west"}-${idStamp(point.timeMs)}`,
        title: `${PLANET_NAME[planet]} at greatest ${east ? "eastern" : "western"} elongation`,
        summary: `${PLANET_NAME[planet]} stands ${point.value.toFixed(0)}° from the Sun, its widest separation of this apparition, and is best placed in the ${east ? "evening sky after sunset" : "morning sky before sunrise"}.`,
        category: "planet",
        eventType: `greatest-elongation-${east ? "east" : "west"}`,
        basis: "computed",
        start: iso(point.timeMs),
        precision: "hour",
        applicability: {
          scope: "global",
          detail: "How high the planet actually gets depends strongly on latitude and the season, because it follows the angle the ecliptic makes with the horizon.",
        },
        method: method(
          "inferior-planet-elongation-extremum",
          "A turning point of the true Sun\u2013Earth\u2013planet angle, located by bisecting the derivative after a daily scan; the sign of the ecliptic-longitude difference decides whether the apparition is eastern or western.",
        ),
        uncertainty:
          "Within a few hours; the elongation is nearly stationary for days around the maximum, so the instant is much softer than the angle. The underlying positions are checked against JPL Horizons on every build and agree to under five arcminutes.",
        entityIds: [planet],
        confirmed: true,
        facts: [
          { label: "Elongation", value: `${point.value.toFixed(1)}° ${east ? "east" : "west"} of the Sun` },
          { label: "Approximate magnitude", value: p.apparentMagnitude.toFixed(1) },
        ],
      });
    }
  }
  return events;
}

/**
 * Solar conjunctions.
 *
 * Not observing events at all — the planet is lost in the Sun's glare — but the dates that bound
 * every apparition, and the honest answer to "why can I not find Mars". Inferior and superior
 * conjunctions of Mercury and Venus are told apart by which side of the Sun the planet is on, which
 * the geocentric distance settles unambiguously.
 */
export function solarConjunctionEvents(fromMs: number, toMs: number): AstronomicalEvent[] {
  const events: AstronomicalEvent[] = [];
  for (const planet of [...INFERIOR, ...SUPERIOR]) {
    const longitudeDifference = (t: number): number => norm360(planetLongitudeDeg(planet, t) - solarLongitudeDeg(t));
    for (const t of findCrossings(longitudeDifference, 0, fromMs, toMs, DAY)) {
      const p = planetGeocentric(planet, new Date(t));
      const sun = sunGeocentric(new Date(t));
      const inferior = INFERIOR.includes(planet) && p.distanceAu < sun.distanceAu;
      const kind = INFERIOR.includes(planet) ? (inferior ? "inferior conjunction" : "superior conjunction") : "conjunction with the Sun";
      events.push({
        eventId: `solar-conjunction-${planet}-${inferior ? "inferior" : "superior"}-${idStamp(t)}`,
        title: `${PLANET_NAME[planet]} at ${kind}`,
        summary: inferior
          ? `${PLANET_NAME[planet]} passes between Earth and the Sun and is not observable. It moves from the evening sky into the morning sky around this date.`
          : `${PLANET_NAME[planet]} passes behind the Sun as seen from Earth and is not observable for some weeks either side.`,
        category: "conjunction",
        eventType: inferior ? "inferior-conjunction" : "superior-conjunction",
        basis: "computed",
        start: iso(t),
        precision: "hour",
        applicability: { scope: "global", detail: "Not observable from anywhere: the planet is in the same direction as the Sun. Never attempt to look." },
        method: method(
          "planet-solar-longitude-conjunction",
          "The instant the planet's geocentric ecliptic longitude equals the Sun's, both referred to the mean equinox of date; the geocentric distance separates an inferior conjunction from a superior one.",
        ),
        uncertainty:
          "Within a few hours, from planetary positions checked against JPL Horizons on every build to under five arcminutes.",
        entityIds: [planet],
        confirmed: true,
      });
    }
  }
  return events;
}

/** Below this the pair is close enough on the sky to be worth planning an evening around. */
const CONJUNCTION_THRESHOLD_DEG = 5;

/**
 * Planet-to-planet conjunctions, taken as the moment of closest apparent approach rather than the
 * moment of equal longitude. The two differ by hours and by a fraction of a degree, and it is the
 * closest approach that an observer is looking at.
 *
 * Pairs that never come within a few degrees are not reported: a "conjunction" twelve degrees wide
 * is two planets in the same part of the sky, which is not an event.
 */
export function planetPairEvents(fromMs: number, toMs: number): AstronomicalEvent[] {
  const events: AstronomicalEvent[] = [];
  for (let i = 0; i < NAKED_EYE.length; i++) {
    for (let j = i + 1; j < NAKED_EYE.length; j++) {
      const a = NAKED_EYE[i];
      const b = NAKED_EYE[j];
      const separation = (t: number): number => {
        const pa = planetGeocentric(a, new Date(t));
        const pb = planetGeocentric(b, new Date(t));
        return angularSeparationDeg(pa.rightAscensionDeg, pa.declinationDeg, pb.rightAscensionDeg, pb.declinationDeg);
      };
      for (const point of findExtrema(separation, fromMs, toMs, DAY, "minimum")) {
        if (point.value > CONJUNCTION_THRESHOLD_DEG) continue;
        const pa = planetGeocentric(a, new Date(point.timeMs));
        // The true Sun–Earth–planet angle again, not the longitude difference: this fact is read as
        // "how far from the Sun is the pair", which is the angle on the sky.
        const elongation = pa.elongationDeg;
        events.push({
          eventId: `conjunction-${a}-${b}-${idStamp(point.timeMs)}`,
          title: `${PLANET_NAME[a]} and ${PLANET_NAME[b]} in conjunction`,
          /*
           * The observability clause leads, and it is not decoration. A conjunction can fall at zero
           * elongation — Venus and Mars in January 2026 pass 0.17° apart while both are within a
           * couple of days of solar conjunction — and describing that as "easily taken in at a
           * glance" invites someone to sweep binoculars beside the Sun looking for it.
           */
          summary:
            elongation < 8
              ? `The two planets pass ${point.value.toFixed(1)}° apart, but only ${elongation.toFixed(0)}° from the Sun: this one is NOT observable, and you must not sweep the area with binoculars or a telescope looking for it. It is a real alignment, not a sight.`
              : elongation < 20
                ? `The two planets pass ${point.value.toFixed(1)}° apart — about ${(point.value / 0.5).toFixed(0)} full-Moon widths — but only ${elongation.toFixed(0)}° from the Sun, so they sit low in bright twilight and are hard to catch. Wait until the Sun is fully below the horizon.`
                : `The two planets pass ${point.value.toFixed(1)}° apart — about ${(point.value / 0.5).toFixed(0)} full-Moon widths — and are easily taken in at a glance.`,
          category: "conjunction",
          eventType: "planetary-conjunction",
          basis: "computed",
          start: iso(point.timeMs),
          precision: "hour",
          applicability: {
            scope: "global",
            detail: "The separation is geocentric; from the ground it changes by a fraction of a degree with your position, and whether the pair is above the horizon at that hour depends on where you are.",
          },
          method: method(
            "planet-pair-minimum-separation",
            "A minimum of the apparent angular separation of the two planets, located by bisecting the derivative after a daily scan of the geocentric positions.",
          ),
          uncertainty:
            "The separation is good to about ten arcminutes \u2014 each position is checked against JPL Horizons on every build and agrees to under five \u2014 and the instant to a few hours. The pair looks equally close for a night either side.",
          entityIds: [a, b],
          confirmed: true,
          facts: [
            { label: "Closest separation", value: `${point.value.toFixed(2)}°` },
            {
              label: "Elongation from the Sun",
              value: `${elongation.toFixed(0)}° ${signedElongationDeg(a, point.timeMs) > 0 ? "east (evening sky)" : "west (morning sky)"}`,
            },
            { label: `${PLANET_NAME[a]} magnitude`, value: pa.apparentMagnitude.toFixed(1) },
          ],
        });
      }
    }
  }
  return events;
}

/** Every computed event in the window, unsorted. */
export function computedEvents(fromMs: number, toMs: number): AstronomicalEvent[] {
  return [
    ...lunarPhaseEvents(fromMs, toMs),
    ...lunarApsisEvents(fromMs, toMs),
    ...seasonEvents(fromMs, toMs),
    ...earthApsisEvents(fromMs, toMs),
    ...oppositionEvents(fromMs, toMs),
    ...greatestElongationEvents(fromMs, toMs),
    ...solarConjunctionEvents(fromMs, toMs),
    ...planetPairEvents(fromMs, toMs),
  ];
}

export { ALGORITHM_VERSION };
