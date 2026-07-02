import type { Citation, CitationType } from "@/lib/citations";

/**
 * Real citation registry (Programs N + O). Every record is source-backed with a
 * canonical URL; DOIs appear only where known and verified. No fabricated DOI,
 * author, date, or URL. Every citation links to at least one source, entity,
 * dataset, or provenance record — no orphans.
 *
 * URL policy: specific canonical URLs where verified (NASA fact sheets, doi.org,
 * Nobel year pages, code repositories); otherwise the organization's verified
 * canonical database/section URL, with the object named in the title and pinned
 * by entity links. Never a fabricated deep link.
 */

function c(id: string, type: CitationType, title: string, organization: string, url: string, opts: Partial<Citation> = {}): Citation {
  return { id, type, title, organization, url, ...opts };
}

const PUB_US_GOV = "Public domain (US Government work)";
const factsheet = "https://nssdc.gsfc.nasa.gov/planetary/factsheet/";
const exoArchive = "https://exoplanetarchive.ipac.caltech.edu/";
const simbad = "https://simbad.cds.unistra.fr/simbad/";
const ned = "https://ned.ipac.caltech.edu/";
const nasaSci = "https://science.nasa.gov/";
const nobel = (y: string) => `https://www.nobelprize.org/prizes/physics/${y}/`;

