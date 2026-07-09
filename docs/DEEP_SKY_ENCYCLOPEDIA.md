# Deep Sky Objects Encyclopedia (Program CE)

The classification layer for the deep sky — the taxonomy the graph's 619+ galaxies, nebulae, and star
clusters lacked. Built on the platform's honesty envelope: only well-established astrophysics is stated,
distances and sizes appear only where firmly measured, and nothing is fabricated.

## Reuse-first

The object layer is already comprehensive, so CE adds **no bulk objects**. It reuses what exists and adds
only the missing *class* layer:

- The **619+ deep-sky objects** (`galaxy`, `nebula`, `star_cluster` — with coordinates, magnitudes,
  sizes, constellations, and catalogue ids), the **complete galaxy morphologies** (`galaxy_morphology` —
  all eight already present), the **interstellar-medium concepts** (`interstellar_environment:molecular-cloud`,
  `star-forming-region`, `interstellar-dust`), the **stellar-death processes and supernova classes**
  (`stellar_process:planetary-nebula-ejection`, `transient_class:core-collapse-supernova`,
  `type-ia-supernova`), the **Messier/NGC/Sharpless/Barnard catalogues**, and the **88 constellations** —
  all referenced via `relatedKeys`, none duplicated.

## New entities (no new EntityType)

CE introduces no new EntityType — it reuses `astrophysical_object_class` and `nebula`:

- **Deep-sky object classes** (11) — `astrophysical_object_class`: the deep-sky-object umbrella, open
  cluster, globular cluster, stellar association, emission nebula, HII region, reflection nebula, dark
  nebula, Bok globule, planetary nebula, and supernova remnant. (The existing `astrophysical_object_class`
  members were all compact-object / AGN / large-scale-structure classes; none were DSO types.)
- **Featured objects** (2) — `nebula`: the Horsehead Nebula (Barnard 33, in Orion, against IC 434) and
  the Cone Nebula (in NGC 2264, Monoceros) — the two genuinely-missing famous objects.

Each class links to canonical example objects already in the graph, the interstellar-medium and
stellar-death concepts it depends on, and its sibling classes, producing `associated_with` edges deduped
against every existing relation.

## Surfaces

- Hub `/deep-sky-encyclopedia`, entry pages `/deep-sky-encyclopedia/[slug]`, and two discovery hubs
  (`object-classes`, `featured-objects`).
- Resolved through the Scientific Data Engine (`engine.deepSkyEncyclopedia`), reusing the shared quality,
  review, provenance, connections, breadcrumb, and JSON-LD (`DefinedTerm`) infrastructure. Accent: nebula.
- A `deep-sky-object-classes` dataset and a "The Deep-Sky Menagerie" learning path surface the layer in
  `/datasets`, `/learn`, and `/llms.txt`.

## Honesty

Distances are given only as accepted approximate values (the Horsehead at ~1,500 ly, the Cone at ~2,700
ly) and flagged as approximate. Concepts already in the graph (molecular clouds, star-forming regions,
interstellar dust, the galaxy morphologies) are reused rather than re-created. Nothing is fabricated.
