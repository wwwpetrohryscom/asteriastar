import type { TonightObservingData } from "@/platform/live-sky/models";
import { cloudDuring, describeCloud, type CloudForecast, type CloudSummary } from "@/platform/observing/weather";

/**
 * The observing plan: what the computed sky actually implies for tonight.
 *
 * This is a composition and nothing more. It adds no astronomy — the darkness windows, the Moon and
 * the ranked planets all come from the existing Tonight engine — and its whole job is to turn those
 * into the two or three sentences an observer acts on, without quietly inventing the things it does
 * not know.
 *
 * The deep-sky verdict is a BAND with stated criteria, not a score. A number out of a hundred for
 * "how good is tonight" would be an authoritative-looking summary of a judgement nobody made, and
 * would silently absorb the factors that are missing. The band is derived from exactly two things —
 * how much astronomical darkness there is, and how much of it the Moon spoils — and the wording says
 * so, every time.
 *
 * Cloud cover, when the reader has asked for it, is reported ALONGSIDE the band and never folded
 * into it. A clear forecast does not make a full Moon dark, and an overcast forecast does not change
 * the geometry. Keeping them separate is what lets both stay true.
 */

export type DeepSkyBand = "none" | "poor" | "fair" | "good";

export interface ObservingPlan {
  /** The darkest usable stretch, from the Tonight engine. */
  bestWindow?: { startIso: string; endIso: string; minutes: number };
  /** Total astronomical darkness for the night, in minutes. */
  darknessMinutes: number;
  moon: {
    illuminationPercent: number;
    phaseName: string;
    impact: string;
    /** Whether the Moon is up during the dark window, which is what actually matters. */
    interferes: boolean;
  } | null;
  /** Planets worth pointing at, in the engine's own ranking. */
  planets: { name: string; magnitude: number; altitudeDeg: number; azimuthDeg: number; score: number | null }[];
  deepSky: {
    band: DeepSkyBand;
    headline: string;
    /** The reasoning, in full, naming the two inputs and nothing else. */
    reason: string;
  };
  /**
   * Set when a forecast WAS fetched and still could not be summarised — because the observing
   * window falls outside the days MET publishes, which happens for any date more than about nine
   * ahead. Without this the section rendered as a bare heading: the reader's coordinates had gone to
   * the institute and nothing came back, with no explanation and no admission that cloud was still
   * missing from the plan.
   */
  cloudUnavailable?: string;
  /** Present only when the reader asked for a forecast and it covered the window. */
  cloud?: {
    summary: CloudSummary;
    headline: string;
    /** Restated on every render: this is cloud, and cloud is not seeing. */
    caveat: string;
  };
  /** What this plan does not model. Always populated; the list shortens, it never empties. */
  excluded: string[];
}

const BAND_HEADLINE: Record<DeepSkyBand, string> = {
  none: "No astronomical darkness tonight",
  poor: "Poor for faint objects",
  fair: "Workable for faint objects",
  good: "Good dark-sky geometry",
};

/** Below this the Moon is not the limiting factor whatever else it does. */
const MOON_NEGLIGIBLE_PERCENT = 25;
/** Above this a Moon in the sky washes out everything faint. */
const MOON_DOMINANT_PERCENT = 60;
/** Under an hour of true darkness is not an observing night for deep-sky work. */
const MINIMUM_USEFUL_DARKNESS_MINUTES = 60;

