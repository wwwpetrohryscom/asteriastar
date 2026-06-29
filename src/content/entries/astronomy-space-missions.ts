import { defineEntries } from "@/lib/content/entry-types";

/**
 * Astronomy / Space Missions — landmark missions of exploration.
 *
 * Factual and source-ready. Launch and event dates given here are
 * well-documented historical facts. Hubble and JWST appear here from the
 * *mission/programme* angle; the *observatory/instrument* angle lives under
 * Space Telescopes, with distinct SEO titles and cross-links to avoid
 * duplicate intent.
 */
export const astronomySpaceMissions = defineEntries([
  {
    section: "astronomy",
    category: "space-missions",
    slug: "apollo-11",
    title: "Apollo 11",
    description:
      "Apollo 11 was the NASA mission that achieved the first crewed landing on the Moon in July 1969, with Neil Armstrong and Buzz Aldrin walking on the surface.",
    excerpt: "The first crewed landing on the Moon, in 1969.",
    kind: "historical",
    difficulty: "beginner",
    tags: ["Moon landing", "Apollo program", "crewed spaceflight", "NASA"],
    facts: [
      { label: "Agency", value: "NASA" },
      { label: "Year", value: "1969" },
      { label: "Crew", value: "Armstrong, Aldrin, and Collins" },
      { label: "Achievement", value: "First humans to walk on the Moon" },
    ],
    keyPoints: [
      "The first mission to land humans on the Moon.",
      "Neil Armstrong and Buzz Aldrin walked on the surface while Michael Collins orbited above.",
      "A defining moment of the 20th-century space age.",
    ],
    body: [
      {
        heading: "The first Moon landing",
        paragraphs: [
          "Apollo 11 was the NASA mission that, in July 1969, carried the first humans to the surface of the Moon. It was the culmination of the Apollo program's goal of a crewed lunar landing.",
        ],
      },
      {
        heading: "The crew",
        paragraphs: [
          "Neil Armstrong and Buzz Aldrin descended to the surface in the lunar module and walked on the Moon, while Michael Collins remained in orbit aboard the command module. The astronauts collected samples and deployed experiments before returning safely to Earth.",
        ],
      },
      {
        heading: "Its legacy",
        paragraphs: [
          "Apollo 11 demonstrated that humans could travel to another world and return, and it remains one of the most significant achievements in the history of exploration.",
        ],
      },
    ],
    sources: ["nasa"],
    relatedEntries: [
      ["astronomy", "space-missions", "voyager-1"],
      ["astronomy", "planets", "earth"],
    ],
    relatedCategories: [
      ["astronomy", "spacecraft"],
      ["encyclopedia", "space-exploration"],
    ],
  },
  {
    section: "astronomy",
    category: "space-missions",
    slug: "voyager-1",
    title: "Voyager 1",
    description:
      "Voyager 1 is a NASA probe launched in 1977 that explored Jupiter and Saturn and has since become the most distant human-made object, now in interstellar space.",
    excerpt: "The most distant human-made object, now in interstellar space.",
    kind: "historical",
    difficulty: "intermediate",
    tags: ["Voyager program", "interstellar", "outer planets", "NASA"],
    facts: [
      { label: "Agency", value: "NASA" },
      { label: "Launched", value: "1977" },
      { label: "Explored", value: "Jupiter and Saturn" },
      { label: "Status", value: "In interstellar space — most distant human-made object" },
    ],
    keyPoints: [
      "Launched in 1977 to study the outer planets.",
      "Flew past Jupiter and Saturn, returning landmark images.",
      "Now the most distant human-made object, traveling through interstellar space.",
    ],
    body: [
      {
        heading: "A grand tour of the giants",
        paragraphs: [
          "Voyager 1 launched in 1977 and flew past Jupiter and Saturn, sending back detailed images of the planets, their rings, and their moons that reshaped planetary science.",
        ],
      },
      {
        heading: "Into interstellar space",
        paragraphs: [
          "After its planetary encounters, Voyager 1 continued outward. It eventually crossed beyond the heliosphere — the bubble of solar influence — into interstellar space, becoming the most distant human-made object.",
        ],
      },
      {
        heading: "The Golden Record",
        paragraphs: [
          "Voyager 1 carries the Golden Record, a phonograph disc of sounds and images chosen to represent life and culture on Earth, intended as a message to any future finder.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "space-missions", "voyager-2"],
      ["astronomy", "planets", "saturn"],
    ],
    relatedCategories: [["astronomy", "spacecraft"]],
  },
  {
    section: "astronomy",
    category: "space-missions",
    slug: "voyager-2",
    title: "Voyager 2",
    description:
      "Voyager 2 is the only spacecraft to have visited all four giant planets — Jupiter, Saturn, Uranus, and Neptune — and has also reached interstellar space.",
    excerpt: "The only probe to visit all four giant planets.",
    kind: "historical",
    difficulty: "intermediate",
    tags: ["Voyager program", "outer planets", "interstellar", "NASA"],
    facts: [
      { label: "Agency", value: "NASA" },
      { label: "Launched", value: "1977" },
      { label: "Explored", value: "Jupiter, Saturn, Uranus, and Neptune" },
      { label: "Distinction", value: "Only spacecraft to visit Uranus and Neptune" },
    ],
    keyPoints: [
      "The only spacecraft to fly by all four giant planets.",
      "Provided humanity's only close-up visits to Uranus and Neptune.",
      "Also crossed into interstellar space.",
    ],
    body: [
      {
        heading: "A unique itinerary",
        paragraphs: [
          "Voyager 2 launched in 1977 and, taking advantage of a rare planetary alignment, became the only spacecraft to fly past all four giant planets: Jupiter, Saturn, Uranus, and Neptune.",
        ],
      },
      {
        heading: "Our only look at the ice giants",
        paragraphs: [
          "Its flybys of Uranus and Neptune remain the only close-up spacecraft visits to those worlds, and much of what we know about them in detail comes from Voyager 2.",
        ],
      },
      {
        heading: "Still exploring",
        paragraphs: [
          "Like its twin, Voyager 2 eventually crossed into interstellar space and continues to send back data about the environment beyond the planets.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "space-missions", "voyager-1"],
      ["astronomy", "planets", "neptune"],
    ],
    relatedCategories: [["astronomy", "spacecraft"]],
  },
  {
    section: "astronomy",
    category: "space-missions",
    slug: "james-webb-space-telescope",
    title: "James Webb Space Telescope",
    shortTitle: "James Webb (mission)",
    seoTitle: "The James Webb Space Telescope Mission",
    description:
      "The James Webb Space Telescope mission launched in December 2021 — an international infrared observatory operated by NASA, ESA, and CSA from a vantage point far beyond the Moon.",
    excerpt: "The launch and operation of the great infrared observatory.",
    kind: "historical",
    difficulty: "intermediate",
    tags: ["JWST", "infrared", "international mission", "L2"],
    facts: [
      { label: "Partners", value: "NASA, ESA, and CSA" },
      { label: "Launched", value: "December 2021, on an Ariane 5 rocket" },
      { label: "Location", value: "Near the Sun–Earth L2 point" },
      { label: "Focus", value: "Infrared observations of the early universe" },
    ],
    keyPoints: [
      "Launched in December 2021 as an international partnership.",
      "Operates far from Earth, near the L2 point, to stay cold for infrared work.",
      "The observatory itself is described under Space Telescopes.",
    ],
    body: [
      {
        heading: "A long-awaited launch",
        paragraphs: [
          "The James Webb Space Telescope launched in December 2021 aboard an Ariane 5 rocket, after decades of development. It is a partnership of NASA, the European Space Agency, and the Canadian Space Agency.",
        ],
      },
      {
        heading: "Reaching its station",
        paragraphs: [
          "Rather than orbiting Earth like Hubble, Webb travelled to a region near the Sun–Earth L2 point, roughly a million miles away, where it can keep its giant sunshield between itself and the Sun and stay extremely cold.",
        ],
      },
      {
        heading: "Mission and instrument",
        paragraphs: [
          "This entry covers the mission — its launch and operations. For the observatory itself, including how it sees in infrared, see the James Webb entry under Space Telescopes.",
        ],
      },
    ],
    sources: ["nasa", "esa"],
    relatedEntries: [
      ["astronomy", "space-telescopes", "james-webb-space-telescope"],
      ["astronomy", "space-missions", "hubble-space-telescope"],
    ],
    relatedCategories: [["astronomy", "space-telescopes"]],
  },
  {
    section: "astronomy",
    category: "space-missions",
    slug: "hubble-space-telescope",
    title: "Hubble Space Telescope",
    shortTitle: "Hubble (mission)",
    seoTitle: "The Hubble Space Telescope Mission",
    description:
      "The Hubble Space Telescope mission launched in 1990 and has been serviced in orbit by astronauts several times, keeping one of history's most productive observatories at work for decades.",
    excerpt: "The launch and in-orbit servicing of Hubble.",
    kind: "historical",
    difficulty: "intermediate",
    tags: ["Hubble", "servicing missions", "Space Shuttle", "NASA", "ESA"],
    facts: [
      { label: "Partners", value: "NASA and ESA" },
      { label: "Launched", value: "1990, aboard Space Shuttle Discovery" },
      { label: "Servicing", value: "Repaired and upgraded by astronauts in orbit" },
      { label: "Orbit", value: "Low Earth orbit" },
    ],
    keyPoints: [
      "Launched in 1990 from the Space Shuttle.",
      "Uniquely serviced and upgraded by astronauts on several missions.",
      "The observatory itself is described under Space Telescopes.",
    ],
    body: [
      {
        heading: "Launch from the Shuttle",
        paragraphs: [
          "The Hubble Space Telescope was carried into low Earth orbit in 1990 aboard the Space Shuttle Discovery, a joint project of NASA and the European Space Agency.",
        ],
      },
      {
        heading: "Servicing in orbit",
        paragraphs: [
          "Because Hubble orbits close to Earth, astronauts were able to visit it on several Space Shuttle servicing missions, repairing an early optical flaw and repeatedly upgrading its instruments — a rare and remarkable feat for a space observatory.",
        ],
      },
      {
        heading: "Mission and instrument",
        paragraphs: [
          "This entry covers the mission and its servicing. For the observatory itself — its optics and what it observes — see the Hubble entry under Space Telescopes.",
        ],
      },
    ],
    sources: ["nasa", "esa"],
    relatedEntries: [
      ["astronomy", "space-telescopes", "hubble-space-telescope"],
      ["astronomy", "space-missions", "james-webb-space-telescope"],
    ],
    relatedCategories: [["astronomy", "space-telescopes"]],
  },
  {
    section: "astronomy",
    category: "space-missions",
    slug: "cassini-huygens",
    title: "Cassini–Huygens",
    description:
      "Cassini–Huygens was a NASA, ESA, and ASI mission that orbited Saturn for years and landed the Huygens probe on its moon Titan.",
    excerpt: "The mission that orbited Saturn and landed on Titan.",
    kind: "historical",
    difficulty: "intermediate",
    tags: ["Saturn", "Titan", "international mission", "NASA", "ESA"],
    facts: [
      { label: "Partners", value: "NASA, ESA, and ASI" },
      { label: "Target", value: "Saturn and its moons" },
      { label: "Huygens", value: "Landed on Saturn's moon Titan" },
      { label: "Mission end", value: "Concluded in 2017 with a dive into Saturn" },
    ],
    keyPoints: [
      "Orbited Saturn for many years, studying the planet, rings, and moons.",
      "Delivered the Huygens probe to the surface of Titan.",
      "Ended in 2017 with a deliberate plunge into Saturn's atmosphere.",
    ],
    body: [
      {
        heading: "Years at Saturn",
        paragraphs: [
          "Cassini–Huygens was an international mission led by NASA with ESA and the Italian Space Agency. The Cassini orbiter spent years circling Saturn, returning detailed observations of the planet, its rings, and its many moons.",
        ],
      },
      {
        heading: "Landing on Titan",
        paragraphs: [
          "The Huygens probe, built by ESA, separated from Cassini and descended to the surface of Titan — the first landing on a moon in the outer Solar System — revealing a world with a thick atmosphere and surface features shaped by liquids.",
        ],
      },
      {
        heading: "The Grand Finale",
        paragraphs: [
          "In 2017, with its fuel running low, Cassini ended its mission with a series of daring passes between Saturn and its rings, followed by a final plunge into the planet to ensure its moons were not contaminated.",
        ],
      },
    ],
    sources: ["nasa", "esa", "jpl"],
    relatedEntries: [
      ["astronomy", "planets", "saturn"],
      ["astronomy", "space-missions", "voyager-2"],
    ],
    relatedCategories: [["astronomy", "moons"]],
  },
  {
    section: "astronomy",
    category: "space-missions",
    slug: "new-horizons",
    title: "New Horizons",
    description:
      "New Horizons is a NASA mission that made the first close flyby of Pluto in 2015 and went on to visit a distant Kuiper Belt object.",
    excerpt: "The first spacecraft to fly past Pluto.",
    kind: "historical",
    difficulty: "intermediate",
    tags: ["Pluto", "Kuiper Belt", "flyby", "NASA"],
    facts: [
      { label: "Agency", value: "NASA" },
      { label: "Launched", value: "2006" },
      { label: "Pluto flyby", value: "2015" },
      { label: "Then", value: "Flew past a Kuiper Belt object" },
    ],
    keyPoints: [
      "Performed the first-ever close flyby of Pluto, in 2015.",
      "Revealed Pluto as a complex, geologically varied world.",
      "Continued on to study an object deep in the Kuiper Belt.",
    ],
    body: [
      {
        heading: "Racing to Pluto",
        paragraphs: [
          "New Horizons launched in 2006 on a fast trajectory to the outer Solar System. In 2015 it made the first close flyby of Pluto, transforming our view of the dwarf planet.",
        ],
      },
      {
        heading: "What it found",
        paragraphs: [
          "The flyby revealed mountains of water ice, smooth nitrogen-ice plains, and a thin atmosphere, showing that even a small, distant world can be surprisingly active.",
        ],
      },
      {
        heading: "Deeper into the belt",
        paragraphs: [
          "After Pluto, New Horizons continued outward to fly past a small, ancient Kuiper Belt object, providing the closest look yet at one of these primitive building blocks of the Solar System.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "dwarf-planets", "pluto"],
      ["astronomy", "space-missions", "voyager-1"],
    ],
    relatedCategories: [["astronomy", "dwarf-planets"]],
  },
  {
    section: "astronomy",
    category: "space-missions",
    slug: "juno",
    title: "Juno",
    description:
      "Juno is a NASA mission orbiting Jupiter to study the giant planet's interior structure, atmosphere, and powerful magnetic field.",
    excerpt: "NASA's mission probing Jupiter from orbit.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["Jupiter", "orbiter", "magnetic field", "NASA"],
    facts: [
      { label: "Agency", value: "NASA" },
      { label: "Target", value: "Jupiter" },
      { label: "Orbit", value: "Looping polar orbit" },
      { label: "Goals", value: "Interior, atmosphere, and magnetic field" },
    ],
    keyPoints: [
      "Orbits Jupiter on a looping path that passes over its poles.",
      "Studies what lies beneath Jupiter's clouds and its strong magnetic field.",
      "Has returned striking images of Jupiter's polar storms.",
    ],
    body: [
      {
        heading: "A mission to Jupiter's depths",
        paragraphs: [
          "Juno is a NASA spacecraft orbiting Jupiter to probe beneath its colorful clouds. Its goal is to understand the planet's internal structure, atmosphere, and origins.",
        ],
      },
      {
        heading: "A polar perspective",
        paragraphs: [
          "Juno follows an elongated orbit that carries it over Jupiter's poles, giving a vantage point earlier missions did not have and revealing clusters of cyclones swirling at the poles.",
        ],
      },
      {
        heading: "Measuring the giant",
        paragraphs: [
          "By precisely measuring Jupiter's gravity and magnetic field, Juno helps scientists map the planet's deep interior and learn how giant planets form.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "planets", "jupiter"],
      ["astronomy", "space-missions", "cassini-huygens"],
    ],
    relatedCategories: [["astronomy", "planets"]],
  },
  {
    section: "astronomy",
    category: "space-missions",
    slug: "mars-science-laboratory",
    title: "Mars Science Laboratory",
    shortTitle: "Curiosity (MSL)",
    description:
      "Mars Science Laboratory is the NASA mission that delivered the Curiosity rover to Mars in 2012 to investigate whether the planet could once have supported microbial life.",
    excerpt: "The mission that landed the Curiosity rover on Mars.",
    kind: "historical",
    difficulty: "intermediate",
    tags: ["Mars", "Curiosity rover", "habitability", "NASA"],
    facts: [
      { label: "Agency", value: "NASA" },
      { label: "Rover", value: "Curiosity" },
      { label: "Landed", value: "2012, in Gale Crater" },
      { label: "Goal", value: "Assess past habitability of Mars" },
    ],
    keyPoints: [
      "Delivered the car-sized Curiosity rover to Mars in 2012.",
      "Landed in Gale Crater to study ancient environments.",
      "Found evidence that the site once had conditions suitable for life.",
    ],
    body: [
      {
        heading: "Landing Curiosity",
        paragraphs: [
          "Mars Science Laboratory is the NASA mission that carried the Curiosity rover to Mars, landing in 2012 using a novel sky-crane system to lower the rover gently to the surface of Gale Crater.",
        ],
      },
      {
        heading: "A mobile laboratory",
        paragraphs: [
          "Curiosity is essentially a roving science laboratory, equipped to analyze rocks and soil. It was sent to determine whether its landing site ever had environmental conditions capable of supporting microbial life.",
        ],
      },
      {
        heading: "Key findings",
        paragraphs: [
          "The mission found evidence that Gale Crater once held a lake and the chemical ingredients associated with habitable environments, strengthening the case that ancient Mars was more hospitable than it is today.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "planets", "mars"],
      ["astronomy", "space-missions", "apollo-11"],
    ],
    relatedCategories: [["astronomy", "spacecraft"]],
  },
  {
    section: "astronomy",
    category: "space-missions",
    slug: "parker-solar-probe",
    title: "Parker Solar Probe",
    description:
      "Parker Solar Probe is a NASA mission flying closer to the Sun than any spacecraft before it, passing through the outer atmosphere to study the solar wind.",
    excerpt: "The mission flying through the Sun's outer atmosphere.",
    kind: "science",
    difficulty: "advanced",
    tags: ["Sun", "solar wind", "corona", "NASA"],
    facts: [
      { label: "Agency", value: "NASA" },
      { label: "Target", value: "The Sun" },
      { label: "Distinction", value: "Closest spacecraft to the Sun" },
      { label: "Goal", value: "Understand the corona and solar wind" },
    ],
    keyPoints: [
      "Flies closer to the Sun than any previous spacecraft.",
      "Passes through the Sun's outer atmosphere, the corona.",
      "Aims to explain how the solar wind is generated and accelerated.",
    ],
    body: [
      {
        heading: "Touching the Sun",
        paragraphs: [
          "Parker Solar Probe is a NASA mission designed to fly closer to the Sun than any spacecraft before it, repeatedly diving through the corona — the Sun's outer atmosphere — protected by a heat shield.",
        ],
      },
      {
        heading: "Surviving the heat",
        paragraphs: [
          "To withstand the intense heat and light, the probe hides its instruments behind a thick shield and uses its speed to make brief, close passes before swinging back out.",
        ],
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "By sampling the corona directly, Parker Solar Probe helps answer long-standing questions about why the corona is so hot and how the solar wind — the stream of particles that affects the whole Solar System — is produced.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "space-missions", "juno"],
      ["astronomy", "space-telescopes", "tess"],
    ],
    relatedCategories: [["astronomy", "spacecraft"]],
  },
]);
