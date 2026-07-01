import type { CatalogueRecord } from "@/knowledge-graph/data/history-catalog/types";

/**
 * Historical and modern star/deep-sky catalogues and classification systems.
 * `existing: true` reuses a catalogue already in the graph (catalog:messier,
 * catalog:ngc); the others are created as new catalog entities.
 */
export const CATALOGUES: CatalogueRecord[] = [
  {
    slug: "almagest-star-catalogue",
    name: "Almagest Star Catalogue",
    year: 150,
    yearApprox: true,
    by: ["ptolemy"],
    count: "1,022 stars",
    eraSlug: "roman-astronomy",
    description:
      "The star catalogue embedded in Ptolemy's Almagest, listing over a thousand stars in 48 constellations with positions and magnitudes. It built on Hipparchus's earlier catalogue and defined the classical sky for centuries.",
    sources: ["britannica", "iau"],
  },
  {
    slug: "zij-i-sultani",
    name: "Zij-i-Sultani",
    year: 1437,
    by: ["ulugh-beg"],
    count: "1,018 stars",
    eraSlug: "islamic-golden-age",
    description:
      "Ulugh Beg's star catalogue, compiled at the Samarkand observatory, giving fresh naked-eye positions for over a thousand stars. It was the most accurate star catalogue produced between Ptolemy and Tycho Brahe.",
    sources: ["britannica", "iau"],
  },
  {
    slug: "rudolphine-tables",
    name: "Rudolphine Tables",
    year: 1627,
    by: ["johannes-kepler"],
    eraSlug: "scientific-revolution",
    description:
      "The planetary tables completed by Johannes Kepler from Tycho Brahe's observations, named for Emperor Rudolf II. Built on elliptical orbits, they were far more accurate than any predecessor and remained in use for over a century.",
    sources: ["britannica"],
  },
  {
    slug: "messier",
    name: "Messier Catalogue",
    existing: true,
    year: 1781,
    by: ["charles-messier"],
    count: "110 objects",
    eraSlug: "modern-astronomy",
    description:
      "Charles Messier's list of about 110 nebulae, galaxies, and star clusters, originally compiled so comet-hunters would not mistake them for comets. Its entries — M31, M42, M45, and the rest — remain among the most observed objects in the sky.",
    sources: ["openngc", "britannica"],
  },
  {
    slug: "ngc",
    name: "New General Catalogue (NGC)",
    existing: true,
    year: 1888,
    count: "7,840 objects",
    eraSlug: "modern-astronomy",
    description:
      "The New General Catalogue of Nebulae and Clusters of Stars, compiled by J. L. E. Dreyer in 1888 from the deep-sky surveys of William and John Herschel and others. With its Index Catalogues it remains a primary designation system for deep-sky objects.",
    sources: ["openngc", "britannica"],
  },
  {
    slug: "index-catalogue",
    name: "Index Catalogue (IC)",
    year: 1908,
    eraSlug: "modern-astronomy",
    count: "5,386 objects",
    description:
      "The two Index Catalogues (1895 and 1908), compiled by J. L. E. Dreyer as supplements to the New General Catalogue, adding thousands of nebulae and clusters discovered with photography and larger telescopes.",
    sources: ["openngc"],
  },
  {
    slug: "henry-draper-catalogue",
    name: "Henry Draper Catalogue",
    year: 1924,
    by: ["annie-jump-cannon", "edward-pickering"],
    count: "~225,000 stars",
    eraSlug: "modern-astronomy",
    description:
      "A vast catalogue of stellar spectra produced at Harvard, with classifications largely by Annie Jump Cannon. Named in memory of astrophotography pioneer Henry Draper, it gave the 'HD' designations still used for stars today.",
    sources: ["nasa", "britannica"],
  },
  {
    slug: "harvard-classification",
    name: "Harvard Spectral Classification",
    year: 1901,
    by: ["annie-jump-cannon", "edward-pickering"],
    eraSlug: "modern-astronomy",
    description:
      "The system that orders stars by the appearance of their spectra into the temperature sequence O B A F G K M, developed at Harvard under Edward Pickering and brought to its final form by Annie Jump Cannon. It remains the basis of stellar classification.",
    sources: ["nasa", "britannica"],
  },
  {
    slug: "yerkes-classification",
    name: "Yerkes (MKK) Classification",
    year: 1943,
    eraSlug: "modern-astronomy",
    description:
      "The two-dimensional classification developed by Morgan, Keenan, and Kellman at Yerkes Observatory, adding a luminosity class (I–V) to the Harvard temperature type. It distinguishes giants from dwarfs and is the modern standard for spectral classification.",
    sources: ["ads", "britannica"],
  },
  {
    slug: "hipparcos-catalogue",
    name: "Hipparcos Catalogue",
    year: 1997,
    eraSlug: "space-age-astronomy",
    count: "118,218 stars",
    missionId: "organization:esa",
    description:
      "The catalogue produced by ESA's Hipparcos mission, the first space astrometry survey, giving high-precision parallaxes, positions, and magnitudes. It established the modern distance scale of the nearby Galaxy.",
    sources: ["hipparcos", "esa"],
  },
  {
    slug: "gaia-catalogue",
    name: "Gaia Catalogue",
    year: 2016,
    eraSlug: "contemporary-astronomy",
    count: "~1.8 billion sources",
    missionId: "space_telescope:gaia",
    description:
      "The catalogues from ESA's Gaia mission, mapping the positions, distances, motions, and brightnesses of nearly two billion stars. Gaia is the most precise and comprehensive astrometric survey ever made, transforming nearly every field of astronomy.",
    sources: ["gaia", "esa"],
  },
];
