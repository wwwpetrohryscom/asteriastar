# Wave A — Adversarial Review Record

_Phase 13 review of the 93 rewritten category pages. Seven independent finder
dimensions, then one adversarial verifier per finding whose standing instruction
was to **refute** — defaulting to refuted when uncertain, and rejecting outright
any finding whose quoted text did not appear verbatim in the file. Only findings
that survived verification were fixed._

## Outcome

| Metric | Count |
| --- | ---: |
| Review agents run | 74 |
| Raw findings raised | 67 |
| **CONFIRMED and fixed** | **44** |
| Rejected as false positives | 23 |
| Confirmation rate | 66% |

Verification was not a formality: roughly one finding in three did not survive it.

## Confirmed findings by dimension

| Dimension | Confirmed |
| --- | ---: |
| `readability` | 14 |
| `history` | 9 |
| `?` | 9 |
| `sources` | 5 |
| `duplication` | 5 |
| `science` | 2 |

## Representative corrections applied

| Where | What was wrong |
| --- | --- |
| astronomy/comets | "a comet moving outward after perihelion leads with its **nucleus**" — backwards, and self-contradictory with the same sentence's "it travels tail-first". Both tails are anti-sunward, so an outbound comet leads with its tail. |
| astronomy/comets | A coma of "hundreds of thousands of kilometres" was called "larger than the Sun". The Sun is ~1.39 million km across, so that fails by its own comparison. |
| astronomy/star-clusters | The Hyades was described as young and blue-white with hot massive stars. It is ~600–800 Myr old with an A-star turn-off and orange giants; its massive stars are long gone. |
| astronomy/black-holes, guides/how-black-holes-work | Sgr A*'s horizon was called "roughly the size of Mercury's orbit". It is ~12 million km in radius against Mercury's ~58 million km — nearly five times smaller. |
| guides/how-black-holes-work | "about 30 km across in radius" — an editing artefact that parses as neither a diameter nor a radius. |
| astronomy/planets | "No eighth-planet-class body has been found" — Neptune *is* the eighth planet; a body beyond it would be the ninth. |
| astronomy/pulsars | The 1974 Nobel was described only as going to "Bell Burnell's supervisor and a colleague". Hewish and Ryle are now named, with their separate citations. |
| encyclopedia/history-of-astronomy ×3 | The phases of Venus were listed as content of *Sidereus Nuncius*. Galileo observed them later in 1610 and published them in 1613. |
| encyclopedia/history-of-astronomy | "Predictive astronomy predates explanatory astronomy by well over a thousand years" — the real gap is centuries, not millennia. |
| encyclopedia/ancient-civilizations ×3 | The seven-day week named for the planets was attributed to Mesopotamia. Seven-day periodicity has Mesopotamian precedent, but the planetary day-naming is Hellenistic. |
| encyclopedia/ancient-civilizations | Eratosthenes' result was said to be "within a few percent" of the modern figure. That depends entirely on the unknown length of his stadion — 1% or 16% depending which. |
| encyclopedia/ancient-civilizations | The Shoushi calendar's tropical year was "accurate to within seconds". It is 365.2425 days — about 26 seconds off. |
| encyclopedia/ancient-civilizations | A heading read "Four different things 'astronomy' meant" above a list of five. |
| encyclopedia/egyptian-mythology ×2 | "Twelve decans are visible during a typical night" contradicted the same paragraph's "a new decan rose roughly every 40 minutes", which gives eighteen. Twelve is the count in *full darkness*. |
| encyclopedia/greek-mythology, astronomy/constellations | Southern constellations were credited to "sixteenth- and seventeenth-century voyages", omitting Lacaille's fourteen from the Cape in 1751–52. |
| encyclopedia/famous-astronomers | The magnitude scale was flatly attributed to Hipparchus. The attribution is traditional; it is first attested in Ptolemy. |
| encyclopedia/timeline ×2 | The Antikythera mechanism broke the list's strict chronological order; Ulugh Beg's catalogue was called the most accurate pre-telescopic work, contradicting the same file on Tycho. |
| sky-guide/solar-eclipses | Heading "The three types" above a four-item list (total, annular, partial, hybrid). |
| sky-guide/meteor-showers | The post-midnight rate rise was explained by Earth's orbital motion rather than by rotation carrying the observer onto the leading hemisphere. |
| astrology/moon-sign ×4 | "changing sign every two to three days" contradicted "just over two days" on the same page. The real range is ~1.96–2.55 days. |
| astrology/houses | The twelve houses were listed paired 1/6, 2/7, 3/8 … — neither numerical nor the opposition-axis convention, so it read as a scramble. |
| astrology/chinese-zodiac | "not the one that starts later that month" presupposes a January new year; Lunar New Year falls in February in about two-thirds of years. |
| calculators/compatibility-calculator ×3 | "these five rules … all 78 unordered sign pairs" — five rules cover only 54 pairs. The conjunction and quincunx cases were missing. |
| observatory/3d-solar-system | A key point said Neptune would be "over a kilometre away" while the body and FAQ both said "hundreds of metres". |
| observatory/james-webb | A key point stated Webb's 6.5 m mirror that no body section supported — the types.ts contract requires key points the body backs. |
| observatory/esa-image-archive | "replaced the previous distance foundation … by four orders of magnitude" is not a valid construction — *replace* takes a replacing entity, not a differential. |
| astronomy/galaxies | A key point about the 1923–24 Cepheid result had no supporting body text anywhere in the topic. |
| astronomy/black-holes | Five multi-word spans of 10–16 words were shared verbatim with the black-holes guide. The topic page was reframed around what the catalogue holds; the guide keeps the explainer. |

