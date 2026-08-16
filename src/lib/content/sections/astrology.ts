import type { Section } from "@/lib/content/types";

/**
 * Astrology — the cultural, symbolic, interpretive hub.
 *
 * Nothing here is presented as scientific fact. The section is
 * `kind: "interpretive"`, which forces the astrology disclaimer on every page.
 * We describe what practitioners traditionally hold, not what is
 * scientifically established.
 *
 * Editorial rules for this section:
 *   • Attribute claims to the tradition ("In Western astrology, X is
 *     traditionally associated with…"), never to nature ("X people are…").
 *   • Keep the zodiac *sign* and the IAU *constellation* explicitly distinct.
 *   • State documented history where it exists, and say so when it does not.
 *   • One clear contextual notice per page (the DisclaimerBox) is sufficient;
 *     do not turn every paragraph into a disclaimer.
 */
export const astrology: Section = {
  slug: "astrology",
  name: "Astrology",
  kind: "interpretive",
  accent: "ember",
  tagline: "A symbolic tradition, presented as culture.",
  description:
    "Zodiac signs, birth charts, houses, and transits — the language and history of astrology, presented as a cultural and interpretive tradition, clearly separated from astronomy.",
  intro:
    "Astrology is one of humanity's oldest symbolic traditions: a system for relating the positions of celestial bodies to character, timing, and meaning. On Asteria Star it is presented as cultural and interpretive heritage. These pages describe what astrological traditions hold; they do not claim astrology predicts or explains events scientifically.",
  categories: [
    {
      slug: "zodiac-signs",
      name: "Zodiac Signs",
      summary: "The twelve signs and the qualities tradition assigns them.",
      overview:
        "In Western astrology the zodiac is divided into twelve equal signs of 30 degrees each, measured along the ecliptic. Each is traditionally associated with an element, a modality, a ruling planet and a cluster of themes. These associations are cultural conventions with a documented history, not measured properties of the sky.",
      keyPoints: [
        "The twelve signs are equal 30-degree divisions; the twelve zodiac constellations are irregular sky regions of very unequal size.",
        "Western tropical astrology measures signs from the March equinox, so they track the seasons rather than the stars.",
        "Because of precession, the sign associated with a date no longer matches the constellation the Sun is actually in.",
        "The twelvefold division is documented in Babylonian sources from around the fifth century BCE.",
      ],
      body: [
        {
          heading: "How the twelve signs are constructed",
          paragraphs: [
            "The zodiac is the band of sky along the ecliptic — the Sun's apparent annual path — within which the Moon and planets also move. Astrology divides that band into twelve equal segments of 30 degrees each, and in the Western tropical system the first segment begins at the March equinox point.",
            "This is a coordinate convention, and a perfectly precise one. Where astrology departs from astronomy is in the second layer: assigning each segment a set of traditional meanings. The geometry can be calculated; the meanings are inherited from a documented interpretive tradition and are not derived from observation.",
          ],
        },
        {
          heading: "Elements, modalities, and rulerships",
          list: [
            "The four elements group the signs in threes: fire (Aries, Leo, Sagittarius), earth (Taurus, Virgo, Capricorn), air (Gemini, Libra, Aquarius), and water (Cancer, Scorpio, Pisces).",
            "The three modalities group them in fours: cardinal signs begin each season, fixed signs fall mid-season, mutable signs end one.",
            "Traditional rulerships assign each sign a planet — the classical scheme used only the seven visible bodies, so most planets ruled two signs.",
            "After the discoveries of Uranus, Neptune and Pluto, modern Western practice reassigned some rulerships. Traditional and modern astrologers disagree about this, and both schemes remain in use.",
          ],
        },
        {
          heading: "Signs are not constellations",
          paragraphs: [
            "This is the single most important distinction on the page. A zodiac sign is one of twelve exactly equal 30-degree divisions of the ecliptic. An IAU constellation is one of 88 sky regions with formally defined boundaries, and the twelve zodiacal ones vary enormously in the span of ecliptic they cover — the Sun spends far longer crossing Virgo than Scorpius.",
            "Precession compounds the difference. Because Earth's rotation axis swings over roughly 26,000 years, the equinox point has drifted westward along the ecliptic by about 30 degrees — one whole sign — since the tropical framework was fixed in antiquity. The result is that for most dates, the astrological sign and the constellation the Sun actually occupies are different. The Sun also passes through Ophiuchus, which is a constellation but not a sign.",
            "None of this is an error in astrology. The tropical zodiac is anchored deliberately to the seasons rather than to the stars, and practitioners are generally explicit about that. It only becomes a problem when the two systems are treated as the same thing.",
          ],
        },
        {
          heading: "Where the signs came from",
          paragraphs: [
            "The twelvefold equal division of the ecliptic is attested in Babylonian sources from around the fifth century BCE, replacing an earlier scheme that referenced specific stars. Several of the associated figures are older still, with Mesopotamian antecedents.",
            "Hellenistic astrology, developed largely in Egypt from around the second century BCE, combined that framework with Greek geometry and Aristotelian element theory into the system of signs, houses, aspects and rulerships that Western practice still uses. Ptolemy's Tetrabiblos, in the second century CE, is its most influential systematic statement.",
          ],
        },
        {
          heading: "What sun-sign astrology can and cannot claim",
          paragraphs: [
            "The daily sun-sign horoscope is a twentieth-century newspaper format, generally traced to a British Sunday paper column in 1930. Reducing an entire chart to the Sun's sign has no basis in the older technical tradition, which treated the ascendant, houses and aspects as essential — a point on which traditional astrologers and sceptics tend to agree.",
            "Controlled studies have not found evidence that sign placements predict personality traits or life outcomes. Asteria Star states that plainly and still covers the material, because a tradition with two thousand years of documented history and deep entanglement with the development of astronomy and mathematics is worth understanding on its own terms.",
          ],
        },
      ],
      faqs: [
        {
          question: "Is my zodiac sign the constellation the Sun was in when I was born?",
          answer:
            "Usually not. Western tropical astrology measures signs from the March equinox, and precession has shifted that reference point by about one whole sign relative to the stars over the past two thousand years. So for most dates the astrological sign differs from the constellation the Sun actually occupied. Sidereal traditions such as Jyotisha use a star-referenced zodiac instead and give different sign placements.",
        },
        {
          question: "Why are there twelve signs but thirteen constellations on the Sun's path?",
          answer:
            "Because they are different systems. The twelve signs are equal 30-degree divisions of the ecliptic, fixed as a scheme long before modern constellation boundaries existed. When the IAU drew formal constellation borders in 1930, the Sun's path turned out to clip Ophiuchus as well — an astronomical fact that says nothing about the astrological framework, which was never defined by those boundaries.",
        },
        {
          question: "What do elements and modalities mean in astrology?",
          answer:
            "They are two overlapping groupings of the twelve signs. The four elements — fire, earth, air, water — group signs in threes and are traditionally associated with broad temperamental qualities. The three modalities — cardinal, fixed, mutable — group them in fours according to position within a season. Together they give each sign a unique element-and-modality combination, which is the structural backbone of traditional sign interpretation.",
        },
        {
          question: "Do zodiac signs describe personality?",
          answer:
            "Astrological tradition holds that they do, and describes them in those terms. Controlled testing has not found evidence that sign placement predicts personality traits or life outcomes at better than chance. Asteria Star presents the traditional associations as what the tradition says, without asserting that they are scientifically validated.",
        },
      ],
      explore: [
        { label: "Constellations", href: "/constellations", blurb: "The 88 IAU constellations — the astronomical counterpart." },
        { label: "History of astrology", href: "/encyclopedia/history-of-astrology", blurb: "How the twelvefold zodiac developed." },
        { label: "Reference systems", href: "/reference-systems", blurb: "The ecliptic, precession, and coordinate epochs." },
        { label: "Planet meanings", href: "/astrology/planet-meanings", blurb: "Traditional rulerships and their astronomy." },
      ],
      keywords: ["star signs", "sun sign", "zodiac", "tropical zodiac", "precession"],
    },
    {
      slug: "birth-chart",
      name: "Birth Chart",
      summary: "An introduction to the chart of the sky at a moment of birth.",
      overview:
        "A birth chart is astrology's diagram of where the Sun, Moon and planets appeared from a particular place at a particular moment. The positions are computed from real ephemerides; the meanings placed on them are interpretive tradition.",
      keyPoints: [
        "The chart's geometry is genuine astronomy, calculated from the same tables used in navigation and spacecraft work.",
        "Birth time matters because the Ascendant moves through all twelve signs in roughly 24 hours.",
        "Without an accurate time, the sign placements can still be found but the houses and angles cannot.",
        "A chart is a two-dimensional projection of a three-dimensional sky.",
      ],
      body: [
        {
          heading: "What the wheel represents",
          paragraphs: [
            "The circle of a birth chart is the ecliptic — the plane of Earth's orbit projected onto the sky — divided into the twelve signs. Superimposed on it is a second division into twelve houses, derived from the observer's horizon and meridian at the moment in question.",
            "Symbols placed around the wheel mark where the Sun, Moon and planets were along the ecliptic. Lines drawn between them mark aspects: the angular relationships tradition treats as significant. Every element of the diagram corresponds to a real, calculable geometric quantity.",
          ],
        },
        {
          heading: "The astronomy is real; the interpretation is the tradition",
          paragraphs: [
            "It is worth being precise about which part is which. Planetary longitudes for any date come from ephemerides — computed tables of positions accurate enough for spacecraft navigation. Determining the Ascendant from a time and place is spherical trigonometry. None of that is in dispute.",
            "What astrology adds is a system of correspondences: that a planet in a particular sign and house signifies particular themes. Those correspondences are inherited from a documented interpretive tradition, and they are not derived from or testable against the astronomical calculation underneath them.",
          ],
        },
        {
          heading: "Why birth time is treated as critical",
          paragraphs: [
            "Earth rotates once a day, so the point of the ecliptic rising on the eastern horizon — the Ascendant — cycles through all twelve signs in roughly 24 hours, about one sign every two hours. The entire house structure rotates with it.",
            "By contrast the Sun moves only about one degree along the ecliptic per day, and the Moon about thirteen. So a birth date alone pins down the Sun's sign and usually the Moon's, but leaves the Ascendant and every house placement completely undetermined. This is why astrological practice treats an unknown or approximate birth time as a serious limitation, and why techniques for estimating it exist within the tradition.",
          ],
        },
        {
          heading: "Reading the diagram",
          list: [
            "The Ascendant sits at the left of the wheel, marking the eastern horizon, and the chart is conventionally drawn counterclockwise from there.",
            "The Midheaven, near the top, marks the highest point of the ecliptic at that moment.",
            "Planets near the angles — Ascendant, Descendant, Midheaven, Imum Coeli — are traditionally given extra weight.",
            "Clusters of planets in one sign or house are read as concentrations of emphasis.",
            "The chart is a flat projection: two planets drawn adjacent may be at very different ecliptic latitudes and vastly different distances.",
          ],
        },
      ],
      faqs: [
        {
          question: "What information do I need for a birth chart?",
          answer:
            "Date, time and place of birth. The date fixes the planetary positions along the ecliptic, the place fixes the horizon and meridian, and the time determines the Ascendant and therefore the entire house structure. Date alone gives sign placements but not houses or angles.",
        },
        {
          question: "What happens if I don't know my exact birth time?",
          answer:
            "The Sun's sign, and usually the Moon's, can still be determined, because those bodies move slowly along the ecliptic. The Ascendant and all twelve houses cannot, since they rotate through the whole zodiac in about a day. Astrological tradition includes rectification techniques for estimating an unknown time, but they are interpretive procedures rather than measurements.",
        },
        {
          question: "Is the birth chart based on real astronomy?",
          answer:
            "The positions are. They come from ephemerides — the same computed planetary tables used for navigation and spacecraft work — and the Ascendant follows from spherical trigonometry. What is not astronomy is the layer of meanings assigned to those positions, which is an interpretive tradition and is presented here as such.",
        },
      ],
      explore: [
        { label: "How to read a birth chart", href: "/guides/how-to-read-a-birth-chart", blurb: "The beginner's walkthrough." },
        { label: "Houses", href: "/astrology/houses", blurb: "The twelve divisions and the systems that disagree." },
        { label: "Natal chart", href: "/astrology/natal-chart", blurb: "The interpretive craft in more depth." },
      ],
      interpretive: true,
      keywords: ["birth chart wheel", "astrology chart", "ascendant", "ephemeris"],
    },
    {
      slug: "natal-chart",
      name: "Natal Chart",
      summary: "Interpreting signs, planets, and houses together in depth.",
      overview:
        "The natal chart and the birth chart are the same diagram; this topic covers the interpretive craft — how astrologers traditionally read placements in combination rather than as a list. It is symbolic interpretation, not prediction.",
      keyPoints: [
        "Traditional practice treats synthesis as the skill: the whole configuration, not isolated placements.",
        "The same placement is read differently depending on what else the chart contains.",
        "Chart rulers, patterns and emphasis are structural tools within the tradition.",
        "Different schools read the same chart differently, and disagree about method.",
      ],
      body: [
        {
          heading: "Synthesis over enumeration",
          paragraphs: [
            "The most consistent methodological advice within astrological literature is that a chart must be read as a whole. Listing placements one by one — Sun in this sign, Moon in that house — produces a set of statements that often contradict each other, and traditional practice regards resolving those tensions as the actual work.",
            "This matters for how the material should be understood. Popular sun-sign content takes a single placement out of a structure the tradition treats as irreducible, which is a departure from the tradition's own standards rather than a simplification of them.",
          ],
        },
        {
          heading: "The structural tools",
          list: [
            "Chart ruler: the planet ruling the sign on the Ascendant, traditionally given particular weight in describing the chart's overall character.",
            "Dignity and debility: a traditional scheme rating how well-placed a planet is by sign, with terms such as domicile, exaltation, detriment and fall.",
            "Chart shape: whether planets are spread evenly, bunched in one region, or split into groups — read as a description of overall emphasis.",
            "Aspect patterns: named configurations such as the grand trine or T-square, formed when three or more planets stand in particular angular relationships.",
            "Angular emphasis: planets close to the Ascendant, Descendant, Midheaven or Imum Coeli are traditionally treated as more prominent.",
          ],
        },
        {
          heading: "Schools disagree, substantively",
          paragraphs: [
            "There is no single astrology. Traditional and Hellenistic revivalists use only the seven classical planets and give weight to dignity schemes that modern psychological astrology largely dropped. Modern practice incorporates Uranus, Neptune and Pluto and often reframes the chart as a tool for self-understanding rather than prediction. Evolutionary, humanistic and other approaches each have their own emphases.",
            "These are not stylistic differences; they produce different readings from identical data. Presenting astrology as one coherent system misrepresents it, and any claim that 'astrology says X' should prompt the question of which tradition is speaking.",
          ],
        },
        {
          heading: "What this means for interpretation",
          paragraphs: [
            "Within the tradition, a natal chart is read as a symbolic description rather than a set of determinations, and most contemporary practitioners describe placements as tendencies or themes rather than as fixed outcomes. Framing of that kind is characteristic of modern practice.",
            "Asteria Star presents these methods as the tradition's own descriptions of its craft. Controlled attempts to test whether astrologers can match charts to biographical or psychometric profiles have not produced results distinguishable from chance, and that finding sits alongside the material rather than being hidden from it.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is the difference between a natal chart and a birth chart?",
          answer:
            "Nothing — they are two names for the same diagram, the chart of the sky for a person's moment and place of birth. On Asteria Star the birth chart page introduces the structure, and this page covers how astrologers traditionally read it in combination.",
        },
        {
          question: "Why do two astrologers read the same chart differently?",
          answer:
            "Because they may be working in genuinely different traditions. Hellenistic and traditional practice uses only the classical planets and applies dignity schemes that modern psychological astrology largely set aside; modern practice adds the outer planets and often reframes interpretation around self-understanding. They also may use different house systems, which changes placements outright.",
        },
        {
          question: "What is a chart ruler?",
          answer:
            "The planet that rules the sign on the Ascendant. Traditional practice gives it particular weight in describing the chart as a whole, treating its sign, house and aspects as a summary of the chart's overall direction. Which planet rules which sign differs between traditional and modern schemes, so the chart ruler itself can differ.",
        },
      ],
      explore: [
        { label: "Birth chart", href: "/astrology/birth-chart", blurb: "The structure of the diagram." },
        { label: "Aspects", href: "/astrology/aspects", blurb: "The angular relationships and their traditional readings." },
        { label: "Houses", href: "/astrology/houses", blurb: "The twelve divisions and competing systems." },
      ],
      interpretive: true,
      keywords: ["natal astrology", "chart interpretation", "chart ruler", "dignity"],
    },
    {
      slug: "rising-sign",
      name: "Rising Sign",
      summary: "The Ascendant — the sign on the eastern horizon at birth.",
      overview:
        "The rising sign, or Ascendant, is the degree of the ecliptic on the eastern horizon at the moment and place of birth. It is a precisely calculable astronomical quantity to which astrological tradition attaches particular significance.",
      keyPoints: [
        "The Ascendant cycles through all twelve signs in roughly 24 hours — about one sign every two hours.",
        "It depends on latitude as well as time, and behaves unevenly at high latitudes.",
        "It anchors the entire house structure of the chart.",
        "Tradition associates it with outward manner and first impressions.",
      ],
      body: [
        {
          heading: "The astronomy of the Ascendant",
          paragraphs: [
            "The Ascendant is the intersection of the ecliptic with the eastern horizon at a given instant and location. Computing it requires the local sidereal time, the observer's geographic latitude, and the obliquity of the ecliptic — all well-defined quantities, and the calculation is standard spherical trigonometry.",
            "Because Earth rotates once a day, this intersection point moves rapidly, sweeping through the full zodiac in approximately 24 hours. That is why astrological practice regards an accurate birth time as essential: an error of two hours changes the rising sign entirely.",
          ],
        },
        {
          heading: "Signs do not rise at equal rates",
          paragraphs: [
            "A detail often glossed over: because the ecliptic is tilted relative to the celestial equator, the twelve signs do not take equal time to rise. At mid-northern latitudes some signs rise in well under two hours while others take considerably more, and the disparity increases with latitude.",
            "This is why the phrase 'about one sign every two hours' is an average rather than a rule, and it is also why rising-sign determination at high latitudes is genuinely awkward. Above the Arctic and Antarctic circles some signs may not rise at all on certain dates, which is one of several reasons house systems behave badly there.",
          ],
        },
        {
          heading: "What tradition makes of it",
          paragraphs: [
            "In Western astrological tradition the Ascendant is associated with outward manner, physical appearance, first impressions, and the way a person approaches new situations — often described as distinct from the Sun sign, which is linked to a more central sense of self.",
            "The Ascendant also determines the chart ruler and sets the boundaries of the houses, so in structural terms it does more work than any other single point. Traditional practice tends to weight it as heavily as the Sun and Moon, and in some Hellenistic approaches more heavily still.",
          ],
        },
        {
          heading: "Why online calculators disagree",
          paragraphs: [
            "Three things can differ between tools: the house system used, the exact geographic coordinates assigned to a birthplace, and whether the birth time has been correctly converted from local civil time — including historical daylight-saving rules, which have changed frequently and are a common source of error.",
            "A birth time recorded to the nearest quarter-hour, in a place whose historical time offset is ambiguous, can legitimately produce two different rising signs. Any tool presenting a result without stating those assumptions is understating its own uncertainty.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is a rising sign?",
          answer:
            "The zodiac sign containing the point of the ecliptic that was on the eastern horizon at the moment and place of birth. It is a genuinely calculable astronomical quantity, computed from local sidereal time, latitude and the obliquity of the ecliptic. Astrological tradition associates it with outward manner and first impressions.",
        },
        {
          question: "Why does the rising sign need such an accurate birth time?",
          answer:
            "Because Earth's rotation carries the Ascendant through all twelve signs in roughly 24 hours — an average of about two hours per sign, though the rates are unequal. An error of a couple of hours changes the rising sign outright, and with it the entire house structure of the chart.",
        },
        {
          question: "Why do different sites give me different rising signs?",
          answer:
            "Usually because of time conversion or coordinates. Historical daylight-saving rules and time-zone boundaries have changed often and are a frequent source of error, and different tools may assign slightly different coordinates to the same city. House system choice can also shift placements near a boundary. A birth time recorded only to the nearest quarter-hour can genuinely be ambiguous.",
        },
      ],
      explore: [
        { label: "Houses", href: "/astrology/houses", blurb: "What the Ascendant anchors." },
        { label: "Birth chart", href: "/astrology/birth-chart", blurb: "How the Ascendant fits the whole diagram." },
        { label: "Reference systems", href: "/reference-systems", blurb: "Sidereal time, the ecliptic, and obliquity." },
      ],
      interpretive: true,
      keywords: ["ascendant", "rising", "sidereal time", "birth time"],
    },
    {
      slug: "moon-sign",
      name: "Moon Sign",
      summary: "The sign the Moon occupied at birth, in tradition.",
      overview:
        "The Moon sign is the zodiac sign containing the Moon's ecliptic longitude at the moment of birth. Because the Moon moves quickly, this placement changes every two to three days — fast enough that a birth date alone is sometimes not sufficient to determine it.",
      keyPoints: [
        "The Moon crosses roughly 13 degrees of ecliptic longitude per day, changing sign every two to three days.",
        "For births near a sign boundary, the time of day is decisive.",
        "Tradition links the Moon to emotion, instinct and inner life.",
        "The Moon's sign is one of the few placements that differ noticeably between people born on the same date.",
      ],
      body: [
        {
          heading: "Why the Moon changes sign so often",
          paragraphs: [
            "The Moon completes a circuit of the ecliptic in about 27.3 days relative to the stars, so it advances roughly 13 degrees per day — around thirteen times faster than the Sun. Since each sign spans 30 degrees, it occupies a given sign for approximately two and a quarter to two and a half days.",
            "Its actual speed varies because the orbit is elliptical, so the time in a sign is not constant. For a birth close to an ingress — the moment the Moon crosses into a new sign — the hour of birth determines the answer, and an approximate date is not enough.",
          ],
        },
        {
          heading: "How the placement is calculated",
          paragraphs: [
            "The Moon's ecliptic longitude for any instant comes from lunar ephemerides, which are among the most thoroughly validated computations in astronomy — lunar laser ranging has measured the Earth–Moon distance to centimetre precision, and the resulting models are correspondingly accurate.",
            "So the underlying number is not in doubt. Determining a Moon sign is arithmetic on a well-established quantity; what the tradition adds is the meaning attached to which 30-degree segment that longitude falls in.",
          ],
        },
        {
          heading: "What tradition associates with it",
          paragraphs: [
            "In Western astrological tradition the Moon is linked to emotional response, instinct, habit, and inner life — often framed in contrast to the Sun, associated with conscious identity, and the Ascendant, associated with outward manner. Practitioners commonly describe the Moon sign as the 'private' placement.",
            "The Moon's phase and its aspects to other planets are also read, and in traditional practice its condition — including whether it is waxing or waning and how it is placed by dignity — was given considerable weight in judging a chart.",
          ],
        },
        {
          heading: "The Moon in other traditions",
          paragraphs: [
            "Emphasis differs markedly across traditions. Vedic astrology (Jyotisha) treats the Moon's placement as more central than the Sun's for many purposes, and organises much of its interpretive framework around the Moon's position within the 27 nakshatras — lunar mansions dividing the ecliptic.",
            "Because Jyotisha uses a sidereal zodiac referenced to the stars rather than the tropical one referenced to the equinox, the same Moon longitude generally falls in a different sign in the two systems. Neither is a calculation error; they are different conventions applied to the same measured position.",
          ],
        },
      ],
      faqs: [
        {
          question: "How often does the Moon change sign?",
          answer:
            "Roughly every two and a quarter to two and a half days. The Moon advances about 13 degrees of ecliptic longitude per day, and each sign spans 30 degrees. The exact duration varies because the Moon's orbital speed changes over its elliptical orbit.",
        },
        {
          question: "Do I need my birth time to find my Moon sign?",
          answer:
            "Often not, but sometimes yes. Because the Moon spends a bit over two days in each sign, the date alone usually settles it. If the birth falls close to the moment the Moon crossed into a new sign, the time of day decides the answer — so an accurate time matters for a minority of births and is irrelevant for most.",
        },
        {
          question: "Why does my Moon sign differ between Western and Vedic astrology?",
          answer:
            "Because they use different zodiacs. Western tropical astrology measures from the March equinox; Vedic astrology uses a sidereal zodiac referenced to the stars. Precession has separated the two by roughly 24 degrees, which is most of a sign, so the same computed Moon position frequently falls in different signs under the two conventions.",
        },
      ],
      explore: [
        { label: "Moon phase", href: "/sky-guide/moon-phase", blurb: "The astronomy of the Moon's cycle." },
        { label: "Vedic astrology", href: "/astrology/vedic-astrology", blurb: "The tradition that centres the Moon." },
        { label: "Planet meanings", href: "/astrology/planet-meanings", blurb: "Traditional attributions for each body." },
      ],
      interpretive: true,
      keywords: ["lunar sign", "emotional astrology", "nakshatra", "ingress"],
    },
    {
      slug: "planet-meanings",
      name: "Planet Meanings",
      summary: "The symbolic roles tradition gives the planets and luminaries.",
      overview:
        "Astrology assigns symbolic meanings to the Sun, Moon and planets. These attributions have a documented history reaching back to Mesopotamian deity associations, and they are entirely distinct from the physical astronomy of the same bodies.",
      keyPoints: [
        "Astrology's 'planets' include the Sun and Moon, which astronomy does not classify as planets.",
        "The classical set is the seven bodies visible without a telescope.",
        "Uranus, Neptune and Pluto were added after discovery, and traditional astrologers often exclude them.",
        "The attributions descend from deity associations that predate Greek astrology.",
      ],
      body: [
        {
          heading: "The classical seven",
          paragraphs: [
            "Before the telescope, seven bodies were seen to move against the fixed stars: the Sun, the Moon, Mercury, Venus, Mars, Jupiter and Saturn. Astrological tradition treats all seven as 'planets' in its own sense of the word — moving bodies — which is why the Sun and Moon appear in that list despite not being planets astronomically.",
            "That same seven produced the seven-day week, with each day named for one of them, a naming scheme still visible across many European languages. The tradition and the calendar share an origin.",
          ],
        },
        {
          heading: "Traditional attributions",
          list: [
            "Sun — vitality, conscious identity, purpose. Traditionally rules Leo.",
            "Moon — emotion, instinct, habit, the inner life. Traditionally rules Cancer.",
            "Mercury — communication, reasoning, exchange. Traditionally rules Gemini and Virgo.",
            "Venus — attraction, harmony, values, relationship. Traditionally rules Taurus and Libra.",
            "Mars — drive, assertion, conflict, action. Traditionally rules Aries, and in classical schemes Scorpio.",
            "Jupiter — expansion, growth, belief, opportunity. Traditionally rules Sagittarius, and classically Pisces.",
            "Saturn — limitation, structure, discipline, time. Traditionally rules Capricorn, and classically Aquarius.",
          ],
        },
        {
          heading: "The modern additions",
          paragraphs: [
            "Uranus (1781), Neptune (1846) and Pluto (1930) were incorporated into Western practice after their discoveries, and modern astrology commonly reassigns rulerships to them — Uranus to Aquarius, Neptune to Pisces, Pluto to Scorpio — displacing the classical rulers.",
            "Traditional and Hellenistic revivalist astrologers frequently reject these reassignments and work with the seven classical bodies alone, arguing that the dignity scheme's internal logic depends on the sevenfold structure. This is a real and unresolved methodological split within the field, and Pluto's 2006 astronomical reclassification as a dwarf planet did not settle it, since astrological usage does not follow the IAU.",
          ],
        },
        {
          heading: "Where the meanings came from",
          paragraphs: [
            "The attributions descend from deity associations. Mesopotamian tradition linked each visible planet to a god, Greek practice mapped those onto its own pantheon, and Rome mapped them again onto Latin equivalents — which is why the planets carry Roman names and roughly Roman-flavoured attributes.",
            "Some associations plausibly reflect observation: Mars is visibly red and carries martial attributes; Mercury moves fastest and is associated with the messenger. Others reflect brightness and stateliness rather than any observable property. The physical astronomy — that Mars is a cold desert world with a thin carbon-dioxide atmosphere — is unrelated to the symbolic layer, and Asteria Star keeps the two on separate pages.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why does astrology call the Sun and Moon planets?",
          answer:
            "Because the word originally meant 'wanderer' — a body that moves against the fixed stars. Seven such bodies are visible without a telescope, including the Sun and Moon, and astrological tradition treats all seven together. Astronomy later narrowed the term, but astrology kept the older usage, so its 'planets' and astronomy's are different categories.",
        },
        {
          question: "Do astrologers use Uranus, Neptune and Pluto?",
          answer:
            "Many modern Western astrologers do, and assign them rulership of Aquarius, Pisces and Scorpio respectively. Traditional and Hellenistic practitioners frequently do not, working only with the seven classical bodies on the grounds that the dignity system's structure depends on the sevenfold scheme. It is a genuine and ongoing methodological disagreement.",
        },
        {
          question: "Where do the planetary meanings come from?",
          answer:
            "From deity associations transmitted through Mesopotamian, Greek and Roman tradition. Each visible planet was linked to a god, and the attributes of that god became the planet's symbolic domain. A few associations plausibly track something observable — Mars's colour, Mercury's speed — but most reflect the inherited mythology rather than any property of the body.",
        },
      ],
      explore: [
        { label: "Solar System", href: "/solar-system", blurb: "The same bodies as measured astronomical objects." },
        { label: "Roman mythology", href: "/encyclopedia/roman-mythology", blurb: "Where the planet names came from." },
        { label: "Zodiac signs", href: "/astrology/zodiac-signs", blurb: "The signs these planets traditionally rule." },
      ],
      interpretive: true,
      keywords: ["planetary symbolism", "rulerships", "classical planets"],
    },
    {
      slug: "houses",
      name: "Houses",
      summary: "The twelve houses and the life areas tradition links to them.",
      overview:
        "The houses are twelve divisions of the local sky, derived from the horizon and meridian at a specific time and place. Unlike the signs, which divide the ecliptic, the houses divide the observer's own sky — and there is no agreement on how to do it.",
      keyPoints: [
        "Houses are location- and time-specific; signs are not.",
        "There is no single house system — Placidus, Whole Sign, Koch, Equal and others all differ.",
        "Some systems break down mathematically at high latitudes.",
        "Two astrologers using different systems will place the same planet in different houses.",
      ],
      body: [
        {
          heading: "What the houses divide",
          paragraphs: [
            "Signs divide the ecliptic; houses divide the sky as seen from a particular place at a particular moment. The first house begins at the Ascendant — the eastern horizon — and the tenth begins at or near the Midheaven, the highest point of the ecliptic.",
            "This is what makes a chart specific to a birth rather than to a date. Two people born on the same day in different places, or hours apart in the same place, share nearly identical planetary positions but entirely different house structures.",
          ],
        },
        {
          heading: "Traditional house significations",
          list: [
            "First — self, appearance, outward manner. Sixth — work, routine, health.",
            "Second — resources, possessions, values. Seventh — partnership, one-to-one relationships.",
            "Third — communication, siblings, local environment. Eighth — shared resources, transformation, inheritance.",
            "Fourth — home, family, origins. Ninth — travel, higher learning, belief.",
            "Fifth — creativity, play, children. Tenth — career, public standing.",
            "Eleventh — friendships, groups, aspirations. Twelfth — solitude, the unconscious, what is hidden.",
          ],
        },
        {
          heading: "The systems, and why they disagree",
          paragraphs: [
            "Whole Sign houses, the oldest documented system, make each house exactly one sign, starting from the sign containing the Ascendant. Equal House divides the ecliptic into twelve 30-degree segments starting from the Ascendant's exact degree. Placidus, the most widely used in modern Western practice, divides the diurnal and nocturnal arcs by time. Koch, Regiomontanus, Campanus and Porphyry each use different geometric constructions.",
            "These produce materially different results. A planet near a house boundary can fall in different houses under different systems, and quadrant systems produce houses of very unequal size. There is no measurement that settles which is correct, because the question is not empirical — it is a choice of convention within an interpretive framework.",
          ],
        },
        {
          heading: "The high-latitude problem",
          paragraphs: [
            "Time-based quadrant systems including Placidus and Koch become mathematically ill-behaved at high latitudes. Above the Arctic and Antarctic circles parts of the ecliptic may not rise or set at all on some dates, so the arcs these systems divide can become undefined.",
            "In those cases the systems either fail outright or produce extremely distorted houses. Practitioners working at high latitudes commonly use Whole Sign or Equal House for this reason — a case where a purely mathematical constraint drives a choice within the tradition.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is the difference between a sign and a house?",
          answer:
            "A sign is a 30-degree division of the ecliptic, the same for everyone at a given moment. A house is a division of the local sky derived from the horizon and meridian at a specific place and time, so it is unique to a birth. Signs describe where a planet is along the zodiac; houses describe where it was relative to the observer's own horizon.",
        },
        {
          question: "Which house system is correct?",
          answer:
            "There is no answer that measurement can supply, because the choice is a convention within an interpretive framework rather than a claim about the sky. Whole Sign is the oldest documented system, Placidus the most common in modern Western practice, and several others are in active use. Practitioners disagree, and the same chart yields different placements under different systems.",
        },
        {
          question: "Why do some house systems fail at high latitudes?",
          answer:
            "Because time-based quadrant systems such as Placidus and Koch divide the arcs the ecliptic traces above and below the horizon, and above the Arctic and Antarctic circles parts of the ecliptic may not rise or set at all on some dates. Those arcs then become undefined or extremely distorted, so practitioners at high latitudes typically use Whole Sign or Equal House instead.",
        },
      ],
      explore: [
        { label: "Rising sign", href: "/astrology/rising-sign", blurb: "The Ascendant, which anchors the houses." },
        { label: "Birth chart", href: "/astrology/birth-chart", blurb: "How houses fit the whole diagram." },
        { label: "Reference systems", href: "/reference-systems", blurb: "Horizon, meridian, and celestial coordinates." },
      ],
      interpretive: true,
      keywords: ["astrological houses", "house systems", "Placidus", "Whole Sign"],
    },
    {
      slug: "aspects",
      name: "Aspects",
      summary: "Angular relationships between chart points and their meanings.",
      overview:
        "An aspect is the angular separation between two points in a chart. The angles themselves are exact geometric quantities; the interpretations attached to particular angles are traditional conventions with a documented origin in Hellenistic geometry.",
      keyPoints: [
        "The major aspects divide the circle into simple fractions: halves, thirds, quarters, sixths.",
        "An orb is the allowance either side of an exact angle within which an aspect is still counted.",
        "Different traditions use different orbs, so whether an aspect 'exists' can depend on the astrologer.",
        "Applying and separating aspects are treated differently in traditional practice.",
      ],
      body: [
        {
          heading: "The major aspects",
          list: [
            "Conjunction (0°) — two points at the same ecliptic longitude. Read as fusion or intensification.",
            "Opposition (180°) — halves of the circle. Read as tension, polarity, or awareness through contrast.",
            "Trine (120°) — thirds. Traditionally the most harmonious aspect, read as ease.",
            "Square (90°) — quarters. Read as friction or challenge requiring effort.",
            "Sextile (60°) — sixths. Read as opportunity, milder than a trine.",
          ],
        },
        {
          heading: "Why these particular angles",
          paragraphs: [
            "The major aspects are the divisions of the circle by two, three, four and six. This is not arbitrary: Hellenistic astrology derived them from the geometry of regular polygons inscribed in a circle, and the association of harmonious readings with the divisions that produce equilateral figures reflects a Pythagorean-influenced view of numerical harmony.",
            "Later practice added minor aspects — the semisextile at 30°, semisquare at 45°, quincunx at 150°, and the quintile series based on division by five, introduced by Kepler. Which minor aspects to use, and whether to use them at all, varies by practitioner.",
          ],
        },
        {
          heading: "Orbs, and why they matter",
          paragraphs: [
            "Exact aspects are rare, so tradition allows an orb: a tolerance either side of the exact angle within which the aspect still counts. A trine at 118 degrees is generally treated as a trine.",
            "There is no agreed orb. Common practice gives wider orbs to the Sun and Moon and to major aspects, and narrower ones to minor aspects and outer planets, but the specific values differ substantially between schools — commonly anywhere from about 3 to 10 degrees for major aspects. Two astrologers can therefore look at the same chart and disagree about whether an aspect is present at all, which is a structural rather than incidental source of divergent readings.",
          ],
        },
        {
          heading: "Applying, separating, and aspect patterns",
          paragraphs: [
            "Traditional practice distinguishes an applying aspect, where the faster body is moving toward exactness, from a separating one, where it is moving away. Applying aspects are generally treated as more potent, and in horary astrology the distinction is central to the technique.",
            "When three or more planets stand in specific mutual relationships, the resulting configuration is named — the grand trine, the T-square, the yod, the grand cross — and read as a structural feature of the chart rather than as a set of independent aspects.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is an aspect in astrology?",
          answer:
            "The angular separation between two points in a chart, measured along the ecliptic. Particular angles — 0, 60, 90, 120 and 180 degrees — are treated as significant and given traditional interpretations. The angles are exact geometric quantities; the meanings are conventions inherited from Hellenistic practice.",
        },
        {
          question: "What is an orb?",
          answer:
            "The tolerance allowed either side of an exact aspect angle. Since exact aspects are rare, an aspect within a few degrees of exactness is still counted. There is no agreed standard — orbs commonly range from about 3 to 10 degrees for major aspects depending on the school and the bodies involved — so whether a given aspect is present can depend on which practitioner you ask.",
        },
        {
          question: "Why are trines considered good and squares difficult?",
          answer:
            "It descends from the Hellenistic geometric scheme, in which aspects were derived from regular polygons inscribed in a circle and carried Pythagorean-influenced associations of harmony. Divisions producing equilateral figures — the trine and sextile — were read as harmonious, while the square and opposition were read as tension. Modern practice often reframes these as ease versus productive friction rather than good versus bad.",
        },
      ],
      explore: [
        { label: "Natal chart", href: "/astrology/natal-chart", blurb: "How aspects fit into whole-chart reading." },
        { label: "Transits", href: "/astrology/transits", blurb: "Aspects formed by current positions to a birth chart." },
        { label: "Celestial events", href: "/sky-guide/celestial-events", blurb: "The astronomy of conjunctions and oppositions." },
      ],
      interpretive: true,
      keywords: ["conjunction", "trine", "square", "orb", "aspect patterns"],
    },
    {
      slug: "transits",
      name: "Transits",
      summary: "How current planetary positions are read against a birth chart.",
      overview:
        "A transit is the comparison of a planet's current position with a birth chart. Astrological practice uses transits to describe timing and themes. The planetary positions are computed astronomy; the timing significance attached to them is interpretive tradition.",
      keyPoints: [
        "Transits are defined by comparison to a natal chart, so they are personal rather than general.",
        "Slow-moving outer planets produce long transits; fast inner ones produce brief ones.",
        "Retrograde motion can bring a transit back over the same point up to three times.",
        "Astronomical 'transit' means something entirely different — a body crossing a stellar disc.",
      ],
      body: [
        {
          heading: "What a transit is in astrological usage",
          paragraphs: [
            "A transit occurs when a planet's current ecliptic longitude forms an aspect to a point in someone's birth chart. Saturn reaching the degree of a person's natal Sun would be described as a Saturn transit to the Sun.",
            "The calculation is straightforward: current positions come from ephemerides, natal positions from the birth chart, and the angular relationship follows. What astrology adds is the assertion that such a configuration corresponds to a period with a particular character.",
          ],
        },
        {
          heading: "Speed determines duration",
          list: [
            "The Moon moves about 13 degrees a day, so lunar transits last hours and are treated as minor.",
            "Mercury, Venus and Mars produce transits lasting days to a few weeks.",
            "Jupiter takes about twelve years to circle the zodiac; a Jupiter transit to a natal point lasts weeks.",
            "Saturn takes roughly 29.5 years, and its transits are read as extended and formative periods.",
            "Uranus, Neptune and Pluto move so slowly that a single transit can persist for a year or more.",
          ],
        },
        {
          heading: "Retrogrades and repeated contacts",
          paragraphs: [
            "Because planets periodically appear to reverse direction against the stars — a perspective effect of Earth overtaking them — a transiting planet can cross the same natal degree, reverse back over it, and cross it a third time going forward.",
            "Astrological practice reads this triple contact as a structured sequence rather than a repetition, and the possibility of it is why outer-planet transits are described as spanning long periods with distinct phases. Astronomically, retrograde motion is entirely apparent: the planet never actually reverses its orbital direction.",
          ],
        },
        {
          heading: "Two different meanings of 'transit'",
          paragraphs: [
            "This is a genuine vocabulary collision worth flagging. In astronomy a transit is a body passing in front of a larger one — Venus crossing the Sun's disc, or an exoplanet crossing its host star, which is the basis of the most productive exoplanet detection method.",
            "In astrology a transit is a current planetary position compared against a natal chart. The two share a word and nothing else, and readers arriving from either direction should not assume the other meaning.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is a transit in astrology?",
          answer:
            "The comparison of a planet's current position with a point in someone's birth chart. When a transiting planet forms an aspect to a natal placement, astrological practice reads that period as carrying a particular character. The positions are computed from ephemerides; the timing significance is interpretive tradition.",
        },
        {
          question: "Why do some transits last so much longer than others?",
          answer:
            "Because the planets move at very different rates. The Moon crosses a given degree in hours, while Pluto can take more than a year to move past the same point. Traditional practice therefore treats outer-planet transits as extended, formative periods and inner-planet transits as brief and comparatively minor.",
        },
        {
          question: "Is an astrological transit the same as an astronomical transit?",
          answer:
            "No — they are unrelated meanings of the same word. In astronomy, a transit is one body passing in front of a larger one, such as Venus crossing the Sun or an exoplanet crossing its host star. In astrology, it is a current planetary position compared against a natal chart. Nothing carries over between the two usages.",
        },
      ],
      explore: [
        { label: "Aspects", href: "/astrology/aspects", blurb: "The angular relationships transits form." },
        { label: "Planet visibility", href: "/sky-guide/planet-visibility", blurb: "The astronomy of retrograde motion." },
        { label: "Progressions", href: "/astrology/progressions", blurb: "The other main timing technique." },
      ],
      interpretive: true,
      keywords: ["planetary transits", "timing", "Saturn return", "retrograde"],
    },
    {
      slug: "progressions",
      name: "Progressions",
      summary: "A symbolic technique for advancing a chart over time.",
      overview:
        "Progressions advance a birth chart according to a symbolic rule rather than by tracking actual planetary motion. The best-known form equates one day after birth with one year of life — an explicitly symbolic correspondence, not an astronomical one.",
      keyPoints: [
        "Secondary progressions use a day-for-a-year rule that is symbolic by construction.",
        "Unlike transits, progressed positions do not correspond to where the planets actually are.",
        "The progressed Moon completes a cycle in roughly 27–28 years.",
        "Solar arc directions advance everything by the Sun's progressed motion.",
      ],
      body: [
        {
          heading: "The day-for-a-year rule",
          paragraphs: [
            "Secondary progression takes the positions of the planets on the nth day after birth as representing the nth year of life. A chart for someone aged thirty uses the sky as it was thirty days after their birth.",
            "The tradition is explicit that this is a symbolic correspondence rather than a physical one. Nothing in astronomy connects the sky one month after a birth to a person's thirtieth year; the rule is a convention within the interpretive system, and practitioners generally describe it that way.",
          ],
        },
        {
          heading: "What moves, and how fast",
          list: [
            "The progressed Sun advances about one degree per year, so it changes sign roughly every thirty years — a shift traditionally read as a significant reorientation.",
            "The progressed Moon advances about one degree per month, completing a full zodiac circuit in roughly 27 to 28 years, and its cycle is the most-used progression in practice.",
            "Mercury, Venus and Mars progress slowly and may change sign only once or twice in a lifetime.",
            "The outer planets barely move under progression at all, so progressed aspects involving them are rare and treated as notable when they occur.",
          ],
        },
        {
          heading: "Solar arc and other methods",
          paragraphs: [
            "Solar arc direction advances every point in the chart by the same amount the progressed Sun has moved — roughly a degree per year. This keeps the chart's internal geometry intact while shifting it as a whole against the natal positions, producing a different set of contacts from secondary progressions.",
            "Other directional methods exist, including primary directions, which are computationally intricate and were central to earlier traditional practice. Which technique a practitioner uses is a matter of school and preference; there is no agreed hierarchy among them.",
          ],
        },
        {
          heading: "Progressions versus transits",
          paragraphs: [
            "The two techniques are used differently within the tradition. Transits use actual current planetary positions and are read as external circumstances or events; progressions use symbolically advanced positions and are read as internal development.",
            "The distinction matters for understanding what is being claimed. A transit at least refers to a real configuration of the sky at the moment in question. A progression refers to a configuration that occurred decades earlier and is being mapped onto the present by rule.",
          ],
        },
      ],
      faqs: [
        {
          question: "What are secondary progressions?",
          answer:
            "A technique that equates one day after birth with one year of life, so the chart for someone's thirtieth year uses the sky thirty days after their birth. Astrological tradition treats it as an explicitly symbolic correspondence rather than a physical relationship, and practitioners generally describe it that way.",
        },
        {
          question: "How is a progression different from a transit?",
          answer:
            "A transit uses the actual current position of a planet compared against the natal chart. A progression uses positions advanced by a symbolic rule — typically a day for a year — so the progressed chart does not correspond to where the planets are now. Tradition reads transits as external circumstance and progressions as internal development.",
        },
        {
          question: "What is the progressed Moon cycle?",
          answer:
            "Under a day-for-a-year rule, the Moon's roughly 27.3-day orbital period becomes a cycle of about 27 to 28 years, so the progressed Moon passes through each sign for roughly two and a quarter years. It is the fastest-moving progressed factor and is consequently the most used in practice for describing shorter-term development.",
        },
      ],
      explore: [
        { label: "Transits", href: "/astrology/transits", blurb: "The other main timing technique, using real positions." },
        { label: "Solar return", href: "/astrology/solar-return", blurb: "An annual chart cast on the Sun's return." },
        { label: "Natal chart", href: "/astrology/natal-chart", blurb: "The base chart progressions advance." },
      ],
      interpretive: true,
      keywords: ["secondary progressions", "solar arc", "progressed Moon"],
    },
    {
      slug: "solar-return",
      name: "Solar Return",
      summary: "A chart cast for the Sun's yearly return to its birth position.",
      overview:
        "A solar return chart is cast for the exact moment each year when the Sun returns to the ecliptic longitude it held at birth. Astrological tradition reads it as describing the year ahead. The return moment itself is a precisely calculable astronomical event.",
      keyPoints: [
        "The return rarely falls exactly on the birthday — it can be a day either side.",
        "The moment is exact and computable; the annual significance attached to it is tradition.",
        "The location used for the chart changes the result, and practitioners disagree about which to use.",
        "Lunar returns apply the same idea monthly.",
      ],
      body: [
        {
          heading: "Why the return is not exactly the birthday",
          paragraphs: [
            "The tropical year — the time for the Sun to return to the same ecliptic longitude — is about 365.2422 days, not a whole number. The civil calendar absorbs the fraction with leap days, so the exact moment of solar return drifts by roughly six hours each year and resets when a leap day intervenes.",
            "As a result the return can fall on the day before or after the calendar birthday, and it occurs at a different clock time each year. This is straightforward astronomy: the same fractional-day arithmetic that makes the Gregorian calendar necessary.",
          ],
        },
        {
          heading: "What the chart contains",
          paragraphs: [
            "A solar return chart is cast for that exact instant, so the Sun sits at precisely its natal longitude and everything else is wherever it happens to be. The Ascendant and houses come from the location used, and because the return time shifts by about six hours annually, the Ascendant typically advances substantially year to year.",
            "Tradition reads the return chart as a description of themes for the coming year, often in combination with the natal chart rather than in isolation.",
          ],
        },
        {
          heading: "The location question",
          paragraphs: [
            "Practitioners disagree about which location to use: the birthplace, the current residence, or wherever the person actually is at the moment of return. Since the location determines the Ascendant and the entire house structure, the choice materially changes the chart.",
            "This has produced the practice of relocating for a solar return — travelling to a place that yields a preferred chart. Whether that is meaningful within the tradition is itself disputed, and it is a good illustration of how an interpretive framework generates questions that no measurement can resolve.",
          ],
        },
        {
          heading: "Lunar and other returns",
          paragraphs: [
            "The same construction applies to any body. A lunar return chart is cast when the Moon comes back to its natal longitude, which happens roughly every 27.3 days, and is read as describing a shorter cycle.",
            "Returns for other planets exist but are rare by construction — a Saturn return occurs about every 29.5 years, so most people experience two or three in a lifetime, and the first, around age 29 or 30, is one of the more widely known concepts in popular astrology.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is a solar return chart?",
          answer:
            "A chart cast for the exact moment the Sun returns to the ecliptic longitude it occupied at birth, which happens once a year. Astrological tradition reads it as describing themes for the year ahead. The return moment itself is a precise astronomical event that can be computed exactly.",
        },
        {
          question: "Why doesn't the solar return fall exactly on my birthday?",
          answer:
            "Because the tropical year is about 365.2422 days rather than a whole number. The calendar absorbs the fraction using leap days, so the exact return moment drifts roughly six hours later each year and jumps back when a leap day occurs. It can therefore fall a day either side of the calendar birthday, at a different clock time each year.",
        },
        {
          question: "What is a Saturn return?",
          answer:
            "The point at which Saturn comes back to the position it held at birth, which takes roughly 29.5 years. The first occurs around age 29 or 30 and is traditionally read as a period of consolidation and restructuring. It is among the most widely known ideas in popular astrology, and it is a genuine orbital fact that Saturn's period is close to 29.5 years.",
        },
      ],
      explore: [
        { label: "Transits", href: "/astrology/transits", blurb: "Ongoing planetary positions against the natal chart." },
        { label: "Progressions", href: "/astrology/progressions", blurb: "Symbolically advanced charts." },
        { label: "Celestial events", href: "/sky-guide/celestial-events", blurb: "The astronomy of solar and orbital returns." },
      ],
      interpretive: true,
      keywords: ["return chart", "birthday chart", "Saturn return", "tropical year"],
    },
    {
      slug: "compatibility",
      name: "Compatibility",
      summary: "How traditions compare signs and charts between people.",
      overview:
        "Astrological compatibility covers traditions for comparing two people's signs or charts. Popular versions reduce this to sun signs; the older technical tradition compares whole charts. Neither is a scientific measure of relationship outcomes.",
      keyPoints: [
        "Sun-sign compatibility is a modern popular simplification, not a traditional technique.",
        "Element and modality groupings are the usual basis for quick compatibility claims.",
        "Full-chart comparison — synastry — is the tradition's own method.",
        "Studies of marriage and relationship data have not found sign-based effects.",
      ],
      body: [
        {
          heading: "What popular compatibility actually uses",
          paragraphs: [
            "Most compatibility content compares Sun signs alone, usually via element groupings: fire with air, earth with water, and same-element pairings treated as harmonious, while squares and oppositions between signs are treated as challenging.",
            "This is a twentieth-century popular construction. The older technical tradition never treated Sun signs in isolation as sufficient for anything, and comparing two entire charts — synastry — is what the tradition actually prescribes. Sun-sign compatibility is therefore a simplification that the tradition's own standards do not endorse.",
          ],
        },
        {
          heading: "The traditional groupings",
          list: [
            "Same element — fire with fire, earth with earth, and so on — traditionally read as easy mutual understanding.",
            "Fire with air, and earth with water, are the classic complementary pairings.",
            "Signs 90 or 180 degrees apart form squares and oppositions, traditionally read as friction or polarity.",
            "Adjacent signs, 30 degrees apart, are traditionally read as having little in common — a semisextile relationship.",
            "Modality matters too: two cardinal signs are read differently from a cardinal and a mutable one.",
          ],
        },
        {
          heading: "What the tradition prescribes instead",
          paragraphs: [
            "Synastry compares complete charts, examining aspects between one person's planets and the other's, house overlays showing where each person's planets fall in the other's chart, and the relationship between the two Ascendants. Composite charts, constructed from the midpoints of the two charts, are used to describe the relationship as an entity in its own right.",
            "This is substantially more involved than sign matching, and practitioners generally regard reducing it to Sun signs as a distortion. That criticism comes from within the tradition, not only from outside it.",
          ],
        },
        {
          heading: "The evidence question",
          paragraphs: [
            "Large-scale analyses of marriage and relationship records have looked for correlations between partners' sun signs and relationship formation or duration, and have not found effects distinguishable from chance. The datasets involved are large enough that a real effect of the size popular astrology implies would have been visible.",
            "Asteria Star reports that plainly. Compatibility material is presented here as a description of what the tradition holds and how it is constructed, not as guidance about actual relationships.",
          ],
        },
      ],
      faqs: [
        {
          question: "Is sun-sign compatibility a traditional astrological technique?",
          answer:
            "No. It is a twentieth-century popular simplification. The older technical tradition compares complete charts through synastry — inter-chart aspects, house overlays, and the relationship between the two Ascendants — and treats Sun signs alone as far too little information. The criticism of sign-matching comes from inside the tradition as well as outside it.",
        },
        {
          question: "What does astrology say makes two signs compatible?",
          answer:
            "The usual scheme is element-based: same-element pairings and the fire-with-air and earth-with-water combinations are traditionally read as harmonious, while signs 90 or 180 degrees apart are read as producing friction. Modality — cardinal, fixed, mutable — is a second layer. These are traditional conventions rather than findings.",
        },
        {
          question: "Is there evidence that zodiac compatibility works?",
          answer:
            "No. Large studies using marriage and relationship records have looked for correlations between partners' sun signs and relationship formation or duration and found nothing distinguishable from chance. The samples were large enough that an effect of the size popular astrology implies would have shown up.",
        },
      ],
      explore: [
        { label: "Synastry", href: "/astrology/synastry", blurb: "The full-chart comparison technique." },
        { label: "Zodiac signs", href: "/astrology/zodiac-signs", blurb: "Elements, modalities, and their traditional groupings." },
        { label: "Aspects", href: "/astrology/aspects", blurb: "The angular relationships synastry uses." },
      ],
      interpretive: true,
      keywords: ["zodiac compatibility", "love astrology", "element pairings"],
    },
    {
      slug: "synastry",
      name: "Synastry",
      summary: "Comparing two birth charts side by side.",
      overview:
        "Synastry is the astrological technique of comparing two complete birth charts to describe the dynamics tradition associates with a relationship. It is the tradition's own method for relationship analysis, and it is interpretive rather than predictive.",
      keyPoints: [
        "Synastry examines aspects between one chart's planets and the other's.",
        "House overlays show where each person's planets fall in the other's chart.",
        "A composite chart is a separate construction, built from midpoints.",
        "Requires accurate birth times for both people to be done as the tradition prescribes.",
      ],
      body: [
        {
          heading: "Inter-chart aspects",
          paragraphs: [
            "The core of synastry is measuring the angular relationships between the planets in one chart and those in the other. One person's Venus forming a trine to the other's Mars would be described as a Venus–Mars trine in synastry, and read according to the traditional meanings of both bodies and the aspect.",
            "The calculation is the same geometry used within a single chart, applied across two. What differs is the interpretive frame: aspects between charts are read as describing interaction rather than internal disposition.",
          ],
        },
        {
          heading: "House overlays",
          paragraphs: [
            "The second component places one person's planets into the other's house structure. If someone's Jupiter falls in their partner's seventh house, tradition reads that as Jupiter's significations operating in the domain that house governs.",
            "Because houses depend on birth time and place, overlays are only meaningful when both birth times are accurately known. An unknown time makes this component of the technique unavailable, which practitioners generally acknowledge rather than working around.",
          ],
        },
        {
          heading: "Composite and Davison charts",
          paragraphs: [
            "A composite chart is constructed from the midpoints between each pair of corresponding planets in the two charts — a mathematical hybrid rather than a chart for any real moment. Tradition reads it as describing the relationship itself as an entity.",
            "The Davison relationship chart takes a different approach: a real chart cast for the midpoint in time and space between the two births. Unlike a composite, it corresponds to an actual moment and place, so its planetary positions are genuine ephemeris values. Which construction to prefer is a matter of school.",
          ],
        },
        {
          heading: "How this is presented here",
          paragraphs: [
            "Synastry is documented on Asteria Star as a technique — what it does, what it requires, and how practitioners describe it. The interpretations are the tradition's, and they are not presented as findings about how relationships work.",
            "The distinction is worth restating because relationship material is where interpretive claims most easily read as advice. Astrological compatibility analysis has not been shown to predict relationship outcomes, and this section describes a practice rather than recommending decisions based on it.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is synastry?",
          answer:
            "The astrological technique of comparing two complete birth charts to describe relationship dynamics. It examines aspects between one person's planets and the other's, and where each person's planets fall within the other's house structure. It is the tradition's own relationship method, as distinct from popular sun-sign compatibility.",
        },
        {
          question: "What is the difference between a synastry chart and a composite chart?",
          answer:
            "Synastry compares two charts against each other, keeping them distinct. A composite chart merges them into one by taking the midpoints between corresponding planets, producing a hybrid that does not correspond to any actual moment. A Davison chart is a third option: a real chart for the midpoint in both time and place between the two births.",
        },
        {
          question: "Do I need both birth times for synastry?",
          answer:
            "For the full technique, yes. Inter-chart aspects between planets can be calculated approximately from dates alone, but house overlays and the Ascendant relationship require accurate birth times for both people. Practitioners generally state this limitation rather than working around it.",
        },
      ],
      explore: [
        { label: "Compatibility", href: "/astrology/compatibility", blurb: "Sign-level comparison and its limitations." },
        { label: "Aspects", href: "/astrology/aspects", blurb: "The angular relationships synastry measures." },
        { label: "Houses", href: "/astrology/houses", blurb: "The structure that overlays depend on." },
      ],
      interpretive: true,
      keywords: ["relationship astrology", "chart comparison", "composite chart", "Davison"],
    },
    {
      slug: "chinese-zodiac",
      name: "Chinese Zodiac",
      summary: "The twelve-year animal cycle of East Asian tradition.",
      overview:
        "The Chinese zodiac, or shengxiao, is a twelve-year cycle in which each year is associated with an animal. It is a calendrical and folklore tradition of East Asia, structurally and historically distinct from Western astrology and from astronomy.",
      keyPoints: [
        "The cycle is annual, not monthly — it assigns animals to years, not to birth dates within a year.",
        "The year begins at Lunar New Year, not 1 January, so early-year births need care.",
        "Combined with the ten heavenly stems, the full cycle is sixty years, not twelve.",
        "It is not a translation or variant of the Western zodiac; the two developed independently.",
      ],
      body: [
        {
          heading: "The twelve animals and the sixty-year cycle",
          paragraphs: [
            "The twelve earthly branches are associated with rat, ox, tiger, rabbit, dragon, snake, horse, goat, monkey, rooster, dog and pig, cycling through the years in that fixed order.",
            "The full traditional system is larger. The twelve branches combine with ten heavenly stems — paired with the five phases of wood, fire, earth, metal and water in yin and yang forms — producing a sexagenary cycle of sixty combinations. This is why a year is properly described as, for example, a wood dragon year rather than simply a dragon year, and why the same stem-branch combination recurs only every sixty years.",
          ],
        },
        {
          heading: "When the year actually begins",
          paragraphs: [
            "The zodiac year begins at Lunar New Year, which falls between late January and mid-February depending on the lunisolar calendar. Someone born in mid-January therefore belongs to the previous animal year, not the one that starts later that month.",
            "This is the most common source of error in casual lookups, and it is a real calendrical fact rather than a subtlety of interpretation. Some traditions instead use the solar term Lichun, around 4 February, as the boundary, so authorities can disagree for births in that narrow window.",
          ],
        },
        {
          heading: "Cultural role",
          paragraphs: [
            "The shengxiao is embedded in East Asian calendrical practice and folklore. Animals are associated with traditional character attributes, used in compatibility folklore, and feature prominently in Lunar New Year celebration across China, Vietnam, Korea, Japan and the diaspora — with regional variations in the animal list, notably Vietnam's cat where other traditions have the rabbit.",
            "It has documented social effects independent of any predictive claim: birth rates have measurably shifted around years considered auspicious, particularly dragon years, in several East Asian societies. That is a real demographic phenomenon caused by belief, which is a different kind of fact from the belief being correct.",
          ],
        },
        {
          heading: "Not a version of Western astrology",
          paragraphs: [
            "The two systems share the word 'zodiac' and little else. The Western zodiac divides the ecliptic into twelve segments and assigns signs by the Sun's position at birth, changing roughly monthly. The Chinese system assigns animals to whole years within a lunisolar calendar and derives from a different cultural and calendrical tradition entirely.",
            "Chinese astrological practice does include chart-based methods — such as Zi Wei Dou Shu and the Four Pillars of Destiny — that use birth hour as well as year, but these are separate systems from the popular animal-year zodiac and are not equivalent to Western natal astrology either.",
          ],
        },
      ],
      faqs: [
        {
          question: "How do I find my Chinese zodiac animal?",
          answer:
            "From your birth year, using the twelve-year cycle — but with the year beginning at Lunar New Year rather than 1 January. Anyone born in January or early February may belong to the previous animal year, so the exact Lunar New Year date for that year must be checked. Some traditions use the solar term Lichun, around 4 February, instead.",
        },
        {
          question: "Why is the Chinese zodiac cycle sometimes described as sixty years?",
          answer:
            "Because the twelve earthly branches combine with ten heavenly stems, paired with the five phases in yin and yang forms, producing sixty distinct stem-branch combinations. A specific combination — a wood dragon year, for example — recurs only every sixty years, even though the animal alone recurs every twelve.",
        },
        {
          question: "Is the Chinese zodiac related to the Western zodiac?",
          answer:
            "No. They developed independently and work differently. The Western zodiac divides the ecliptic into twelve segments and assigns a sign by the Sun's position at birth, changing about monthly. The Chinese system assigns an animal to an entire year within a lunisolar calendar. They share the English word 'zodiac' and essentially nothing else.",
        },
      ],
      explore: [
        { label: "Zodiac signs", href: "/astrology/zodiac-signs", blurb: "The unrelated Western twelvefold system." },
        { label: "Ancient civilizations", href: "/encyclopedia/ancient-civilizations", blurb: "Chinese astronomical record-keeping." },
        { label: "Reference systems", href: "/reference-systems", blurb: "Lunisolar calendars and solar terms." },
      ],
      interpretive: true,
      keywords: ["sheng xiao", "animal signs", "lunar new year", "sexagenary cycle"],
    },
    {
      slug: "western-astrology",
      name: "Western Astrology",
      summary: "The tropical-zodiac tradition rooted in the Mediterranean world.",
      overview:
        "Western astrology is the tradition that developed around the Mediterranean and uses the tropical zodiac, measured from the March equinox. This topic covers its structure, its historical development, and its internal divisions, as cultural heritage rather than science.",
      keyPoints: [
        "Its defining technical feature is the tropical zodiac, anchored to the seasons rather than the stars.",
        "Its core framework — signs, houses, aspects, rulerships — was assembled in Hellenistic Egypt.",
        "Modern and traditional schools differ substantially in method, not just in style.",
        "It separated from astronomy in the seventeenth and eighteenth centuries.",
      ],
      body: [
        {
          heading: "What makes it Western",
          paragraphs: [
            "The distinguishing technical feature is the tropical zodiac: the first degree of Aries is defined as the March equinox point, so the signs track the seasons. Because precession moves the equinox westward against the stars, the tropical signs have drifted about 30 degrees from the constellations of the same name over roughly two millennia.",
            "This is a deliberate choice, not an oversight. The tropical framework ties the zodiac to the solar year, and Western practitioners generally defend it on those grounds. Sidereal traditions, principally Jyotisha, anchor to the stars instead and produce different sign placements from identical data.",
          ],
        },
        {
          heading: "The Hellenistic synthesis",
          paragraphs: [
            "The framework Western astrology still uses was assembled in Hellenistic Egypt from roughly the second century BCE: Babylonian zodiacal and planetary material, Greek geometry and element theory, and Egyptian decanal tradition combined into a system with ascendant, twelve houses, aspects derived from inscribed polygons, and a scheme of planetary rulerships and dignities.",
            "Ptolemy's Tetrabiblos, in the second century CE, is its most influential systematic statement — written by the same author as the Almagest, which is itself a reminder that the astronomical and astrological work came from one person and one intellectual project.",
          ],
        },
        {
          heading: "Transmission and revival",
          list: [
            "The tradition passed into Arabic scholarship, where it was developed substantially and where the astronomical tables it required drove genuine observational advances.",
            "Latin Europe received it through twelfth- and thirteenth-century translations, and astrology was taught in universities and applied in medicine.",
            "It lost academic standing in the seventeenth and eighteenth centuries as Newtonian physics supplied a mechanism for planetary motion that offered no channel for planetary influence.",
            "Twentieth-century revival was shaped by theosophical and psychological currents, reframing the chart as a tool for self-understanding rather than prediction.",
            "A traditional and Hellenistic revival since the late twentieth century has recovered and translated older technical texts, producing a school that explicitly rejects much modern method.",
          ],
        },
        {
          heading: "Internal disagreement is the norm",
          paragraphs: [
            "There is no single Western astrology. Practitioners disagree about which house system to use, whether to include the outer planets, whether to use dignity schemes, what orbs to allow, and whether the chart describes events or psychology. These are methodological disagreements that produce different readings from identical data.",
            "Presenting the field as unified would misrepresent it. Any statement beginning 'Western astrology says' should be read as shorthand for a particular school's position, and this platform tries to name the school where the difference matters.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is the tropical zodiac?",
          answer:
            "The zodiac used in Western astrology, measured from the March equinox rather than from the stars. The first degree of Aries is defined as the equinox point, so the signs stay fixed to the seasons. Because precession moves the equinox against the stars, the tropical signs have drifted about one sign away from the constellations of the same name over two thousand years.",
        },
        {
          question: "Where did Western astrology come from?",
          answer:
            "It was assembled in Hellenistic Egypt from roughly the second century BCE, combining Babylonian zodiacal and planetary material, Greek geometry and element theory, and Egyptian decanal tradition. Ptolemy's Tetrabiblos in the second century CE is its most influential systematic statement, written by the same author as the Almagest.",
        },
        {
          question: "Why do traditional and modern astrologers disagree?",
          answer:
            "Because they use different methods. Traditional and Hellenistic practice works with the seven classical planets and applies dignity schemes that modern psychological astrology largely set aside; modern practice adds Uranus, Neptune and Pluto and often reframes the chart around self-understanding rather than prediction. They also frequently differ on house systems and orbs, so the same chart yields different readings.",
        },
      ],
      explore: [
        { label: "History of astrology", href: "/encyclopedia/history-of-astrology", blurb: "The full historical development." },
        { label: "Vedic astrology", href: "/astrology/vedic-astrology", blurb: "The sidereal tradition, for comparison." },
        { label: "Zodiac signs", href: "/astrology/zodiac-signs", blurb: "The tropical signs in detail." },
      ],
      interpretive: true,
      keywords: ["tropical zodiac", "horoscopic astrology", "Tetrabiblos", "Hellenistic"],
    },
    {
      slug: "vedic-astrology",
      name: "Vedic Astrology",
      summary: "Jyotisha — the astrological tradition of the Indian subcontinent.",
      overview:
        "Vedic astrology, or Jyotisha, is the astrological tradition of the Indian subcontinent. It uses a sidereal zodiac referenced to the stars, gives the Moon greater prominence than Western practice, and adds structural elements — nakshatras and dashas — with no Western counterpart.",
      keyPoints: [
        "Jyotisha uses a sidereal zodiac, so its sign placements differ from Western ones by roughly 24 degrees.",
        "The 27 nakshatras subdivide the ecliptic independently of the twelve signs.",
        "Dasha systems assign planetary periods to segments of a life.",
        "The Moon's position, not the Sun's, is the usual starting point.",
      ],
      body: [
        {
          heading: "The sidereal zodiac and ayanamsa",
          paragraphs: [
            "Jyotisha measures the zodiac against the fixed stars rather than the equinox. The offset between the two frameworks is called the ayanamsa, currently around 24 degrees, and it grows by roughly one degree every 72 years as precession continues.",
            "The practical consequence is that most people have a different sign in Jyotisha than in Western astrology — commonly the previous one. Neither is a mistake; they are different conventions applied to the same measured planetary position. There are also several competing ayanamsa values in use, principally the Lahiri, so even within Jyotisha placements near a boundary can differ.",
          ],
        },
        {
          heading: "Nakshatras",
          paragraphs: [
            "Alongside the twelve signs, Jyotisha divides the ecliptic into 27 nakshatras — lunar mansions of about 13 degrees 20 minutes each, corresponding roughly to the Moon's daily progress. The scheme is attested in early Vedic sources and predates the twelvefold zodiac in the Indian tradition.",
            "Each nakshatra carries its own attributes and ruling planet, and is further subdivided into four padas. The Moon's nakshatra at birth is a primary interpretive factor, and it is used in practical contexts including traditional name selection and the timing of ceremonies.",
          ],
        },
        {
          heading: "Dashas: planetary periods",
          paragraphs: [
            "Jyotisha's principal timing technique divides a life into planetary periods called dashas. The most widely used system, Vimshottari, runs a 120-year cycle in which each of nine planetary agents governs a period of fixed length — Venus twenty years, Sun six, and so on — with the starting point determined by the Moon's nakshatra at birth.",
            "Each major period subdivides into sub-periods and further levels. This produces a timing framework structurally unlike Western transits and progressions, and it is one of the clearest illustrations that Jyotisha is a separate system rather than a variant of Western practice.",
          ],
        },
        {
          heading: "Other structural differences",
          list: [
            "Chart presentation is square rather than circular, in North Indian or South Indian formats that differ in layout convention.",
            "Whole Sign houses are standard, avoiding the house-system disputes prominent in Western practice.",
            "The lunar nodes, Rahu and Ketu, are treated as full planetary agents with their own significations.",
            "The outer planets are generally not used, since the classical system predates their discovery.",
            "Remedial measures — gemstones, mantras, rituals — form a practical component with no real Western equivalent.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why is my Vedic sign different from my Western sign?",
          answer:
            "Because the two use different zodiacs. Western tropical astrology measures from the March equinox; Jyotisha uses a sidereal zodiac referenced to the stars. Precession has separated them by roughly 24 degrees — most of a sign — so the same computed planetary position usually falls in the previous sign under Jyotisha. Both are internally consistent conventions.",
        },
        {
          question: "What are nakshatras?",
          answer:
            "Twenty-seven divisions of the ecliptic, each about 13 degrees 20 minutes wide, corresponding roughly to the Moon's daily motion. They are attested in early Vedic sources and predate the twelvefold zodiac in Indian tradition. Each carries its own attributes and ruling planet, and the Moon's nakshatra at birth is a primary interpretive factor.",
        },
        {
          question: "What is a dasha?",
          answer:
            "A planetary period in Jyotisha's main timing system. The widely used Vimshottari scheme divides a 120-year cycle among nine planetary agents, each governing a period of fixed length, with the entry point set by the Moon's nakshatra at birth. Periods subdivide into sub-periods, giving a timing framework structurally unlike Western transits or progressions.",
        },
      ],
      explore: [
        { label: "Western astrology", href: "/astrology/western-astrology", blurb: "The tropical tradition, for comparison." },
        { label: "Moon sign", href: "/astrology/moon-sign", blurb: "Why Jyotisha centres the Moon." },
        { label: "Ancient civilizations", href: "/encyclopedia/ancient-civilizations", blurb: "Indian astronomical computation." },
      ],
      interpretive: true,
      keywords: ["jyotisha", "sidereal", "nakshatra", "dasha", "ayanamsa"],
    },
  ],
};
