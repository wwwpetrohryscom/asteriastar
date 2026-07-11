# AsteriaStar — Content Completeness Audit

_Generated deterministically by `npm run content:audit`. Honest by construction: measures existing coverage only, never fabricates._

## Summary

| Metric | Count |
| --- | ---: |
| Total public entities audited | 7351 |
| Distinct entity types | 224 |
| Entities with at least one image | 487 (6.6%) |
| Entities with a multi-image gallery (≥2) | 397 |
| Entities with zero imagery | 6864 |

### Image-eligible entities (a real photo/observation can normally exist)

| Metric | Count |
| --- | ---: |
| Image-eligible entities | 4445 |
| …with a hero image | 487 (11.0%) |
| …with a multi-image gallery | 397 |
| …still with zero imagery (enrichment targets) | 3958 |

> Note on absence: the very large `star` (thousands), `exoplanet`, `host_star` and `planetary_system` populations are catalogue records with **no resolved-disc photograph in existence** — their absence of a hero photo is scientifically legitimate, not a defect. They are excluded from the primary enrichment target below (except famous named stars).

## Coverage by entity type

| Type | Total | Imaged | % | Gallery (≥2) | Zero | Eligible |
| --- | ---: | ---: | ---: | ---: | ---: | :---: |
| `star` | 2998 | 28 | 0.9% | 22 | 2970 | ✅ |
| `star_cluster` | 372 | 16 | 4.3% | 6 | 356 | ✅ |
| `galaxy` | 145 | 29 | 20.0% | 23 | 116 | ✅ |
| `nebula` | 121 | 43 | 35.5% | 32 | 78 | ✅ |
| `constellation` | 88 | 26 | 29.5% | 15 | 62 | ✅ |
| `organization` | 80 | 0 | 0.0% | 0 | 80 | ✅ |
| `space_mission` | 76 | 70 | 92.1% | 61 | 6 | ✅ |
| `launch_vehicle` | 55 | 51 | 92.7% | 48 | 4 | ✅ |
| `asteroid` | 33 | 10 | 30.3% | 5 | 23 | ✅ |
| `scientific_instrument` | 33 | 0 | 0.0% | 0 | 33 | ✅ |
| `surface_feature` | 32 | 32 | 100.0% | 28 | 0 | ✅ |
| `satellite` | 31 | 16 | 51.6% | 14 | 15 | ✅ |
| `rocket_engine` | 26 | 0 | 0.0% | 0 | 26 | ✅ |
| `observatory` | 25 | 12 | 48.0% | 10 | 13 | ✅ |
| `moon` | 24 | 24 | 100.0% | 22 | 0 | ✅ |
| `astronaut` | 24 | 24 | 100.0% | 24 | 0 | ✅ |
| `telescope` | 24 | 13 | 54.2% | 9 | 11 | ✅ |
| `launch_pad` | 24 | 0 | 0.0% | 0 | 24 | ✅ |
| `historical_discovery` | 22 | 0 | 0.0% | 0 | 22 | ✅ |
| `comet` | 21 | 20 | 95.2% | 17 | 1 | ✅ |
| `scientific_image` | 21 | 1 | 4.8% | 0 | 20 | ✅ |
| `space_telescope` | 20 | 20 | 100.0% | 18 | 0 | ✅ |
| `meteorite` | 20 | 12 | 60.0% | 9 | 8 | ✅ |
| `station_module` | 17 | 0 | 0.0% | 0 | 17 | ✅ |
| `launch_site` | 15 | 0 | 0.0% | 0 | 15 | ✅ |
| `space_weather_phenomenon` | 13 | 13 | 100.0% | 13 | 0 | ✅ |
| `sky_survey` | 12 | 0 | 0.0% | 0 | 12 | ✅ |
| `asterism` | 12 | 0 | 0.0% | 0 | 12 | ✅ |
| `tracking_station` | 12 | 0 | 0.0% | 0 | 12 | ✅ |
| `space_station` | 11 | 0 | 0.0% | 0 | 11 | ✅ |
| `crew_vehicle` | 11 | 0 | 0.0% | 0 | 11 | ✅ |
| `spacecraft` | 10 | 10 | 100.0% | 8 | 0 | ✅ |
| `planet` | 8 | 8 | 100.0% | 8 | 0 | ✅ |
| `dwarf_planet` | 5 | 5 | 100.0% | 4 | 0 | ✅ |
| `black_hole` | 4 | 4 | 100.0% | 1 | 0 | ✅ |
| `exoplanet` | 849 | 0 | 0.0% | 0 | 849 | — |
| `host_star` | 333 | 0 | 0.0% | 0 | 333 | — |
| `planetary_system` | 187 | 0 | 0.0% | 0 | 187 | — |
| `cosmology_concept` | 49 | 0 | 0.0% | 0 | 49 | — |
| `astronomer` | 48 | 0 | 0.0% | 0 | 48 | — |
| `timeline_event` | 42 | 0 | 0.0% | 0 | 42 | — |
| `astrophysical_object_class` | 32 | 0 | 0.0% | 0 | 32 | — |
| `scientific_calculator` | 30 | 0 | 0.0% | 0 | 30 | — |
| `astronomy_method` | 26 | 0 | 0.0% | 0 | 26 | — |
| `catalog` | 25 | 0 | 0.0% | 0 | 25 | — |
| `spacecraft_component` | 25 | 0 | 0.0% | 0 | 25 | — |
| `physics_concept` | 25 | 0 | 0.0% | 0 | 25 | — |
| `stellar_physics_concept` | 24 | 0 | 0.0% | 0 | 24 | — |
| `mission_program` | 23 | 0 | 0.0% | 0 | 23 | — |
| `space_engineering_concept` | 20 | 0 | 0.0% | 0 | 20 | — |
| `geological_feature_type` | 18 | 0 | 0.0% | 0 | 18 | — |
| `assistant_capability` | 18 | 0 | 0.0% | 0 | 18 | — |
| `platform_capability` | 18 | 0 | 0.0% | 0 | 18 | — |
| `graph_view` | 17 | 0 | 0.0% | 0 | 17 | — |
| `operations_function` | 16 | 0 | 0.0% | 0 | 16 | — |
| `research_software` | 16 | 0 | 0.0% | 0 | 16 | — |
| `exoplanet_science_concept` | 16 | 0 | 0.0% | 0 | 16 | — |
| `mission_milestone` | 15 | 0 | 0.0% | 0 | 15 | — |
| `mission_concept` | 15 | 0 | 0.0% | 0 | 15 | — |
| `transient_class` | 15 | 0 | 0.0% | 0 | 15 | — |
| `observing_technique` | 15 | 0 | 0.0% | 0 | 15 | — |
| `mythology_figure` | 14 | 0 | 0.0% | 0 | 14 | — |
| `astronomy_era` | 14 | 0 | 0.0% | 0 | 14 | — |
| `image_collection` | 14 | 0 | 0.0% | 0 | 14 | — |
| `atlas_view` | 14 | 0 | 0.0% | 0 | 14 | — |
| `observing_planner` | 14 | 0 | 0.0% | 0 | 14 | — |
| `astronomy_software` | 13 | 0 | 0.0% | 0 | 13 | — |
| `astrology_sign` | 12 | 0 | 0.0% | 0 | 12 | — |
| `wavelength_band` | 12 | 0 | 0.0% | 0 | 12 | — |
| `instrument_class` | 12 | 0 | 0.0% | 0 | 12 | — |
| `space_infrastructure` | 12 | 0 | 0.0% | 0 | 12 | — |
| `stellar_process` | 12 | 0 | 0.0% | 0 | 12 | — |
| `publication` | 11 | 0 | 0.0% | 0 | 11 | — |
| `satellite_constellation` | 11 | 0 | 0.0% | 0 | 11 | — |
| `time_standard` | 11 | 0 | 0.0% | 0 | 11 | — |
| `alert_system` | 11 | 0 | 0.0% | 0 | 11 | — |
| `space_policy_topic` | 11 | 0 | 0.0% | 0 | 11 | — |
| `orbital_mechanics_concept` | 11 | 0 | 0.0% | 0 | 11 | — |
| `galactic_structure` | 11 | 0 | 0.0% | 0 | 11 | — |
| `astrology_planet` | 10 | 0 | 0.0% | 0 | 10 | — |
| `expedition` | 10 | 0 | 0.0% | 0 | 10 | — |
| `rocket_family` | 10 | 0 | 0.0% | 0 | 10 | — |
| `rocket_stage` | 10 | 0 | 0.0% | 0 | 10 | — |
| `spacecraft_subsystem` | 10 | 0 | 0.0% | 0 | 10 | — |
| `countermeasure` | 10 | 0 | 0.0% | 0 | 10 | — |
| `data_archive` | 10 | 0 | 0.0% | 0 | 10 | — |
| `planetary_process` | 10 | 0 | 0.0% | 0 | 10 | — |
| `image_source` | 9 | 0 | 0.0% | 0 | 9 | — |
| `life_support_technology` | 9 | 0 | 0.0% | 0 | 9 | — |
| `reference_frame` | 9 | 0 | 0.0% | 0 | 9 | — |
| `galactic_dynamics` | 9 | 0 | 0.0% | 0 | 9 | — |
| `solar_feature` | 9 | 0 | 0.0% | 0 | 9 | — |
| `exoplanet_detection_method` | 8 | 0 | 0.0% | 0 | 8 | — |
| `planetary_class` | 8 | 0 | 0.0% | 0 | 8 | — |
| `constellation_family` | 8 | 0 | 0.0% | 0 | 8 | — |
| `tracking_network` | 8 | 0 | 0.0% | 0 | 8 | — |
| `minor_planet_group` | 8 | 0 | 0.0% | 0 | 8 | — |
| `meteorite_group` | 8 | 0 | 0.0% | 0 | 8 | — |
| `antenna` | 8 | 0 | 0.0% | 0 | 8 | — |
| `mission_operations_center` | 8 | 0 | 0.0% | 0 | 8 | — |
| `method_category` | 8 | 0 | 0.0% | 0 | 8 | — |
| `galaxy_morphology` | 8 | 0 | 0.0% | 0 | 8 | — |
| `defense_stage` | 8 | 0 | 0.0% | 0 | 8 | — |
| `interstellar_molecule` | 8 | 0 | 0.0% | 0 | 8 | — |
| `discovery_methodology` | 8 | 0 | 0.0% | 0 | 8 | — |
| `history_theme` | 8 | 0 | 0.0% | 0 | 8 | — |
| `exploration_architecture` | 8 | 0 | 0.0% | 0 | 8 | — |
| `workspace_feature` | 8 | 0 | 0.0% | 0 | 8 | — |
| `solar_region` | 8 | 0 | 0.0% | 0 | 8 | — |
| `coordinate_system` | 8 | 0 | 0.0% | 0 | 8 | — |
| `propellant` | 7 | 0 | 0.0% | 0 | 7 | — |
| `orbit_type` | 7 | 0 | 0.0% | 0 | 7 | — |
| `asteroid_family` | 7 | 0 | 0.0% | 0 | 7 | — |
| `navigation_system` | 7 | 0 | 0.0% | 0 | 7 | — |
| `historic_space_event` | 7 | 0 | 0.0% | 0 | 7 | — |
| `record` | 7 | 0 | 0.0% | 0 | 7 | — |
| `exploration_theme` | 7 | 0 | 0.0% | 0 | 7 | — |
| `instrument_technique` | 7 | 0 | 0.0% | 0 | 7 | — |
| `distance_indicator` | 7 | 0 | 0.0% | 0 | 7 | — |
| `ml_method` | 7 | 0 | 0.0% | 0 | 7 | — |
| `ml_application` | 7 | 0 | 0.0% | 0 | 7 | — |
| `astrochemical_process` | 7 | 0 | 0.0% | 0 | 7 | — |
| `deep_space_challenge` | 7 | 0 | 0.0% | 0 | 7 | — |
| `catalog_family` | 7 | 0 | 0.0% | 0 | 7 | — |
| `meteor_shower` | 6 | 0 | 0.0% | 0 | 6 | — |
| `human_spaceflight_program` | 6 | 0 | 0.0% | 0 | 6 | — |
| `eva` | 6 | 0 | 0.0% | 0 | 6 | — |
| `astronomical_theory` | 6 | 0 | 0.0% | 0 | 6 | — |
| `observational_program` | 6 | 0 | 0.0% | 0 | 6 | — |
| `mission_class` | 6 | 0 | 0.0% | 0 | 6 | — |
| `institution_type` | 6 | 0 | 0.0% | 0 | 6 | — |
| `galactic_process` | 6 | 0 | 0.0% | 0 | 6 | — |
| `cosmic_structure` | 6 | 0 | 0.0% | 0 | 6 | — |
| `astrobiology_topic` | 6 | 0 | 0.0% | 0 | 6 | — |
| `biosignature` | 6 | 0 | 0.0% | 0 | 6 | — |
| `space_weather_impact` | 6 | 0 | 0.0% | 0 | 6 | — |
| `citizen_science_project` | 6 | 0 | 0.0% | 0 | 6 | — |
| `amateur_activity` | 6 | 0 | 0.0% | 0 | 6 | — |
| `observing_equipment` | 6 | 0 | 0.0% | 0 | 6 | — |
| `philosophy_of_science` | 6 | 0 | 0.0% | 0 | 6 | — |
| `nucleosynthesis_process` | 6 | 0 | 0.0% | 0 | 6 | — |
| `research_computing` | 6 | 0 | 0.0% | 0 | 6 | — |
| `astroinformatics_concept` | 6 | 0 | 0.0% | 0 | 6 | — |
| `atlas_overlay` | 6 | 0 | 0.0% | 0 | 6 | — |
| `live_data_source` | 6 | 0 | 0.0% | 0 | 6 | — |
| `astrometric_effect` | 6 | 0 | 0.0% | 0 | 6 | — |
| `cargo_vehicle` | 5 | 0 | 0.0% | 0 | 5 | — |
| `comet_class` | 5 | 0 | 0.0% | 0 | 5 | — |
| `mission_phase` | 5 | 0 | 0.0% | 0 | 5 | — |
| `signal_band` | 5 | 0 | 0.0% | 0 | 5 | — |
| `space_hazard` | 5 | 0 | 0.0% | 0 | 5 | — |
| `geomagnetic_index` | 5 | 0 | 0.0% | 0 | 5 | — |
| `space_biology_topic` | 5 | 0 | 0.0% | 0 | 5 | — |
| `physiological_effect` | 5 | 0 | 0.0% | 0 | 5 | — |
| `infrastructure_domain` | 5 | 0 | 0.0% | 0 | 5 | — |
| `isru_technique` | 5 | 0 | 0.0% | 0 | 5 | — |
| `observation_stage` | 5 | 0 | 0.0% | 0 | 5 | — |
| `habitability_factor` | 5 | 0 | 0.0% | 0 | 5 | — |
| `open_science_practice` | 5 | 0 | 0.0% | 0 | 5 | — |
| `detector_technology` | 5 | 0 | 0.0% | 0 | 5 | — |
| `mm_channel` | 5 | 0 | 0.0% | 0 | 5 | — |
| `interstellar_environment` | 5 | 0 | 0.0% | 0 | 5 | — |
| `space_treaty` | 5 | 0 | 0.0% | 0 | 5 | — |
| `observing_integration` | 5 | 0 | 0.0% | 0 | 5 | — |
| `universe_scene` | 5 | 0 | 0.0% | 0 | 5 | — |
| `space_medicine_topic` | 4 | 0 | 0.0% | 0 | 4 | — |
| `historical_event` | 4 | 0 | 0.0% | 0 | 4 | — |
| `cosmological_model` | 4 | 0 | 0.0% | 0 | 4 | — |
| `seasonal_sky` | 4 | 0 | 0.0% | 0 | 4 | — |
| `near_earth_object` | 4 | 0 | 0.0% | 0 | 4 | — |
| `trojan_group` | 4 | 0 | 0.0% | 0 | 4 | — |
| `orbital_resonance` | 4 | 0 | 0.0% | 0 | 4 | — |
| `meteorite_class` | 4 | 0 | 0.0% | 0 | 4 | — |
| `impact_structure` | 4 | 0 | 0.0% | 0 | 4 | — |
| `hyperbolic_comet` | 4 | 0 | 0.0% | 0 | 4 | — |
| `trajectory_class` | 4 | 0 | 0.0% | 0 | 4 | — |
| `returned_sample` | 4 | 0 | 0.0% | 0 | 4 | — |
| `sample_return_capsule` | 4 | 0 | 0.0% | 0 | 4 | — |
| `ground_station` | 4 | 0 | 0.0% | 0 | 4 | — |
| `communication_system` | 4 | 0 | 0.0% | 0 | 4 | — |
| `radiation_environment` | 4 | 0 | 0.0% | 0 | 4 | — |
| `space_manufacturing_process` | 4 | 0 | 0.0% | 0 | 4 | — |
| `agn_type` | 4 | 0 | 0.0% | 0 | 4 | — |
| `deflection_method` | 4 | 0 | 0.0% | 0 | 4 | — |
| `vo_protocol` | 4 | 0 | 0.0% | 0 | 4 | — |
| `interferometry_technique` | 4 | 0 | 0.0% | 0 | 4 | — |
| `cosmological_parameter` | 4 | 0 | 0.0% | 0 | 4 | — |
| `ml_workflow` | 4 | 0 | 0.0% | 0 | 4 | — |
| `outreach_activity` | 4 | 0 | 0.0% | 0 | 4 | — |
| `gw_data_product` | 4 | 0 | 0.0% | 0 | 4 | — |
| `space_economy_topic` | 4 | 0 | 0.0% | 0 | 4 | — |
| `heliosphere_structure` | 4 | 0 | 0.0% | 0 | 4 | — |
| `neutron_star` | 4 | 0 | 0.0% | 0 | 4 | — |
| `docking_system` | 3 | 0 | 0.0% | 0 | 3 | — |
| `observing_site` | 3 | 0 | 0.0% | 0 | 3 | — |
| `impact_event` | 3 | 0 | 0.0% | 0 | 3 | — |
| `interstellar_object` | 3 | 0 | 0.0% | 0 | 3 | — |
| `interstellar_detection_method` | 3 | 0 | 0.0% | 0 | 3 | — |
| `planetary_protection` | 3 | 0 | 0.0% | 0 | 3 | — |
| `data_standard` | 3 | 0 | 0.0% | 0 | 3 | — |
| `gw_detection_method` | 3 | 0 | 0.0% | 0 | 3 | — |
| `gw_followup_stage` | 3 | 0 | 0.0% | 0 | 3 | — |
| `planetary_interior` | 3 | 0 | 0.0% | 0 | 3 | — |
| `ephemeris_system` | 3 | 0 | 0.0% | 0 | 3 | — |
| `designation_system` | 3 | 0 | 0.0% | 0 | 3 | — |
| `scientific_award` | 2 | 0 | 0.0% | 0 | 2 | — |
| `image_license` | 2 | 0 | 0.0% | 0 | 2 | — |
| `small_body_reservoir` | 2 | 0 | 0.0% | 0 | 2 | — |
| `active_asteroid` | 2 | 0 | 0.0% | 0 | 2 | — |
| `dormant_comet` | 2 | 0 | 0.0% | 0 | 2 | — |
| `fireball` | 2 | 0 | 0.0% | 0 | 2 | — |
| `recovery_site` | 2 | 0 | 0.0% | 0 | 2 | — |
| `risk_scale` | 2 | 0 | 0.0% | 0 | 2 | — |
| `location` | 1 | 0 | 0.0% | 0 | 1 | — |
| `mythology_story` | 1 | 0 | 0.0% | 0 | 1 | — |
| `life_support_system` | 1 | 0 | 0.0% | 0 | 1 | — |
| `space_experiment` | 1 | 0 | 0.0% | 0 | 1 | — |
| `exoplanet_catalogue` | 1 | 0 | 0.0% | 0 | 1 | — |
| `habitable_zone_candidate` | 1 | 0 | 0.0% | 0 | 1 | — |
| `comet_family` | 1 | 0 | 0.0% | 0 | 1 | — |
| `interstellar_candidate` | 1 | 0 | 0.0% | 0 | 1 | — |
| `science_campaign` | 1 | 0 | 0.0% | 0 | 1 | — |
| `agn_model` | 1 | 0 | 0.0% | 0 | 1 | — |
| `vo_framework` | 1 | 0 | 0.0% | 0 | 1 | — |

