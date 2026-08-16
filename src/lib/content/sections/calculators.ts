import type { Section } from "@/lib/content/types";

const NUMEROLOGY_DISCLAIMER =
  "Numerology on Asteria Star is presented as a cultural and symbolic tradition. It is not presented as scientifically proven.";

/**
 * Calculators — method references and the platform's real tools.
 *
 * IMPORTANT editorial position: Asteria Star does not host an astrological
 * chart engine, and these pages do not pretend otherwise. Each page publishes
 * the *method* — the actual procedure, tables, and inputs a reader needs to
 * work the answer out, or an honest account of why a date alone is not enough
 * and what data would be required. That is real, usable reference material
 * rather than a promise of a future tool.
 *
 * The platform's thirty working scientific calculators are catalogued
 * separately under /calculators, with executable formulae and provenance.
 * Astrology and numerology material is marked interpretive and carries a
 * disclaimer; physics material is framed factually.
 */
export const calculators: Section = {
  slug: "calculators",
  name: "Calculators",
  kind: "tools",
  accent: "plasma",
  tagline: "Methods for the sky — astronomical and traditional.",
  description:
    "How the calculations actually work: sun-sign date conventions, ascendant geometry, numerology reduction, planetary ephemerides — plus the platform's thirty working scientific calculators.",
  intro:
    "This hub documents how each calculation is performed, so you can follow the method rather than trust a black box. Physics-based calculators are grounded in published planetary data and are executable under the scientific calculator catalogue; astrology and numerology methods are documented as cultural tradition and labelled interpretive. Where a result genuinely requires data we do not have — an exact birth time, an ephemeris lookup — the page says so instead of guessing.",
  categories: [
    {
      slug: "natal-chart-calculator",
      name: "Natal Chart Calculator",
      summary: "What computing a birth chart actually requires, step by step.",
      overview:
        "Casting a birth chart is a well-defined computational procedure with four stages. This page documents each of them and states plainly what data is required — including the parts that cannot be recovered when a birth time is unknown.",
      keyPoints: [
        "Chart calculation is deterministic arithmetic on ephemeris data — there is nothing mysterious about the computation itself.",
        "Time zone and historical daylight-saving conversion is the single most common source of error.",
        "The house system must be chosen before the chart can be drawn, and the choice changes placements.",
        "Asteria Star does not host a chart engine; this page documents the procedure rather than executing it.",
      ],
      body: [
        {
          heading: "The four stages of chart calculation",
          list: [
            "Convert the birth moment to universal time. This requires the correct historical time-zone offset for that date and place, including any daylight-saving rule then in force — rules that have changed frequently and inconsistently across jurisdictions.",
            "Look up planetary positions for that instant from an ephemeris. Modern software typically uses a numerically integrated ephemeris such as the JPL Development Ephemeris series, the same data used for spacecraft navigation.",
            "Compute the Ascendant and Midheaven from local sidereal time, geographic latitude, and the obliquity of the ecliptic. This is spherical trigonometry with a closed-form solution.",
            "Divide the chart into houses using a chosen system. This is the only stage where the answer depends on a convention rather than on the inputs.",
          ],
        },
        {
          heading: "Why time conversion causes most errors",
          paragraphs: [
            "A birth time is normally recorded in local civil time, and converting it to universal time requires knowing the offset that actually applied at that place on that date. Daylight-saving rules have changed repeatedly, applied inconsistently between neighbouring regions, and in some periods were introduced or suspended at short notice.",
            "A one-hour error moves the Ascendant by roughly half a sign, which is enough to change the rising sign and shift every house cusp. When two chart tools disagree, historical time conversion is the most likely cause, followed by differing coordinates assigned to the same place name.",
          ],
        },
        {
          heading: "What can and cannot be determined without a birth time",
          paragraphs: [
            "Without an accurate time, the Sun's sign is still certain except very near an ingress, and the Moon's sign is usually determinable since the Moon spends over two days in each sign. The other planets move slowly enough that their signs are almost always unambiguous from the date alone.",
            "The Ascendant, the Midheaven and all twelve house cusps cannot be determined. These rotate through the entire zodiac in about 24 hours, so a date without a time leaves them completely open. Astrological tradition includes rectification techniques for estimating a birth time from life events, but those are interpretive procedures, not measurements, and they do not recover information that was never recorded.",
          ],
        },
        {
          heading: "Where the real computed astronomy lives",
          paragraphs: [
            "Asteria Star computes and publishes genuine solar and lunar positions, twilight geometry, and planetary visibility under its sky pages, from published algorithms with a stated validity horizon. Those are astronomy, and they are the honest half of what a chart calculator does.",
            "The interpretive half — assigning meanings to placements — is documented under the astrology section as tradition. Separating the two is deliberate: the computation is checkable, the interpretation is cultural, and merging them into a single tool would blur a distinction this platform exists to maintain.",
          ],
        },
      ],
      faqs: [
        {
          question: "What data is needed to calculate a birth chart?",
          answer:
            "Date, exact time, and place of birth. The date fixes planetary positions, the place fixes geographic latitude and longitude, and the time — converted correctly to universal time using the historical offset for that date and location — determines the Ascendant and the entire house structure.",
        },
        {
          question: "Why do chart calculators give different results for the same birth data?",
          answer:
            "Most often because of time-zone conversion. Historical daylight-saving rules varied by jurisdiction and changed frequently, and a one-hour error shifts the Ascendant by about half a sign. Different coordinates assigned to the same city, and different house systems, account for most of the rest.",
        },
        {
          question: "Does Asteria Star calculate birth charts?",
          answer:
            "No. This page documents how the calculation is performed rather than performing it. The platform does compute and publish genuine solar, lunar and planetary positions under its sky pages, and it catalogues thirty executable scientific calculators — but it does not host an astrological chart engine.",
        },
      ],
      explore: [
        { label: "How to read a birth chart", href: "/guides/how-to-read-a-birth-chart", blurb: "What the finished chart means, in the tradition." },
        { label: "Scientific calculators", href: "/calculators", blurb: "Thirty executable calculators with formulae and provenance." },
        { label: "Houses", href: "/astrology/houses", blurb: "The house systems the fourth stage chooses between." },
      ],
      interpretive: true,
      keywords: ["birth chart calculation", "natal chart method", "ephemeris", "house system"],
    },
    {
      slug: "zodiac-sign-calculator",
      name: "Zodiac Sign Calculator",
      summary: "The conventional sun-sign date ranges, and why they shift.",
      overview:
        "Finding a Western sun sign from a birth date needs no software — it is a lookup against twelve conventional date ranges. This page publishes those ranges, and explains why the boundaries move by a day either way between years.",
      keyPoints: [
        "The sign boundaries are the moments the Sun crosses each 30-degree division of the tropical zodiac.",
        "Boundary dates shift by about a day between years because the tropical year is not a whole number of days.",
        "'Cusp' births are births near a boundary — the Sun is in one sign or the other, never both.",
        "These ranges are astrological convention and do not match the constellation the Sun is actually in.",
      ],
      body: [
        {
          heading: "The conventional date ranges",
          list: [
            "Aries — about 21 March to 19 April. Taurus — about 20 April to 20 May.",
            "Gemini — about 21 May to 20 June. Cancer — about 21 June to 22 July.",
            "Leo — about 23 July to 22 August. Virgo — about 23 August to 22 September.",
            "Libra — about 23 September to 22 October. Scorpio — about 23 October to 21 November.",
            "Sagittarius — about 22 November to 21 December. Capricorn — about 22 December to 19 January.",
            "Aquarius — about 20 January to 18 February. Pisces — about 19 February to 20 March.",
          ],
        },
        {
          heading: "Why the boundaries move",
          paragraphs: [
            "Each boundary is the instant the Sun reaches a multiple of 30 degrees of ecliptic longitude measured from the March equinox. That is a precise astronomical moment, not a calendar date.",
            "Because the tropical year is about 365.2422 days rather than a whole number, that instant falls roughly six hours later each year and jumps back when a leap day intervenes. Over the four-year leap cycle the corresponding calendar date can therefore shift by about a day, which is why published ranges use approximate dates.",
          ],
        },
        {
          heading: "Births near a boundary",
          paragraphs: [
            "Popular writing describes people born close to a boundary as being 'on the cusp', sometimes suggesting they share both signs. Astronomically that is not the case: at any instant the Sun's longitude falls in exactly one 30-degree division.",
            "For a birth within a day of a boundary, determining the sign requires the actual ingress time for that specific year and the birth time. This is one of the few cases where a sun-sign answer genuinely needs more than the date — and where a lookup table is insufficient rather than merely approximate.",
          ],
        },
        {
          heading: "This is not the Sun's constellation",
          paragraphs: [
            "These ranges belong to the tropical zodiac, anchored to the March equinox. Precession has carried that reference point about 30 degrees westward against the stars over roughly two thousand years, so for most dates the Sun is physically in the constellation preceding the astrological sign.",
            "Sidereal traditions such as Jyotisha use star-referenced boundaries and therefore give different dates entirely. Neither system is miscalculating; they are anchored to different reference points, and each is internally consistent.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why do sun-sign dates vary by a day between sources?",
          answer:
            "Because the boundaries are astronomical instants, not calendar dates. Each is the moment the Sun reaches a multiple of 30 degrees of ecliptic longitude, and because the tropical year is about 365.2422 days, that moment drifts roughly six hours later each year and resets at leap days. The corresponding calendar date therefore shifts by about a day across the leap cycle.",
        },
        {
          question: "What does it mean to be born on the cusp?",
          answer:
            "Only that the birth fell close to a sign boundary. At any given instant the Sun's ecliptic longitude lies in exactly one sign — there is no astronomical sense in which it occupies two. Determining the sign for a birth within a day of a boundary requires that year's exact ingress time and the birth time.",
        },
        {
          question: "Is my sun sign the constellation the Sun was in?",
          answer:
            "Usually not. These ranges use the tropical zodiac, measured from the March equinox, and precession has shifted that reference point about one full sign against the stars over two millennia. For most dates the Sun is physically in the constellation preceding the astrological sign, and it also crosses Ophiuchus, which is not a sign at all.",
        },
      ],
      explore: [
        { label: "Zodiac signs", href: "/astrology/zodiac-signs", blurb: "The twelve signs, elements, and modalities." },
        { label: "Constellations", href: "/constellations", blurb: "The astronomical regions the Sun actually crosses." },
        { label: "Celestial events", href: "/sky-guide/celestial-events", blurb: "Equinoxes, solstices, and why they are instants." },
      ],
      interpretive: true,
      keywords: ["sun sign dates", "what's my sign", "cusp dates", "zodiac boundaries"],
    },
    {
      slug: "rising-sign-calculator",
      name: "Rising Sign Calculator",
      summary: "The geometry that determines an Ascendant, and what it needs.",
      overview:
        "The Ascendant is computed from three quantities: local sidereal time, geographic latitude, and the obliquity of the ecliptic. This page documents that calculation and explains why it is far more sensitive to input errors than a sun sign.",
      keyPoints: [
        "The Ascendant is a closed-form trigonometric result, not an approximation.",
        "It requires latitude, so two people born at the same instant in different places have different Ascendants.",
        "Signs rise at unequal rates, so 'one sign every two hours' is an average, not a rule.",
        "At very high latitudes the calculation becomes degenerate for some dates.",
      ],
      body: [
        {
          heading: "What the calculation needs",
          list: [
            "Local sidereal time at the moment of birth — derived from universal time, the date, and the geographic longitude.",
            "Geographic latitude of the birthplace.",
            "The obliquity of the ecliptic, about 23.44 degrees, which changes very slowly and is usually taken for the epoch.",
            "From these, the Ascendant follows from a standard spherical-trigonometry expression giving the ecliptic longitude of the point rising on the eastern horizon.",
          ],
        },
        {
          heading: "Why it is so sensitive",
          paragraphs: [
            "Earth's rotation carries the Ascendant through 360 degrees of ecliptic longitude in roughly 24 hours. That is about a quarter of a degree per minute of clock time, so a four-minute error shifts it by a degree and a two-hour error changes the sign entirely.",
            "By comparison the Sun moves about one degree per day. The Ascendant is therefore roughly 360 times more sensitive to a timing error than the sun sign — which is why an approximate birth time is adequate for one and useless for the other.",
          ],
        },
        {
          heading: "Signs do not rise at equal rates",
          paragraphs: [
            "Because the ecliptic is inclined to the celestial equator, the twelve signs cross the eastern horizon at different rates, and the disparity increases with latitude. At mid-northern latitudes some signs rise in appreciably under two hours while others take considerably more.",
            "Signs that rise quickly are correspondingly rarer as Ascendants, which is a purely geometric fact with no interpretive content. It does mean that any statement about how common a given rising sign is depends on latitude.",
          ],
        },
        {
          heading: "The high-latitude breakdown",
          paragraphs: [
            "Above the Arctic and Antarctic circles the calculation can become degenerate: on some dates portions of the ecliptic do not rise or set at all, so the notion of a rising point is undefined for part of the day.",
            "Chart software handles this in different ways, and quadrant house systems that depend on rise and set arcs fail alongside it. Practitioners working at high latitudes generally adopt Whole Sign or Equal House for this reason — a case where mathematics, not interpretation, forces a methodological choice.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is needed to calculate a rising sign?",
          answer:
            "Local sidereal time at the moment of birth — which requires accurate universal time and the birthplace longitude — plus the geographic latitude and the obliquity of the ecliptic. From these the Ascendant follows directly from a standard spherical-trigonometry expression. There is no approximation involved in the geometry itself.",
        },
        {
          question: "How accurate does my birth time need to be?",
          answer:
            "Much more accurate than for a sun sign. The Ascendant moves about a quarter of a degree per minute of clock time, so a four-minute error shifts it a full degree and a two-hour error changes the sign outright. The Sun, by contrast, moves only about a degree per day.",
        },
        {
          question: "Why do some rising signs seem more common than others?",
          answer:
            "Because the ecliptic is tilted relative to the celestial equator, so the twelve signs cross the eastern horizon at unequal rates, and the disparity grows with latitude. Signs that rise quickly spend less time on the horizon and therefore occur less often as Ascendants. It is pure geometry, and the pattern differs by latitude.",
        },
      ],
      explore: [
        { label: "Rising sign", href: "/astrology/rising-sign", blurb: "What tradition makes of the Ascendant." },
        { label: "Houses", href: "/astrology/houses", blurb: "The structure the Ascendant anchors." },
        { label: "Reference systems", href: "/reference-systems", blurb: "Sidereal time, obliquity, and coordinate frames." },
      ],
      interpretive: true,
      keywords: ["ascendant calculation", "rising sign method", "sidereal time", "obliquity"],
    },
    {
      slug: "moon-sign-calculator",
      name: "Moon Sign Calculator",
      summary: "How the Moon's sign is determined, and when the date is enough.",
      overview:
        "Determining a Moon sign means finding the Moon's ecliptic longitude for a given instant and identifying which 30-degree division it falls in. Because the Moon moves quickly, the date is usually sufficient — but not always.",
      keyPoints: [
        "The Moon advances about 13 degrees of ecliptic longitude per day, spending just over two days per sign.",
        "For most births the date alone settles the sign; near an ingress the time decides it.",
        "Lunar ephemerides are among the most precisely validated computations in astronomy.",
        "The Moon's speed varies over its elliptical orbit, so time-in-sign is not constant.",
      ],
      body: [
        {
          heading: "The calculation",
          paragraphs: [
            "The Moon's geocentric ecliptic longitude for any instant comes from a lunar ephemeris. Dividing that longitude by 30 gives the sign, and the remainder gives the degree within it. There is no interpretive step in the arithmetic.",
            "The underlying positions are exceptionally well determined. Lunar laser ranging using retroreflectors left by Apollo and Lunokhod missions measures the Earth–Moon distance to centimetre precision, and the resulting models are correspondingly accurate. Whatever one makes of the interpretation, the position is not in doubt.",
          ],
        },
        {
          heading: "When the date alone is enough",
          paragraphs: [
            "The Moon completes a circuit of the ecliptic in about 27.3 days, advancing roughly 13 degrees per day. Each 30-degree sign therefore takes a little over two days to cross, so for most births the date determines the sign unambiguously.",
            "The exception is a birth within a few hours of an ingress. In that window the time of day decides the answer, and no lookup table can substitute for the actual ingress moment for that specific date.",
          ],
        },
        {
          heading: "Why the duration varies",
          paragraphs: [
            "The Moon's orbit is noticeably elliptical, so its angular speed changes through the month — faster near perigee, slower near apogee. Time spent in a sign consequently ranges from roughly two days to about two and a half.",
            "Additional periodic perturbations, chiefly from the Sun's gravity, modulate this further. The classical lunar theory needed to describe these motions accurately was one of the hardest problems in eighteenth-century mathematics, and solving it was central to determining longitude at sea.",
          ],
        },
        {
          heading: "Sidereal versus tropical results",
          paragraphs: [
            "The computed longitude is the same in every system; what differs is where the sign boundaries are placed. Western tropical astrology measures from the March equinox; Jyotisha measures from a star-referenced origin offset by the ayanamsa, currently about 24 degrees.",
            "The result is that the same Moon position usually falls in the previous sign under Jyotisha. Both are consistent conventions applied to one measured quantity, and a disagreement between a Western and a Vedic Moon sign is not an error in either.",
          ],
        },
      ],
      faqs: [
        {
          question: "Do I need my birth time to find my Moon sign?",
          answer:
            "Usually not. The Moon spends a little over two days in each sign, so the date alone normally settles it. The exception is a birth within a few hours of an ingress — the moment the Moon crosses into a new sign — where the time of day is decisive and the exact ingress moment for that date is required.",
        },
        {
          question: "Why does the Moon spend different amounts of time in different signs?",
          answer:
            "Because its orbit is elliptical, so it moves faster near perigee and slower near apogee. Time in a sign therefore ranges from roughly two days to about two and a half. Periodic perturbations, mainly from the Sun's gravity, modulate the motion further.",
        },
        {
          question: "How accurate are the Moon positions used?",
          answer:
            "Extremely. Lunar laser ranging off retroreflectors left by Apollo and Lunokhod missions measures the Earth–Moon distance to centimetre precision, and modern lunar ephemerides are correspondingly precise. The astronomical input to a Moon sign determination is among the best-measured quantities in the Solar System.",
        },
      ],
      explore: [
        { label: "Moon sign", href: "/astrology/moon-sign", blurb: "What tradition associates with the placement." },
        { label: "Moon phase", href: "/sky-guide/moon-phase", blurb: "The astronomy of the lunar cycle." },
        { label: "Moon readout", href: "/sky/moon", blurb: "Computed lunar position and phase." },
      ],
      interpretive: true,
      keywords: ["moon sign method", "lunar ephemeris", "ingress", "ayanamsa"],
    },
    {
      slug: "chinese-zodiac-calculator",
      name: "Chinese Zodiac Calculator",
      summary: "Finding the animal and element for a birth year, correctly.",
      overview:
        "The Chinese zodiac animal follows from the birth year in a twelve-year cycle — but the year begins at Lunar New Year, not 1 January, which is where most quick lookups go wrong. This page documents the method including that boundary.",
      keyPoints: [
        "The twelve animals cycle by year, and the year begins at Lunar New Year.",
        "Births in January and early February usually belong to the previous animal year.",
        "The full traditional cycle is sixty years, combining twelve branches with ten stems.",
        "Some traditions use the solar term Lichun rather than Lunar New Year as the boundary.",
      ],
      body: [
        {
          heading: "The method",
          list: [
            "Determine which zodiac year the birth date falls in, using Lunar New Year — not 1 January — as the boundary.",
            "The twelve animals cycle in fixed order: rat, ox, tiger, rabbit, dragon, snake, horse, goat, monkey, rooster, dog, pig.",
            "The heavenly stem for the year gives the associated phase — wood, fire, earth, metal, water — in a yang or yin form.",
            "Stem and branch together identify the year within the sixty-year sexagenary cycle, which is the complete traditional designation.",
          ],
        },
        {
          heading: "The Lunar New Year boundary",
          paragraphs: [
            "Lunar New Year falls between about 21 January and 20 February, on a date set by the lunisolar calendar — specifically, the second new Moon after the winter solstice in the usual reckoning. It therefore moves substantially from year to year.",
            "Anyone born in January or the first part of February belongs to the animal year that began the previous winter, not the one starting later that same calendar year. This single fact accounts for most incorrect answers from casual online lookups, which frequently apply a simple year-modulo calculation.",
          ],
        },
        {
          heading: "The competing Lichun convention",
          paragraphs: [
            "Some traditions, particularly within Four Pillars of Destiny practice, begin the zodiac year at the solar term Lichun rather than at Lunar New Year. Lichun falls around 4 February each year, when the Sun reaches 315 degrees of ecliptic longitude.",
            "The two conventions usually agree but can differ for births in the window between them, which in some years spans a couple of weeks. This is a genuine divergence between traditions rather than an error, and any tool that does not state which convention it uses is understating the ambiguity.",
          ],
        },
        {
          heading: "Why sixty and not twelve",
          paragraphs: [
            "The twelve earthly branches pair with ten heavenly stems. Because both cycles advance one step per year and 12 and 10 share a factor of 2, only sixty of the 120 possible pairings occur, and the pattern repeats every sixty years.",
            "This is why a year is properly described as, for instance, a wood dragon year, and why a sixtieth birthday carries particular significance in several East Asian cultures: it marks a complete return to the stem-branch combination of one's birth.",
          ],
        },
      ],
      faqs: [
        {
          question: "How do I find my Chinese zodiac animal?",
          answer:
            "From the birth year, using the twelve-year animal cycle — but with the year beginning at Lunar New Year rather than 1 January. A birth in January or early February usually belongs to the previous animal year, so the exact Lunar New Year date for that year must be checked before applying the cycle.",
        },
        {
          question: "Why do some sources give me a different animal?",
          answer:
            "Almost always because of the year boundary. A simple year-modulo lookup that assumes 1 January gives the wrong answer for anyone born in January or early February. A second, smaller source of disagreement is that some traditions use the solar term Lichun, around 4 February, rather than Lunar New Year.",
        },
        {
          question: "Why is the cycle described as sixty years?",
          answer:
            "Because the twelve earthly branches combine with ten heavenly stems, and since both advance one step per year, only sixty of the possible pairings occur before the pattern repeats. A specific stem-branch combination — a wood dragon year, for example — therefore recurs only every sixty years, even though the animal alone returns every twelve.",
        },
      ],
      explore: [
        { label: "Chinese zodiac", href: "/astrology/chinese-zodiac", blurb: "The cultural tradition in full." },
        { label: "Reference systems", href: "/reference-systems", blurb: "Lunisolar calendars and solar terms." },
        { label: "Ancient civilizations", href: "/encyclopedia/ancient-civilizations", blurb: "Chinese calendrical astronomy." },
      ],
      interpretive: true,
      keywords: ["chinese zodiac year", "animal sign", "lunar new year boundary", "sexagenary"],
    },
    {
      slug: "numerology-calculator",
      name: "Numerology Calculator",
      summary: "The reduction method behind numerology's core numbers.",
      overview:
        "Numerology derives single-digit numbers from names and dates by a fixed reduction procedure. The arithmetic is entirely mechanical and reproducible; the meanings assigned to the results are a symbolic tradition presented here as culture, not science.",
      keyPoints: [
        "The method is digit summing with repeated reduction — nothing about the arithmetic is ambiguous.",
        "The master numbers 11, 22 and 33 are conventionally left unreduced.",
        "Name-based numbers depend on which letter-to-number system is used, and systems differ.",
        "Different traditions disagree about whether to use a birth name or a current name.",
      ],
      body: [
        {
          heading: "The reduction procedure",
          paragraphs: [
            "Numerology's basic operation is to sum the digits of a number and repeat until a single digit remains. The date 17 becomes 1 + 7 = 8; the number 29 becomes 2 + 9 = 11, and 11 would normally reduce to 1 + 1 = 2.",
            "Most traditions stop at 11, 22 and sometimes 33, treating these as master numbers to be kept unreduced. The rule is a convention, and traditions that include 33 disagree with those that stop at 22 — which means the same input can yield different published results.",
          ],
        },
        {
          heading: "Name numbers and the Pythagorean grid",
          list: [
            "The most common Western system, usually called Pythagorean, maps A–I to 1–9, J–R to 1–9, and S–Z to 1–8.",
            "The expression or destiny number sums every letter of the full name and reduces.",
            "The soul urge number sums only the vowels; the personality number sums only the consonants.",
            "The Chaldean system uses a different letter-to-number mapping and omits 9, giving different results from identical names.",
            "Because Y is sometimes treated as a vowel and sometimes not, even within one system practitioners disagree about certain names.",
          ],
        },
        {
          heading: "Which name, and which spelling",
          paragraphs: [
            "Traditions differ on whether to use the full birth name as recorded, a current legal name after marriage or change, or a name someone actually goes by. Since each produces a different total, the choice determines the answer.",
            "The method is also alphabet-dependent: names written in a non-Latin script must be transliterated first, and different transliterations give different numbers. This is worth stating because it makes explicit that the result is a property of a spelling, not of a person.",
          ],
        },
        {
          heading: "How this is presented",
          paragraphs: [
            "Asteria Star documents the procedure so a reader can carry it out and reproduce any published result. The arithmetic is exact and checkable, which is more than can usually be said for material of this kind.",
            "The interpretations attached to each number are a symbolic tradition. There is no evidence that numbers derived from names or dates correspond to personality or life outcomes, and this platform does not present them as doing so.",
          ],
        },
      ],
      faqs: [
        {
          question: "How does numerological reduction work?",
          answer:
            "By summing digits and repeating until one digit remains — 17 becomes 1 + 7 = 8. Most traditions make an exception for 11, 22 and sometimes 33, which are left unreduced as master numbers. Whether 33 counts varies by tradition, so the same input can produce different published results.",
        },
        {
          question: "Why do different numerology sites give different name numbers?",
          answer:
            "Because they may use different letter-to-number mappings. The common Pythagorean system assigns values 1–9 cyclically through the alphabet; the Chaldean system uses a different mapping and omits 9 entirely. Sites also differ on whether to use a birth name or a current name, and on whether Y counts as a vowel.",
        },
        {
          question: "Is numerology scientifically supported?",
          answer:
            "No. There is no evidence that numbers derived from a name's spelling or a birth date correspond to personality traits or life outcomes. Asteria Star documents the method so it can be followed and checked, and presents the interpretations as a symbolic tradition rather than as findings.",
        },
      ],
      explore: [
        { label: "Life path method", href: "/calculators/life-path-calculator", blurb: "The date-based reduction in detail." },
        { label: "Astrology hub", href: "/astrology", blurb: "Other interpretive traditions, clearly labelled." },
      ],
      interpretive: true,
      disclaimer: NUMEROLOGY_DISCLAIMER,
      keywords: ["numerology method", "name number", "Pythagorean", "Chaldean"],
    },
    {
      slug: "life-path-calculator",
      name: "Life Path Calculator",
      summary: "The birth-date reduction, worked step by step.",
      overview:
        "The life path number is derived from a birth date by digit reduction. The procedure is simple, but there is a genuine methodological split over the order of operations that produces different answers for some dates.",
      keyPoints: [
        "Reduce month, day and year separately, then sum — this is the more widely accepted method.",
        "Summing all digits at once gives a different result for a minority of dates.",
        "Master numbers 11, 22 and sometimes 33 are held unreduced at each stage.",
        "The arithmetic is exact; the interpretation attached to the result is tradition.",
      ],
      body: [
        {
          heading: "The recommended method, worked",
          paragraphs: [
            "Take 14 November 1987. Reduce each component separately, holding master numbers. Month: 11 — a master number, held as 11. Day: 14 becomes 1 + 4 = 5. Year: 1987 becomes 1 + 9 + 8 + 7 = 25, then 2 + 5 = 7.",
            "Now sum the three results: 11 + 5 + 7 = 23, which reduces to 2 + 3 = 5. The life path number is 5. Working the same date by summing every digit at once gives 1 + 1 + 1 + 4 + 1 + 9 + 8 + 7 = 32, then 3 + 2 = 5 — the same answer here, but the two methods do not always agree.",
          ],
        },
        {
          heading: "Where the methods diverge",
          paragraphs: [
            "The disagreement arises when a component reduces to a master number that would be lost if all digits were summed at once. Reducing components separately preserves an 11 or 22 at an intermediate stage, which can change the final total.",
            "Most contemporary numerological literature favours reducing components separately for exactly this reason, and treats the all-at-once method as an oversimplification. It is a genuine methodological split within the tradition, and a tool that does not state which method it uses is hiding a real ambiguity.",
          ],
        },
        {
          heading: "Master numbers at each stage",
          list: [
            "If the month, day, or reduced year equals 11, 22 or 33, hold it unreduced before summing.",
            "If the final total is 11, 22 or 33, most traditions keep it rather than reducing to 2, 4 or 6.",
            "Whether 33 counts as a master number varies; some traditions recognise only 11 and 22.",
            "Because November is month 11, births in November are the most common case where the distinction matters.",
          ],
        },
        {
          heading: "What the number is and is not",
          paragraphs: [
            "The life path number is a deterministic function of a birth date under a stated method. Two people with the same birth date have the same number, and the calculation can be reproduced exactly by anyone.",
            "Numerological tradition assigns each number a set of themes. Those associations are cultural and symbolic, and there is no evidence that a number derived from a birth date corresponds to personality or life outcomes. Asteria Star documents the arithmetic and labels the interpretation as tradition.",
          ],
        },
      ],
      faqs: [
        {
          question: "How is the life path number calculated?",
          answer:
            "Reduce the month, day and year separately to single digits — holding 11, 22 and sometimes 33 unreduced as master numbers — then sum those three results and reduce again, again holding master numbers. For 14 November 1987: month 11, day 5, year 7, giving 23, which reduces to 5.",
        },
        {
          question: "Why do some calculators give me a different life path number?",
          answer:
            "Because of the order of operations. Reducing month, day and year separately preserves master numbers at intermediate stages; summing all digits at once does not, and the two methods disagree for some dates. Most contemporary numerological literature favours reducing components separately, and November births are the most common case where it matters.",
        },
        {
          question: "What are master numbers?",
          answer:
            "The numbers 11, 22 and — in some traditions — 33, which are conventionally left unreduced rather than being reduced to 2, 4 or 6. The convention applies both at intermediate stages and to the final total. Traditions disagree about whether 33 qualifies, which is one reason published results vary.",
        },
      ],
      explore: [
        { label: "Numerology method", href: "/calculators/numerology-calculator", blurb: "Name-based numbers and letter mappings." },
        { label: "Astrology hub", href: "/astrology", blurb: "Other interpretive traditions on the platform." },
      ],
      interpretive: true,
      disclaimer: NUMEROLOGY_DISCLAIMER,
      keywords: ["life path number", "destiny number", "numerology reduction", "master numbers"],
    },
    {
      slug: "planet-positions-calculator",
      name: "Planet Positions Calculator",
      summary: "How planetary positions are computed, and where to get real ones.",
      overview:
        "Planetary positions are computed from ephemerides — numerically integrated models of Solar System dynamics accurate enough for spacecraft navigation. This page explains how that works, what coordinate system a result is in, and where the platform publishes real computed positions.",
      keyPoints: [
        "Modern ephemerides are numerical integrations fitted to radar, spacecraft tracking, and optical observations.",
        "A position is meaningless without a stated coordinate frame and epoch.",
        "Geocentric and heliocentric positions differ, as do apparent and astrometric ones.",
        "Asteria Star publishes computed positions with a stated validity horizon, not stored guesses.",
      ],
      body: [
        {
          heading: "What an ephemeris actually is",
          paragraphs: [
            "A modern planetary ephemeris is a numerical integration of the equations of motion for the Solar System, fitted to observations — radar ranging to planets, tracking of spacecraft, lunar laser ranging, and optical astrometry. JPL's Development Ephemeris series is the most widely used, and its solutions are what interplanetary navigation depends on.",
            "The output is not a formula but a set of interpolable coefficients covering a time span. Software evaluates those to obtain positions and velocities for any instant within the span, to accuracies far exceeding anything a naked-eye or classical-theory approach could achieve.",
          ],
        },
        {
          heading: "A position needs a frame and an epoch",
          list: [
            "Heliocentric versus geocentric: measured from the Sun's centre or from Earth's. Astrology and observational astronomy use geocentric; orbital dynamics uses heliocentric.",
            "Ecliptic versus equatorial coordinates: longitude and latitude referenced to Earth's orbital plane, or right ascension and declination referenced to the celestial equator.",
            "Epoch: coordinates are quoted relative to a reference frame at a specific date, conventionally J2000.0, because precession moves the frame.",
            "Apparent versus astrometric: apparent positions include light-travel time, aberration and refraction; astrometric positions do not. The difference is small but real.",
            "A stated planetary position without these qualifiers is incompletely specified, whatever its decimal places suggest.",
          ],
        },
        {
          heading: "Rise and set times need more",
          paragraphs: [
            "Converting a position into a rise or set time requires the observer's latitude, longitude and elevation, plus a convention for atmospheric refraction near the horizon — which is variable and depends on temperature and pressure.",
            "Standard practice uses a nominal refraction value, which is why published rise and set times carry an inherent uncertainty of a minute or so under unusual atmospheric conditions. Reporting such a time to the second overstates what the calculation can support.",
          ],
        },
        {
          heading: "Where the platform's real numbers are",
          paragraphs: [
            "Asteria Star computes solar and lunar positions, twilight boundaries and planetary visibility from published algorithms, and publishes each with an explicit validity horizon, so a reading is never presented as more current than it is. Those pages sit under the sky section.",
            "The platform also catalogues thirty executable scientific calculators covering orbital, stellar, observational, exoplanet, cosmological and instrumental quantities, each with its formula, inputs and provenance recorded. Where a value is derived rather than measured, that distinction is preserved in the record.",
          ],
        },
      ],
      faqs: [
        {
          question: "How are planetary positions calculated?",
          answer:
            "From an ephemeris — a numerical integration of Solar System dynamics fitted to radar ranging, spacecraft tracking, lunar laser ranging and optical astrometry. JPL's Development Ephemeris series is the standard, and it is what interplanetary navigation relies on. Software evaluates its interpolation coefficients to get a position for any instant in range.",
        },
        {
          question: "Why do I need to know the coordinate system?",
          answer:
            "Because a position is meaningless without one. Heliocentric and geocentric coordinates differ, ecliptic and equatorial frames differ, and coordinates are referenced to an epoch such as J2000.0 because precession moves the frame. Apparent positions also include light-travel time and aberration, while astrometric ones do not.",
        },
        {
          question: "Why are rise and set times only accurate to about a minute?",
          answer:
            "Because atmospheric refraction near the horizon depends on temperature and pressure and cannot be known in advance. Standard calculations use a nominal refraction value, which introduces an uncertainty of roughly a minute under unusual conditions. Quoting such times to the second implies precision the method does not have.",
        },
      ],
      explore: [
        { label: "Scientific calculators", href: "/calculators", blurb: "Thirty executable calculators with formulae and provenance." },
        { label: "Planet visibility", href: "/sky/planet-visibility", blurb: "Computed positions with validity horizons." },
        { label: "Celestial mechanics", href: "/celestial-mechanics", blurb: "Orbital elements and reference frames." },
      ],
      sources: ["jpl", "usno", "nasa"],
      keywords: ["planet positions", "ephemeris", "JPL DE", "coordinate frame", "J2000"],
    },
    {
      slug: "compatibility-calculator",
      name: "Compatibility Calculator",
      summary: "How sign-pair compatibility tables are constructed.",
      overview:
        "Compatibility tables are generated from a small set of rules about elements, modalities and the angular distance between signs. This page documents those rules so any published table can be checked, and states what the evidence shows.",
      keyPoints: [
        "Sign-pair compatibility follows mechanically from element and angular relationship — no ephemeris is involved.",
        "The whole scheme depends only on two birth dates reduced to Sun signs.",
        "The tradition's own method is full-chart synastry, not sign matching.",
        "Studies using large relationship datasets have found no sign-based effect.",
      ],
      body: [
        {
          heading: "The rules that generate a table",
          list: [
            "Signs of the same element (120 degrees apart, forming a trine) — traditionally read as harmonious.",
            "Fire with air, and earth with water (60 degrees apart, a sextile) — traditionally read as complementary.",
            "Signs 90 degrees apart (a square) — traditionally read as friction.",
            "Signs 180 degrees apart (an opposition) — traditionally read as polarity or complementary tension.",
            "Adjacent signs, 30 degrees apart (a semisextile) — traditionally read as having little in common.",
            "Applying these five rules to all 78 unordered sign pairs reproduces essentially any published compatibility table.",
          ],
        },
        {
          heading: "Why the tables all look the same",
          paragraphs: [
            "Because they are generated from the same rules. Once the element and modality scheme is fixed, the angular relationship between any two signs follows automatically, and so does the traditional reading. There is no additional information in one compatibility chart compared with another.",
            "This is worth knowing when evaluating any site that presents such a table as a result. It is a lookup produced by five rules, not a calculation over data — and it uses only the Sun's sign, discarding every other placement.",
          ],
        },
        {
          heading: "What the tradition actually prescribes",
          paragraphs: [
            "Traditional astrological practice compares complete charts. Synastry examines aspects between one person's planets and the other's, house overlays showing where each person's planets fall in the other's chart, and the relationship between the two Ascendants. Composite and Davison charts add further constructions.",
            "Sun-sign compatibility is a twentieth-century popular simplification, and practitioners within the tradition are often its sharpest critics. Presenting it as what astrology says misrepresents the tradition as well as overstating the claim.",
          ],
        },
        {
          heading: "The evidence",
          paragraphs: [
            "Large-scale analyses of marriage and relationship records have tested for correlations between partners' sun signs and relationship formation or duration, and found nothing distinguishable from chance. The datasets used were large enough that an effect of the size popular compatibility claims imply would have been detectable.",
            "Asteria Star documents how the tables are built and states that finding alongside them. The material is presented as a description of a tradition, not as guidance for decisions about relationships.",
          ],
        },
      ],
      faqs: [
        {
          question: "How are zodiac compatibility tables generated?",
          answer:
            "From five rules about the angular distance between signs: same element and 120 degrees apart is read as harmonious, 60 degrees as complementary, 90 as friction, 180 as polarity, and 30 as having little in common. Applying those to all sign pairs reproduces essentially any published table. No ephemeris or chart data is involved.",
        },
        {
          question: "Is sun-sign compatibility what astrologers actually use?",
          answer:
            "No. The tradition's own method is synastry — comparing two complete charts through inter-chart aspects, house overlays and the relationship between the Ascendants. Sun-sign matching is a twentieth-century popular simplification, and practitioners within the tradition are frequently its sharpest critics.",
        },
        {
          question: "Is there evidence for astrological compatibility?",
          answer:
            "No. Large analyses of marriage and relationship records have looked for correlations between partners' sun signs and relationship formation or duration and found nothing beyond chance. The samples were large enough that an effect of the claimed magnitude would have been visible.",
        },
      ],
      explore: [
        { label: "Compatibility", href: "/astrology/compatibility", blurb: "The tradition and its limitations." },
        { label: "Synastry", href: "/astrology/synastry", blurb: "The full-chart method." },
        { label: "Aspects", href: "/astrology/aspects", blurb: "The angular relationships behind the rules." },
      ],
      interpretive: true,
      keywords: ["zodiac compatibility table", "love match", "element pairings"],
    },
    {
      slug: "synastry-calculator",
      name: "Synastry Calculator",
      summary: "What comparing two charts computationally involves.",
      overview:
        "Synastry comparison is a mechanical procedure once two charts exist: build a grid of angular separations between every pair of planets, then determine house overlays. This page documents the computation and what data it needs.",
      keyPoints: [
        "The inter-aspect grid is a matrix of angular separations — pure arithmetic on two sets of longitudes.",
        "Orb choice determines which cells count as aspects, and orbs are not standardised.",
        "House overlays require accurate birth times for both people.",
        "A composite chart is midpoint arithmetic; a Davison chart is a real chart for a midpoint moment.",
      ],
      body: [
        {
          heading: "Building the inter-aspect grid",
          paragraphs: [
            "With two charts computed, the comparison is a matrix. For each planet in chart A and each in chart B, take the difference in ecliptic longitude, normalise it to the range 0–180 degrees, and check whether it falls within an allowed orb of a recognised aspect angle.",
            "For the classical seven bodies this is a 7-by-7 grid of 49 comparisons; including the outer planets and chart angles expands it considerably. Every cell is a straightforward subtraction — the computation involves no judgement at all.",
          ],
        },
        {
          heading: "Orb choice decides the output",
          paragraphs: [
            "Which cells count as aspects depends entirely on the orbs used, and orbs are not standardised. A practitioner allowing 8 degrees for major aspects will find substantially more inter-chart aspects than one allowing 4.",
            "Traditions also vary orbs by body — commonly wider for the Sun and Moon — and by aspect type. Two tools applying different orb schemes to identical charts produce different aspect lists, so an aspect grid is only interpretable alongside the orb table used to generate it.",
          ],
        },
        {
          heading: "House overlays need both birth times",
          paragraphs: [
            "The overlay component places each person's planets into the other's house structure. Because houses derive from the Ascendant and Midheaven, which depend on birth time and place, this cannot be done without accurate times for both people.",
            "Inter-chart aspects between slow-moving planets can be computed approximately from dates alone, since those bodies move little in a day. Aspects involving the Moon cannot, as it moves about 13 degrees daily. Any tool producing a full synastry reading from two dates alone is computing far less than it appears to.",
          ],
        },
        {
          heading: "Composite and Davison constructions",
          paragraphs: [
            "A composite chart takes the midpoint of each pair of corresponding planetary longitudes. The arithmetic has a subtlety: on a circle there are two midpoints between any two points, and which one to use is a convention that different software resolves differently — a real source of divergence between tools.",
            "A Davison chart avoids this by taking the midpoint in time and in geographic space between the two births and casting a normal chart for that moment and place. Unlike a composite it corresponds to an actual instant, so its positions are genuine ephemeris values rather than averages.",
          ],
        },
      ],
      faqs: [
        {
          question: "What does a synastry calculation involve?",
          answer:
            "Building a grid of angular separations between every planet in one chart and every planet in the other, then checking which separations fall within an allowed orb of a recognised aspect angle. It is straightforward arithmetic on two sets of ecliptic longitudes, followed by determining where each person's planets fall in the other's houses.",
        },
        {
          question: "Why do synastry tools give different aspect lists?",
          answer:
            "Because orbs are not standardised. A practitioner allowing 8 degrees for major aspects finds considerably more inter-chart aspects than one allowing 4, and traditions also vary orbs by body and by aspect type. An aspect grid is only meaningful alongside the orb table used to produce it.",
        },
        {
          question: "Can synastry be done without birth times?",
          answer:
            "Only partially. Aspects between slow-moving planets can be approximated from dates alone, but anything involving the Moon cannot, since it moves about 13 degrees per day. House overlays and Ascendant relationships are impossible without accurate times for both people, and those are a substantial part of the technique.",
        },
      ],
      explore: [
        { label: "Synastry", href: "/astrology/synastry", blurb: "What the technique means in the tradition." },
        { label: "Aspects", href: "/astrology/aspects", blurb: "Aspect angles and the orb problem." },
        { label: "Natal chart method", href: "/calculators/natal-chart-calculator", blurb: "How each chart is computed first." },
      ],
      interpretive: true,
      keywords: ["synastry grid", "relationship chart", "composite midpoint", "orbs"],
    },
    {
      slug: "solar-return-calculator",
      name: "Solar Return Calculator",
      summary: "Finding the exact moment of solar return, and what it depends on.",
      overview:
        "A solar return is the instant the Sun regains its natal ecliptic longitude. Finding it is a root-finding problem on an ephemeris — precisely solvable — but the chart drawn for that instant depends on a location choice the tradition does not settle.",
      keyPoints: [
        "The return moment is found by solving for when solar longitude equals the natal value.",
        "It drifts about six hours later each year and resets at leap days.",
        "The chart's houses depend on which location is used, and practitioners disagree.",
        "The same arithmetic gives lunar returns and returns for any other body.",
      ],
      body: [
        {
          heading: "Finding the return instant",
          paragraphs: [
            "The natal Sun's ecliptic longitude is a fixed number. Finding the solar return means solving for the time at which the Sun's longitude equals that value again — a root-finding problem, normally handled by iterating on an ephemeris until the difference falls below a tolerance.",
            "The Sun moves about one degree per day, so the longitude changes fast enough that the solution converges quickly and is well conditioned. The answer is exact to within the ephemeris precision, which is far finer than any interpretive use requires.",
          ],
        },
        {
          heading: "Why it drifts against the calendar",
          paragraphs: [
            "The tropical year is about 365.2422 days. The civil calendar uses whole days with leap-day corrections, so the return instant falls roughly six hours later each year and jumps back by nearly a day when a leap day intervenes.",
            "Over a four-year cycle the return therefore migrates across roughly a day of calendar time, which is why it can fall on the day before or after a birthday and at a very different clock time each year.",
          ],
        },
        {
          heading: "The location problem",
          paragraphs: [
            "Once the instant is known, the chart requires a location to compute the Ascendant and houses. Practitioners disagree about whether to use the birthplace, the current residence, or the person's actual location at the return moment.",
            "The choice materially changes the chart, since the Ascendant advances roughly a degree every four minutes and the whole house structure follows it. This has produced the practice of relocating for a solar return, and whether that is meaningful is disputed within the tradition. It is a clear example of an interpretive framework generating a question that no computation can settle.",
          ],
        },
        {
          heading: "Returns for other bodies",
          paragraphs: [
            "The same root-finding applies to any body. A lunar return recurs about every 27.3 days, so the arithmetic is identical but the solution is found more often and the convergence is faster because the Moon moves about 13 degrees per day.",
            "Planetary returns follow the body's orbital period: a Jupiter return roughly every twelve years, a Saturn return roughly every 29.5. Those intervals are genuine orbital facts, independent of any interpretation placed on them.",
          ],
        },
      ],
      faqs: [
        {
          question: "How is the solar return moment calculated?",
          answer:
            "By solving for the instant when the Sun's ecliptic longitude equals its natal value — a root-finding problem, normally handled by iterating on an ephemeris until the difference is below tolerance. Because the Sun moves about a degree per day, the solution converges quickly and is precise to well within any interpretive requirement.",
        },
        {
          question: "Why does my solar return fall on a different date each year?",
          answer:
            "Because the tropical year is about 365.2422 days rather than a whole number. The calendar absorbs the fraction with leap days, so the return instant drifts roughly six hours later each year and jumps back when a leap day occurs — migrating across about a day of calendar time over the four-year cycle.",
        },
        {
          question: "Which location should a solar return chart use?",
          answer:
            "There is no agreed answer. Practitioners variously use the birthplace, the current residence, or wherever the person actually is at the return moment, and the choice changes the Ascendant and every house cusp. It is a convention within an interpretive framework, and no computation can resolve it.",
        },
      ],
      explore: [
        { label: "Solar return", href: "/astrology/solar-return", blurb: "What the tradition makes of the chart." },
        { label: "Celestial events", href: "/sky-guide/celestial-events", blurb: "Tropical years, equinoxes, and orbital returns." },
        { label: "Scientific calculators", href: "/calculators", blurb: "Executable orbital-period calculators." },
      ],
      interpretive: true,
      keywords: ["solar return moment", "tropical year", "return chart location", "Saturn return"],
    },
    {
      slug: "physics",
      name: "Physics & Fun Calculators",
      summary: "Science-based calculators: your age and weight on other worlds.",
      overview:
        "Physics-based tools that recast familiar questions using real planetary data — how old you would be on Mars, what you would weigh on Europa. Each rests on published orbital periods and surface gravities, and each is arithmetic you can check yourself.",
      keyPoints: [
        "Age on another planet is your age in Earth years divided by that planet's orbital period in Earth years.",
        "Weight scales directly with surface gravity; mass does not change at all.",
        "Every input value on this platform is a catalogued measurement with a recorded source.",
        "These are science, not astrology, and they sit in a different part of the platform for that reason.",
      ],
      body: [
        {
          heading: "Age on other worlds",
          paragraphs: [
            "A year is one orbit. Mars takes about 1.88 Earth years to orbit the Sun, so an age in Martian years is an Earth age divided by 1.88 — someone aged 30 on Earth is about 16 in Martian years. Mercury, at about 0.24 Earth years per orbit, gives the opposite result: that same person would be roughly 125.",
            "The arithmetic is trivial; the value is in what it makes concrete. Neptune's orbital period is about 165 Earth years, which means no human has ever lived a Neptunian year and Neptune has completed barely one orbit since its discovery in 1846.",
          ],
        },
        {
          heading: "Weight versus mass",
          paragraphs: [
            "Mass is the amount of matter in an object and does not change with location. Weight is the force gravity exerts on that mass, so it scales directly with local surface gravity. On the Moon, where surface gravity is about 16.5 percent of Earth's, a person weighs about a sixth as much while their mass is unchanged.",
            "Surface gravity depends on both mass and radius: it is proportional to mass divided by radius squared. This is why Mars, with about a tenth of Earth's mass, has roughly 38 percent of its surface gravity rather than a tenth — its smaller radius partly compensates.",
          ],
        },
        {
          heading: "A few results worth knowing",
          list: [
            "Mars surface gravity is about 38 percent of Earth's; the Moon's is about 16.5 percent.",
            "Jupiter has no solid surface, so quoted 'surface gravity' refers to a defined pressure level in its atmosphere — about 2.5 times Earth's.",
            "Venus, despite being close to Earth in mass and radius, has surface gravity around 90 percent of Earth's.",
            "Pluto's surface gravity is around 6 percent of Earth's — a 70-kilogram person would weigh about the same as 4 kilograms does on Earth.",
            "A day is a separate matter from a year: Venus rotates so slowly that its rotation period exceeds its orbital period.",
          ],
        },
        {
          heading: "The platform's executable calculators",
          paragraphs: [
            "Beyond these illustrative cases, Asteria Star catalogues thirty working scientific calculators covering orbital, stellar, observational, exoplanet, cosmological and instrumental quantities — escape velocity, orbital period, distance modulus, angular resolution, equilibrium temperature and others.",
            "Each records its formula, its inputs, and the provenance of the constants it uses, and each is evaluated rather than described. Where a published value on an entity page is derived rather than measured, the derivation is registered with its formula and assumptions so the distinction is never lost.",
          ],
        },
      ],
      faqs: [
        {
          question: "How do I calculate my age on another planet?",
          answer:
            "Divide your age in Earth years by that planet's orbital period expressed in Earth years. Mars takes about 1.88 Earth years per orbit, so a 30-year-old is about 16 in Martian years. Mercury takes about 0.24, so the same person would be roughly 125.",
        },
        {
          question: "Why would I weigh less on Mars but have the same mass?",
          answer:
            "Because mass and weight are different quantities. Mass is how much matter you contain and does not change with location. Weight is the gravitational force on that mass, so it scales with local surface gravity — about 38 percent of Earth's on Mars. Your mass is identical in both places.",
        },
        {
          question: "Why doesn't Mars have a tenth of Earth's gravity if it has a tenth of the mass?",
          answer:
            "Because surface gravity depends on radius as well as mass — it is proportional to mass divided by radius squared. Mars is substantially smaller than Earth, so its surface sits closer to its centre of mass, which partly compensates for the lower mass and leaves surface gravity at around 38 percent rather than 10 percent.",
        },
        {
          question: "Does Asteria Star have working calculators?",
          answer:
            "Yes — thirty of them, covering orbital, stellar, observational, exoplanet, cosmological and instrumental quantities. Each is executable, records its formula and inputs, and carries provenance for the constants it uses. They are catalogued under the calculators hub.",
        },
      ],
      explore: [
        { label: "Scientific calculators", href: "/calculators", blurb: "The thirty executable calculators, with formulae." },
        { label: "Solar System", href: "/solar-system", blurb: "The measured masses, radii, and periods used here." },
        { label: "Physics basics", href: "/encyclopedia/physics-basics", blurb: "Gravity, orbits, and the underlying principles." },
      ],
      sources: ["nasa", "jpl"],
      keywords: ["age on other planets", "weight on other planets", "surface gravity", "space calculators"],
    },
  ],
};
