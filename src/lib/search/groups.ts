import type { SearchGroupId } from "@/lib/search/types";

/**
 * Entity type → display group.
 *
 * Written as an explicit literal table rather than derived from the graph
 * schema, because this module is imported by the client bundle and must never
 * pull in `@/knowledge-graph`. `scripts/validate-search-index.ts` checks that
 * every type present in the graph appears here, so a new entity type fails the
 * build rather than silently landing in the fallback group.
 */
const GROUP_BY_TYPE: Record<string, SearchGroupId> = {};

function assign(group: SearchGroupId, types: string[]) {
  for (const t of types) GROUP_BY_TYPE[t] = group;
}

assign("solar-system", [
  "planet", "dwarf_planet", "moon", "asteroid", "comet", "meteorite", "surface_feature",
  "near_earth_object", "trojan_group", "asteroid_family", "minor_planet_group", "comet_class",
  "meteorite_group", "meteorite_class", "impact_structure", "impact_event", "fireball",
  "recovery_site", "hyperbolic_comet", "dormant_comet", "active_asteroid", "small_body_reservoir",
  "interstellar_object", "interstellar_candidate", "comet_family", "interstellar_detection_method", "planetary_class",
  "planetary_process", "planetary_interior", "geological_feature_type", "meteor_shower",
  "solar_feature", "solar_region", "planetary_protection", "risk_scale", "defense_stage",
  "deflection_method", "orbital_resonance", "returned_sample",
]);

assign("stars-exoplanets", [
  "star", "host_star", "exoplanet", "planetary_system", "exoplanet_science_concept",
  "exoplanet_detection_method", "exoplanet_catalogue", "habitable_zone_candidate",
  "stellar_physics_concept", "stellar_process", "black_hole", "neutron_star",
  "nucleosynthesis_process", "transient_class",
]);

assign("deep-sky", [
  "galaxy", "nebula", "star_cluster", "constellation", "asterism", "constellation_family",
  "astrophysical_object_class", "galaxy_morphology", "galactic_structure", "galactic_dynamics",
  "galactic_process", "cosmic_structure", "agn_type", "agn_model", "seasonal_sky",
  "sky_survey", "catalog", "catalog_family", "atlas_view", "atlas_overlay", "designation_system",
]);

assign("missions", [
  "space_mission", "mission_program", "mission_milestone", "mission_concept", "mission_phase",
  "mission_class", "spacecraft", "spacecraft_component", "spacecraft_subsystem", "launch_vehicle",
  "rocket_engine", "rocket_family", "rocket_stage", "propellant", "launch_pad", "launch_site",
  "satellite", "satellite_constellation", "space_station", "station_module", "crew_vehicle",
  "cargo_vehicle", "docking_system", "astronaut", "eva", "expedition", "human_spaceflight_program",
  "space_experiment", "life_support_system", "life_support_technology", "countermeasure",
  "physiological_effect", "space_medicine_topic", "space_biology_topic", "sample_return_capsule",
  "trajectory_class", "orbit_type", "exploration_architecture", "exploration_theme",
  "isru_technique", "space_manufacturing_process", "infrastructure_domain", "space_infrastructure",
  "operations_function", "mission_operations_center", "science_campaign", "deep_space_challenge",
]);

assign("observatories", [
  "observatory", "telescope", "space_telescope", "scientific_instrument", "instrument_class",
  "instrument_technique", "antenna", "ground_station", "tracking_station", "tracking_network",
  "navigation_system", "communication_system", "signal_band", "wavelength_band",
  "detector_technology", "observing_site", "observing_equipment", "observing_technique",
  "observing_planner", "observing_integration", "observation_stage", "interferometry_technique",
]);

assign("science", [
  "physics_concept", "cosmology_concept", "cosmological_model", "cosmological_parameter",
  "astronomy_method", "method_category", "astronomical_theory", "orbital_mechanics_concept",
  "reference_frame", "coordinate_system", "time_standard", "ephemeris_system",
  "astrometric_effect", "distance_indicator", "space_weather_phenomenon", "space_weather_impact",
  "geomagnetic_index", "heliosphere_structure", "radiation_environment", "space_environment" ,
  "space_hazard", "interstellar_molecule", "interstellar_environment", "astrochemical_process",
  "astrobiology_topic", "biosignature", "habitability_factor", "multi_messenger",
  "gw_detection_method", "gw_followup_stage", "gw_data_product", "mm_channel",
  "space_engineering_concept", "astroinformatics_concept", "philosophy_of_science",
  "discovery_methodology", "observational_program", "alert_system", "record",
]);

assign("guides", [
  "assistant_capability", "graph_view", "universe_scene", "workspace_feature",
  "citizen_science_project", "amateur_activity", "outreach_activity", "platform_capability",
]);

assign("tools", [
  "scientific_calculator", "research_software", "astronomy_software", "research_computing",
  "ml_method", "ml_application", "ml_workflow",
]);

assign("data", [
  "data_archive", "data_standard", "vo_protocol", "vo_framework", "live_data_source",
  "open_science_practice", "image_source", "image_license", "image_collection", "scientific_image",
]);

assign("history", [
  "astronomer", "publication", "historical_discovery", "historical_event", "historic_space_event",
  "astronomy_era", "timeline_event", "history_theme", "mythology_figure", "mythology_story",
  "astrology_sign", "astrology_planet", "organization", "institution_type", "scientific_award",
  "space_policy_topic", "space_treaty", "space_economy_topic", "location",
]);

/** Entity types whose pages are cultural/interpretive rather than scientific. */
const CULTURAL_TYPES = new Set([
  "astrology_sign", "astrology_planet", "mythology_figure", "mythology_story",
]);

export function groupForEntityType(type: string): SearchGroupId {
  return GROUP_BY_TYPE[type] ?? "reference";
}

export function isCulturalType(type: string): boolean {
  return CULTURAL_TYPES.has(type);
}

/** Every type this table knows about — used by the validator. */
export function mappedEntityTypes(): string[] {
  return Object.keys(GROUP_BY_TYPE);
}
