import type { SatelliteRecord } from "@/knowledge-graph/data/satellites-catalog/types";

/**
 * Orbit types (new first-class entities). Altitude ranges and periods are
 * standard, well-established reference values; nothing is invented.
 */
type O = { slug: string; name: string; altitudeRange?: string; periodLabel?: string; use: string; alt?: string[]; description: string };
const mk = (o: O): SatelliteRecord => ({
  id: `orbit_type:${o.slug}`,
  slug: o.slug,
  name: o.name,
  kind: "orbit",
  altNames: o.alt,
  description: o.description,
  sources: ["nasa", "esa"],
  altitudeRange: o.altitudeRange,
  periodLabel: o.periodLabel,
  use: o.use,
});

export const orbits: SatelliteRecord[] = [
  mk({ slug: "leo", name: "Low Earth Orbit (LEO)", altitudeRange: "≈ 160–2,000 km", periodLabel: "≈ 90 minutes", use: "The International Space Station, most Earth-observation satellites, and large communications constellations such as Starlink and OneWeb.", alt: ["LEO"], description: "The region of space from roughly 160 to 2,000 km altitude, where a satellite circles the Earth in about 90 minutes. Low latency and easy access make it the busiest orbital regime." }),
  mk({ slug: "meo", name: "Medium Earth Orbit (MEO)", altitudeRange: "≈ 2,000–35,786 km", periodLabel: "hours", use: "Global navigation systems — GPS, Galileo, GLONASS, and BeiDou all fly in MEO.", alt: ["MEO"], description: "The band of orbits between low Earth orbit and the geostationary altitude. Its multi-hour periods and wide coverage make it ideal for navigation constellations, typically near 20,000 km." }),
  mk({ slug: "geo", name: "Geostationary Orbit (GEO)", altitudeRange: "35,786 km", periodLabel: "≈ 24 hours (one sidereal day)", use: "Communications and weather satellites that must stay fixed above one point on the equator, such as GOES, Meteosat, and Intelsat.", alt: ["GEO", "Geostationary"], description: "A circular orbit 35,786 km above the equator where a satellite's period matches Earth's rotation, so it appears fixed in the sky. The workhorse orbit for communications and weather monitoring." }),
  mk({ slug: "sso", name: "Sun-Synchronous Orbit (SSO)", altitudeRange: "≈ 600–800 km", periodLabel: "≈ 100 minutes", use: "Earth-observation and weather satellites that need consistent lighting, such as Landsat, the Sentinels, and Terra/Aqua.", alt: ["SSO", "Sun-synchronous"], description: "A near-polar low orbit whose plane precesses to keep a constant angle to the Sun, so a satellite passes over each location at the same local solar time — ideal for consistent-illumination Earth imaging." }),
  mk({ slug: "polar", name: "Polar Orbit", altitudeRange: "≈ 200–1,000 km", periodLabel: "≈ 100 minutes", use: "Earth-observation and reconnaissance satellites that must image the entire globe as it rotates beneath them.", alt: ["Polar"], description: "A low orbit inclined close to 90° that passes over (or near) both poles, letting a satellite eventually observe the whole planet as the Earth turns underneath it." }),
  mk({ slug: "heo", name: "Highly Elliptical Orbit (HEO)", periodLabel: "≈ 12 hours (Molniya)", use: "High-latitude communications and some scientific missions, using a high apogee that lingers over one hemisphere.", alt: ["HEO", "Molniya"], description: "An elongated orbit with a low perigee and a very high apogee (as in the Molniya and Tundra orbits). The satellite moves slowly near apogee, dwelling for hours over high latitudes that geostationary orbit cannot serve." }),
  mk({ slug: "gto", name: "Geostationary Transfer Orbit (GTO)", use: "The intermediate orbit into which launch vehicles deliver payloads bound for geostationary orbit, from which the satellite raises itself.", alt: ["GTO"], description: "An elliptical transfer orbit with perigee in low Earth orbit and apogee at the geostationary altitude, used to carry a satellite most of the way to GEO before its own engine circularises the orbit." }),
];
