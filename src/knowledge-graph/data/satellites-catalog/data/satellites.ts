import type { SatelliteCategory, SatelliteRecord } from "@/knowledge-graph/data/satellites-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Individual satellites. New `satellite:*` entities only — the astronomy
 * satellites already modelled as space telescopes (Gaia, TESS, Kepler, Euclid,
 * Planck, Herschel, WISE, Hubble…) and the historic Sputnik 1 (a space mission)
 * are REUSED via the encyclopedia's astronomy hub and links, never recreated.
 * Every technical figure is optional and omitted when not reliably known; orbital
 * parameters are given only where iconic (e.g. the geostationary altitude).
 */
type S = {
  slug: string;
  name: string;
  category: SatelliteCategory;
  status?: string; // omitted when the satellite's current status is not reliably known
  country: string;
  launch?: string; // launch year
  operator?: string; // organization slug (operated_by)
  operatorName?: string;
  builtBy?: string;
  vehicle?: string; // launch_vehicle slug (reused)
  site?: string; // launch_site slug (reused)
  orbit?: string; // orbit_type slug
  orbitClass?: string;
  altitudeKm?: number;
  periodLabel?: string;
  constellation?: string; // satellite_constellation slug
  related?: string[]; // existing graph ids to link (associated_with)
  sources?: SourceKey[];
  alt?: string[];
  description: string;
  highlights?: string[];
};
const mk = (s: S): SatelliteRecord => ({
  id: `satellite:${s.slug}`,
  slug: s.slug,
  name: s.name,
  kind: "satellite",
  altNames: s.alt,
  description: s.description,
  sources: s.sources ?? ["nasa"],
  category: s.category,
  status: s.status,
  country: s.country,
  launchDate: s.launch,
  operatorSlug: s.operator,
  operatorName: s.operatorName,
  builtBySlug: s.builtBy,
  launchVehicleSlug: s.vehicle,
  launchSiteSlug: s.site,
  orbitSlug: s.orbit,
  orbitClass: s.orbitClass,
  altitudeKm: s.altitudeKm,
  periodLabel: s.periodLabel,
  constellationSlug: s.constellation,
  relatedKeys: s.related,
  highlights: s.highlights,
});

