import type { ProvenanceRecord, ProvenanceReference } from "@/platform/authority/provenance";

/**
 * Program N — the first real batch of provenance records for flagship entities.
 *
 * Every statement is a well-established, source-backed fact. Evidence levels
 * follow the platform's framework: NASA/ESA/IAU/JPL factual data = high;
 * dated historical events/discoveries = historical; the nature of dark matter/
 * energy and contested claims (e.g. K2-18 b biosignatures) are NOT marked high.
 * Sources are real registry organizations with verified canonical URLs; nothing
 * is fabricated. `version` is the graph release version; `reviewer` is the
 * internal Asteria Scientific Review Process (not an external institution).
 */

const V = "1.0.0";
const REVIEWER = "Asteria Scientific Review Process";

/* --------------------------------------------------- shared source references */
const nasaFacts: ProvenanceReference = { organization: "NASA (NSSDCA)", publication: "NASA Planetary Fact Sheet", url: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/", source: "nasa", license: "Public domain (US Government work)" };
const exoArchive: ProvenanceReference = { organization: "NASA Exoplanet Science Institute (Caltech/IPAC)", publication: "NASA Exoplanet Archive", url: "https://exoplanetarchive.ipac.caltech.edu/", source: "nasa", license: "Freely available; acknowledgement requested" };
const simbad: ProvenanceReference = { organization: "CDS — SIMBAD Astronomical Database", url: "https://simbad.cds.unistra.fr/simbad/", source: "simbad", license: "CC BY 4.0 (CDS)" };
const nasaSci: ProvenanceReference = { organization: "NASA Science", url: "https://science.nasa.gov/", source: "nasa", license: "Public domain (US Government work)" };
const esa: ProvenanceReference = { organization: "European Space Agency", url: "https://www.esa.int/", source: "esa", license: "ESA standard terms" };
const stsci: ProvenanceReference = { organization: "Space Telescope Science Institute", url: "https://www.stsci.edu/", source: "stsci" };
const eso: ProvenanceReference = { organization: "European Southern Observatory", url: "https://www.eso.org/", source: "eso" };
const eht: ProvenanceReference = { organization: "Event Horizon Telescope Collaboration", url: "https://eventhorizontelescope.org/", source: "eht" };
const planck: ProvenanceReference = { organization: "ESA — Planck Collaboration", url: "https://www.esa.int/Science_Exploration/Space_Science/Planck", source: "planck" };
const ligo: ProvenanceReference = { organization: "LIGO Scientific Collaboration", url: "https://www.ligo.org/", source: "ligo" };
const britannica: ProvenanceReference = { organization: "Encyclopaedia Britannica", url: "https://www.britannica.com/", source: "britannica" };

function p(
  entityId: string,
  statement: string,
  evidenceLevel: ProvenanceRecord["evidenceLevel"],
  confidence: ProvenanceRecord["confidence"],
  primarySource: ProvenanceReference,
  extra: Partial<ProvenanceRecord> = {},
): ProvenanceRecord {
  return { id: `prov:${entityId.replace(":", "-")}`, entityId, statement, evidenceLevel, confidence, primarySource, version: V, reviewer: REVIEWER, ...extra };
}

export const SEED_PROVENANCE: ProvenanceRecord[] = [
  /* --------------------------------------------------------- Solar System */
  p("star:sun", "The Sun is a G-type main-sequence star (G2V) at the centre of the Solar System, containing about 99.86% of the system's mass; sunlight takes roughly 8.3 minutes to reach Earth.", "high", "confirmed", nasaFacts, { citationIds: ["cite:nasa-planetary-fact-sheet"] }),
  p("planet:mercury", "Mercury is the smallest planet and the closest to the Sun, with only a tenuous exosphere and the largest day-to-night temperature swing of any planet.", "high", "confirmed", nasaFacts, { citationIds: ["cite:nasa-planetary-fact-sheet"] }),
  p("planet:venus", "Venus is the second planet from the Sun; its dense carbon-dioxide atmosphere drives a runaway greenhouse effect, giving it the hottest surface of any planet (about 465 °C).", "high", "confirmed", nasaFacts, { citationIds: ["cite:nasa-planetary-fact-sheet"] }),
  p("planet:earth", "Earth is the third planet from the Sun and the only body known to host life; about 71% of its surface is covered by liquid water.", "high", "confirmed", nasaFacts, { citationIds: ["cite:nasa-planetary-fact-sheet"] }),
  p("moon:the-moon", "The Moon is Earth's only natural satellite and the fifth-largest moon in the Solar System; it is tidally locked, always presenting the same face to Earth.", "high", "confirmed", nasaFacts, { citationIds: ["cite:nasa-planetary-fact-sheet"] }),
  p("planet:mars", "Mars is the fourth planet from the Sun, a cold desert world about half Earth's radius, with seasonal polar ice caps and Olympus Mons, the tallest volcano in the Solar System.", "high", "confirmed", nasaFacts, { citationIds: ["cite:nasa-planetary-fact-sheet"] }),
  p("planet:jupiter", "Jupiter is the largest planet in the Solar System, a gas giant more massive than all the other planets combined, with a long-lived storm (the Great Red Spot) and dozens of moons.", "high", "confirmed", nasaFacts, { citationIds: ["cite:nasa-planetary-fact-sheet"] }),
  p("planet:saturn", "Saturn is the second-largest planet, a gas giant renowned for its bright, extensive ring system composed largely of water ice.", "high", "confirmed", nasaFacts, { citationIds: ["cite:nasa-planetary-fact-sheet"] }),
  p("planet:uranus", "Uranus is the seventh planet from the Sun, an ice giant that rotates on its side with an axial tilt of about 98 degrees.", "high", "confirmed", nasaFacts, { citationIds: ["cite:nasa-planetary-fact-sheet"] }),
  p("planet:neptune", "Neptune is the eighth and most distant known planet, an ice giant with the strongest sustained winds measured in the Solar System.", "high", "confirmed", nasaFacts, { citationIds: ["cite:nasa-planetary-fact-sheet"] }),
  p("dwarf_planet:pluto", "Pluto is a dwarf planet in the Kuiper Belt; under the IAU's 2006 definition (Resolution B5) it is classified as a dwarf planet rather than the ninth planet.", "high", "confirmed", nasaFacts, { secondarySources: [{ organization: "International Astronomical Union", url: "https://www.iau.org/", source: "iau" }], citationIds: ["cite:nasa-planetary-fact-sheet", "cite:iau-planet-definition-2006"] }),
  p("moon:europa", "Europa, a Galilean moon of Jupiter, has a young icy surface and strong evidence for a global subsurface ocean of liquid water beneath its ice shell.", "high", "confirmed", nasaSci, { citationIds: ["cite:nasa-planetary-fact-sheet"] }),
  p("moon:titan", "Titan, Saturn's largest moon, has a thick nitrogen-rich atmosphere and stable surface lakes and seas of liquid methane and ethane, revealed by the Cassini–Huygens mission.", "high", "confirmed", nasaSci, { secondarySources: [esa] }),
  p("moon:enceladus", "Enceladus, a moon of Saturn, vents water-ice plumes from its south-polar region that feed Saturn's E ring, indicating a subsurface liquid-water ocean.", "high", "confirmed", nasaSci),
  p("moon:ganymede", "Ganymede, a Galilean moon of Jupiter, is the largest moon in the Solar System and the only one known to generate its own intrinsic magnetic field.", "high", "confirmed", nasaSci),

  /* ---------------------------------------------------------------- Stars */
  p("star:sirius", "Sirius is the brightest star in the night sky, a binary of a main-sequence A-type star (Sirius A) and a white-dwarf companion (Sirius B), about 8.6 light-years away.", "high", "confirmed", simbad),
  p("star:betelgeuse", "Betelgeuse is a red supergiant in Orion and one of the largest and most luminous stars visible to the naked eye; it is expected to end its life as a supernova.", "high", "confirmed", simbad),
  p("star:rigel", "Rigel is a blue supergiant and, on average, the brightest star in the constellation Orion, far more luminous than the Sun.", "high", "confirmed", simbad),
  p("star:vega", "Vega is a nearby A-type main-sequence star about 25 light-years away; it defined the original zero point of the visual magnitude scale and hosts a circumstellar debris disk.", "high", "confirmed", simbad),
  p("star:polaris", "Polaris is the current northern pole star, a Cepheid variable in Ursa Minor lying close to the north celestial pole.", "high", "confirmed", simbad),
  p("star:proxima-centauri", "Proxima Centauri is a red-dwarf star about 4.24 light-years away — the closest known star to the Sun — and the third member of the Alpha Centauri system.", "high", "confirmed", simbad),
  p("star:alpha-centauri", "Alpha Centauri is the nearest star system to the Sun: a triple system of the Sun-like pair Alpha Centauri A and B together with the red dwarf Proxima Centauri.", "high", "confirmed", simbad),
  p("star:trappist-1", "TRAPPIST-1 is an ultracool red-dwarf star about 40 light-years away that hosts seven known Earth-sized planets, several of them in or near its habitable zone.", "high", "confirmed", exoArchive, { citationIds: ["cite:nasa-exoplanet-archive"] }),

  /* ------------------------------------------------------------- Deep Sky */
  p("galaxy:andromeda-galaxy", "The Andromeda Galaxy (M31) is the nearest large spiral galaxy to the Milky Way, about 2.5 million light-years away, and is approaching the Milky Way for a future merger.", "high", "confirmed", nasaSci),
  p("nebula:orion-nebula", "The Orion Nebula (M42) is the nearest large star-forming region to Earth, about 1,340 light-years away, and is visible to the naked eye below Orion's Belt.", "high", "confirmed", stsci),
  p("nebula:eagle-nebula", "The Eagle Nebula (M16) is a star-forming region containing the 'Pillars of Creation,' towering columns of gas and dust famously imaged by the Hubble Space Telescope.", "high", "confirmed", stsci),
  p("nebula:crab-nebula", "The Crab Nebula (M1) is the remnant of a supernova recorded by astronomers in 1054 CE and contains a rapidly rotating neutron star, the Crab Pulsar, at its centre.", "high", "confirmed", nasaSci),
  p("galaxy:sombrero-galaxy", "The Sombrero Galaxy (M104) is a bright galaxy noted for its large, luminous central bulge and a prominent edge-on lane of dust.", "high", "confirmed", stsci),
  p("galaxy:messier-87", "Messier 87 (M87) is a giant elliptical galaxy in the Virgo Cluster whose central supermassive black hole was the first to be directly imaged, by the Event Horizon Telescope in 2019.", "high", "confirmed", eht, { citationIds: ["cite:eht-m87-2019"] }),
  p("black_hole:sagittarius-a-star", "Sagittarius A* is the supermassive black hole at the centre of the Milky Way, with a mass of about 4 million solar masses inferred from the orbits of nearby stars (2020 Nobel Prize in Physics).", "high", "confirmed", eso),

  /* --------------------------------------------------- Missions & telescopes */
  p("space_telescope:hubble-space-telescope", "The Hubble Space Telescope, a joint NASA–ESA observatory, was launched on 24 April 1990 aboard Space Shuttle Discovery and remains in operation.", "historical", "confirmed", stsci, { secondarySources: [esa] }),
  p("space_telescope:james-webb-space-telescope", "The James Webb Space Telescope, a joint NASA–ESA–CSA infrared observatory, was launched on 25 December 2021 and operates near the Sun–Earth L2 Lagrange point.", "historical", "confirmed", stsci, { secondarySources: [esa] }),
  p("space_mission:voyager-1", "Voyager 1 was launched by NASA in 1977 and in 2012 became the first spacecraft to enter interstellar space; it remains the most distant human-made object from Earth.", "historical", "confirmed", nasaSci),
  p("space_mission:voyager-2", "Voyager 2 was launched by NASA in 1977, is the only spacecraft to have flown past all four giant planets, and entered interstellar space in 2018.", "historical", "confirmed", nasaSci),
  p("space_mission:apollo-11", "Apollo 11 achieved the first crewed Moon landing on 20 July 1969, when Neil Armstrong and Buzz Aldrin walked on the lunar surface.", "historical", "confirmed", nasaSci),
  p("space_mission:cassini-huygens", "Cassini–Huygens, a NASA–ESA–ASI mission, orbited Saturn from 2004 to 2017 and delivered ESA's Huygens probe to the surface of Titan in January 2005.", "historical", "confirmed", nasaSci, { secondarySources: [esa] }),
  p("space_mission:juno", "Juno is a NASA mission that entered orbit around Jupiter in 2016 to study the planet's interior structure, atmosphere, and magnetosphere.", "historical", "confirmed", nasaSci),
  p("space_mission:new-horizons", "New Horizons is a NASA mission that performed the first flyby of Pluto in July 2015 and later flew past the Kuiper Belt object Arrokoth in 2019.", "historical", "confirmed", nasaSci),
  p("spacecraft:perseverance", "NASA's Perseverance rover landed in Jezero Crater on Mars on 18 February 2021 to seek signs of ancient microbial life and to cache samples for possible future return to Earth.", "historical", "confirmed", nasaSci),

  /* ------------------------------------------------------------ Exoplanets */
  p("exoplanet:proxima-centauri-b", "Proxima Centauri b is an approximately Earth-mass planet in the habitable zone of Proxima Centauri, the nearest star to the Sun; it was announced in 2016 from radial-velocity measurements.", "high", "confirmed", exoArchive, { citationIds: ["cite:nasa-exoplanet-archive"] }),
  p("exoplanet:trappist-1-e", "TRAPPIST-1 e is one of seven Earth-sized planets orbiting the red dwarf TRAPPIST-1 and lies within the star's habitable zone.", "high", "confirmed", exoArchive, { citationIds: ["cite:nasa-exoplanet-archive"] }),
  p("exoplanet:51-pegasi-b", "51 Pegasi b was the first confirmed exoplanet discovered orbiting a Sun-like star (1995); it is a 'hot Jupiter' in a very short-period orbit, a discovery recognised with the 2019 Nobel Prize in Physics.", "high", "confirmed", exoArchive, { citationIds: ["cite:mayor-queloz-1995", "cite:nasa-exoplanet-archive"] }),
  p("exoplanet:hd-209458-b", "HD 209458 b was the first exoplanet observed to transit its host star (2000) and the first exoplanet with an atmosphere detected.", "high", "confirmed", exoArchive, { citationIds: ["cite:nasa-exoplanet-archive"] }),
  p("exoplanet:k2-18-b", "K2-18 b is a sub-Neptune exoplanet orbiting in the habitable zone of a red dwarf. Its confirmed status and orbit are well established; molecules have been reported in its atmosphere, but claimed biosignatures remain debated and unconfirmed.", "moderate", "likely", exoArchive, { citationIds: ["cite:nasa-exoplanet-archive"], editorialNote: "Existence and orbit are confirmed; biosignature interpretations are contested and are not asserted here." }),

  /* ------------------------------------------------------------- Cosmology */
  p("cosmology_concept:the-big-bang", "The Big Bang is the prevailing cosmological model: the universe expanded from an extremely hot, dense early state about 13.8 billion years ago, an age constrained by the cosmic microwave background.", "high", "confirmed", planck, { citationIds: ["cite:planck-2018-cosmological-parameters"] }),
  p("cosmology_concept:cosmic-microwave-background", "The cosmic microwave background is relic thermal radiation from the early universe, discovered in 1965 and measured to be a near-perfect blackbody at about 2.725 K.", "high", "confirmed", planck, { citationIds: ["cite:planck-2018-cosmological-parameters"] }),
  p("cosmology_concept:dark-matter", "Dark matter is unseen mass whose gravitational effects are inferred from galaxy rotation curves, gravitational lensing, and the cosmic microwave background; it constitutes most of the matter in the universe, although its physical nature is unknown.", "moderate", "likely", planck, { citationIds: ["cite:planck-2018-cosmological-parameters"], editorialNote: "The gravitational evidence for dark matter's existence is strong, but its underlying nature is unknown — so this is rated moderate, not high, and is not overstated." }),
  p("cosmology_concept:dark-energy", "Dark energy is the name given to whatever drives the observed accelerating expansion of the universe, discovered in 1998; it dominates the universe's energy budget, but its nature remains unknown.", "moderate", "likely", planck, { secondarySources: [{ organization: "The Nobel Prize", url: "https://www.nobelprize.org/", source: "nobel" }], citationIds: ["cite:planck-2018-cosmological-parameters"], editorialNote: "The accelerating expansion is well established (2011 Nobel Prize), but the nature of dark energy is unknown — so this is rated moderate, not high, and is not overstated." }),
  p("cosmology_concept:cosmic-expansion", "The universe is expanding, with distant galaxies receding at rates proportional to their distance (the Hubble–Lemaître law), a relation first established observationally in the 1920s.", "high", "confirmed", planck, { citationIds: ["cite:planck-2018-cosmological-parameters"] }),
  p("cosmology_concept:gravitational-waves", "Gravitational waves are ripples in spacetime predicted by general relativity; the first direct detection, GW150914, was made by LIGO in 2015 from the merger of two black holes.", "high", "confirmed", ligo, { citationIds: ["cite:ligo-gw150914"] }),
  p("historical_discovery:first-black-hole-image", "In 2019 the Event Horizon Telescope Collaboration released the first direct image of a black hole's shadow, at the centre of the galaxy M87.", "historical", "confirmed", eht, { citationIds: ["cite:eht-m87-2019"] }),

  /* --------------------------------------------------------------- History */
  p("astronomer:galileo-galilei", "Galileo Galilei made pioneering telescopic observations in 1609–1610, including the four large moons of Jupiter, the phases of Venus, and craters on the Moon, supporting the heliocentric model.", "historical", "confirmed", britannica),
  p("astronomer:isaac-newton", "Isaac Newton formulated the law of universal gravitation and the three laws of motion, published in the Principia (1687), providing the physical foundation of celestial mechanics.", "historical", "confirmed", britannica),
  p("astronomer:edwin-hubble", "Edwin Hubble demonstrated in the 1920s that galaxies lie far beyond the Milky Way and that their recession velocities increase with distance, foundational evidence for an expanding universe.", "historical", "confirmed", britannica),
  p("astronomer:vera-rubin", "Vera Rubin's measurements of galaxy rotation curves in the 1970s provided key observational evidence for the existence of dark matter.", "historical", "confirmed", britannica),
  p("astronomer:jocelyn-bell-burnell", "Jocelyn Bell Burnell discovered the first radio pulsars in 1967, later identified as rapidly rotating neutron stars.", "historical", "confirmed", britannica),
];
