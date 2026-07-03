import type { SatelliteCategory, SatelliteRecord } from "@/knowledge-graph/data/satellites-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Satellite constellations (new first-class entities). Sizes are given only where
 * a stable, well-established figure exists; the count of dynamic constellations
 * (e.g. Starlink) is described qualitatively rather than with an invented number.
 */
type C = {
  slug: string;
  name: string;
  operator?: string; // organization slug (operated_by)
  operatorName?: string;
  orbit?: string; // orbit_type slug
  category: SatelliteCategory;
  status: string;
  country: string;
  size?: string;
  sources?: SourceKey[];
  alt?: string[];
  description: string;
  highlights?: string[];
};
const mk = (c: C): SatelliteRecord => ({
  id: `satellite_constellation:${c.slug}`,
  slug: c.slug,
  name: c.name,
  kind: "constellation",
  altNames: c.alt,
  description: c.description,
  sources: c.sources ?? ["nasa"],
  operatorSlug: c.operator,
  operatorName: c.operatorName,
  orbitSlug: c.orbit,
  category: c.category,
  status: c.status,
  country: c.country,
  constellationSizeLabel: c.size,
  highlights: c.highlights,
});

export const constellations: SatelliteRecord[] = [
  // Communications
  mk({ slug: "starlink", name: "Starlink", operator: "spacex", orbit: "leo", category: "communications", status: "Active", country: "United States", size: "Thousands of satellites — the largest constellation ever deployed", sources: ["gunters"], description: "SpaceX's low-Earth-orbit broadband internet constellation, the largest ever built, delivering global high-speed connectivity." }),
  mk({ slug: "oneweb", name: "OneWeb", operator: "oneweb", orbit: "leo", category: "communications", status: "Active", country: "United Kingdom", size: "≈ 630 first-generation satellites", sources: ["gunters"], description: "A low-Earth-orbit broadband constellation providing global connectivity, focused on enterprise, government, and maritime users." }),
  mk({ slug: "iridium-next", name: "Iridium NEXT", operator: "iridium", orbit: "leo", category: "communications", status: "Active", country: "United States", size: "66 operational satellites plus on-orbit spares", sources: ["gunters"], alt: ["Iridium"], description: "The second-generation Iridium constellation of 66 cross-linked low-Earth-orbit satellites providing pole-to-pole voice and data coverage." }),
  mk({ slug: "globalstar", name: "Globalstar", operatorName: "Globalstar", orbit: "leo", category: "communications", status: "Active", country: "United States", sources: ["gunters"], description: "A low-Earth-orbit satellite-phone and data constellation serving voice, messaging, and IoT connectivity." }),
  mk({ slug: "o3b", name: "O3b", operator: "ses", orbit: "meo", category: "communications", status: "Active", country: "Luxembourg", sources: ["gunters"], alt: ["O3b mPOWER"], description: "SES's medium-Earth-orbit broadband constellation delivering low-latency connectivity to telecom, maritime, and enterprise customers between the tropics and beyond." }),

  // Navigation
  mk({ slug: "gps", name: "GPS (Global Positioning System)", operator: "us-space-force", orbit: "meo", category: "navigation", status: "Operational", country: "United States", size: "≈ 31 operational satellites", sources: ["gunters"], alt: ["NAVSTAR GPS", "GPS"], description: "The United States' global navigation satellite system, providing worldwide positioning, navigation, and timing from medium Earth orbit." }),
  mk({ slug: "galileo-navigation", name: "Galileo (navigation system)", operatorName: "European Union (EUSPA / ESA)", orbit: "meo", category: "navigation", status: "Operational", country: "Europe", size: "≈ 24 operational satellites plus spares", sources: ["esa"], alt: ["Galileo GNSS"], description: "Europe's civil global navigation satellite system — owned by the EU and operated through EUSPA, with ESA as the design and procurement agent — offering high-accuracy positioning independent of GPS." }),
  mk({ slug: "glonass", name: "GLONASS", operator: "roscosmos", orbit: "meo", category: "navigation", status: "Operational", country: "Russia", size: "≈ 24 operational satellites", sources: ["roscosmos"], description: "Russia's global navigation satellite system, providing worldwide positioning and timing from medium Earth orbit." }),
  mk({ slug: "beidou", name: "BeiDou", operator: "cnsa", orbit: "meo", category: "navigation", status: "Operational", country: "China", size: "≈ 35 satellites across MEO, GEO, and inclined geosynchronous orbits", sources: ["gunters"], alt: ["BDS", "Beidou Navigation Satellite System"], description: "China's global navigation satellite system, using a mix of medium-Earth, geostationary, and inclined geosynchronous orbits." }),

  // Commercial Earth observation
  mk({ slug: "planet-dove", name: "Planet Dove (Flock)", operator: "planet-labs", orbit: "sso", category: "commercial", status: "Active", country: "United States", size: "Hundreds of small CubeSats", sources: ["gunters"], alt: ["Flock", "Planet"], description: "Planet Labs' fleet of shoebox-sized Dove CubeSats that image the entire land surface of the Earth daily at medium resolution." }),
  mk({ slug: "blacksky-constellation", name: "BlackSky Global", operator: "blacksky", orbit: "leo", category: "commercial", status: "Active", country: "United States", sources: ["gunters"], alt: ["BlackSky"], description: "A commercial low-Earth-orbit constellation delivering rapid-revisit, high-cadence Earth imagery." }),
];