export const CITATION_RECORDS: Citation[] = [
  /* =============================================================== DATASETS */
  c("cite:nasa-planetary-fact-sheet", "dataset", "NASA Planetary Fact Sheet", "NASA Goddard Space Flight Center — NSSDCA", factsheet, { publication: "Planetary Fact Sheet", license: PUB_US_GOV, source: "nasa", datasetIds: ["planets", "dwarf-planets", "moons"], notes: "Tabulated physical and orbital parameters for the Sun, planets, and major moons." }),
  c("cite:jpl-solar-system-dynamics", "dataset", "JPL Solar System Dynamics", "NASA Jet Propulsion Laboratory (Caltech)", "https://ssd.jpl.nasa.gov/", { publication: "Solar System Dynamics", license: "Public domain (NASA/JPL-Caltech)", source: "jpl", datasetIds: ["planets", "moons", "asteroids", "comets"], notes: "Ephemerides, orbital elements, and physical data for Solar System bodies." }),
  c("cite:nasa-exoplanet-archive", "dataset", "NASA Exoplanet Archive", "NASA Exoplanet Science Institute (Caltech/IPAC)", exoArchive, { publication: "NASA Exoplanet Archive", license: "Freely available; acknowledgement requested", source: "nasa", datasetIds: ["exoplanets"], notes: "Confirmed-planet parameters and discovery references." }),
  c("cite:hyg-database", "dataset", "HYG Stellar Database", "AstroNexus (D. Nash)", "https://github.com/astronexus/HYG-Database", { license: "CC BY-SA 2.5", source: "hyg", datasetIds: ["stars"], notes: "Compiled stellar catalogue (Hipparcos, Yale BSC, Gliese)." }),
  c("cite:openngc", "catalogue", "OpenNGC", "M. Verga (OpenNGC project)", "https://github.com/mattiaverga/OpenNGC", { license: "CC BY-SA 4.0", source: "openngc", datasetIds: ["deep-sky-objects", "galaxies", "nebulae"], notes: "Open NGC/IC deep-sky object catalogue." }),
  c("cite:simbad-database", "dataset", "SIMBAD Astronomical Database", "CDS, Université de Strasbourg / CNRS", simbad, { license: "CC BY 4.0 (CDS)", source: "simbad", datasetIds: ["stars"], notes: "Identifications, measurements, and bibliography for astronomical objects." }),
  c("cite:ned-database", "dataset", "NASA/IPAC Extragalactic Database (NED)", "NASA/IPAC (Caltech)", ned, { license: "Freely available; acknowledgement requested", source: "ned", datasetIds: ["galaxies"], notes: "Positions, redshifts, and cross-identifications for extragalactic objects." }),
  c("cite:gaia-archive", "dataset", "ESA Gaia Archive", "European Space Agency — Gaia DPAC", "https://gea.esac.esa.int/archive/", { license: "ESA / Gaia DPAC terms", source: "gaia", datasetIds: ["stars"], notes: "Astrometry, photometry, and parallaxes for ~2 billion stars." }),
  c("cite:minor-planet-center", "catalogue", "Minor Planet Center", "IAU Minor Planet Center (SAO)", "https://www.minorplanetcenter.net/", { source: "mpc", datasetIds: ["asteroids", "comets"], notes: "Orbits and designations for asteroids and comets." }),
  c("cite:iau-planet-definition-2006", "standards_reference", "IAU 2006 General Assembly — Definition of a Planet (Resolution B5)", "International Astronomical Union", "https://www.iau.org/", { date: "2006", license: "© IAU", source: "iau", entityIds: ["dwarf_planet:pluto"], provenanceIds: ["prov:dwarf_planet-pluto"], notes: "Established the 'dwarf planet' category under which Pluto is classified." }),
  c("cite:asteria-image-catalogue", "image_archive", "Asteria Star Scientific Image Catalogue", "Asteria Star", "https://asteriastar.com/images", { license: "Per-image upstream license (NASA/ESA/ESO)", datasetIds: ["deep-sky-objects"], notes: "Verified scientific images with per-image credit, source, and license." }),
  c("cite:nasa-ads", "archive_page", "NASA Astrophysics Data System (ADS)", "NASA / SAO — Astrophysics Data System", "https://ui.adsabs.harvard.edu/", { source: "ads", datasetIds: ["stars", "galaxies"], notes: "Digital library of astronomy and physics literature." }),
  c("cite:eso-organisation", "institutional_page", "European Southern Observatory", "European Southern Observatory", "https://www.eso.org/", { source: "eso", datasetIds: ["observatories", "telescopes"], notes: "Ground-based observatories including the VLT and (with partners) ALMA." }),

  /* ================================= MOON — Night Sky Provider Integration v1 */
  c("cite:usno-astronomical-applications", "institutional_page", "USNO Astronomical Applications Department", "United States Naval Observatory", "https://aa.usno.navy.mil/", { license: "Public domain (US Government work)", source: "usno", entityIds: ["moon:the-moon", "star:sun"], notes: "Approximate solar coordinates and phase/rise-set methodology; the public-domain solar formulae used by the computed Moon phase." }),
  c("cite:jpl-horizons", "archive_page", "JPL Horizons System", "NASA Jet Propulsion Laboratory (Caltech)", "https://ssd.jpl.nasa.gov/horizons/", { license: "Public domain (NASA/JPL-Caltech)", source: "jpl", entityIds: ["moon:the-moon"], notes: "Authoritative Solar System ephemerides — the reference standard for high-precision Moon position (not fetched in v1)." }),
  c("cite:nasa-moon", "institutional_page", "Earth's Moon — NASA Science", "NASA", "https://science.nasa.gov/moon/", { license: "Public domain (US Government work)", source: "nasa", entityIds: ["moon:the-moon"], provenanceIds: ["prov:moon-the-moon"], notes: "NASA overview of the Moon: phases, the synodic month, and lunar facts." }),

  /* ==================================== PEER-REVIEWED PAPERS (verified DOIs) */
  c("cite:planck-2018-cosmological-parameters", "peer_reviewed_paper", "Planck 2018 results. VI. Cosmological parameters", "ESA — Planck Collaboration", "https://doi.org/10.1051/0004-6361/201833910", { authors: ["Planck Collaboration"], publication: "Astronomy & Astrophysics 641, A6", doi: "10.1051/0004-6361/201833910", date: "2020", source: "planck", entityIds: ["cosmology_concept:the-big-bang", "cosmology_concept:cosmic-microwave-background", "cosmology_concept:hubble-constant", "cosmological_model:lambda-cdm"], provenanceIds: ["prov:cosmology_concept-the-big-bang", "prov:cosmology_concept-cosmic-microwave-background"], notes: "Cosmological parameters from the final Planck data release." }),
  c("cite:ligo-gw150914", "peer_reviewed_paper", "Observation of Gravitational Waves from a Binary Black Hole Merger", "LIGO Scientific Collaboration & Virgo Collaboration", "https://doi.org/10.1103/PhysRevLett.116.061102", { authors: ["B. P. Abbott et al. (LIGO Scientific Collaboration and Virgo Collaboration)"], publication: "Physical Review Letters 116, 061102", doi: "10.1103/PhysRevLett.116.061102", date: "2016", source: "ligo", entityIds: ["cosmology_concept:gravitational-waves", "observatory:ligo-hanford", "observatory:ligo-livingston"], provenanceIds: ["prov:cosmology_concept-gravitational-waves"], notes: "First direct detection of gravitational waves (event GW150914)." }),
  c("cite:ligo-gw170817", "peer_reviewed_paper", "GW170817: Observation of Gravitational Waves from a Binary Neutron Star Inspiral", "LIGO Scientific Collaboration & Virgo Collaboration", "https://doi.org/10.1103/PhysRevLett.119.161101", { authors: ["B. P. Abbott et al. (LIGO Scientific Collaboration and Virgo Collaboration)"], publication: "Physical Review Letters 119, 161101", doi: "10.1103/PhysRevLett.119.161101", date: "2017", source: "ligo", entityIds: ["cosmology_concept:gravitational-waves"], notes: "First gravitational-wave detection from a binary neutron-star merger." }),
  c("cite:eht-m87-2019", "peer_reviewed_paper", "First M87 Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole", "Event Horizon Telescope Collaboration", "https://doi.org/10.3847/2041-8213/ab0ec7", { authors: ["Event Horizon Telescope Collaboration"], publication: "The Astrophysical Journal Letters 875, L1", doi: "10.3847/2041-8213/ab0ec7", date: "2019", source: "eht", entityIds: ["galaxy:messier-87", "historical_discovery:first-black-hole-image"], provenanceIds: ["prov:galaxy-messier-87", "prov:historical_discovery-first-black-hole-image"], notes: "First direct image of a black hole's shadow, in the galaxy M87." }),
  c("cite:eht-sgra-2022", "peer_reviewed_paper", "First Sagittarius A* Event Horizon Telescope Results. I.", "Event Horizon Telescope Collaboration", "https://doi.org/10.3847/2041-8213/ac6674", { authors: ["Event Horizon Telescope Collaboration"], publication: "The Astrophysical Journal Letters 930, L12", doi: "10.3847/2041-8213/ac6674", date: "2022", source: "eht", entityIds: ["black_hole:sagittarius-a-star"], provenanceIds: ["prov:black_hole-sagittarius-a-star"], notes: "First image of the Milky Way's central black hole, Sagittarius A*." }),
  c("cite:mayor-queloz-1995", "peer_reviewed_paper", "A Jupiter-mass companion to a solar-type star", "Nature", "https://doi.org/10.1038/378355a0", { authors: ["Michel Mayor", "Didier Queloz"], publication: "Nature 378, 355–359", doi: "10.1038/378355a0", date: "1995", entityIds: ["exoplanet:51-pegasi-b"], provenanceIds: ["prov:exoplanet-51-pegasi-b"], notes: "Discovery of 51 Pegasi b, the first confirmed exoplanet around a Sun-like star." }),
  c("cite:charbonneau-2000", "peer_reviewed_paper", "Detection of Planetary Transits Across a Sun-like Star", "The Astrophysical Journal", "https://doi.org/10.1086/312457", { authors: ["David Charbonneau", "Timothy M. Brown", "David W. Latham", "Michel Mayor"], publication: "The Astrophysical Journal 529, L45", doi: "10.1086/312457", date: "2000", entityIds: ["exoplanet:hd-209458-b"], provenanceIds: ["prov:exoplanet-hd-209458-b"], notes: "First detection of an exoplanet transit (HD 209458 b)." }),
  c("cite:anglada-escude-2016", "peer_reviewed_paper", "A terrestrial planet candidate in a temperate orbit around Proxima Centauri", "Nature", "https://doi.org/10.1038/nature19106", { authors: ["Guillem Anglada-Escudé", "et al."], publication: "Nature 536, 437–440", doi: "10.1038/nature19106", date: "2016", entityIds: ["exoplanet:proxima-centauri-b"], provenanceIds: ["prov:exoplanet-proxima-centauri-b"], notes: "Discovery of Proxima Centauri b." }),
  c("cite:gillon-2017-trappist", "peer_reviewed_paper", "Seven temperate terrestrial planets around the nearby ultracool dwarf star TRAPPIST-1", "Nature", "https://doi.org/10.1038/nature21360", { authors: ["Michaël Gillon", "et al."], publication: "Nature 542, 456–460", doi: "10.1038/nature21360", date: "2017", entityIds: ["star:trappist-1", "exoplanet:trappist-1-e", "exoplanet:trappist-1-b", "exoplanet:trappist-1-d", "exoplanet:trappist-1-f", "exoplanet:trappist-1-g"], provenanceIds: ["prov:star-trappist-1", "prov:exoplanet-trappist-1-e"], notes: "The seven Earth-sized TRAPPIST-1 planets." }),
  c("cite:hubble-1929", "peer_reviewed_paper", "A relation between distance and radial velocity among extra-galactic nebulae", "Proceedings of the National Academy of Sciences", "https://doi.org/10.1073/pnas.15.3.168", { authors: ["Edwin Hubble"], publication: "PNAS 15 (3), 168–173", doi: "10.1073/pnas.15.3.168", date: "1929", entityIds: ["astronomer:edwin-hubble", "cosmology_concept:cosmic-expansion", "cosmology_concept:hubble-lemaitre-law"], provenanceIds: ["prov:astronomer-edwin-hubble", "prov:cosmology_concept-cosmic-expansion"], notes: "The velocity–distance relation (Hubble's law)." }),
  c("cite:penzias-wilson-1965", "peer_reviewed_paper", "A Measurement of Excess Antenna Temperature at 4080 Mc/s", "The Astrophysical Journal", "https://doi.org/10.1086/148307", { authors: ["Arno A. Penzias", "Robert W. Wilson"], publication: "The Astrophysical Journal 142, 419–421", doi: "10.1086/148307", date: "1965", entityIds: ["cosmology_concept:cosmic-microwave-background"], provenanceIds: ["prov:cosmology_concept-cosmic-microwave-background"], notes: "Discovery of the cosmic microwave background." }),
  c("cite:riess-1998", "peer_reviewed_paper", "Observational Evidence from Supernovae for an Accelerating Universe and a Cosmological Constant", "The Astronomical Journal", "https://doi.org/10.1086/300499", { authors: ["Adam G. Riess", "et al."], publication: "The Astronomical Journal 116, 1009–1038", doi: "10.1086/300499", date: "1998", entityIds: ["cosmology_concept:dark-energy", "cosmology_concept:cosmological-constant"], provenanceIds: ["prov:cosmology_concept-dark-energy"], notes: "Evidence for accelerating cosmic expansion (High-z Supernova Search Team)." }),
  c("cite:perlmutter-1999", "peer_reviewed_paper", "Measurements of Omega and Lambda from 42 High-Redshift Supernovae", "The Astrophysical Journal", "https://doi.org/10.1086/307221", { authors: ["Saul Perlmutter", "et al."], publication: "The Astrophysical Journal 517, 565–586", doi: "10.1086/307221", date: "1999", entityIds: ["cosmology_concept:dark-energy"], provenanceIds: ["prov:cosmology_concept-dark-energy"], notes: "Supernova Cosmology Project evidence for dark energy." }),
  c("cite:rubin-ford-1970", "peer_reviewed_paper", "Rotation of the Andromeda Nebula from a Spectroscopic Survey of Emission Regions", "The Astrophysical Journal", "https://doi.org/10.1086/150317", { authors: ["Vera C. Rubin", "W. Kent Ford Jr."], publication: "The Astrophysical Journal 159, 379", doi: "10.1086/150317", date: "1970", entityIds: ["astronomer:vera-rubin", "cosmology_concept:dark-matter", "galaxy:andromeda-galaxy"], provenanceIds: ["prov:astronomer-vera-rubin"], notes: "Andromeda rotation curve — evidence for dark matter." }),
  c("cite:hewish-1968", "peer_reviewed_paper", "Observation of a Rapidly Pulsating Radio Source", "Nature", "https://doi.org/10.1038/217709a0", { authors: ["A. Hewish", "S. J. Bell", "J. D. H. Pilkington", "P. F. Scott", "R. A. Collins"], publication: "Nature 217, 709–713", doi: "10.1038/217709a0", date: "1968", entityIds: ["astronomer:jocelyn-bell-burnell"], provenanceIds: ["prov:astronomer-jocelyn-bell-burnell"], notes: "Discovery of the first radio pulsars." }),

  /* ================================================== NOBEL PRIZE REFERENCES */
  c("cite:nobel-physics-2019", "historical_reference", "The Nobel Prize in Physics 2019", "The Nobel Prize", nobel("2019"), { date: "2019", source: "nobel", entityIds: ["exoplanet:51-pegasi-b", "cosmology_concept:the-big-bang"], notes: "Peebles (physical cosmology); Mayor & Queloz (first exoplanet around a Sun-like star)." }),
  c("cite:nobel-physics-2020", "historical_reference", "The Nobel Prize in Physics 2020", "The Nobel Prize", nobel("2020"), { date: "2020", source: "nobel", entityIds: ["black_hole:sagittarius-a-star"], provenanceIds: ["prov:black_hole-sagittarius-a-star"], notes: "Penrose; Genzel & Ghez (supermassive compact object at the Galactic centre)." }),
  c("cite:nobel-physics-2017", "historical_reference", "The Nobel Prize in Physics 2017", "The Nobel Prize", nobel("2017"), { date: "2017", source: "nobel", entityIds: ["cosmology_concept:gravitational-waves"], notes: "Weiss, Barish & Thorne (LIGO detector and gravitational waves)." }),
  c("cite:nobel-physics-2011", "historical_reference", "The Nobel Prize in Physics 2011", "The Nobel Prize", nobel("2011"), { date: "2011", source: "nobel", entityIds: ["cosmology_concept:dark-energy"], provenanceIds: ["prov:cosmology_concept-dark-energy"], notes: "Perlmutter, Schmidt & Riess (accelerating expansion of the universe)." }),
  c("cite:nobel-physics-1983", "historical_reference", "The Nobel Prize in Physics 1983", "The Nobel Prize", nobel("1983"), { date: "1983", source: "nobel", entityIds: ["astronomer:subrahmanyan-chandrasekhar"], notes: "Chandrasekhar (structure and evolution of the stars)." }),
  c("cite:nobel-physics-1978", "historical_reference", "The Nobel Prize in Physics 1978", "The Nobel Prize", nobel("1978"), { date: "1978", source: "nobel", entityIds: ["cosmology_concept:cosmic-microwave-background"], provenanceIds: ["prov:cosmology_concept-cosmic-microwave-background"], notes: "Penzias & Wilson (cosmic microwave background radiation)." }),

  /* =========================================================== SOLAR SYSTEM */
  ...solarSystem(),
  /* ================================================================= STARS */
  ...stars(),
  /* ============================================================ EXOPLANETS */
  ...exoplanets(),
  /* ============================================================== DEEP SKY */
  ...deepSky(),
  /* ============================================================= COSMOLOGY */
  ...cosmology(),
  ...moreCosmology(),
  /* ============================================== OBSERVATORIES / TELESCOPES */
  ...observatories(),
  /* =============================================================== HISTORY */
  ...history(),
];