function deepSky(data: TonightObservingData): ObservingPlan["deepSky"] {
  const darkness = data.summary.darknessMinutes;
  const moon = data.moon;
  const illumination = moon?.illuminationPercent ?? 0;
  // "Interferes" is the engine's own moonlight impact, which already accounts for whether the Moon
  // is above the horizon during the dark window — a full Moon that has set is not a problem.
  const interferes = moon?.moonlightImpact === "high" || moon?.moonlightImpact === "moderate";
  const geometry =
    "This is a statement about darkness and moonlight only. It is not a forecast: it says nothing about cloud, atmospheric seeing, transparency, or the light pollution where you are standing.";

  if (!data.summary.darknessAvailable || darkness < MINIMUM_USEFUL_DARKNESS_MINUTES) {
    return {
      band: "none",
      headline: BAND_HEADLINE.none,
      reason: `The Sun does not get more than 18° below your horizon for long enough tonight — ${Math.round(darkness)} minutes of astronomical darkness. Bright objects are unaffected; faint ones need real darkness. ${geometry}`,
    };
  }
  if (interferes && illumination >= MOON_DOMINANT_PERCENT) {
    return {
      band: "poor",
      headline: BAND_HEADLINE.poor,
      reason: `There are ${Math.round(darkness)} minutes of astronomical darkness, but the Moon is ${Math.round(illumination)}% lit and above the horizon during them. Galaxies and nebulae will be washed out; the Moon itself, the planets and double stars will not care. ${geometry}`,
    };
  }
  if (interferes && illumination >= MOON_NEGLIGIBLE_PERCENT) {
    return {
      band: "fair",
      headline: BAND_HEADLINE.fair,
      reason: `${Math.round(darkness)} minutes of astronomical darkness with a ${Math.round(illumination)}% Moon in the sky for part of it. Brighter clusters and nebulae are fine; the faintest galaxies are not. ${geometry}`,
    };
  }
  return {
    band: "good",
    headline: BAND_HEADLINE.good,
    reason: `${Math.round(darkness)} minutes of astronomical darkness${moon ? ` with the Moon ${Math.round(illumination)}% lit and ${interferes ? "up for part of the window" : "out of the way"}` : ""}. The geometry is as favourable as it gets for faint objects. ${geometry}`,
  };
}

export interface PlanInputs {
  /** The computed Tonight composite for the reader's explicit location and date. */
  tonight: TonightObservingData;
  /** A cloud forecast, ONLY if the reader asked for one. Absent by default and by design. */
  cloud?: CloudForecast;
}

export function buildObservingPlan({ tonight, cloud }: PlanInputs): ObservingPlan {
  const window = tonight.summary.bestOverallWindow;
  const windowFromMs = window ? Date.parse(window.startIso) : undefined;
  const windowToMs = window ? Date.parse(window.endIso) : undefined;

  const excluded = [
    "atmospheric seeing — the turbulence that decides how sharp a planet looks, which is forecast from different model output entirely and is not connected here",
    "sky transparency and haze",
    "light pollution where you are standing, which for most observers is the dominant limit",
    "your local horizon: trees, buildings and hills, which no calculation here knows about",
  ];
  // Filled in below once it is known whether a fetched forecast actually covered the window.
  if (!cloud) excluded.unshift("cloud cover — no forecast has been requested for this location");

  const plan: ObservingPlan = {
    bestWindow:
      window && windowFromMs !== undefined && windowToMs !== undefined
        ? { startIso: window.startIso, endIso: window.endIso, minutes: Math.round((windowToMs - windowFromMs) / 60_000) }
        : undefined,
    darknessMinutes: tonight.summary.darknessMinutes,
    moon: tonight.moon
      ? {
          illuminationPercent: tonight.moon.illuminationPercent,
          phaseName: tonight.moon.phaseName,
          impact: tonight.moon.moonlightImpact,
          interferes: tonight.moon.moonlightImpact === "high" || tonight.moon.moonlightImpact === "moderate",
        }
      : null,
    planets: tonight.planets
      .filter((p) => p.visibleTonight)
      .map((p) => ({
        name: p.planetName,
        magnitude: p.apparentMagnitude,
        altitudeDeg: p.altitudeDeg,
        azimuthDeg: p.azimuthDeg,
        score: p.visibilityScore,
      })),
    deepSky: deepSky(tonight),
    excluded,
  };

  if (cloud) {
    const summary =
      windowFromMs !== undefined && windowToMs !== undefined ? cloudDuring(cloud, windowFromMs, windowToMs) : undefined;
    if (summary) {
      plan.cloud = {
        summary,
        headline: describeCloud(summary.meanPercent),
        caveat:
          "Total cloud cover from MET Norway's general weather forecast, averaged across the dark window. It is not a forecast of astronomical seeing or transparency, which are different quantities from different models — a clear night and terrible seeing are an ordinary combination.",
      };
    } else {
      // A forecast arrived and cannot be used. Say which, and put cloud back on the list of things
      // the plan does not know — the reader is owed both.
      const last = cloud.points[cloud.points.length - 1];
      plan.cloudUnavailable =
        windowFromMs === undefined
          ? "There is no dark window tonight to average a forecast across, so the cloud figures are not shown."
          : `MET Norway's forecast runs out on ${new Date(last.timeMs).toISOString().slice(0, 10)}, before the window this plan is about. No cloud figure is shown rather than one extrapolated past the end of the forecast.`;
      excluded.unshift("cloud cover — a forecast was fetched but does not reach this night");
    }
  }

  return plan;
}
