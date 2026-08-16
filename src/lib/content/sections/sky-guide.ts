import type { Section } from "@/lib/content/types";

/**
 * Sky Guide — practical, observational astronomy.
 *
 * Science-based and evidence-led. These pages explain the mechanism behind
 * each recurring sky phenomenon; the computed and reference readouts live
 * under /sky, which each category links to. Where a value genuinely depends on
 * the observer's location and the current moment, these pages explain how it
 * is derived rather than presenting a simulated figure.
 */
export const skyGuide: Section = {
  slug: "sky-guide",
  name: "Sky Guide",
  kind: "science",
  accent: "aurora",
  tagline: "What to see in the sky, and when.",
  description:
    "Know what's happening overhead: moon phases, meteor showers, eclipses, planet visibility, and the events worth looking up for.",
  intro:
    "The Sky Guide helps you observe the real sky. It collects the recurring events and the physics behind them — from tonight's planets to the next eclipse — and links to the computed and reference readouts under /sky. Timing and visibility data are drawn from authoritative almanac sources or computed from published algorithms, never simulated.",
  categories: [
    {
      slug: "night-sky-tonight",
      name: "Night Sky Tonight",
      summary: "A guide to what's visible after dark right now.",
      overview:
        "What is observable on any given night comes down to four things: where you are, what time it is, what phase the Moon is in, and which planets happen to be above the horizon. Understanding those four variables lets you work out the sky for yourself rather than depending on a lookup.",
      keyPoints: [
        "The Moon is the single biggest factor for faint objects — a bright Moon rules out galaxies and nebulae entirely.",
        "Stars rise about four minutes earlier each night, which is why the sky shifts through the seasons.",
        "Planets are found along the ecliptic, so learning that line tells you where to look.",
        "Anything below about 20–30 degrees altitude is being viewed through several times more atmosphere.",
      ],
      body: [
        {
          heading: "The four variables",
          list: [
            "Latitude fixes which part of the celestial sphere is ever visible from where you stand, and which circumpolar constellations never set.",
            "Date determines which constellations are on the night side of Earth. The sky returns to the same configuration about four minutes earlier each night — roughly two hours earlier per month.",
            "Time of night sets how far the sky has rotated. An object near the eastern horizon at dusk will be high overhead several hours later.",
            "Moon phase sets the sky background. Around full Moon, faint extended objects are effectively unobservable regardless of your equipment.",
          ],
        },
        {
          heading: "Start with the brightest things",
          paragraphs: [
            "On any clear night, work down the brightness ladder. The Moon if it is up. Then the bright planets — Venus never strays far from the Sun so it appears low after sunset or before sunrise; Jupiter and Saturn are steady non-twinkling points; Mars is unmistakably orange when well placed.",
            "Then the brightest stars, which are the anchors of the seasonal constellations: Sirius, Vega, Arcturus, Capella, Rigel, Betelgeuse. Once you can name four or five of these on sight, you can navigate to anything else by star-hopping from them.",
          ],
        },
        {
          heading: "Why the sky changes through the year",
          paragraphs: [
            "Earth orbits the Sun once a year, so the night side of the planet faces a slowly changing direction in space. A star that culminates at midnight in December will culminate at dusk in March and be lost in daylight by June.",
            "This is why constellations are seasonal, and why the same sky returns on the same date each year. It is also why Orion is a winter constellation in the Northern Hemisphere and a summer one in the Southern — the difference is not the sky but which season is dark at the right hours.",
          ],
        },
        {
          heading: "Getting the actual numbers",
          paragraphs: [
            "Rise and set times, twilight boundaries, Moon phase and planetary positions all depend on your exact location and the current moment, and they are computed from well-established algorithms rather than looked up. The platform's sky pages compute these from published ephemeris methods and state their validity horizon, so a reading is never presented as more current than it is.",
            "Asteria Star does not publish simulated positions or invented times. Where a value cannot be computed honestly, the page says so instead of filling the space.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why does the night sky look different from month to month?",
          answer:
            "Because Earth moves around its orbit, so the night side of the planet faces a gradually changing direction in space. Each night the same star reaches a given position about four minutes earlier, which accumulates to roughly two hours per month. Over a year the cycle completes and the sky returns to where it started.",
        },
        {
          question: "What can I see without any equipment?",
          answer:
            "A great deal. The Moon in detail along the terminator, five planets when they are well placed, several thousand stars from a dark site, the Milky Way, meteor showers, the Andromeda Galaxy at the naked-eye limit, satellites including the ISS, and occasional bright comets. Light pollution is the limiting factor far more than equipment.",
        },
        {
          question: "Why do I need to know my latitude?",
          answer:
            "Because it determines which part of the sky is ever visible from where you are. From mid-northern latitudes the far southern sky never rises, and constellations close to the north celestial pole never set. Latitude also sets how high any given object climbs, which affects how much atmosphere you are looking through.",
        },
      ],
      explore: [
        { label: "Tonight's sky", href: "/sky/night-sky-tonight", blurb: "The computed readout, with its validity window stated." },
        { label: "Observing", href: "/observing", blurb: "Practical technique for getting more out of a session." },
        { label: "Constellations", href: "/constellations", blurb: "All 88, with seasonal visibility." },
        { label: "Beginner astronomy", href: "/guides/beginner-astronomy", blurb: "Start-here guide for newcomers." },
      ],
      sources: ["usno", "nasa", "iau"],
      keywords: ["stargazing tonight", "what's up", "sky tonight"],
    },
    {
      slug: "moon-phase",
      name: "Moon Phase",
      summary: "The Moon's cycle from new to full and back.",
      overview:
        "The Moon's phase is a geometry problem, not a shadow problem. Half the Moon is always lit by the Sun; what changes is how much of that lit hemisphere faces Earth as the Moon moves around its orbit.",
      keyPoints: [
        "Phases are caused by viewing geometry, not by Earth's shadow — that is a lunar eclipse, which is a different event.",
        "The full cycle takes about 29.5 days, which is longer than the Moon's 27.3-day orbit.",
        "Phase determines when the Moon is up: a full Moon rises at sunset, a new Moon is up all day.",
        "The same hemisphere always faces Earth because the Moon is tidally locked.",
      ],
      body: [
        {
          heading: "Why phases happen",
          paragraphs: [
            "The Sun always illuminates exactly half of the Moon. As the Moon orbits Earth, the angle between Sun, Moon and observer changes, so we see varying fractions of that illuminated hemisphere. At new Moon the lit side faces away from us; at full Moon it faces us directly; at the quarters we see half of it.",
            "This is worth stating explicitly because the most common misconception is that Earth's shadow causes phases. It does not. Earth's shadow falling on the Moon is a lunar eclipse, which happens at most a few times a year and only ever at full Moon.",
          ],
        },
        {
          heading: "Two different months",
          paragraphs: [
            "The Moon completes one orbit relative to the stars in about 27.3 days — the sidereal month. But the phase cycle takes about 29.5 days — the synodic month.",
            "The difference exists because Earth has also moved along its own orbit during that time, so the Moon must travel a little further to return to the same alignment with the Sun. The two-day gap is a direct consequence of Earth's motion and is the reason lunar calendars drift against solar ones.",
          ],
        },
        {
          heading: "Phase tells you when the Moon is up",
          list: [
            "New Moon rises around sunrise and sets around sunset — it is in the daytime sky and invisible in the Sun's glare.",
            "First quarter rises around noon, is highest at sunset, and sets around midnight. Best placed for early-evening observing.",
            "Full Moon rises at sunset and sets at sunrise — up all night, and the worst time for faint deep-sky objects.",
            "Last quarter rises around midnight and is highest at sunrise, so it favours pre-dawn observers.",
            "A crescent Moon seen shortly after sunset is always waxing and in the west; one seen before sunrise is always waning and in the east.",
          ],
        },
        {
          heading: "Observing the Moon well",
          paragraphs: [
            "Counter-intuitively, full Moon is the poorest time to observe lunar detail. With the Sun directly behind the observer there are no shadows, and the surface appears flat and washed out. Near the quarters, sunlight strikes the terminator — the day/night boundary — at a grazing angle, throwing long shadows that make crater walls and mountain ranges stand out in relief.",
            "Supermoons occur when a full Moon coincides with perigee, the closest point of the Moon's slightly elliptical orbit. The difference in apparent diameter compared with an average full Moon is real but modest — a few percent — and far smaller than most photographs imply. The dramatic 'huge Moon on the horizon' effect is the Moon illusion, a perceptual phenomenon: the Moon's measured angular size is not larger near the horizon.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why does the Moon have phases?",
          answer:
            "Because we see varying fractions of its sunlit hemisphere as it orbits Earth. The Sun always lights exactly half the Moon; what changes is the viewing angle. Earth's shadow plays no part — when Earth's shadow does fall on the Moon, that is a lunar eclipse, a separate and much rarer event.",
        },
        {
          question: "Why is the phase cycle 29.5 days but the orbit only 27.3?",
          answer:
            "Because Earth moves too. In the 27.3 days the Moon takes to return to the same position relative to the stars, Earth has travelled about a twelfth of the way around the Sun, so the Moon needs roughly two extra days to return to the same Sun–Earth–Moon alignment that defines a phase.",
        },
        {
          question: "What is a supermoon?",
          answer:
            "A full Moon occurring near perigee, the closest point of its slightly elliptical orbit around Earth. The Moon is genuinely a few percent larger in apparent diameter and somewhat brighter than an average full Moon, but the difference is difficult to notice by eye and far less dramatic than most coverage suggests.",
        },
        {
          question: "Why does the Moon sometimes appear during the day?",
          answer:
            "Because it is above the horizon during daylight for much of the month. Only near full Moon is it up exclusively at night. A first-quarter Moon rises around noon, so it is easily visible in the afternoon sky — it simply competes with a bright background rather than being absent.",
        },
      ],
      explore: [
        { label: "Moon readout", href: "/sky/moon", blurb: "Computed phase and position, with validity horizon." },
        { label: "Lunar eclipses", href: "/sky-guide/lunar-eclipses", blurb: "When Earth's shadow does fall on the Moon." },
        { label: "Solar System", href: "/solar-system", blurb: "The Moon as a catalogued body with measured data." },
      ],
      sources: ["usno", "nasa", "noaa"],
      keywords: ["lunar phase", "full moon", "new moon", "synodic month", "supermoon"],
    },
    {
      slug: "meteor-showers",
      name: "Meteor Showers",
      summary: "When Earth passes through cometary debris streams.",
      overview:
        "A meteor shower happens when Earth passes through the trail of debris left behind by a comet or, in a few cases, an asteroid. Because the particles travel on parallel paths, perspective makes the resulting meteors appear to diverge from a single point in the sky — the radiant.",
      keyPoints: [
        "Shower meteors are typically sand-grain to pea-sized particles, not rocks.",
        "The radiant is a perspective effect, like railway tracks converging at the horizon.",
        "Quoted hourly rates assume ideal conditions and a radiant overhead — real counts are almost always lower.",
        "The best equipment for a meteor shower is a reclining chair.",
      ],
      body: [
        {
          heading: "Where the particles come from",
          paragraphs: [
            "As a comet approaches the Sun, sublimating ice lifts dust off the nucleus, and that dust spreads gradually along the comet's orbit to form a stream. When Earth's orbit intersects such a stream, particles enter the atmosphere at high speed and produce meteors.",
            "Because Earth crosses a given stream at the same point in its orbit each year, showers recur on the same calendar dates. The Perseids come from comet Swift–Tuttle, the Orionids and Eta Aquariids both from Halley's Comet — Earth crosses its orbit twice. The Geminids are unusual in originating from an asteroid, 3200 Phaethon, which may be a dormant comet.",
          ],
        },
        {
          heading: "Radiants and why they exist",
          paragraphs: [
            "Stream particles travel on essentially parallel paths. Seen from inside, perspective makes parallel lines appear to converge on a point — exactly as straight railway tracks appear to meet in the distance. That convergence point is the radiant, and the shower is named for the constellation containing it.",
            "A practical consequence: meteors near the radiant appear short because they are moving almost directly toward you, while those further away show longer trails. The best viewing direction is therefore not at the radiant but roughly 40 to 60 degrees away from it.",
          ],
        },
        {
          heading: "Reading a rate prediction honestly",
          paragraphs: [
            "Quoted rates are usually the zenithal hourly rate, which is a standardised figure: the number a single observer would see under a perfectly dark sky with the radiant directly overhead. Real observed counts are almost always lower, often substantially.",
            "The corrections that reduce it are light pollution, moonlight, the radiant's altitude above the horizon, and how much sky any one observer can actually watch. A shower advertised at 100 per hour may deliver 20 or 30 under realistic suburban conditions with the radiant partway up. Stating that plainly is more useful than repeating the headline number.",
          ],
        },
        {
          heading: "How to watch one",
          list: [
            "Go out after midnight if you can. Earth's rotation carries you onto the planet's leading side in the pre-dawn hours — the side sweeping head-on into the debris — so rates typically rise toward dawn.",
            "Check the Moon. A bright Moon can ruin an otherwise strong shower, and this is often more decisive than the predicted rate.",
            "Use no equipment at all. Binoculars and telescopes restrict your field of view, which is exactly the wrong trade for meteors.",
            "Lie back so you can watch a large area of sky comfortably for an extended period, and give your eyes 20–30 minutes to adapt.",
            "Allow at least an hour. Meteors arrive in clumps and lulls, and short sessions give badly unrepresentative counts.",
          ],
        },
      ],
      faqs: [
        {
          question: "What actually causes a meteor shower?",
          answer:
            "Earth passing through a stream of debris left along the orbit of a comet, or in a few cases an asteroid. The particles are typically sand-grain to pea-sized and burn up high in the atmosphere. Because Earth crosses each stream at the same orbital position annually, showers recur on the same dates each year.",
        },
        {
          question: "Why do meteors seem to come from one point?",
          answer:
            "Perspective. The particles travel on parallel paths, and parallel lines viewed from within appear to converge on a distant point — the same effect that makes railway tracks seem to meet. That convergence point is the radiant, and it gives the shower its name.",
        },
        {
          question: "Why do I see fewer meteors than the predicted rate?",
          answer:
            "Because published rates are zenithal hourly rates: a standardised figure assuming a perfectly dark sky and the radiant directly overhead. Light pollution, moonlight, a low radiant, and the fact that you can only watch part of the sky all reduce the real count, often to a fraction of the quoted number.",
        },
        {
          question: "Do I need a telescope to watch a meteor shower?",
          answer:
            "No — a telescope actively hurts. Meteors appear anywhere in the sky and last a fraction of a second, so you want the widest possible field of view, which means your unaided eyes. A reclining chair, warm clothing and dark-adapted vision are the useful equipment.",
        },
      ],
      explore: [
        { label: "Meteor showers", href: "/sky/meteor-showers", blurb: "Individual showers with radiants, parents, and dates." },
        { label: "Comets", href: "/comets", blurb: "The parent bodies that supply the debris streams." },
        { label: "Meteorites", href: "/meteorites", blurb: "The rarer objects that reach the ground." },
      ],
      sources: ["imo", "nasa", "iau"],
      keywords: ["Perseids", "Geminids", "shooting stars", "radiant", "zenithal hourly rate"],
    },
    {
      slug: "solar-eclipses",
      name: "Solar Eclipses",
      summary: "When the Moon passes between Earth and the Sun.",
      overview:
        "A solar eclipse happens when the Moon passes between the Sun and Earth and casts its shadow on the surface. It is possible only because of a coincidence: the Moon and the Sun appear almost exactly the same size in our sky. Never look at the Sun without proper protection.",
      keyPoints: [
        "The Sun is about 400 times wider than the Moon and about 400 times further away — an accident of the present epoch.",
        "Eclipses do not happen monthly because the Moon's orbit is tilted about five degrees.",
        "Totality is a genuinely different phenomenon from a 99% partial eclipse, not a slightly better version of it.",
        "Only during totality is it safe to look without a filter — at every other moment it is not.",
      ],
      body: [
        {
          heading: "The coincidence that makes totality possible",
          paragraphs: [
            "The Sun's diameter is roughly 400 times the Moon's, and it is roughly 400 times further away. The two therefore subtend almost the same angle in our sky — about half a degree — which is why the Moon can cover the Sun's disc almost exactly, revealing the corona without blocking it.",
            "There is nothing necessary about this. The Moon is receding from Earth by a few centimetres a year, and in the distant future it will be too small in the sky to produce a total eclipse. We happen to live during the era when it works.",
          ],
        },
        {
          heading: "The four types",
          list: [
            "Total: the Moon completely covers the photosphere, revealing the corona. Visible only from a narrow path, typically a few hundred kilometres wide, and lasting a few minutes at most at any one location.",
            "Annular: the Moon is near the far point of its elliptical orbit and appears slightly too small, leaving a bright ring of photosphere visible. The corona is not visible, and the sky does not darken appreciably.",
            "Partial: the observer is outside the central path and sees the Moon cover only part of the Sun.",
            "Hybrid: a rare case where the eclipse is annular at some points along the path and total at others, because of Earth's curvature.",
          ],
        },
        {
          heading: "Why not every month",
          paragraphs: [
            "The Moon passes between Earth and the Sun once per synodic month, so a naive expectation is a solar eclipse every new Moon. It does not happen because the Moon's orbital plane is tilted by about five degrees relative to Earth's orbital plane, so the Moon usually passes above or below the Sun as seen from Earth.",
            "An eclipse requires new Moon to occur near a node — one of the two points where the orbital planes intersect. That alignment recurs during eclipse seasons roughly every six months, and the geometry repeats approximately every 18 years and 11 days: the Saros cycle, which is how Babylonian astronomers predicted eclipses without knowing what caused them.",
          ],
        },
        {
          heading: "Safety, stated plainly",
          paragraphs: [
            "Looking at the Sun without proper protection can cause permanent retinal damage, and because the retina has no pain receptors, the injury occurs without any sensation of harm. Sunglasses, exposed film, smoked glass and improvised filters are not adequate. Use eclipse glasses meeting the ISO 12312-2 standard, or a properly designed solar filter fitted over the front of any optical instrument.",
            "Never point binoculars or a telescope at the Sun without a purpose-made front-mounted filter — the concentrated light can cause severe injury in a fraction of a second and will destroy eyepiece-mounted filters. Pinhole projection onto a card is completely safe and requires no equipment. The sole exception is the brief window of totality, when the photosphere is entirely covered; the moment the first sliver reappears, protection is required again.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why isn't there a solar eclipse every month?",
          answer:
            "Because the Moon's orbit is tilted about five degrees to Earth's orbital plane, so at most new Moons it passes above or below the Sun from our viewpoint. An eclipse needs new Moon to coincide with the Moon crossing one of the two nodes where the planes intersect, which happens during eclipse seasons roughly every six months.",
        },
        {
          question: "Is a 99% partial eclipse nearly as good as totality?",
          answer:
            "No — they are qualitatively different. Even one percent of the Sun's disc remains overwhelmingly bright, so the corona stays invisible, the sky does not truly darken, and filters remain mandatory throughout. Totality reveals the corona, drops the temperature noticeably, and brings out bright stars and planets. The difference is a change of kind, not degree.",
        },
        {
          question: "How can I watch a solar eclipse safely?",
          answer:
            "With eclipse glasses meeting the ISO 12312-2 standard, or a purpose-made solar filter mounted on the front of a telescope or binoculars, or by pinhole projection onto a card. Sunglasses, exposed film and smoked glass are not safe. Never use an unfiltered optical instrument. The only unprotected viewing is during totality itself, and protection must go back on the instant the Sun's edge reappears.",
        },
        {
          question: "What is an annular eclipse?",
          answer:
            "One where the Moon is near apogee — the far point of its elliptical orbit — and so appears slightly smaller than the Sun. Instead of covering the disc completely, it leaves a bright ring of photosphere visible around it. The corona cannot be seen, the sky does not darken much, and eye protection is required throughout.",
        },
      ],
      explore: [
        { label: "Solar eclipses", href: "/sky/eclipses/solar", blurb: "Eclipse geometry, types, and reference data." },
        { label: "Lunar eclipses", href: "/sky-guide/lunar-eclipses", blurb: "The other alignment, and why it is safe to watch." },
        { label: "Solar physics", href: "/solar-physics", blurb: "The corona and the Sun's outer atmosphere." },
      ],
      sources: ["nasa", "usno", "iau"],
      keywords: ["total eclipse", "annular eclipse", "eclipse safety", "Saros", "corona"],
    },
    {
      slug: "lunar-eclipses",
      name: "Lunar Eclipses",
      summary: "When the Moon passes through Earth's shadow.",
      overview:
        "A lunar eclipse occurs when Earth lies between the Sun and the Moon and the Moon passes through Earth's shadow. Unlike solar eclipses they are entirely safe to watch, last for hours, and are visible from the whole night side of Earth at once.",
      keyPoints: [
        "Lunar eclipses are visible to everyone on the night side of Earth, not from a narrow path.",
        "The Moon turns red rather than going dark because Earth's atmosphere refracts sunlight into the shadow.",
        "The red colour is, in effect, the light of every sunrise and sunset on Earth at once.",
        "They always occur at full Moon, and they are completely safe to observe unaided.",
      ],
      body: [
        {
          heading: "The geometry",
          paragraphs: [
            "At full Moon the Sun, Earth and Moon are roughly aligned with Earth in the middle. When that alignment is close enough — the Moon near an orbital node — the Moon enters Earth's shadow.",
            "That shadow has two parts. The penumbra is the region where Earth blocks part of the Sun's disc, producing only a subtle dimming that is often hard to notice. The umbra is where Earth blocks the Sun entirely, and it is entry into the umbra that produces a visibly darkened, reddened Moon.",
          ],
        },
        {
          heading: "Why the Moon turns red",
          paragraphs: [
            "Inside the umbra no direct sunlight reaches the Moon, so a naive expectation is that it should vanish. It does not, because Earth's atmosphere refracts sunlight around the planet's limb and into the shadow. Along that long grazing path through the atmosphere, shorter blue wavelengths are scattered out and longer red ones survive — the same physics that reddens a sunset.",
            "The light illuminating a totally eclipsed Moon is therefore the combined light of every sunrise and sunset occurring on Earth at that moment. The depth of colour varies with atmospheric conditions: major volcanic eruptions loading the stratosphere with aerosols have produced notably darker eclipses.",
          ],
        },
        {
          heading: "Types and duration",
          list: [
            "Penumbral: the Moon passes only through the outer shadow. The dimming is slight and easily missed.",
            "Partial: part of the Moon enters the umbra, producing a distinct dark bite with a curved edge.",
            "Total: the entire Moon enters the umbra and takes on the characteristic red colour. Totality can last well over an hour.",
            "Because Earth's umbra at the Moon's distance is several times wider than the Moon, lunar eclipses last far longer than solar ones and are visible from an entire hemisphere rather than a narrow track.",
          ],
        },
        {
          heading: "Observing them",
          paragraphs: [
            "No equipment or protection is needed — a lunar eclipse is simply the Moon, and it is dimmer than usual. Binoculars enhance the colour, and the curved edge of Earth's shadow crossing the lunar surface is clearly visible with the unaided eye.",
            "Aristotle used exactly that curved shadow as an argument that Earth is a sphere: only a sphere casts a circular shadow from every direction, whatever its orientation. It remains one of the most direct observations anyone can make of the shape of the planet they are standing on.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why does the Moon turn red during a total lunar eclipse?",
          answer:
            "Because Earth's atmosphere refracts sunlight around the planet into the shadow. That light travels a long grazing path through the atmosphere, which scatters out shorter blue wavelengths and lets longer red ones through — the same reason sunsets are red. The eclipsed Moon is lit by the combined light of every sunrise and sunset on Earth at that moment.",
        },
        {
          question: "Are lunar eclipses safe to look at?",
          answer:
            "Completely. You are looking at the Moon, which is dimmer than usual during an eclipse. No filters or protection are needed, and the event is comfortable to watch with the unaided eye, binoculars or a telescope for its full duration.",
        },
        {
          question: "Why are lunar eclipses seen by more people than solar eclipses?",
          answer:
            "Because Earth's shadow at the Moon's distance is several times wider than the Moon, so the whole night side of Earth sees the same eclipse simultaneously. A total solar eclipse, by contrast, casts a shadow only a few hundred kilometres wide that races across the surface, so only observers within that narrow path see totality.",
        },
        {
          question: "Why isn't there a lunar eclipse every full Moon?",
          answer:
            "Because the Moon's orbit is tilted about five degrees from Earth's orbital plane, so at most full Moons it passes above or below Earth's shadow. An eclipse requires the full Moon to occur near one of the nodes where the two planes intersect, which happens during eclipse seasons roughly every six months.",
        },
      ],
      explore: [
        { label: "Lunar eclipses", href: "/sky/eclipses/lunar", blurb: "Eclipse types and reference data." },
        { label: "Solar eclipses", href: "/sky-guide/solar-eclipses", blurb: "The other alignment, and how to watch it safely." },
        { label: "Moon phase", href: "/sky-guide/moon-phase", blurb: "Why eclipses only happen at full Moon." },
      ],
      sources: ["nasa", "usno"],
      keywords: ["blood moon", "umbra", "penumbra", "total lunar eclipse"],
    },
    {
      slug: "planet-visibility",
      name: "Planet Visibility",
      summary: "Which planets are visible, and where to look.",
      overview:
        "Five planets are readily visible without equipment, and where each appears depends on its orbit relative to Earth's. The inner planets are confined near the Sun; the outer ones can appear anywhere along the ecliptic and are best when opposite the Sun.",
      keyPoints: [
        "Mercury and Venus never appear far from the Sun, so they are always twilight objects.",
        "Outer planets are best at opposition, when Earth passes between them and the Sun.",
        "Planets do not twinkle much because they present a small disc rather than a point.",
        "Retrograde motion is a perspective effect from Earth overtaking an outer planet.",
      ],
      body: [
        {
          heading: "Inner planets are twilight objects",
          paragraphs: [
            "Mercury and Venus orbit inside Earth's orbit, so from our viewpoint they never appear far from the Sun. Venus reaches a maximum elongation of about 47 degrees, Mercury only about 28, which means both are visible only in the hours around sunrise or sunset.",
            "Venus is unmistakable when well placed — the brightest object in the sky after the Sun and Moon, and bright enough to be seen in daylight if you know exactly where to look. Mercury is genuinely difficult: never far from the horizon, always in twilight, and missed entirely by many observers over a lifetime.",
          ],
        },
        {
          heading: "Outer planets and opposition",
          paragraphs: [
            "Mars, Jupiter and Saturn orbit outside Earth's orbit and can therefore appear anywhere along the ecliptic, including directly opposite the Sun. That configuration — opposition — is the best time to observe them: the planet rises at sunset, is highest at midnight, and is at its closest approach to Earth for that cycle, hence largest and brightest.",
            "Mars varies far more than the others because its orbit is noticeably eccentric and its distance from Earth changes by a large factor. At a favourable opposition it is brilliant and orange; at other times it is a modest point of light. Jupiter and Saturn vary much less because they are so much further away that Earth's own orbital motion changes the distance proportionally little.",
          ],
        },
        {
          heading: "Recognising a planet",
          list: [
            "Planets generally do not twinkle strongly. They present a small disc rather than a true point, so atmospheric turbulence affects different parts of it independently and the effects average out.",
            "Planets lie close to the ecliptic. If a bright object is well away from that line, it is a star.",
            "They move against the background stars over days and weeks — the origin of the word 'planet', from the Greek for wanderer.",
            "Colour helps: Mars is distinctly orange, Venus and Jupiter are brilliant white, Saturn is a softer yellowish.",
          ],
        },
        {
          heading: "Retrograde motion",
          paragraphs: [
            "Planets normally drift eastward against the stars, but periodically they slow, reverse westward for some weeks, then resume. This retrograde motion is a perspective effect: Earth, on a faster inner orbit, overtakes the outer planet, and the line of sight swings backwards during the pass — much as a car being overtaken appears to move backwards relative to the more distant background.",
            "Explaining retrograde motion was the central problem of pre-Copernican astronomy, requiring epicycles in geocentric models. In a heliocentric arrangement it falls out of the geometry with no extra machinery, which is one of the strongest arguments Copernicus had.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why can I only see Venus near sunrise or sunset?",
          answer:
            "Because Venus orbits inside Earth's orbit, so from our viewpoint it never appears more than about 47 degrees from the Sun. That keeps it in the twilight sky — visible in the west after sunset or the east before sunrise, depending on where it is in its orbit, but never overhead at midnight.",
        },
        {
          question: "What does opposition mean and why does it matter?",
          answer:
            "Opposition is when Earth passes directly between an outer planet and the Sun, so the planet appears opposite the Sun in our sky. It rises at sunset, is highest around midnight, and is at its closest to Earth for that cycle — therefore at its largest and brightest. It is the best time to observe Mars, Jupiter or Saturn.",
        },
        {
          question: "How can I tell a planet from a star?",
          answer:
            "Planets usually shine with a steady light rather than twinkling, because they present a small disc rather than a point source. They also lie close to the ecliptic and shift position against the stars over days and weeks. Colour is a useful confirmation — Mars is distinctly orange, Venus and Jupiter brilliant white.",
        },
        {
          question: "Why do planets sometimes move backwards?",
          answer:
            "It is a perspective effect. Earth moves faster on its inner orbit and periodically overtakes an outer planet; during the overtaking, the line of sight swings backwards and the planet appears to reverse direction against the stars. Accounting for this apparent motion was the central difficulty of geocentric astronomy, and it emerges naturally from a heliocentric arrangement.",
        },
      ],
      explore: [
        { label: "Planet visibility", href: "/sky/planet-visibility", blurb: "Computed positions with validity horizons." },
        { label: "Solar System", href: "/solar-system", blurb: "The planets themselves, with measured data." },
        { label: "Celestial mechanics", href: "/celestial-mechanics", blurb: "Orbits, elongations, and configurations." },
      ],
      sources: ["usno", "jpl", "nasa"],
      keywords: ["visible planets", "Venus", "Jupiter visibility", "opposition", "retrograde"],
    },
    {
      slug: "iss-tracker",
      name: "ISS Tracker",
      summary: "Spotting the International Space Station overhead.",
      overview:
        "The International Space Station orbits Earth roughly every 90 minutes at about 400 kilometres altitude, and during favourable passes it is one of the brightest objects in the sky — a steady, fast-moving point that crosses from horizon to horizon in a few minutes.",
      keyPoints: [
        "The ISS shines by reflected sunlight, so it is only visible when it is sunlit and you are in darkness.",
        "That restricts sightings to roughly the couple of hours after sunset and before sunrise.",
        "It moves steadily and does not blink — aircraft blink, satellites do not.",
        "A pass that fades out mid-sky is the station entering Earth's shadow.",
      ],
      body: [
        {
          heading: "Why passes only happen at twilight",
          paragraphs: [
            "The ISS produces no visible light of its own; it reflects sunlight from its large solar arrays and structure. To see it you need two conditions at once: the station must be in sunlight, and your location must be dark enough for it to stand out.",
            "That combination only occurs when the Sun is below your horizon but still illuminating objects a few hundred kilometres up — roughly the first couple of hours after sunset and the last couple before sunrise. In the middle of the night the station passes through Earth's shadow and is invisible even when directly overhead.",
          ],
        },
        {
          heading: "What a pass looks like",
          paragraphs: [
            "The station appears as a steady white point, comparable to or brighter than the brightest stars, moving noticeably against the background — fast enough that motion is obvious within a second or two, but far slower than a meteor. A typical visible pass lasts around two to six minutes from horizon to horizon.",
            "It does not blink or flash. Aircraft carry flashing navigation lights; the ISS does not, and that is the quickest way to tell them apart. Passes often end with the station fading out partway across the sky rather than setting — that is the moment it crosses into Earth's shadow.",
          ],
        },
        {
          heading: "Getting accurate predictions",
          paragraphs: [
            "Pass times depend on your precise location and on the station's current orbit, which changes: atmospheric drag lowers it continuously and periodic reboosts raise it again, so predictions made from old orbital elements degrade within days.",
            "Accurate prediction therefore requires current two-line element sets from an authoritative source such as NORAD via CelesTrak, propagated with an appropriate orbital model. Asteria Star does not publish invented pass times; where a prediction cannot be computed from current elements, the page says so rather than showing a plausible-looking figure.",
          ],
        },
        {
          heading: "Other satellites",
          paragraphs: [
            "Thousands of satellites are bright enough to see under dark skies, and on a clear night away from light pollution you will notice several within an hour. Most are far fainter and slower-looking than the ISS because they are smaller and often higher.",
            "Large satellite constellations have made this substantially more noticeable, particularly shortly after launch when spacecraft are still clustered in a visible train. That same visibility is a genuine problem for astronomy: satellite trails contaminate long exposures, and the effect scales with the number of objects in orbit.",
          ],
        },
      ],
      faqs: [
        {
          question: "When can I see the ISS?",
          answer:
            "During the couple of hours after sunset or before sunrise, when the station is still in sunlight but your sky is dark. In the middle of the night it passes through Earth's shadow and reflects nothing, so it is invisible regardless of how favourably it passes overhead.",
        },
        {
          question: "How do I tell the ISS from an aircraft?",
          answer:
            "The ISS is a steady white point with no flashing. Aircraft carry blinking navigation lights and usually show more than one colour. The station also crosses a large arc of sky in a few minutes at a constant rate, and frequently fades out mid-pass when it enters Earth's shadow — something an aircraft never does.",
        },
        {
          question: "Why do pass predictions need updating?",
          answer:
            "Because the station's orbit changes. Atmospheric drag lowers it continuously, and periodic reboosts raise it again, so orbital elements go stale within days. Accurate predictions require current element sets from an authoritative tracking source, propagated with a suitable orbital model.",
        },
      ],
      explore: [
        { label: "ISS tracker", href: "/sky/iss-tracker", blurb: "The station's orbital reference data and pass geometry." },
        { label: "Satellites", href: "/satellites", blurb: "Catalogued satellites, orbits, and operators." },
        { label: "Human spaceflight", href: "/human-spaceflight", blurb: "The ISS programme and its crews." },
      ],
      sources: ["nasa", "celestrak"],
      keywords: ["space station", "satellite spotting", "ISS pass"],
    },
    {
      slug: "comet-visibility",
      name: "Comet Visibility",
      summary: "Tracking comets bright enough to observe.",
      overview:
        "Most comets are far too faint to see without a telescope, and the occasional bright one is genuinely unpredictable. Comet brightness forecasting is among the least reliable predictions in observational astronomy, and it is worth understanding why before trusting any headline.",
      keyPoints: [
        "Comet brightness depends on activity, which depends on unknown surface composition and structure.",
        "A comet's magnitude is spread over an extended coma, so it looks fainter than the number suggests.",
        "Comets have both disintegrated unexpectedly and brightened by enormous factors without warning.",
        "A 'naked-eye comet' typically means a faint smudge from a dark site, not a dramatic sight.",
      ],
      body: [
        {
          heading: "Why brightness predictions fail",
          paragraphs: [
            "A comet's brightness comes from sunlight scattered by dust and gas released from the nucleus, so it depends on how much material is being released. That depends on the composition, porosity and thermal history of a body a few kilometres across that has usually never been observed closely.",
            "Predictions extrapolate from early observations using empirical brightness laws, and the extrapolation is fragile. Comet ISON in 2013 was widely forecast to become spectacular and disintegrated at perihelion. Comet Holmes in 2007 brightened by a factor of around half a million in under two days for reasons still not fully explained. Both outcomes were within the range of what comets do.",
          ],
        },
        {
          heading: "Why the magnitude is misleading",
          paragraphs: [
            "Stellar magnitudes describe point sources. A comet's light is spread over a coma that may span a substantial fraction of a degree, so the surface brightness is far lower than the same total magnitude concentrated in a star.",
            "In practice, a comet at magnitude 5 — nominally naked-eye — is often invisible from a suburban sky and appears as a faint grey smudge from a genuinely dark one. This is the single biggest reason comets disappoint observers who have read a magnitude figure and expected a bright object.",
          ],
        },
        {
          heading: "Observing a comet well",
          list: [
            "Use binoculars rather than a telescope. A comet is a large, low-contrast, extended object, and wide field with good light grasp beats magnification.",
            "Go to the darkest sky you can reach and avoid moonlight — sky background is decisive for low-surface-brightness objects.",
            "Use averted vision. Comets are exactly the sort of faint extended target that appears when you look slightly to one side.",
            "Watch over several nights. Motion against the stars is often obvious, and the tail's appearance can change noticeably.",
            "Do not expect photographs. Long-exposure images accumulate light and reveal structure and colour that the eye cannot see.",
          ],
        },
        {
          heading: "How current comets are tracked",
          paragraphs: [
            "Discoveries and orbital elements are handled by the Minor Planet Center, which issues designations and maintains the orbital database; JPL's Small-Body Database provides ephemerides derived from those elements. Positions are computed reliably; brightness is not.",
            "Asteria Star records catalogued orbital data with its source and does not publish invented brightness forecasts. Where a prediction is genuinely uncertain — which for comet brightness is essentially always — the honest presentation is the uncertainty itself.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why are comet brightness predictions so unreliable?",
          answer:
            "Because brightness depends on how much dust and gas the nucleus releases, which depends on composition and structure that are usually unknown until the comet is already active. Extrapolating from early observations is fragile: comets have disintegrated when spectacular displays were forecast, and have brightened by factors of hundreds of thousands with no warning at all.",
        },
        {
          question: "Why does a naked-eye comet look so faint?",
          answer:
            "Because its light is spread over a large coma rather than concentrated in a point. A magnitude figure assumes a point source, so a comet of the same nominal magnitude as a visible star has far lower surface brightness and is much harder to detect — often just a faint grey smudge, and frequently invisible from anywhere but a dark site.",
        },
        {
          question: "What is the best equipment for observing a comet?",
          answer:
            "Binoculars, in most cases. A comet is a large, faint, low-contrast object, so a wide field of view and good light grasp serve better than the high magnification and narrow field of a telescope. A dark sky matters more than any equipment choice.",
        },
      ],
      explore: [
        { label: "Comet reference", href: "/sky/comets", blurb: "What makes comets visible, with brightness data still prepared for integration." },
        { label: "Comets", href: "/comets", blurb: "Comet families, reservoirs, and physics." },
        { label: "Meteor showers", href: "/sky-guide/meteor-showers", blurb: "The debris streams comets leave behind." },
      ],
      sources: ["mpc", "jpl", "nasa"],
      keywords: ["bright comet", "comet tonight", "naked-eye comet", "coma surface brightness"],
    },
    {
      slug: "sky-calendar",
      name: "Sky Calendar",
      summary: "A running calendar of notable sky events.",
      overview:
        "Astronomical events fall into two groups: those that recur on a strict schedule and can be predicted centuries ahead, and those that cannot be predicted at all. Knowing which is which is the most useful thing a sky calendar can teach.",
      keyPoints: [
        "Eclipses, solstices, oppositions and shower dates are all computable far in advance.",
        "Bright comets, novae and supernovae are not predictable — only detectable once underway.",
        "Meteor shower dates are reliable; meteor shower rates are not.",
        "The value of a calendar is mostly in the events you would otherwise miss.",
      ],
      body: [
        {
          heading: "What can be predicted precisely",
          list: [
            "Eclipses, solar and lunar, are computable centuries ahead from orbital mechanics — including the exact path of totality across Earth's surface.",
            "Solstices and equinoxes follow from Earth's orbit and axial tilt and are fixed to the minute.",
            "Planetary oppositions, conjunctions and elongations follow from orbital positions and are known well in advance.",
            "Moon phases, and lunar rise and set times for any location, are computed from well-established algorithms.",
            "Meteor shower peak dates recur annually because Earth crosses each debris stream at the same orbital position.",
          ],
        },
        {
          heading: "What cannot",
          paragraphs: [
            "Bright comets are discovered, not scheduled — most spectacular ones were unknown a year before their appearance. Novae and supernovae occur without warning. Aurora displays depend on solar activity that is forecastable only hours to days ahead, and imprecisely even then.",
            "Meteor shower rates are a partial case: the date is reliable, the intensity is not. Streams are not uniform, and encounters with denser filaments have produced storms far above normal rates with little warning. Any calendar that presents a rate as certain is overstating what is known.",
          ],
        },
        {
          heading: "Reading event listings critically",
          paragraphs: [
            "Sky calendars vary widely in quality, and several common patterns are worth recognising. Times are meaningless without a stated time zone or a note that they are in UTC. Conjunctions listed without the objects' altitude may be unobservable because the pair sits below the horizon or in twilight from your location.",
            "'Supermoon' and similar labels are often applied more loosely in popular listings than the underlying geometry warrants, and events described as rare are sometimes annual. A calendar entry is a prompt to check the geometry for your own location, not a guarantee of a spectacle.",
          ],
        },
        {
          heading: "Planning around what matters",
          paragraphs: [
            "For most observers the practical calendar is short. Total solar eclipses are worth travelling for; almost nothing else is. Total lunar eclipses, favourable oppositions of Mars, the two or three strongest meteor showers, and a genuinely bright comet if one appears are the events that reward planning.",
            "The rest of the calendar is best used as a reason to go outside on a clear night. Conjunctions and close approaches are pleasant rather than dramatic, and the most common failure mode in amateur astronomy is waiting for a listed event instead of observing regularly.",
          ],
        },
      ],
      faqs: [
        {
          question: "How far ahead can eclipses be predicted?",
          answer:
            "Centuries, and with high precision. Eclipse circumstances follow from orbital mechanics, so dates, durations and the exact ground track of totality can be computed far in advance. The main long-term uncertainty is the gradual, slightly irregular slowing of Earth's rotation, which affects where along a predicted path the eclipse falls rather than whether it happens.",
        },
        {
          question: "Can meteor showers be predicted accurately?",
          answer:
            "Dates yes, rates no. Earth crosses each debris stream at the same orbital position annually, so peak dates are reliable. Intensity depends on the density of the particular filament being crossed, which varies, and unexpected outbursts far above normal rates have occurred with little warning.",
        },
        {
          question: "Which sky events are actually worth planning around?",
          answer:
            "Total solar eclipses, by a wide margin — they are qualitatively different from anything else and worth travelling for. Then total lunar eclipses, favourable Mars oppositions, the strongest annual meteor showers, and a bright comet if one appears. Most other calendar entries are pleasant additions to a night out rather than reasons to plan one.",
        },
      ],
      explore: [
        { label: "Observing calendar", href: "/sky/observing-calendar", blurb: "Reference calendar of recurring events." },
        { label: "This month", href: "/sky/this-month", blurb: "Current-month sky reference." },
        { label: "Celestial events", href: "/sky-guide/celestial-events", blurb: "What each event type actually is." },
      ],
      sources: ["usno", "nasa", "imo"],
      keywords: ["astronomy calendar", "sky events calendar", "eclipse prediction"],
    },
    {
      slug: "celestial-events",
      name: "Celestial Events",
      summary: "Explainers for the events that make people look up.",
      overview:
        "The recurring configurations that get announced as sky events — conjunctions, oppositions, occultations, equinoxes — each have a precise geometric meaning. Knowing what the terms actually denote makes it possible to judge for yourself whether an announced event is worth going outside for.",
      keyPoints: [
        "A conjunction is a line-of-sight alignment, not a physical proximity.",
        "Opposition is the best time to observe an outer planet; conjunction with the Sun is the worst.",
        "Occultations give some of the sharpest size measurements available for small bodies.",
        "Equinoxes and solstices are instants, not days.",
      ],
      body: [
        {
          heading: "Conjunctions and appulses",
          paragraphs: [
            "A conjunction occurs when two bodies share the same celestial longitude — they appear close together on the sky. This is purely a line-of-sight effect: two planets in conjunction may be hundreds of millions of kilometres apart, and are simply in the same direction from Earth.",
            "Close conjunctions are genuinely striking, particularly when they involve bright planets or a thin crescent Moon. Terminology varies: strictly, an appulse is the moment of minimum apparent separation, which is often slightly offset from conjunction in longitude. Popular coverage rarely makes the distinction, and it rarely matters visually.",
          ],
        },
        {
          heading: "Opposition and solar conjunction",
          paragraphs: [
            "For an outer planet, opposition means Earth passes directly between it and the Sun. The planet then rises at sunset, is highest around midnight, and is closest to Earth for that synodic cycle — the optimal observing configuration.",
            "The opposite case, solar conjunction, puts the planet behind the Sun from our viewpoint, making it unobservable for weeks. For inner planets the terminology differs: Venus and Mercury have inferior conjunction, passing between Earth and the Sun, and superior conjunction, passing behind it. Greatest elongation — maximum angular separation from the Sun — is when they are best placed.",
          ],
        },
        {
          heading: "Occultations and transits",
          list: [
            "An occultation is one body passing in front of another and hiding it: the Moon regularly occults stars and occasionally planets.",
            "Asteroid occultations of stars are scientifically valuable. Timing the disappearance and reappearance from multiple sites across the shadow track reconstructs the asteroid's profile, giving size and shape measurements that rival spacecraft data — and much of this work is done by amateur observers.",
            "A transit is a small body crossing a much larger disc. Mercury transits the Sun about a dozen times a century; Venus transits in pairs separated by more than a century, most recently in 2004 and 2012.",
            "The same geometry, applied to other stars, is the transit method that has found most known exoplanets.",
          ],
        },
        {
          heading: "Equinoxes and solstices",
          paragraphs: [
            "These are specific instants, not days. The equinox is the moment the Sun crosses the celestial equator; the solstice is the moment it reaches its greatest declination north or south. Both are calculable to the minute, and because they are instants they fall on different calendar dates in different time zones.",
            "Two related misconceptions are worth correcting. Day and night are not exactly equal at the equinox — atmospheric refraction and the fact that sunrise is defined by the Sun's upper edge both extend daylight slightly, so the date of exactly equal day and night falls a few days off the equinox. And the solstices are not the hottest or coldest days: thermal lag in oceans and land means peak temperatures follow weeks later.",
          ],
        },
      ],
      faqs: [
        {
          question: "What is a conjunction?",
          answer:
            "Two celestial bodies appearing close together in the sky because they share nearly the same celestial longitude. It is a line-of-sight alignment only — the objects may be hundreds of millions of kilometres apart. Close conjunctions of bright planets, or of a planet with a crescent Moon, are among the more attractive naked-eye sights.",
        },
        {
          question: "Why do astronomers care about occultations?",
          answer:
            "Because they give exceptionally precise measurements. Timing when a small body blocks a background star, from several sites spread across the shadow track, reconstructs the body's silhouette and yields size and shape data comparable to what a spacecraft flyby provides. Much of this work is carried out by coordinated amateur observers.",
        },
        {
          question: "Is day exactly equal to night on the equinox?",
          answer:
            "Not quite. Sunrise and sunset are defined by the Sun's upper edge rather than its centre, and atmospheric refraction lifts the Sun's apparent position when it is near the horizon. Both effects lengthen daylight slightly, so the date of genuinely equal day and night falls a few days before or after the equinox depending on latitude.",
        },
        {
          question: "Why isn't the summer solstice the hottest day?",
          answer:
            "Because of thermal lag. The solstice is when solar input peaks, but oceans and land continue absorbing more heat than they release for weeks afterwards, so peak temperatures typically arrive well after the solstice. The same lag delays the coldest part of winter past the December solstice.",
        },
      ],
      explore: [
        { label: "Sky events", href: "/sky/events", blurb: "Reference listings of recurring configurations." },
        { label: "Celestial mechanics", href: "/celestial-mechanics", blurb: "The orbital geometry behind each event." },
        { label: "Reference systems", href: "/reference-systems", blurb: "Coordinates, epochs, and time scales." },
      ],
      sources: ["nasa", "usno", "iau"],
      keywords: ["conjunction", "opposition", "solstice", "occultation", "transit"],
    },
    {
      slug: "space-weather",
      name: "Space Weather",
      summary: "Solar storms, the solar wind, and their effects near Earth.",
      overview:
        "Space weather describes conditions driven by the Sun — the solar wind, flares and coronal mass ejections — and their effects on Earth's magnetosphere, on satellites, on power grids, and on the aurorae. It is the one branch of astronomy with routine operational consequences on the ground.",
      keyPoints: [
        "Flares travel at light speed and arrive in about 8 minutes; coronal mass ejections take one to three days.",
        "Aurorae are caused by particles guided along magnetic field lines into the upper atmosphere, not by the particles arriving directly.",
        "The 1859 Carrington event is the reference case for how severe a storm can be.",
        "Forecast lead time is short — hours to a few days — and the uncertainty is large.",
      ],
      body: [
        {
          heading: "What the Sun sends",
          list: [
            "The solar wind: a continuous outflow of charged particles from the corona, varying in speed and density, which shapes Earth's magnetosphere continuously.",
            "Solar flares: sudden releases of magnetic energy producing intense electromagnetic radiation across the spectrum. Because it is light, it arrives in about eight minutes and can disrupt radio communication on the sunlit side almost immediately.",
            "Coronal mass ejections: enormous eruptions of plasma and embedded magnetic field. These are the main driver of severe geomagnetic storms and take roughly one to three days to reach Earth.",
            "Solar energetic particles: high-energy particles accelerated by flares and CME shocks, which can reach Earth within tens of minutes and pose a radiation hazard to spacecraft and to crews outside the magnetosphere.",
          ],
        },
        {
          heading: "How aurorae actually form",
          paragraphs: [
            "The common description — particles from the Sun hitting the atmosphere — is close enough to be memorable and wrong in an important detail. Solar wind particles are largely deflected by Earth's magnetosphere. What actually produces an aurora is energy transferred into the magnetosphere, which accelerates particles already present there down magnetic field lines into the upper atmosphere near the poles.",
            "Those particles excite atmospheric atoms and molecules, which then emit at characteristic wavelengths: atomic oxygen produces the familiar green at around 100 to 200 kilometres and a rarer deep red at higher altitude, while nitrogen contributes blue and purple. The colours are emission lines, which is why aurora photographs show discrete hues rather than a continuous spectrum.",
          ],
        },
        {
          heading: "Effects that matter operationally",
          paragraphs: [
            "Geomagnetic storms induce currents in long conductors on the ground. In March 1989 a storm caused a transformer failure cascade that blacked out the Hydro-Québec grid within minutes, and long pipelines experience accelerated corrosion from the same mechanism.",
            "Satellites face several distinct hazards: radiation damage and single-event upsets in electronics, charging of spacecraft surfaces, and increased atmospheric drag as the upper atmosphere heats and expands during storms — which measurably lowers orbits and has caused loss of newly launched satellites. High-frequency radio and satellite navigation both degrade during ionospheric disturbances, and airlines reroute polar flights during major events.",
          ],
        },
        {
          heading: "Forecasting, and its limits",
          paragraphs: [
            "Space weather forecasting is genuinely difficult. A coronal mass ejection's effect depends heavily on the orientation of its embedded magnetic field, which cannot be reliably determined until it reaches spacecraft at the L1 point roughly 1.5 million kilometres upstream — giving perhaps 15 to 60 minutes of definite warning before arrival at Earth.",
            "The Carrington event of 1859 remains the benchmark for severity: aurorae were reported at tropical latitudes and telegraph systems failed, in some cases operating on induced current alone. A comparable event today would affect infrastructure that did not exist in 1859, which is why operational forecasting centres exist at all. Asteria Star does not publish simulated conditions; current values come from official forecasting sources or are not shown.",
          ],
        },
      ],
      faqs: [
        {
          question: "How long does it take for a solar storm to reach Earth?",
          answer:
            "It depends on what is travelling. A flare's electromagnetic radiation arrives in about eight minutes, at light speed. Solar energetic particles can arrive within tens of minutes. A coronal mass ejection — the plasma cloud that drives major geomagnetic storms — typically takes one to three days.",
        },
        {
          question: "What causes the aurora?",
          answer:
            "Energy from the solar wind transferred into Earth's magnetosphere, which accelerates charged particles along magnetic field lines into the upper atmosphere near the poles. Those particles excite oxygen and nitrogen, which emit at specific wavelengths — green and deep red from oxygen, blue and purple from nitrogen. Solar particles do not mostly strike the atmosphere directly.",
        },
        {
          question: "Can a solar storm damage power grids?",
          answer:
            "Yes. Geomagnetic storms induce currents in long conductors, including transmission lines, which can drive transformers into saturation and cause cascading failures. The March 1989 storm blacked out the Hydro-Québec grid in minutes. Severe events also accelerate corrosion in pipelines through the same induction mechanism.",
        },
        {
          question: "How much warning is there before a geomagnetic storm?",
          answer:
            "Typically one to three days from observing a coronal mass ejection leave the Sun, but the crucial detail — the orientation of its magnetic field, which largely determines severity — is not reliably known until the cloud reaches monitoring spacecraft about 1.5 million kilometres upstream. That gives roughly 15 to 60 minutes of definite warning.",
        },
      ],
      explore: [
        { label: "Space weather", href: "/sky/space-weather", blurb: "Reference pages on flares, CMEs, and storms." },
        { label: "Heliophysics", href: "/heliophysics", blurb: "The Sun–Earth system as catalogued science." },
        { label: "Space environment", href: "/space-environment", blurb: "Radiation, debris, and the operational environment." },
        { label: "Solar physics", href: "/solar-physics", blurb: "The Sun's interior, atmosphere, and activity." },
      ],
      sources: ["nasa", "swpc", "noaa", "donki"],
      dataModule: true,
      keywords: ["space weather", "solar storm", "aurora forecast", "coronal mass ejection", "Carrington event"],
    },
    {
      slug: "sun-activity",
      name: "Sun Activity",
      summary: "The Sun's changing activity — sunspots, flares, and the solar cycle.",
      overview:
        "The Sun's magnetic activity rises and falls over a cycle averaging about eleven years, tracked most visibly through sunspot numbers. The cycle drives flares, coronal mass ejections and the general level of space weather, and its detailed behaviour is still not predictable in advance.",
      keyPoints: [
        "Sunspots are cool, dark regions where strong magnetic fields suppress convection.",
        "The full magnetic cycle is about 22 years; the sunspot cycle of 11 years is half of it.",
        "Cycle strength varies substantially and is not reliably predictable.",
        "The Maunder Minimum shows the cycle can nearly stop for decades.",
      ],
      body: [
        {
          heading: "What sunspots are",
          paragraphs: [
            "Sunspots are regions where magnetic field lines emerging through the photosphere are strong enough to inhibit convection, so less heat reaches the surface there. They are around 1,500 kelvin cooler than the surrounding photosphere, which makes them look dark by contrast — in isolation a sunspot would still be brighter than most artificial light sources.",
            "They typically appear in pairs or groups of opposite magnetic polarity, marking where a loop of field has broken through. Individual spots last from days to weeks, and their positions and motions are how the Sun's differential rotation was first measured: the equator rotates faster than the poles.",
          ],
        },
        {
          heading: "The cycle",
          paragraphs: [
            "Sunspot numbers rise and fall with a period averaging about eleven years, though individual cycles range roughly from nine to fourteen. At solar minimum the disc can be blank for extended periods; at maximum, dozens of spots may be present with frequent flares and coronal mass ejections.",
            "The magnetic reality is a 22-year cycle. The Sun's global magnetic polarity reverses at each sunspot maximum, so it takes two sunspot cycles to return to the original magnetic configuration. Spot groups also migrate from mid-latitudes toward the equator as a cycle progresses, producing the butterfly diagram — one of the longest-running datasets in observational astronomy.",
          ],
        },
        {
          heading: "Why the cycle is not predictable",
          paragraphs: [
            "The cycle originates in a magnetic dynamo driven by convection and differential rotation in the Sun's interior, and while the broad mechanism is understood, forecasting the amplitude of the next cycle remains unreliable. Predictions for recent cycles have spanned a wide range, and outcomes have repeatedly fallen outside the consensus expectation.",
            "The historical record shows the variability is real and can be extreme. During the Maunder Minimum, roughly 1645 to 1715, sunspots nearly vanished for decades — an episode documented by contemporary observers and independently corroborated by cosmogenic isotope records in tree rings and ice cores.",
          ],
        },
        {
          heading: "Observing the Sun safely",
          paragraphs: [
            "The Sun is the one object that can cause permanent injury in the time it takes to look at it, and through an unfiltered telescope the damage is instantaneous. Any solar observation requires a purpose-made filter mounted on the front of the instrument, never at the eyepiece where concentrated heat will crack it.",
            "Projection is a completely safe alternative: a small telescope or binoculars projecting the solar image onto white card shows sunspots clearly, and it is how the historical sunspot record was largely compiled. Specialist hydrogen-alpha telescopes reveal prominences and filaments in the chromosphere that white-light observation cannot show at all.",
          ],
        },
      ],
      faqs: [
        {
          question: "What are sunspots?",
          answer:
            "Regions of the photosphere where strong magnetic fields suppress convection, so less heat reaches the surface. They are around 1,500 kelvin cooler than their surroundings and appear dark only by contrast — a sunspot removed from the Sun would still glow brilliantly. They usually appear in groups of opposite magnetic polarity.",
        },
        {
          question: "How long is the solar cycle?",
          answer:
            "The sunspot cycle averages about eleven years, with individual cycles ranging roughly from nine to fourteen. The underlying magnetic cycle is about 22 years, because the Sun's global magnetic polarity reverses at each sunspot maximum and takes two sunspot cycles to return to its original configuration.",
        },
        {
          question: "Can the next solar cycle's strength be predicted?",
          answer:
            "Not reliably. The cycle arises from a magnetic dynamo in the Sun's interior whose behaviour is understood in outline but not in enough detail to forecast amplitude. Predictions for recent cycles have varied widely and outcomes have repeatedly fallen outside the expected range.",
        },
        {
          question: "How can I observe the Sun safely?",
          answer:
            "Only with a purpose-made solar filter mounted on the front of the instrument, or by projecting the image onto white card. Never look through an unfiltered telescope or binoculars — the concentrated light causes severe injury almost instantly, and eyepiece-mounted filters can crack under the heat. Projection is entirely safe and shows sunspots well.",
        },
      ],
      explore: [
        { label: "Sun reference", href: "/sky/sun", blurb: "Computed solar position and twilight geometry." },
        { label: "Solar physics", href: "/solar-physics", blurb: "Interior structure, atmosphere, and activity." },
        { label: "Heliophysics", href: "/heliophysics", blurb: "The Sun–Earth connection." },
        { label: "Space weather", href: "/sky-guide/space-weather", blurb: "What solar activity does near Earth." },
      ],
      sources: ["nasa", "swpc", "noaa", "esa"],
      dataModule: true,
      keywords: ["sun activity", "sunspots", "solar cycle", "Maunder Minimum", "butterfly diagram"],
    },
  ],
};