/* ------------------------------------------------------------ record blocks */
function factSheet(entityId: string, name: string): Citation {
  return c(`cite:nasa-${slug(entityId)}`, "institutional_page", `${name} — NASA Solar System Exploration`, "NASA", `${nasaSci}`, { license: PUB_US_GOV, source: "nasa", entityIds: [entityId], provenanceIds: [prov(entityId)], notes: `NASA overview of ${name}.` });
}
function bodyFactSheet(entityId: string, name: string, file: string): Citation {
  return c(`cite:factsheet-${slug(entityId)}`, "dataset", `${name} Fact Sheet`, "NASA Goddard — NSSDCA", `${factsheet}${file}`, { license: PUB_US_GOV, source: "nasa", entityIds: [entityId], datasetIds: solarDataset(entityId), provenanceIds: [prov(entityId)], notes: `Physical and orbital parameters for ${name}.` });
}
function slug(entityId: string): string { return entityId.replace(":", "-"); }
function prov(entityId: string): string { return `prov:${entityId.replace(":", "-")}`; }
function solarDataset(entityId: string): string[] {
  if (entityId.startsWith("planet:")) return ["planets"];
  if (entityId.startsWith("moon:")) return ["moons"];
  if (entityId.startsWith("dwarf_planet:")) return ["dwarf-planets"];
  if (entityId.startsWith("asteroid:")) return ["asteroids"];
  if (entityId.startsWith("comet:")) return ["comets"];
  return [];
}

