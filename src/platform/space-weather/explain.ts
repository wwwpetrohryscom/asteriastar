import { GEOMAGNETIC_SCALE, SOLAR_FLARE_CLASSES } from "@/platform/live-sky/spaceWeather";
import { KP_SCALE } from "@/platform/live-sky/aurora";

/**
 * "What this means" — plain scientific explanation of a live value.
 *
 * These read a real measured value and say what it signifies, without exaggeration and without
 * inventing consequences. The classifications themselves (A–X flare classes, G1–G5, the Kp scale)
 * are not redefined here: they are imported from the existing Live Sky reference data, which is
 * already the platform's single source for them.
 *
 * Two rules hold throughout. Nothing is described as dangerous, dramatic or unprecedented unless
 * the issuing agency's own scale says so; and no statement is made about what a reader will see
 * from where they are standing, because none of these datasets know where that is or whether the
 * sky above it is clear.
 */

export interface Interpretation {
  /** A short label for the condition, e.g. "Quiet", "Minor storm (G1)". */
  label: string;
  /** One or two sentences of plain explanation. Never sensational. */
  meaning: string;
  /** Whether this warrants visual emphasis — true only at genuinely elevated levels. */
  elevated: boolean;
}

/* ------------------------------------------------------------ solar wind */

/**
 * Solar-wind speed. The bands are the conventional descriptive ones used in space-weather
 * operations: the ambient slow wind is roughly 300–400 km/s, coronal-hole high-speed streams
 * typically 500–800 km/s, and faster than that means a transient.
 */
export function explainSolarWindSpeed(kmS: number): Interpretation {
  if (kmS < 350) return { label: "Slow", meaning: "Ambient slow solar wind, from the streamer belt above the Sun's equatorial regions. This is the quiet background state.", elevated: false };
  if (kmS < 500) return { label: "Moderate", meaning: "Typical solar wind speed. The magnetosphere is being pushed at an ordinary rate.", elevated: false };
  if (kmS < 700) return { label: "Fast", meaning: "A fast stream, usually from a coronal hole — a region where the Sun's magnetic field opens into space. Fast streams can stir up geomagnetic activity when they arrive.", elevated: false };
  return { label: "Very fast", meaning: "Speeds this high normally follow a coronal mass ejection or a strong coronal-hole stream. Whether this produces a geomagnetic storm depends on the direction of the embedded magnetic field, not on speed alone.", elevated: true };
}

/**
 * The north–south component of the interplanetary magnetic field. Southward Bz is the single most
 * important control on whether solar-wind energy enters the magnetosphere.
 *
 * The geometry matters and is easy to state backwards: at the subsolar magnetopause Earth's own
 * field points NORTHWARD. A northward IMF is therefore aligned with it and reconnects poorly; a
 * SOUTHWARD IMF is the antiparallel one, and that is the configuration that opens the dayside.
 */
export function explainBz(nT: number): Interpretation {
  if (nT > 2) return { label: "Northward", meaning: "The interplanetary field points north, the same way as Earth's own field where the two meet on the dayside. Aligned fields do not reconnect efficiently, so coupling into the magnetosphere is weak and geomagnetic activity tends to subside.", elevated: false };
  if (nT >= -2) return { label: "Near neutral", meaning: "The field has little north–south component. Coupling is modest and can change quickly — Bz varies on a timescale of minutes.", elevated: false };
  if (nT >= -10) return { label: "Southward", meaning: "The interplanetary field points south, opposite to Earth's own field at the dayside boundary — the antiparallel geometry that lets the two reconnect and admit solar-wind energy. Sustained southward Bz is what turns a fast stream into geomagnetic activity.", elevated: false };
  return { label: "Strongly southward", meaning: "Strong southward field. This is the condition that drives major geomagnetic storms, though the response also depends on how long it lasts and on the solar-wind speed and density behind it.", elevated: true };
}

/* ----------------------------------------------------------- geomagnetic */

/** The G-level a Kp value corresponds to on the NOAA scale. Kp 5 is G1, 6 → G2, and so on to 9 → G5. */
export function gScaleForKp(kp: number): number {
  if (kp < 5) return 0;
  return Math.min(5, Math.floor(kp) - 4);
}

/**
 * Explain an observed Kp. The wording is drawn from the platform's existing Kp and G-scale
 * reference data rather than restated, so the site says one thing about these scales everywhere.
 */
