import { referenceEnvelope, type SkyEnvelope } from "@/platform/live-sky/schema";
import type { MeteorShower } from "@/platform/live-sky/models";

/**
 * Annual meteor showers — the one dataset it is safe to seed, because the
 * parameters are timeless and source-backed (the IMO Meteor Shower Calendar
 * working list). These are ANNUAL definitions and ideal-condition maxima, NOT a
 * specific year's dates or a live meteor count. Each links to real graph
 * entities (its meteor_shower entity where one exists, its parent body where an
 * entity exists, and always its radiant constellation).
 */
export const METEOR_SHOWER_ENVELOPE: SkyEnvelope = referenceEnvelope({
  source: ["imo"],
  provider: "imo",
  confidence: "typical",
  provenance:
    "Annual activity windows, peak nights, zenithal hourly rates, and entry speeds from the IMO Meteor Shower Calendar working list. ZHR is an ideal-condition maximum, not a live count; peaks are annual and vary by a day or two year to year.",
  licenseNotes: "IMO working-list values are cited here as general reference, not redistributed in bulk.",
});

export const METEOR_SHOWERS: MeteorShower[] = [
  {
    slug: "quadrantids", name: "Quadrantids", graphEntityId: "meteor_shower:quadrantids",
    activeWindow: "28 December – 12 January", peakLabel: "night of 3–4 January",
    activeMonths: [1], peakMonth: 1, zhr: 110, velocityKmS: 41,
    radiantConstellationId: "constellation:bootes", parentBodyName: "asteroid (196256) 2003 EH1",
    bestHemisphere: "Northern",
    description: "One of the strongest annual showers, but with a very sharp peak lasting only a few hours. The radiant lies in northern Boötes, in the region of the former constellation Quadrans Muralis.",
  },
  {
    slug: "lyrids", name: "Lyrids", activeWindow: "16 – 25 April", peakLabel: "night of 22–23 April",
    activeMonths: [4], peakMonth: 4, zhr: 18, velocityKmS: 49,
    radiantConstellationId: "constellation:lyra", parentBodyName: "Comet C/1861 G1 (Thatcher)",
    bestHemisphere: "Northern",
    description: "A medium-strength shower with a history stretching back over 2,600 years. The radiant rises near the bright star Vega; occasional outbursts have been recorded.",
  },
  {
    slug: "eta-aquariids", name: "Eta Aquariids", activeWindow: "19 April – 28 May", peakLabel: "night of 5–6 May",
    activeMonths: [4, 5], peakMonth: 5, zhr: 50, velocityKmS: 66,
    radiantConstellationId: "constellation:aquarius", parentBodyId: "comet:halleys-comet", parentBodyName: "Comet 1P/Halley",
    bestHemisphere: "Southern",
    description: "Fast meteors from the debris of Halley's Comet, best seen from the Southern Hemisphere and the tropics in the hours before dawn.",
  },
  {
    slug: "perseids", name: "Perseids", graphEntityId: "meteor_shower:perseids",
    activeWindow: "17 July – 24 August", peakLabel: "night of 12–13 August",
    activeMonths: [7, 8], peakMonth: 8, zhr: 100, velocityKmS: 59,
    radiantConstellationId: "constellation:perseus", parentBodyId: "comet:swift-tuttle", parentBodyName: "Comet 109P/Swift–Tuttle",
    bestHemisphere: "Northern",
    description: "The most popular Northern-Hemisphere shower, reliable and rich, arriving on warm August nights. Meteors are swift and often leave persistent trains.",
  },
  {
    slug: "orionids", name: "Orionids", graphEntityId: "meteor_shower:orionids",
    activeWindow: "2 October – 7 November", peakLabel: "night of 21–22 October",
    activeMonths: [10, 11], peakMonth: 10, zhr: 20, velocityKmS: 66,
    radiantConstellationId: "constellation:orion", parentBodyId: "comet:halleys-comet", parentBodyName: "Comet 1P/Halley",
    bestHemisphere: "Both",
    description: "The second shower fed by Halley's Comet (with the Eta Aquariids), producing fast meteors radiating from near Orion's raised club.",
  },
  {
    slug: "leonids", name: "Leonids", graphEntityId: "meteor_shower:leonids",
    activeWindow: "6 – 30 November", peakLabel: "night of 17–18 November",
    activeMonths: [11], peakMonth: 11, zhr: 15, velocityKmS: 71,
    radiantConstellationId: "constellation:leo", parentBodyName: "Comet 55P/Tempel–Tuttle",
    bestHemisphere: "Both",
    description: "Usually modest, but famous for spectacular storms roughly every 33 years when Earth crosses dense filaments of Tempel–Tuttle's debris. Meteors are the fastest of any major shower.",
  },
  {
    slug: "geminids", name: "Geminids", graphEntityId: "meteor_shower:geminids",
    activeWindow: "4 – 20 December", peakLabel: "night of 13–14 December",
    activeMonths: [12], peakMonth: 12, zhr: 150, velocityKmS: 35,
    radiantConstellationId: "constellation:gemini", parentBodyName: "asteroid (3200) Phaethon",
    bestHemisphere: "Both",
    description: "The richest annual shower, producing bright, slow, often colourful meteors. Unusually, its parent is a rocky asteroid rather than a comet.",
  },
  {
    slug: "taurids", name: "Taurids", graphEntityId: "meteor_shower:taurids",
    activeWindow: "September – December (two branches)", peakLabel: "early November",
    activeMonths: [9, 10, 11, 12], peakMonth: 11, zhr: 5, velocityKmS: 28,
    radiantConstellationId: "constellation:taurus", parentBodyName: "Comet 2P/Encke",
    bestHemisphere: "Both",
    description: "A long-lasting, low-rate shower in two branches (Southern and Northern Taurids) known for a high proportion of bright fireballs.",
  },
];

const BY_SLUG = new Map(METEOR_SHOWERS.map((s) => [s.slug, s]));

export const meteorShowers = {
  envelope: METEOR_SHOWER_ENVELOPE,
  all: (): MeteorShower[] => METEOR_SHOWERS,
  slugs: (): string[] => METEOR_SHOWERS.map((s) => s.slug),
  get: (slug: string): MeteorShower | undefined => BY_SLUG.get(slug),
  /** Showers active in a given month (1-12). */
  forMonth: (month: number): MeteorShower[] => METEOR_SHOWERS.filter((s) => s.activeMonths.includes(month)),
  /** Showers peaking in a given month (1-12). */
  peakingIn: (month: number): MeteorShower[] => METEOR_SHOWERS.filter((s) => s.peakMonth === month),
  /** All graph entity ids a shower links to (for validation / no-orphan checks). */
  linkedEntityIds: (s: MeteorShower): string[] =>
    [s.graphEntityId, s.parentBodyId, s.radiantConstellationId].filter((x): x is string => Boolean(x)),
};