function solarSystem(): Citation[] {
  const planets: [string, string, string][] = [
    ["star:sun", "Sun", ""], ["planet:mercury", "Mercury", "mercuryfact.html"], ["planet:venus", "Venus", "venusfact.html"],
    ["planet:earth", "Earth", "earthfact.html"], ["moon:the-moon", "Moon", "moonfact.html"], ["planet:mars", "Mars", "marsfact.html"],
    ["planet:jupiter", "Jupiter", "jupiterfact.html"], ["planet:saturn", "Saturn", "saturnfact.html"], ["planet:uranus", "Uranus", "uranusfact.html"],
    ["planet:neptune", "Neptune", "neptunefact.html"], ["dwarf_planet:pluto", "Pluto", "plutofact.html"],
  ];
  const out: Citation[] = [];
  for (const [id, name, file] of planets) {
    if (file) out.push(bodyFactSheet(id, name, file));
    out.push(factSheet(id, name));
  }
  // Major moons + small bodies: NASA overview + JPL, no fact-sheet file.
  const moons: [string, string][] = [["moon:europa", "Europa"], ["moon:titan", "Titan"], ["moon:enceladus", "Enceladus"], ["moon:ganymede", "Ganymede"]];
  for (const [id, name] of moons) out.push(factSheet(id, name));
  const smallBodies: [string, string, string[]][] = [
    ["dwarf_planet:ceres", "Ceres", ["dwarf-planets"]], ["asteroid:vesta", "4 Vesta", ["asteroids"]],
    ["asteroid:bennu", "101955 Bennu", ["asteroids"]], ["comet:halleys-comet", "Halley's Comet", ["comets"]],
  ];
  for (const [id, name, ds] of smallBodies) {
    out.push(c(`cite:nasa-${slug(id)}`, "institutional_page", `${name} — NASA Science`, "NASA", nasaSci, { license: PUB_US_GOV, source: "nasa", entityIds: [id], datasetIds: ds, notes: `NASA overview of ${name}.` }));
    out.push(c(`cite:jpl-${slug(id)}`, "archive_page", `${name} — JPL Small-Body Database`, "NASA JPL (Caltech)", "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html", { license: "Public domain (NASA/JPL-Caltech)", source: "jpl", entityIds: [id], datasetIds: ds, notes: `Orbit and physical data for ${name}.` }));
  }
  return out;
}