## Rejected false positives

Recorded rather than discarded, because a reviewer being wrong is itself a signal
about where content reads as if it were wrong.

| Dimension | Target | Why the verifier rejected it |
| --- | --- | --- |
| `boundary` | astrology/synastry | Quote is verbatim at /Users/agent/asteriastar/src/lib/content/sections/astrology.ts:913. The finding fails on four independent grounds.  (1) The cited rule does not exist; the repo's actual … |
| `boundary` | calculators/compatibility-calculator | Quote exists verbatim at src/lib/content/sections/calculators.ts:646. The finding fails on four independent grounds. (1) The "fourth restatement" count is inflated: line 628 ("Asteria Star d… |
| `boundary` | astrology/compatibility | The quote is verbatim at /Users/agent/asteriastar/src/lib/content/sections/astrology.ts:864. Everything else in the finding fails.  1) THE CITED RULE DOES NOT EXIST. /Users/agent/asteriastar… |
| `boundary` | calculators/numerology-calculator | Quote verified verbatim at src/lib/content/sections/calculators.ts:436. The finding is refuted on four independent grounds.  (1) NOT AN ERROR — every clause in the sentence is factually accu… |
| `boundary` | astrology/natal-chart | Quote verified verbatim at src/lib/content/sections/astrology.ts:223. Refuted on four independent grounds.  (1) The cited rule does not say what the reviewer claims. The file's editorial-rul… |
| `boundary` | guides/how-to-read-a-birth-chart | Quote verified verbatim at src/lib/content/sections/guides.ts:576. The finding still fails on four independent grounds.  (1) The FAQ is machine-syndicated, so it MUST be self-contained. src/… |
| `boundary` | calculators/life-path-calculator | The quote is verbatim at calculators.ts:487, but the finding does not survive scrutiny. (1) It is not a restatement of the preceding sentence: the predecessor asserts a fact about the world … |
| `readability` | encyclopedia/egyptian-mythology | Quote found verbatim at line 565. The finding fails on four independent grounds. (1) The 40-minute figure is exactly right and is not a loose approximation: 36 decans spread around a siderea… |
| `readability` | calculators/zodiac-sign-calculator | Quote is verbatim at src/lib/content/sections/calculators.ts:117. The finding raises no factual error — all twelve ranges are the correct conventional tropical sun-sign dates (Aries 21 Mar–1… |
| `sources` | encyclopedia/babylonian-astronomy | Quote verified verbatim at encyclopedia.ts:626 (FAQ restatement at :674). Refuted on four independent grounds.  1) THE FACT IS CORRECT. Babylonian eclipse records are genuinely used in moder… |
| `sources` | calculators/compatibility-calculator | Quote confirmed verbatim at /Users/agent/asteriastar/src/lib/content/sections/calculators.ts:627 (near-duplicate FAQ phrasing at :646). The finding still fails on four independent grounds.  … |
| `sources` | astrology/chinese-zodiac | Quote verified verbatim at src/lib/content/sections/astrology.ts:973 (chinese-zodiac, body → "Cultural role"). Refuted on five independent grounds.  (1) THE FACT IS CORRECT. Zodiac-driven bi… |
| `sources` | astrology/compatibility | Quote is verbatim at /Users/agent/asteriastar/src/lib/content/sections/astrology.ts:845. It survives nothing else.  1) THE REVIEWER INVERTED THE PLATFORM'S OWN CONVENTION. The rule is codifi… |
| `sources` | calculators/moon-sign-calculator | Quote verified verbatim at src/lib/content/sections/calculators.ts:258 (and restated in the FAQ at :297). But the finding is wrong on both the fact and the consistency argument.  1) THE FACT… |
| `history` | encyclopedia/glossary | Quote verified verbatim at /Users/agent/asteriastar/src/lib/content/sections/encyclopedia.ts:86 (glossary FAQ "Why are brighter stars given smaller magnitude numbers?"). The finding still fa… |
| `duplication` | calculators/zodiac-sign-calculator | Quote verified verbatim at line 142 of src/lib/content/sections/calculators.ts. The finding's premise is factually wrong: the two figures are DIFFERENT quantities with different zero epochs,… |
| `duplication` | astrology/western-astrology | Quote confirmed verbatim at line 1025. But the finding's core premise is false: the ~30 degrees and the ~24 degrees are NOT the same quantity. (1) Line 1025 states the offset between a tropi… |
| `duplication` | astrology/zodiac-signs | Quote verified verbatim at /Users/agent/asteriastar/src/lib/content/sections/astrology.ts:63 (zodiac-signs, body section "Signs are not constellations"). The finding is refuted on three inde… |
| `duplication` | guides/how-to-read-a-birth-chart | The quote is real (guides.ts:569, identical to astrology.ts:84), but the finding fails on every substantive test.  1. NO FACTUAL ERROR. The guides answer ("In Western tropical astrology, no.… |
| `duplication` | calculators/moon-sign-calculator | The quote is verbatim at /Users/agent/asteriastar/src/lib/content/sections/calculators.ts:285 and /Users/agent/asteriastar/src/lib/content/sections/astrology.ts:368, and both pages do emit F… |
| `duplication` | calculators/compatibility-calculator | Quote verified at /Users/agent/asteriastar/src/lib/content/sections/calculators.ts:627 (first sentence of the "The evidence" paragraph), and the astrology.ts:845 counterpart is real, so the … |
| `duplication` | astronomy/comets | Quote confirmed verbatim at /Users/agent/asteriastar/src/lib/content/sections/astronomy.ts:795 (and the sibling at :879). The finding still fails on three independent grounds.  1) The origin… |
| `duplication` | guides/how-stars-form | Quote verified verbatim at guides.ts:232 and astronomy.ts:102 (and the other two claimed pairs at calculators.ts:95/579 and observatory.ts:722/793). The finding still fails on four independe… |

### The three most instructive rejections

- **"30° vs 24° precession contradiction"** — raised three separate times by the
  duplication reviewer, refuted every time. They are different quantities: ~30° is
  the drift of the March equinox against the stars over two millennia; ~24° is the
  current Lahiri ayanamsa between the tropical and sidereal zodiacs. Both figures
  are correct, and the pages already distinguish them.
- **`explore` links repeated across categories** — refuted. `types.ts` documents the
  field as curated onward navigation, so the same catalogue hub appearing under
  several related topics is the design, not template spam.
- **Shared FAQ questions between a guide and its topic page** — refuted where the
  answers differ in depth and framing. Two pages may legitimately answer the same
  reader question at different levels.
