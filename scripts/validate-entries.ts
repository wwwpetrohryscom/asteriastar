/**
 * Entry registry + knowledge graph quality gate (run with `npm run validate`).
 *
 * Both the registry and the graph self-validate at import time and throw on any
 * violation, so a load failure here means the data is invalid. This script
 * surfaces the issues readably and prints a summary of the boundary invariants.
 *
 * Entry checks (enforced in validateEntries()):
 *  - section/category existence, duplicate slugs / canonical URLs
 *  - duplicate SEO titles and descriptions
 *  - science/historical/tool entries declare source slots
 *  - interpretive entries carry the disclaimer; factual ones never do
 *  - related entries/categories resolve (no broken internal links)
 *  - non-thin content (>= 3 body sections) and no lorem ipsum
 *  - graph-linked entries point to existing entities/relations
 *
 * Graph checks (enforced in validateGraph()):
 *  - no duplicate entity/relation ids; relation endpoints exist
 *  - valid domains/confidences
 *  - astrology relations are never science; interpretive links are never
 *    confirmed science
 */

async function main() {
  let reg: typeof import("../src/content/entries");
  let graph: typeof import("../src/knowledge-graph");
  try {
    graph = await import("../src/knowledge-graph");
    reg = await import("../src/content/entries");
  } catch (error) {
    console.error("\n✗ Registry/graph failed to load (validation threw):\n");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  // Knowledge graph.
  const graphIssues = graph.validateGraph(graph.entities, graph.relations);
  if (graphIssues.length > 0) {
    console.error(`\n✗ ${graphIssues.length} knowledge-graph issue(s):\n`);
    for (const issue of graphIssues) console.error(`  • ${issue}`);
    process.exit(1);
  }
  const astrologyAsScience = graph.relations.filter(
    (r) => r.type === "astrologically_associated_with" && r.domain !== "astrology",
  );
  if (astrologyAsScience.length > 0) {
    console.error("\n✗ astrology relations marked as non-astrology — boundary violated");
    process.exit(1);
  }

  // Image registry (Observatory image platform).
  const media = await import("../src/lib/media/registry");
  const imageIssues = media.validateImages();
  if (imageIssues.length > 0) {
    console.error(`\n✗ ${imageIssues.length} image issue(s):`);
    for (const i of imageIssues) console.error(`  • ${i}`);
    process.exit(1);
  }

  // Community architecture (reference integrity; no user data exists yet).
  const community = await import("../src/lib/community");
  const communityIssues = community.validateCommunity(community.COMMUNITY_DATA);
  if (communityIssues.length > 0) {
    console.error(`\n✗ ${communityIssues.length} community issue(s):`);
    for (const i of communityIssues) console.error(`  • ${i}`);
    process.exit(1);
  }

  // Open data: graph version, dataset integrity, citations.
  const openIssues: string[] = [];
  const v = graph.GRAPH_VERSION_INFO;
  for (const key of ["graphVersion", "schemaVersion", "datasetVersion"] as const) {
    if (!v[key]) openIssues.push(`graph version metadata missing: ${key}`);
  }
  const datasets = await import("../src/lib/datasets");
  const seenSlugs = new Set<string>();
  for (const d of datasets.DATASETS) {
    if (seenSlugs.has(d.slug)) openIssues.push(`duplicate dataset slug: ${d.slug}`);
    seenSlugs.add(d.slug);
    // Dataset integrity: declared count must match a fresh recomputation.
    const recomputed = datasets.getDatasetEntities(d).length;
    if (recomputed !== d.entityCount) {
      openIssues.push(`dataset ${d.slug}: entityCount ${d.entityCount} != recomputed ${recomputed}`);
    }
  }
  const citations = await import("../src/lib/citations");
  openIssues.push(...citations.validateCitations());
  // Open Data & Scientific APIs platform (Program L): envelope, catalogue,
  // licenses, endpoint registry, OpenAPI, and export-manifest integrity — plus
  // the anti-fabrication invariants (no fake checksums, no planned endpoints in
  // the spec, read-only, real record counts).
  const openData = await import("../src/platform/open-data");
  openIssues.push(...openData.validateOpenData());
  if (openIssues.length > 0) {
    console.error(`\n✗ ${openIssues.length} open-data issue(s):`);
    for (const i of openIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Open data valid — ${openData.CATALOGUE_STATS.total} datasets, ${openData.IMPLEMENTED_ENDPOINTS.length} API endpoints, ${Object.keys(openData.EXPORT_MANIFEST.exports).length} checksummed exports`,
  );

  // Scientific contributions & review workflow (Program M): state machine, roles,
  // impact/notification/security models, changesets, and graph-reference integrity
  // for every proposal — plus the anti-fabrication invariant (all live registries
  // are empty: no fake contributors, reviews, or approval history).
  const contributions = await import("../src/platform/contributions");
  const contribIssues = contributions.validateContributionArchitecture();
  if (contribIssues.length > 0) {
    console.error(`\n✗ ${contribIssues.length} contributions issue(s):`);
    for (const i of contribIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  const cs = contributions.contributionsEngine.stats;
  console.log(
    `✓ Contributions valid — ${cs.types} types, ${cs.states} states, ${cs.roles} roles, ${cs.changeKinds} change kinds · ${cs.proposals} proposals / ${cs.reviewNotes} reviews / ${cs.auditEntries} audit entries (no fabricated data)`,
  );

  // Platform core: registries, localization readiness, extensions, components,
  // search core, and layer-model consistency.
  const platform = await import("../src/platform");
  const platformIssues = platform.validatePlatform();
  if (platformIssues.length > 0) {
    console.error(`\n✗ ${platformIssues.length} platform issue(s):`);
    for (const i of platformIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Platform core valid — ${platform.LAYERS.length} layers, ${platform.REGISTRIES.length} registries, ${platform.LOCALES.length} locales, ${platform.COMPONENT_STATS.total} components`,
  );

  // Scientific Data Engine: query/traversal/entity-resolver self-checks.
  const dataEngine = await import("../src/platform/data-engine");
  const engineIssues = dataEngine.engine.validation.engine();
  if (engineIssues.length > 0) {
    console.error(`\n✗ ${engineIssues.length} data-engine issue(s):`);
    for (const i of engineIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Data engine valid — ${dataEngine.ENGINE_MODULES.length} modules, ${dataEngine.QUERIES.length} queries`,
  );

  // Star catalogue: real catalogue data integrity.
  const starCatalog = await import("../src/knowledge-graph/data/star-catalog");
  const starIssues = starCatalog.validateStarCatalog();
  if (starIssues.length > 0) {
    console.error(`\n✗ ${starIssues.length} star-catalog issue(s):`);
    for (const i of starIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Star catalogue valid — ${starCatalog.STAR_STATS.stars} stars, ${starCatalog.STAR_STATS.constellationsCreated} new constellations, ${starCatalog.STAR_STATS.relations} relations`,
  );

  // Solar System catalogue.
  const solarCatalog = await import("../src/knowledge-graph/data/solar-system-catalog");
  const solarIssues = solarCatalog.validateSolarSystem();
  if (solarIssues.length > 0) {
    console.error(`\n✗ ${solarIssues.length} solar-system issue(s):`);
    for (const i of solarIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Solar System valid — ${solarCatalog.SOLAR_SYSTEM_STATS.bodies} bodies, ${solarCatalog.SOLAR_SYSTEM_STATS.newEntities} new entities, ${solarCatalog.SOLAR_SYSTEM_STATS.relations} relations`,
  );

  const deepSky = await import("../src/knowledge-graph/data/deep-sky-catalog");
  const dsIssues = deepSky.validateDeepSky();
  if (dsIssues.length > 0) {
    console.error(`\n✗ ${dsIssues.length} deep-sky issue(s):`);
    for (const i of dsIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Deep Sky valid — ${deepSky.DEEP_SKY_STATS.objects} objects, ${deepSky.DEEP_SKY_STATS.newEntities} new entities, ${deepSky.DEEP_SKY_STATS.messier} Messier, ${deepSky.DEEP_SKY_STATS.caldwell} Caldwell`,
  );

  const exploration = await import("../src/knowledge-graph/data/exploration-catalog");
  const expIssues = exploration.validateExploration();
  if (expIssues.length > 0) {
    console.error(`\n✗ ${expIssues.length} exploration issue(s):`);
    for (const i of expIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Exploration valid — ${exploration.EXPLORATION_STATS.records} records, ${exploration.EXPLORATION_STATS.newEntities} new entities, ${exploration.EXPLORATION_STATS.missions} missions`,
  );

  const rockets = await import("../src/knowledge-graph/data/rockets-catalog");
  const rocketIssues = rockets.validateRockets();
  if (rocketIssues.length > 0) {
    console.error(`\n✗ ${rocketIssues.length} rockets issue(s):`);
    for (const i of rocketIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Rockets & Launch Vehicles valid — ${rockets.ROCKETS_STATS.records} records, ${rockets.ROCKETS_STATS.newEntities} new entities, ${rockets.ROCKETS_STATS.launchVehicles} launch vehicles, ${rockets.ROCKETS_STATS.families} families, ${rockets.ROCKETS_STATS.engines} engines, ${rockets.ROCKETS_STATS.relations} relations (no fabricated specs)`,
  );

  const constellations = await import("../src/knowledge-graph/data/constellations-catalog");
  const constellationIssues = constellations.validateConstellations();
  // Object/star resolution: every curated brightest-star id must resolve to a real
  // graph entity (this runs in the gate, where the assembled graph is available).
  const { getEntityById: getEnt } = await import("../src/knowledge-graph");
  for (const c of constellations.CONSTELLATION_RECORDS) {
    if (c.brightestStarId && !getEnt(c.brightestStarId)) constellationIssues.push(`${c.id}: brightestStarId does not resolve: ${c.brightestStarId}`);
  }
  if (constellationIssues.length > 0) {
    console.error(`\n✗ ${constellationIssues.length} constellation issue(s):`);
    for (const i of constellationIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Constellations valid — all ${constellations.CONSTELLATIONS_STATS.constellations} IAU constellations (${constellations.CONSTELLATIONS_STATS.withArea} with official area, ${constellations.CONSTELLATIONS_STATS.zodiac} zodiac), ${constellations.CONSTELLATIONS_STATS.families} families, ${constellations.CONSTELLATIONS_STATS.asterisms} asterisms, ${constellations.CONSTELLATIONS_STATS.seasons} seasonal skies · ${constellations.CONSTELLATIONS_STATS.newEntities} new entities, ${constellations.CONSTELLATIONS_STATS.relations} relations (reused stars/objects/showers; no fabricated data)`,
  );

  const satellites = await import("../src/knowledge-graph/data/satellites-catalog");
  const satelliteIssues = satellites.validateSatellites();
  // Cross-reference resolution: every relation endpoint the catalog emits must
  // resolve to a real graph entity (this runs in the gate, where the assembled
  // graph is available) — catches reused rockets/sites/agencies that don't exist.
  const { getEntityById: getSatEnt } = await import("../src/knowledge-graph");
  for (const r of satellites.relations) {
    if (!getSatEnt(r.from)) satelliteIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getSatEnt(r.to)) satelliteIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (satelliteIssues.length > 0) {
    console.error(`\n✗ ${satelliteIssues.length} satellite issue(s):`);
    for (const i of satelliteIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Satellites valid — ${satellites.SATELLITES_STATS.satellites} satellites, ${satellites.SATELLITES_STATS.constellations} constellations, ${satellites.SATELLITES_STATS.orbits} orbit types, ${satellites.SATELLITES_STATS.operators} operators, ${satellites.SATELLITES_STATS.networks} tracking networks · ${satellites.SATELLITES_STATS.newEntities} new entities, ${satellites.SATELLITES_STATS.relations} relations (reused agencies/rockets/sites; no fabricated specs)`,
  );

  const asteroids = await import("../src/knowledge-graph/data/asteroids-catalog");
  const asteroidIssues = asteroids.validateAsteroids();
  // Cross-reference resolution: every relation endpoint the catalog emits must
  // resolve to a real graph entity (reused missions, planets, the Sun, dwarf planets).
  const { getEntityById: getAstEnt } = await import("../src/knowledge-graph");
  for (const r of asteroids.relations) {
    if (!getAstEnt(r.from)) asteroidIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getAstEnt(r.to)) asteroidIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (asteroidIssues.length > 0) {
    console.error(`\n✗ ${asteroidIssues.length} asteroid issue(s):`);
    for (const i of asteroidIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Asteroids valid — ${asteroids.ASTEROIDS_STATS.asteroids} minor planets, ${asteroids.ASTEROIDS_STATS.families} families, ${asteroids.ASTEROIDS_STATS.groups} groups, ${asteroids.ASTEROIDS_STATS.neoClasses} NEO classes, ${asteroids.ASTEROIDS_STATS.trojanGroups} Trojan groups, ${asteroids.ASTEROIDS_STATS.resonances} resonances, ${asteroids.ASTEROIDS_STATS.impacts} impact events · ${asteroids.ASTEROIDS_STATS.newEntities} new entities, ${asteroids.ASTEROIDS_STATS.relations} relations (reused dwarf planets/asteroids/missions; no fabricated data)`,
  );

  const cometsCat = await import("../src/knowledge-graph/data/comets-catalog");
  const cometIssues = cometsCat.validateComets();
  // Cross-reference resolution: every relation endpoint the catalog emits must resolve
  // to a real graph entity (reused comets, meteor showers, missions, and Program Y's
  // reservoirs / Sedna).
  const { getEntityById: getComEnt } = await import("../src/knowledge-graph");
  for (const r of cometsCat.relations) {
    if (!getComEnt(r.from)) cometIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getComEnt(r.to)) cometIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (cometIssues.length > 0) {
    console.error(`\n✗ ${cometIssues.length} comet issue(s):`);
    for (const i of cometIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Comets valid — ${cometsCat.COMETS_STATS.comets} comets, ${cometsCat.COMETS_STATS.classes} classes, ${cometsCat.COMETS_STATS.families} families, ${cometsCat.COMETS_STATS.reservoirs} reservoirs, ${cometsCat.COMETS_STATS.activeAsteroids} active asteroids, ${cometsCat.COMETS_STATS.dormantComets} dormant comets · ${cometsCat.COMETS_STATS.newEntities} new entities, ${cometsCat.COMETS_STATS.relations} relations (reused comets/showers/missions/reservoirs; no fabricated data)`,
  );

  const meteoritesCat = await import("../src/knowledge-graph/data/meteorites-catalog");
  const meteoriteIssues = meteoritesCat.validateMeteorites();
  // Cross-reference resolution: every relation endpoint the catalog emits must resolve
  // to a real graph entity (reused parent bodies — Vesta, Mars, the Moon — impact events,
  // and Earth).
  const { getEntityById: getMetEnt } = await import("../src/knowledge-graph");
  for (const r of meteoritesCat.relations) {
    if (!getMetEnt(r.from)) meteoriteIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getMetEnt(r.to)) meteoriteIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (meteoriteIssues.length > 0) {
    console.error(`\n✗ ${meteoriteIssues.length} meteorite issue(s):`);
    for (const i of meteoriteIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Meteorites valid — ${meteoritesCat.METEORITES_STATS.meteorites} meteorites, ${meteoritesCat.METEORITES_STATS.classes} classes, ${meteoritesCat.METEORITES_STATS.groups} groups, ${meteoritesCat.METEORITES_STATS.fireballs} fireballs, ${meteoritesCat.METEORITES_STATS.structures} impact structures, ${meteoritesCat.METEORITES_STATS.sites} recovery sites · ${meteoritesCat.METEORITES_STATS.newEntities} new entities, ${meteoritesCat.METEORITES_STATS.relations} relations (reused Vesta/Mars/Moon/impact events; no fabricated data)`,
  );

  const interstellarCat = await import("../src/knowledge-graph/data/interstellar-catalog");
  const interstellarIssues = interstellarCat.validateInterstellarObjects();
  // Cross-reference resolution: every relation endpoint the catalog emits must resolve to
  // a real graph entity (reused comet class, Pan-STARRS / LSST, NASA/JPL, Earth).
  const { getEntityById: getIntEnt } = await import("../src/knowledge-graph");
  for (const r of interstellarCat.relations) {
    if (!getIntEnt(r.from)) interstellarIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getIntEnt(r.to)) interstellarIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (interstellarIssues.length > 0) {
    console.error(`\n✗ ${interstellarIssues.length} interstellar issue(s):`);
    for (const i of interstellarIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Interstellar objects valid — ${interstellarCat.INTERSTELLAR_STATS.objects} confirmed, ${interstellarCat.INTERSTELLAR_STATS.candidates} candidate, ${interstellarCat.INTERSTELLAR_STATS.hyperbolicComets} hyperbolic comets, ${interstellarCat.INTERSTELLAR_STATS.methods} detection methods, ${interstellarCat.INTERSTELLAR_STATS.trajectoryClasses} trajectory classes · ${interstellarCat.INTERSTELLAR_STATS.newEntities} new entities, ${interstellarCat.INTERSTELLAR_STATS.relations} relations (reused comet class/Pan-STARRS/LSST/NASA-JPL; confirmed and candidate kept separate; no fabricated data)`,
  );

  const smallBodyCat = await import("../src/knowledge-graph/data/small-body-missions-catalog");
  const smallBodyIssues = smallBodyCat.validateSmallBodyMissions();
  // Cross-reference resolution: every relation endpoint the catalog emits must resolve to
  // a real graph entity (reused space missions, asteroids, comets, rockets, agencies).
  const { getEntityById: getSbmEnt } = await import("../src/knowledge-graph");
  for (const r of smallBodyCat.relations) {
    if (!getSbmEnt(r.from)) smallBodyIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getSbmEnt(r.to)) smallBodyIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (smallBodyIssues.length > 0) {
    console.error(`\n✗ ${smallBodyIssues.length} small-body-mission issue(s):`);
    for (const i of smallBodyIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Small-body missions valid — ${smallBodyCat.SMALLBODY_STATS.missions} missions (${smallBodyCat.SMALLBODY_STATS.reusedMissions} reused + ${smallBodyCat.SMALLBODY_STATS.newMissions} new), ${smallBodyCat.SMALLBODY_STATS.classes} classes, ${smallBodyCat.SMALLBODY_STATS.samples} returned samples, ${smallBodyCat.SMALLBODY_STATS.capsules} capsules, ${smallBodyCat.SMALLBODY_STATS.phases} phases, ${smallBodyCat.SMALLBODY_STATS.campaigns} campaign · ${smallBodyCat.SMALLBODY_STATS.newEntities} new entities, ${smallBodyCat.SMALLBODY_STATS.relations} relations (reused missions/asteroids/comets/rockets/agencies; planned missions assert no past-tense outcomes; no fabricated data)`,
  );

  const dsCommCat = await import("../src/knowledge-graph/data/deep-space-comms-catalog");
  const dsCommIssues = dsCommCat.validateDeepSpaceCommunications();
  // Cross-reference resolution: every relation endpoint the catalog emits must resolve to
  // a real graph entity (reused networks, missions, telescopes, organizations).
  const { getEntityById: getDscEnt } = await import("../src/knowledge-graph");
  for (const r of dsCommCat.relations) {
    if (!getDscEnt(r.from)) dsCommIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getDscEnt(r.to)) dsCommIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (dsCommIssues.length > 0) {
    console.error(`\n✗ ${dsCommIssues.length} deep-space-comms issue(s):`);
    for (const i of dsCommIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Deep-space communications valid — ${dsCommCat.DSCOMM_STATS.networks} networks (${dsCommCat.DSCOMM_STATS.reusedNetworks} reused + ${dsCommCat.DSCOMM_STATS.newNetworks} new), ${dsCommCat.DSCOMM_STATS.trackingStations} tracking + ${dsCommCat.DSCOMM_STATS.groundStations} ground stations, ${dsCommCat.DSCOMM_STATS.antennas} antennas, ${dsCommCat.DSCOMM_STATS.bands} signal bands, ${dsCommCat.DSCOMM_STATS.navigation} navigation systems, ${dsCommCat.DSCOMM_STATS.timeStandards} time standards, ${dsCommCat.DSCOMM_STATS.commSystems} comm systems · ${dsCommCat.DSCOMM_STATS.newEntities} new entities, ${dsCommCat.DSCOMM_STATS.relations} relations (reused DSN/Estrack/NSN, missions, agencies; no fabricated data)`,
  );

  const hsf = await import("../src/knowledge-graph/data/human-spaceflight-catalog");
  const hsfIssues = hsf.validateHumanSpaceflight();
  if (hsfIssues.length > 0) {
    console.error(`\n✗ ${hsfIssues.length} human-spaceflight issue(s):`);
    for (const i of hsfIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Human Spaceflight valid — ${hsf.HSF_STATS.records} records, ${hsf.HSF_STATS.newEntities} new entities, ${hsf.HSF_STATS.stations} stations`,
  );

  const obs = await import("../src/knowledge-graph/data/observatory-catalog");
  const obsIssues = obs.validateObservatories();
  if (obsIssues.length > 0) {
    console.error(`\n✗ ${obsIssues.length} observatory issue(s):`);
    for (const i of obsIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Observatories valid — ${obs.OBS_STATS.records} records, ${obs.OBS_STATS.newEntities} new entities, ${obs.OBS_STATS.observatories} observatories/telescopes`,
  );

  const exo = await import("../src/knowledge-graph/data/exoplanet-catalog");
  const exoIssues = exo.validateExoplanets();
  if (exoIssues.length > 0) {
    console.error(`\n✗ ${exoIssues.length} exoplanet issue(s):`);
    for (const i of exoIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Exoplanets valid — ${exo.EXO_STATS.planets} planets, ${exo.EXO_STATS.newPlanets} new, ${exo.EXO_STATS.systems} systems, ${exo.EXO_STATS.reusedHosts} reused + ${exo.EXO_STATS.newHosts} new hosts`,
  );

  const hist = await import("../src/knowledge-graph/data/history-catalog");
  const histIssues = hist.validateHistory();
  if (histIssues.length > 0) {
    console.error(`\n✗ ${histIssues.length} history issue(s):`);
    for (const i of histIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ History valid — ${hist.HISTORY_STATS.astronomers} astronomers (${hist.HISTORY_STATS.reusedAstronomers} reused + ${hist.HISTORY_STATS.newAstronomers} new), ${hist.HISTORY_STATS.discoveries} discoveries, ${hist.HISTORY_STATS.publications} publications, ${hist.HISTORY_STATS.theories} theories, ${hist.HISTORY_STATS.catalogues} catalogues, ${hist.HISTORY_STATS.eras} eras — ${hist.HISTORY_STATS.newEntities} new entities, ${hist.HISTORY_STATS.relations} relations`,
  );

  const cosmo = await import("../src/knowledge-graph/data/cosmology-catalog");
  const cosmoIssues = cosmo.validateCosmology();
  if (cosmoIssues.length > 0) {
    console.error(`\n✗ ${cosmoIssues.length} cosmology issue(s):`);
    for (const i of cosmoIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  const cb = cosmo.COSMOLOGY_STATS.byConsensus as Record<string, number>;
  console.log(
    `✓ Cosmology valid — ${cosmo.COSMOLOGY_STATS.concepts} concepts, ${cosmo.COSMOLOGY_STATS.models} models, ${cosmo.COSMOLOGY_STATS.objectClasses} object classes, ${cosmo.COSMOLOGY_STATS.programs} programs — ${cosmo.COSMOLOGY_STATS.newEntities} new entities, ${cosmo.COSMOLOGY_STATS.relations} relations · consensus: ${cb.established} established / ${cb["strong-evidence"]} strong / ${cb["active-research"]} active / ${cb.debate} debate / ${cb.speculative} speculative`,
  );

  const sky = await import("../src/platform/live-sky");
  const skyIssues = sky.validateLiveSky();
  if (skyIssues.length > 0) {
    console.error(`\n✗ ${skyIssues.length} live-sky issue(s):`);
    for (const i of skyIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Live Sky valid — ${sky.LIVE_SKY_STATS.meteorShowers} meteor showers, ${sky.LIVE_SKY_STATS.providers} providers, ${sky.LIVE_SKY_STATS.totalSkyPaths} pages, ${sky.LIVE_SKY_STATS.linkedEntities} graph links · ${sky.LIVE_SKY_STATS.connectedProviders} live providers connected (no fabricated data)`,
  );

  const img = await import("../src/platform/images");
  const imgIssues = img.validateImages();
  if (imgIssues.length > 0) {
    console.error(`\n✗ ${imgIssues.length} image-catalog issue(s):`);
    for (const i of imgIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Images valid — ${img.IMAGE_STATS.images} images, ${img.IMAGE_STATS.collections} collections, ${img.IMAGE_STATS.sources} sources, ${img.IMAGE_STATS.licenses} licenses, ${img.IMAGE_STATS.newEntities} entities, ${img.IMAGE_STATS.relations} relations · every image has credit + license + source (no fabricated binaries)`,
  );

  const { validateEntries, getAllEntries, ENTRY_STATS } = reg;

  const issues = validateEntries();
  if (issues.length > 0) {
    console.error(`\n✗ ${issues.length} validation issue(s):\n`);
    for (const issue of issues) console.error(`  • ${issue}`);
    process.exit(1);
  }

  const entries = getAllEntries();

  // Boundary invariants (report, and fail if any are violated).
  const factual = entries.filter((e) =>
    ["science", "historical", "tool"].includes(e.kind),
  );
  const interpretive = entries.filter((e) => e.kind === "interpretive");
  const sourcedFactual = factual.filter((e) => e.sources.length > 0);
  const disclaimedInterpretive = interpretive.filter((e) => e.disclaimerRequired);
  const astronomyWithDisclaimer = entries.filter(
    (e) => e.section === "astronomy" && e.disclaimerRequired,
  );
  const missingCanonical = entries.filter((e) => !e.canonicalUrl);

  const hardFailures: string[] = [];
  if (sourcedFactual.length !== factual.length)
    hardFailures.push("some factual entries lack source slots");
  if (disclaimedInterpretive.length !== interpretive.length)
    hardFailures.push("some interpretive entries lack the disclaimer");
  if (astronomyWithDisclaimer.length > 0)
    hardFailures.push("an astronomy entry carries the astrology disclaimer");
  if (missingCanonical.length > 0)
    hardFailures.push("an entry is missing a canonical URL for the sitemap");

  if (hardFailures.length > 0) {
    console.error("\n✗ Boundary invariant failures:\n");
    for (const f of hardFailures) console.error(`  • ${f}`);
    process.exit(1);
  }

  console.log(`\n✓ Entry registry valid — ${ENTRY_STATS.total} published entries\n`);
  console.log("  By kind:");
  for (const [kind, count] of Object.entries(ENTRY_STATS.byKind)) {
    console.log(`    ${kind.padEnd(12)} ${count}`);
  }
  console.log("");
  console.log(`  Factual entries with sources:        ${sourcedFactual.length}/${factual.length}`);
  console.log(`  Interpretive entries with disclaimer: ${disclaimedInterpretive.length}/${interpretive.length}`);
  console.log(`  Astronomy entries with disclaimer:    ${astronomyWithDisclaimer.length} (must be 0)`);
  console.log("");
  console.log(
    `✓ Knowledge graph valid — ${graph.GRAPH_STATS.entityCount} entities, ${graph.GRAPH_STATS.relationCount} relations`,
  );
  console.log(`    entities by domain: ${JSON.stringify(graph.GRAPH_STATS.entitiesByDomain)}`);
  console.log(`    relations by domain: ${JSON.stringify(graph.GRAPH_STATS.relationsByDomain)}`);
  console.log("");
}

main();