function starDb(entityId: string, name: string, extra: Partial<Citation> = {}): Citation[] {
  const p = prov(entityId);
  return [
    c(`cite:simbad-${slug(entityId)}`, "archive_page", `SIMBAD entry: ${name}`, "CDS — SIMBAD", simbad, { source: "simbad", entityIds: [entityId], datasetIds: ["stars"], provenanceIds: [p], notes: `SIMBAD identifications and measurements for ${name}.`, ...extra }),
    c(`cite:gaia-${slug(entityId)}`, "archive_page", `${name} — ESA Gaia astrometry`, "ESA — Gaia DPAC", "https://gea.esac.esa.int/archive/", { source: "gaia", entityIds: [entityId], datasetIds: ["stars"], provenanceIds: [p], notes: `Gaia parallax and photometry for ${name}.` }),
  ];
}
function stars(): Citation[] {
  const list: [string, string][] = [
    ["star:sirius", "Sirius (α CMa)"], ["star:betelgeuse", "Betelgeuse (α Ori)"], ["star:rigel", "Rigel (β Ori)"],
    ["star:vega", "Vega (α Lyr)"], ["star:polaris", "Polaris (α UMi)"], ["star:proxima-centauri", "Proxima Centauri"],
    ["star:alpha-centauri", "Alpha Centauri"], ["star:trappist-1", "TRAPPIST-1"],
  ];
  return list.flatMap(([id, name]) => starDb(id, name));
}