## Enrichment targets (image-eligible types with zero-image entities)

| Type | Zero-image entities | Recommended action |
| --- | ---: | --- |
| `star` | 2970 | famous named stars only — sky-field/survey; never a fake close-up |
| `star_cluster` | 356 | Hubble/DSS survey imagery |
| `galaxy` | 116 | Hubble/Webb/ESO imagery via NASA + Wikimedia |
| `organization` | 80 | logo/facility (verified license only) |
| `nebula` | 78 | Hubble/Webb imagery |
| `constellation` | 62 | IAU star chart / real sky-field |
| `scientific_instrument` | 33 | verified imagery where an authentic view exists; otherwise leave empty (legitimate) |
| `rocket_engine` | 26 | verified imagery where an authentic view exists; otherwise leave empty (legitimate) |
| `launch_pad` | 24 | verified imagery where an authentic view exists; otherwise leave empty (legitimate) |
| `asteroid` | 23 | mission flyby / radar imagery (visited bodies only) |
| `historical_discovery` | 22 | verified imagery where an authentic view exists; otherwise leave empty (legitimate) |
| `scientific_image` | 20 | verified imagery where an authentic view exists; otherwise leave empty (legitimate) |
| `station_module` | 17 | verified imagery where an authentic view exists; otherwise leave empty (legitimate) |
| `satellite` | 15 | official imagery (verified only) |
| `launch_site` | 15 | verified imagery where an authentic view exists; otherwise leave empty (legitimate) |
| `observatory` | 13 | site photography (Wikimedia/ESO) |
| `sky_survey` | 12 | verified imagery where an authentic view exists; otherwise leave empty (legitimate) |
| `asterism` | 12 | verified imagery where an authentic view exists; otherwise leave empty (legitimate) |
| `tracking_station` | 12 | verified imagery where an authentic view exists; otherwise leave empty (legitimate) |
| `telescope` | 11 | hardware/site photography |
| `space_station` | 11 | verified imagery where an authentic view exists; otherwise leave empty (legitimate) |
| `crew_vehicle` | 11 | verified imagery where an authentic view exists; otherwise leave empty (legitimate) |
| `meteorite` | 8 | specimen photography (Wikimedia/institutional) |
| `space_mission` | 6 | official mission photography |
| `launch_vehicle` | 4 | launch/hardware photography |
| `comet` | 1 | mission/observatory imagery |

## Factual completeness (by domain)

Numeric/physical characteristics are rendered from the domain catalogues; where a value is unknown it stays blank (never fabricated).
- **Rich catalogue data (rendered as StatGrid/facts):** solar-system bodies (mass, radius, density, gravity, orbit, temperature…), stars (spectral type, magnitude, distance, coordinates…), exoplanets (host, method, period, radius…), deep-sky (catalogue ids, distance, magnitude, morphology…), missions/rockets/observatories.
- **Blocked by lack of authoritative data:** any characteristic with no source-backed value in the catalogue is intentionally left empty. Adding new measurements requires an authoritative-source ingestion (NASA/JPL/ESA/SIMBAD/VizieR/MPC/Exoplanet Archive), tracked as a follow-up — it is out of scope to invent them.

_Baseline: 487 entities imaged / 7351 total._
