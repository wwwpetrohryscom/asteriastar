import type { SourceKey } from "@/lib/sources";

/**
 * Exoplanet data model.
 *
 * Planet records are generated from the NASA Exoplanet Archive Planetary
 * Systems Composite Parameters table. Every value is real archive data; fields
 * are optional and omitted when the archive has no reliable value — nothing is
 * inferred or synthesised. Host stars, systems, methods, and classes are derived
 * from these records in the index. Habitability is never asserted as certainty
 * and is only flagged for a small, source-backed set of candidates.
 */

export interface ExoplanetRecord {
  /** Graph entity id, "exoplanet:slug" (existing reused, else created). */
  id: string;
  slug: string;
  name: string;
  existing?: boolean;

  /* --- host --- */
  hostName: string;
  hostSlug: string;
  /** Resolved host id: an existing star entity, or a new host_star:slug. */
  hostId: string;
  hostExisting: boolean;
  hostSpectralType?: string;
  hostTeffK?: number;
  hostRadiusSolar?: number;
  hostMassSolar?: number;
  hostMetallicity?: number;
  hostDistancePc?: number;
  systemPlanetCount?: number;

  /* --- discovery --- */
  discoveryMethod?: string;
  discoveryYear?: number;
  discoveryFacility?: string;
  /** Resolved existing mission/telescope/observatory id, if mapped. */
  facilityId?: string;
  methodSlug?: string;

  /* --- orbit & physical (real archive values only) --- */
  orbitalPeriodDays?: number;
  semiMajorAxisAu?: number;
  eccentricity?: number;
  radiusEarth?: number;
  massEarth?: number;
  eqTempK?: number;
  insolationFlux?: number;
  raDeg?: number;
  decDeg?: number;

  /* --- derived classification & curated flags --- */
  classSlug?: string;
  habitableCandidate?: boolean;

  sources: SourceKey[];
}

/** Planetary class labels (classified by radius, a standard scheme). */
export const PLANET_CLASSES: { slug: string; name: string; plural: string; description: string }[] = [
  { slug: "terrestrial", name: "Terrestrial planet", plural: "Terrestrial candidates", description: "Small, likely rocky planets up to about 1.6 Earth radii." },
  { slug: "super-earth", name: "Super-Earth", plural: "Super-Earths", description: "Planets larger than Earth but smaller than the ice giants, roughly 1.6–2.4 Earth radii." },
  { slug: "mini-neptune", name: "Mini-Neptune", plural: "Mini-Neptunes", description: "Planets between super-Earths and Neptune in size, with thick atmospheres, roughly 2.4–5.5 Earth radii." },
  { slug: "gas-giant", name: "Gas giant", plural: "Gas Giants", description: "Large planets dominated by hydrogen and helium, larger than about 5.5 Earth radii." },
  { slug: "hot-jupiter", name: "Hot Jupiter", plural: "Hot Jupiters", description: "Gas-giant planets orbiting extremely close to their stars, with short orbital periods." },
];

/** Detection methods (the eight the encyclopedia explains). */
export const DETECTION_METHODS: { slug: string; name: string; archiveNames: string[]; description: string; detail: string; limitations: string }[] = [
  { slug: "transit", name: "Transit Method", archiveNames: ["Transit"],
    description: "Detecting the tiny dip in a star's brightness as a planet passes in front of it.",
    detail: "When a planet crosses the face of its star from our viewpoint, it blocks a small fraction of the light. The depth gives the planet's size and the timing gives its orbit.",
    limitations: "Only works for systems aligned edge-on to us, and favours large, close-in planets." },
  { slug: "radial-velocity", name: "Radial Velocity Method", archiveNames: ["Radial Velocity"],
    description: "Measuring the gravitational wobble a planet induces in its star.",
    detail: "A planet's gravity tugs its star back and forth, shifting the star's spectrum slightly blue then red. The size of the wobble reveals the planet's mass.",
    limitations: "Gives a minimum mass, not a radius, and favours massive, close-in planets." },
  { slug: "direct-imaging", name: "Direct Imaging", archiveNames: ["Imaging"],
    description: "Taking an actual picture of a planet by blocking its star's glare.",
    detail: "Using coronagraphs and adaptive optics to suppress starlight, telescopes can capture the faint light of a planet directly.",
    limitations: "Works best for young, hot, massive planets far from their stars." },
  { slug: "microlensing", name: "Microlensing", archiveNames: ["Microlensing"],
    description: "Using a star's gravity as a lens to reveal an unseen planet.",
    detail: "When one star passes in front of another, its gravity magnifies the background star's light; a planet adds a characteristic extra blip.",
    limitations: "Events are one-off and never repeat, so follow-up is difficult." },
  { slug: "transit-timing-variations", name: "Transit Timing Variations", archiveNames: ["Transit Timing Variations"],
    description: "Detecting planets from the gravitational tug they exert on other transiting planets.",
    detail: "In a multi-planet system, planets pull on each other, making transits arrive slightly early or late in a pattern that reveals additional or unseen planets.",
    limitations: "Requires a system already known to have transiting planets." },
  { slug: "eclipse-timing-variations", name: "Eclipse Timing Variations", archiveNames: ["Eclipse Timing Variations"],
    description: "Finding planets from shifts in the eclipse times of a binary star.",
    detail: "A circumbinary planet changes when the two stars of a binary eclipse each other, betraying its presence.",
    limitations: "Applies only to eclipsing binary systems." },
  { slug: "astrometry", name: "Astrometry", archiveNames: ["Astrometry"],
    description: "Measuring the tiny side-to-side wobble of a star on the sky.",
    detail: "A planet shifts its star's position by a minuscule amount; precise astrometry, as from Gaia, can detect this motion.",
    limitations: "Requires extraordinary positional precision." },
  { slug: "pulsar-timing", name: "Pulsar Timing", archiveNames: ["Pulsar Timing"],
    description: "Detecting planets from regular changes in a pulsar's precise pulses.",
    detail: "A pulsar is an extremely regular cosmic clock; an orbiting planet shifts the arrival time of its pulses. This method found the first confirmed exoplanets.",
    limitations: "Applies only to the rare planets orbiting pulsars." },
];