function exoRecord(entityId: string, name: string): Citation {
  return c(`cite:exoarchive-${slug(entityId)}`, "archive_page", `${name} — NASA Exoplanet Archive`, "NASA Exoplanet Science Institute (Caltech/IPAC)", exoArchive, { license: "Freely available; acknowledgement requested", source: "nasa", entityIds: [entityId], datasetIds: ["exoplanets"], notes: `Confirmed parameters and discovery references for ${name}.` });
}
function exoplanets(): Citation[] {
  const list: [string, string][] = [
    ["exoplanet:proxima-centauri-b", "Proxima Centauri b"], ["exoplanet:trappist-1-e", "TRAPPIST-1 e"], ["exoplanet:trappist-1-b", "TRAPPIST-1 b"],
    ["exoplanet:trappist-1-d", "TRAPPIST-1 d"], ["exoplanet:trappist-1-f", "TRAPPIST-1 f"], ["exoplanet:trappist-1-g", "TRAPPIST-1 g"],
    ["exoplanet:51-pegasi-b", "51 Pegasi b"], ["exoplanet:hd-209458-b", "HD 209458 b"], ["exoplanet:k2-18-b", "K2-18 b"],
    ["exoplanet:kepler-452-b", "Kepler-452 b"], ["exoplanet:hr-8799-b", "HR 8799 b"],
  ];
  const out = list.map(([id, name]) => exoRecord(id, name));
  // K2-18 b gets a NASA release too (contested biosignature context stays honest elsewhere).
  out.push(c("cite:nasa-k2-18b", "press_release", "NASA — Webb studies of K2-18 b", "NASA", nasaSci, { license: PUB_US_GOV, source: "nasa", entityIds: ["exoplanet:k2-18-b"], provenanceIds: ["prov:exoplanet-k2-18-b"], notes: "Atmospheric studies; biosignature claims remain contested and are not asserted." }));
  return out;
}

function deepSky(): Citation[] {
  const nedList: [string, string][] = [
    ["galaxy:andromeda-galaxy", "Andromeda Galaxy (M31)"], ["galaxy:messier-87", "Messier 87"], ["galaxy:sombrero-galaxy", "Sombrero Galaxy (M104)"],
    ["galaxy:whirlpool-galaxy", "Whirlpool Galaxy (M51)"], ["galaxy:triangulum-galaxy", "Triangulum Galaxy (M33)"],
  ];
  const stsciList: [string, string][] = [
    ["nebula:orion-nebula", "Orion Nebula (M42)"], ["nebula:eagle-nebula", "Eagle Nebula (M16)"], ["nebula:crab-nebula", "Crab Nebula (M1)"],
    ["nebula:ring-nebula", "Ring Nebula (M57)"], ["nebula:lagoon-nebula", "Lagoon Nebula (M8)"], ["star_cluster:pleiades", "The Pleiades (M45)"],
  ];
  const out: Citation[] = [];
  for (const [id, name] of nedList) {
    out.push(c(`cite:ned-${slug(id)}`, "archive_page", `${name} — NASA/IPAC Extragalactic Database`, "NASA/IPAC (Caltech)", ned, { source: "ned", entityIds: [id], datasetIds: ["galaxies", "deep-sky-objects"], provenanceIds: hasProv(id), notes: `Positions, redshift, and cross-identifications for ${name}.` }));
  }
  for (const [id, name] of stsciList) {
    out.push(c(`cite:stsci-${slug(id)}`, "image_archive", `${name} — HubbleSite / STScI`, "Space Telescope Science Institute", "https://www.stsci.edu/", { source: "stsci", entityIds: [id], datasetIds: ["nebulae", "deep-sky-objects"], provenanceIds: hasProv(id), notes: `STScI imagery and science for ${name}.` }));
  }
  // Sagittarius A* — ESO Galactic-centre programme + EHT (paper cited above).
  out.push(c("cite:eso-sagittarius-a-star", "institutional_page", "The Galactic Centre black hole — ESO", "European Southern Observatory", "https://www.eso.org/", { source: "eso", entityIds: ["black_hole:sagittarius-a-star"], provenanceIds: ["prov:black_hole-sagittarius-a-star"], notes: "Stellar-orbit monitoring of Sagittarius A* (2020 Nobel Prize)." }));
  return out;
}
function hasProv(entityId: string): string[] {
  const withProv = new Set(["galaxy:andromeda-galaxy", "galaxy:messier-87", "galaxy:sombrero-galaxy", "nebula:orion-nebula", "nebula:eagle-nebula", "nebula:crab-nebula"]);
  return withProv.has(entityId) ? [prov(entityId)] : [];
}

