import { ce, type CeRecord } from "@/knowledge-graph/data/deep-sky-encyclopedia-catalog/types";

/**
 * Deep-sky object classes (astrophysical_object_class) — the taxonomy the graph's 619+ deep-sky objects
 * lacked. Each class links to canonical example objects already in the graph, to the interstellar-medium
 * and stellar-death concepts it depends on, and to sibling classes. Only well-established astrophysics is
 * stated; nothing is fabricated.
 */
export const classes: CeRecord[] = [
  ce("dso-class", {
    slug: "deep-sky-object",
    name: "Deep-Sky Object",
    altNames: ["DSO"],
    description:
      "A catch-all term for any object beyond the Solar System that is neither a single star nor a planet — the star clusters, nebulae, and galaxies that fill catalogues from Messier to the NGC. Deep-sky objects are the classic targets of the amateur telescope and the workhorses of stellar and galactic astrophysics.",
    relatedKeys: ["astrophysical_object_class:open-cluster", "astrophysical_object_class:globular-cluster", "astrophysical_object_class:emission-nebula", "astrophysical_object_class:planetary-nebula", "catalog:messier", "catalog:ngc"],
    highlights: ["Clusters, nebulae, and galaxies — the deep sky beyond the stars"],
  }),
  ce("dso-class", {
    slug: "open-cluster",
    name: "Open Cluster",
    altNames: ["Galactic cluster"],
    prototype: "The Pleiades (M45)",
    description:
      "A loose, irregular group of a few dozen to a few thousand stars born together from the same molecular cloud, found in the disk of the Galaxy. Their stars share an age and composition, making open clusters key laboratories for stellar evolution; because they are only weakly bound, they gradually disperse over hundreds of millions of years.",
    relatedKeys: ["star_cluster:pleiades", "star_cluster:messier-44", "interstellar_environment:star-forming-region", "astrophysical_object_class:stellar-association", "astrophysical_object_class:globular-cluster"],
    highlights: ["Young sibling stars in the galactic disk — e.g. the Pleiades"],
  }),
  ce("dso-class", {
    slug: "globular-cluster",
    name: "Globular Cluster",
    prototype: "Omega Centauri",
    description:
      "A dense, roughly spherical swarm of tens of thousands to millions of very old stars, tightly bound by gravity and orbiting in the halo of a galaxy. Globular clusters are among the oldest structures in the Universe, and their tightly packed, coeval stars make them benchmarks for stellar ages and the early history of the Galaxy.",
    relatedKeys: ["star_cluster:omega-centauri", "star_cluster:messier-13", "star_cluster:ngc-104", "astrophysical_object_class:open-cluster"],
    highlights: ["Ancient million-star swarms in the galactic halo — e.g. Omega Centauri"],
  }),
  ce("dso-class", {
    slug: "stellar-association",
    name: "Stellar Association",
    altNames: ["OB association"],
    description:
      "A loose grouping of young, massive stars that formed together but are not gravitationally bound, so they drift apart over tens of millions of years. OB associations trace the sites of recent star formation along a galaxy's spiral arms and are often still embedded in the gas of their parent clouds.",
    relatedKeys: ["astrophysical_object_class:open-cluster", "interstellar_environment:star-forming-region", "interstellar_environment:molecular-cloud"],
    highlights: ["Unbound young stars drifting from their birthplace"],
  }),
  ce("dso-class", {
    slug: "emission-nebula",
    name: "Emission Nebula",
    prototype: "The Orion Nebula (M42)",
    description:
      "A cloud of interstellar gas that glows with its own light, ionised by the ultraviolet radiation of nearby hot stars so that it re-emits in characteristic lines — most famously the red of hydrogen. Emission nebulae mark regions of active star formation and include the great HII regions of the Galaxy.",
    relatedKeys: ["nebula:orion-nebula", "nebula:lagoon-nebula", "astrophysical_object_class:hii-region", "interstellar_environment:star-forming-region"],
    highlights: ["Gas glowing red where hot young stars ionise it"],
  }),
  ce("dso-class", {
    slug: "hii-region",
    name: "HII Region",
    altNames: ["H II region"],
    prototype: "The Orion Nebula (M42)",
    description:
      "A large cloud of ionised atomic hydrogen (H II) surrounding one or more hot O- and B-type stars, whose ultraviolet light strips the electrons from the surrounding gas. HII regions are the glowing signposts of massive-star formation, and their sizes and spectra are used to trace star formation across galaxies.",
    relatedKeys: ["nebula:orion-nebula", "astrophysical_object_class:emission-nebula", "catalog:sharpless", "interstellar_environment:star-forming-region"],
    highlights: ["Ionised hydrogen around newborn massive stars"],
  }),
  ce("dso-class", {
    slug: "reflection-nebula",
    name: "Reflection Nebula",
    prototype: "The nebulosity around the Pleiades",
    description:
      "A cloud of interstellar dust that shines not by its own emission but by scattering the light of nearby stars. Because fine dust scatters blue light most efficiently, reflection nebulae typically appear blue — as in the wisps of nebulosity draped around the Pleiades.",
    relatedKeys: ["star_cluster:pleiades", "interstellar_environment:interstellar-dust", "astrophysical_object_class:emission-nebula"],
    highlights: ["Dust glowing blue with reflected starlight"],
  }),
  ce("dso-class", {
    slug: "dark-nebula",
    name: "Dark Nebula",
    altNames: ["Absorption nebula"],
    prototype: "The Horsehead Nebula (B33)",
    description:
      "A dense cloud of interstellar dust so opaque that it blots out the light of the stars and glowing gas behind it, appearing as a dark silhouette. Catalogued systematically by E. E. Barnard, dark nebulae are the cold, dusty reservoirs — often molecular clouds — from which new stars condense.",
    relatedKeys: ["nebula:horsehead-nebula", "catalog:barnard", "interstellar_environment:interstellar-dust", "interstellar_environment:molecular-cloud", "astrophysical_object_class:bok-globule"],
    highlights: ["Opaque dust silhouetted against the light behind it"],
  }),
  ce("dso-class", {
    slug: "bok-globule",
    name: "Bok Globule",
    description:
      "A small, dense, isolated cloud of cold gas and dust — a compact kind of dark nebula, named for Bart Bok — within which one or a few stars are collapsing into being. Bok globules are among the coldest objects in the Universe and are studied as the birthplaces of low-mass stars.",
    relatedKeys: ["astrophysical_object_class:dark-nebula", "interstellar_environment:molecular-cloud", "interstellar_environment:star-forming-region"],
    highlights: ["Cold, dense dust clouds where single stars are born"],
  }),
  ce("dso-class", {
    slug: "planetary-nebula",
    name: "Planetary Nebula",
    prototype: "The Ring Nebula (M57)",
    description:
      "The glowing shell of gas cast off by a dying Sun-like star as it becomes a white dwarf, ionised and lit up by the hot stellar core at its centre. Despite the name — coined because their round disks resembled planets in early telescopes — planetary nebulae have nothing to do with planets; they are a brief, beautiful final phase of low- and intermediate-mass stars.",
    relatedKeys: ["nebula:ring-nebula", "nebula:messier-27", "nebula:ngc-7293", "stellar_process:planetary-nebula-ejection", "astrophysical_object_class:white-dwarf"],
    highlights: ["The cast-off shell of a dying Sun-like star — e.g. the Ring Nebula"],
  }),
  ce("dso-class", {
    slug: "supernova-remnant",
    name: "Supernova Remnant",
    altNames: ["SNR"],
    prototype: "The Crab Nebula (M1)",
    description:
      "The expanding cloud of debris left behind when a star explodes as a supernova, sweeping up and shock-heating the surrounding interstellar medium. Supernova remnants seed the galaxy with heavy elements, accelerate cosmic rays, and — like the Crab — can harbour the neutron star born in the collapse.",
    relatedKeys: ["nebula:crab-nebula", "nebula:ngc-6960", "transient_class:core-collapse-supernova", "transient_class:type-ia-supernova"],
    highlights: ["The shock-heated wreckage of an exploded star — e.g. the Crab"],
  }),
];
