import { cf, type CfRecord } from "@/knowledge-graph/data/reference-systems-catalog/types";

/** Coordinate systems (coordinate_system) — the missing structural layer; RA/Dec and the sky's coordinate frames. */
export const coordinates: CfRecord[] = [
  cf("coordinate", {
    slug: "celestial-sphere",
    name: "The Celestial Sphere",
    description:
      "The imaginary sphere of arbitrarily large radius, centred on the observer, onto which all celestial bodies appear projected. It is the geometric stage on which every astronomical coordinate system is drawn — the sky treated as a two-dimensional surface whose points are fixed by pairs of angles.",
    relatedKeys: ["coordinate_system:equatorial-coordinate-system", "coordinate_system:horizontal-coordinate-system"],
    highlights: ["The imaginary sphere onto which the sky is projected"],
  }),
  cf("coordinate", {
    slug: "right-ascension",
    name: "Right Ascension",
    symbolLabel: "α",
    altNames: ["RA"],
    description:
      "The celestial equivalent of longitude — the angle measured eastward along the celestial equator from the vernal equinox, conventionally expressed in hours, minutes, and seconds (24 hours around the sky). Together with declination it fixes a star's place in the equatorial system, and it connects directly to sidereal time.",
    relatedKeys: ["coordinate_system:declination", "coordinate_system:equatorial-coordinate-system", "time_standard:sidereal-time"],
    highlights: ["Celestial longitude, measured in hours from the vernal equinox"],
  }),
  cf("coordinate", {
    slug: "declination",
    name: "Declination",
    symbolLabel: "δ",
    altNames: ["Dec"],
    description:
      "The celestial equivalent of latitude — the angle of a body north (positive) or south (negative) of the celestial equator, from +90° at the north celestial pole to −90° at the south. With right ascension it pins a star's position in the equatorial coordinate system.",
    relatedKeys: ["coordinate_system:right-ascension", "coordinate_system:equatorial-coordinate-system"],
    highlights: ["Celestial latitude, +90° to −90° from the equator"],
  }),
  cf("coordinate", {
    slug: "equatorial-coordinate-system",
    name: "The Equatorial Coordinate System",
    description:
      "The standard astronomical coordinate system, projecting the Earth's equator and poles onto the sky and fixing positions by right ascension and declination. Because it is tied to the slowly precessing equator and equinox, an equatorial position must be qualified by a reference frame and epoch, such as ICRS or J2000.",
    relatedKeys: ["coordinate_system:right-ascension", "coordinate_system:declination", "reference_frame:icrs", "reference_frame:j2000", "astronomy_method:proper-motion", "astronomy_method:parallax"],
    highlights: ["RA and Dec on the projected terrestrial equator — tied to an epoch"],
  }),
  cf("coordinate", {
    slug: "galactic-coordinate-system",
    name: "The Galactic Coordinate System",
    symbolLabel: "l, b",
    description:
      "A coordinate system aligned with the Milky Way, measuring galactic longitude from the direction of the Galactic Centre along the galactic plane and galactic latitude above or below it. It is the natural frame for describing the structure of our Galaxy — spiral arms, the disk, and the distribution of stars and gas.",
    relatedKeys: ["coordinate_system:equatorial-coordinate-system", "galaxy:milky-way"],
    highlights: ["Longitude and latitude aligned with the plane of the Milky Way"],
  }),
  cf("coordinate", {
    slug: "ecliptic-coordinate-system",
    name: "The Ecliptic Coordinate System",
    symbolLabel: "λ, β",
    description:
      "A coordinate system based on the ecliptic — the plane of the Earth's orbit and the Sun's apparent yearly path — measuring ecliptic longitude eastward from the vernal equinox and ecliptic latitude perpendicular to it. It is the natural frame for the Solar System, where the planets and the Moon stay close to the ecliptic.",
    relatedKeys: ["reference_frame:the-ecliptic", "coordinate_system:equatorial-coordinate-system"],
    highlights: ["The natural frame of the Solar System, along the Sun's path"],
  }),
  cf("coordinate", {
    slug: "horizontal-coordinate-system",
    name: "The Horizontal Coordinate System",
    symbolLabel: "alt, az",
    altNames: ["Altazimuth coordinates", "Alt-azimuth"],
    description:
      "The observer-centred system that describes where a body appears in the local sky: altitude above the horizon and azimuth around it. Simple and intuitive for pointing a telescope, horizontal coordinates change continuously as the Earth turns and depend on the observer's location and the moment of observation.",
    relatedKeys: ["coordinate_system:celestial-sphere", "astrometric_effect:atmospheric-refraction"],
    highlights: ["Altitude and azimuth in the observer's local sky"],
  }),
  cf("coordinate", {
    slug: "supergalactic-coordinate-system",
    name: "The Supergalactic Coordinate System",
    symbolLabel: "SGL, SGB",
    description:
      "A coordinate system whose equator follows the flattened plane in which the nearby galaxies and clusters are concentrated — the supergalactic plane of the Local Supercluster. It is used to describe the large-scale distribution of galaxies in our cosmic neighbourhood.",
    relatedKeys: ["coordinate_system:galactic-coordinate-system"],
    highlights: ["Aligned with the flattened plane of nearby galaxies"],
  }),
];
