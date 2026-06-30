import { rel, type GraphRelation } from "@/knowledge-graph/schema";

/**
 * Original seed relations for the knowledge graph (the `data/` modules add the
 * Phase 3+ expansion). Kept in its own module so other modules can dedupe
 * against it without importing the assembled relations array.
 */
export const coreRelations: GraphRelation[] = [
  /* ----------------------------------------------------------- science */
  rel("star:sirius", "belongs_to", "constellation:canis-major", "confirmed", "science", { sources: ["iau"] }),
  rel("star:betelgeuse", "belongs_to", "constellation:orion", "confirmed", "science", { sources: ["iau"] }),
  rel("star:rigel", "belongs_to", "constellation:orion", "confirmed", "science", { sources: ["iau"] }),
  rel("star:vega", "belongs_to", "constellation:lyra", "confirmed", "science", { sources: ["iau"] }),
  rel("star:polaris", "belongs_to", "constellation:ursa-minor", "confirmed", "science", { sources: ["iau"] }),
  rel("star:proxima-centauri", "part_of", "star:alpha-centauri", "confirmed", "science", { sources: ["iau", "nasa"] }),
  rel("planet:mars", "part_of", "location:solar-system", "confirmed", "science", { sources: ["nasa", "jpl"] }),
  rel("planet:jupiter", "part_of", "location:solar-system", "confirmed", "science", { sources: ["nasa", "jpl"] }),
  rel("space_telescope:hubble-space-telescope", "operated_by", "organization:nasa", "confirmed", "science", { sources: ["nasa"] }),
  rel("space_telescope:hubble-space-telescope", "operated_by", "organization:esa", "confirmed", "science", { sources: ["esa"] }),
  rel("space_telescope:james-webb-space-telescope", "operated_by", "organization:nasa", "confirmed", "science", { sources: ["nasa"] }),
  rel("space_telescope:james-webb-space-telescope", "operated_by", "organization:esa", "confirmed", "science", { sources: ["esa"] }),
  rel("space_telescope:james-webb-space-telescope", "operated_by", "organization:csa", "confirmed", "science"),

  /* ----------------------------------------------------------- culture */
  rel("constellation:orion", "mythologically_linked_to", "mythology_figure:orion", "confirmed", "culture", {
    sources: ["britannica"],
    note: "The constellation is named for the mythological hunter Orion.",
  }),
  rel("constellation:andromeda", "mythologically_linked_to", "mythology_figure:andromeda", "confirmed", "culture", { sources: ["britannica"] }),
  rel("constellation:cassiopeia", "mythologically_linked_to", "mythology_figure:cassiopeia", "confirmed", "culture", { sources: ["britannica"] }),
  rel("constellation:perseus", "mythologically_linked_to", "mythology_figure:perseus", "confirmed", "culture", { sources: ["britannica"] }),
  rel("mythology_figure:asteria", "associated_with", "mythology_story:night-sky", "confirmed", "culture", {
    sources: ["britannica"],
    note: "Asteria is a Titaness associated with the stars and the night sky.",
  }),

  /* --------------------------------------------------------- astrology */
  // domain "astrology" + confidence "interpretive" for all; modern vs.
  // traditional rulerships noted where relevant.
  rel("astrology_sign:aries", "astrologically_associated_with", "astrology_planet:mars", "interpretive", "astrology", { note: "Traditional ruler." }),
  rel("astrology_sign:taurus", "astrologically_associated_with", "astrology_planet:venus", "interpretive", "astrology", { note: "Traditional ruler." }),
  rel("astrology_sign:gemini", "astrologically_associated_with", "astrology_planet:mercury", "interpretive", "astrology", { note: "Traditional ruler." }),
  rel("astrology_sign:cancer", "astrologically_associated_with", "astrology_planet:moon", "interpretive", "astrology", { note: "Traditional ruler." }),
  rel("astrology_sign:leo", "astrologically_associated_with", "astrology_planet:sun", "interpretive", "astrology", { note: "Traditional ruler." }),
  rel("astrology_sign:virgo", "astrologically_associated_with", "astrology_planet:mercury", "interpretive", "astrology", { note: "Traditional ruler." }),
  rel("astrology_sign:libra", "astrologically_associated_with", "astrology_planet:venus", "interpretive", "astrology", { note: "Traditional ruler." }),
  rel("astrology_sign:scorpio", "astrologically_associated_with", "astrology_planet:mars", "interpretive", "astrology", { note: "Traditional ruler." }),
  rel("astrology_sign:scorpio", "astrologically_associated_with", "astrology_planet:pluto", "interpretive", "astrology", { note: "Modern ruler." }),
  rel("astrology_sign:sagittarius", "astrologically_associated_with", "astrology_planet:jupiter", "interpretive", "astrology", { note: "Traditional ruler." }),
  rel("astrology_sign:capricorn", "astrologically_associated_with", "astrology_planet:saturn", "interpretive", "astrology", { note: "Traditional ruler." }),
  rel("astrology_sign:aquarius", "astrologically_associated_with", "astrology_planet:saturn", "interpretive", "astrology", { note: "Traditional ruler." }),
  rel("astrology_sign:aquarius", "astrologically_associated_with", "astrology_planet:uranus", "interpretive", "astrology", { note: "Modern ruler." }),
  rel("astrology_sign:pisces", "astrologically_associated_with", "astrology_planet:jupiter", "interpretive", "astrology", { note: "Traditional ruler." }),
  rel("astrology_sign:pisces", "astrologically_associated_with", "astrology_planet:neptune", "interpretive", "astrology", { note: "Modern ruler." }),
];
