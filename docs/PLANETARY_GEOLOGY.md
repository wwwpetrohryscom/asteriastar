# Planetary Geology & Surface Features Encyclopedia (Program AI)

The geology of the worlds of the Solar System — the classes of geological feature and the
named features themselves. Reuses the `surface_feature` entities already in the graph and the
planets, moons, and dwarf planets; adds the feature-type entities and new named features.

## Data model
One new entity type (`geological_feature_type`), reusing `surface_feature`; no new relations
(reuse `member_of_group`, `located_on`, `associated_with`):

| Kind | Graph type | Count |
| --- | --- | --- |
| Feature type | `geological_feature_type` (new) | 18 |
| Feature (new) | `surface_feature` (reused type) | 26 |
| Feature (existing, enriched) | `surface_feature` | 5 |

**44 new entities, 74 relations.** New features are `member_of_group` their type and
`located_on` their reused body; the 5 existing features (Olympus Mons, Valles Marineris,
Tycho, Mare Tranquillitatis, South Pole–Aitken) are enriched with a `member_of_group` link
to their type, never recreated.

## Pages, data, validation
`/planetary-geology` hub, adaptive `/planetary-geology/{slug}` (types and features share one
route), and 5 discovery hubs. Two datasets (`geological-feature-types`, `surface-features`);
the `understanding-planetary-geology` 12-lesson learning path. `validatePlanetaryGeology()`
checks duplicate ids, cross-kind slug uniqueness, feature→type resolution, body-id type, the
reused-enrichment mapping, and no isolated nodes — plus a graph-endpoint check.

## Coverage
Named features span Mars (Tharsis, Hellas, Gale, Jezero, Kasei Valles, Olympia Undae), the
Moon (Imbrium, Copernicus), Mercury (Caloris, Discovery Rupes), Venus (Maxwell Montes,
Aphrodite Terra, Artemis Corona, Alpha Regio), Ceres (Occator, Ahuna Mons), Vesta
(Rheasilvia), and the icy worlds (Conamara Chaos, Uruk Sulcus, Valhalla, Tiger Stripes,
Kraken Mare, Ontario Lacus, Cantaloupe Terrain, Sputnik Planitia, Tenzing Montes).
