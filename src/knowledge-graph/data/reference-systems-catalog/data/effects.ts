import { cf, type CfRecord } from "@/knowledge-graph/data/reference-systems-catalog/types";

/**
 * Astrometric effects (astrometric_effect) — the phenomena that shift a star's measured position and must
 * be corrected for, together with the Earth-orientation parameters that quantify the Earth's changing
 * orientation and are the correction data for the largest of those effects. Parallax and proper motion
 * already exist as `astronomy_method` entities and are reused; the rest are added here.
 */
export const effects: CfRecord[] = [
  cf("effect", {
    slug: "precession",
    name: "Precession",
    altNames: ["Axial precession"],
    description:
      "The slow conical wobble of the Earth's rotation axis, driven by the gravitational pull of the Sun and Moon on the equatorial bulge, which carries the celestial poles and the equinoxes around the sky once in about 25,772 years. Precession is why equatorial coordinates drift with time and must be referred to a stated epoch, and why Polaris is only temporarily the pole star.",
    relatedKeys: ["astrometric_effect:nutation", "historical_discovery:precession-of-the-equinoxes", "reference_frame:the-ecliptic", "coordinate_system:equatorial-coordinate-system"],
    highlights: ["A ~25,772-year wobble that moves the poles and equinoxes"],
  }),
  cf("effect", {
    slug: "nutation",
    name: "Nutation",
    description:
      "The small, shorter-period nodding of the Earth's axis superimposed on the steady precessional wobble, caused mainly by the changing orientation of the Moon's orbit, with a dominant period of about 18.6 years. Nutation must be added to precession to compute a body's true position of date to arcsecond precision.",
    relatedKeys: ["astrometric_effect:precession", "reference_frame:icrs", "astrometric_effect:earth-orientation-parameters"],
    highlights: ["The axis's 18.6-year nod on top of precession"],
  }),
  cf("effect", {
    slug: "aberration-of-light",
    name: "The Aberration of Light",
    altNames: ["Stellar aberration"],
    description:
      "The small apparent shift of a star's position in the direction of the observer's motion, because light travels at a finite speed while the observer moves. The Earth's orbital motion makes every star describe a tiny yearly ellipse whose semi-major axis — the maximum displacement from the true position — is about 20.5 arcseconds; discovered by James Bradley in 1728, it was early direct evidence that the Earth orbits the Sun.",
    relatedKeys: ["astronomy_method:parallax", "coordinate_system:equatorial-coordinate-system"],
    highlights: ["A ~20.5″ yearly shift from the Earth's motion through the light"],
  }),
  cf("effect", {
    slug: "atmospheric-refraction",
    name: "Atmospheric Refraction",
    description:
      "The bending of a light ray as it passes through the Earth's atmosphere, which lifts the apparent position of a celestial body above its true one — by about half a degree right at the horizon, so the Sun is fully refracted into view when geometrically it has already set. Refraction must be removed to turn an observed altitude into a true one.",
    relatedKeys: ["coordinate_system:horizontal-coordinate-system", "coordinate_system:celestial-sphere"],
    highlights: ["Atmosphere lifts objects — ~0.5° at the horizon"],
  }),
  cf("effect", {
    slug: "light-time-correction",
    name: "Light-Time Correction",
    altNames: ["Retardation"],
    description:
      "The correction that accounts for the time light takes to travel from a moving Solar-System body to the observer: what is seen is where the body was when the light left it, not where it is now. Together with stellar aberration it makes up what is called planetary aberration, and it is essential for computing accurate apparent positions of planets, moons, and spacecraft.",
    relatedKeys: ["astrometric_effect:aberration-of-light", "ephemeris_system:spice-toolkit"],
    highlights: ["Seeing a planet where it was when its light departed"],
  }),
  cf("effect", {
    slug: "earth-orientation-parameters",
    name: "Earth Orientation Parameters",
    altNames: ["EOP"],
    description:
      "The measured quantities that describe how the real, wobbling, irregularly rotating Earth is oriented in space relative to the celestial reference frame — the difference UT1−UTC, the position of the pole (polar motion), and small corrections to the precession-nutation model. Determined and published by the IERS, they are what make it possible to transform between celestial and terrestrial coordinates to full precision.",
    relatedKeys: ["organization:iers", "time_standard:ut1", "astrometric_effect:precession", "astronomy_method:proper-motion"],
    highlights: ["UT1−UTC, polar motion, and nutation offsets from the IERS"],
  }),
];
