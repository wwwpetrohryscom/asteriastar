import { defineEntries } from "@/lib/content/entry-types";

/**
 * Encyclopedia / Greek Mythology — cultural-heritage entries.
 *
 * These present well-known Greek myths as stories and cultural heritage, never
 * as fact and never as astrology. Where a figure names a constellation or star
 * cluster, that astronomical naming is noted as cultural heritage, while the
 * narrative itself is framed as myth ("In Greek myth…", "According to the
 * legend…"). Details are kept to widely-attested versions; nothing is invented.
 */
export const encyclopediaMythology = defineEntries([
  {
    section: "encyclopedia",
    category: "greek-mythology",
    slug: "asteria",
    title: "Asteria",
    description:
      "In Greek mythology Asteria is a Titaness of the starry night, falling stars, and nocturnal oracles — the namesake spirit of this site.",
    excerpt: "The Titaness of the starry night and shooting stars.",
    kind: "cultural",
    difficulty: "beginner",
    tags: ["Greek myth", "Titaness", "starry night", "namesake"],
    facts: [
      { label: "Role in myth", value: "Titaness of the stars and night" },
      { label: "Parentage", value: "Daughter of the Titans Coeus and Phoebe" },
      { label: "Family", value: "Sister of Leto" },
      { label: "Namesake", value: "The Asteria Star project" },
    ],
    keyPoints: [
      "A Titaness associated in Greek myth with the stars, the night, and falling stars.",
      "Daughter of Coeus and Phoebe and sister of Leto.",
      "Presented here as cultural heritage, not as fact.",
    ],
    body: [
      {
        heading: "The myth",
        paragraphs: [
          "In Greek mythology Asteria is a Titaness of the second generation, a daughter of the Titans Coeus and Phoebe and the sister of Leto. The myths connect her with the night sky — with the stars, with falling stars, and with the prophetic dreams and oracles that belong to the hours of darkness.",
          "According to the legend she was pursued by Zeus. To escape him she transformed herself, in the most familiar version, into a quail and cast herself into the sea, where she became a floating island. That island was later identified with Delos, which in myth becomes the birthplace of her sister Leto's children, Apollo and Artemis.",
        ],
      },
      {
        heading: "Her story",
        paragraphs: [
          "Asteria's name comes from the Greek word for star, and the ancient sources cast her as a power of the starlit night. In some traditions she is tied to nocturnal divination — to oracles read in dreams and in the patterns of shooting stars — a goddess invoked when the sky itself seemed to speak.",
          "Her flight and transformation are her best-known myth: a Titaness who would rather become an island adrift on the sea than yield to Zeus. It is as the spirit of the night sky, watchful and luminous, that she lends her name to this project.",
        ],
      },
      {
        heading: "In the sky",
        paragraphs: [
          "Asteria has no single constellation named for her; in myth she is the goddess of the starry night as a whole. The Greeks associated her with the field of stars overhead and, in particular, with shooting stars streaking across the dark.",
          "To look up on a clear night — at the scattered stars and the occasional falling one — is, in this cultural tradition, to look on Asteria's own domain.",
        ],
      },
    ],
    sources: ["britannica"],
    relatedEntries: [
      ["encyclopedia", "greek-mythology", "orion"],
      ["encyclopedia", "greek-mythology", "pleiades"],
      ["encyclopedia", "greek-mythology", "perseus"],
    ],
    relatedCategories: [
      ["astronomy", "constellations"],
      ["encyclopedia", "roman-mythology"],
    ],
  },
  {
    section: "encyclopedia",
    category: "greek-mythology",
    slug: "orion",
    title: "Orion",
    description:
      "In Greek mythology Orion was a giant huntsman whose story is tied to the brilliant constellation that bears his name.",
    excerpt: "The giant huntsman of myth and the winter sky.",
    kind: "cultural",
    difficulty: "beginner",
    tags: ["Greek myth", "hunter", "constellation namesake"],
    facts: [
      { label: "Role in myth", value: "Giant huntsman" },
      { label: "Namesake", value: "The constellation Orion" },
    ],
    keyPoints: [
      "A renowned hunter in Greek mythology.",
      "Gives his name to one of the most recognizable constellations.",
      "Presented here as cultural heritage, not as fact.",
    ],
    body: [
      {
        heading: "The myth",
        paragraphs: [
          "In Greek mythology Orion was a giant and a great hunter. Several versions of his story survive; in many he meets his death and is afterward placed among the stars.",
        ],
      },
      {
        heading: "His story",
        paragraphs: [
          "Tales link Orion with the goddess Artemis and with the scorpion that, in some versions, brings about his end — which is why, the myths say, Orion and the constellation Scorpius are set on opposite sides of the sky.",
        ],
      },
      {
        heading: "In the sky",
        paragraphs: [
          "The constellation Orion is among the most easily recognized, marked by the three bright stars of Orion's Belt. It is a prominent feature of the winter evening sky in the Northern Hemisphere.",
        ],
      },
    ],
    sources: ["britannica"],
    relatedEntries: [
      ["encyclopedia", "greek-mythology", "perseus"],
      ["encyclopedia", "greek-mythology", "pleiades"],
      ["encyclopedia", "greek-mythology", "asteria"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
  {
    section: "encyclopedia",
    category: "greek-mythology",
    slug: "andromeda",
    title: "Andromeda",
    description:
      "In Greek mythology Andromeda was a princess chained as a sacrifice to a sea monster and rescued by the hero Perseus — namesake of the constellation Andromeda.",
    excerpt: "The chained princess rescued by Perseus.",
    kind: "cultural",
    difficulty: "beginner",
    tags: ["Greek myth", "princess", "constellation namesake"],
    facts: [
      { label: "Role in myth", value: "Princess, daughter of Cassiopeia" },
      { label: "Rescued by", value: "The hero Perseus" },
      { label: "Namesake", value: "The constellation Andromeda" },
    ],
    keyPoints: [
      "A princess of Greek myth, daughter of Queen Cassiopeia.",
      "Chained to a rock as a sacrifice and saved by Perseus.",
      "Presented here as cultural heritage, not as fact.",
    ],
    body: [
      {
        heading: "The myth",
        paragraphs: [
          "In Greek mythology Andromeda was the daughter of King Cepheus and Queen Cassiopeia of Aethiopia. According to the legend, after Cassiopeia boasted of her family's beauty, the sea god Poseidon sent a monster to ravage the coast, and an oracle declared that only the sacrifice of Andromeda could appease it.",
        ],
      },
      {
        heading: "Her story",
        paragraphs: [
          "The myths tell how Andromeda was chained to a rock by the sea to await the monster. The hero Perseus, passing by, saw her, slew the creature, and freed her, and the two were afterward married. In time the storytellers placed her, with her parents and her rescuer, among the constellations.",
        ],
      },
      {
        heading: "In the sky",
        paragraphs: [
          "The constellation Andromeda lies in the northern sky near Perseus and Cassiopeia, the very figures of her legend. It is also the direction in which the Andromeda Galaxy is found — the great spiral galaxy that takes its name from this constellation.",
        ],
      },
    ],
    sources: ["britannica"],
    relatedEntries: [
      ["encyclopedia", "greek-mythology", "perseus"],
      ["encyclopedia", "greek-mythology", "cassiopeia"],
      ["encyclopedia", "greek-mythology", "orion"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
  {
    section: "encyclopedia",
    category: "greek-mythology",
    slug: "cassiopeia",
    title: "Cassiopeia",
    description:
      "In Greek mythology Cassiopeia was a vain queen, mother of Andromeda, set in the sky upon a chair — namesake of the W-shaped constellation Cassiopeia.",
    excerpt: "The boastful queen seated on her chair among the stars.",
    kind: "cultural",
    difficulty: "beginner",
    tags: ["Greek myth", "queen", "constellation namesake"],
    facts: [
      { label: "Role in myth", value: "Queen, mother of Andromeda" },
      { label: "Trait in myth", value: "Vanity" },
      { label: "Namesake", value: "The constellation Cassiopeia" },
    ],
    keyPoints: [
      "A queen of Greek myth, famed for her vanity.",
      "Mother of the princess Andromeda.",
      "Presented here as cultural heritage, not as fact.",
    ],
    body: [
      {
        heading: "The myth",
        paragraphs: [
          "In Greek mythology Cassiopeia was the queen of Aethiopia and the mother of Andromeda. According to the legend her boast — that she, or her daughter, surpassed the sea nymphs in beauty — angered Poseidon and set in motion the tale of the sea monster and Andromeda's rescue by Perseus.",
        ],
      },
      {
        heading: "Her story",
        paragraphs: [
          "As punishment for her pride, the myths say, Cassiopeia was placed in the heavens bound to a chair, condemned to circle the celestial pole forever — so that for part of each night she hangs upside down, a humbling end fitted to her vanity.",
        ],
      },
      {
        heading: "In the sky",
        paragraphs: [
          "The constellation Cassiopeia is one of the most distinctive in the northern sky, its bright stars forming a clear W or M shape — the queen upon her chair. It lies near Andromeda and Perseus, keeping the figures of the legend together among the stars.",
        ],
      },
    ],
    sources: ["britannica"],
    relatedEntries: [
      ["encyclopedia", "greek-mythology", "andromeda"],
      ["encyclopedia", "greek-mythology", "perseus"],
      ["encyclopedia", "greek-mythology", "orion"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
  {
    section: "encyclopedia",
    category: "greek-mythology",
    slug: "perseus",
    title: "Perseus",
    description:
      "In Greek mythology Perseus was the hero who slew the Gorgon Medusa and rescued Andromeda — namesake of the constellation Perseus.",
    excerpt: "The hero who slew Medusa and saved Andromeda.",
    kind: "cultural",
    difficulty: "beginner",
    tags: ["Greek myth", "hero", "constellation namesake"],
    facts: [
      { label: "Role in myth", value: "Hero, slayer of Medusa" },
      { label: "Famous deed", value: "Rescuing Andromeda" },
      { label: "Namesake", value: "The constellation Perseus" },
    ],
    keyPoints: [
      "A great hero of Greek mythology, son of Zeus and Danaë.",
      "Slew the Gorgon Medusa and rescued the princess Andromeda.",
      "Presented here as cultural heritage, not as fact.",
    ],
    body: [
      {
        heading: "The myth",
        paragraphs: [
          "In Greek mythology Perseus was a hero, the son of Zeus and the mortal princess Danaë. According to the legend his greatest feat was the slaying of Medusa, one of the Gorgons, whose gaze turned onlookers to stone; aided by gifts from the gods, he beheaded her while watching only her reflection.",
        ],
      },
      {
        heading: "His story",
        paragraphs: [
          "Returning with Medusa's head, the myths tell, Perseus came upon Andromeda chained by the sea and saved her from the monster, taking her as his wife. He, Andromeda, and her parents were all in time placed among the constellations, their stories joined together in the sky.",
        ],
      },
      {
        heading: "In the sky",
        paragraphs: [
          "The constellation Perseus lies in the northern sky beside Andromeda and Cassiopeia. The Perseid meteor shower, seen each August, takes its name from this constellation because the meteors appear to radiate from a point within it.",
        ],
      },
    ],
    sources: ["britannica"],
    relatedEntries: [
      ["encyclopedia", "greek-mythology", "andromeda"],
      ["encyclopedia", "greek-mythology", "cassiopeia"],
      ["encyclopedia", "greek-mythology", "orion"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
  {
    section: "encyclopedia",
    category: "greek-mythology",
    slug: "pleiades",
    title: "The Pleiades",
    description:
      "In Greek mythology the Pleiades were the Seven Sisters, daughters of the Titan Atlas and Pleione — namesake of the Pleiades star cluster in Taurus.",
    excerpt: "The Seven Sisters of myth and the star cluster in Taurus.",
    kind: "cultural",
    difficulty: "beginner",
    tags: ["Greek myth", "Seven Sisters", "star cluster namesake"],
    facts: [
      { label: "Role in myth", value: "The Seven Sisters" },
      { label: "Parentage", value: "Daughters of the Titan Atlas and Pleione" },
      { label: "Namesake", value: "The Pleiades star cluster in Taurus" },
    ],
    keyPoints: [
      "Seven sisters of Greek mythology, daughters of Atlas and Pleione.",
      "Their name belongs to the famous star cluster in Taurus.",
      "Presented here as cultural heritage, not as fact.",
    ],
    body: [
      {
        heading: "The myth",
        paragraphs: [
          "In Greek mythology the Pleiades were seven sisters, the daughters of the Titan Atlas — who in myth holds up the sky — and the sea nymph Pleione. According to the legend they were pursued by the hunter Orion, and to save them the gods set them among the stars.",
        ],
      },
      {
        heading: "Their story",
        paragraphs: [
          "The sisters bore the names Maia, Electra, Taygete, Alcyone, Celaeno, Sterope, and Merope. The myths sometimes explain why one star of the cluster shines more faintly than the rest — saying that Merope, who married a mortal, hides her face for shame, or that one sister mourns and dims her light.",
        ],
      },
      {
        heading: "In the sky",
        paragraphs: [
          "The Pleiades are a bright open star cluster in the constellation Taurus, still widely known as the Seven Sisters. To the unaided eye a handful of stars stand out in a small, tight knot — a sight noted by cultures across the world and, in this Greek tradition, remembered as the daughters of Atlas.",
        ],
      },
    ],
    sources: ["britannica"],
    relatedEntries: [
      ["encyclopedia", "greek-mythology", "orion"],
      ["encyclopedia", "greek-mythology", "asteria"],
      ["encyclopedia", "greek-mythology", "andromeda"],
    ],
    relatedCategories: [["astronomy", "star-clusters"]],
  },
]);
