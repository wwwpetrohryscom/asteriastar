import { referenceEnvelope, preparedEnvelope, type Enveloped } from "@/platform/live-sky/schema";
import type { EclipseType, Eclipse } from "@/platform/live-sky/models";

const SUN = "star:sun", MOON = "moon:the-moon", EARTH = "planet:earth";

/** Reference: the kinds of eclipse and their geometry (timeless facts). */
export const ECLIPSE_TYPES: EclipseType[] = [
  { kind: "total-solar", family: "solar", name: "Total Solar Eclipse", moonEntityId: MOON, earthEntityId: EARTH, sunEntityId: SUN,
    description: "The Moon completely covers the Sun's disc along a narrow path of totality, revealing the corona. Only safe to view with the naked eye during the brief total phase." },
  { kind: "annular-solar", family: "solar", name: "Annular Solar Eclipse", moonEntityId: MOON, earthEntityId: EARTH, sunEntityId: SUN,
    description: "The Moon is near apogee and too small to cover the Sun, leaving a bright 'ring of fire'. Never safe to view without a solar filter." },
  { kind: "partial-solar", family: "solar", name: "Partial Solar Eclipse", moonEntityId: MOON, earthEntityId: EARTH, sunEntityId: SUN,
    description: "The Moon covers only part of the Sun. Requires certified solar filters throughout." },
  { kind: "hybrid-solar", family: "solar", name: "Hybrid Solar Eclipse", moonEntityId: MOON, earthEntityId: EARTH, sunEntityId: SUN,
    description: "A rare eclipse that shifts between annular and total along its path." },
  { kind: "total-lunar", family: "lunar", name: "Total Lunar Eclipse", moonEntityId: MOON, earthEntityId: EARTH,
    description: "The Moon passes fully into Earth's umbral shadow and often turns coppery red (a 'blood Moon'). Completely safe to watch with the naked eye." },
  { kind: "partial-lunar", family: "lunar", name: "Partial Lunar Eclipse", moonEntityId: MOON, earthEntityId: EARTH,
    description: "Only part of the Moon enters Earth's umbra, leaving a dark bite on the lunar disc." },
  { kind: "penumbral-lunar", family: "lunar", name: "Penumbral Lunar Eclipse", moonEntityId: MOON, earthEntityId: EARTH,
    description: "The Moon passes through Earth's faint outer shadow, producing only a subtle shading." },
];

export const eclipses = {
  types: ECLIPSE_TYPES,
  solarTypes: ECLIPSE_TYPES.filter((e) => e.family === "solar"),
  lunarTypes: ECLIPSE_TYPES.filter((e) => e.family === "lunar"),
  linkedEntityIds: [SUN, MOON, EARTH],
  typesEnvelope: referenceEnvelope({
    source: ["nasa"], provider: "eclipse-catalogue", confidence: "established",
    provenance: "Eclipse geometry and viewing-safety guidance are timeless, and this page carries only those. Dated eclipses now exist on the platform: the observing calendar at /events/eclipses reproduces NASA/GSFC's Five Millennium Catalog, converting its dynamical time to UTC with the catalogue's own delta-T. Paths of totality remain NASA's \u2014 local circumstances need the Besselian elements, which are published separately and are not read here.",
  }),
  /**
   * Upcoming eclipses.
   *
   * This shape stays empty on purpose. Dated eclipses are served by the observing calendar
   * (Program CM), which fetches NASA/GSFC's catalogue at request time and carries the live-provider
   * honesty envelope — a status, a fetch time, and a real failure mode. Duplicating them into this
   * static reference structure would create a second copy that could not fail honestly and would
   * drift out of step with the first. The envelope says where the dates actually are.
   */
  upcoming: (): Enveloped<Eclipse>[] => [
    {
      data: null,
      envelope: preparedEnvelope({
        source: ["nasa"], provider: "eclipse-catalogue",
        provenance: "No dates are held in this reference structure. Dated eclipses are at /events/eclipses, taken from NASA/GSFC's Five Millennium Catalog of Eclipses at request time; paths of totality are on NASA's own maps, linked from each eclipse.",
      }),
    },
  ],
};
