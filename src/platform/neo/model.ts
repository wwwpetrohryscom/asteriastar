import type { LiveEnvelope } from "@/platform/live-providers/envelope";

/**
 * The near-Earth object domain (Program CK).
 *
 * Three rules shape every type here.
 *
 * A close approach is a PREDICTION from a fitted orbit, not an observation, and it comes with real
 * uncertainty the provider publishes — so the nominal distance never travels without its 3-sigma
 * bounds, and the approach time never travels without its 3-sigma window.
 *
 * The provider's time scale is kept. JPL publishes close-approach times in TDB, barycentric
 * dynamical time, which currently runs about 69 seconds ahead of UTC. Sentry publishes its last
 * observation date in UTC. Storing both in one "date" field would quietly lose that distinction, so
 * they are separate types with the scale in the field name.
 *
 * A size is almost never measured. Absolute magnitude is a brightness; turning it into a diameter
 * requires assuming how reflective the object is, and the answer spans a factor of two either way.
 * So a diameter is either a real measurement from the provider, or a RANGE with the assumed albedo
 * stated — never a single confident number.
 */

/** One astronomical unit in kilometres (IAU 2012 definition, exact). */
export const AU_KM = 149_597_870.7;

/** One lunar distance: the mean Earth–Moon semi-major axis, in kilometres. */
export const LUNAR_DISTANCE_KM = 384_400;

/**
 * A distance expressed in all three units an astronomer actually wants, from one source value.
 * The AU figure is the provider's; the other two are exact unit conversions of it, not new claims.
 */
export interface ApproachDistance {
  au: number;
  km: number;
  lunarDistances: number;
}

/**
 * A diameter, and how it was arrived at. Three cases, because the providers really do offer three.
 *
 * `measured` is a physical measurement — radar, thermal infrared, occultation.
 *
 * `estimated-from-magnitude` is a brightness converted into a size across an albedo RANGE, which is
 * the only honest form when the albedo is unknown.
 *
 * `provider-estimate` is a single number from a provider that MAY be either. Sentry is the case that
 * forced this variant: it publishes one `diameter` column derived from absolute magnitude at an
 * assumed albedo of 0.154 "unless a measurement exists", and it does not say which each row is.
 * Checked against the live table, 1979 XB's 0.66 km reproduces the 0.154 formula to three decimals
 * while Bennu's 0.49 km and 1950 DA's 1.3 km are radar values that do not. Calling the column
 * "measured" would publish a brightness conversion as a measurement; calling it "estimated" would
 * demote two genuinely measured diameters. So it is labelled as what it is: the provider's figure,
 * with the provider's own explanation of how it was obtained.
 */
export type ObjectSize =
  | { kind: "measured"; km: number; uncertaintyKm?: number; note: string }
  | { kind: "estimated-from-magnitude"; minKm: number; maxKm: number; absoluteMagnitude: number; albedoRange: [number, number]; note: string }
  | { kind: "provider-estimate"; km: number; assumedAlbedo: number; note: string };

/** One predicted close approach to Earth, as CNEOS computes it. */
export interface CloseApproach {
  /** Provisional or permanent designation, e.g. "2007 EK" or "99942". */
  designation: string;
  /** The provider's full name string, cleaned. */
  fullName?: string;
  /** The orbit solution this prediction came from — a different solution is a different prediction. */
  orbitId?: string;

  /**
   * Time of closest approach in TDB, as an ISO-8601 string. NOT UTC: it is presented and labelled
   * as TDB everywhere, because that is what the provider computed.
   */
  approachTdb: string;
  /** The provider's own 3-sigma uncertainty on that time, as it formats it (e.g. "2_17:13"). */
  timeUncertainty?: string;

  /** Nominal approach distance. */
  distance: ApproachDistance;
  /** 3-sigma minimum approach distance — the closest the object could plausibly come. */
  distanceMin?: ApproachDistance;
  /** 3-sigma maximum approach distance. */
  distanceMax?: ApproachDistance;

  /** Velocity relative to Earth at closest approach, km/s. */
  relativeVelocityKmS?: number;
  /** Velocity relative to a massless body — the hyperbolic excess velocity, km/s. */
  velocityInfinityKmS?: number;

  absoluteMagnitude?: number;
  size?: ObjectSize;
}

/** One object on the CNEOS Sentry impact-risk table. */
export interface SentryObject {
  designation: string;
  fullName?: string;
  /** Cumulative probability that one of the tabulated impacts occurs. JPL's number, JPL's caveat. */
  impactProbability?: number;
  /** Number of distinct potential impacts found by the analysis. */
  potentialImpacts?: number;
  /** The year range the tabulated impacts fall in, as the provider gives it. */
  yearRange?: string;
  /** Cumulative Palermo scale rating. Below -2 is "no cause for public concern" by definition. */
  palermoCumulative?: number;
  palermoMaximum?: number;
  /** Maximum Torino rating. Defined only for potential impacts less than a century ahead. */
  torinoMaximum?: number;
  /** Entry velocity neglecting Earth's gravity, km/s. */
  velocityInfinityKmS?: number;
  absoluteMagnitude?: number;
  /** JPL's diameter estimate: from H assuming albedo 0.154, unless a measurement exists. */
  diameterKm?: number;
  /** Date and time of the last observation used in the analysis. UTC, per the provider. */
  lastObservationUtc?: string;
}

