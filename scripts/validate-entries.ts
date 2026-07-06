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

  const envCat = await import("../src/knowledge-graph/data/space-environment-catalog");
  const envIssues = envCat.validateSpaceEnvironment();
  const { getEntityById: getEnvEnt } = await import("../src/knowledge-graph");
  for (const r of envCat.relations) {
    if (!getEnvEnt(r.from)) envIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getEnvEnt(r.to)) envIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (envIssues.length > 0) {
    console.error(`\n✗ ${envIssues.length} space-environment issue(s):`);
    for (const i of envIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Space environment valid — ${envCat.ENV_STATS.phenomena} phenomena, ${envCat.ENV_STATS.radiation} radiation environments, ${envCat.ENV_STATS.hazards} hazards, ${envCat.ENV_STATS.indices} indices, ${envCat.ENV_STATS.monitors} monitors · ${envCat.ENV_STATS.newEntities} new entities, ${envCat.ENV_STATS.relations} relations (reused Sun/planets/moons/solar missions/NOAA; no fabricated data)`,
  );

  const opsCat = await import("../src/knowledge-graph/data/mission-operations-catalog");
  const opsIssues = opsCat.validateMissionOperations();
  const { getEntityById: getOpsEnt } = await import("../src/knowledge-graph");
  for (const r of opsCat.relations) {
    if (!getOpsEnt(r.from)) opsIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getOpsEnt(r.to)) opsIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (opsIssues.length > 0) {
    console.error(`\n✗ ${opsIssues.length} mission-operations issue(s):`);
    for (const i of opsIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Mission operations valid — ${opsCat.OPS_STATS.centers} operations centres, ${opsCat.OPS_STATS.functions} operations functions · ${opsCat.OPS_STATS.newEntities} new entities, ${opsCat.OPS_STATS.relations} relations (reused agencies/networks/missions; no fabricated data)`,
  );

  const sysCat = await import("../src/knowledge-graph/data/spacecraft-systems-catalog");
  const sysIssues = sysCat.validateSpacecraftSystems();
  const { getEntityById: getSysEnt } = await import("../src/knowledge-graph");
  for (const r of sysCat.relations) {
    if (!getSysEnt(r.from)) sysIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getSysEnt(r.to)) sysIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (sysIssues.length > 0) {
    console.error(`\n✗ ${sysIssues.length} spacecraft-systems issue(s):`);
    for (const i of sysIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Spacecraft systems valid — ${sysCat.SYS_STATS.subsystems} subsystems, ${sysCat.SYS_STATS.components} components · ${sysCat.SYS_STATS.newEntities} new entities, ${sysCat.SYS_STATS.relations} relations (reused docking/life-support/antennas/attitude sensors; no fabricated data)`,
  );

  const instCat = await import("../src/knowledge-graph/data/instruments-catalog");
  const instIssues = instCat.validateInstruments();
  const { getEntityById: getInstEnt } = await import("../src/knowledge-graph");
  for (const r of instCat.relations) {
    if (!getInstEnt(r.from)) instIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getInstEnt(r.to)) instIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (instIssues.length > 0) {
    console.error(`\n✗ ${instIssues.length} instruments issue(s):`);
    for (const i of instIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Instruments valid — ${instCat.INST_STATS.classes} instrument classes, ${instCat.INST_STATS.newInstruments} new instruments (${instCat.INST_STATS.reusedInstruments} existing enriched) · ${instCat.INST_STATS.newEntities} new entities, ${instCat.INST_STATS.relations} relations (reused instruments + host missions; no fabricated data)`,
  );

  const geoCat = await import("../src/knowledge-graph/data/planetary-geology-catalog");
  const geoIssues = geoCat.validatePlanetaryGeology();
  const { getEntityById: getGeoEnt } = await import("../src/knowledge-graph");
  for (const r of geoCat.relations) {
    if (!getGeoEnt(r.from)) geoIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getGeoEnt(r.to)) geoIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (geoIssues.length > 0) {
    console.error(`\n✗ ${geoIssues.length} planetary-geology issue(s):`);
    for (const i of geoIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Planetary geology valid — ${geoCat.GEO_STATS.featureTypes} feature types, ${geoCat.GEO_STATS.newFeatures} new features (${geoCat.GEO_STATS.reusedFeatures} existing enriched) · ${geoCat.GEO_STATS.newEntities} new entities, ${geoCat.GEO_STATS.relations} relations (reused bodies + surface features; no fabricated data)`,
  );

  const instCatalog = await import("../src/knowledge-graph/data/institutions-catalog");
  const instituteIssues = instCatalog.validateInstitutions();
  const { getEntityById: getInstitutionEnt } = await import("../src/knowledge-graph");
  for (const r of instCatalog.relations) {
    if (!getInstitutionEnt(r.from)) instituteIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getInstitutionEnt(r.to)) instituteIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (instituteIssues.length > 0) {
    console.error(`\n✗ ${instituteIssues.length} institutions issue(s):`);
    for (const i of instituteIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Institutions valid — ${instCatalog.INST_STATS.types} institution types, ${instCatalog.INST_STATS.newOrgs} new field centers/labs (${instCatalog.INST_STATS.reusedOrgs} existing enriched) · ${instCatalog.INST_STATS.newEntities} new entities, ${instCatalog.INST_STATS.relations} relations (reused agencies + organizations; no fabricated data)`,
  );

  const timeCat = await import("../src/knowledge-graph/data/spaceflight-history-catalog");
  const timeIssues = timeCat.validateSpaceflightHistory();
  const { getEntityById: getTimeEnt } = await import("../src/knowledge-graph");
  for (const r of timeCat.relations) {
    if (!getTimeEnt(r.from)) timeIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getTimeEnt(r.to)) timeIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (timeIssues.length > 0) {
    console.error(`\n✗ ${timeIssues.length} spaceflight-history issue(s):`);
    for (const i of timeIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Spaceflight history valid — ${timeCat.TIMELINE_STATS.eras} eras, ${timeCat.TIMELINE_STATS.events} events, ${timeCat.TIMELINE_STATS.milestones} milestones, ${timeCat.TIMELINE_STATS.superlatives} records · ${timeCat.TIMELINE_STATS.newEntities} new entities, ${timeCat.TIMELINE_STATS.relations} relations (reused missions/programs/astronauts/bodies; no fabricated data)`,
  );

  const medCat = await import("../src/knowledge-graph/data/space-medicine-catalog");
  const medIssues = medCat.validateSpaceMedicine();
  const { getEntityById: getMedEnt } = await import("../src/knowledge-graph");
  for (const r of medCat.relations) {
    if (!getMedEnt(r.from)) medIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getMedEnt(r.to)) medIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (medIssues.length > 0) {
    console.error(`\n✗ ${medIssues.length} space-medicine issue(s):`);
    for (const i of medIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Space medicine valid — ${medCat.MED_STATS.topics} disciplines, ${medCat.MED_STATS.effects} new effects (${medCat.MED_STATS.reusedEffects} existing reused), ${medCat.MED_STATS.technologies} technologies, ${medCat.MED_STATS.countermeasures} countermeasures · ${medCat.MED_STATS.newEntities} new entities, ${medCat.MED_STATS.relations} relations (reused ECLSS/radiation/stations/astronauts + space_medicine_topic effects; no fabricated data)`,
  );

  const infraCat = await import("../src/knowledge-graph/data/space-infrastructure-catalog");
  const infraIssues = infraCat.validateSpaceInfrastructure();
  const { getEntityById: getInfraEnt } = await import("../src/knowledge-graph");
  for (const r of infraCat.relations) {
    if (!getInfraEnt(r.from)) infraIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getInfraEnt(r.to)) infraIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (infraIssues.length > 0) {
    console.error(`\n✗ ${infraIssues.length} space-infrastructure issue(s):`);
    for (const i of infraIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Space infrastructure valid — ${infraCat.INFRA_STATS.domains} domains, ${infraCat.INFRA_STATS.isru} ISRU techniques, ${infraCat.INFRA_STATS.manufacturing} manufacturing processes, ${infraCat.INFRA_STATS.infrastructure} systems · ${infraCat.INFRA_STATS.newEntities} new entities, ${infraCat.INFRA_STATS.relations} relations (reused bodies/stations/propellants/components; no fabricated data)`,
  );

  const futureCat = await import("../src/knowledge-graph/data/future-missions-catalog");
  const futureIssues = futureCat.validateFutureMissions();
  const { getEntityById: getFutureEnt } = await import("../src/knowledge-graph");
  for (const r of futureCat.relations) {
    if (!getFutureEnt(r.from)) futureIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getFutureEnt(r.to)) futureIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (futureIssues.length > 0) {
    console.error(`\n✗ ${futureIssues.length} future-missions issue(s):`);
    for (const i of futureIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Future missions valid — ${futureCat.CONCEPT_STATS.themes} themes, ${futureCat.CONCEPT_STATS.concepts} new concepts (${futureCat.CONCEPT_STATS.reusedConcepts} existing reused) · ${futureCat.CONCEPT_STATS.newEntities} new entities, ${futureCat.CONCEPT_STATS.relations} relations (reused missions/agencies/targets; no fabricated data)`,
  );

  const methodsCat = await import("../src/knowledge-graph/data/astronomy-methods-catalog");
  const methodsIssues = methodsCat.validateAstronomyMethods();
  const { getEntityById: getMethodEnt } = await import("../src/knowledge-graph");
  for (const r of methodsCat.relations) {
    if (!getMethodEnt(r.from)) methodsIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getMethodEnt(r.to)) methodsIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (methodsIssues.length > 0) {
    console.error(`\n✗ ${methodsIssues.length} astronomy-methods issue(s):`);
    for (const i of methodsIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Astronomy methods valid — ${methodsCat.METHOD_STATS.categories} categories, ${methodsCat.METHOD_STATS.methods} techniques (${methodsCat.METHOD_STATS.reusedMethods} existing reused) · ${methodsCat.METHOD_STATS.newEntities} new entities, ${methodsCat.METHOD_STATS.relations} relations (reused detection methods/cosmology/bands/Gaia; no fabricated data)`,
  );

  const tdCat = await import("../src/knowledge-graph/data/time-domain-catalog");
  const tdIssues = tdCat.validateTimeDomain();
  const { getEntityById: getTdEnt } = await import("../src/knowledge-graph");
  for (const r of tdCat.relations) {
    if (!getTdEnt(r.from)) tdIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getTdEnt(r.to)) tdIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (tdIssues.length > 0) {
    console.error(`\n✗ ${tdIssues.length} time-domain issue(s):`);
    for (const i of tdIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Time-domain valid — ${tdCat.TD_STATS.transients} transient classes, ${tdCat.TD_STATS.alerts} alert systems, ${tdCat.TD_STATS.stages} workflow stages · ${tdCat.TD_STATS.newEntities} new entities, ${tdCat.TD_STATS.relations} relations (reused bands/methods/surveys/observatories; no fabricated data)`,
  );

  const gxCat = await import("../src/knowledge-graph/data/galaxies-catalog");
  const gxIssues = gxCat.validateGalaxies();
  const { getEntityById: getGxEnt } = await import("../src/knowledge-graph");
  for (const r of gxCat.relations) {
    if (!getGxEnt(r.from)) gxIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getGxEnt(r.to)) gxIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (gxIssues.length > 0) {
    console.error(`\n✗ ${gxIssues.length} galaxies issue(s):`);
    for (const i of gxIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Galaxies valid — ${gxCat.EXG_STATS.morphologies} morphologies, ${gxCat.EXG_STATS.agnTypes} AGN types + ${gxCat.EXG_STATS.agnModels} model, ${gxCat.EXG_STATS.processes} processes, ${gxCat.EXG_STATS.structures} structures · ${gxCat.EXG_STATS.newEntities} new entities, ${gxCat.EXG_STATS.relations} relations (reused galaxies/object-classes/cosmology; no fabricated data)`,
  );

  const abCat = await import("../src/knowledge-graph/data/astrobiology-catalog");
  const abIssues = abCat.validateAstrobiology();
  const { getEntityById: getAbEnt } = await import("../src/knowledge-graph");
  for (const r of abCat.relations) {
    if (!getAbEnt(r.from)) abIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getAbEnt(r.to)) abIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (abIssues.length > 0) {
    console.error(`\n✗ ${abIssues.length} astrobiology issue(s):`);
    for (const i of abIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Astrobiology valid — ${abCat.AB_STATS.topics} disciplines, ${abCat.AB_STATS.biosignatures} biosignatures, ${abCat.AB_STATS.factors} habitability factors, ${abCat.AB_STATS.protection} protection measures · ${abCat.AB_STATS.newEntities} new entities, ${abCat.AB_STATS.relations} relations (reused ocean-worlds/Mars/SETI/missions; no fabricated data)`,
  );

  const pdCat = await import("../src/knowledge-graph/data/planetary-defense-catalog");
  const pdIssues = pdCat.validatePlanetaryDefense();
  const { getEntityById: getPdEnt } = await import("../src/knowledge-graph");
  for (const r of pdCat.relations) {
    if (!getPdEnt(r.from)) pdIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getPdEnt(r.to)) pdIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (pdIssues.length > 0) {
    console.error(`\n✗ ${pdIssues.length} planetary-defense issue(s):`);
    for (const i of pdIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Planetary defense valid — ${pdCat.PD_STATS.stages}-stage NEO pipeline, ${pdCat.PD_STATS.scales} risk scales, ${pdCat.PD_STATS.methods} deflection methods · ${pdCat.PD_STATS.newEntities} new entities, ${pdCat.PD_STATS.relations} relations (reused surveys/MPC/CNEOS/DART/Hera/NEOs; no fabricated data)`,
  );

  const atCat = await import("../src/knowledge-graph/data/data-archives-catalog");
  const atIssues = atCat.validateDataArchives();
  const { getEntityById: getAtEnt } = await import("../src/knowledge-graph");
  for (const r of atCat.relations) {
    if (!getAtEnt(r.from)) atIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getAtEnt(r.to)) atIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (atIssues.length > 0) {
    console.error(`\n✗ ${atIssues.length} data-archives issue(s):`);
    for (const i of atIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Data archives valid — ${atCat.AT_STATS.archives} archives, ${atCat.AT_STATS.standards} data standards, the VO framework + ${atCat.AT_STATS.protocols} VO access protocols, ${atCat.AT_STATS.practices} open-science practices · ${atCat.AT_STATS.newEntities} new entities, ${atCat.AT_STATS.relations} relations (reused orgs/telescopes/surveys/calibration/Harvard/VOEvent; no fabricated data)`,
  );

  const auCat = await import("../src/knowledge-graph/data/observatory-frontier-catalog");
  const auIssues = auCat.validateObservatoryFrontier();
  const { getEntityById: getAuEnt } = await import("../src/knowledge-graph");
  for (const r of auCat.relations) {
    if (!getAuEnt(r.from)) auIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getAuEnt(r.to)) auIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (auIssues.length > 0) {
    console.error(`\n✗ ${auIssues.length} observatory-frontier issue(s):`);
    for (const i of auIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Observatory frontier valid — ${auCat.AU_STATS.facilities} next-gen facilities, ${auCat.AU_STATS.instruments} instrumentation, ${auCat.AU_STATS.detectors} detectors, ${auCat.AU_STATS.interferometry} interferometry, ${auCat.AU_STATS.techniques} observing techniques · ${auCat.AU_STATS.newEntities} new entities, ${auCat.AU_STATS.relations} relations (reused observatories/AO/interferometry/spectroscopy/instruments/bands; no fabricated data)`,
  );

  const avCat = await import("../src/knowledge-graph/data/distance-ladder-catalog");
  const avIssues = avCat.validateDistanceLadder();
  const { getEntityById: getAvEnt } = await import("../src/knowledge-graph");
  for (const r of avCat.relations) {
    if (!getAvEnt(r.from)) avIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getAvEnt(r.to)) avIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (avIssues.length > 0) {
    console.error(`\n✗ ${avIssues.length} distance-ladder issue(s):`);
    for (const i of avIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Distance ladder valid — ${avCat.AV_STATS.indicators} distance indicators, ${avCat.AV_STATS.parameters} cosmological parameters, ${avCat.AV_STATS.programs} programme (SH0ES), ${avCat.AV_STATS.concepts} concept (early dark energy) · ${avCat.AV_STATS.newEntities} new entities, ${avCat.AV_STATS.relations} relations (reused parallax/Cepheids/SNe Ia/BAO/CMB/H0/tension/Planck; no fabricated values)`,
  );

  const awCat = await import("../src/knowledge-graph/data/heliophysics-catalog");
  const awIssues = awCat.validateHeliophysics();
  const { getEntityById: getAwEnt } = await import("../src/knowledge-graph");
  for (const r of awCat.relations) {
    if (!getAwEnt(r.from)) awIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getAwEnt(r.to)) awIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (awIssues.length > 0) {
    console.error(`\n✗ ${awIssues.length} heliophysics issue(s):`);
    for (const i of awIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Heliophysics valid — ${awCat.AW_STATS.phenomena} solar-source phenomena, ${awCat.AW_STATS.impacts} operational impacts, ${awCat.AW_STATS.services} forecasting service (ESA) · ${awCat.AW_STATS.newEntities} new entities, ${awCat.AW_STATS.relations} relations (reused phenomena/G-S-R scales/radiation/missions/SWPC; no fabricated data)`,
  );

  const axCat = await import("../src/knowledge-graph/data/astro-ml-catalog");
  const axIssues = axCat.validateAstroMl();
  const { getEntityById: getAxEnt } = await import("../src/knowledge-graph");
  for (const r of axCat.relations) {
    if (!getAxEnt(r.from)) axIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getAxEnt(r.to)) axIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (axIssues.length > 0) {
    console.error(`\n✗ ${axIssues.length} astro-ml issue(s):`);
    for (const i of axIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Astro-ML valid — ${axCat.AX_STATS.methods} ML methods, ${axCat.AX_STATS.applications} applications, ${axCat.AX_STATS.workflows} data-engineering workflows, ${axCat.AX_STATS.brokers} alert brokers · ${axCat.AX_STATS.newEntities} new entities, ${axCat.AX_STATS.relations} relations (reused Rubin/alert-stream/methods/morphologies/transit/SNe/redshift/practices; no fabricated data)`,
  );

  const ayCat = await import("../src/knowledge-graph/data/citizen-astronomy-catalog");
  const ayIssues = ayCat.validateCitizenAstronomy();
  const { getEntityById: getAyEnt } = await import("../src/knowledge-graph");
  for (const r of ayCat.relations) {
    if (!getAyEnt(r.from)) ayIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getAyEnt(r.to)) ayIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (ayIssues.length > 0) {
    console.error(`\n✗ ${ayIssues.length} citizen-astronomy issue(s):`);
    for (const i of ayIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Citizen astronomy valid — ${ayCat.AY_STATS.projects} citizen-science projects, ${ayCat.AY_STATS.activities} amateur activities, ${ayCat.AY_STATS.equipment} equipment, ${ayCat.AY_STATS.outreach} outreach, ${ayCat.AY_STATS.organizations} organisations · ${ayCat.AY_STATS.newEntities} new entities, ${ayCat.AY_STATS.relations} relations (reused aurora/occultations/photometry/meteor-showers/constellations/variables/Stardust/transit/Rubin/MAST; no fabricated data)`,
  );

  const azCat = await import("../src/knowledge-graph/data/multi-messenger-catalog");
  const azIssues = azCat.validateMultiMessenger();
  const { getEntityById: getAzEnt } = await import("../src/knowledge-graph");
  for (const r of azCat.relations) {
    if (!getAzEnt(r.from)) azIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getAzEnt(r.to)) azIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (azIssues.length > 0) {
    console.error(`\n✗ ${azIssues.length} multi-messenger issue(s):`);
    for (const i of azIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Multi-messenger valid — ${azCat.AZ_STATS.facilities} GW detectors, ${azCat.AZ_STATS.detectionMethods} detection methods, ${azCat.AZ_STATS.sources} merger source classes, ${azCat.AZ_STATS.alerts} alert systems, ${azCat.AZ_STATS.channels} channels, ${azCat.AZ_STATS.followupStages} follow-up stages, ${azCat.AZ_STATS.dataProducts} data products · ${azCat.AZ_STATS.newEntities} new entities, ${azCat.AZ_STATS.relations} relations (reused LIGO/Virgo/KAGRA/LISA/GW-methods/transients/alerts/standard-sirens/bands; no fabricated data)`,
  );

  const baCat = await import("../src/knowledge-graph/data/comparative-planetology-catalog");
  const baIssues = baCat.validateComparativePlanetology();
  const { getEntityById: getBaEnt } = await import("../src/knowledge-graph");
  for (const r of baCat.relations) {
    if (!getBaEnt(r.from)) baIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getBaEnt(r.to)) baIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (baIssues.length > 0) {
    console.error(`\n✗ ${baIssues.length} comparative-planetology issue(s):`);
    for (const i of baIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Comparative planetology valid — ${baCat.BA_STATS.interiors} interior layers, ${baCat.BA_STATS.processes} planetary processes, ${baCat.BA_STATS.worldtypes} world-types · ${baCat.BA_STATS.newEntities} new entities, ${baCat.BA_STATS.relations} relations (reused planets/moons/Pluto/planetary-classes/magnetosphere/cryovolcano/habitable-zone; no fabricated data)`,
  );

  const bbCat = await import("../src/knowledge-graph/data/astrochemistry-catalog");
  const bbIssues = bbCat.validateAstrochemistry();
  const { getEntityById: getBbEnt } = await import("../src/knowledge-graph");
  for (const r of bbCat.relations) {
    if (!getBbEnt(r.from)) bbIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getBbEnt(r.to)) bbIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (bbIssues.length > 0) {
    console.error(`\n✗ ${bbIssues.length} astrochemistry issue(s):`);
    for (const i of bbIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Astrochemistry valid — ${bbCat.BB_STATS.environments} interstellar environments, ${bbCat.BB_STATS.molecules} molecules, ${bbCat.BB_STATS.processes} astrochemical processes · ${bbCat.BB_STATS.newEntities} new entities, ${bbCat.BB_STATS.relations} relations (reused spectroscopy/ALMA/APEX/JWST/Orion/origins-of-life/meteorites/bands; no fabricated data)`,
  );

  const bcCat = await import("../src/knowledge-graph/data/space-policy-catalog");
  const bcIssues = bcCat.validateSpacePolicy();
  const { getEntityById: getBcEnt } = await import("../src/knowledge-graph");
  for (const r of bcCat.relations) {
    if (!getBcEnt(r.from)) bcIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getBcEnt(r.to)) bcIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (bcIssues.length > 0) {
    console.error(`\n✗ ${bcIssues.length} space-policy issue(s):`);
    for (const i of bcIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Space policy valid — ${bcCat.BC_STATS.treaties} treaties, ${bcCat.BC_STATS.topics} policy topics, ${bcCat.BC_STATS.economy} economy topics, ${bcCat.BC_STATS.organizations} organisations · ${bcCat.BC_STATS.newEntities} new entities, ${bcCat.BC_STATS.relations} relations (reused on-orbit-servicing/ISRU/planetary-protection/satellites/NASA; no fabricated data)`,
  );

  const bdCat = await import("../src/knowledge-graph/data/discovery-history-catalog");
  const bdIssues = bdCat.validateDiscoveryHistory();
  const { getEntityById: getBdEnt } = await import("../src/knowledge-graph");
  for (const r of bdCat.relations) {
    if (!getBdEnt(r.from)) bdIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getBdEnt(r.to)) bdIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (bdIssues.length > 0) {
    console.error(`\n✗ ${bdIssues.length} discovery-history issue(s):`);
    for (const i of bdIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Discovery history valid — ${bdCat.BD_STATS.themes} histories of discovery, ${bdCat.BD_STATS.methodology} discovery methodologies, ${bdCat.BD_STATS.philosophy} philosophy concepts · ${bdCat.BD_STATS.newEntities} new entities, ${bdCat.BD_STATS.relations} relations (reused astronomers/eras/methods/objects/reproducibility; no fabricated data)`,
  );

  const beCat = await import("../src/knowledge-graph/data/celestial-mechanics-catalog");
  const beIssues = beCat.validateCelestialMechanics();
  const { getEntityById: getBeEnt } = await import("../src/knowledge-graph");
  for (const r of beCat.relations) {
    if (!getBeEnt(r.from)) beIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getBeEnt(r.to)) beIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (beIssues.length > 0) {
    console.error(`\n✗ ${beIssues.length} celestial-mechanics issue(s):`);
    for (const i of beIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Celestial mechanics valid — ${beCat.BE_STATS.dynamics} orbital-mechanics concepts, ${beCat.BE_STATS.frames} reference frames, ${beCat.BE_STATS.ephemerides} ephemeris systems, ${beCat.BE_STATS.timekeeping} time standards · ${beCat.BE_STATS.newEntities} new entities, ${beCat.BE_STATS.relations} relations (reused gravitation/Kepler/JPL/planets/resonances/TAI-UTC/precession/JWST; no fabricated data)`,
  );

  const bfCat = await import("../src/knowledge-graph/data/stellar-astrophysics-catalog");
  const bfIssues = bfCat.validateStellarAstrophysics();
  const { getEntityById: getBfEnt } = await import("../src/knowledge-graph");
  for (const r of bfCat.relations) {
    if (!getBfEnt(r.from)) bfIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getBfEnt(r.to)) bfIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (bfIssues.length > 0) {
    console.error(`\n✗ ${bfIssues.length} stellar-astrophysics issue(s):`);
    for (const i of bfIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Stellar astrophysics valid — ${bfCat.BF_STATS.processes} stellar processes, ${bfCat.BF_STATS.nucleosynthesis} nucleosynthesis pathways, ${bfCat.BF_STATS.concepts} physics concepts · ${bfCat.BF_STATS.newEntities} new entities, ${bfCat.BF_STATS.relations} relations (reused end-states/supernovae/kilonova/spectral-classification/asteroseismology/BBN/clusters; no fabricated data)`,
  );

  const bgCat = await import("../src/knowledge-graph/data/galactic-astronomy-catalog");
  const bgIssues = bgCat.validateGalacticAstronomy();
  const { getEntityById: getBgEnt } = await import("../src/knowledge-graph");
  for (const r of bgCat.relations) {
    if (!getBgEnt(r.from)) bgIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getBgEnt(r.to)) bgIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (bgIssues.length > 0) {
    console.error(`\n✗ ${bgIssues.length} galactic-astronomy issue(s):`);
    for (const i of bgIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Galactic astronomy valid — ${bgCat.BG_STATS.structure} galactic structures, ${bgCat.BG_STATS.dynamics} dynamical phenomena · ${bgCat.BG_STATS.newEntities} new entities, ${bgCat.BG_STATS.relations} relations (reused Milky-Way/Sgr-A*/Local-Group/Magellanic/Andromeda/dark-matter/Gaia/ISM; no fabricated data)`,
  );

  const bhCat = await import("../src/knowledge-graph/data/astroinformatics-catalog");
  const bhIssues = bhCat.validateAstroinformatics();
  const { getEntityById: getBhEnt } = await import("../src/knowledge-graph");
  for (const r of bhCat.relations) {
    if (!getBhEnt(r.from)) bhIssues.push(`relation ${r.id}: 'from' endpoint missing in graph: ${r.from}`);
    if (!getBhEnt(r.to)) bhIssues.push(`relation ${r.id}: 'to' endpoint missing in graph: ${r.to}`);
  }
  if (bhIssues.length > 0) {
    console.error(`\n✗ ${bhIssues.length} astroinformatics issue(s):`);
    for (const i of bhIssues) console.error(`  • ${i}`);
    process.exit(1);
  }
  console.log(
    `✓ Astroinformatics valid — ${bhCat.BH_STATS.software} software packages, ${bhCat.BH_STATS.computing} computing infrastructures, ${bhCat.BH_STATS.concepts} concepts · ${bhCat.BH_STATS.newEntities} new entities, ${bhCat.BH_STATS.relations} relations (reused VO/TAP/FITS/archives/open-science/ML/Rubin/LSST/SKA/Gaia; no fabricated data)`,
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