export function explainKp(kp: number): Interpretation {
  const g = gScaleForKp(kp);
  if (g === 0) {
    const band = [...KP_SCALE].reverse().find((k) => kp >= k.kp) ?? KP_SCALE[0];
    return {
      label: kp < 3 ? "Quiet" : "Unsettled",
      meaning: `${band.meaning} Below Kp 5 there is no geomagnetic storm on the NOAA scale.`,
      elevated: false,
    };
  }
  const scale = GEOMAGNETIC_SCALE[g - 1];
  return {
    label: `Storm level G${g}`,
    meaning: `${scale.meaning} This is the NOAA G-scale level corresponding to a planetary K-index of ${kp.toFixed(2).replace(/\.?0+$/, "")}.`,
    elevated: g >= 2,
  };
}

/* ---------------------------------------------------------------- solar */

/** Explain a GOES flare class such as "M2.4", using the platform's existing class descriptions. */
export function explainFlareClass(designation: string): Interpretation | undefined {
  const letter = designation.trim().charAt(0).toUpperCase();
  const entry = SOLAR_FLARE_CLASSES.find((c) => c.flareClass === letter);
  if (!entry) return undefined;
  return {
    label: `Class ${letter}`,
    meaning: entry.meaning,
    elevated: letter === "M" || letter === "X",
  };
}

/** Explain the 10.7 cm radio flux as a solar-activity proxy. */
export function explainRadioFlux(sfu: number): Interpretation {
  if (sfu < 90) return { label: "Low activity", meaning: "F10.7 near the quiet-Sun floor. The disc is likely to be nearly spotless or carrying only small regions.", elevated: false };
  if (sfu < 150) return { label: "Moderate activity", meaning: "A typical mid-cycle value. Active regions are present and capable of producing flares.", elevated: false };
  if (sfu < 250) return { label: "High activity", meaning: "Elevated radio flux, consistent with several substantial active regions on the visible disc.", elevated: false };
  return { label: "Very high activity", meaning: "F10.7 at this level is reached only around solar maximum with large, magnetically complex regions present.", elevated: true };
}

/* --------------------------------------------------------------- aurora */

/**
 * What an equatorward aurora boundary means for an observer, stated in terms of latitude and
 * nothing else. It deliberately names no city and promises no sighting: OVATION gives a
 * probability on a grid, and cloud, moonlight, light pollution and the direction you happen to be
 * looking are not in this dataset.
 */
export function explainAuroraBoundary(latitude: number | undefined, maxProbability: number, thresholdPercent: number): Interpretation {
  if (latitude === undefined) {
    return {
      // The threshold is passed in rather than restated, so this sentence can never disagree with
      // the number the boundary was actually computed against.
      label: "No visible-aurora probability",
      meaning: `The model gives nowhere in this hemisphere at least a ${thresholdPercent}% chance of visible aurora in this forecast window; the strongest anywhere is ${Math.round(maxProbability)}%.`,
      elevated: false,
    };
  }
  const abs = Math.abs(Math.round(latitude));
  const elevated = abs <= 55;
  return {
    label: `Oval reaches ${abs}° latitude`,
    meaning: `The model's aurora oval extends to about ${abs}° geographic latitude in this hemisphere, with a peak probability of ${Math.round(maxProbability)}% somewhere along it. That is a statement about the oval's extent, not about any particular place: whether aurora is actually visible from a given site also depends on cloud, darkness, light pollution and the northern horizon.`,
    elevated,
  };
}

/* ---------------------------------------------------------- NOAA scales */

const SCALE_MEANING: Record<"R" | "S" | "G", string> = {
  R: "Radio blackouts — degradation of high-frequency radio communication on the sunlit side of Earth, caused by X-rays from a flare ionising the lower ionosphere.",
  S: "Solar radiation storms — elevated fluxes of energetic protons, which matter for spacecraft, high-altitude aviation on polar routes, and astronauts.",
  G: "Geomagnetic storms — disturbance of Earth's magnetic field, which drives aurora and can affect power grids, pipelines and satellite navigation.",
};

export function explainScale(kind: "R" | "S" | "G"): string {
  return SCALE_MEANING[kind];
}

/** A NOAA scale level as a short phrase. Level 0 is genuinely "none", and is said so. */
export function scaleLabel(kind: "R" | "S" | "G", level: number): string {
  if (level <= 0) return "None";
  return `${kind}${level}`;
}

/** Whether a NOAA scale level warrants emphasis. Level 1 is minor and is not treated as alarming. */
export function scaleElevated(level: number): boolean {
  return level >= 2;
}
