import type { Section } from "@/lib/content/types";

/**
 * Encyclopedia — reference, history, and context.
 *
 * Mixes science history with the cultural history of astronomy and astrology.
 * History-of-astrology and mythology topics are framed as cultural heritage;
 * physics and history-of-astronomy topics are science/reference. Topics here
 * are deliberately distinct from the Astronomy catalog to avoid duplicate
 * intent (e.g. this hub narrates the history of space exploration, while the
 * Astronomy hub catalogs individual missions and spacecraft).
 *
 * Historical claims are kept to the well-documented record. Where scholarship
 * is divided — the function of megalithic monuments, the transmission route of
 * Maragha mathematics into Copernicus — that division is stated rather than
 * resolved by assertion. Speculative pseudoarchaeology is excluded.
 */
export const encyclopedia: Section = {
  slug: "encyclopedia",
  name: "Encyclopedia",
  kind: "reference",
  accent: "stone",
  tagline: "Definitions, history, and the human context of the sky.",
  description:
    "A reference library: a glossary of terms, the history of astronomy and astrology, ancient sky cultures, mythology, and the basics of the physics behind it all.",
  intro:
    "The Encyclopedia is Asteria Star's reference layer. It defines the vocabulary, traces how humanity's understanding of the sky developed, and gives cultural and historical context. Scientific history and physics are presented factually; the history of astrology and mythology are presented as cultural heritage.",
  categories: [
    {
      slug: "glossary",
      name: "Glossary",
      summary: "Plain-language definitions of astronomy and astrology terms.",
      overview:
        "The glossary defines the terms used across the site, clearly separating scientific astronomy vocabulary from astrological and mythological terms so the two are never confused.",
      keyPoints: [
        "Astronomical terms have agreed technical definitions; several are routinely misused in popular writing.",
        "Some words — 'sign', 'house', 'aspect' — belong to astrology and have no astronomical meaning.",
        "Units in astronomy are chosen for the scale of the problem, not for consistency with everyday measures.",
      ],
      body: [
        {
          heading: "Terms that are commonly confused",
          list: [
            "Magnitude is a logarithmic brightness scale running backwards: lower numbers are brighter, and a difference of 5 magnitudes is a factor of 100 in brightness. Apparent magnitude is how bright something looks from Earth; absolute magnitude is how bright it would look at a standard distance.",
            "A light-year is a distance, not a time — the distance light travels in a year, about 9.46 trillion kilometres.",
            "A parsec is the distance at which one astronomical unit subtends one arcsecond, about 3.26 light-years. Professional literature uses parsecs; popular writing usually uses light-years.",
            "A solar system is a specific system; the Solar System with capitals is ours. A planetary system is the general term.",
            "A meteoroid is the object in space, a meteor is the streak of light it makes in the atmosphere, and a meteorite is what survives to the ground.",
            "An asteroid and a comet differ by composition and behaviour, not size — comets develop a coma and tail when heated because they contain volatiles.",
          ],
        },
        {
          heading: "Units astronomers actually use",
          list: [
            "Astronomical unit (au): the mean Earth–Sun distance, defined exactly as 149,597,870,700 metres. Used for Solar System scales.",
            "Parsec, kiloparsec, megaparsec: stellar, galactic and cosmological distance scales respectively.",
            "Solar mass, solar radius, solar luminosity: stellar properties are almost always quoted relative to the Sun.",
            "Jansky: the flux-density unit of radio astronomy.",
            "Arcminute and arcsecond: 1/60 and 1/3600 of a degree, the working units of angular size and position.",
            "Redshift z: a dimensionless measure of wavelength shift, used as a distance and time proxy at cosmological scales.",
          ],
        },
        {
          heading: "Vocabulary that belongs to astrology, not astronomy",
          paragraphs: [
            "Several words appear in both contexts with entirely different meanings, and conflating them is the most common source of confusion for readers arriving from either direction.",
          ],
          list: [
            "Sign: a 30-degree division of the ecliptic used in astrology. It is not a constellation, and in Western tropical astrology it is not tied to one.",
            "House: a division of the local sky used in astrological chart construction. It has no astronomical counterpart.",
            "Aspect: an angular relationship between two bodies to which astrology assigns meaning. Astronomers measure the same angles but attach no interpretation.",
            "Constellation: an astronomical term with a precise modern definition — one of 88 regions of the sky with boundaries fixed by the International Astronomical Union in 1922 and 1930.",
          ],
        },
        {
          heading: "How this glossary is organised",
          paragraphs: [
            "Individual terms are published as entries under this category, each with a definition, the context in which it is used, and links to the catalogue pages where the concept appears in real data. Terms drawn from the interpretive tradition are labelled as such on their own pages, so a reader always knows which register a definition belongs to.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why are brighter stars given smaller magnitude numbers?",
          answer:
            "The scale descends from Hipparchus's second-century-BCE classification, which called the brightest stars 'first magnitude' and the faintest visible ones 'sixth'. When the system was made quantitative in the nineteenth century, that ordering was kept and calibrated so that five magnitudes equal exactly a factor of 100 in brightness. The inversion is historical inheritance, not a physical convention.",
        },
        {
          question: "What is the difference between a light-year and a parsec?",
          answer:
            "Both are distances. A light-year is how far light travels in a year, about 9.46 trillion kilometres. A parsec is the distance at which one astronomical unit subtends an angle of one arcsecond — about 3.26 light-years — and it comes directly from parallax measurement, which is why professional astronomy prefers it.",
        },
        {
          question: "Is a zodiac sign the same as a constellation?",
          answer:
            "No. A constellation is one of 88 sky regions with boundaries defined by the International Astronomical Union, of very unequal size. A zodiac sign is a 30-degree slice of the ecliptic used in astrology, all equal in size, and in the Western tropical system anchored to the equinox rather than to the stars. The two have drifted apart by roughly one sign over the last two thousand years.",
        },
      ],
      explore: [
        { label: "Reference systems", href: "/reference-systems", blurb: "Coordinates, time scales, and the definitions behind them." },
        { label: "Entity index", href: "/entity-index", blurb: "Every catalogued entity on the platform, by type." },
        { label: "Sky catalogues", href: "/sky-catalogs", blurb: "Messier, NGC, IC, Caldwell and the naming systems." },
      ],
      sources: ["iau", "britannica", "nasa"],
      keywords: ["definitions", "astronomy terms", "vocabulary"],
    },
    {
      slug: "history-of-astronomy",
      name: "History of Astronomy",
      summary: "How humans learned to read and measure the sky.",
      overview:
        "Astronomy is the oldest of the observational sciences. Its history is a sequence of expansions in what could be measured — first positions by eye, then magnified images, then the invisible spectrum, then the whole sky in wavelengths and messengers the eye can never detect.",
      keyPoints: [
        "Predictive astronomy predates explanatory astronomy by well over a thousand years: Babylonian scribes forecast eclipses without any physical model.",
        "The telescope changed astronomy in 1609–10; spectroscopy changed it far more profoundly in the nineteenth century.",
        "Until 1838 no one had measured the distance to a single star.",
        "The universe was widely believed to consist of the Milky Way alone until the mid-1920s.",
      ],
      body: [
        {
          heading: "Prediction before explanation",
          paragraphs: [
            "The earliest sustained astronomy was arithmetic, not physical. Babylonian scribes compiled the astronomical diaries — a nightly observational record maintained across roughly seven centuries, one of the longest continuous scientific datasets in human history — and from it derived numerical schemes that predicted lunar and planetary phenomena accurately without any model of what the bodies were or why they moved.",
            "Greek astronomy introduced the other half: geometric explanation. Eudoxus and Aristotle built nested-sphere models, Aristarchus proposed a Sun-centred arrangement in the third century BCE, Eratosthenes measured Earth's circumference from shadow lengths to within a few percent, and Hipparchus compared his own positions with earlier records to discover the precession of the equinoxes around 130 BCE. Ptolemy's Almagest, around 150 CE, combined observation and geometry into a predictive system that remained the working standard for roughly fourteen centuries.",
          ],
        },
        {
          heading: "Preservation, refinement, and transmission",
          paragraphs: [
            "Between the Almagest and the European Renaissance, the most active astronomy was conducted in the Islamic world, in India, and in China. Astronomers working in Arabic translated and then corrected Greek work: al-Battani refined the length of the solar year and the rate of precession, al-Sufi's Book of Fixed Stars in 964 recorded observations including what is now recognised as the earliest surviving description of the Andromeda Galaxy, and observatories at Maragha and later Samarkand produced instruments and star catalogues of unprecedented accuracy.",
            "The vocabulary records the debt: azimuth, zenith, nadir, almanac and the names of many bright stars — Aldebaran, Betelgeuse, Rigel, Vega, Altair, Deneb — reached modern astronomy through Arabic. Mathematical devices developed at Maragha, notably the Tusi couple, reappear in Copernicus's work; whether that reflects direct transmission or independent rediscovery is still debated by historians.",
          ],
        },
        {
          heading: "The telescopic revolution",
          paragraphs: [
            "In 1609–10 Galileo turned a telescope to the sky and published Sidereus Nuncius: mountains on the Moon, four satellites orbiting Jupiter, the phases of Venus, and the resolution of the Milky Way into individual stars. The phases of Venus were decisive evidence against the pure Ptolemaic arrangement.",
            "Kepler, working from Tycho Brahe's exceptionally precise pre-telescopic positions, published elliptical orbits and the equal-area law in 1609 and the harmonic law in 1619 — abandoning the circle that every previous system had assumed. Newton's Principia in 1687 then supplied the physical cause, showing that a single inverse-square law of gravitation accounted for Kepler's empirical rules and for terrestrial falling bodies alike.",
          ],
        },
        {
          heading: "Measuring what starlight is made of",
          paragraphs: [
            "The nineteenth century brought two transformations. In 1838 Friedrich Bessel measured the parallax of 61 Cygni, establishing for the first time the distance to a star other than the Sun — after two centuries of failed attempts by astronomers who had correctly understood the method but lacked the precision.",
            "More consequentially, Fraunhofer catalogued the dark lines in the solar spectrum in 1814, and in 1859 Kirchhoff and Bunsen showed that such lines identify chemical elements. Astronomy acquired the ability to determine composition, temperature and motion for objects it could never visit. Photography made observations permanent and cumulative, and at Harvard a large programme of spectral classification — with Annie Jump Cannon classifying several hundred thousand stellar spectra — produced the sequence still used today.",
          ],
        },
        {
          heading: "The universe gets larger, twice",
          paragraphs: [
            "In 1912 Henrietta Swan Leavitt found that the pulsation period of Cepheid variable stars tracks their intrinsic luminosity, giving astronomy its first reliable long-range distance indicator. Edwin Hubble used Cepheids in 1923–24 to show that the Andromeda 'nebula' lies far outside the Milky Way, settling a debate about whether the Galaxy constituted the entire universe. It did not.",
            "By 1929 Hubble had established that galaxy recession velocity increases with distance — the observational foundation of cosmic expansion. Georges Lemaître had already derived the relation theoretically in 1927. Penzias and Wilson's accidental detection of the cosmic microwave background in 1965 provided the decisive evidence for a hot dense early universe.",
          ],
        },
        {
          heading: "Opening the rest of the spectrum",
          list: [
            "Radio astronomy began with Karl Jansky's 1932 detection of Galactic emission and matured after the Second World War, later revealing pulsars (1967) and the microwave background.",
            "Space-based observation opened the ultraviolet, X-ray and gamma-ray sky, which the atmosphere blocks entirely.",
            "Infrared astronomy exposed star formation and dust-obscured regions invisible at optical wavelengths — the domain now dominated by JWST.",
            "Non-electromagnetic messengers arrived last: neutrinos from SN 1987A, and gravitational waves from a binary black hole merger detected by LIGO in 2015.",
            "The Event Horizon Telescope produced horizon-scale images of supermassive black holes in 2019 and 2022.",
          ],
        },
        {
          heading: "The modern era",
          paragraphs: [
            "Two twentieth-century results reshaped the field's central questions. The 1995 detection of 51 Pegasi b, a giant planet in a four-day orbit around a Sun-like star, opened exoplanet science and was recognised with the 2019 Nobel Prize in Physics; thousands of confirmed planets have followed. In 1998 two independent supernova programmes found that cosmic expansion is accelerating, introducing dark energy as the dominant term in the cosmic energy budget and leaving its nature unexplained.",
            "The pattern of the whole history holds: each new measurement capability has revealed that the previous picture was a special case.",
          ],
        },
      ],
      faqs: [
        {
          question: "Who first proposed that the Earth orbits the Sun?",
          answer:
            "Aristarchus of Samos advanced a Sun-centred arrangement in the third century BCE, but it was not adopted, partly because the absence of observable stellar parallax was taken as evidence against it — correctly reasoned, but the stars turned out to be far more distant than anyone assumed. Copernicus revived and developed the model in De revolutionibus (1543), and Galileo's observation of the phases of Venus supplied the first decisive observational evidence against the alternative.",
        },
        {
          question: "When was the distance to another star first measured?",
          answer:
            "In 1838, when Friedrich Bessel measured the parallax of 61 Cygni. The method — observing a star's tiny apparent shift as Earth moves around its orbit — had been understood for centuries, but the angles involved are smaller than an arcsecond and required instrumental precision that did not exist earlier.",
        },
        {
          question: "How did astronomers work out what stars are made of?",
          answer:
            "Through spectroscopy. Fraunhofer mapped dark lines in the solar spectrum in 1814, and in 1859 Kirchhoff and Bunsen demonstrated that those lines correspond to specific chemical elements. Applying that to starlight let astronomers determine composition, temperature and motion for objects they could never sample directly — arguably a greater expansion of astronomy's reach than the telescope itself.",
        },
        {
          question: "When did we learn that other galaxies exist?",
          answer:
            "In 1923–24, when Edwin Hubble identified Cepheid variable stars in the Andromeda nebula and used Leavitt's period–luminosity relation to show it lies far beyond the Milky Way. Before that, whether the spiral nebulae were nearby objects within our Galaxy or separate 'island universes' was an open and actively disputed question.",
        },
      ],
      explore: [
        { label: "History catalogue", href: "/history", blurb: "Astronomers, discoveries, publications, and instruments as entities." },
        { label: "Discovery history", href: "/discovery-history", blurb: "How specific findings were made and confirmed." },
        { label: "Timelines", href: "/timelines", blurb: "Chronological threads through astronomy and spaceflight." },
        { label: "Institutions", href: "/institutions", blurb: "The observatories, agencies, and societies that carried the work." },
      ],
      sources: ["britannica", "nasa", "esa", "iau", "nobel"],
      keywords: ["astronomy history", "scientific revolution", "Hipparchus", "Hubble"],
    },
    {
      slug: "history-of-astrology",
      name: "History of Astrology",
      summary: "The cultural history of a centuries-old tradition.",
      overview:
        "This topic traces astrology's development as a cultural and intellectual tradition across civilizations. It is presented as the history of a belief system — a significant one, entangled with the history of astronomy and mathematics for most of two millennia — and not as evidence that astrology works.",
      keyPoints: [
        "Astrology began as state omen-reading, not personal character description.",
        "The individual horoscope is a comparatively late development, appearing around the fifth century BCE.",
        "Astrology and astronomy were a single professional activity for most of recorded history and separated only in the seventeenth century.",
        "The daily sun-sign column is a twentieth-century newspaper invention, not an ancient practice.",
      ],
      body: [
        {
          heading: "Mesopotamian origins: omens for the state",
          paragraphs: [
            "The earliest systematic celestial divination comes from Mesopotamia, where scholars compiled omen collections — the large series known as Enūma Anu Enlil is the central example — linking celestial appearances to events affecting the king and the land. These were interpretations for the state as a whole, not for individuals, and the practice sat alongside the same scribal tradition that produced the astronomical diaries and the mathematical prediction schemes.",
            "This dual role matters for understanding the history: the motivation to predict celestial positions accurately and the motivation to interpret them were, at the outset, the same motivation.",
          ],
        },
        {
          heading: "The birth of the personal horoscope",
          paragraphs: [
            "The twelve-sign zodiac of equal 30-degree divisions appears in Babylonian sources around the fifth century BCE, and the earliest known horoscopes cast for individuals date from roughly the same period. This is the decisive conceptual shift: from reading the sky for the kingdom to reading it for a person and a birth moment.",
            "In Hellenistic Egypt, particularly Alexandria, that material combined with Greek geometry, Egyptian decanal tradition and Aristotelian physics into horoscopic astrology recognisably ancestral to the modern practice — with ascendant, houses, aspects and planetary rulerships. Ptolemy, the same author as the Almagest, wrote the Tetrabiblos as its systematic treatment in the second century CE.",
          ],
        },
        {
          heading: "Transmission across the medieval world",
          list: [
            "Indian astronomy absorbed Hellenistic horoscopic technique — the Yavanajataka is an explicit Sanskrit adaptation — and combined it with the existing nakshatra system to produce the sidereal tradition still practised as Jyotisha.",
            "Astrology was extensively developed in the Islamic world, where figures such as Abu Ma'shar produced influential theoretical works, and where the astronomical tables the practice required drove genuine observational advances.",
            "Latin Europe received both astronomy and astrology through translations from Arabic in the twelfth and thirteenth centuries. Astrology was taught in universities and applied in medicine, where practitioners timed treatments by planetary positions.",
            "Court astrologers were normal appointments across early modern Europe. Kepler cast horoscopes professionally while formulating the laws of planetary motion, and was explicitly sceptical of much of the practice he was paid to perform.",
          ],
        },
        {
          heading: "The separation from astronomy",
          paragraphs: [
            "The split came in the seventeenth century and was gradual rather than a single event. Newtonian physics supplied a mechanism for planetary motion that left no channel through which planetary positions could influence human affairs, the standards of evidence in natural philosophy tightened, and astrology's predictive claims fared poorly under them. By the eighteenth century astrology had lost institutional and academic standing across most of Europe while astronomy continued as a physical science.",
            "The two words had until then often been used interchangeably. Their separation into distinct meanings is itself a product of this period.",
          ],
        },
        {
          heading: "The modern revival and the newspaper column",
          paragraphs: [
            "Popular astrology re-emerged in the late nineteenth and twentieth centuries, shaped by theosophical and psychological currents — the astrologer Alan Leo simplified traditional technique for a mass audience, and later authors reframed the chart as a tool for self-understanding rather than prediction.",
            "The daily sun-sign horoscope is specifically a newspaper format. It is generally traced to R. H. Naylor's astrological feature in a British Sunday paper in 1930, which proved popular enough to become a regular column and then an international convention. Reducing a chart to the Sun's sign alone has no basis in the older technical tradition, which required the full chart.",
          ],
        },
        {
          heading: "How this is presented here",
          paragraphs: [
            "Astrology's historical importance is not in question: it motivated centuries of careful observation, funded instruments and observatories, and shaped mathematics and calendars. Its predictive claims have not survived controlled testing, and Asteria Star does not present them as validated. Both statements are true simultaneously, and this section is written to hold both.",
          ],
        },
      ],
      faqs: [
        {
          question: "How old is astrology?",
          answer:
            "Systematic celestial omen-reading in Mesopotamia goes back to at least the second millennium BCE, and the surviving omen collections are extensive. But astrology as most people mean it today — a chart cast for an individual's birth moment — is younger, appearing around the fifth century BCE and taking recognisable form in Hellenistic Egypt in the following centuries.",
        },
        {
          question: "Were astronomy and astrology once the same thing?",
          answer:
            "For most of recorded history they were the same professional activity. The same scholars compiled observations, computed planetary positions and interpreted them, and the same tables served both purposes. The separation into distinct disciplines happened in the seventeenth and eighteenth centuries, as physics supplied a mechanism for planetary motion that offered no route for planetary influence on human affairs.",
        },
        {
          question: "Where did daily horoscopes in newspapers come from?",
          answer:
            "From twentieth-century popular journalism. The format is usually traced to R. H. Naylor's 1930 feature in a British Sunday newspaper, which became a regular column and then an international standard. Reducing an entire chart to the Sun's sign has no precedent in the older technical tradition, which treated the ascendant, houses and aspects as essential.",
        },
        {
          question: "Did serious astronomers practise astrology?",
          answer:
            "Many did, because it was a normal professional role and often the paid part of the job. Kepler cast horoscopes for patrons while working out the laws of planetary motion, and was openly critical of much of the practice. Judging historical figures by the disciplinary boundaries of a later century misreads what they thought they were doing.",
        },
      ],
      explore: [
        { label: "Zodiac signs", href: "/astrology/zodiac-signs", blurb: "The twelve signs with their documented historical origins." },
        { label: "Babylonian astronomy", href: "/encyclopedia/babylonian-astronomy", blurb: "The observational tradition the omen texts grew alongside." },
        { label: "History catalogue", href: "/history", blurb: "Astronomers and publications as catalogued entities." },
      ],
      sources: ["britannica"],
      keywords: ["astrology history", "horoscopic tradition", "Tetrabiblos", "Enuma Anu Enlil"],
    },
    {
      slug: "ancient-civilizations",
      name: "Ancient Civilizations",
      summary: "How early cultures observed and used the sky.",
      overview:
        "Many ancient societies watched the sky closely, but they did not all do the same thing with it. Some built arithmetic prediction schemes, some built geometric models, some kept observational records for millennia, and some encoded solar alignments in architecture. Treating these as one undifferentiated 'ancient astronomy' obscures what each actually achieved.",
      keyPoints: [
        "Babylonian astronomy was predictive and arithmetic; Greek astronomy was explanatory and geometric. Both worked, differently.",
        "Chinese records of transient events span more than two millennia and remain scientifically useful today.",
        "The zodiac, the sexagesimal degree, and the seven-day planetary week are all Mesopotamian inheritances.",
        "Alignment claims about ancient monuments range from well-established to unsupported; the distinction matters.",
      ],
      body: [
        {
          heading: "Four different things 'astronomy' meant",
          paragraphs: [
            "Before surveying individual cultures it is worth separating the activities, because societies that excelled at one often did not attempt another.",
          ],
          list: [
            "Observational record-keeping: systematically noting what appeared in the sky and when. Babylonian and Chinese practice are the outstanding examples.",
            "Calendrical and agricultural use: reconciling lunar months with the solar year, or timing planting and flooding. Almost universal.",
            "Mathematical prediction: computing future positions and events. Developed to a high level in Mesopotamia, Greece, India and China.",
            "Cosmological explanation: constructing a physical or geometric account of why the sky behaves as it does. Primarily a Greek preoccupation in this period.",
            "Ritual and religious interpretation: reading celestial events as meaningful. Widespread, and frequently the institutional reason the other activities were funded.",
          ],
        },
        {
          heading: "Mesopotamia: the first predictive science",
          paragraphs: [
            "Babylonian scribes maintained the astronomical diaries — nightly records of lunar and planetary positions, weather, river levels and market prices — across roughly seven centuries. The resulting dataset let them identify repeating cycles, including the roughly 18-year Saros period after which eclipse circumstances approximately recur, and eclipse prediction followed from the pattern rather than from any theory of what an eclipse is.",
            "By the Seleucid period this had matured into sophisticated arithmetic schemes, known to modern scholars as System A and System B, which computed lunar and planetary phenomena using step and zigzag functions. The inheritance is still visible: the twelve-sign zodiac, the sexagesimal division of the circle into 360 degrees of 60 minutes, and the seven-day week named for the seven classical planets all descend from this tradition.",
          ],
        },
        {
          heading: "Egypt: calendar, decans, and alignment",
          paragraphs: [
            "Egyptian astronomy was strongly practical and calendrical. The civil calendar used 365 days — twelve 30-day months plus five additional days — and because it omitted the leap day it drifted steadily against the seasons. The heliacal rising of Sirius, its first reappearance in the dawn sky after a period of invisibility, was watched as an annual marker associated with the Nile inundation.",
            "The decans were 36 star groups whose successive risings divided the night, forming the basis of star clocks painted inside coffin lids, and ultimately contributing to the division of the night into hours. Temple and pyramid orientations show deliberate astronomical alignment: the sides of the Great Pyramid are aligned to the cardinal directions to within a small fraction of a degree, an accuracy achievable with careful stellar observation using simple sighting instruments.",
          ],
        },
        {
          heading: "Greece: geometry and physical models",
          paragraphs: [
            "Greek astronomy asked a different question: not only what the sky will do, but why. Eudoxus modelled planetary motion with nested homocentric spheres; Aristarchus proposed a heliocentric arrangement and attempted to measure the relative distances of the Sun and Moon; Eratosthenes derived Earth's circumference from the difference in solar altitude between two locations, obtaining a value within a few percent of the modern figure.",
            "Hipparchus, working around 130 BCE, compiled a star catalogue and by comparing his positions with older records discovered the precession of the equinoxes. Ptolemy's Almagest (c. 150 CE) synthesised the tradition into a complete predictive geometrical system using epicycles, deferents and the equant. The Antikythera mechanism — a geared bronze device recovered from a shipwreck and dated to roughly the second or first century BCE — shows that this astronomy was also embodied in precision mechanical calculation.",
          ],
        },
        {
          heading: "China: the longest continuous record",
          paragraphs: [
            "Chinese astronomy was an official state function, staffed by an imperial bureau whose duty was to observe and report celestial events. The resulting record is exceptional in duration and completeness, and it is still scientifically useful: the 'guest star' recorded in 1054 CE is the supernova whose remnant is the Crab Nebula, and Chinese cometary records extend the observational history of Halley's Comet back to 240 BCE.",
            "The system was equatorial rather than ecliptic in emphasis, dividing the sky into 28 lunar mansions along the celestial equator — a structure quite different from the Mediterranean zodiac. Instrumentation was advanced: Su Song's eleventh-century astronomical clock tower included an escapement-driven armillary sphere, and under the Yuan dynasty Guo Shoujing's Shoushi calendar of 1281 used a value for the tropical year accurate to within seconds.",
          ],
        },
        {
          heading: "India: computation and the nakshatras",
          paragraphs: [
            "Indian astronomy divided the ecliptic into 27 or 28 nakshatras, lunar mansions marking the Moon's daily progress, a scheme attested in early Vedic sources. Later siddhantic astronomy developed substantial computational methods: Aryabhata, writing in 499 CE, produced sine tables, accurate parameters for planetary motion, correct explanations of eclipses as shadow phenomena, and an argument that the apparent daily rotation of the sky results from Earth's own rotation.",
            "Brahmagupta in the seventh century extended this work, and the decimal place-value system with zero that Indian mathematics developed passed westward through the Islamic world and eventually transformed European calculation.",
          ],
        },
        {
          heading: "Mesoamerica: Venus and interlocking calendars",
          paragraphs: [
            "Maya astronomy is documented in surviving codices, of which the Dresden Codex is the most astronomically detailed. It contains a Venus table tracking the planet's synodic cycle — canonically 584 days — with correction procedures that keep the scheme accurate over long spans, together with tables relating to eclipse possibilities.",
            "The calendar system interlocked a 260-day ritual count with a 365-day vague year, and the Long Count provided absolute dating over historical timescales. Some structures show clear astronomical orientation; the building known as El Caracol at Chichén Itzá has sightlines associated with Venus extremes, though interpretations of specific alignments continue to be debated among specialists.",
          ],
        },
        {
          heading: "Megalithic Europe: what the evidence supports",
          paragraphs: [
            "Solar alignment at several Neolithic monuments is well established. At Newgrange in Ireland a roof-box admits sunlight into the passage and chamber around the winter solstice sunrise. Stonehenge's principal axis aligns with sunrise at the summer solstice and sunset at the winter solstice, and the deliberateness of that orientation is not seriously disputed.",
            "Beyond this, claims escalate quickly and the evidence does not. Proposals that such sites functioned as precise eclipse computers or encoded advanced astronomical knowledge are not supported by the archaeological record, and with enough stones and enough candidate targets, chance alignments are statistically expected. This section reports the well-attested solar and lunar orientations and does not extend past them.",
          ],
        },
        {
          heading: "Navigation without instruments",
          paragraphs: [
            "Polynesian voyagers crossed thousands of kilometres of open Pacific using no instruments at all, navigating by a memorised star compass of rising and setting points, swell patterns, cloud formations and bird behaviour. It is a fully developed observational system transmitted orally rather than in writing, and its successful modern reconstruction — including instrument-free voyages between Hawaii and Tahiti — demonstrated that the technique works as described.",
          ],
        },
      ],
      faqs: [
        {
          question: "Which ancient civilization had the most advanced astronomy?",
          answer:
            "The question does not have one answer, because they were advanced at different things. Babylonian astronomy was unmatched at arithmetic prediction and long-term record-keeping. Greek astronomy was unmatched at geometric explanation. Chinese astronomy produced the longest continuous observational record. Indian astronomy developed powerful computational methods. Maya astronomy tracked Venus with exceptional precision. Ranking them requires choosing a criterion first.",
        },
        {
          question: "Could ancient astronomers predict eclipses?",
          answer:
            "Yes, though not by understanding the geometry in every case. Babylonian scribes used the roughly 18-year Saros cycle, derived from centuries of records, to predict when eclipse circumstances would recur — accurate prediction from pattern rather than from theory. Greek astronomy later supplied the geometric explanation, and Indian astronomy independently described eclipses as shadow phenomena.",
        },
        {
          question: "Was Stonehenge an astronomical observatory?",
          answer:
            "It has a clear and deliberate solar alignment — the principal axis frames sunrise at the summer solstice and sunset at the winter solstice — and that is well supported. Claims that it functioned as a precise eclipse-prediction device or encoded sophisticated astronomical knowledge go well beyond the archaeological evidence. It is better described as a monument with intentional solar orientation than as an observatory in any working sense.",
        },
        {
          question: "What did ancient astronomy give us that we still use?",
          answer:
            "A great deal. The 360-degree circle and its division into 60 minutes and 60 seconds is Mesopotamian sexagesimal arithmetic. The twelve-sign zodiac and the seven-day week named for the classical planets have the same origin. The division of the night into hours descends from Egyptian decanal star clocks. Many bright-star names reached us through Arabic transmission of Greek catalogues, and Chinese records of historical supernovae and comets are still used as data.",
        },
      ],
      explore: [
        { label: "Babylonian astronomy", href: "/encyclopedia/babylonian-astronomy", blurb: "The record-keeping and prediction schemes in detail." },
        { label: "History catalogue", href: "/history", blurb: "Astronomers, catalogues, and instruments as entities." },
        { label: "Constellations", href: "/constellations", blurb: "The modern IAU constellations and their older origins." },
        { label: "Reference systems", href: "/reference-systems", blurb: "Precession, coordinates, and calendars." },
      ],
      sources: ["britannica", "iau", "nasa"],
      keywords: ["ancient astronomy", "archaeoastronomy", "Babylonian", "Maya astronomy", "Antikythera"],
    },
    {
      slug: "greek-mythology",
      name: "Greek Mythology",
      summary: "The Greek myths behind constellation and planet names.",
      overview:
        "Greek mythology supplies many of the stories attached to constellations and the names later traditions used. These are cultural narratives, presented as mythology rather than as fact, and the sky figures often predate the Greek stories attached to them.",
      keyPoints: [
        "Many constellation figures were inherited from Mesopotamia and given Greek stories afterwards.",
        "Ptolemy's Almagest fixed 48 classical constellations that form the core of the modern 88.",
        "The myths are frequently inconsistent between sources — there is no single canonical version.",
        "Greek names reached modern astronomy mostly in Latin form, via Roman and then Arabic and medieval transmission.",
      ],
      body: [
        {
          heading: "Where the sky figures came from",
          paragraphs: [
            "The Greeks did not invent most of the constellations they named. Several — including figures corresponding to Taurus, Leo and Scorpius — have recognisable Mesopotamian antecedents attested centuries earlier, and were absorbed along with the zodiac itself. What Greek culture supplied was a rich narrative layer and, eventually, a systematic catalogue.",
            "Aratus's poem Phaenomena, in the third century BCE, popularised a set of sky figures and their stories to a wide audience. Ptolemy's Almagest then listed 48 constellations with member stars, and that catalogue remained the working reference until European navigators added southern figures in the sixteenth and seventeenth centuries. The International Astronomical Union fixed the modern list of 88 with precise boundaries in 1922 and 1930.",
          ],
        },
        {
          heading: "The best-known sky stories",
          list: [
            "Orion: a giant hunter, placed in the sky after his death, pursued across it by Scorpius — the two constellations are positioned so that one sets as the other rises.",
            "Perseus, Andromeda, Cassiopeia, Cepheus and Cetus: an interlocking group telling a single narrative, unusually for constellation myths, and occupying adjacent regions of sky.",
            "Ursa Major and Ursa Minor: associated with Callisto and her son, transformed and placed among the stars — one of several myths explaining why the bears circle the pole and never set.",
            "Draco: the dragon of various narratives including the guardian of the golden apples, wound between the two bears.",
            "Cygnus: the swan, linked to Zeus in several versions of the story, flying along the Milky Way.",
            "Lyra: the lyre of Orpheus, containing Vega, one of the brightest stars in the northern sky.",
          ],
        },
        {
          heading: "There is no single canonical version",
          paragraphs: [
            "Greek myth was transmitted through many authors across many centuries, and they disagree. The same constellation is explained by different stories in different sources; the same figure appears with different parentage, motives and fates. Later compilations, particularly the Latin Poeticon Astronomicon attributed to Hyginus, gathered variants side by side without choosing between them.",
            "Popular retellings often smooth this into one authoritative narrative. That is a modern editorial choice, not a feature of the original material, and it is worth knowing when reading any confident single account of 'the myth of' a constellation.",
          ],
        },
        {
          heading: "How the names reached modern astronomy",
          paragraphs: [
            "Modern constellation names are Latin, not Greek, because the Roman adaptation is what medieval and early modern Europe inherited. Star names took a more circuitous route: Greek catalogues were translated into Arabic, where descriptive designations were often coined or adapted, and were translated back into Latin in the twelfth and thirteenth centuries — which is why Greek-figure constellations contain Arabic-derived star names such as Betelgeuse and Rigel in Orion.",
            "The planets carry Roman rather than Greek names in English usage, with Uranus the exception, retaining a Greek form. Their satellites, by contrast, are largely named from Greek mythology, and the Jovian moons Io, Europa, Ganymede and Callisto are named for figures associated with Zeus.",
          ],
        },
      ],
      faqs: [
        {
          question: "Did the Greeks invent the constellations?",
          answer:
            "Not most of them. Several figures, including those corresponding to Taurus, Leo and Scorpius, have Mesopotamian antecedents attested centuries earlier and were inherited along with the zodiac. What Greek culture contributed was an extensive narrative tradition and, in Ptolemy's Almagest, a systematic catalogue of 48 constellations that anchored the sky map for the next fourteen centuries.",
        },
        {
          question: "Why are constellations named in Latin if the myths are Greek?",
          answer:
            "Because Rome adapted Greek mythology and Latin was the scholarly language through which the material reached medieval and early modern Europe. The stories are Greek in origin; the names modern astronomy standardised are their Latin forms.",
        },
        {
          question: "Why do many stars in Greek constellations have Arabic names?",
          answer:
            "Because of the transmission route. Greek star catalogues were translated into Arabic, where astronomers used and coined descriptive names, and those texts were translated into Latin in the twelfth and thirteenth centuries. Betelgeuse and Rigel are Arabic-derived star names inside a constellation carrying a Greek mythological identity.",
        },
      ],
      explore: [
        { label: "Constellations", href: "/constellations", blurb: "All 88 IAU constellations, boundaries, and bright stars." },
        { label: "Roman mythology", href: "/encyclopedia/roman-mythology", blurb: "The Roman adaptation that named the planets." },
        { label: "Sky catalogues", href: "/sky-catalogs", blurb: "How stars and deep-sky objects are formally designated." },
      ],
      sources: ["britannica", "iau"],
      keywords: ["greek myths", "constellation stories", "Orion myth", "Ptolemy 48 constellations"],
    },
    {
      slug: "roman-mythology",
      name: "Roman Mythology",
      summary: "The Roman names that the planets still carry.",
      overview:
        "Roman mythology gave modern astronomy the names of the planets and many enduring symbols. This topic presents those myths as cultural heritage, alongside their adaptation from Greek and earlier tradition.",
      keyPoints: [
        "The planet names are Roman deities, but the association of specific deities with specific planets is older than Rome.",
        "Uranus is the one planet with a Greek rather than Roman name — and it was nearly called something else entirely.",
        "The Julian calendar reform of 46 BCE is Rome's most durable astronomical legacy.",
        "Roman astronomy was largely transmission and application rather than original mathematical work.",
      ],
      body: [
        {
          heading: "Naming the planets",
          paragraphs: [
            "The five planets visible to the unaided eye were associated with deities long before Rome. Mesopotamian tradition linked them to specific gods, the Greeks mapped those onto their own pantheon, and Rome mapped them again onto Latin equivalents. The result is the set English still uses: Mercury for the swiftest, Venus for the brightest, Mars for the red one, Jupiter for the largest and brightest of the outer planets, Saturn for the slowest of the classical five.",
            "The association is not arbitrary in every case. Mercury moves fastest across the sky and carries the name of the messenger god; Mars is visibly orange-red and carries the name of the god of war. Others reflect brightness and stateliness rather than any observable property.",
          ],
        },
        {
          heading: "The two later planets",
          paragraphs: [
            "Uranus, discovered by William Herschel in 1781, breaks the pattern by carrying a Greek name in its Latinised form. Herschel proposed naming it after King George III; that did not achieve international acceptance, and Johann Bode's suggestion of Uranus — the mythological father of Saturn, extending the generational sequence — eventually prevailed.",
            "Neptune, identified in 1846 following prediction from irregularities in the orbit of Uranus, took the Roman sea god's name and restored the convention. Pluto, discovered in 1930 and reclassified as a dwarf planet in 2006, was named for the Roman god of the underworld, following a suggestion from an eleven-year-old in Oxford.",
          ],
        },
        {
          heading: "Rome's calendar legacy",
          paragraphs: [
            "The most consequential Roman contribution to practical astronomy was calendrical. The pre-existing Roman calendar had drifted badly out of step with the seasons, and in 46 BCE Julius Caesar introduced a reformed solar calendar of 365 days with a leap day every fourth year, developed with the Alexandrian astronomer Sosigenes.",
            "The Julian year of 365.25 days slightly overestimates the tropical year, accumulating roughly three days of error every four centuries. The Gregorian reform of 1582 corrected this by dropping three leap days in every four hundred years, and that refined version remains the civil calendar in international use. The month names July and August commemorate Julius Caesar and Augustus.",
          ],
        },
        {
          heading: "What Roman astronomy did and did not do",
          paragraphs: [
            "Rome's role in astronomy was primarily preservation, application and transmission rather than original theory. Pliny the Elder's Natural History compiled Greek astronomical knowledge for a Latin readership; Roman engineering applied astronomy to surveying, timekeeping and navigation. The major theoretical work of the Roman period — Ptolemy's Almagest — was written in Greek, in Roman Egypt.",
            "The lasting inheritance is therefore linguistic and calendrical rather than mathematical: the names of the planets, most of the constellation names in their Latin forms, and the structure of the civil year.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why are the planets named after Roman gods?",
          answer:
            "Because Latin was the scholarly language of medieval and early modern Europe, and the Roman names were what that tradition inherited and standardised. The underlying association of planets with deities is much older — Mesopotamian in origin, adapted by the Greeks, and then mapped onto Latin equivalents by Rome.",
        },
        {
          question: "Why is Uranus the exception?",
          answer:
            "Because it was discovered in 1781, long after the naming convention had ceased to be a living tradition, and the name was chosen by argument. Herschel proposed honouring King George III, which did not gain acceptance outside Britain. Johann Bode proposed Uranus — mythological father of Saturn, extending the generational logic of Jupiter and Saturn — and that eventually became standard.",
        },
        {
          question: "What is the Julian calendar and why was it replaced?",
          answer:
            "Julius Caesar introduced it in 46 BCE: a 365-day solar year with a leap day every fourth year, developed with the Alexandrian astronomer Sosigenes. Its average year of 365.25 days is slightly too long, drifting about three days every four centuries against the seasons. The Gregorian reform of 1582 removed three leap days per four hundred years to correct the drift.",
        },
      ],
      explore: [
        { label: "Solar System", href: "/solar-system", blurb: "The planets themselves, with measured data and provenance." },
        { label: "Greek mythology", href: "/encyclopedia/greek-mythology", blurb: "The tradition Rome adapted." },
        { label: "Reference systems", href: "/reference-systems", blurb: "Calendars, time scales, and their definitions." },
      ],
      sources: ["britannica", "iau", "nasa"],
      keywords: ["roman myths", "planet names origin", "Julian calendar"],
    },
    {
      slug: "egyptian-mythology",
      name: "Egyptian Mythology",
      summary: "Sky deities and star lore of ancient Egypt.",
      overview:
        "Ancient Egyptian culture wove the sky into its mythology, its calendar and its architecture. This topic surveys sky deities, decanal star lore and monumental alignment as cultural and historical heritage.",
      keyPoints: [
        "Egyptian sky mythology is dominated by Nut, the sky arched over the earth, swallowing and rebirthing the Sun daily.",
        "The 36 decans divided the night and are an ancestor of the 24-hour day.",
        "The heliacal rising of Sirius marked the Egyptian year and was associated with the Nile inundation.",
        "Pyramid cardinal alignment is accurate to a fraction of a degree — achieved with stellar sighting, not guesswork.",
      ],
      body: [
        {
          heading: "The sky as a body",
          paragraphs: [
            "The central Egyptian sky image is Nut, the sky goddess, depicted arched over the earth god Geb with her fingers and toes touching the horizons. The Sun is swallowed at dusk, passes through her body during the night, and is reborn at dawn — a cyclical rather than linear cosmology that maps directly onto the daily solar cycle and onto Egyptian ideas about death and rebirth.",
            "Solar deity worship was itself layered: Ra as the Sun in its daytime course, Khepri as the rising Sun, Atum as the setting Sun, later syncretised with Amun as Amun-Ra. Osiris was associated with the constellation known to the Egyptians as Sah, corresponding closely to what later tradition called Orion, and the goddess Sopdet was identified with Sirius.",
          ],
        },
        {
          heading: "Decans and the origin of hours",
          paragraphs: [
            "The Egyptians divided the ecliptic band into 36 groups of stars called decans, each rising heliacally about ten days apart. Because a new decan rose roughly every 40 minutes through the night, their successive appearances marked out the hours of darkness. Diagonal star tables painted inside coffin lids from the Middle Kingdom served as tables of which decan should be rising at each stage of the night.",
            "Twelve decans are visible during a typical night, and this twelvefold division of darkness — later paired with a twelvefold division of daylight — is a direct ancestor of the 24-hour day. Egyptian hours were seasonal, varying in length with the night, and only became equal-length hours much later.",
          ],
        },
        {
          heading: "Sirius, the calendar, and the Nile",
          paragraphs: [
            "The Egyptian civil calendar had 365 days: twelve months of 30 days plus five epagomenal days. Lacking a leap day, it slipped against the solar year by about one day every four years, so any given calendar date cycled through all seasons over roughly 1,460 years.",
            "Against that drifting civil calendar, the heliacal rising of Sirius — the star's first visibility in the dawn sky after weeks lost in solar glare — provided a fixed annual marker, and in the Egyptian climate it fell near the onset of the Nile inundation. The relationship is well attested in the sources; the tightness of the correlation and its uniformity across Egyptian history are matters where Egyptologists exercise more caution than popular accounts usually do.",
          ],
        },
        {
          heading: "Alignment in architecture",
          paragraphs: [
            "The Great Pyramid at Giza is aligned to the cardinal directions with an error of only a small fraction of a degree, an accuracy that requires deliberate astronomical sighting. Several methods have been proposed, most involving observation of circumpolar stars — for instance bisecting the rising and setting positions of a star, or using the simultaneous transit of two stars — and the debate concerns which technique was used, not whether alignment was intentional.",
            "Temple orientations elsewhere show solar alignment, most famously at Abu Simbel, where the inner sanctuary is illuminated on specific dates. As with megalithic Europe, the well-documented alignments are worth reporting precisely and the more elaborate correlation theories are not supported by the archaeological evidence.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why was Sirius so important in ancient Egypt?",
          answer:
            "Because its heliacal rising — the first dawn reappearance after a period lost in the Sun's glare — recurred on a reliable annual schedule and fell near the beginning of the Nile inundation, the event that governed Egyptian agriculture. Against a civil calendar that drifted by a day every four years, Sirius provided a fixed astronomical marker, and the star was identified with the goddess Sopdet.",
        },
        {
          question: "What were the decans?",
          answer:
            "Thirty-six star groups spaced around the sky so that a new one rose heliacally roughly every ten days. Their successive risings through the night marked out its divisions, and diagonal star tables inside coffin lids record which decan should be rising when. About twelve are visible in a typical night, and that division is an ancestor of the twelve night hours and ultimately the 24-hour day.",
        },
        {
          question: "Are the pyramids astronomically aligned?",
          answer:
            "Their orientation to the cardinal directions is extremely accurate — within a fraction of a degree for the Great Pyramid — and that precision requires deliberate stellar sighting. What method was used is debated among Egyptologists, with several circumpolar-star techniques proposed. Broader claims that the pyramid layout encodes specific constellations are not supported by the archaeological evidence.",
        },
      ],
      explore: [
        { label: "Ancient civilizations", href: "/encyclopedia/ancient-civilizations", blurb: "How Egyptian practice compares to other sky cultures." },
        { label: "Constellations", href: "/constellations", blurb: "Modern constellations, including Orion — Egyptian Sah." },
        { label: "Stars", href: "/stars", blurb: "Sirius and other bright stars with catalogue data." },
      ],
      sources: ["britannica", "iau"],
      keywords: ["egyptian myths", "sky gods", "decans", "Sothic rising", "Nut"],
    },
    {
      slug: "babylonian-astronomy",
      name: "Babylonian Astronomy",
      summary: "Early systematic record-keeping of the heavens.",
      overview:
        "Babylonian scholars kept systematic records of celestial events for centuries and developed mathematical methods to predict them. This is history of science: the first sustained programme of quantitative astronomical prediction anywhere, and the origin of several conventions still in use.",
      keyPoints: [
        "The astronomical diaries span roughly seven centuries of near-nightly observation.",
        "Prediction came from arithmetic pattern-finding, not from any physical model of the heavens.",
        "System A and System B computed planetary and lunar phenomena with step and zigzag functions.",
        "The 360-degree circle, the sexagesimal minute and second, and the twelve-sign zodiac all descend from this tradition.",
      ],
      body: [
        {
          heading: "The astronomical diaries",
          paragraphs: [
            "From roughly the mid-eighth century BCE until the first century BCE, scribes in Babylon maintained a systematic observational record. The diaries note lunar and planetary positions relative to reference stars, eclipses, solstices and equinoxes, weather, the level of the Euphrates, and commodity prices — a combined astronomical and civic record kept with remarkable consistency across changes of dynasty and empire.",
            "The duration is what makes it scientifically extraordinary. Seven centuries of comparable observations allow long-period cycles to be detected empirically, and modern researchers still use Babylonian eclipse records to constrain the gradual slowing of Earth's rotation.",
          ],
        },
        {
          heading: "Prediction without a model",
          paragraphs: [
            "The Babylonian approach was to find repeating numerical patterns rather than to explain them. The Saros period — about 18 years and 11 days, after which the geometry of Sun, Moon and nodes approximately repeats — allows eclipse possibilities to be predicted from a table, with no need to know that an eclipse is a shadow.",
            "This is a genuinely different epistemology from the Greek one, and it worked. It is worth resisting the assumption that explanation must precede prediction: here, accurate prediction came first, and by many centuries.",
          ],
        },
        {
          heading: "The mathematical astronomy of the Seleucid period",
          paragraphs: [
            "By the last few centuries BCE the tradition had developed into sophisticated computational schemes, which modern scholarship labels System A and System B. These calculate the positions and phenomena of the Moon and planets using piecewise arithmetic functions — step functions in System A, linear zigzag functions in System B — applied to the relevant periodic quantities.",
            "The procedures are set out on tablets as computational recipes, and their parameters were derived from the observational record. In modern terms these are numerical methods for periodic phenomena, developed and validated empirically.",
          ],
        },
        {
          heading: "The zodiac and what else we inherited",
          list: [
            "The division of the ecliptic into twelve equal 30-degree signs appears in Babylonian sources around the fifth century BCE, replacing an earlier reference-star scheme. This is the direct ancestor of the astrological zodiac.",
            "The sexagesimal number system gave the 360-degree circle, the 60-minute degree and the 60-second minute — still standard in astronomy and navigation.",
            "The seven-day week, with days associated with the seven classical moving bodies, has Mesopotamian roots.",
            "The concept of a systematic, dated, quantitative observational record maintained over generations — arguably the most important inheritance of all.",
          ],
        },
        {
          heading: "How this relates to astrology",
          paragraphs: [
            "The same scribal culture produced the celestial omen literature, of which the series Enūma Anu Enlil is the principal example. Separating 'the astronomy' from 'the astrology' in this material is a modern distinction that the practitioners would not have recognised: predicting a celestial event and interpreting its significance were parts of one activity.",
            "Asteria Star treats the observational and mathematical achievement as history of science, and the omen and horoscopic material as cultural history, while noting plainly that they came from the same hands.",
          ],
        },
      ],
      faqs: [
        {
          question: "How did Babylonian astronomers predict eclipses without understanding them?",
          answer:
            "By finding the pattern in their own records. The Saros period of roughly 18 years and 11 days causes eclipse circumstances to recur approximately, and centuries of systematic observation made that cycle detectable. Prediction followed from tabulated recurrence, not from any model of the Moon passing into Earth's shadow — that explanation came later, from Greek and Indian astronomy.",
        },
        {
          question: "Did the zodiac originate in Babylon?",
          answer:
            "The twelve equal 30-degree divisions of the ecliptic do, appearing in Babylonian sources around the fifth century BCE and replacing an earlier system based on reference stars. Several of the constellation figures associated with the signs are older still. Greek, Indian and later traditions all inherited this framework.",
        },
        {
          question: "Are Babylonian records still scientifically useful?",
          answer:
            "Yes. Dated eclipse observations from the Babylonian record are used to constrain the long-term slowing of Earth's rotation, because the difference between where an eclipse was actually observed and where a constant-rotation model predicts it should have been visible accumulates measurably over two and a half thousand years.",
        },
      ],
      explore: [
        { label: "Ancient civilizations", href: "/encyclopedia/ancient-civilizations", blurb: "How this compares with Greek, Chinese, and Maya practice." },
        { label: "History of astrology", href: "/encyclopedia/history-of-astrology", blurb: "The omen tradition from the same scribal culture." },
        { label: "Reference systems", href: "/reference-systems", blurb: "Degrees, minutes, seconds, and the ecliptic frame." },
      ],
      sources: ["britannica", "iau"],
      keywords: ["mesopotamian astronomy", "cuneiform records", "Saros cycle", "System A System B"],
    },
    {
      slug: "famous-astronomers",
      name: "Famous Astronomers",
      summary: "The people who changed how we see the cosmos.",
      overview:
        "Narrative history of the individuals whose work changed astronomy — what they actually did, what they got wrong, and what the state of knowledge was when they did it. The Astronomy hub keeps a structured directory; this topic supplies the context.",
      keyPoints: [
        "Most major advances rest on someone else's data: Kepler needed Tycho, Hubble needed Leavitt.",
        "Being wrong about one thing and right about another is the normal condition of scientific work.",
        "Several foundational contributions came from people excluded from formal academic positions at the time.",
      ],
      body: [
        {
          heading: "Before the telescope",
          list: [
            "Hipparchus (2nd century BCE) compiled a star catalogue and, comparing his positions against older records, discovered the precession of the equinoxes. He also introduced the magnitude scale astronomy still uses.",
            "Ptolemy (c. 100–170 CE) wrote the Almagest, a complete predictive geometric system whose accuracy kept it in use for roughly fourteen centuries — a longevity no subsequent astronomical model has matched.",
            "Al-Battani (c. 858–929) refined the length of the solar year and the rate of precession, producing values considerably more accurate than Ptolemy's.",
            "Al-Sufi (903–986) wrote the Book of Fixed Stars, correcting and illustrating Ptolemy's catalogue, and recorded what is now recognised as the earliest surviving description of the Andromeda Galaxy.",
            "Ulugh Beg (1394–1449) built a major observatory at Samarkand and produced a star catalogue of exceptional pre-telescopic accuracy.",
            "Tycho Brahe (1546–1601) made positional measurements accurate to roughly an arcminute without a telescope, and his 1572 observation of a new star challenged the doctrine that the heavens were unchanging.",
          ],
        },
        {
          heading: "The revolution",
          list: [
            "Nicolaus Copernicus (1473–1543) developed a heliocentric model in De revolutionibus. It still used circular orbits and epicycles and was not obviously more accurate than Ptolemy's, but it reorganised the problem decisively.",
            "Johannes Kepler (1571–1630) derived elliptical orbits and the area and harmonic laws from Tycho's data — abandoning circular motion, an assumption every previous model had treated as self-evident.",
            "Galileo Galilei (1564–1642) published the first substantial telescopic observations in 1610: lunar mountains, four moons of Jupiter, the phases of Venus, and the resolution of the Milky Way into stars.",
            "Isaac Newton (1643–1727) showed in the Principia that a single inverse-square gravitational law accounts for Kepler's empirical laws and for terrestrial motion alike, unifying celestial and earthly physics.",
          ],
        },
        {
          heading: "Building the modern picture",
          list: [
            "William Herschel (1738–1822) discovered Uranus in 1781, catalogued thousands of nebulae and clusters with his sister Caroline Herschel — herself the discoverer of several comets — and detected infrared radiation.",
            "Friedrich Bessel (1784–1846) measured the first stellar parallax, for 61 Cygni, in 1838.",
            "Annie Jump Cannon (1863–1941) classified several hundred thousand stellar spectra at Harvard and established the classification sequence still in use.",
            "Henrietta Swan Leavitt (1868–1921) discovered the period–luminosity relation of Cepheid variables in 1912, supplying the distance indicator on which extragalactic astronomy was built.",
            "Cecilia Payne-Gaposchkin (1900–1979) showed in her 1925 doctoral thesis that stars are composed overwhelmingly of hydrogen and helium — a conclusion so contrary to expectation that she was pressed to soften it, and which was subsequently confirmed.",
            "Edwin Hubble (1889–1953) established that spiral nebulae are external galaxies and that recession velocity increases with distance.",
          ],
        },
        {
          heading: "The twentieth century onward",
          list: [
            "Subrahmanyan Chandrasekhar (1910–1995) derived the mass limit above which a white dwarf cannot support itself, foundational to stellar-endpoint physics.",
            "Jocelyn Bell Burnell (b. 1943) detected the first pulsar in 1967 while a graduate student, identifying a repeating radio signal that proved to be a rotating neutron star.",
            "Vera Rubin (1928–2016) measured galaxy rotation curves showing that outer regions orbit far faster than visible mass allows — the central observational evidence for dark matter.",
            "Michel Mayor and Didier Queloz detected 51 Pegasi b in 1995, the first confirmed planet orbiting a Sun-like star, work recognised with the 2019 Nobel Prize in Physics.",
          ],
        },
        {
          heading: "Reading these histories honestly",
          paragraphs: [
            "Two habits are worth carrying into any account of scientific biography. First, discoveries almost never belong to one person: Kepler's laws required Tycho's data, Hubble's distances required Leavitt's relation, and large-scale classification work was done by teams whose members were often uncredited in the naming of the results.",
            "Second, being wrong is normal. Kepler spent years on a model of nested Platonic solids that was entirely mistaken. Galileo's theory of the tides was wrong. Hubble's initial expansion constant was off by a large factor. Presenting historical figures as uniformly correct misrepresents how science actually proceeds.",
          ],
        },
      ],
      faqs: [
        {
          question: "Who discovered that the universe is expanding?",
          answer:
            "The observational relation between galaxy distance and recession velocity was established by Edwin Hubble in 1929, building on Vesto Slipher's earlier redshift measurements and Henrietta Leavitt's period–luminosity relation for distances. Georges Lemaître had derived the expansion theoretically and estimated the rate in 1927. It is a case where no single name is a complete answer.",
        },
        {
          question: "What did Galileo actually discover?",
          answer:
            "In 1610 he published observations of mountains and craters on the Moon, four satellites orbiting Jupiter, the resolution of the Milky Way into individual stars, and — crucially — the full set of phases of Venus, which is incompatible with the pure Ptolemaic arrangement. He did not invent the telescope, and his own theory of the tides was incorrect.",
        },
        {
          question: "Who first showed that stars are mostly hydrogen?",
          answer:
            "Cecilia Payne-Gaposchkin, in her 1925 doctoral thesis, from analysis of stellar spectra. The conclusion contradicted the prevailing assumption that stars had roughly Earth-like composition, and she was pressed to present it more tentatively than her analysis warranted. It was confirmed within a few years and is now foundational.",
        },
      ],
      explore: [
        { label: "History catalogue", href: "/history", blurb: "Astronomers, publications, discoveries, and theories as entities." },
        { label: "Discovery history", href: "/discovery-history", blurb: "How individual findings were made and verified." },
        { label: "Institutions", href: "/institutions", blurb: "The observatories and organisations behind the work." },
      ],
      sources: ["britannica", "nasa", "nobel", "esa"],
      keywords: ["historic astronomers", "discoveries", "Kepler", "Leavitt", "Rubin"],
    },
    {
      slug: "space-exploration",
      name: "Space Exploration",
      summary: "The story of how humanity reached into space.",
      overview:
        "The narrative history of spaceflight — its milestones, programmes and turning points, and the political and engineering context in which they happened. Individual missions and spacecraft are catalogued elsewhere on the platform; this topic tells the story that connects them.",
      keyPoints: [
        "The first decade of spaceflight compressed an extraordinary amount of progress: satellite to crewed lunar landing in under twelve years.",
        "Robotic exploration has visited every planet in the Solar System and now operates beyond the heliopause.",
        "The post-Apollo era shifted from national competition toward international cooperation and, more recently, commercial provision.",
      ],
      body: [
        {
          heading: "The opening decade",
          paragraphs: [
            "Sputnik 1 reached orbit on 4 October 1957 — a metal sphere with radio transmitters, whose significance was entirely in demonstrating that orbit was achievable. Yuri Gagarin became the first human in space on 12 April 1961, and Neil Armstrong and Buzz Aldrin landed on the Moon on 20 July 1969. Under twelve years separate the first satellite from the first crewed lunar landing.",
            "That pace was driven by superpower competition, and understanding the period requires acknowledging that: the engineering was extraordinary and the funding was political. Both the Soviet and American programmes drew directly on wartime rocketry, and both were, in their early years, closely tied to military missile development.",
          ],
        },
        {
          heading: "Robotic exploration of the Solar System",
          list: [
            "Luna 3 photographed the far side of the Moon in 1959; Luna 9 achieved the first soft landing in 1966.",
            "Mariner 4 returned the first close images of Mars in 1965, showing a cratered surface that ended a century of speculation about canals.",
            "Venera landers reached the surface of Venus and transmitted from it in the 1970s, surviving briefly in conditions near 460 °C and roughly 90 bar.",
            "Voyager 1 and 2, launched in 1977, surveyed the outer planets; Voyager 2 remains the only spacecraft to have visited Uranus and Neptune. Both have since crossed the heliopause into interstellar space.",
            "Galileo orbited Jupiter, Cassini–Huygens orbited Saturn and landed a probe on Titan, and New Horizons flew past Pluto in 2015.",
            "Sample return has matured: from Apollo and Luna lunar samples to Hayabusa2 at Ryugu and OSIRIS-REx at Bennu.",
          ],
        },
        {
          heading: "Living and working in orbit",
          paragraphs: [
            "Continuous human presence in space is a more recent achievement than the Moon landings and in some ways a harder one. Salyut and Skylab in the 1970s established that crews could live in orbit for extended periods; Mir, from 1986, accumulated long-duration experience across a decade and a half.",
            "The International Space Station has been continuously crewed since November 2000 — an unbroken human presence off Earth spanning more than two decades, assembled from modules launched by multiple nations and operated as a partnership between space agencies that had recently been rivals.",
          ],
        },
        {
          heading: "Telescopes as exploration",
          paragraphs: [
            "Space observatories are exploration by another route. Hubble, launched in 1990 and repaired and upgraded by shuttle crews across several servicing missions, transformed cosmology and public engagement alike. Chandra opened high-resolution X-ray astronomy; Spitzer and later JWST opened the infrared; Kepler and TESS moved exoplanet detection from individual discoveries to population statistics; Gaia is measuring positions and motions for over a billion stars.",
            "These missions produced most of the platform's underlying catalogue data, and their archives are the reason field-level provenance is possible at all.",
          ],
        },
        {
          heading: "The changing shape of the enterprise",
          paragraphs: [
            "The character of spaceflight has changed substantially since the 1960s. National competition gave way to international partnership on the ISS; more recently, commercial providers have taken over routine launch and crew transport under contract, and launch costs and cadence have shifted markedly as a result.",
            "New national programmes have also entered: China has operated crewed missions and landed rovers on the Moon and Mars, and India, Japan, the European Space Agency, the UAE and others run independent planetary programmes. Current crewed lunar plans and Mars sample return are both multi-agency undertakings whose schedules have shifted repeatedly, and Asteria Star records planned missions as planned rather than as accomplished.",
          ],
        },
      ],
      faqs: [
        {
          question: "How long was it between the first satellite and the first Moon landing?",
          answer:
            "Under twelve years. Sputnik 1 reached orbit on 4 October 1957 and Apollo 11 landed on 20 July 1969. The pace reflects both extraordinary engineering and exceptional political funding driven by superpower competition.",
        },
        {
          question: "Has any spacecraft left the Solar System?",
          answer:
            "Voyager 1 and Voyager 2 have crossed the heliopause — the boundary where the Sun's outward-flowing solar wind gives way to the interstellar medium — and are returning data from interstellar space. They have not left the Sun's gravitational influence, which extends far further; on that definition no spacecraft is close to leaving.",
        },
        {
          question: "Why did crewed missions stop going to the Moon?",
          answer:
            "Apollo's funding was tied to a specific geopolitical objective, and once that was met, the programme's cost was no longer politically sustainable — later planned missions were cancelled and the last landing was in 1972. Subsequent human spaceflight concentrated on Earth orbit, which is far cheaper and supports continuous operation.",
        },
        {
          question: "Which planets have been visited by spacecraft?",
          answer:
            "All eight, plus Pluto and several asteroids and comets. Mercury, Venus, Mars, Jupiter and Saturn have had orbiters; Uranus and Neptune have been visited only by Voyager 2 flybys in 1986 and 1989. Landers have operated on Venus, Mars, the Moon, Titan, and on asteroid and comet surfaces.",
        },
      ],
      explore: [
        { label: "Exploration", href: "/exploration", blurb: "Missions, programmes, and agencies as catalogued entities." },
        { label: "Human spaceflight", href: "/human-spaceflight", blurb: "Crewed programmes, stations, and vehicles." },
        { label: "Spaceflight timeline", href: "/timeline", blurb: "Milestones in chronological order." },
        { label: "Rockets", href: "/rockets", blurb: "Launch vehicles, engines, and propellants." },
      ],
      sources: ["nasa", "esa", "britannica", "jaxa"],
      keywords: ["space history", "space race", "exploration milestones", "Apollo", "Voyager"],
    },
    {
      slug: "physics-basics",
      name: "Physics Basics",
      summary: "The physical ideas that make sense of the universe.",
      overview:
        "The core physics behind astronomy — gravity, light, energy and motion — at an accessible level, so that the rest of the site's science follows. These are the ideas that recur on nearly every entity page in the platform.",
      keyPoints: [
        "Gravity is the only force with unlimited range that is always attractive, which is why it organises the universe at large scales.",
        "Nearly everything astronomy knows arrives as electromagnetic radiation, which is why understanding light is understanding the method.",
        "Energy conservation constrains what stars, accretion discs and explosions can and cannot do.",
        "Relativity is not exotic: GPS and the orbits of Mercury both require it.",
      ],
      body: [
        {
          heading: "Gravity and orbits",
          paragraphs: [
            "Newton's law of universal gravitation states that every mass attracts every other with a force proportional to the product of their masses and inversely proportional to the square of the distance between them. The inverse-square dependence is what makes gravity fall off gradually enough to bind galaxies while still being weak enough locally that ordinary matter holds together.",
            "An orbit is continuous free fall. A satellite is not beyond gravity's reach — orbital gravity is nearly as strong as at the surface — it is moving sideways fast enough that it keeps missing. The apparent weightlessness of astronauts is free fall, not absence of gravity, and this distinction resolves most popular confusion about orbital mechanics.",
            "Kepler's laws describe the resulting motion: orbits are ellipses with the primary at one focus, a body sweeps equal areas in equal times so it moves faster when closer, and the square of the orbital period is proportional to the cube of the semi-major axis. Newton showed all three follow from the inverse-square law.",
          ],
        },
        {
          heading: "Light and the spectrum",
          paragraphs: [
            "Light is electromagnetic radiation, and visible light is a narrow band within a continuum running from radio waves through microwave, infrared, visible, ultraviolet and X-ray to gamma rays. The only physical difference between them is wavelength — and therefore photon energy.",
            "Astronomy uses the whole range because different physical processes emit at different energies. Cold dust radiates in the infrared, hot stellar photospheres in the visible and ultraviolet, million-degree gas in X-rays, and non-thermal relativistic electrons across the radio band. Observing at only one wavelength gives a systematically incomplete picture of almost any object.",
          ],
        },
        {
          heading: "How radiation carries information",
          list: [
            "Blackbody radiation: a hot dense object emits a characteristic continuous spectrum whose peak wavelength shifts to shorter wavelengths as temperature rises. This is why stellar colour indicates temperature.",
            "Spectral lines: atoms absorb and emit at specific wavelengths determined by their energy levels, so lines identify composition.",
            "Doppler shift: motion along the line of sight shifts observed wavelengths, giving radial velocity directly.",
            "Redshift at cosmological scales: the expansion of space stretches wavelengths in transit, which is a different phenomenon from ordinary Doppler motion though it produces a similar observable.",
            "The inverse-square law of brightness: observed flux falls as the square of distance, which is what makes standard candles work as distance indicators.",
          ],
        },
        {
          heading: "Energy, matter, and nuclear processes",
          paragraphs: [
            "Mass and energy are equivalent, related by E = mc². In stars this is not a metaphor: fusing four hydrogen nuclei into one helium nucleus leaves a small mass deficit, and that difference becomes the energy the star radiates. Roughly 0.7 percent of the hydrogen mass involved is converted, which over a stellar lifetime is an enormous quantity.",
            "Fusion of successively heavier elements releases energy only up to iron; beyond that, fusion consumes energy rather than releasing it. This single fact explains why massive stellar cores collapse once they become iron, and therefore why core-collapse supernovae happen at all.",
            "Accretion onto a compact object is even more efficient than fusion — a substantial fraction of infalling rest-mass energy can be radiated — which is why accreting black holes outshine entire galaxies.",
          ],
        },
        {
          heading: "Relativity, where it matters",
          paragraphs: [
            "Special relativity holds that the speed of light is the same for all observers, with the consequences that time dilates and lengths contract at high relative speeds, and that nothing carrying information exceeds light speed.",
            "General relativity describes gravity as the curvature of spacetime by mass and energy rather than as a force. Its observable consequences include the precession of Mercury's orbit, the bending of starlight by mass — gravitational lensing, now a routine astronomical tool — the slowing of clocks in gravitational fields, and gravitational waves.",
            "These effects are not confined to extreme environments. Satellite navigation systems must correct for both special and general relativistic time dilation to remain accurate; without those corrections positional errors would accumulate rapidly.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why do astronauts float if gravity is still strong in orbit?",
          answer:
            "Because they are in free fall. At the International Space Station's altitude, Earth's gravity is still roughly 90 percent of its surface value — the station and everything in it are continuously falling toward Earth while moving sideways fast enough to keep missing. Everything falls together, so nothing presses against anything else, and the sensation is weightlessness.",
        },
        {
          question: "What does E = mc² actually mean for stars?",
          answer:
            "That mass can be converted into energy. When hydrogen fuses into helium, the resulting nucleus is slightly less massive than the inputs, and that missing mass — about 0.7 percent — becomes radiated energy. It is a small fraction, but applied to the enormous quantity of hydrogen in a stellar core it powers the star for billions of years.",
        },
        {
          question: "Why can't fusion power a star past iron?",
          answer:
            "Because iron sits at the peak of nuclear binding energy per nucleon. Fusing lighter elements toward iron releases energy; fusing anything beyond iron requires a net energy input. When a massive star's core becomes iron, fusion can no longer supply the pressure holding the core up, and it collapses — the trigger for a core-collapse supernova.",
        },
        {
          question: "Is relativity relevant to everyday life?",
          answer:
            "Yes, in at least one system nearly everyone uses. Satellite navigation requires corrections for both special relativistic time dilation, from the satellites' orbital speed, and general relativistic time dilation, from their weaker gravitational field. Without those corrections, positional errors would grow to kilometres within a day.",
        },
      ],
      explore: [
        { label: "Fundamental physics", href: "/fundamental-physics", blurb: "Relativity, quantum theory, and the constants involved." },
        { label: "Celestial mechanics", href: "/celestial-mechanics", blurb: "Orbits, resonances, and reference frames in detail." },
        { label: "Stellar astrophysics", href: "/stellar-astrophysics", blurb: "Where these principles are applied to stars." },
      ],
      sources: ["nasa", "esa", "britannica"],
      keywords: ["astrophysics basics", "gravity", "light", "relativity", "E=mc2"],
    },
    {
      slug: "timeline",
      name: "Timeline",
      summary: "A chronological thread through astronomy's milestones.",
      overview:
        "A chronological view of astronomy and space exploration, tying the encyclopedia's topics into a single thread. Dates are given where the historical record supports them, and periods rather than dates where it does not.",
      keyPoints: [
        "Sustained astronomical record-keeping predates written explanation by well over a millennium.",
        "The gap between the telescope (1609) and the first measured stellar distance (1838) was more than two centuries.",
        "Most of what is known about the universe beyond the Milky Way was established within the last hundred years.",
      ],
      body: [
        {
          heading: "Antiquity to the classical world",
          list: [
            "c. 1700 BCE — Babylonian records of Venus phenomena, among the earliest surviving systematic planetary observations.",
            "c. 8th century BCE onward — the Babylonian astronomical diaries begin, running for roughly seven centuries.",
            "c. 240 BCE — Eratosthenes estimates Earth's circumference from shadow lengths at two locations.",
            "c. 130 BCE — Hipparchus discovers precession by comparing his positions with earlier records, and compiles a star catalogue.",
            "c. 150 CE — Ptolemy's Almagest establishes a predictive geometric system that remains standard for fourteen centuries.",
            "c. 2nd–1st century BCE — the Antikythera mechanism, a geared device for computing celestial positions.",
          ],
        },
        {
          heading: "Medieval and early modern",
          list: [
            "964 — al-Sufi's Book of Fixed Stars, including the earliest surviving description of the Andromeda Galaxy.",
            "1054 — Chinese and other observers record a 'guest star'; its remnant is the Crab Nebula.",
            "1437 — Ulugh Beg's Samarkand star catalogue, the most accurate pre-telescopic positional work.",
            "1543 — Copernicus publishes De revolutionibus, placing the Sun at the centre.",
            "1572 and 1604 — Tycho's and Kepler's supernovae, both visible to the naked eye, challenge the doctrine of unchanging heavens.",
            "1609–1619 — Kepler publishes the laws of planetary motion; Galileo publishes the first telescopic observations in 1610.",
            "1687 — Newton's Principia unifies celestial and terrestrial mechanics.",
          ],
        },
        {
          heading: "The measured universe",
          list: [
            "1781 — William Herschel discovers Uranus, the first planet found with a telescope.",
            "1814 — Fraunhofer maps dark lines in the solar spectrum.",
            "1838 — Bessel measures the parallax of 61 Cygni: the first distance to another star.",
            "1846 — Neptune is found close to its predicted position, a decisive success for Newtonian mechanics.",
            "1859 — Kirchhoff and Bunsen establish that spectral lines identify chemical elements.",
            "1912 — Leavitt publishes the Cepheid period–luminosity relation.",
            "1925 — Payne-Gaposchkin shows stars are composed mainly of hydrogen and helium.",
          ],
        },
        {
          heading: "The modern era",
          list: [
            "1923–24 — Hubble establishes that Andromeda lies far outside the Milky Way.",
            "1929 — Hubble publishes the velocity–distance relation; Lemaître had derived it theoretically in 1927.",
            "1932 — Jansky detects radio emission from the Galaxy, opening radio astronomy.",
            "1957 — Sputnik 1 reaches orbit; 1961 — Gagarin becomes the first human in space; 1969 — Apollo 11 lands.",
            "1965 — Penzias and Wilson detect the cosmic microwave background.",
            "1967 — Bell Burnell detects the first pulsar.",
            "1990 — Hubble Space Telescope launched.",
            "1995 — Mayor and Queloz detect 51 Pegasi b, the first planet around a Sun-like star.",
            "1998 — two supernova programmes independently find that cosmic expansion is accelerating.",
            "2015 — LIGO detects gravitational waves from a binary black hole merger.",
            "2019 and 2022 — the Event Horizon Telescope images the black holes in M87 and at the Galactic centre.",
          ],
        },
        {
          heading: "How to read a timeline like this",
          paragraphs: [
            "Dated lists compress a great deal. Almost every entry above represents years of work by many people, and the attached name is usually the person associated with the final decisive step rather than the sole contributor. Several entries also mark the moment a result was accepted rather than first proposed — Aristarchus proposed heliocentrism eighteen centuries before Copernicus.",
            "Where a date is genuinely uncertain, this timeline says 'c.' rather than choosing a precise-looking year. Spurious precision in historical dating is the same failure mode as spurious precision in a measurement.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is the oldest astronomical record we still have?",
          answer:
            "Among the oldest systematic ones are Babylonian records of Venus phenomena dating to roughly the early second millennium BCE, and the astronomical diaries beginning around the eighth century BCE. Older monuments show intentional solar alignment, but a deliberately oriented structure is a different kind of evidence from a dated observational record.",
        },
        {
          question: "Why was there such a long gap between the telescope and measuring star distances?",
          answer:
            "Because stellar parallax is extremely small. Even the nearest stars shift by well under one arcsecond as Earth moves around its orbit, which is beyond what seventeenth- and eighteenth-century instruments could reliably measure. Astronomers understood the method throughout that period; it took until 1838 for instrumental precision to catch up.",
        },
        {
          question: "How much of modern astronomy is genuinely recent?",
          answer:
            "Most of it. That other galaxies exist was established in the 1920s, cosmic expansion in the same decade, the microwave background in 1965, exoplanets from 1995, cosmic acceleration in 1998, and gravitational-wave astronomy from 2015. Nearly everything known about the universe beyond our own Galaxy has been learned within about a century.",
        },
      ],
      explore: [
        { label: "Timelines", href: "/timelines", blurb: "Interactive chronological threads across the platform." },
        { label: "History catalogue", href: "/history", blurb: "The people, publications, and discoveries as entities." },
        { label: "Spaceflight timeline", href: "/timeline", blurb: "Launch-by-launch spaceflight chronology." },
      ],
      sources: ["nasa", "esa", "britannica", "nobel"],
      keywords: ["astronomy timeline", "chronology", "milestones"],
    },
  ],
};
