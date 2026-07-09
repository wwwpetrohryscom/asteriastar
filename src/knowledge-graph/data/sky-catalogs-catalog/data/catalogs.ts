import { cd, type CdRecord } from "@/knowledge-graph/data/sky-catalogs-catalog/types";

/**
 * The professional catalogues that the graph previously carried only as designation *fields*, now
 * modelled as first-class `catalog` entities. Each links to its catalog family, to the archives and
 * surveys that distribute it, and to the existing catalogues it complements. Only well-established
 * catalogue facts are stated; uncertain counts are described rather than invented.
 */
export const catalogs: CdRecord[] = [
  cd("catalog", {
    slug: "caldwell",
    name: "Caldwell Catalogue",
    abbrev: "C",
    epochLabel: "1995",
    altNames: ["Caldwell"],
    description:
      "A list of 109 bright deep-sky objects compiled by the British amateur astronomer Sir Patrick Moore to complement the Messier Catalogue, which it deliberately avoids duplicating. Ordered by declination and spanning both hemispheres, it gathers showpiece galaxies, clusters, and nebulae — such as the Hyades and NGC 869/884 — that Messier omitted. Objects carry a 'C' number.",
    relatedKeys: ["catalog_family:deep-sky-visual-catalogs", "catalog:messier", "astronomer:charles-messier"],
    highlights: ["109 showpiece objects Messier left out"],
  }),
  cd("catalog", {
    slug: "barnard",
    name: "Barnard Catalogue of Dark Nebulae",
    abbrev: "B",
    epochLabel: "1919",
    altNames: ["Barnard Catalogue", "Barnard's Catalogue of Dark Markings"],
    description:
      "The first systematic catalogue of dark nebulae, compiled by Edward Emerson Barnard from his pioneering photographs of the Milky Way. The 1919 list of 182 objects was later extended to 370; each 'B' object is a cloud of interstellar dust silhouetted against the star fields behind it, such as B33, the Horsehead Nebula.",
    relatedKeys: ["catalog_family:nebula-catalogs", "catalog:sharpless", "data_archive:vizier"],
    highlights: ["The first catalogue of dark, dust-clouded nebulae"],
  }),
  cd("catalog", {
    slug: "sharpless",
    name: "Sharpless Catalogue",
    abbrev: "Sh2",
    epochLabel: "1959",
    altNames: ["Sh2", "Sharpless HII Region Catalogue"],
    description:
      "A catalogue of HII regions — clouds of ionised hydrogen glowing around hot young stars — compiled by Stewart Sharpless. Its second edition (Sh2, 1959) lists 313 emission nebulae across the northern Milky Way, including many of the sky's great star-forming complexes. Objects carry an 'Sh2' number.",
    relatedKeys: ["catalog_family:nebula-catalogs", "data_archive:vizier"],
    highlights: ["313 glowing HII regions of the northern Milky Way"],
  }),
  cd("catalog", {
    slug: "abell",
    name: "Abell Catalogue",
    abbrev: "Abell",
    altNames: ["Abell Cluster Catalogue"],
    description:
      "Two catalogues compiled by George Abell. The 1958 catalogue of rich clusters of galaxies — later extended southward — became the standard reference for galaxy clusters, listing thousands of the densest concentrations in the Universe. Separately, Abell catalogued 86 large, faint planetary nebulae. Objects carry an 'Abell' number in both.",
    relatedKeys: ["catalog_family:nebula-catalogs", "catalog_family:galaxy-catalogs", "data_archive:ned"],
    highlights: ["The standard catalogue of rich galaxy clusters — and 86 planetary nebulae"],
  }),
  cd("catalog", {
    slug: "pgc-catalogue",
    name: "Principal Galaxies Catalogue (PGC)",
    abbrev: "PGC",
    epochLabel: "1989",
    altNames: ["PGC", "LEDA"],
    description:
      "A comprehensive catalogue of galaxies begun by Paturel and collaborators, providing a unique 'PGC' identifier, position, and basic parameters for tens of thousands of galaxies. It forms the backbone of the HyperLEDA database, and its PGC numbers are widely used as a standard cross-reference for galaxies lacking a common name.",
    relatedKeys: ["catalog_family:galaxy-catalogs", "data_archive:cds", "catalog:ugc-catalogue"],
    highlights: ["The standard identifier for galaxies without a common name"],
  }),
  cd("catalog", {
    slug: "ugc-catalogue",
    name: "Uppsala General Catalogue of Galaxies (UGC)",
    abbrev: "UGC",
    epochLabel: "1973",
    altNames: ["UGC"],
    description:
      "A catalogue of 12,921 galaxies north of declination −02°30′, compiled by Peter Nilson at Uppsala from the Palomar Sky Survey. Selected mainly by apparent size, it was for decades the most complete catalogue of nearby northern galaxies and remains a common cross-reference; objects carry a 'UGC' number.",
    relatedKeys: ["catalog_family:galaxy-catalogs", "data_archive:vizier", "catalog:pgc-catalogue"],
    highlights: ["12,921 northern galaxies from the Palomar survey"],
  }),
  cd("catalog", {
    slug: "gliese-catalogue",
    name: "Gliese Catalogue of Nearby Stars",
    abbrev: "GJ",
    altNames: ["Gliese Catalogue", "CNS", "Gl"],
    description:
      "The standard catalogue of stars in the immediate solar neighbourhood, begun by Wilhelm Gliese and later extended with Hartmut Jahreiß. It lists the stars known to lie within about 25 parsecs of the Sun, with distances and motions; its 'GJ' (or older 'Gl') numbers are the usual designations for nearby red dwarfs and other close stars.",
    relatedKeys: ["catalog_family:nearby-star-catalogs", "data_archive:cds", "catalog:lhs-catalogue"],
    highlights: ["The catalogue of the Sun's stellar neighbourhood, within ~25 pc"],
  }),
  cd("catalog", {
    slug: "tycho-catalogue",
    name: "Tycho-2 Catalogue",
    abbrev: "TYC",
    epochLabel: "2000",
    altNames: ["Tycho-2", "Tycho Catalogue"],
    description:
      "An astrometric and photometric catalogue of about 2.5 million of the brightest stars, derived from the star-mapper data of ESA's Hipparcos satellite. Named in honour of Tycho Brahe, it provides positions, proper motions, and two-colour photometry, and its 'TYC' identifiers are a standard reference for stars fainter than the main Hipparcos catalogue.",
    relatedKeys: ["catalog_family:astrometric-star-catalogs", "catalog:hipparcos-catalogue", "astronomer:tycho-brahe", "organization:esa"],
    highlights: ["~2.5 million stars from the Hipparcos star mapper"],
  }),
  cd("catalog", {
    slug: "sao-catalogue",
    name: "SAO Star Catalog",
    abbrev: "SAO",
    epochLabel: "1966",
    altNames: ["Smithsonian Astrophysical Observatory Star Catalog"],
    description:
      "A catalogue of 258,997 stars compiled by the Smithsonian Astrophysical Observatory, combining earlier positional catalogues to support satellite tracking. Its dense, uniform coverage and widely printed star atlas made 'SAO' numbers a long-standing standard designation for stars down to about ninth magnitude.",
    relatedKeys: ["catalog_family:astrometric-star-catalogs", "organization:sao", "data_archive:vizier", "catalog:henry-draper-catalogue"],
    highlights: ["258,997 stars — a long-standing positional standard"],
  }),
  cd("catalog", {
    slug: "gcvs",
    name: "General Catalogue of Variable Stars (GCVS)",
    abbrev: "GCVS",
    altNames: ["GCVS"],
    description:
      "The authoritative catalogue of variable stars, first published in Moscow in 1948 and maintained since at the Sternberg Astronomical Institute. It assigns official variable-star designations and records variability type, period, and amplitude for tens of thousands of stars, serving as the reference for the naming of newly confirmed variables.",
    relatedKeys: ["catalog_family:variable-and-double-star-catalogs", "designation_system:variable-star-designation", "data_archive:vizier"],
    highlights: ["The authority for naming and classifying variable stars"],
  }),
  cd("catalog", {
    slug: "wds",
    name: "Washington Double Star Catalog (WDS)",
    abbrev: "WDS",
    altNames: ["WDS"],
    description:
      "The principal database of double and multiple stars, maintained by the United States Naval Observatory. It gathers positions, separations, position angles, and magnitudes for well over a hundred thousand pairs from centuries of measurements, and its 'WDS' identifiers are the standard reference for binary and multiple systems.",
    relatedKeys: ["catalog_family:variable-and-double-star-catalogs", "data_archive:vizier"],
    sources: ["usno"],
    highlights: ["The master reference for double and multiple stars"],
  }),
  cd("catalog", {
    slug: "lhs-catalogue",
    name: "Luyten Half-Second Catalogue (LHS)",
    abbrev: "LHS",
    epochLabel: "1979",
    altNames: ["LHS", "Luyten Half-Second"],
    description:
      "A catalogue of stars with large proper motions — at least half an arcsecond per year — compiled by Willem Luyten from decades of photographic plate comparisons. Because high proper motion usually signals a nearby star, the 'LHS' catalogue is a rich hunting ground for the Sun's closest neighbours, including many faint red and white dwarfs.",
    relatedKeys: ["catalog_family:nearby-star-catalogs", "catalog:wolf-catalogue", "data_archive:vizier"],
    highlights: ["Stars racing across the sky — a map of the solar neighbourhood"],
  }),
  cd("catalog", {
    slug: "wolf-catalogue",
    name: "Wolf Catalogue of High-Proper-Motion Stars",
    abbrev: "Wolf",
    altNames: ["Wolf Catalogue"],
    description:
      "An early catalogue of high-proper-motion stars assembled by Max Wolf, a pioneer of astrophotography, from his survey of moving stars. Its 'Wolf' numbers survive as designations for several well-known nearby stars — most famously Wolf 359, one of the closest stars to the Sun.",
    relatedKeys: ["catalog_family:nearby-star-catalogs", "catalog:lhs-catalogue", "data_archive:vizier"],
    highlights: ["Home of Wolf 359 and other nearby moving stars"],
  }),
  cd("catalog", {
    slug: "bonner-durchmusterung",
    name: "Bonner Durchmusterung (BD)",
    abbrev: "BD",
    epochLabel: "1863",
    altNames: ["BD", "Bonner Durchmusterung", "Argelander Durchmusterung"],
    description:
      "The great pre-photographic survey of the northern sky, carried out under Friedrich Argelander at Bonn and published from 1863. It recorded positions and magnitudes for about 325,000 stars to roughly ninth magnitude — the most comprehensive star catalogue of its era — and its 'BD' designations remain in use for naked-eye and telescopic stars today.",
    relatedKeys: ["catalog_family:astrometric-star-catalogs", "data_archive:vizier"],
    highlights: ["~325,000 stars — the greatest survey before photography"],
  }),
];