/** One near-Earth object recently entered into the small-body database. */
export interface RecentNeo {
  designation: string;
  fullName?: string;
  /** The date of the FIRST OBSERVATION used in the orbit — not the announcement date. */
  firstObservation: string;
  /** Orbit class code: IEO (Atira), ATE (Aten), APO (Apollo), AMO (Amor). */
  orbitClass?: string;
  isPotentiallyHazardous: boolean;
  absoluteMagnitude?: number;
  /** Minimum orbit intersection distance with Earth, au. Under 0.05 au is one of the two PHA tests. */
  moidAu?: number;
  size?: ObjectSize;
}

/** One candidate on the MPC's NEO Confirmation Page. Not a discovery. */
export interface NeoCandidate {
  /** Temporary designation, e.g. "A11G7zN". It has no permanence and may never gain one. */
  temporaryDesignation: string;
  /** The MPC's 0–100 estimate of how likely this is a near-Earth object. Not a probability of existence. */
  neoScore?: number;
  /** First observation, as the MPC gives it (year, month, fractional day, UTC). */
  firstObservedUtc?: string;
  /** Right ascension in hours and declination in degrees, as published. */
  raHours?: number;
  decDegrees?: number;
  /** Apparent V magnitude — how bright it looks, not how big it is. */
  apparentMagnitude?: number;
  absoluteMagnitude?: number;
  observationCount?: number;
  /** Length of the observed arc in days. A short arc means a poorly-constrained orbit. */
  arcDays?: number;
  /** Days since the object was last seen. */
  daysSinceLastSeen?: number;
  /** The provider's own note about when the entry was added or updated. */
  updatedNote?: string;
}

/**
 * How a live provider record relates to AsteriaStar's own catalogue.
 *
 * A live record is NEVER silently minted into a permanent encyclopedia entity. Either it matches
 * something already catalogued — in which case the match is shown and linked — or it does not, and
 * the page says so in as many words.
 */
export interface CatalogueMatch {
  /** The graph entity this provider record resolves to, when one exists. */
  entityId?: string;
  entityName?: string;
  entityPath?: string;
  /** What the match was made on, so a reader can judge it. */
  matchedOn?: "sbdb-designation" | "sbdb-fullname" | "entity-alias";
  /** True when the object is real and current but not in AsteriaStar's catalogue. */
  notYetCatalogued: boolean;
}

export interface ResolvedCloseApproach extends CloseApproach {
  catalogue: CatalogueMatch;
  /** The Sentry entry for the same object, when it has one. */
  sentry?: SentryObject;
}

export interface NeoSnapshot {
  closeApproaches: LiveEnvelope<CloseApproach[]>;
  sentry: LiveEnvelope<SentryObject[]>;
  recent: LiveEnvelope<RecentNeo[]>;
  candidates: LiveEnvelope<NeoCandidate[]>;
}

/* ------------------------------------------------------------------ helpers */

/** Convert an approach distance in au into the three units, exactly. */
export function distanceFromAu(au: number): ApproachDistance {
  return { au, km: au * AU_KM, lunarDistances: (au * AU_KM) / LUNAR_DISTANCE_KM };
}

/**
 * The standard relation between absolute magnitude, geometric albedo and diameter:
 *
 *   D(km) = 1329 / sqrt(albedo) × 10^(−H/5)
 *
 * A dark object and a bright one of the same brightness differ in size by the square root of the
 * albedo ratio, so a single number here would be a fiction. CNEOS publishes the same estimate as a
 * RANGE over albedo 0.25 to 0.05, and that is what this returns — with the assumption attached.
 */
export const ALBEDO_RANGE: [number, number] = [0.25, 0.05];

export function sizeFromAbsoluteMagnitude(h: number): ObjectSize {
  const diameter = (albedo: number) => (1329 / Math.sqrt(albedo)) * Math.pow(10, -h / 5);
  return {
    kind: "estimated-from-magnitude",
    minKm: diameter(ALBEDO_RANGE[0]),
    maxKm: diameter(ALBEDO_RANGE[1]),
    absoluteMagnitude: h,
    albedoRange: ALBEDO_RANGE,
    note: `Inferred from absolute magnitude H = ${h.toFixed(2)} using D = 1329/√albedo × 10^(−H/5), across the albedo range ${ALBEDO_RANGE[0]}–${ALBEDO_RANGE[1]} that CNEOS uses for the same estimate. This is a brightness converted into a size, not a measurement: a dark object and a bright one of the same magnitude differ in diameter by more than a factor of two.`,
  };
}

/** Format a diameter in the unit that suits its scale — metres below a kilometre. */
export function formatDiameter(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(km < 10 ? 2 : 1)} km`;
}
