import type { Section } from "@/lib/content/types";

/**
 * Astronomy — the scientific, evidence-based hub.
 *
 * Each category publishes a real editorial explainer: what the class of object
 * is, how it is classified, how it is measured, and where the current
 * uncertainty lies. The catalogue hubs (/stars, /galaxies, /deep-sky, …) hold
 * the per-object records with field-level provenance; these pages hold the
 * physics that makes those records legible.
 *
 * Numeric claims are restricted to well-established, stable values. Where a
 * count changes with every survey release (confirmed exoplanets, known moons)
 * the text points at the live catalogue rather than freezing a number that
 * would silently go stale.
 */
export const astronomy: Section = {
  slug: "astronomy",
  name: "Astronomy",
  kind: "science",
  accent: "nebula",
  tagline: "The universe, studied with evidence.",
  description:
    "Explore stars, galaxies, planets, and the objects that fill the universe — explained with scientific accuracy and built to cite authoritative sources.",
  intro:
    "Astronomy on Asteria Star is the science of everything beyond Earth: the objects that fill the cosmos, how they form and change, and how we study them. Each topic below is a gateway to structured, source-backed reference material. We describe what is well established and clearly separate it from interpretation.",
  categories: [
    {
      slug: "stars",
      name: "Stars",
      summary: "Luminous spheres of plasma powered by nuclear fusion.",
      overview:
        "Stars are luminous spheres of plasma held together by their own gravity, generating energy through nuclear fusion in their cores. Their mass largely determines how they live, how they shine, and how they end.",
      keyPoints: [
        "Mass at birth is the single variable that most strongly determines a star's luminosity, colour, lifetime and final state.",
        "The Sun is a fairly ordinary star, but it is more massive than roughly nine out of ten stars in the Galaxy.",
        "A star spends about 90 percent of its life on the main sequence, fusing hydrogen in its core.",
        "The heavier chemical elements in your body were assembled inside earlier generations of stars.",
      ],
      body: [
        {
          heading: "What makes something a star",
          paragraphs: [
            "A star is a self-gravitating ball of plasma hot and dense enough at its centre to sustain nuclear fusion. That condition sets a lower mass limit: below roughly 0.08 solar masses an object cannot reach the core temperature needed for sustained hydrogen fusion and becomes a brown dwarf instead, radiating leftover heat and slowly cooling.",
            "Stability comes from a balance called hydrostatic equilibrium. Outward pressure from hot gas and radiation exactly counters the inward pull of gravity at every depth. If fusion falters, the core contracts and heats, which raises the fusion rate again — a self-regulating loop that keeps ordinary stars remarkably steady over billions of years.",
          ],
        },
        {
          heading: "Classification: the spectral sequence",
          paragraphs: [
            "Stars are classified by the absorption lines in their spectra, which depend chiefly on surface temperature. The sequence runs O, B, A, F, G, K, M from hottest to coolest, each divided into ten subdivisions, with a Roman-numeral luminosity class distinguishing supergiants, giants and main-sequence dwarfs.",
            "The scheme was established at Harvard in the early twentieth century — Annie Jump Cannon classified several hundred thousand spectra — and the apparently arbitrary letter ordering is a historical artefact of an earlier alphabetical scheme that was reordered once temperature was understood to be the controlling variable. The Sun is a G2V star; Rigel is B8Ia; Betelgeuse is M1-2Ia-ab.",
          ],
        },
        {
          heading: "The Hertzsprung–Russell diagram",
          paragraphs: [
            "Plotting luminosity against temperature for a population of stars does not produce a scatter. Most stars fall along a diagonal band — the main sequence — with distinct groups of giants above it and white dwarfs below. This structure, discovered independently by Ejnar Hertzsprung and Henry Norris Russell around 1910, is the single most informative diagram in stellar astronomy.",
            "The main sequence is not an evolutionary track but a mass sequence: a star's position along it is set by its mass, and it stays roughly in place while core hydrogen lasts. Because a cluster's stars share an age, the point at which its members turn off the main sequence gives the cluster's age directly.",
          ],
        },
        {
          heading: "Mass decides everything",
          list: [
            "Massive stars are enormously more luminous than low-mass ones — luminosity rises steeply with mass — so they exhaust their fuel far faster despite having more of it.",
            "A star of around one solar mass spends roughly ten billion years on the main sequence; a star of twenty solar masses lasts only a few million.",
            "Low-mass M dwarfs are so frugal that none formed since the Big Bang has yet left the main sequence. They are also the most common type of star by a wide margin.",
            "Endpoint follows mass: below about eight solar masses a star ends as a white dwarf; above that, core collapse produces a neutron star or a black hole.",
          ],
        },
        {
          heading: "Where the elements come from",
          paragraphs: [
            "Fusion in stellar cores builds helium from hydrogen, then in more massive stars progressively heavier nuclei up to iron. Beyond iron, fusion consumes rather than releases energy, so heavier elements form by neutron capture — slowly in evolved giant stars, rapidly in explosive environments including neutron-star mergers, which observations of the 2017 event GW170817 confirmed as a site of heavy-element production.",
            "Stellar winds, planetary nebulae and supernovae return this enriched material to the interstellar medium, where it is incorporated into later generations of stars and planets. The oxygen, carbon, calcium and iron in terrestrial rock and biology were produced this way.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is the most common type of star?",
          answer:
            "M dwarfs — small, cool, faint red stars — make up the large majority of stars in the Galaxy. None is visible to the unaided eye from Earth, because their low luminosity means even the nearest, Proxima Centauri at just over four light-years, requires a telescope. The bright stars we see are a heavily biased sample of unusually luminous objects.",
        },
        {
          question: "How do astronomers know how hot a star is?",
          answer:
            "Primarily from its spectrum. The distribution of energy across wavelengths follows a temperature-dependent shape, so colour indicates temperature directly, and the presence or absence of specific absorption lines gives a sharper constraint because different atoms and molecules are ionised or destroyed at different temperatures. The spectral classification sequence is essentially a temperature ordering.",
        },
        {
          question: "How long do stars live?",
          answer:
            "From a few million years to far longer than the current age of the universe, depending almost entirely on mass. A twenty-solar-mass star burns through its fuel in a few million years; the Sun's main-sequence lifetime is around ten billion years; a low-mass red dwarf can sustain fusion for trillions of years, so none has yet had time to finish.",
        },
        {
          question: "Will the Sun explode?",
          answer:
            "No. Supernovae require a mass well above the Sun's — roughly eight solar masses or more for core collapse. The Sun will expand into a red giant, shed its outer layers as a planetary nebula, and leave behind a white dwarf that cools for a very long time. That sequence begins in billions of years.",
        },
      ],
      explore: [
        { label: "Star catalogue", href: "/stars", blurb: "Thousands of catalogued stars with measured parameters and provenance." },
        { label: "Stellar astrophysics", href: "/stellar-astrophysics", blurb: "Interiors, energy transport, and evolutionary physics." },
        { label: "How stars form", href: "/guides/how-stars-form", blurb: "The full sequence from molecular cloud to main sequence." },
        { label: "Compact objects", href: "/compact-objects", blurb: "White dwarfs, neutron stars, and black holes as endpoints." },
      ],
      sources: ["nasa", "esa", "iau", "simbad", "gaia"],
      keywords: ["stellar", "star types", "main sequence", "spectral classification"],
    },
    {
      slug: "constellations",
      name: "Constellations",
      summary: "The 88 official sky regions and their patterns of stars.",
      overview:
        "A constellation is, formally, one of the 88 regions into which the International Astronomical Union divides the celestial sphere — a complete, non-overlapping partition of the sky. Informally it also means the star pattern within that region, which is what most people picture.",
      keyPoints: [
        "The 88 constellations tile the entire sky with no gaps and no overlaps; every celestial object lies in exactly one.",
        "The stars in a constellation are almost never physically associated — they are a line-of-sight coincidence.",
        "Boundaries were fixed to the coordinate grid of 1875, so precession has since carried them slightly askew.",
        "An asterism, such as the Big Dipper or the Summer Triangle, is a recognised pattern that is not itself a constellation.",
      ],
      body: [
        {
          heading: "From pattern to region",
          paragraphs: [
            "For most of history a constellation was a picture: a group of stars imagined as a figure. Different cultures drew entirely different figures from the same stars, and the boundaries between them were vague. That is workable for storytelling and unworkable for cataloguing.",
            "In 1922 the International Astronomical Union adopted a definitive list of 88 constellations, and in 1930 Eugène Delporte published precise boundaries running along lines of constant right ascension and declination. Since then a constellation is an area of sky, not a picture, and every object has an unambiguous constellation assignment.",
          ],
        },
        {
          heading: "Why the boundaries look slightly crooked",
          paragraphs: [
            "Delporte drew the boundaries along the coordinate grid as it stood at the standard epoch B1875.0. Because Earth's rotation axis precesses, completing a circuit in roughly 26,000 years, the coordinate grid has since rotated relative to the stars.",
            "The boundaries move with the stars, so the assignments remain correct — but plotted on a modern coordinate grid the once-rectangular borders now appear tilted. This is why a modern star atlas shows constellation edges that step diagonally rather than following today's lines of right ascension and declination.",
          ],
        },
        {
          heading: "Depth: the illusion behind every figure",
          paragraphs: [
            "A constellation is a projection. The stars composing a figure are typically at wildly different distances and have no physical relationship to one another. In Orion, Betelgeuse and Rigel are hundreds of light-years away but not near each other; the belt stars are further still. Viewed from another star, the pattern would be unrecognisable.",
            "There are exceptions where stars genuinely are associated — parts of the Big Dipper belong to a common moving group, and the Pleiades is a true physical cluster — but these are the minority and are identified by shared motion and distance rather than by apparent proximity.",
          ],
        },
        {
          heading: "Northern, southern, and the history of the sky map",
          paragraphs: [
            "The classical constellations descend from Ptolemy's list of 48, itself inheriting Mesopotamian and Greek figures. That catalogue covered only the sky visible from Mediterranean latitudes, so the far southern sky was blank to European astronomy until the southern voyages that began in the 1590s. Keyser and de Houtman's observations on the 1595–97 Dutch expedition supplied twelve new constellations, engraved on Plancius's globe of 1598 and printed in Bayer's Uranometria of 1603; Lacaille added fourteen more from the Cape of Good Hope in 1751–52.",
            "The southern constellations were therefore invented across the age of exploration and instrumentation, which is why they are named for equipment and animals encountered abroad — Telescopium, Microscopium, Octans, Tucana — rather than for mythological figures. Later attempts to add political or commemorative constellations were not retained in the 1922 list.",
          ],
        },
        {
          heading: "Constellations versus zodiac signs",
          paragraphs: [
            "The zodiac constellations are astronomical regions of very unequal size that the Sun's apparent path crosses. The zodiac signs of Western astrology are twelve exactly equal 30-degree divisions measured from the March equinox. These are different systems that share names.",
            "Two consequences follow. The Sun spends different amounts of time in each zodiac constellation because they differ in width — and it also passes through Ophiuchus, which is not one of the twelve signs. And precession has shifted the signs relative to the constellations by roughly one sign over the past two thousand years, so the astrological sign for a date generally does not match the constellation the Sun is actually in.",
          ],
        },
      ],
      faqs: [
        {
          question: "How many constellations are there?",
          answer:
            "Eighty-eight, as fixed by the International Astronomical Union in 1922 with precise boundaries published in 1930. They tile the whole celestial sphere with no gaps or overlaps, so every star, galaxy and comet position falls in exactly one of them.",
        },
        {
          question: "Are the stars in a constellation close to each other?",
          answer:
            "Almost never. A constellation is a line-of-sight projection, and its stars typically lie at very different distances with no physical connection. Viewed from a different vantage point in the Galaxy the patterns would not exist. A few genuine exceptions — such as the Pleiades — are real physical clusters, identified by shared distance and motion.",
        },
        {
          question: "Why is Ophiuchus not a zodiac sign if the Sun passes through it?",
          answer:
            "Because zodiac signs and zodiac constellations are different systems. The signs are twelve equal 30-degree divisions of the ecliptic used in astrology; the constellations are irregular sky regions of unequal width. The Sun's path does cross Ophiuchus, which is an astronomical fact, but the twelvefold sign scheme was fixed long before modern constellation boundaries and was never intended to track them.",
        },
        {
          question: "What is the difference between a constellation and an asterism?",
          answer:
            "A constellation is one of the 88 official IAU sky regions. An asterism is any recognisable star pattern that is not itself one of those regions — the Big Dipper is an asterism within Ursa Major, and the Summer Triangle is an asterism spanning three separate constellations.",
        },
      ],
      explore: [
        { label: "Constellation catalogue", href: "/constellations", blurb: "All 88, with boundaries, seasons, families, and bright stars." },
        { label: "Sky atlas", href: "/sky-atlas", blurb: "Charts and the coordinate frames behind them." },
        { label: "Greek mythology", href: "/encyclopedia/greek-mythology", blurb: "The stories attached to the classical figures." },
        { label: "Reference systems", href: "/reference-systems", blurb: "Precession, epochs, and celestial coordinates." },
      ],
      sources: ["iau", "nasa", "simbad"],
      keywords: ["star patterns", "celestial sphere", "asterism", "IAU boundaries"],
    },
    {
      slug: "galaxies",
      name: "Galaxies",
      summary: "Gravitationally bound systems of stars, gas, dust, and dark matter.",
      overview:
        "A galaxy is a gravitationally bound system of stars, stellar remnants, interstellar gas and dust, and dark matter. They range from faint dwarfs containing a few million stars to giant ellipticals with trillions, and they are the basic structural units of the visible universe.",
      keyPoints: [
        "That galaxies exist outside the Milky Way was only established in 1923–24.",
        "Rotation curves show galaxies contain far more mass than their visible matter accounts for.",
        "Most large galaxies host a supermassive black hole at their centre.",
        "Galaxy morphology is strongly shaped by mergers and interactions, not just by initial conditions.",
      ],
      body: [
        {
          heading: "Morphology: the Hubble sequence and its limits",
          paragraphs: [
            "Before the mid-1920s it was an open question whether the spiral 'nebulae' were clouds inside the Milky Way or separate stellar systems. In 1923–24 Edwin Hubble identified Cepheid variable stars in the Andromeda nebula and applied Leavitt's period–luminosity relation to them, showing it lies far beyond our own Galaxy and settling the question. Everything below rests on that result.",
            "Hubble's classification, still the standard vocabulary, sorts galaxies into ellipticals (E0 to E7 by apparent flattening), spirals (Sa to Sc by how tightly wound the arms are and how large the bulge is), barred spirals (SBa to SBc), lenticulars (S0, disc-shaped but with little star formation), and irregulars.",
            "The scheme is descriptive, not evolutionary — the 'early' and 'late' labels sometimes attached to it reflect a discarded idea that galaxies evolve along the sequence. Morphology correlates strongly with other properties: ellipticals are typically old, red, gas-poor and found in dense environments, while spirals are actively forming stars and contain substantial cold gas.",
          ],
        },
        {
          heading: "The Milky Way from inside",
          paragraphs: [
            "Our own Galaxy is a barred spiral roughly 100,000 light-years across, with the Sun about halfway out from the centre. Determining its structure is unusually hard because we are embedded in the disc, looking through its dust — the existence of the central bar was not firmly established until infrared surveys penetrated that obscuration.",
            "At the centre lies Sagittarius A*, a compact radio source identified as a supermassive black hole of roughly four million solar masses through decades of tracking individual stellar orbits around it, and imaged at horizon scale by the Event Horizon Telescope in 2022.",
          ],
        },
        {
          heading: "The dark matter evidence",
          paragraphs: [
            "Measured rotation curves of spiral galaxies stay approximately flat far beyond the visible disc, rather than declining as the enclosed visible mass would predict. Vera Rubin's systematic measurements in the 1970s established this as a general property, not a peculiarity of a few systems.",
            "The same conclusion follows from independent lines of evidence: gravitational lensing of background objects, the velocity dispersion of galaxies within clusters, and the pattern of fluctuations in the cosmic microwave background. All indicate substantially more gravitating mass than the light traces. The nature of that mass is unknown, and its identification remains one of the major open problems in physics.",
          ],
        },
        {
          heading: "Galaxies interact",
          list: [
            "Mergers between comparable galaxies disrupt discs and can produce ellipticals; the resulting tidal tails are directly observable.",
            "Star formation is often triggered by interaction, as gas is compressed and driven inward.",
            "The Milky Way is currently absorbing smaller satellite galaxies, and stellar streams in the halo are the debris.",
            "The Milky Way and the Andromeda Galaxy are approaching one another and are expected to interact in a few billion years.",
            "Environment matters: galaxies in dense clusters are more often gas-poor ellipticals, having been stripped of star-forming material.",
          ],
        },
        {
          heading: "Active galaxies",
          paragraphs: [
            "In some galaxies the central black hole is actively accreting, producing a luminous nucleus that can outshine all the stars combined. These active galactic nuclei appear under many observational labels — Seyfert galaxies, radio galaxies, blazars, quasars — and the prevailing unified model attributes much of that variety to viewing angle relative to an obscuring torus and to jet orientation, rather than to fundamentally different objects.",
          ],
        },
      ],
      faqs: [
        {
          question: "How many galaxies are there?",
          answer:
            "Estimates from deep survey fields extrapolated across the sky run into the hundreds of billions of observable galaxies, and some analyses push higher once very faint dwarfs are included. Any specific number is a model-dependent extrapolation from a small surveyed area, not a count, and it should be read that way.",
        },
        {
          question: "What is dark matter and how do we know it exists?",
          answer:
            "It is an inferred component of mass that interacts gravitationally but does not emit or absorb light detectably. The evidence is that galaxies rotate too fast at their edges for their visible mass, that clusters bind galaxies moving faster than visible mass allows, that gravitational lensing reveals more mass than light traces, and that the cosmic microwave background fluctuation pattern requires it. What it is made of is unknown.",
        },
        {
          question: "Is the Milky Way going to collide with Andromeda?",
          answer:
            "The two galaxies are approaching each other and an interaction is expected in a few billion years. 'Collision' overstates it at the stellar level: galaxies are mostly empty space, and individual star collisions would be extraordinarily unlikely. What would change is the structure of both galaxies, as gravity reshapes their discs.",
        },
        {
          question: "Does every galaxy have a supermassive black hole?",
          answer:
            "Most large galaxies appear to, and there is a well-established correlation between black hole mass and the properties of the host bulge, suggesting the two grow together. Some small and dwarf galaxies show no evidence for one, and whether they genuinely lack them or simply host black holes too small to detect is an active question.",
        },
      ],
      explore: [
        { label: "Galaxies catalogue", href: "/galaxies", blurb: "Galaxy types, structures, and catalogued systems." },
        { label: "Galactic astronomy", href: "/galactic-astronomy", blurb: "The Milky Way's structure and stellar populations." },
        { label: "Deep sky", href: "/deep-sky", blurb: "NGC, IC, Messier, and Caldwell objects with catalogue data." },
        { label: "Cosmology", href: "/cosmology", blurb: "Large-scale structure and the expanding universe." },
      ],
      sources: ["nasa", "esa", "iau", "ned", "stsci"],
      keywords: ["spiral galaxy", "elliptical galaxy", "Milky Way", "dark matter", "Hubble sequence"],
    },
    {
      slug: "nebulae",
      name: "Nebulae",
      summary: "Interstellar clouds of gas and dust — stellar nurseries and remnants.",
      overview:
        "A nebula is an interstellar cloud of gas and dust. The word covers several physically distinct classes: regions where stars are forming, shells ejected by dying stars, debris from explosions, and cold clouds that simply block the light behind them.",
      keyPoints: [
        "The single word 'nebula' hides at least four unrelated physical situations.",
        "Emission nebulae glow because nearby hot stars ionise them; reflection nebulae only scatter light.",
        "Planetary nebulae have nothing to do with planets — the name is an eighteenth-century telescopic misimpression.",
        "The colours in published nebula images usually map specific emission lines, not what the eye would see.",
      ],
      body: [
        {
          heading: "Emission nebulae",
          paragraphs: [
            "An emission nebula glows by its own light. Ultraviolet radiation from nearby hot, young, massive stars ionises the surrounding hydrogen, and when electrons recombine with protons they emit at specific wavelengths — most prominently the red hydrogen-alpha line at 656.3 nanometres, which dominates the appearance of these objects in images.",
            "Such regions are called H II regions, and they mark active star formation because the ionising stars are short-lived and cannot have travelled far from where they formed. The Orion Nebula, about 1,300 light-years away, is the nearest large example and is visible to the unaided eye as a fuzzy patch below Orion's belt.",
          ],
        },
        {
          heading: "Reflection and dark nebulae",
          paragraphs: [
            "A reflection nebula contains no ionising source. Dust grains simply scatter light from nearby stars, and because scattering is more efficient at shorter wavelengths the result is characteristically blue — the same physics that makes Earth's sky blue. The nebulosity around the Pleiades is a well-known example.",
            "Dark nebulae are the same cold dusty material seen without illumination behind or within it. They are visible only as silhouettes against a brighter background: the Horsehead Nebula is a dark cloud outlined against an emission region, and the dark lanes splitting the Milky Way are dust clouds in the Galactic disc, not gaps between stars.",
          ],
        },
        {
          heading: "Planetary nebulae",
          paragraphs: [
            "A planetary nebula is the ejected outer envelope of a dying low- or intermediate-mass star, ionised by the exposed hot stellar core left behind — which is on its way to becoming a white dwarf. The name comes from William Herschel's era, when small round telescopic images resembled planetary discs; it is entirely unrelated to planets and is retained only by convention.",
            "These are short-lived objects, dispersing over tens of thousands of years, which is why relatively few are known despite the process being the normal fate of most stars. They are a principal route by which carbon and nitrogen produced inside stars are returned to the interstellar medium.",
          ],
        },
        {
          heading: "Supernova remnants",
          paragraphs: [
            "When a massive star explodes, or a white dwarf detonates, the ejected material expands into the surrounding medium at thousands of kilometres per second, shock-heating gas and generating emission across the spectrum from radio to X-rays.",
            "The Crab Nebula is the remnant of the supernova recorded by Chinese and other observers in 1054 CE, and it contains a pulsar — the neutron star left by the collapsed core. Remnants are the primary mechanism by which heavy elements synthesised in massive stars are dispersed, and their shocks are believed to accelerate a large share of Galactic cosmic rays.",
          ],
        },
        {
          heading: "Why nebula images look the way they do",
          paragraphs: [
            "Published nebula images are usually composites of narrowband exposures, each isolating a specific emission line, assigned to display colours. The widely used Hubble palette maps sulphur, hydrogen and oxygen lines to red, green and blue respectively — which is why familiar objects appear in colours quite unlike their visual appearance.",
            "This is a legitimate scientific visualisation choice, not decoration: it separates physically distinct emitting species that would otherwise blend. It is worth knowing that the eye at the eyepiece sees mostly faint grey, because at low light levels human colour vision barely operates.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why are planetary nebulae called that if they are not planets?",
          answer:
            "Because of how they looked through eighteenth-century telescopes. Their small, round, greenish discs resembled the appearance of planets such as Uranus, and the name stuck. They are actually the ejected outer layers of dying low- and intermediate-mass stars, ionised by the exposed stellar core.",
        },
        {
          question: "What makes emission nebulae red?",
          answer:
            "Hydrogen-alpha emission at 656.3 nanometres, in the red part of the spectrum. Ultraviolet light from hot nearby stars strips electrons from hydrogen atoms, and when the electrons recombine and cascade down energy levels they emit at fixed wavelengths, with H-alpha usually the strongest in the visible range.",
        },
        {
          question: "Why do nebulae look grey through a telescope but colourful in photographs?",
          answer:
            "Because human colour vision requires more light than these faint extended objects provide, so at the eyepiece the rod cells dominate and the view is essentially monochrome. A camera accumulates light over long exposures and registers colour that the eye cannot. Many published images additionally use narrowband filters mapped to display colours to separate different emitting elements.",
        },
      ],
      explore: [
        { label: "Deep sky catalogue", href: "/deep-sky", blurb: "Nebulae with catalogue identifiers, positions, and magnitudes." },
        { label: "Deep-sky encyclopedia", href: "/deep-sky-encyclopedia", blurb: "Object classes and their physics." },
        { label: "How stars form", href: "/guides/how-stars-form", blurb: "What is happening inside star-forming nebulae." },
        { label: "Images", href: "/images", blurb: "Licensed imagery with full credit and licence records." },
      ],
      sources: ["nasa", "esa", "stsci", "esa-hubble", "eso"],
      keywords: ["emission nebula", "planetary nebula", "interstellar medium", "H II region"],
    },
    {
      slug: "planets",
      name: "Planets",
      summary: "Worlds orbiting the Sun, from rocky terrestrials to gas and ice giants.",
      overview:
        "A planet, under the definition adopted by the International Astronomical Union in 2006, orbits the Sun, is massive enough for its own gravity to have pulled it into a nearly round shape, and has cleared the neighbourhood around its orbit. The Solar System has eight.",
      keyPoints: [
        "The 2006 definition has three clauses; it was the third — clearing the orbital neighbourhood — that reclassified Pluto.",
        "The four inner planets are rock and metal; the four outer ones are dominated by hydrogen, helium, and ices.",
        "Uranus and Neptune are 'ice giants', a compositionally distinct class from Jupiter and Saturn.",
        "Every planet's mass, radius and orbit on this platform is a catalogued measurement with a recorded source.",
      ],
      body: [
        {
          heading: "The definition and why it was contested",
          paragraphs: [
            "Before 2006 'planet' had no formal definition — it was a list maintained by convention. Discoveries in the Kuiper Belt forced the issue: Eris was found to be comparably sized to Pluto, and further similar bodies were expected, so either the list would grow indefinitely or a criterion was needed.",
            "The IAU's resolution requires a body to orbit the Sun, to be in hydrostatic equilibrium, and to have cleared its orbital neighbourhood. Pluto satisfies the first two but shares its orbital zone with many Kuiper Belt objects, so it was reclassified as a dwarf planet. The third clause remains debated — some planetary scientists argue that a definition based on the body's own properties would be more useful than one based on its surroundings — and it is worth presenting that as a live disagreement rather than a settled matter.",
          ],
        },
        {
          heading: "The terrestrial planets",
          paragraphs: [
            "Mercury, Venus, Earth and Mars are small, dense worlds of rock and metal with solid surfaces and few or no moons. They formed in the inner Solar System where temperatures were too high for water ice and other volatiles to condense, leaving only refractory materials to accrete.",
            "Their differences are instructive. Mercury has an unusually large iron core and effectively no atmosphere. Venus, nearly Earth's twin in size and mass, has a dense carbon-dioxide atmosphere and a surface near 460 °C under roughly 90 bar of pressure. Mars retains a thin atmosphere and abundant geological evidence of past liquid water. Comparing them is how planetary science tests ideas about atmospheric evolution and habitability.",
          ],
        },
        {
          heading: "Gas giants and ice giants",
          paragraphs: [
            "Jupiter and Saturn are overwhelmingly hydrogen and helium, with no solid surface — pressure rises smoothly until hydrogen becomes a metallic fluid deep inside. Both radiate more energy than they receive from the Sun, and both have extensive satellite systems and ring systems, Saturn's being far the most prominent.",
            "Uranus and Neptune are compositionally different enough to warrant a separate class. They contain proportionally much more water, ammonia and methane — collectively termed 'ices' in planetary science regardless of physical state — and much less hydrogen and helium. Both have been visited only once, by Voyager 2 in 1986 and 1989 respectively, which is why they remain the least characterised planets in the Solar System.",
          ],
        },
        {
          heading: "How planetary properties are measured",
          list: [
            "Mass comes from gravitational effects: on moons, on spacecraft trajectories, or on other planets.",
            "Radius comes from direct imaging, from occultations of background stars, or from radar ranging.",
            "Density is derived from mass and radius, and is the primary constraint on bulk composition.",
            "Atmospheric composition comes from spectroscopy, both remote and in situ from probes.",
            "Interior structure is inferred from gravitational field measurements, magnetic fields, and seismology where available.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why is Pluto not a planet?",
          answer:
            "Under the 2006 IAU definition a planet must have cleared the neighbourhood around its orbit. Pluto orbits within the Kuiper Belt alongside many other bodies and does not dominate its orbital zone, so it was reclassified as a dwarf planet. It meets the other two criteria — it orbits the Sun and is round — and some planetary scientists continue to argue that the clearing criterion is the wrong test.",
        },
        {
          question: "What is the difference between a gas giant and an ice giant?",
          answer:
            "Composition. Jupiter and Saturn are dominated by hydrogen and helium. Uranus and Neptune contain a much larger proportion of heavier volatile compounds — water, ammonia and methane, which planetary science calls 'ices' regardless of their actual physical state at depth — and correspondingly less hydrogen and helium.",
        },
        {
          question: "Which planet is hottest?",
          answer:
            "Venus, despite Mercury being closer to the Sun. Venus's dense carbon-dioxide atmosphere traps heat so effectively that its surface temperature is around 460 °C, hotter and far more uniform than Mercury's, which swings enormously between day and night because it has essentially no atmosphere to redistribute heat.",
        },
        {
          question: "Are there planets beyond Neptune?",
          answer:
            "No ninth planet meeting the IAU definition has been found. There is an active hypothesis, based on the clustered orbits of some distant trans-Neptunian objects, that an undiscovered massive planet may exist far beyond Neptune, but it has not been detected and alternative explanations for the clustering — including observational selection effects — remain viable.",
        },
      ],
      explore: [
        { label: "Solar System", href: "/solar-system", blurb: "Every planet, moon, and small body with measured data." },
        { label: "Comparative planetology", href: "/comparative-planetology", blurb: "What comparing worlds reveals about each of them." },
        { label: "Planetary geology", href: "/planetary-geology", blurb: "Surfaces, features, and geological processes." },
        { label: "Exoplanets", href: "/exoplanets", blurb: "Planets around other stars, for comparison." },
      ],
      sources: ["nasa", "jpl", "iau", "esa"],
      keywords: ["solar system", "terrestrial planets", "gas giants", "ice giants", "IAU definition"],
    },
    {
      slug: "dwarf-planets",
      name: "Dwarf Planets",
      summary: "Rounded worlds that share their orbital zone with other bodies.",
      overview:
        "A dwarf planet orbits the Sun and is massive enough to be nearly round under its own gravity, but has not cleared its orbital neighbourhood. Five are formally recognised by the International Astronomical Union, and more candidates exist among the trans-Neptunian population.",
      keyPoints: [
        "The category was created in 2006 alongside the formal definition of 'planet'.",
        "Ceres is in the asteroid belt; the other four recognised dwarf planets are beyond Neptune.",
        "Roundness is hard to confirm at great distance, which is why the recognised list is short and conservative.",
        "Only two have been visited: Ceres by Dawn and Pluto by New Horizons.",
      ],
      body: [
        {
          heading: "What the category is for",
          paragraphs: [
            "The dwarf planet class exists because the Solar System turned out to contain many bodies large enough to be round but small enough that they do not dominate their orbital zone. Rather than expand the planet list indefinitely as such objects were discovered, the IAU created a category for them in 2006.",
            "Five are currently recognised: Ceres, Pluto, Eris, Haumea and Makemake. Several other trans-Neptunian objects are plausible candidates — Gonggong, Quaoar and Sedna among them — but confirming hydrostatic equilibrium for a faint, distant, poorly resolved body is difficult, and the IAU has not extended the list.",
          ],
        },
        {
          heading: "Ceres: the one in the asteroid belt",
          paragraphs: [
            "Ceres is the largest object in the main asteroid belt and contains a substantial fraction of the belt's total mass. Discovered in 1801, it was initially counted as a planet, then reclassified as an asteroid as more belt objects were found — a historical precedent that closely parallels what happened to Pluto two centuries later.",
            "The Dawn spacecraft orbited Ceres from 2015 and found bright deposits in Occator crater identified as salts, together with evidence for a substantial water-ice component and for geologically recent brine activity. Ceres is now studied as a small ice-rich world rather than as a large rock.",
          ],
        },
        {
          heading: "Pluto and the trans-Neptunian dwarf planets",
          paragraphs: [
            "New Horizons' 2015 flyby transformed Pluto from a point of light into a geologically complex world: nitrogen-ice plains with convective cells and no impact craters, indicating an actively resurfacing terrain; water-ice mountains; and a layered haze in its thin nitrogen atmosphere. Its largest moon, Charon, is so large relative to Pluto that the pair orbit a barycentre outside Pluto's surface.",
            "Eris is comparable in size to Pluto and more massive, and its discovery in 2005 was the immediate catalyst for the reclassification debate. Haumea is markedly elongated by rapid rotation and has a ring; Makemake is a bright, methane-rich body. All three remain unvisited, and what is known about them comes from occultations, photometry and spectroscopy rather than from close observation.",
          ],
        },
        {
          heading: "Why the list may stay short",
          paragraphs: [
            "Establishing that a distant object is in hydrostatic equilibrium requires knowing its shape and internal structure, which for objects tens of astronomical units away is often not possible with current data. Stellar occultations — timing how a body blocks a background star from multiple sites — provide the sharpest size and shape constraints available and have been decisive for several candidates.",
            "The conservative approach means the recognised list understates how many round bodies orbit beyond Neptune. That is a limitation of measurement, not a claim that others do not exist, and Asteria Star records candidates as candidates rather than promoting them.",
          ],
        },
      ],
      faqs: [
        {
          question: "How many dwarf planets are there?",
          answer:
            "Five are formally recognised by the IAU: Ceres, Pluto, Eris, Haumea and Makemake. Several other trans-Neptunian objects are strong candidates, but confirming that a faint, distant body is round enough to qualify is observationally difficult, so the official list is deliberately conservative and probably an undercount.",
        },
        {
          question: "Is Ceres an asteroid or a dwarf planet?",
          answer:
            "Both descriptions apply. It is the largest object in the main asteroid belt and is catalogued as a minor planet, and it also meets the IAU's dwarf planet criteria. The categories overlap because one describes location and population and the other describes size and shape.",
        },
        {
          question: "What did New Horizons find at Pluto?",
          answer:
            "A far more active world than expected: vast nitrogen-ice plains with convective cells and no impact craters, indicating ongoing resurfacing; mountains of water ice; evidence of past or present cryovolcanism; and a layered atmospheric haze. For a body that small and that far from the Sun, sustained geological activity was a genuine surprise.",
        },
      ],
      explore: [
        { label: "Solar System", href: "/solar-system", blurb: "Dwarf planets alongside planets and small bodies." },
        { label: "Asteroids", href: "/asteroids", blurb: "The main belt population, including Ceres." },
        { label: "Small-body missions", href: "/small-body-missions", blurb: "Dawn, New Horizons, and other visiting spacecraft." },
      ],
      sources: ["iau", "nasa", "jpl", "mpc"],
      keywords: ["Pluto", "Ceres", "Kuiper Belt", "Eris", "trans-Neptunian"],
    },
    {
      slug: "moons",
      name: "Moons",
      summary: "Natural satellites orbiting planets and smaller bodies.",
      overview:
        "A moon, or natural satellite, orbits a planet, dwarf planet, or smaller body. The Solar System's moons range from irregular captured fragments a few kilometres across to worlds larger than Mercury, some with atmospheres and subsurface oceans.",
      keyPoints: [
        "Ganymede and Titan are both larger than the planet Mercury.",
        "Tidal locking — one hemisphere permanently facing the primary — is the normal outcome for close-in moons.",
        "Several icy moons are believed to hold liquid water oceans beneath their surfaces.",
        "The count of known moons rises with every survey; the catalogue is the authority, not any fixed number.",
      ],
      body: [
        {
          heading: "How a planet acquires a moon",
          list: [
            "Co-accretion: forming alongside the planet from the same circumplanetary disc. The regular satellite systems of Jupiter and Saturn — orbiting near the equatorial plane, in the same direction, on near-circular orbits — indicate this route.",
            "Capture: a passing body caught by the planet's gravity. Captured moons typically have inclined, eccentric, and often retrograde orbits. Neptune's Triton, orbiting backwards, is almost certainly a captured Kuiper Belt object.",
            "Giant impact: a collision ejecting material that reaccretes in orbit. This is the leading explanation for Earth's Moon, supported by its low iron content and by the isotopic similarity between lunar and terrestrial material.",
            "Mars's two small irregular moons, Phobos and Deimos, have contested origins — capture and impact-debris scenarios both have supporters and neither is settled.",
          ],
        },
        {
          heading: "Tidal locking and tidal heating",
          paragraphs: [
            "Tidal forces raise bulges on a moon, and friction as those bulges are dragged around by rotation dissipates energy until rotation synchronises with orbit. The result is tidal locking: the moon keeps one face permanently toward its planet, as Earth's Moon does. Given enough time and proximity it is the expected outcome, not a coincidence.",
            "Where a moon's orbit is kept eccentric by resonance with other moons, the tidal flexing continues and generates internal heat. This is the energy source for Io's continuous volcanism — the most volcanically active body in the Solar System — and it is what plausibly keeps subsurface oceans liquid on Europa and Enceladus far outside the region where sunlight could.",
          ],
        },
        {
          heading: "The worlds among them",
          list: [
            "Ganymede, the largest moon in the Solar System, is bigger than Mercury and is the only moon known to generate its own magnetic field.",
            "Titan has a dense nitrogen atmosphere thicker than Earth's and stable liquid methane and ethane lakes on its surface — the only other body known to have surface liquids.",
            "Europa's fractured ice shell overlies a probable global saltwater ocean, making it a primary astrobiology target.",
            "Enceladus vents plumes of water vapour and ice from its south polar region; Cassini flew through them and detected salts and organic molecules.",
            "Io is caught in an orbital resonance with Europa and Ganymede that sustains extreme tidal heating and hundreds of active volcanoes.",
            "Triton orbits Neptune retrograde, is geologically active with nitrogen plumes, and is almost certainly a captured Kuiper Belt object.",
          ],
        },
        {
          heading: "Why the count keeps changing",
          paragraphs: [
            "Announced moon totals for Jupiter and Saturn have risen repeatedly as surveys detect ever smaller and more distant irregular satellites, many only a few kilometres across. These discoveries reflect improving detection limits rather than anything new happening at the planets.",
            "For that reason this page does not state a total. The catalogue pages carry the current recorded set with their sources, and that is the honest place for a number that changes with each survey release.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why do we always see the same side of the Moon?",
          answer:
            "Because the Moon is tidally locked: it rotates once per orbit, so the same hemisphere faces Earth continuously. Tidal friction over long timescales drove the rotation into synchronisation with the orbit. There is a far side, not a dark side — it receives just as much sunlight, and it was first photographed by Luna 3 in 1959.",
        },
        {
          question: "Which moons might have oceans?",
          answer:
            "Europa and Enceladus have the strongest cases, both supported by multiple independent lines of evidence including magnetic induction signatures, surface geology, and in Enceladus's case direct sampling of erupted plume material. Ganymede, Callisto, Titan and possibly several other icy bodies are also thought to have subsurface liquid layers.",
        },
        {
          question: "How did the Moon form?",
          answer:
            "The leading model is a giant impact: a Mars-sized body struck the early Earth, and debris thrown into orbit reaccreted into the Moon. It accounts for the Moon's low iron content, the Earth–Moon angular momentum, and the close isotopic match between lunar and terrestrial material — although that last similarity is also the detail that continues to drive refinement of the model.",
        },
        {
          question: "Do all planets have moons?",
          answer:
            "No. Mercury and Venus have none. Earth has one, Mars two small ones, and the four giant planets have extensive systems. Several asteroids and trans-Neptunian objects also have satellites, so having a moon is not restricted to planets.",
        },
      ],
      explore: [
        { label: "Solar System", href: "/solar-system", blurb: "Moons alongside their parent bodies, with measured data." },
        { label: "Astrobiology", href: "/astrobiology", blurb: "Why icy moons are habitability targets." },
        { label: "Planetary geology", href: "/planetary-geology", blurb: "Surface features and processes across the Solar System." },
      ],
      sources: ["nasa", "jpl", "esa", "iau"],
      keywords: ["natural satellite", "the Moon", "Galilean moons", "Europa", "Titan"],
    },
    {
      slug: "exoplanets",
      name: "Exoplanets",
      summary: "Planets orbiting stars beyond the Sun.",
      overview:
        "An exoplanet is a planet orbiting a star other than the Sun. The first confirmed detection around a Sun-like star came in 1995, and more than five thousand are now confirmed — enough that the field has shifted from finding individual objects to characterising populations.",
      keyPoints: [
        "Every detection method has strong selection biases; the known population is not a fair sample.",
        "The most common planet sizes found so far — between Earth and Neptune — have no Solar System analogue.",
        "'Habitable zone' means liquid water could be stable at the surface given suitable conditions. It is not a claim about life.",
        "The 2019 Nobel Prize in Physics recognised the first detection around a solar-type star.",
      ],
      body: [
        {
          heading: "How exoplanets are detected",
          list: [
            "Transit: a planet crossing its star's disc causes a small periodic dip in brightness. This gives the planet's radius relative to the star and requires a nearly edge-on orbit. Kepler and TESS were built around this method, which has produced the most detections.",
            "Radial velocity: the planet's gravity makes the star wobble, shifting its spectral lines. This gives a minimum mass, and was the method behind the 1995 detection of 51 Pegasi b.",
            "Direct imaging: blocking the star's light to photograph the planet directly. It works best for young, massive, widely separated planets that are still hot from formation, and yields spectra of the planet itself.",
            "Gravitational microlensing: a foreground system briefly magnifies a background star, with the planet adding a characteristic spike. It is uniquely sensitive to planets far from their stars, but events do not repeat.",
            "Astrometry: measuring the star's positional wobble on the sky. Gaia's precision is expected to make this productive for wide-orbit giant planets.",
          ],
        },
        {
          heading: "Selection bias is the central caveat",
          paragraphs: [
            "Transit surveys favour large planets in short orbits, because those transit deeply and often. Radial velocity favours massive planets close to their stars, for the same reason. Direct imaging favours the opposite corner of parameter space. The catalogue is therefore a composite of what each technique can reach, not a census.",
            "The early dominance of hot Jupiters in discovery counts is the clearest illustration: they are rare in absolute terms but were by far the easiest to find first. Any statement about how common a planet type is has to be corrected for detection efficiency, and quoted population fractions always carry that model dependence.",
          ],
        },
        {
          heading: "The planets that have no Solar System counterpart",
          paragraphs: [
            "The most abundant planets found so far, once bias is corrected, are between Earth and Neptune in size — super-Earths and sub-Neptunes. The Solar System contains nothing in this range, which is a striking result: the most common kind of planet in the Galaxy is a type we cannot study up close.",
            "A related finding is the radius valley, a deficit of planets around 1.5 to 2 Earth radii, which appears to separate rocky planets from those retaining thick hydrogen envelopes. Whether that gap is carved by photoevaporation from stellar radiation or by heat from the planet's own core is an active question.",
          ],
        },
        {
          heading: "Habitable zones and atmospheres",
          paragraphs: [
            "The habitable zone is the range of orbital distances at which liquid water could persist on a planet's surface, given an Earth-like atmosphere. It is a screening tool for target selection, not a statement that a planet is habitable — surface conditions depend on atmospheric composition, magnetic field, geological activity and stellar behaviour, none of which the zone accounts for.",
            "Atmospheric characterisation is where the field is now moving. Transmission spectroscopy, which measures how a planet's atmosphere filters starlight during transit, has detected water vapour, carbon dioxide, methane and other species. JWST has substantially extended what is reachable, but detections at the limit of sensitivity are frequently revised, and Asteria Star records claimed atmospheric detections with their confidence and their source rather than as settled facts.",
          ],
        },
      ],
      faqs: [
        {
          question: "How many exoplanets have been found?",
          answer:
            "More than five thousand are confirmed, and the number rises continually as surveys report. Because the count changes with each catalogue release, this platform links to the exoplanet catalogue rather than freezing a figure here — the catalogue pages carry the archive-sourced records with their provenance.",
        },
        {
          question: "What was the first exoplanet discovered?",
          answer:
            "Planets around the pulsar PSR B1257+12 were confirmed in 1992, but the landmark detection around a Sun-like star was 51 Pegasi b in 1995 by Michel Mayor and Didier Queloz — a giant planet in a four-day orbit, which was not what theory expected and forced substantial revision of planet-formation models. That work received the 2019 Nobel Prize in Physics.",
        },
        {
          question: "Does 'habitable zone' mean a planet has life?",
          answer:
            "No. It means the planet orbits at a distance where liquid water could be stable at the surface if it had a suitable atmosphere. It says nothing about whether it has an atmosphere, what that atmosphere is made of, whether the surface is solid, or whether life exists. It is a target-selection criterion, not a finding.",
        },
        {
          question: "Can we see exoplanets directly?",
          answer:
            "A small number, yes. Direct imaging requires suppressing the star's overwhelming glare with a coronagraph or starshade, and works best for young, massive planets in wide orbits that are still glowing from the heat of formation. Most confirmed exoplanets have never been seen directly and are known only through their effects on their host star's light.",
        },
      ],
      explore: [
        { label: "Exoplanet catalogue", href: "/exoplanets", blurb: "Archive-sourced planets and host stars with provenance." },
        { label: "Exoplanet science", href: "/exoplanet-science", blurb: "Detection methods, populations, and characterisation." },
        { label: "Astrobiology", href: "/astrobiology", blurb: "Habitability, biosignatures, and their limits." },
        { label: "Space telescopes", href: "/astronomy/space-telescopes", blurb: "Kepler, TESS, JWST, and the instruments behind the data." },
      ],
      sources: ["nasa", "esa", "nobel", "ads"],
      keywords: ["transit method", "habitable zone", "extrasolar planet", "radial velocity", "super-Earth"],
    },
    {
      slug: "asteroids",
      name: "Asteroids",
      summary: "Rocky and metallic remnants from the early Solar System.",
      overview:
        "Asteroids are rocky or metallic small bodies, most orbiting the Sun in the main belt between Mars and Jupiter. They are leftover material from the formation of the Solar System that never accreted into a planet — and their composition preserves a record of conditions at that time.",
      keyPoints: [
        "The main belt did not fail to form a planet because of an explosion; Jupiter's gravity prevented accretion.",
        "Total belt mass is small — a few percent of the Moon's mass — and the belt is overwhelmingly empty space.",
        "Spectral classes broadly track composition and correlate with distance from the Sun.",
        "Near-Earth asteroids are catalogued and tracked systematically; known objects have no significant impact probability this century.",
      ],
      body: [
        {
          heading: "Why there is a belt and not a planet",
          paragraphs: [
            "The main belt lies roughly between 2.1 and 3.3 astronomical units from the Sun. Jupiter's gravitational influence stirred relative velocities in this region so much that colliding planetesimals fragmented rather than merged, preventing accretion into a planet.",
            "The belt is far emptier than illustrations suggest. Its total mass is only a few percent of the Moon's, roughly a third of it in Ceres alone, and typical separations between objects are millions of kilometres — every spacecraft that has crossed it has done so without incident.",
          ],
        },
        {
          heading: "Composition and spectral classes",
          list: [
            "C-type (carbonaceous) asteroids are dark and carbon-rich, dominate the outer belt, and are the most common class. Carbonaceous chondrite meteorites are their probable fragments.",
            "S-type (silicaceous) asteroids are stony, brighter, and more common in the inner belt.",
            "M-type asteroids show metallic signatures and may include exposed cores of differentiated bodies that were subsequently disrupted.",
            "The gradient with distance reflects formation temperature — volatile-rich material survived further from the Sun — and preserves information about the early solar nebula.",
          ],
        },
        {
          heading: "Families, groups, and resonances",
          paragraphs: [
            "Asteroids sharing similar orbital elements form families, understood as fragments of a single disrupted parent body. Identifying families lets astronomers reconstruct collisions that happened hundreds of millions of years ago.",
            "Orbital resonances with Jupiter produce the Kirkwood gaps — distances where an asteroid's orbital period would be a simple fraction of Jupiter's, and repeated gravitational tugs destabilise the orbit. Resonances also feed material inward, which is one route by which main-belt fragments become near-Earth objects. Trojan asteroids, by contrast, are stably trapped near Jupiter's Lagrange points, leading and trailing the planet.",
          ],
        },
        {
          heading: "Near-Earth objects and planetary defence",
          paragraphs: [
            "Near-Earth asteroids have orbits bringing them within 1.3 astronomical units of the Sun. Systematic surveys have catalogued the large majority of the kilometre-scale population, and no known object poses a significant impact risk within the coming century. Smaller objects remain substantially incomplete in the catalogue, and small impacts do occur — the Chelyabinsk event in 2013 involved an object roughly twenty metres across that was not detected in advance.",
            "The DART mission demonstrated in 2022 that a spacecraft impact can measurably change an asteroid's orbital period, shortening Dimorphos's orbit around Didymos. That is the first practical test of a deflection technique, though it applied to a small moonlet in a binary system rather than to an Earth-threatening object.",
          ],
        },
        {
          heading: "What visits have shown",
          paragraphs: [
            "Spacecraft have transformed asteroids from points of light into geological objects. NEAR Shoemaker orbited and landed on Eros; Dawn orbited both Vesta and Ceres; Hayabusa and Hayabusa2 returned samples from Itokawa and Ryugu; OSIRIS-REx returned material from Bennu.",
            "The sample returns matter disproportionately. Laboratory analysis of pristine, uncontaminated material provides compositional and isotopic detail that no remote measurement can match, and both Ryugu and Bennu samples contain organic compounds and hydrated minerals relevant to how volatiles were delivered to the early inner Solar System.",
          ],
        },
      ],
      faqs: [
        {
          question: "Was the asteroid belt once a planet?",
          answer:
            "No. The belt's total mass is only a few percent of the Moon's — far too little to have ever been a planet. Jupiter's gravity stirred the region so that colliding bodies fragmented rather than accreting, so a planet never formed there in the first place.",
        },
        {
          question: "Could an asteroid hit Earth?",
          answer:
            "Small ones do regularly, mostly burning up in the atmosphere. For large objects, surveys have catalogued most of the kilometre-scale near-Earth population and none has a significant impact probability in the coming century. Smaller objects capable of regional damage are less completely catalogued, which is why survey completion and the DART deflection test are both active priorities.",
        },
        {
          question: "What is the difference between an asteroid and a comet?",
          answer:
            "Composition and behaviour. Comets contain enough volatile ices to develop a coma and tail when heated by the Sun; asteroids are predominantly rock and metal and do not. The boundary is not perfectly sharp — some objects show intermittent activity, and a few appear to be transitional — but the distinction is meaningful for most bodies.",
        },
        {
          question: "Why send spacecraft to asteroids?",
          answer:
            "Because they preserve early Solar System material that planetary bodies have destroyed through heating and geological processing. Returned samples from Ryugu and Bennu allow laboratory analysis of pristine material, giving compositional and isotopic detail no remote observation can match — including on how water and organic compounds were delivered to the inner Solar System.",
        },
      ],
      explore: [
        { label: "Asteroid catalogue", href: "/asteroids", blurb: "Families, groups, near-Earth objects, and Trojans." },
        { label: "Planetary defence", href: "/planetary-defense", blurb: "Detection, tracking, and deflection." },
        { label: "Small-body missions", href: "/small-body-missions", blurb: "Sample return and rendezvous missions." },
        { label: "Meteorites", href: "/meteorites", blurb: "The fragments that reach Earth's surface." },
      ],
      sources: ["mpc", "jpl", "nasa", "esa"],
      keywords: ["main belt", "near-Earth object", "minor planet", "Kirkwood gaps", "sample return"],
    },
    {
      slug: "comets",
      name: "Comets",
      summary: "Icy bodies that grow tails as they near the Sun.",
      overview:
        "A comet is a small icy body that releases gas and dust when it approaches the Sun, forming a glowing coma and often two distinct tails. Comets originate in the cold outer Solar System and preserve some of its least altered material.",
      keyPoints: [
        "A comet's nucleus is typically only a few kilometres across; the coma it produces can exceed the Sun in diameter.",
        "Comets have two tails with different physics — one of ions, one of dust — and they point in different directions.",
        "Tails always point away from the Sun, so an outbound comet travels tail-first.",
        "Rosetta's two-year escort of comet 67P is the most detailed study of a comet ever made.",
      ],
      body: [
        {
          heading: "Anatomy of a comet",
          paragraphs: [
            "The nucleus is a solid body of ice, dust and rock, typically a few kilometres across and among the darkest surfaces in the Solar System — the 'dirty snowball' picture is closer to a very dark, porous, dusty ice. As the comet approaches the Sun, surface ices sublimate directly to gas, lifting dust with them.",
            "That released material forms the coma, a diffuse envelope around the nucleus that can grow to more than a million kilometres across, larger than the Sun. Beyond it, a vast hydrogen cloud is detectable in ultraviolet. Nearly everything visible about a comet is this temporary escaped atmosphere, not the tiny solid body producing it.",
          ],
        },
        {
          heading: "Two tails, two mechanisms",
          paragraphs: [
            "The ion tail forms when solar ultraviolet ionises cometary gas, and the solar wind's magnetic field carries those ions directly away from the Sun. It is bluish, straight, and can show sudden structural changes when the solar wind shifts.",
            "The dust tail forms from grains pushed outward by radiation pressure. Because dust grains retain their orbital motion and respond less sharply than ions, the dust tail curves along the comet's path and appears yellowish-white, reflecting sunlight rather than emitting.",
            "Both tails point broadly away from the Sun regardless of the comet's direction of travel, so a comet moving outward after perihelion leads with its tail rather than its nucleus — it travels tail-first.",
          ],
        },
        {
          heading: "Where comets come from",
          list: [
            "Short-period comets, with orbital periods under about 200 years, mostly originate in the Kuiper Belt and scattered disc beyond Neptune. Their orbits tend to lie near the plane of the Solar System.",
            "Long-period comets come from the Oort Cloud, a hypothesised roughly spherical reservoir extending tens of thousands of astronomical units out. Their orbits arrive from all directions, which is the principal evidence for the cloud's spherical geometry.",
            "Comets are not permanent. Each perihelion passage removes material, and they eventually exhaust their volatiles, break apart, or are ejected or captured. Some become effectively dormant and are hard to distinguish from asteroids.",
            "Meteor showers occur when Earth crosses a stream of debris left along a comet's orbit — the Perseids come from comet Swift–Tuttle, the Orionids from Halley's Comet.",
          ],
        },
        {
          heading: "What Rosetta found",
          paragraphs: [
            "ESA's Rosetta mission escorted comet 67P/Churyumov–Gerasimenko for over two years from 2014 and deployed the Philae lander to its surface. It observed the nucleus's activity change through perihelion, mapped a bilobed shape indicating a low-speed merger of two bodies, and measured a bulk density so low that the interior must be highly porous.",
            "Its measurement of the deuterium-to-hydrogen ratio in 67P's water was notably different from Earth's ocean value, weakening the case that Jupiter-family comets were the main source of Earth's water and shifting attention toward asteroidal delivery. It also detected molecular oxygen in the coma and glycine, an amino acid — results relevant to how prebiotic material is distributed.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why do comets have tails?",
          answer:
            "Because solar heating sublimates ices on the nucleus, releasing gas and dust. Solar ultraviolet ionises the gas and the solar wind sweeps those ions straight away from the Sun, forming a narrow blue ion tail; radiation pressure pushes dust grains outward more gently, forming a curved white dust tail. Both point broadly away from the Sun rather than backwards along the comet's motion.",
        },
        {
          question: "How often does Halley's Comet return?",
          answer:
            "About every 75 to 76 years. It last reached perihelion in 1986 and is next expected in 2061. The interval varies slightly because gravitational interactions with the planets perturb its orbit between passages. Chinese records allow its apparitions to be traced back to 240 BCE.",
        },
        {
          question: "Are comets dangerous?",
          answer:
            "A large impact would be, but the population is far smaller than the near-Earth asteroid population and long-period comets are the harder case because they arrive from the outer Solar System with little warning. No known comet is on an Earth-impact trajectory. Earth passes through cometary debris streams routinely — that is what a meteor shower is — and those particles are harmless.",
        },
        {
          question: "Did comets bring water to Earth?",
          answer:
            "Some, probably, but the evidence has shifted. Measuring the deuterium-to-hydrogen ratio in cometary water tests the idea, and Rosetta found 67P's ratio significantly different from Earth's oceans. Combined with results from other comets and from carbonaceous meteorites, current evidence favours asteroids as the dominant source, with comets contributing less than once assumed.",
        },
      ],
      explore: [
        { label: "Comet catalogue", href: "/comets", blurb: "Families, reservoirs, and active and dormant comets." },
        { label: "Meteor showers", href: "/sky", blurb: "The debris streams comets leave behind." },
        { label: "Interstellar objects", href: "/interstellar-objects", blurb: "Visitors from outside the Solar System." },
        { label: "Small-body missions", href: "/small-body-missions", blurb: "Rosetta, Stardust, and other comet missions." },
      ],
      sources: ["mpc", "jpl", "nasa", "esa"],
      keywords: ["coma", "comet tail", "Oort Cloud", "Rosetta", "67P"],
    },
    {
      slug: "meteorites",
      name: "Meteorites",
      summary: "Space rocks that survive the fall to a planet's surface.",
      overview:
        "A meteoroid that survives its passage through the atmosphere and reaches the ground is a meteorite. They are free samples of asteroids — and occasionally of the Moon and Mars — delivered without a spacecraft, and they include the oldest solid material available for laboratory study.",
      keyPoints: [
        "Meteoroid, meteor and meteorite are three different things: the object, the light, and the survivor.",
        "The oldest meteorite inclusions date the Solar System to about 4.567 billion years.",
        "A few meteorites are confirmed to come from Mars and the Moon, identified by composition and trapped gases.",
        "Antarctica yields disproportionately many finds because dark stones are conspicuous on ice.",
      ],
      body: [
        {
          heading: "The words, and what each one names",
          list: [
            "A meteoroid is the solid object while it is still in space — smaller than an asteroid, with no sharp boundary between the terms.",
            "A meteor is the luminous phenomenon as the object heats and ablates in the atmosphere. The light comes mainly from ionised air along the path, not from the object burning.",
            "A meteorite is what reaches the ground. Most meteoroids do not produce one; they ablate entirely at high altitude.",
            "A fireball is an exceptionally bright meteor. A bolide is one that fragments explosively.",
          ],
        },
        {
          heading: "Classification",
          paragraphs: [
            "Meteorites fall into three broad groups. Stony meteorites are the most common; within them, chondrites contain chondrules — small spherical grains that formed as free-floating molten droplets in the early solar nebula and were never subsequently melted. Chondrites therefore preserve primordial material, and carbonaceous chondrites additionally contain water-bearing minerals and organic compounds.",
            "Achondrites lack chondrules and come from bodies that were heated enough to differentiate. Iron meteorites are iron–nickel alloy, understood as fragments of the cores of such bodies, and their large crystalline Widmanstätten patterns record cooling over millions of years — an internal structure that can only form deep inside a substantial parent body. Stony-iron meteorites contain both.",
          ],
        },
        {
          heading: "Dating the Solar System",
          paragraphs: [
            "Calcium–aluminium-rich inclusions in primitive chondrites are the oldest dated solids formed in the Solar System, with radiometric ages around 4.567 billion years. That measurement is the basis for the Solar System's accepted age, and it comes from meteorites rather than from any planetary sample — Earth's own oldest rocks are considerably younger because the planet has continuously reprocessed its crust.",
            "This is a good example of a value that Asteria Star records with its measurement basis attached. It is a radiometric determination on specific inclusions, with a stated uncertainty, not a round figure.",
          ],
        },
        {
          heading: "Meteorites from the Moon and Mars",
          paragraphs: [
            "A small number of meteorites originate from the Moon and from Mars, launched by large impacts and eventually intercepted by Earth. Lunar origin is confirmed by direct comparison with Apollo samples. Martian origin is established chiefly by trapped gas whose composition matches the Martian atmosphere as measured by the Viking landers — a distinctive isotopic signature that is very hard to reproduce any other way.",
            "ALH 84001, a Martian meteorite recovered in Antarctica, became widely known after a 1996 paper proposed that features within it might be biological. That interpretation did not survive scrutiny — non-biological explanations account for the observed features — and it remains a useful case study in how extraordinary claims are tested.",
          ],
        },
        {
          heading: "Where they are found",
          paragraphs: [
            "Meteorites fall roughly uniformly across Earth, but recovery is heavily biased. Antarctic blue-ice fields concentrate them: dark stones are unmistakable against ice, ice flow accumulates them in predictable areas, and the cold dry conditions limit weathering. Hot deserts are productive for similar reasons of visibility and preservation.",
            "'Falls' — meteorites recovered after an observed fireball — are scientifically more valuable than 'finds', because they are fresher and their atmospheric trajectory can sometimes be reconstructed to determine the original orbit, linking a laboratory sample to a specific region of the Solar System.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is the difference between a meteor and a meteorite?",
          answer:
            "A meteor is the streak of light produced as an object enters the atmosphere — mostly emission from ionised air along its path. A meteorite is the solid object if any part of it survives to reach the ground. Most meteors leave no meteorite at all, ablating completely at high altitude.",
        },
        {
          question: "How do we know some meteorites came from Mars?",
          answer:
            "Chiefly from trapped gas. Certain meteorites contain gas whose elemental and isotopic composition matches the Martian atmosphere as measured directly by the Viking landers — a distinctive fingerprint that is very difficult to produce any other way. Their mineralogy and oxygen isotope ratios corroborate it.",
        },
        {
          question: "How old are meteorites?",
          answer:
            "The oldest components — calcium–aluminium-rich inclusions in primitive chondrites — give radiometric ages of about 4.567 billion years, and this is the basis for the accepted age of the Solar System. They are older than any rock available on Earth, because Earth's crust has been continuously reprocessed by geological activity.",
        },
        {
          question: "Why are so many meteorites found in Antarctica?",
          answer:
            "Because recovery conditions are exceptional, not because more fall there. Dark stones are highly visible on ice, glacial flow concentrates them in predictable stranding zones, and the cold dry environment limits chemical weathering so specimens survive in good condition for long periods.",
        },
      ],
      explore: [
        { label: "Meteorite catalogue", href: "/meteorites", blurb: "Classes, groups, falls, and impact structures." },
        { label: "Asteroids", href: "/asteroids", blurb: "The parent bodies most meteorites come from." },
        { label: "Astrochemistry", href: "/astrochemistry", blurb: "Organic compounds in primitive meteorites." },
        { label: "Meteor showers", href: "/sky", blurb: "Cometary debris streams and their radiants." },
      ],
      sources: ["nasa", "britannica", "jpl"],
      keywords: ["meteor", "meteoroid", "fireball", "chondrite", "ALH 84001"],
    },
    {
      slug: "black-holes",
      name: "Black Holes",
      summary: "Regions where gravity is so strong not even light escapes.",
      overview:
        "A black hole is a region of spacetime where gravity is strong enough that no path — for matter or for light — leads back out. They form from collapsed massive stars and grow by accretion and by merging, and they are described by general relativity in terms of just mass and spin.",
      keyPoints: [
        "The event horizon is a causal boundary, not a physical surface.",
        "Horizon size scales linearly with mass: roughly 3 km per solar mass.",
        "Accreting black holes are among the brightest objects in the universe — the light comes from infalling matter, not the hole.",
        "Both gravitational-wave detection and direct horizon imaging confirmed key predictions within the last decade.",
      ],
      body: [
        {
          heading: "The event horizon",
          paragraphs: [
            "In general relativity, mass and energy curve spacetime and objects follow the straightest available paths through it. A black hole is a configuration where the curvature within a region is extreme enough that every future-directed path leads inward — the event horizon marks that boundary.",
            "Nothing marks the boundary locally — no surface, no barrier, no measurable jolt for an infalling observer crossing a supermassive one. What changes is which futures remain reachable. For a non-rotating black hole the horizon radius is proportional to mass, at roughly 3 kilometres per solar mass, which is the number every catalogued size on this platform is derived from.",
          ],
        },
        {
          heading: "Populations",
          list: [
            "Stellar-mass black holes, typically a few to a few tens of solar masses, form from the collapse of massive stellar cores. Many are found in X-ray binaries or through gravitational-wave detections of mergers.",
            "Supermassive black holes, millions to billions of solar masses, occupy the centres of most large galaxies. Sagittarius A* at the Milky Way's centre is about four million solar masses.",
            "The intermediate mass range, roughly a hundred to a hundred thousand solar masses, is the sparsest part of the catalogue: candidates exist and some merger events land in it, but no formation route is established, so records here carry lower confidence than either population above or below.",
            "How supermassive black holes reached their masses so early in cosmic history, given the quasars observed at high redshift, is an open problem.",
          ],
        },
        {
          heading: "How they are detected",
          paragraphs: [
            "Nothing escapes a black hole, so detection is always indirect or, in the imaging case, based on the shadow it casts. Stellar orbits around the Galactic centre revealed a compact four-million-solar-mass object in a volume no star cluster could occupy — work recognised with the 2020 Nobel Prize in Physics.",
            "Two detection channels now populate the catalogue directly. Gravitational-wave observatories have recorded merger events since 2015, each yielding component masses and spins. The Event Horizon Telescope published horizon-scale images of M87's black hole in 2019 and of Sagittarius A* in 2022 — the only two objects for which a resolved horizon-scale image exists, which is why image coverage on every other black-hole record is honestly empty.",
          ],
        },
        {
          heading: "Accretion, jets, and feedback",
          paragraphs: [
            "Accretion is what makes black holes catalogable at all: the infalling material radiates, and that radiation is the observable. Its efficiency far exceeds nuclear fusion, which is why an accreting black hole can outshine its entire host galaxy and be recorded across cosmological distances.",
            "Many systems also launch relativistic jets along the spin axis. On galactic scales these jets deposit enormous energy into the surrounding medium, heating gas and suppressing star formation — a feedback process now understood as an important regulator of galaxy evolution rather than a curiosity.",
          ],
        },
        {
          heading: "Open questions",
          paragraphs: [
            "General relativity predicts a singularity at the centre, where its own equations cease to give meaningful results. That is generally taken as a signal that quantum gravity is required, not as a physical description of a place.",
            "No catalogued black hole has ever been observed to lose mass. Hawking's predicted thermal emission is far colder than the cosmic microwave background for any astrophysical example, so every real object absorbs more than it emits — which is why no record on this platform carries an evaporation timescale.",
          ],
        },
      ],
      faqs: [
        {
          question: "How big is a black hole?",
          answer:
            "Its event horizon radius is proportional to its mass — roughly 3 kilometres per solar mass for a non-rotating black hole. A ten-solar-mass stellar remnant has a horizon about 30 kilometres in radius; the four-million-solar-mass black hole at the Galactic centre has one about 12 million kilometres in radius, which fits comfortably inside Mercury's orbit — that orbit is nearly five times wider.",
        },
        {
          question: "If nothing escapes, how do we detect black holes?",
          answer:
            "Through their effects. Stars orbiting an invisible compact mass reveal it dynamically; matter falling in radiates intensely before crossing the horizon; mergers emit gravitational waves; and the Event Horizon Telescope images the dark shadow the horizon casts against surrounding bright emission.",
        },
        {
          question: "Could the Large Hadron Collider create a dangerous black hole?",
          answer:
            "No. Any microscopic black hole producible at accelerator energies would, under the theoretical frameworks that allow them at all, evaporate essentially instantly via Hawking radiation. More directly, cosmic rays strike Earth's atmosphere at far higher energies continuously and have done so for billions of years without consequence.",
        },
      ],
      explore: [
        { label: "How black holes work", href: "/guides/how-black-holes-work", blurb: "The full explainer, including formation and evidence." },
        { label: "Compact objects", href: "/compact-objects", blurb: "Black holes catalogued alongside neutron stars and white dwarfs." },
        { label: "Multi-messenger astronomy", href: "/multi-messenger", blurb: "Gravitational-wave and coordinated detections." },
      ],
      sources: ["nasa", "esa", "ligo", "eht", "nobel"],
      keywords: ["event horizon", "supermassive black hole", "singularity", "accretion disc"],
    },
    {
      slug: "quasars",
      name: "Quasars",
      summary: "Brilliant active galactic nuclei in the distant universe.",
      overview:
        "A quasar is an extremely luminous active galactic nucleus, powered by gas falling toward a supermassive black hole at a galaxy's centre. They are among the most distant and energetic objects observable, and they served as the first evidence that black holes shape galaxies.",
      keyPoints: [
        "The name is a contraction of 'quasi-stellar radio source' — they appeared starlike but were not stars.",
        "A quasar can outshine its entire host galaxy, which is why the host is often invisible in early images.",
        "Their extreme redshifts made them probes of the early universe before anything else could reach that distance.",
        "Quasars, Seyferts, blazars and radio galaxies are largely the same phenomenon seen from different angles.",
      ],
      body: [
        {
          heading: "The identification problem",
          paragraphs: [
            "Quasars were first noticed as radio sources with optical counterparts that looked like stars but had spectra nobody could identify. The breakthrough came in 1963 when Maarten Schmidt recognised that the spectrum of 3C 273 showed ordinary hydrogen lines shifted by an enormous amount — the object was not a nearby star but something extraordinarily distant.",
            "That resolution created a new problem. At such distances, the observed brightness implied a luminosity far exceeding an entire galaxy, produced from a region small enough to vary noticeably over months. Only accretion onto a supermassive black hole could plausibly release that much energy from that small a volume.",
          ],
        },
        {
          heading: "The engine",
          paragraphs: [
            "Gas spiralling toward a supermassive black hole forms an accretion disc heated to enormous temperatures by friction and magnetic stress. The conversion of gravitational potential energy to radiation is far more efficient than nuclear fusion, which is what allows a region comparable in size to the Solar System to outshine a galaxy of hundreds of billions of stars.",
            "Surrounding the disc are fast-moving clouds producing broad emission lines, slower clouds producing narrow lines, and an obscuring torus of dust further out. Many systems launch relativistic jets along the spin axis, which are prominent in radio observations and can extend far beyond the host galaxy.",
          ],
        },
        {
          heading: "One phenomenon, many labels",
          paragraphs: [
            "Active galactic nuclei were historically catalogued under many names — Seyfert 1 and 2 galaxies, radio-loud and radio-quiet quasars, blazars, BL Lac objects — because they look different. The unified model attributes much of that variety to geometry: whether the line of sight passes through the obscuring torus, and whether a relativistic jet points toward the observer.",
            "A blazar, on this account, is an AGN viewed nearly down the jet axis, which is why blazars show extreme and rapid variability. The unified picture is well supported but not complete — intrinsic differences in accretion rate and black hole spin also matter, and some sources change classification over time.",
          ],
        },
        {
          heading: "Quasars as cosmological tools",
          paragraphs: [
            "Because quasars are luminous enough to be seen across most of cosmic history, they function as beacons. Absorption lines imprinted on quasar light by intervening gas clouds map the distribution and composition of the intergalactic medium along the line of sight — the Lyman-alpha forest is built entirely from this effect.",
            "Quasar counts also peak at earlier cosmic times and decline toward the present, indicating that supermassive black hole accretion was far more active in the past. That evolution is one of the strongest constraints on models of how galaxies and their central black holes grew together.",
          ],
        },
      ],
      faqs: [
        {
          question: "What powers a quasar?",
          answer:
            "Accretion onto a supermassive black hole. Gas spiralling inward through a disc converts gravitational potential energy into radiation with efficiency far exceeding nuclear fusion, which allows a region roughly the size of the Solar System to outshine a galaxy containing hundreds of billions of stars.",
        },
        {
          question: "Are there quasars near us?",
          answer:
            "Not in the present-day universe at full quasar luminosity. Quasar activity peaked billions of years ago and has declined since, as central black holes exhausted their fuel supply. Nearby galaxies host lower-luminosity active nuclei, and many — including the Milky Way — host black holes that are currently quiescent.",
        },
        {
          question: "Why do quasars look like stars?",
          answer:
            "Because they are so distant and so compact that they are unresolved points of light, and so luminous that they overwhelm the host galaxy around them. That is the origin of the name — 'quasi-stellar'. Deep imaging with modern telescopes can often reveal the host galaxy once the nuclear light is carefully subtracted.",
        },
      ],
      explore: [
        { label: "Galaxies", href: "/galaxies", blurb: "The host galaxies of active nuclei." },
        { label: "Compact objects", href: "/compact-objects", blurb: "The supermassive black holes at the centre." },
        { label: "Cosmology", href: "/cosmology", blurb: "Quasars as probes of the early universe." },
      ],
      sources: ["nasa", "esa", "ned", "sdss"],
      keywords: ["active galactic nucleus", "AGN", "accretion", "3C 273", "blazar"],
    },
    {
      slug: "pulsars",
      name: "Pulsars",
      summary: "Rapidly spinning neutron stars that beam radiation.",
      overview:
        "A pulsar is a highly magnetised, rapidly rotating neutron star whose beamed radiation sweeps past Earth as regular pulses. Their timing stability is so extreme that they function as natural precision clocks and have delivered some of the strongest tests of general relativity.",
      keyPoints: [
        "The first pulsar was detected in 1967 by Jocelyn Bell Burnell, then a graduate student.",
        "A neutron star packs more than the Sun's mass into a sphere roughly 20 kilometres across.",
        "Millisecond pulsars spin hundreds of times per second, spun up by accretion from a companion.",
        "Timing of the Hulse–Taylor binary pulsar provided the first evidence for gravitational waves — indirectly, decades before LIGO.",
      ],
      body: [
        {
          heading: "Discovery",
          paragraphs: [
            "In 1967 Jocelyn Bell Burnell noticed an unusually regular repeating radio signal in data from a Cambridge array. Its precision — pulses arriving every 1.34 seconds — was initially so unlike any known astronomical source that the possibility of an artificial origin was briefly entertained, and the source was informally labelled LGM-1.",
            "The discovery of further sources with different periods ruled that out, and the signals were identified as rotating neutron stars. The 1974 Nobel Prize in Physics went to Bell Burnell's supervisor Antony Hewish, cited for his decisive role in the discovery of pulsars, and was shared with Martin Ryle, cited separately for aperture synthesis. Bell Burnell's own omission has been widely discussed since.",
          ],
        },
        {
          heading: "What a neutron star is",
          paragraphs: [
            "A neutron star is the collapsed core left when a massive star's iron core can no longer support itself. Electron degeneracy pressure fails, protons and electrons combine, and the core collapses until it is supported by neutron degeneracy pressure and the strong nuclear force — packing more than the Sun's mass into a sphere of order 20 kilometres across.",
            "Conservation of angular momentum during that collapse spins the remnant up enormously, and conservation of magnetic flux amplifies its magnetic field to extraordinary strengths. Charged particles accelerated along the magnetic axis produce beamed emission, and because the magnetic axis is generally not aligned with the rotation axis, that beam sweeps around like a lighthouse.",
          ],
        },
        {
          heading: "Timing precision and what it buys",
          paragraphs: [
            "Pulsar periods are stable enough that arrival times can be predicted over years, and departures from prediction reveal physics. Gradual spin-down is measurable and gives the energy loss rate. Sudden small speed-ups — glitches — probe the interior superfluid.",
            "Millisecond pulsars, spun up to hundreds of rotations per second by accreting matter from a binary companion, are the most stable of all, rivalling atomic clocks over long intervals. Pulsar timing arrays exploit this by monitoring many millisecond pulsars simultaneously, searching for the correlated timing deviations that a background of nanohertz gravitational waves would produce.",
          ],
        },
        {
          heading: "Testing gravity",
          paragraphs: [
            "The binary pulsar PSR B1913+16, discovered by Russell Hulse and Joseph Taylor in 1974, provided the first evidence that gravitational waves exist. Its orbital period decays at precisely the rate general relativity predicts for energy lost to gravitational radiation — a match sustained over decades of timing, recognised with the 1993 Nobel Prize in Physics.",
            "Later systems, including double-pulsar binaries where both components are detectable, have tightened these tests further and continue to constrain alternatives to general relativity in the strong-field regime more sharply than any laboratory experiment can.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why do pulsars pulse?",
          answer:
            "Because they emit beamed radiation along their magnetic axis, which is usually tilted relative to their rotation axis. As the star spins, the beam sweeps across space, and an observer whose line of sight the beam crosses sees a pulse once per rotation. The star's emission is continuous; the pulsing is a geometric effect.",
        },
        {
          question: "How fast can a pulsar spin?",
          answer:
            "The fastest known millisecond pulsars rotate several hundred times per second. They reach those rates by accreting matter from a binary companion, which transfers angular momentum and spins the neutron star up — which is why they are described as recycled pulsars.",
        },
        {
          question: "Were pulsars mistaken for alien signals?",
          answer:
            "Briefly and informally. The first detected source was so regular that an artificial origin was considered and the signal was labelled LGM-1 as a working joke. Finding additional sources with different periods in different parts of the sky ruled that out quickly, and the rotating-neutron-star explanation followed.",
        },
        {
          question: "How dense is a neutron star?",
          answer:
            "Extremely — comparable to atomic nuclei. More than the Sun's mass is contained in a sphere roughly 20 kilometres across, so a volume the size of a sugar cube would have a mass of order a hundred million tonnes. This is matter compressed beyond anything reproducible in a laboratory, and its exact equation of state is still being constrained.",
        },
      ],
      explore: [
        { label: "Compact objects", href: "/compact-objects", blurb: "Neutron stars, pulsars, magnetars, and black holes." },
        { label: "Multi-messenger astronomy", href: "/multi-messenger", blurb: "Neutron star mergers and gravitational waves." },
        { label: "Time-domain astronomy", href: "/time-domain", blurb: "Transient and variable phenomena." },
      ],
      sources: ["nasa", "esa", "nobel", "ads"],
      keywords: ["neutron star", "rotation", "radio pulsar", "millisecond pulsar", "Hulse-Taylor"],
    },
    {
      slug: "supernovae",
      name: "Supernovae",
      summary: "The explosive deaths of stars.",
      overview:
        "A supernova is the explosion that ends certain stars, briefly rivalling an entire galaxy in brightness and dispersing newly synthesised elements into space. Two physically distinct mechanisms produce them, and distinguishing which is which is essential to using them as cosmological tools.",
      keyPoints: [
        "There are two unrelated mechanisms: core collapse of a massive star, and thermonuclear detonation of a white dwarf.",
        "The historical Type I/II labels are spectroscopic, and do not map cleanly onto the two mechanisms.",
        "Type Ia supernovae are standardisable candles and were used to discover cosmic acceleration.",
        "SN 1987A was detected in neutrinos hours before its light arrived.",
      ],
      body: [
        {
          heading: "Two mechanisms",
          paragraphs: [
            "Core-collapse supernovae end massive stars, above roughly eight solar masses. Once the core becomes iron, fusion can no longer supply supporting pressure — fusing iron consumes energy rather than releasing it — and the core collapses in under a second to nuclear density. The collapse halts abruptly, and the resulting shock, assisted by an enormous flux of neutrinos, expels the outer layers. What remains is a neutron star or a black hole.",
            "Thermonuclear supernovae are entirely different. A white dwarf in a binary system accretes material until conditions trigger runaway carbon fusion, and the star is destroyed completely, leaving no remnant. Because the trigger conditions are similar from event to event, these explosions have a relatively uniform intrinsic brightness — the property that makes them cosmologically useful.",
          ],
        },
        {
          heading: "Why the classification is confusing",
          paragraphs: [
            "Supernova types were named before the mechanisms were understood, and the labels are purely spectroscopic: Type I lacks hydrogen lines, Type II shows them. That distinction does not track the physics.",
            "Type Ia is thermonuclear. Types Ib and Ic are core-collapse events from massive stars that had already shed their hydrogen envelopes, so they lack hydrogen lines despite sharing a mechanism with Type II. Anyone reading supernova literature needs to hold both the observational label and the physical mechanism in mind, because they are not the same taxonomy.",
          ],
        },
        {
          heading: "Element production",
          paragraphs: [
            "Core-collapse supernovae eject the layers of elements built up during the star's life — oxygen, neon, magnesium, silicon — and synthesise more in the explosion itself. Type Ia events are the dominant producers of iron-peak elements, which is why the ratio of oxygen to iron in a galaxy's stars traces the relative history of the two supernova types.",
            "Elements heavier than iron require neutron capture. The rapid process needs extreme neutron densities, and while supernovae were long assumed to be its main site, the 2017 detection of the neutron-star merger GW170817 with an accompanying kilonova provided direct evidence that mergers produce heavy elements in quantity. The relative contribution of each site is still being worked out.",
          ],
        },
        {
          heading: "SN 1987A and cosmic acceleration",
          paragraphs: [
            "SN 1987A, in the Large Magellanic Cloud, was the nearest supernova observed since the invention of the telescope. Neutrino detectors recorded a burst hours before the optical brightening, exactly as core-collapse theory predicts, since neutrinos escape the collapsing core promptly while the shock takes hours to reach the surface. It is a rare case of a major theoretical prediction confirmed by an unrepeatable natural event.",
            "In 1998 two independent teams used Type Ia supernovae as distance indicators and found distant supernovae fainter than a decelerating universe predicts — evidence that cosmic expansion is accelerating. The result was recognised with the 2011 Nobel Prize in Physics, and the cause, termed dark energy, remains unexplained.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is the difference between Type Ia and Type II supernovae?",
          answer:
            "They are different physical events sharing a naming scheme. Type Ia is the thermonuclear detonation of a white dwarf in a binary system, destroying it completely. Type II is the gravitational core collapse of a massive star, leaving a neutron star or black hole. The Roman-numeral labels are spectroscopic — Type I lacks hydrogen lines — and Types Ib and Ic are core-collapse events despite the 'I'.",
        },
        {
          question: "Will any nearby star go supernova?",
          answer:
            "Betelgeuse is the most-discussed candidate and will eventually undergo core collapse, but 'eventually' on stellar timescales could mean any time within roughly the next hundred thousand years. At its distance of several hundred light-years it would be spectacularly bright but would pose no danger to Earth.",
        },
        {
          question: "How do supernovae measure the universe?",
          answer:
            "Type Ia supernovae explode under similar conditions, so their intrinsic brightness is nearly uniform and can be standardised further using the shape of their light curve. Comparing intrinsic to observed brightness gives distance. Applying this at large distances is how two teams found in 1998 that cosmic expansion is accelerating.",
        },
        {
          question: "Why were neutrinos from SN 1987A detected before the light?",
          answer:
            "Because neutrinos barely interact with matter and escape the collapsing core almost immediately, while the shock wave needs hours to travel outward through the star's envelope before the surface brightens. The several-hour lead time matched core-collapse predictions closely and was strong confirmation of the mechanism.",
        },
      ],
      explore: [
        { label: "Compact objects", href: "/compact-objects", blurb: "The neutron stars and black holes left behind." },
        { label: "Time-domain astronomy", href: "/time-domain", blurb: "How transients are detected and followed up." },
        { label: "Distance ladder", href: "/distance-ladder", blurb: "Type Ia supernovae as a cosmological rung." },
        { label: "Deep sky", href: "/deep-sky", blurb: "Supernova remnants in the catalogue." },
      ],
      sources: ["nasa", "esa", "nobel", "ads"],
      keywords: ["stellar explosion", "Type Ia", "core collapse", "SN 1987A", "kilonova"],
    },
    {
      slug: "star-clusters",
      name: "Star Clusters",
      summary: "Groups of stars born from the same cloud.",
      overview:
        "A star cluster is a group of stars that formed together from the same molecular cloud. Open clusters are young, loosely bound and found in the Galactic disc; globular clusters are ancient, densely packed and distributed through the halo.",
      keyPoints: [
        "Because cluster members share an age and composition, clusters are the primary laboratory for testing stellar evolution.",
        "Open clusters disperse over hundreds of millions of years; globular clusters have survived for over ten billion.",
        "Globular clusters contain some of the oldest stars known, and their ages constrain the age of the universe.",
        "The Sun almost certainly formed in a cluster that has long since dispersed.",
      ],
      body: [
        {
          heading: "Open clusters",
          paragraphs: [
            "Open clusters contain from a few dozen to a few thousand stars, are found in the Galactic disc where star formation is ongoing, and are loosely bound. Tidal forces from the Galaxy and encounters with molecular clouds gradually strip members away, so most disperse within a few hundred million years.",
            "The Pleiades and the Hyades are the nearest bright examples, both visible without equipment. The Pleiades is young, around 100 million years old, so it still contains hot blue-white B-type stars, and those will be gone within a few hundred million years. The Hyades is several times older — roughly 600 to 800 million years — and its most massive stars have already evolved away: its main-sequence turn-off now sits among the A stars, and several prominent orange giants mark where earlier generations left the main sequence.",
          ],
        },
        {
          heading: "Globular clusters",
          paragraphs: [
            "Globular clusters are dense, roughly spherical systems containing hundreds of thousands to millions of stars, orbiting through the Galactic halo rather than the disc. Around 150 are known in the Milky Way, and they are among the oldest structures in it, with ages exceeding ten billion years.",
            "Their stars are metal-poor, reflecting formation from gas that had been enriched by relatively few previous stellar generations. Because a cluster's stars all formed at once, fitting its observed colour–magnitude diagram against stellar models gives an age — and those ages have historically provided an independent lower bound on the age of the universe, a constraint that cosmology had to satisfy.",
          ],
        },
        {
          heading: "Why clusters are so scientifically useful",
          paragraphs: [
            "In a cluster, the stars share age, initial composition and distance. That removes three of the largest confounding variables in stellar astrophysics simultaneously, so differences between members must be due to mass.",
            "Plotting a cluster on a colour–magnitude diagram therefore produces a clean sequence with a distinct turn-off point where the most massive surviving stars are leaving the main sequence. The location of that turn-off dates the cluster directly. This is the single most important application of cluster observation, and it is why clusters anchor much of the calibration of stellar-evolution models.",
          ],
        },
        {
          heading: "Complications in the standard picture",
          paragraphs: [
            "The classical assumption that a globular cluster is a single stellar population has not survived detailed spectroscopy. Most well-studied globulars show multiple populations with distinct chemical signatures, indicating more than one epoch or channel of star formation within the cluster's early history.",
            "There are also intermediate cases that resist the open/globular dichotomy, and some globular clusters — Omega Centauri being the standard example — may be the stripped cores of dwarf galaxies captured by the Milky Way rather than clusters in the usual sense.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is the difference between an open and a globular cluster?",
          answer:
            "Age, density and location. Open clusters are young, loosely bound groups of up to a few thousand stars in the Galactic disc, and they disperse within a few hundred million years. Globular clusters are ancient, tightly bound systems of hundreds of thousands to millions of stars orbiting in the halo, and they have survived for over ten billion years.",
        },
        {
          question: "How do astronomers determine a cluster's age?",
          answer:
            "From the main-sequence turn-off. All the cluster's stars formed at the same time, and more massive stars exhaust their core hydrogen faster, so the point on the colour–magnitude diagram where stars are leaving the main sequence directly indicates how much time has passed. It is one of the most reliable age determinations in astronomy.",
        },
        {
          question: "Did the Sun form in a cluster?",
          answer:
            "Almost certainly. Most stars form in groups, and isotopic evidence in meteorites indicates the early Solar System was exposed to material from a nearby massive star, which implies a cluster environment. That birth cluster dispersed billions of years ago and its members are now spread throughout the Galaxy; identifying the Sun's siblings is an active area of research.",
        },
      ],
      explore: [
        { label: "Deep sky catalogue", href: "/deep-sky", blurb: "Open and globular clusters with catalogue data." },
        { label: "Stars", href: "/stars", blurb: "Individual cluster members and their measured parameters." },
        { label: "Galactic astronomy", href: "/galactic-astronomy", blurb: "Where clusters sit in the Galaxy's structure." },
      ],
      sources: ["nasa", "esa", "iau", "gaia", "simbad"],
      keywords: ["open cluster", "globular cluster", "Pleiades", "main-sequence turn-off"],
    },
    {
      slug: "space-missions",
      name: "Space Missions",
      summary: "Robotic and crewed journeys that explore the Solar System and beyond.",
      overview:
        "A space mission is an organised effort to explore, observe or operate in space using crewed or robotic spacecraft. Missions are shaped as much by orbital mechanics and launch windows as by scientific goals — the physics constrains what is possible and when.",
      keyPoints: [
        "Mission architecture is chosen by energy cost: flyby, orbiter, lander, rover and sample return each demand far more than the last.",
        "Launch windows are set by planetary alignment, not by readiness — miss one and the next may be years away.",
        "Gravity assists make outer Solar System missions possible with existing launch vehicles.",
        "Communication delay makes real-time control impossible beyond the Moon, so spacecraft must operate autonomously.",
      ],
      body: [
        {
          heading: "Mission architectures, in order of difficulty",
          list: [
            "Flyby: the spacecraft passes the target once. Cheapest in energy, but the encounter is brief and unrepeatable. Voyager and New Horizons are flyby missions.",
            "Orbiter: the spacecraft must shed enough velocity to be captured, which requires carrying propellant or using aerobraking. In exchange it gets sustained, repeated observation.",
            "Lander: descent and controlled touchdown add substantial complexity, and atmospheric entry adds thermal protection and a narrow margin for error.",
            "Rover: a lander that must also survive, navigate and operate over an extended surface mission.",
            "Sample return: the full sequence plus ascent from the target, return cruise, and Earth entry — by a wide margin the most demanding architecture, and the only one giving laboratory access to the material.",
          ],
        },
        {
          heading: "Why launch windows exist",
          paragraphs: [
            "Reaching another planet efficiently requires launching when the geometry allows a transfer orbit that intersects the target's position on arrival. For Mars this recurs roughly every 26 months; for outer planets, favourable alignments allowing multiple gravity assists can be decades apart.",
            "The Voyager missions exploited an alignment of the outer planets that occurs about every 175 years, which is why Voyager 2 could visit Jupiter, Saturn, Uranus and Neptune in sequence. Missing a window is not a schedule slip but a multi-year delay, which is why launch dates drive mission programmes so heavily.",
          ],
        },
        {
          heading: "Gravity assists",
          paragraphs: [
            "A spacecraft passing close to a planet can exchange momentum with it, gaining or losing heliocentric velocity without expending propellant. The planet loses a corresponding but utterly negligible amount, since the mass ratio is enormous.",
            "This technique is what makes outer Solar System exploration practical. Cassini used flybys of Venus, Venus again, Earth and Jupiter to reach Saturn; the Parker Solar Probe uses repeated Venus flybys to lose energy and spiral closer to the Sun. Without gravity assists, most planetary missions would require launch vehicles that do not exist.",
          ],
        },
        {
          heading: "Operating at a distance",
          paragraphs: [
            "Light takes minutes to hours to reach the outer Solar System, so real-time control is impossible. Spacecraft execute stored command sequences and must handle faults autonomously, entering safe modes and awaiting instructions. Entry, descent and landing on Mars must be fully autonomous because the signal round trip exceeds the entire descent duration.",
            "Communication itself depends on ground infrastructure — NASA's Deep Space Network and equivalent facilities — with large antennas tracking spacecraft across the sky. Data rates fall with the square of distance, which is why missions to the outer Solar System return data slowly for months or years after an encounter.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why do missions to Mars only launch every couple of years?",
          answer:
            "Because an efficient transfer requires Earth and Mars to be positioned so that the spacecraft arrives where Mars will be. That geometry recurs roughly every 26 months. Launching outside the window would demand far more energy than available launch vehicles can supply for a useful payload.",
        },
        {
          question: "How does a gravity assist work?",
          answer:
            "The spacecraft passes close to a moving planet and exchanges momentum with it, leaving with a different velocity relative to the Sun. Energy is conserved overall — the planet's orbit changes by an immeasurably small amount because of the mass ratio. It costs no propellant, which is what makes outer Solar System missions feasible.",
        },
        {
          question: "Can mission controllers steer a spacecraft in real time?",
          answer:
            "Only near Earth. Beyond the Moon, signal delay makes it impossible — Mars is minutes away each direction, the outer planets hours. Spacecraft run stored command sequences and handle faults autonomously. A Mars landing must be fully self-directed because the whole descent finishes before the first telemetry from it arrives.",
        },
        {
          question: "What is the hardest kind of mission?",
          answer:
            "Sample return. It requires everything a landing mission requires, plus ascent from the target body, a return cruise, and safe Earth entry — each stage a potential single point of failure. The scientific payoff is that laboratory instruments vastly exceed what any spacecraft can carry.",
        },
      ],
      explore: [
        { label: "Exploration catalogue", href: "/exploration", blurb: "Missions, programmes, and agencies as entities." },
        { label: "Mission operations", href: "/mission-operations", blurb: "How missions are flown day to day." },
        { label: "Deep Space Network", href: "/deep-space-network", blurb: "The antennas that keep spacecraft in contact." },
        { label: "Spaceflight timeline", href: "/timeline", blurb: "Missions in chronological order." },
      ],
      sources: ["nasa", "esa", "jpl", "jaxa"],
      keywords: ["robotic missions", "exploration", "flyby", "gravity assist", "sample return"],
    },
    {
      slug: "spacecraft",
      name: "Spacecraft",
      summary: "The vehicles and probes built to travel and work in space.",
      overview:
        "A spacecraft is a vehicle designed to operate in space. Whatever its mission, it must solve the same set of problems — power, propulsion, thermal control, attitude, communication and data handling — under constraints that have no terrestrial equivalent.",
      keyPoints: [
        "Mass is the dominant design constraint, because every kilogram must be accelerated to orbital velocity.",
        "There is no air in space, so all waste heat must be radiated — thermal control is a major subsystem, not an afterthought.",
        "Solar power becomes impractical in the outer Solar System, which is why distant missions use radioisotope generators.",
        "Redundancy and radiation tolerance drive component choices that look decades out of date by consumer standards.",
      ],
      body: [
        {
          heading: "The core subsystems",
          list: [
            "Structure: carries launch loads, which are usually far more severe than anything encountered in flight.",
            "Power: solar arrays with batteries for eclipse periods, or radioisotope thermoelectric generators where sunlight is too weak.",
            "Propulsion: chemical thrusters for large manoeuvres, and increasingly electric propulsion for high-efficiency low-thrust operation over long durations.",
            "Attitude determination and control: star trackers, sun sensors and gyroscopes to know orientation; reaction wheels and thrusters to change it.",
            "Thermal control: radiators, multilayer insulation, louvres and heaters, to keep every component within its operating range.",
            "Communications: high-gain antennas for data, low-gain for robust contact in unfavourable orientations.",
            "Command and data handling: the onboard computer, plus storage for data acquired faster than it can be transmitted.",
          ],
        },
        {
          heading: "Thermal control, the underrated problem",
          paragraphs: [
            "In vacuum there is no convection and no conduction to the surroundings, so radiation is the only way to shed heat. A spacecraft in sunlight absorbs energy continuously while its electronics generate more, and the same vehicle in shadow can cool rapidly toward very low temperatures.",
            "Managing this requires careful selection of surface coatings, multilayer insulation blankets, radiators positioned to face cold space, and often active heaters running on scarce power. Instruments have narrow operating ranges, and infrared detectors must be cooled far below ambient — JWST's sunshield exists to keep its optics near 40 kelvin, and it is the largest single structure on the observatory.",
          ],
        },
        {
          heading: "Why spacecraft electronics look obsolete",
          paragraphs: [
            "Flight computers routinely use processors that would be considered antique in consumer terms. This is deliberate. Radiation-hardened parts must tolerate charged particles that flip bits and degrade semiconductors, and hardening requires larger feature sizes and mature designs. Qualification and flight heritage take years, and a component with a long successful record is worth more than raw performance.",
            "Redundancy compounds the effect. Critical systems are duplicated, sometimes with dissimilar designs, and the extra mass and power that costs must be justified against everything else on the vehicle. The result is machines that are slow by earthbound standards and extraordinarily reliable in an environment where repair is impossible.",
          ],
        },
        {
          heading: "Propulsion trade-offs",
          paragraphs: [
            "Chemical propulsion delivers high thrust for short durations and is required for launch, orbital insertion and landing. Its efficiency, measured as specific impulse, is limited by chemistry.",
            "Electric propulsion — ion and Hall-effect thrusters — accelerates propellant electrically to far higher exhaust velocities, achieving several times the efficiency but at tiny thrust levels. It cannot lift anything off a surface, but firing continuously for months or years it can deliver a large total velocity change with very little propellant mass. Dawn used it to orbit two separate main-belt bodies in one mission, which chemical propulsion could not have achieved.",
          ],
        },
      ],
      faqs: [
        {
          question: "How do spacecraft get electrical power?",
          answer:
            "Most use solar arrays with batteries to cover eclipse periods. Sunlight intensity falls as the square of distance from the Sun, so beyond roughly Jupiter solar power becomes impractical for many missions, and spacecraft use radioisotope thermoelectric generators instead — converting heat from radioactive decay directly into electricity, as Voyager, Cassini and the Mars rover Curiosity do.",
        },
        {
          question: "Why do spacecraft use such old processors?",
          answer:
            "Because radiation tolerance and flight heritage matter more than speed. Charged particles flip bits and degrade modern high-density chips, so radiation-hardened parts use larger, more robust feature sizes. Qualifying a component takes years, and a design with a long record of successful operation is more valuable than raw performance in an environment where repair is impossible.",
        },
        {
          question: "How do spacecraft stay cool without air?",
          answer:
            "By radiating heat to space, which is the only mechanism available in vacuum. Designers use radiators facing away from the Sun, multilayer insulation, and carefully chosen surface coatings, together with heaters for components that would otherwise get too cold. Infrared instruments need additional active or passive cooling to reach the very low temperatures they require.",
        },
        {
          question: "What is ion propulsion and why use it?",
          answer:
            "It accelerates ionised propellant with electric fields, achieving exhaust velocities several times higher than chemical rockets and therefore using far less propellant for the same velocity change. Thrust is tiny — comparable to the weight of a sheet of paper — so it only works over months or years of continuous firing, but for deep-space missions that trade is often decisive.",
        },
      ],
      explore: [
        { label: "Spacecraft systems", href: "/spacecraft-systems", blurb: "Subsystems and components as catalogued entities." },
        { label: "Space engineering", href: "/space-engineering", blurb: "Design practice, testing, and qualification." },
        { label: "Rockets", href: "/rockets", blurb: "Launch vehicles, engines, and propellants." },
        { label: "Instruments", href: "/instruments", blurb: "The scientific payloads spacecraft carry." },
      ],
      sources: ["nasa", "esa", "jpl"],
      keywords: ["probe", "rover", "orbiter", "ion propulsion", "radiation hardening"],
    },
    {
      slug: "space-telescopes",
      name: "Space Telescopes",
      summary: "Observatories in orbit, above the blur of the atmosphere.",
      overview:
        "A space telescope observes from above Earth's atmosphere, which both blurs images and absorbs most of the electromagnetic spectrum outright. Different observatories are built for different wavelength ranges, because the detector technology and optics required vary enormously across the spectrum.",
      keyPoints: [
        "The atmosphere blocks ultraviolet, X-ray, gamma-ray and much infrared light entirely — those wavelengths are only observable from space.",
        "Above the atmosphere a telescope reaches its diffraction limit continuously, with no waiting for good seeing.",
        "JWST operates near the Sun–Earth L2 point, roughly 1.5 million kilometres out, and cannot be serviced.",
        "Hubble's servicing missions are the reason it remained scientifically current for decades.",
      ],
      body: [
        {
          heading: "Why go to orbit at all",
          paragraphs: [
            "Two independent reasons. First, atmospheric turbulence blurs images from the ground; a space telescope is limited only by its optics and reaches its diffraction limit continuously. Adaptive optics has narrowed this gap substantially for large ground telescopes, but only over restricted fields and in favourable conditions.",
            "Second, and more fundamentally, the atmosphere is opaque across most of the spectrum. Ultraviolet, X-ray and gamma-ray astronomy are impossible from the ground at any aperture, and much of the infrared is absorbed by atmospheric water vapour. No ground-based improvement can recover wavelengths that never arrive.",
          ],
        },
        {
          heading: "Where they orbit, and why it matters",
          list: [
            "Low Earth orbit: accessible for servicing, as Hubble was, but Earth blocks part of the sky and the thermal environment cycles rapidly with each orbit.",
            "Sun–Earth L2, about 1.5 million kilometres beyond Earth: Sun, Earth and Moon stay in roughly the same direction, so a single sunshield can block all three and allow passive cooling to very low temperatures. JWST, Gaia, Planck and Euclid use this region. It is far beyond any crewed servicing capability.",
            "Earth-trailing heliocentric orbit: used by Spitzer and Kepler, giving a stable thermal environment and unobstructed sky at the cost of a steadily increasing communication distance.",
            "Highly elliptical orbits: used by some X-ray observatories such as Chandra to spend most of the time outside Earth's radiation belts.",
          ],
        },
        {
          heading: "Different wavelengths, different machines",
          paragraphs: [
            "Optical and ultraviolet telescopes use conventional reflecting optics. Infrared telescopes must be cold, because a warm instrument glows in exactly the band it is trying to observe — hence JWST's five-layer sunshield and its operating temperature near 40 kelvin.",
            "X-ray photons pass straight through ordinary mirrors at normal incidence, so X-ray telescopes use grazing-incidence optics: nested shells that deflect photons at very shallow angles, as Chandra and XMM-Newton do. Gamma rays cannot be focused at all by any mirror, so gamma-ray observatories such as Fermi use coded masks or particle-tracking detectors and reconstruct arrival directions computationally.",
          ],
        },
        {
          heading: "What they have produced",
          paragraphs: [
            "Hubble, launched in 1990 and upgraded across several shuttle servicing missions, delivered the deep field observations that constrained galaxy evolution, refined the extragalactic distance scale, and contributed to the discovery of cosmic acceleration. Its serviceability is why it stayed at the frontier for decades — an option no L2 observatory has.",
            "Kepler and TESS turned exoplanet detection into a statistical science by monitoring vast numbers of stars photometrically. Gaia is measuring positions, parallaxes and motions for more than a billion stars, and its data underpins a large share of the stellar parameters catalogued on this platform. JWST has extended infrared sensitivity far enough to characterise exoplanet atmospheres and observe galaxies at very high redshift.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why is JWST so far from Earth?",
          answer:
            "Because it observes in the infrared and must stay extremely cold. At the Sun–Earth L2 region, about 1.5 million kilometres beyond Earth, the Sun, Earth and Moon all lie in roughly the same direction, so a single sunshield blocks all three and lets the telescope cool passively to around 40 kelvin. The cost of that location is that servicing is not possible.",
        },
        {
          question: "Can Hubble be repaired again?",
          answer:
            "Not with current capability. Its five servicing missions were flown by the Space Shuttle, which was retired in 2011, and no operational vehicle is currently equipped for the task. Hubble continues to operate on its existing hardware, with its orbit gradually decaying.",
        },
        {
          question: "Is JWST a replacement for Hubble?",
          answer:
            "No — they observe different wavelengths. JWST is optimised for infrared, extending to ranges Hubble cannot reach, which is what lets it see very distant redshifted galaxies and cool objects. Hubble covers ultraviolet and visible light, where JWST has little or no capability. They are complementary instruments, and both were designed to be.",
        },
        {
          question: "Why can't X-ray telescopes use normal mirrors?",
          answer:
            "Because X-ray photons are energetic enough to pass through or be absorbed by a mirror surface struck head-on. They can only be reflected at very shallow grazing angles, so X-ray telescopes use nested cylindrical shells that deflect photons through small angles onto a focus — a geometry that looks nothing like a conventional telescope.",
        },
      ],
      explore: [
        { label: "Observatories", href: "/observatories", blurb: "Space and ground observatories with instruments." },
        { label: "Instruments", href: "/instruments", blurb: "Cameras, spectrographs, and detectors." },
        { label: "Data archives", href: "/data-archives", blurb: "Where the observations are published and preserved." },
        { label: "Images", href: "/images", blurb: "Licensed imagery from these observatories." },
      ],
      sources: ["nasa", "esa", "stsci", "esa-hubble", "esa-webb"],
      keywords: ["orbital telescope", "Hubble", "James Webb", "L2", "grazing incidence"],
    },
    {
      slug: "observatories",
      name: "Observatories",
      summary: "Ground-based sites built to study the sky.",
      overview:
        "An observatory is a facility equipped for astronomical observation. Site selection is as consequential as instrument design: altitude, dryness, atmospheric stability and darkness determine what a telescope can achieve before a single optical component is chosen.",
      keyPoints: [
        "The best optical sites are high, dry, dark and — above all — atmospherically stable.",
        "Seeing, the blurring caused by turbulence, is the property that most limits ground-based resolution.",
        "Radio observatories need radio quiet rather than darkness, which drives them to remote inland regions.",
        "Growing light pollution and satellite constellations are measurable threats to existing sites.",
      ],
      body: [
        {
          heading: "What makes a good site",
          list: [
            "Altitude: being above a significant fraction of the atmosphere reduces absorption and turbulence, and is essential for infrared and submillimetre work.",
            "Dryness: atmospheric water vapour absorbs infrared strongly. The driest high-altitude sites, such as the Atacama, are the only viable locations for some wavelengths.",
            "Stable airflow: smooth laminar flow gives good seeing. Coastal mountains with a temperature inversion above cold ocean currents — Chile, Hawai'i, the Canary Islands — are favoured for exactly this reason.",
            "Darkness: distance from artificial lighting, and ideally legal protection of the surrounding sky.",
            "Clear nights: a high fraction of usable nights per year, which is what makes desert and subtropical high-pressure regions attractive.",
          ],
        },
        {
          heading: "The major optical sites",
          paragraphs: [
            "Northern Chile hosts an exceptional concentration of facilities — Paranal, La Silla, Cerro Tololo, Cerro Pachón and the ALMA plateau — because the Atacama combines extreme dryness, high altitude and stable air. Mauna Kea in Hawai'i and Roque de los Muchachos in La Palma are the other principal optical sites, both high volcanic peaks above a marine inversion layer.",
            "Site development is not only a technical question. Mauna Kea in particular is a site of significant cultural importance to Native Hawaiians, and telescope construction there has been the subject of sustained dispute. Recording that is part of describing the facility honestly.",
          ],
        },
        {
          heading: "Radio observatories have different requirements",
          paragraphs: [
            "Radio astronomy is unaffected by daylight or cloud, so darkness and clear skies are irrelevant. What matters is freedom from human-generated radio interference, which is why major facilities sit in remote inland areas, often inside legally protected radio quiet zones.",
            "Radio telescopes also gain resolution by interferometry: linking widely separated dishes so that the effective aperture is the separation between them. Very long baseline interferometry links antennas across continents, and the Event Horizon Telescope extended that to an Earth-sized synthetic aperture, which is what made horizon-scale black hole imaging possible.",
          ],
        },
        {
          heading: "Threats to existing sites",
          paragraphs: [
            "Light pollution has increased measurably at many established observatories as nearby settlements have grown. It raises sky background and disproportionately harms observations of faint extended objects; some observatories now depend on local lighting ordinances to remain viable.",
            "Large satellite constellations are a newer concern. Bright satellites leave trails across long exposures and are a particular problem for wide-field survey instruments, and their radio emissions can affect radio observatories. Mitigation efforts — darkening treatments, orbit and orientation changes, and software rejection of affected pixels — reduce but do not eliminate the impact, and the scale of the problem grows with the number of satellites launched.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why are observatories built on mountains?",
          answer:
            "To get above part of the atmosphere. Higher sites have less air to look through, less water vapour absorbing infrared, and — where a marine inversion layer produces smooth laminar airflow — better seeing. Altitude also usually means distance from urban lighting.",
        },
        {
          question: "What is astronomical seeing?",
          answer:
            "The blurring of images caused by turbulence in Earth's atmosphere, measured as the apparent angular size a point source is smeared into. At an excellent site it is around half an arcsecond or better; typical locations are worse. It is the property that most limits ground-based resolution, and it is the problem adaptive optics exists to solve.",
        },
        {
          question: "Why are radio telescopes in remote places if radio waves pass through clouds?",
          answer:
            "Because the threat is interference, not weather. Radio telescopes detect extraordinarily faint natural signals that are easily swamped by transmitters, mobile networks and even electrical noise from vehicles and appliances. Remote inland locations, often inside legally designated radio quiet zones, minimise that contamination.",
        },
        {
          question: "Are satellite constellations affecting astronomy?",
          answer:
            "Yes, measurably. Bright satellites leave trails across long exposures, which is especially damaging for wide-field survey telescopes, and their radio transmissions can interfere with radio observatories. Operators have implemented darkening and orientation mitigations that reduce brightness, but the impact scales with the number of satellites in orbit.",
        },
      ],
      explore: [
        { label: "Observatories catalogue", href: "/observatories", blurb: "Facilities, telescopes, and sites as entities." },
        { label: "Observatory frontier", href: "/observatory-frontier", blurb: "Next-generation facilities and detectors." },
        { label: "Instruments", href: "/instruments", blurb: "The instruments mounted on these telescopes." },
        { label: "Institutions", href: "/institutions", blurb: "The organisations that operate them." },
      ],
      sources: ["eso", "noirlab", "nasa", "britannica"],
      keywords: ["telescope", "radio astronomy", "dark sky", "seeing", "Atacama"],
    },
    {
      slug: "astronomers",
      name: "Astronomers",
      summary: "The scientists who study the universe — a working directory.",
      overview:
        "Astronomy is done by people, and understanding how the profession actually works clarifies how astronomical knowledge is produced, checked and published. This topic covers the working structure of the field; the Encyclopedia covers biography and narrative history.",
      keyPoints: [
        "Most professional astronomers spend far more time analysing archived data than observing at a telescope.",
        "Telescope time is allocated competitively by peer review, typically oversubscribed several times over.",
        "Almost all major results now come from collaborations, not individuals.",
        "Amateur observers still make genuine contributions in specific areas, particularly time-domain monitoring.",
      ],
      body: [
        {
          heading: "What the work actually consists of",
          paragraphs: [
            "The popular image of an astronomer at an eyepiece is roughly a century out of date. Most professional work is data analysis: writing code, calibrating and reducing observations, running simulations, and comparing results with models. Observing runs are a small fraction of the time even for observational astronomers, and many are conducted remotely or executed in queue mode by observatory staff.",
            "A large and growing share of research uses archival data that someone else obtained. Major observatories mandate public release after a proprietary period, so datasets keep producing results long after the original programme concludes — often results the original team never anticipated.",
          ],
        },
        {
          heading: "How telescope time is obtained",
          paragraphs: [
            "Observing time on major facilities is allocated by competitive proposal. Astronomers submit a scientific case and technical justification, and a time allocation committee of peers ranks them. Oversubscription factors of several to one are normal, so most proposals for the most sought-after instruments are declined.",
            "Some observatories use dual-anonymous review, in which proposers and reviewers are both anonymised. This was introduced after analysis of proposal outcomes indicated systematic differences correlated with applicant identity rather than proposal quality, and measured outcomes shifted after the change.",
          ],
        },
        {
          heading: "Publication and verification",
          list: [
            "Results are submitted to peer-reviewed journals, and preprints are almost universally posted to arXiv, often before formal acceptance.",
            "The NASA Astrophysics Data System indexes the literature and provides the bibcodes used as citation identifiers throughout this platform.",
            "Independent confirmation matters more than the original claim. A single detection at the limit of sensitivity is provisional until reproduced by a different instrument or team.",
            "Retraction and revision are normal parts of the process. Claimed detections of exoplanets, atmospheric species and transient events have all been withdrawn after further data.",
          ],
        },
        {
          heading: "Collaborations and amateurs",
          paragraphs: [
            "Large facilities produce large collaborations. Gravitational-wave and particle-astrophysics papers can carry over a thousand authors, reflecting the reality that no individual builds a detector, operates it, and analyses its output alone. This has changed what authorship means in the field and how credit is attributed.",
            "Amateur astronomers still contribute genuine data, particularly where sustained monitoring matters more than aperture: variable star photometry submitted to organisations such as the AAVSO, discovery and follow-up of comets and novae, occultation timing that constrains asteroid shapes, and citizen-science classification projects that process survey data at scales automated methods alone handle poorly.",
          ],
        },
      ],
      faqs: [
        {
          question: "Do professional astronomers still look through telescopes?",
          answer:
            "Rarely through an eyepiece. Data is recorded electronically, and observations are increasingly conducted remotely or executed in queue mode by observatory staff who schedule programmes according to conditions. Most research time goes to calibration, analysis, simulation and writing rather than to being at a telescope.",
        },
        {
          question: "How do astronomers get time on big telescopes?",
          answer:
            "By competitive proposal. A scientific and technical case is submitted, and a peer committee ranks proposals for a limited allocation. The most sought-after instruments are oversubscribed several times over, so most requests are declined. Some observatories now use dual-anonymous review after evidence that outcomes correlated with applicant identity.",
        },
        {
          question: "Can amateur astronomers contribute real science?",
          answer:
            "Yes, in specific areas. Sustained monitoring of variable stars, discovery and follow-up of comets and novae, occultation timing that constrains asteroid sizes and shapes, and participation in citizen-science classification projects all produce data used in published research. What amateurs supply is sky coverage and persistence, which large facilities cannot provide for every target.",
        },
      ],
      explore: [
        { label: "History catalogue", href: "/history", blurb: "Astronomers and their publications as entities." },
        { label: "Institutions", href: "/institutions", blurb: "Observatories, agencies, and professional bodies." },
        { label: "Citizen astronomy", href: "/citizen-astronomy", blurb: "Programmes where non-professionals contribute data." },
        { label: "Data archives", href: "/data-archives", blurb: "The public archives that make reanalysis possible." },
      ],
      sources: ["iau", "britannica", "ads", "nasa"],
      keywords: ["scientists", "researchers", "astrophysicists", "peer review", "telescope time"],
    },
  ],
};