export const satellites: SatelliteRecord[] = [
  /* ---------------- Historical ---------------- */
  mk({ slug: "explorer-1", name: "Explorer 1", category: "science", status: "Retired", country: "United States", launch: "1958", operatorName: "U.S. Army (ABMA) / JPL", orbit: "leo", orbitClass: "LEO", related: ["space_mission:sputnik-1"], sources: ["nasa"], description: "The first satellite launched by the United States, in 1958, whose radiation detector discovered the Van Allen radiation belts. Built by JPL and launched by the U.S. Army — NASA did not yet exist." }),
  mk({ slug: "vanguard-1", name: "Vanguard 1", category: "technology", status: "Retired (still in orbit)", country: "United States", launch: "1958", operatorName: "U.S. Naval Research Laboratory", orbit: "meo", sources: ["nasa"], description: "An early U.S. technology and science satellite — the oldest human-made object still in orbit, and the first satellite to use solar cells." }),
  mk({ slug: "telstar-1", name: "Telstar 1", category: "communications", status: "Retired", country: "United States", launch: "1962", operatorName: "AT&T / Bell Labs", orbit: "meo", sources: ["nasa"], description: "The first active communications satellite, which relayed the first transatlantic television signals in 1962." }),
  mk({ slug: "tiros-1", name: "TIROS-1", category: "weather", status: "Retired", country: "United States", launch: "1960", operator: "nasa", orbit: "leo", orbitClass: "LEO", sources: ["nasa"], alt: ["TIROS I"], description: "The first successful weather satellite, which returned the first television images of Earth's cloud cover in 1960 and founded operational meteorology from space." }),
  mk({ slug: "early-bird", name: "Intelsat I (Early Bird)", category: "communications", status: "Retired", country: "United States / International", launch: "1965", operator: "intelsat", orbit: "geo", orbitClass: "GEO", altitudeKm: 35786, periodLabel: "≈ 24 h", sources: ["gunters"], alt: ["Intelsat I", "Early Bird"], description: "The first commercial communications satellite in geostationary orbit, which began regular transatlantic telecommunications service in 1965." }),
  mk({ slug: "molniya", name: "Molniya", category: "communications", status: "Retired", country: "Soviet Union", launch: "1965", operatorName: "Soviet space program", orbit: "heo", orbitClass: "Molniya (HEO)", sources: ["gunters"], alt: ["Molniya-1"], description: "A long-running series of Soviet communications satellites that gave their name to the Molniya orbit — a highly elliptical orbit whose slow apogee high over the northern latitudes provided the coverage that geostationary satellites could not reach at high latitudes." }),

  /* ---------------- Earth observation ---------------- */
  mk({ slug: "landsat-1", name: "Landsat 1", category: "earth-observation", status: "Retired", country: "United States", launch: "1972", operator: "nasa", orbit: "sso", orbitClass: "Sun-synchronous", sources: ["nasa"], alt: ["ERTS-1"], description: "The first satellite of the Landsat program, which began the longest continuous record of Earth's land surface from space." }),
  mk({ slug: "landsat-8", name: "Landsat 8", category: "earth-observation", status: "Active", country: "United States", launch: "2013", operator: "usgs", vehicle: "atlas-v", site: "vandenberg", orbit: "sso", orbitClass: "Sun-synchronous", sources: ["nasa"], description: "A NASA/USGS Landsat satellite carrying the Operational Land Imager and Thermal Infrared Sensor, continuing the multi-decade land-imaging record." }),
  mk({ slug: "landsat-9", name: "Landsat 9", category: "earth-observation", status: "Active", country: "United States", launch: "2021", operator: "usgs", vehicle: "atlas-v", site: "vandenberg", orbit: "sso", orbitClass: "Sun-synchronous", sources: ["nasa"], description: "The latest Landsat satellite, launched in 2021 to work in tandem with Landsat 8 for an eight-day global revisit of the land surface." }),
  mk({ slug: "sentinel-1", name: "Sentinel-1", category: "earth-observation", status: "Active", country: "Europe", launch: "2014", operator: "esa", orbit: "sso", orbitClass: "Sun-synchronous", sources: ["esa"], description: "A Copernicus radar-imaging mission providing all-weather, day-and-night synthetic-aperture radar imagery of land and ocean." }),
  mk({ slug: "sentinel-2", name: "Sentinel-2", category: "earth-observation", status: "Active", country: "Europe", launch: "2015", operator: "esa", orbit: "sso", orbitClass: "Sun-synchronous", sources: ["esa"], description: "A Copernicus optical-imaging mission delivering high-resolution multispectral imagery for land monitoring, agriculture, and disaster response." }),
  mk({ slug: "sentinel-3", name: "Sentinel-3", category: "earth-observation", status: "Active", country: "Europe", launch: "2016", operator: "esa", orbit: "sso", orbitClass: "Sun-synchronous", sources: ["esa"], description: "A Copernicus mission monitoring ocean and land surface temperature, colour, and topography for climate and marine services." }),
  mk({ slug: "terra", name: "Terra", category: "earth-observation", status: "Active", country: "United States", launch: "1999", operator: "nasa", orbit: "sso", orbitClass: "Sun-synchronous", sources: ["nasa"], alt: ["EOS AM-1"], description: "NASA's flagship Earth Observing System morning satellite, carrying instruments including MODIS and ASTER to study land, ocean, and atmosphere." }),
  mk({ slug: "aqua", name: "Aqua", category: "earth-observation", status: "Active", country: "United States", launch: "2002", operator: "nasa", orbit: "sso", orbitClass: "Sun-synchronous", sources: ["nasa"], alt: ["EOS PM-1"], description: "NASA's Earth Observing System afternoon satellite, focused on the water cycle — precipitation, evaporation, clouds, and ocean properties." }),
  mk({ slug: "gosat", name: "GOSAT (Ibuki)", category: "earth-observation", country: "Japan", launch: "2009", operator: "jaxa", operatorName: "JAXA / NIES", site: "tanegashima", orbit: "sso", orbitClass: "Sun-synchronous", sources: ["jaxa"], alt: ["Ibuki", "Greenhouse gases Observing Satellite"], description: "Japan's greenhouse-gases observing satellite — the first satellite dedicated to monitoring atmospheric carbon dioxide and methane from space — operated by JAXA with Japan's National Institute for Environmental Studies." }),
  mk({ slug: "swot", name: "SWOT", category: "earth-observation", status: "Active", country: "United States / France", launch: "2022", operator: "nasa", operatorName: "NASA / CNES", vehicle: "falcon-9", site: "vandenberg", orbit: "leo", orbitClass: "LEO", sources: ["nasa"], alt: ["Surface Water and Ocean Topography"], description: "A NASA–CNES mission surveying the height of Earth's surface water — oceans, lakes, and rivers — with unprecedented resolution." }),
  mk({ slug: "icesat-2", name: "ICESat-2", category: "earth-observation", status: "Active", country: "United States", launch: "2018", operator: "nasa", site: "vandenberg", orbit: "polar", orbitClass: "Polar", sources: ["nasa"], description: "A NASA laser-altimetry mission measuring the elevation of ice sheets, glaciers, sea ice, and vegetation to track a changing planet." }),
  mk({ slug: "jason-3", name: "Jason-3", category: "earth-observation", status: "Active", country: "United States / Europe", launch: "2016", operator: "noaa", operatorName: "NOAA / EUMETSAT / NASA / CNES", vehicle: "falcon-9", site: "vandenberg", orbit: "leo", orbitClass: "LEO", sources: ["noaa"], description: "A radar-altimetry mission continuing the decades-long record of global sea-surface height for oceanography and climate monitoring." }),
  mk({ slug: "worldview-3", name: "WorldView-3", category: "commercial", status: "Active", country: "United States", launch: "2014", operator: "maxar", orbit: "sso", orbitClass: "Sun-synchronous", sources: ["gunters"], description: "A Maxar very-high-resolution commercial Earth-imaging satellite used for mapping, defence, and analytics." }),

  /* ---------------- Weather ---------------- */
  mk({ slug: "goes-16", name: "GOES-16", category: "weather", status: "Active", country: "United States", launch: "2016", operator: "noaa", vehicle: "atlas-v", site: "cape-canaveral", orbit: "geo", orbitClass: "GEO", altitudeKm: 35786, periodLabel: "≈ 24 h", sources: ["noaa"], alt: ["GOES-R"], description: "The first of NOAA's advanced GOES-R geostationary weather satellites, imaging the Western Hemisphere every few minutes for forecasting and storm tracking." }),
  mk({ slug: "meteosat-second-generation", name: "Meteosat Second Generation", category: "weather", status: "Active", country: "Europe", launch: "2002", operator: "eumetsat", orbit: "geo", orbitClass: "GEO", altitudeKm: 35786, periodLabel: "≈ 24 h", sources: ["esa"], alt: ["MSG", "Meteosat"], description: "EUMETSAT's geostationary weather satellites imaging Europe, Africa, and the Atlantic to support European weather forecasting." }),
  mk({ slug: "himawari-8", name: "Himawari-8", category: "weather", status: "Active", country: "Japan", launch: "2014", operatorName: "Japan Meteorological Agency (JMA)", orbit: "geo", orbitClass: "GEO", altitudeKm: 35786, periodLabel: "≈ 24 h", sources: ["jaxa"], description: "A Japanese geostationary weather satellite operated by the Japan Meteorological Agency, providing high-frequency full-disk imaging of East Asia and the western Pacific." }),
  mk({ slug: "noaa-20", name: "NOAA-20", category: "weather", status: "Active", country: "United States", launch: "2017", operator: "noaa", orbit: "sso", orbitClass: "Sun-synchronous", sources: ["noaa"], alt: ["JPSS-1"], description: "The first satellite of NOAA's Joint Polar Satellite System, providing global polar-orbiting weather and environmental observations." }),

  /* ---------------- Science ---------------- */
  mk({ slug: "grace", name: "GRACE", category: "science", status: "Retired", country: "United States / Germany", launch: "2002", operator: "nasa", operatorName: "NASA / DLR", orbit: "leo", orbitClass: "LEO", sources: ["nasa"], alt: ["Gravity Recovery and Climate Experiment"], description: "A twin-satellite mission that mapped tiny variations in Earth's gravity field to track the movement of water, ice, and mass around the planet." }),
  mk({ slug: "grace-fo", name: "GRACE-FO", category: "science", status: "Active", country: "United States / Germany", launch: "2018", operator: "nasa", operatorName: "NASA / GFZ", vehicle: "falcon-9", orbit: "leo", orbitClass: "LEO", sources: ["nasa"], alt: ["GRACE Follow-On"], description: "The follow-on mission to GRACE, continuing the record of Earth's changing gravity field and the redistribution of water and ice." }),
  mk({ slug: "smap", name: "SMAP", category: "science", status: "Active", country: "United States", launch: "2015", operator: "nasa", orbit: "polar", orbitClass: "Polar", sources: ["nasa"], alt: ["Soil Moisture Active Passive"], description: "A NASA mission mapping the moisture in Earth's surface soil to improve weather and climate models and monitor drought and floods." }),
  mk({ slug: "cloudsat", name: "CloudSat", category: "science", status: "Retired", country: "United States", launch: "2006", operator: "nasa", orbit: "sso", orbitClass: "Sun-synchronous", sources: ["nasa"], description: "A NASA mission carrying a cloud-profiling radar that measured the vertical structure of clouds to study their role in climate." }),
  mk({ slug: "calipso", name: "CALIPSO", category: "science", status: "Retired", country: "United States / France", launch: "2006", operator: "nasa", operatorName: "NASA / CNES", orbit: "sso", orbitClass: "Sun-synchronous", sources: ["nasa"], description: "A NASA–CNES mission using a space lidar to profile aerosols and thin clouds in Earth's atmosphere, flying in the A-Train formation." }),

  /* ---------------- Astronomy (new; the space telescopes are reused elsewhere) ---------------- */
  mk({ slug: "hipparcos", name: "Hipparcos", category: "astronomy", status: "Retired", country: "Europe", launch: "1989", operator: "esa", orbit: "gto", orbitClass: "Highly elliptical", sources: ["esa"], description: "ESA's pioneering astrometry satellite, which precisely measured the positions, distances, and motions of over 100,000 stars — the forerunner of Gaia. An apogee-motor failure left it in a highly elliptical orbit, yet it still delivered landmark astrometric catalogues." }),

  /* ---------------- Technology ---------------- */
  mk({ slug: "lightsail-2", name: "LightSail 2", category: "technology", status: "Retired", country: "United States", launch: "2019", operatorName: "The Planetary Society", vehicle: "falcon-heavy", orbit: "leo", orbitClass: "LEO", sources: ["gunters"], description: "A crowdfunded CubeSat that demonstrated controlled solar sailing in Earth orbit, raising its orbit using only the pressure of sunlight." }),
];
