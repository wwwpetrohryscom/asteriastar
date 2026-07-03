import type { SatelliteRecord } from "@/knowledge-graph/data/satellites-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Satellite operators. Existing `organization:*` entities (space agencies) are
 * ENRICHED as operators (`existing: true`, never recreated); civil and commercial
 * operators not yet in the graph are created. Each new operator is referenced by
 * at least one satellite/constellation.
 */
type Op = { slug: string; name: string; existing?: boolean; country: string; founded?: string; sources?: SourceKey[]; alt?: string[]; description: string };
const mk = (o: Op): SatelliteRecord => ({
  id: `organization:${o.slug}`,
  slug: o.slug,
  name: o.name,
  kind: "operator",
  existing: o.existing,
  altNames: o.alt,
  description: o.description,
  sources: o.sources ?? ["nasa"],
  country: o.country,
  launchDate: o.founded,
});

export const operators: SatelliteRecord[] = [
  // --- existing agencies, enriched as operators ---
  mk({ slug: "nasa", name: "NASA", existing: true, country: "United States", sources: ["nasa"], description: "The U.S. civil space agency, operator of Earth-observing satellites (Landsat, Terra, Aqua, SWOT) and space telescopes." }),
  mk({ slug: "esa", name: "ESA", existing: true, country: "Europe", sources: ["esa"], description: "The European Space Agency, which develops the Copernicus Sentinels and scientific satellites such as Gaia and Euclid." }),
  mk({ slug: "spacex", name: "SpaceX", existing: true, country: "United States", sources: ["nasa"], description: "The operator of Starlink, the largest satellite constellation ever deployed." }),
  mk({ slug: "roscosmos", name: "Roscosmos", existing: true, country: "Russia", sources: ["roscosmos"], description: "The Russian state space corporation, operator of the GLONASS navigation constellation." }),
  mk({ slug: "cnsa", name: "CNSA", existing: true, country: "China", sources: ["gunters"], description: "China's national space administration, associated with the BeiDou navigation system and Earth-observation fleets." }),
  mk({ slug: "jaxa", name: "JAXA", existing: true, country: "Japan", sources: ["jaxa"], description: "The Japan Aerospace Exploration Agency, operator of Earth-observation and greenhouse-gas monitoring satellites such as GOSAT and the ALOS series." }),
  mk({ slug: "isro", name: "ISRO", existing: true, country: "India", sources: ["isro"], description: "The Indian Space Research Organisation, operator of Earth-observation, communications, and the NavIC navigation satellites." }),

  // --- new operators (each referenced by ≥1 satellite/constellation) ---
  mk({ slug: "noaa", name: "NOAA", existing: false, country: "United States", sources: ["noaa"], alt: ["National Oceanic and Atmospheric Administration"], description: "The U.S. agency operating the GOES geostationary and JPSS/POES polar weather satellites." }),
  mk({ slug: "usgs", name: "USGS", existing: false, country: "United States", sources: ["nasa"], alt: ["U.S. Geological Survey"], description: "The U.S. Geological Survey, which operates the Landsat archive jointly with NASA." }),
  mk({ slug: "us-space-force", name: "United States Space Force", existing: false, country: "United States", sources: ["nasa"], alt: ["USSF", "Space Force"], description: "The U.S. military service that operates the GPS navigation constellation." }),
  mk({ slug: "eumetsat", name: "EUMETSAT", existing: false, country: "Europe", founded: "1986", sources: ["esa"], description: "The European organisation for the exploitation of meteorological satellites, operator of the Meteosat and Metop fleets." }),
  mk({ slug: "iridium", name: "Iridium Communications", existing: false, country: "United States", founded: "2001", sources: ["gunters"], description: "The operator of the Iridium (and Iridium NEXT) low-Earth-orbit voice and data communications constellation." }),
  mk({ slug: "oneweb", name: "OneWeb", existing: false, country: "United Kingdom", founded: "2012", sources: ["gunters"], description: "The operator of the OneWeb low-Earth-orbit broadband communications constellation." }),
  mk({ slug: "ses", name: "SES", existing: false, country: "Luxembourg", founded: "1985", sources: ["gunters"], description: "A major satellite operator running geostationary and medium-Earth-orbit (O3b) communications fleets." }),
  mk({ slug: "intelsat", name: "Intelsat", existing: false, country: "United States / International", founded: "1964", sources: ["gunters"], description: "One of the oldest and largest commercial geostationary communications satellite operators, operator of the first commercial GEO comsat, Early Bird." }),
  mk({ slug: "planet-labs", name: "Planet Labs", existing: false, country: "United States", founded: "2010", sources: ["gunters"], alt: ["Planet"], description: "A commercial Earth-imaging company operating the large Dove (Flock) and SkySat constellations." }),
  mk({ slug: "maxar", name: "Maxar Technologies", existing: false, country: "United States", sources: ["gunters"], alt: ["DigitalGlobe"], description: "A commercial operator of very-high-resolution Earth-imaging satellites, including the WorldView series." }),
  mk({ slug: "blacksky", name: "BlackSky", existing: false, country: "United States", founded: "2014", sources: ["gunters"], description: "A commercial operator of a low-Earth-orbit constellation for rapid-revisit Earth imaging." }),
];