function cosmology(): Citation[] {
  const list: [string, string, string][] = [
    ["cosmology_concept:the-big-bang", "The Big Bang", "big-bang"], ["cosmology_concept:cosmic-microwave-background", "Cosmic Microwave Background", "cmb"],
    ["cosmology_concept:dark-matter", "Dark Matter", "dark-matter"], ["cosmology_concept:dark-energy", "Dark Energy", "dark-energy"],
    ["cosmology_concept:cosmic-expansion", "The Expanding Universe", "expansion"], ["cosmology_concept:gravitational-waves", "Gravitational Waves", "gw"],
    ["cosmology_concept:hubble-constant", "The Hubble Constant", "hubble-constant"], ["cosmological_model:lambda-cdm", "The Lambda-CDM Model", "lcdm"],
  ];
  const out: Citation[] = [];
  for (const [id, name] of list) {
    out.push(c(`cite:nasa-cosmo-${slugName(name)}`, "institutional_page", `${name} — NASA Universe`, "NASA", nasaSci, { license: PUB_US_GOV, source: "nasa", entityIds: [id], provenanceIds: hasProvCosmo(id), notes: `NASA science overview: ${name}.` }));
  }
  // Planck / ESA overview for the CMB + parameters (paper cited above).
  out.push(c("cite:esa-planck", "mission_page", "Planck — ESA Science", "European Space Agency", "https://www.esa.int/Science_Exploration/Space_Science/Planck", { source: "planck", entityIds: ["cosmology_concept:cosmic-microwave-background", "cosmology_concept:hubble-constant"], provenanceIds: ["prov:cosmology_concept-cosmic-microwave-background"], notes: "ESA Planck mission — high-precision CMB maps." }));
  return out;
}
function hasProvCosmo(id: string): string[] {
  const withProv = new Set(["cosmology_concept:the-big-bang", "cosmology_concept:cosmic-microwave-background", "cosmology_concept:dark-matter", "cosmology_concept:dark-energy", "cosmology_concept:cosmic-expansion", "cosmology_concept:gravitational-waves"]);
  return withProv.has(id) ? [prov(id)] : [];
}
function slugName(name: string): string { return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function moreCosmology(): Citation[] {
  const list: [string, string][] = [
    ["cosmology_concept:cosmic-inflation", "Cosmic Inflation"],
    ["cosmology_concept:big-bang-nucleosynthesis", "Big Bang Nucleosynthesis"],
    ["cosmology_concept:redshift", "Cosmological Redshift"],
    ["cosmology_concept:hubble-lemaitre-law", "The Hubble–Lemaître Law"],
    ["cosmology_concept:cosmological-constant", "The Cosmological Constant"],
    ["cosmology_concept:baryon-acoustic-oscillations", "Baryon Acoustic Oscillations"],
    ["cosmology_concept:large-scale-structure", "Large-Scale Structure"],
    ["cosmology_concept:age-of-the-universe", "The Age of the Universe"],
  ];
  return list.map(([id, name]) =>
    c(`cite:nasa-cosmo-${slugName(name)}`, "institutional_page", `${name} — NASA Universe`, "NASA", nasaSci, { license: PUB_US_GOV, source: "nasa", entityIds: [id], notes: `NASA science overview: ${name}.` }),
  );
}

function observatories(): Citation[] {
  const list: [string, string, string, string, import("@/lib/citations").Citation["source"]][] = [
    ["space_telescope:hubble-space-telescope", "Hubble Space Telescope", "mission_page", "https://science.nasa.gov/mission/hubble/", "stsci"],
    ["space_telescope:james-webb-space-telescope", "James Webb Space Telescope", "mission_page", "https://science.nasa.gov/mission/webb/", "stsci"],
    ["space_telescope:chandra-x-ray-observatory", "Chandra X-ray Observatory", "mission_page", "https://chandra.harvard.edu/", "nasa"],
    ["space_telescope:spitzer-space-telescope", "Spitzer Space Telescope", "mission_page", "https://www.spitzer.caltech.edu/", "nasa"],
    ["space_telescope:kepler-space-telescope", "Kepler Space Telescope", "mission_page", "https://science.nasa.gov/mission/kepler/", "nasa"],
    ["space_telescope:tess", "TESS", "mission_page", "https://science.nasa.gov/mission/tess/", "nasa"],
    ["space_telescope:gaia", "Gaia", "mission_page", "https://www.esa.int/Science_Exploration/Space_Science/Gaia", "gaia"],
    ["observatory:alma", "ALMA", "institutional_page", "https://www.almaobservatory.org/", "eso"],
    ["observatory:ligo-hanford", "LIGO", "institutional_page", "https://www.ligo.caltech.edu/", "ligo"],
    ["observational_program:event-horizon-telescope", "Event Horizon Telescope", "institutional_page", "https://eventhorizontelescope.org/", "eht"],
  ];
  const out: Citation[] = [];
  for (const [id, name, type, url, source] of list) {
    out.push(c(`cite:obs-${slug(id)}`, type as CitationType, `${name}`, orgFor(source), url, { source, entityIds: [id], provenanceIds: hasProvObs(id), notes: `Official page for ${name}.`, ...(source === "nasa" || url.includes("nasa.gov") ? { license: PUB_US_GOV } : {}) }));
  }
  // Missions with NASA pages
  const missions: [string, string, string][] = [
    ["space_mission:voyager-1", "Voyager 1", "https://science.nasa.gov/mission/voyager/"],
    ["space_mission:voyager-2", "Voyager 2", "https://science.nasa.gov/mission/voyager/"],
    ["space_mission:cassini-huygens", "Cassini–Huygens", "https://science.nasa.gov/mission/cassini/"],
    ["space_mission:juno", "Juno", "https://science.nasa.gov/mission/juno/"],
    ["space_mission:new-horizons", "New Horizons", "https://science.nasa.gov/mission/new-horizons/"],
    ["space_mission:apollo-11", "Apollo 11", "https://www.nasa.gov/mission/apollo-11/"],
    ["spacecraft:perseverance", "Perseverance (Mars 2020)", "https://science.nasa.gov/mission/mars-2020-perseverance/"],
  ];
  for (const [id, name, url] of missions) {
    out.push(c(`cite:mission-${slug(id)}`, "mission_page", `${name} — NASA`, "NASA", url, { license: PUB_US_GOV, source: "nasa", entityIds: [id], provenanceIds: [prov(id)], notes: `NASA mission page for ${name}.` }));
  }
  return out;
}
function orgFor(source: import("@/lib/citations").Citation["source"]): string {
  const m: Record<string, string> = { stsci: "NASA / STScI", nasa: "NASA", esa: "European Space Agency", gaia: "European Space Agency", eso: "European Southern Observatory", ligo: "LIGO Laboratory (Caltech/MIT)", eht: "Event Horizon Telescope Collaboration" };
  return (source && m[source]) || "NASA";
}
function hasProvObs(id: string): string[] {
  const withProv = new Set(["space_telescope:hubble-space-telescope", "space_telescope:james-webb-space-telescope"]);
  return withProv.has(id) ? [prov(id)] : [];
}

function history(): Citation[] {
  // Encyclopaedia Britannica biography pages (secondary source) follow the
  // stable /biography/<Name> pattern.
  const brit: [string, string, string][] = [
    ["astronomer:galileo-galilei", "Galileo Galilei", "Galileo-Galilei"],
    ["astronomer:isaac-newton", "Isaac Newton", "Isaac-Newton"],
    ["astronomer:edwin-hubble", "Edwin Hubble", "Edwin-Hubble"],
    ["astronomer:vera-rubin", "Vera Rubin", "Vera-Rubin"],
    ["astronomer:henrietta-leavitt", "Henrietta Swan Leavitt", "Henrietta-Swan-Leavitt"],
    ["astronomer:georges-lemaitre", "Georges Lemaître", "Georges-Lemaitre"],
    ["astronomer:subrahmanyan-chandrasekhar", "Subrahmanyan Chandrasekhar", "Subrahmanyan-Chandrasekhar"],
    ["astronomer:jocelyn-bell-burnell", "Jocelyn Bell Burnell", "Jocelyn-Bell-Burnell"],
    ["astronomer:johannes-kepler", "Johannes Kepler", "Johannes-Kepler"],
    ["astronomer:edmond-halley", "Edmond Halley", "Edmond-Halley"],
  ];
  return brit.map(([id, name, bslug]) =>
    c(`cite:britannica-${slug(id)}`, "historical_reference", `${name} — Encyclopaedia Britannica`, "Encyclopaedia Britannica", `https://www.britannica.com/biography/${bslug}`, { source: "britannica", entityIds: [id], provenanceIds: hasProvHist(id), notes: `Biographical and background reference for ${name} (secondary source).` }),
  );
}
function hasProvHist(id: string): string[] {
  const withProv = new Set(["astronomer:galileo-galilei", "astronomer:isaac-newton", "astronomer:edwin-hubble", "astronomer:vera-rubin", "astronomer:jocelyn-bell-burnell"]);
  return withProv.has(id) ? [prov(id)] : [];
}
