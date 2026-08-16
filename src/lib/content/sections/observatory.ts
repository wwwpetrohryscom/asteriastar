import type { Section } from "@/lib/content/types";

/**
 * Observatory — visual and interactive media.
 *
 * The platform's image archive is a *provenance catalogue*: it records source,
 * instrument, licence and credit for openly-licensed and public-domain imagery
 * and links to the official archive, rather than re-hosting binaries it has not
 * verified. These category pages publish the editorial context — how the
 * imagery is produced, what the licences actually permit, and how to read an
 * astronomical image correctly — and link to the catalogued items.
 *
 * Nothing here promises a future gallery. Where a collection is small, the
 * honest statement is the size of the collection, which the archive pages show.
 */
export const observatory: Section = {
  slug: "observatory",
  name: "Observatory",
  kind: "media",
  accent: "halo",
  tagline: "See the universe — through verified, openly licensed imagery.",
  description:
    "Curated galleries and interactive views of the cosmos: NASA and ESA imagery, James Webb and Hubble highlights, sky maps, and a 3D Solar System — all from licensed sources with recorded provenance.",
  intro:
    "The Observatory is Asteria Star's visual layer. Every catalogued image carries its source archive, instrument, credit and licence, and links back to the official original — the platform records provenance rather than re-hosting binaries it has not verified. These pages explain how the imagery is produced, what the licences permit, and how to read an astronomical image without being misled by it.",
  categories: [
    {
      slug: "image-library",
      name: "Image Library",
      summary: "A searchable home for verified, openly licensed space imagery.",
      overview:
        "The image library is a provenance catalogue: each entry records the source archive, instrument, capture context, credit line and licence for an openly licensed or public-domain image, and links to the official original. It records metadata rather than re-hosting unverified files.",
      keyPoints: [
        "Every catalogued image carries source, credit, licence and a link to the official archive.",
        "The platform never fabricates a credit, licence, capture date or source URL.",
        "Only openly licensed or public-domain imagery is catalogued.",
        "The catalogue is deliberately small and verified rather than large and unchecked.",
      ],
      body: [
        {
          heading: "Why provenance, not just pictures",
          paragraphs: [
            "An astronomical image is evidence. It was produced by a specific instrument, at a specific time, through specific filters, and processed in a specific way — and every one of those facts changes what the image can legitimately be used to claim. An image detached from that context is decoration.",
            "The archive therefore treats metadata as the primary record. Each entry ties an image to the entity it depicts in the knowledge graph, names the observing facility or mission, records the credit line exactly as the source archive states it, and identifies the licence. Where any of that cannot be verified, the image is not catalogued.",
          ],
        },
        {
          heading: "What each record contains",
          list: [
            "The entity the image depicts, linked to its catalogue page.",
            "The source archive and a link to the official original.",
            "The credit line, reproduced as the source states it.",
            "The licence — public domain, CC BY, or CC BY-SA — with the terms that follow from it.",
            "Alt text describing what is visible, written for readers using a screen reader.",
            "The role the image plays: an observation, a diagram, or a labelled artist's impression.",
          ],
        },
        {
          heading: "Artist's impressions are labelled as such",
          paragraphs: [
            "A large share of widely circulated space imagery is artwork rather than observation. Renderings of exoplanets, of spacecraft at their destinations, and of objects too small or distant to resolve are produced for communication, and they are legitimate when identified.",
            "They become a problem when presented as photographs. Asteria Star records the role of each image explicitly, so an artist's impression is never displayed as though it were an observation. Where no authentic image of an object exists — which is true of nearly every exoplanet and of most catalogued stars — the honest presentation is no image at all.",
          ],
        },
        {
          heading: "Why the catalogue is small",
          paragraphs: [
            "Verifying an image properly takes real effort: confirming the subject identification, locating the official source record, checking the licence terms actually stated there rather than assumed, and reproducing the credit exactly. That work does not scale by scraping.",
            "The archive shows its own size on every listing page. A small verified catalogue is a more honest artefact than a large one assembled from unchecked sources, and stating the count plainly is part of that.",
          ],
        },
      ],
      faqs: [
        {
          question: "Does Asteria Star host these images?",
          answer:
            "It catalogues them. Each record holds verified metadata — source archive, instrument, credit, licence, and a link to the official original — rather than re-hosting binaries the platform has not verified. The intent is to be a provenance layer over the public archives, not a mirror of them.",
        },
        {
          question: "Why do some objects have no image at all?",
          answer:
            "Because no authentic image exists. Almost every exoplanet and the great majority of catalogued stars have never been resolved into anything but a point of light, and no telescope currently produces one. Showing an artist's impression in that gap, unlabelled, would misrepresent what is known — so the honest presentation is an empty image slot.",
        },
        {
          question: "Can I reuse the images catalogued here?",
          answer:
            "That depends on the individual licence, which each record states. Public-domain items — including most NASA-produced imagery — carry the fewest restrictions, while CC BY and CC BY-SA items require attribution and, for CC BY-SA, share-alike terms. Always check the licence recorded on the item and the terms stated by the source archive itself.",
        },
      ],
      explore: [
        { label: "Image archive", href: "/images", blurb: "The catalogue itself, with provenance for every item." },
        { label: "Galleries", href: "/gallery", blurb: "Curated collections by subject." },
        { label: "Licensing policy", href: "/sources-policy", blurb: "How sources and licences are handled platform-wide." },
      ],
      sources: ["nasa", "esa", "wikimedia", "stsci"],
      keywords: ["space images", "astronomy gallery", "public domain space", "image provenance"],
    },
    {
      slug: "nasa-gallery",
      name: "NASA Gallery",
      summary: "Highlights from NASA's public imagery.",
      overview:
        "NASA-produced imagery is generally in the public domain, which makes it the single largest freely reusable collection of space photography in existence. That freedom comes with conditions that are widely misunderstood, and this page sets them out.",
      keyPoints: [
        "Most NASA-produced material is public domain because it is a work of the US federal government.",
        "'Generally' is doing real work — NASA hosts third-party material that is not public domain.",
        "Public domain does not authorise implying NASA endorsement.",
        "Images of identifiable people carry separate personality-rights considerations.",
      ],
      body: [
        {
          heading: "Why NASA imagery is usually public domain",
          paragraphs: [
            "Works produced by employees of the United States federal government in the course of their duties are not subject to domestic copyright. NASA is a federal agency, so imagery produced by NASA staff and by its contractors under the relevant terms is generally free of copyright restriction.",
            "This is why NASA photographs appear so widely — in textbooks, news coverage, documentaries and commercial products — without licensing negotiations. It is one of the more consequential open-access policies in science communication.",
          ],
        },
        {
          heading: "The exceptions that matter",
          list: [
            "NASA hosts material produced by international partners. ESA, JAXA, CSA and others have their own licence terms, and joint missions may carry combined credit lines with mixed conditions.",
            "Some hosted material is licensed from third parties, including commercial imagery and contributed photographs, and remains under its original copyright.",
            "The NASA insignia, logotype and seal are protected separately and may not be used in ways implying endorsement, regardless of the copyright status of imagery containing them.",
            "Photographs of identifiable individuals may not be used to imply endorsement of a product or service, which is a personality-rights matter independent of copyright.",
          ],
        },
        {
          heading: "How to check an individual item",
          paragraphs: [
            "The reliable method is to consult the source record on the official NASA archive page, which states the credit line and any usage note, rather than assuming from the domain that an item is unrestricted. Credit lines that include a partner agency or an individual photographer are the clearest signal that additional terms may apply.",
            "This is exactly what the platform's image records capture: the credit as stated, the licence as stated, and a link back to the source page so the claim can be checked. Where a licence cannot be established, the image is not catalogued.",
          ],
        },
        {
          heading: "What the collections contain",
          paragraphs: [
            "NASA's imagery spans mission photography from crewed and robotic programmes, planetary surface and orbital imaging, Earth observation, and releases from the space telescopes it operates or co-operates. Much of the most reproduced astronomical imagery — Hubble and JWST releases in particular — reaches the public through this route.",
            "Asteria Star's catalogue records the individual items it has verified, and links to the archive pages for the rest. The catalogue count is shown on the archive listing, and it is a verified subset rather than a claim to completeness.",
          ],
        },
      ],
      faqs: [
        {
          question: "Is all NASA imagery free to use?",
          answer:
            "Most of it, but not all. Material produced by NASA employees and qualifying contractors is generally public domain because works of the US federal government are not subject to domestic copyright. NASA also hosts imagery from international partners and third parties that remains under its own terms, so individual items should be checked against their source record.",
        },
        {
          question: "Can I use a NASA photo in a commercial product?",
          answer:
            "Public-domain items generally yes, with two important caveats. The NASA insignia and logotype are separately protected and may not be used in ways implying endorsement, and photographs of identifiable people may not be used to suggest they endorse a product — a personality-rights restriction independent of copyright.",
        },
        {
          question: "How do I find the licence for a specific NASA image?",
          answer:
            "Check the official archive record for that item, which states the credit line and any usage notes. A credit that names a partner agency such as ESA or JAXA, or an individual photographer, is the clearest indication that additional terms apply beyond the general public-domain position.",
        },
      ],
      explore: [
        { label: "Image archive", href: "/images", blurb: "Catalogued imagery with source and licence." },
        { label: "Space telescopes", href: "/astronomy/space-telescopes", blurb: "The observatories producing much of this imagery." },
        { label: "Exploration", href: "/exploration", blurb: "The missions the photography came from." },
      ],
      sources: ["nasa", "stsci"],
      keywords: ["NASA images", "public domain", "space photography", "usage terms"],
    },
    {
      slug: "esa-gallery",
      name: "ESA Gallery",
      summary: "Highlights from European Space Agency imagery.",
      overview:
        "ESA imagery operates under a different model from NASA's. Much of it is released under a Creative Commons licence requiring attribution rather than being placed in the public domain, which changes what reuse requires.",
      keyPoints: [
        "ESA generally uses CC BY-SA licensing rather than public domain.",
        "Attribution is mandatory, and share-alike terms apply to derivative works.",
        "ESA/Hubble and ESA/Webb material carries its own combined credit lines.",
        "Mission imagery from partners within an ESA release may carry additional terms.",
      ],
      body: [
        {
          heading: "The licensing model",
          paragraphs: [
            "ESA has generally released much of its imagery and video under a Creative Commons Attribution–ShareAlike licence. That permits reuse including commercially, but imposes two obligations: the credit must be given as specified, and derivative works must be shared under compatible terms.",
            "This is a meaningfully different position from NASA's public-domain default. Material that can be dropped into any context without attribution if it comes from NASA generally cannot if it comes from ESA, and conflating the two is a common licensing error.",
          ],
        },
        {
          heading: "Credit lines are structured, and matter",
          list: [
            "ESA/Hubble releases typically credit both ESA and NASA, reflecting the observatory's partnership, and often name the science team.",
            "ESA/Webb releases carry a four-way credit involving NASA, ESA, CSA and STScI.",
            "Planetary mission imagery frequently credits the instrument team and host institution alongside the agency.",
            "Reproducing a credit line accurately is a licence condition under CC BY-SA, not a courtesy.",
          ],
        },
        {
          heading: "What ESA imagery covers",
          paragraphs: [
            "ESA's own missions have produced some of the most scientifically distinctive imagery available: Rosetta's close-range observation of comet 67P, Mars Express orbital imaging, Gaia's astrometric sky maps, and Planck's full-sky microwave background maps among them.",
            "ESA also participates in jointly operated observatories — Hubble and JWST most prominently — where releases carry combined credit and are distributed through both agencies' channels, sometimes under different terms depending on which archive an item is obtained from.",
          ],
        },
        {
          heading: "How the platform handles it",
          paragraphs: [
            "Each catalogued item records the licence that its source archive states, not a licence inferred from the agency. Where an ESA item is CC BY-SA, that is what the record says, and the credit is reproduced as given.",
            "Where a release involves multiple agencies, the full credit line is preserved rather than shortened. That is both a licence requirement and a matter of accuracy — these images are produced by named teams, and the credit is part of the record.",
          ],
        },
      ],
      faqs: [
        {
          question: "Is ESA imagery public domain like NASA's?",
          answer:
            "Generally no. ESA has largely released imagery under a Creative Commons Attribution–ShareAlike licence, which permits reuse including commercially but requires that credit be given as specified and that derivative works be shared under compatible terms. Assuming a NASA-style public-domain position for ESA material is a common licensing error.",
        },
        {
          question: "What does ShareAlike mean in practice?",
          answer:
            "That if you create a derivative work — a modified, cropped, recoloured or composited version — you must release it under the same or a compatible licence. It does not restrict using the image unmodified alongside your own separately licensed content, but it does constrain what you can do with an altered version.",
        },
        {
          question: "Why do Hubble and Webb images have such long credit lines?",
          answer:
            "Because those observatories are international partnerships and the credit reflects the actual contributors. Hubble releases typically credit ESA and NASA together and often the science team; Webb releases carry a four-way credit involving NASA, ESA, CSA and STScI. Under a CC BY-SA licence, reproducing that credit accurately is a condition of use.",
        },
      ],
      explore: [
        { label: "Image archive", href: "/images", blurb: "Catalogued imagery with source and licence." },
        { label: "Observatories", href: "/observatories", blurb: "The facilities producing this imagery." },
        { label: "Institutions", href: "/institutions", blurb: "ESA and partner agencies as catalogued entities." },
      ],
      sources: ["esa", "esa-hubble", "esa-webb"],
      keywords: ["ESA images", "CC BY-SA", "attribution", "Rosetta", "Gaia"],
    },
    {
      slug: "james-webb",
      name: "James Webb",
      summary: "Imagery from the James Webb Space Telescope.",
      overview:
        "JWST observes in the infrared, which means its images show something the eye could never see — and the colours in every published release are assigned, not recorded. Understanding that mapping is essential to reading a Webb image correctly.",
      keyPoints: [
        "JWST is an infrared observatory; every visible colour in its images is assigned during processing.",
        "Its 6.5-metre segmented primary mirror gives it far more collecting area than Hubble.",
        "It operates near the Sun–Earth L2 point and cannot be serviced.",
        "Infrared penetrates dust, which is why Webb sees into star-forming regions Hubble cannot.",
      ],
      body: [
        {
          heading: "What infrared observation actually gives you",
          paragraphs: [
            "Infrared light passes through interstellar dust far more readily than visible light, so JWST can see into and through the dense clouds where stars form and which optical telescopes see only as silhouettes. That is the single biggest reason its star-formation imagery looks so different from Hubble's.",
            "Infrared also reaches further back in cosmic time. Expansion stretches the wavelength of light from distant galaxies, so radiation emitted as ultraviolet or visible arrives in the infrared. Observing the earliest galaxies requires an infrared instrument, and that requirement drove much of Webb's design.",
          ],
        },
        {
          heading: "The colours are assigned",
          paragraphs: [
            "There is no visible colour in an infrared image, because the wavelengths lie outside human vision entirely. Every published Webb image is a composite of exposures through different filters, each assigned a display colour — conventionally shorter wavelengths to blue and longer to red, preserving relative ordering.",
            "This is a scientific visualisation choice rather than a fabrication, and it is standard practice. But it means a Webb image does not show what an object 'really looks like'; it shows a mapping of invisible wavelengths into a visible palette. Saying so plainly is more useful than the common formulation that the images are 'true colour'.",
          ],
        },
        {
          heading: "The engineering constraints",
          paragraphs: [
            "An infrared telescope must be cold, because a warm instrument glows in exactly the band it is trying to observe. Webb's five-layer sunshield, roughly the size of a tennis court, keeps the optics near 40 kelvin passively, and the mid-infrared instrument requires additional active cooling below that.",
            "That requirement dictated the orbit. Near the Sun–Earth L2 point, about 1.5 million kilometres beyond Earth, the Sun, Earth and Moon all lie in the same direction, so one shield blocks all three. The cost is that Webb is far beyond any servicing capability — unlike Hubble, which five shuttle missions kept scientifically current for decades.",
          ],
        },
        {
          heading: "What it has produced",
          paragraphs: [
            "Webb's science spans very high redshift galaxies, detailed structure in star-forming regions, direct imaging and spectroscopy of exoplanet atmospheres, and Solar System observation. Its transmission spectroscopy of exoplanet atmospheres in particular has extended what is measurable well beyond what was previously possible.",
            "Some early high-redshift galaxy candidates were revised after follow-up spectroscopy, which is normal scientific practice rather than a failure. Asteria Star records claimed detections with their confidence and source rather than as settled results.",
          ],
        },
      ],
      faqs: [
        {
          question: "Are JWST images in real colour?",
          answer:
            "No, and they cannot be. Webb observes infrared wavelengths that lie entirely outside human vision, so every colour in a published image is assigned during processing — conventionally mapping shorter wavelengths to blue and longer to red. It is a standard and legitimate visualisation choice, but the images show a mapping of invisible light, not what an eye would see.",
        },
        {
          question: "Why does Webb see things Hubble cannot?",
          answer:
            "Two reasons. Infrared light passes through interstellar dust that blocks visible light, so Webb sees into star-forming regions Hubble sees only as dark silhouettes. And cosmic expansion stretches light from very distant galaxies into the infrared, so observing the earliest galaxies requires an infrared instrument.",
        },
        {
          question: "Why is JWST so far from Earth?",
          answer:
            "Because it must stay extremely cold. Near the Sun–Earth L2 point, about 1.5 million kilometres out, the Sun, Earth and Moon all lie in roughly the same direction, so a single sunshield blocks all three and lets the optics cool passively to around 40 kelvin. The trade-off is that servicing is impossible at that distance.",
        },
      ],
      explore: [
        { label: "Image archive", href: "/images", blurb: "Catalogued Webb imagery with full credit." },
        { label: "Space telescopes", href: "/astronomy/space-telescopes", blurb: "How orbital observatories work." },
        { label: "Instruments", href: "/instruments", blurb: "Webb's instrument suite as catalogued entities." },
      ],
      sources: ["nasa", "esa", "esa-webb", "stsci"],
      keywords: ["JWST", "infrared telescope", "false colour", "L2", "deep field"],
    },
    {
      slug: "hubble",
      name: "Hubble",
      summary: "Highlights from the Hubble Space Telescope.",
      overview:
        "Hubble has operated since 1990 and produced much of the imagery that defines public perception of astronomy. Its scientific importance rests less on the pictures than on what a stable, serviceable, above-the-atmosphere platform made measurable.",
      keyPoints: [
        "Hubble launched in 1990 with a flawed primary mirror, corrected by a servicing mission in 1993.",
        "Five shuttle servicing missions replaced instruments and kept it scientifically current for decades.",
        "Its deep field observations showed that faint patches of apparently empty sky contain thousands of galaxies.",
        "It contributed decisively to the extragalactic distance scale and to the discovery of cosmic acceleration.",
      ],
      body: [
        {
          heading: "The mirror, and the recovery",
          paragraphs: [
            "Hubble launched in 1990 with a primary mirror ground to the wrong shape — an error of about two micrometres at the edge, traced to a miscalibrated test instrument. The result was spherical aberration that blurred every image, and it was a serious institutional failure as well as a technical one.",
            "The 1993 servicing mission installed corrective optics that compensated for the error, and later instruments incorporated the correction internally. The recovery is often cited as the strongest practical argument for serviceable spacecraft, and it is the reason Hubble's design philosophy is discussed alongside JWST's unserviceable one.",
          ],
        },
        {
          heading: "Why servicing mattered so much",
          paragraphs: [
            "Five shuttle servicing missions between 1993 and 2009 replaced instruments, gyroscopes, batteries and solar arrays. The detectors flown in 2009 were generations beyond those launched in 1990, so the observatory's capability increased over its lifetime rather than declining.",
            "No comparable capability now exists — the Space Shuttle was retired in 2011 — so Hubble operates on its existing hardware, managing gyroscope failures with reduced-gyro observing modes, while its orbit gradually decays. It is a reminder that the servicing option was a product of a specific era.",
          ],
        },
        {
          heading: "The deep fields",
          paragraphs: [
            "In 1995 Hubble was pointed at an apparently empty patch of sky in Ursa Major for roughly ten days. The resulting Hubble Deep Field contained several thousand galaxies in an area a small fraction of the full Moon's apparent size, at a wide range of distances and cosmic epochs.",
            "It was a deliberate use of scarce observing time on a target with no known content, and it produced one of the most consequential images in the history of astronomy. Later deep and ultra-deep fields extended the technique, and the approach — stare long enough at nothing and find everything — has since been repeated by other observatories including JWST.",
          ],
        },
        {
          heading: "What it measured",
          list: [
            "Cepheid variables in distant galaxies, refining the extragalactic distance scale and the value of the Hubble constant.",
            "Type Ia supernovae at high redshift, contributing to the 1998 discovery that cosmic expansion is accelerating.",
            "Direct evidence for supermassive black holes in galaxy centres through stellar and gas dynamics.",
            "Exoplanet atmospheric composition through transmission spectroscopy, before JWST extended the technique.",
            "Ultraviolet observations, a range JWST cannot cover at all, which remains a distinctive Hubble capability.",
          ],
        },
      ],
      faqs: [
        {
          question: "What was wrong with Hubble's mirror?",
          answer:
            "It was ground to slightly the wrong shape — an error of about two micrometres at the edge, caused by a miscalibrated test instrument during manufacture. The resulting spherical aberration blurred every image. A 1993 servicing mission installed corrective optics that compensated for the flaw, and later instruments built the correction in.",
        },
        {
          question: "Can Hubble still be repaired?",
          answer:
            "Not with current capability. All five servicing missions were flown by the Space Shuttle, retired in 2011, and no operational vehicle is equipped for the task. Hubble continues on its existing hardware, managing gyroscope failures with reduced-gyro observing modes, while its orbit slowly decays.",
        },
        {
          question: "What is the Hubble Deep Field?",
          answer:
            "An image assembled from roughly ten days of exposure in 1995 on an apparently empty patch of sky in Ursa Major. It revealed several thousand galaxies in an area a small fraction of the full Moon's apparent size, spanning a wide range of distances and cosmic epochs — a deliberate gamble with scarce observing time that became one of astronomy's most consequential images.",
        },
        {
          question: "Has JWST made Hubble obsolete?",
          answer:
            "No. They observe different wavelengths. Webb is optimised for infrared and reaches ranges Hubble cannot; Hubble covers ultraviolet and visible light, where Webb has little or no capability. Ultraviolet observation in particular remains a Hubble-only capability among major space observatories.",
        },
      ],
      explore: [
        { label: "Image archive", href: "/images", blurb: "Catalogued Hubble imagery with full credit." },
        { label: "Space telescopes", href: "/astronomy/space-telescopes", blurb: "Orbital observatories and their design constraints." },
        { label: "Distance ladder", href: "/distance-ladder", blurb: "Where Hubble's Cepheid measurements fit." },
      ],
      sources: ["nasa", "esa", "esa-hubble", "stsci"],
      keywords: ["Hubble Space Telescope", "deep field", "servicing missions", "spherical aberration"],
    },
    {
      slug: "videos",
      name: "Videos",
      summary: "Curated, openly licensed astronomy video.",
      overview:
        "Astronomical video comes in three quite different kinds — genuine footage, scientific visualisation, and artistic animation — and they carry very different evidential weight. Distinguishing them is more important for video than for still imagery, because motion is more persuasive.",
      keyPoints: [
        "Real astronomical footage is rare; most 'space video' is visualisation or animation.",
        "Scientific visualisations render real data but make display choices that are not measurements.",
        "Time-lapse compression can imply motion at rates that never occurred.",
        "Licence terms for video often differ from those for stills from the same source.",
      ],
      body: [
        {
          heading: "Three categories that look alike",
          list: [
            "Footage: actual recorded imagery — spacecraft camera video, launch and landing recordings, ISS exterior views, planetary surface panoramas assembled from real frames.",
            "Scientific visualisation: real data rendered into a moving image, such as a simulation of galaxy formation or a flythrough built from measured topography. The data is real; the viewpoint, colour and timing are constructed.",
            "Artistic animation: a rendering of a scene no instrument recorded — a spacecraft arriving at a comet, an exoplanet's surface, a black hole's surroundings. Legitimate when labelled, misleading when not.",
            "The three are frequently intercut in the same production, which is why the label matters at the level of the clip rather than the video.",
          ],
        },
        {
          heading: "Time compression changes what you see",
          paragraphs: [
            "Astronomical processes occur on timescales from milliseconds to billions of years, and video always compresses them. A supernova remnant expanding over decades, rendered as a smooth few-second animation, shows real measured expansion at an entirely fictional rate.",
            "Time-lapse of genuine footage carries the same issue in milder form: aurora time-lapses in particular give an impression of motion far faster than the eye perceives. Neither is dishonest when stated, and both mislead when the compression factor goes unmentioned.",
          ],
        },
        {
          heading: "Licensing differs from stills",
          paragraphs: [
            "It is a common assumption that video from an archive carries the same terms as still imagery from the same source. Often it does not: productions frequently incorporate licensed music, third-party footage, or contributed material with separate terms, and an agency's general imagery policy may not cover the whole package.",
            "The reliable approach is to check the terms stated on the individual item rather than inferring from the source. Where the platform catalogues media, it records the licence that the source archive states for that specific item.",
          ],
        },
        {
          heading: "How to read a space video critically",
          paragraphs: [
            "Three questions cover most cases. Is this recorded footage, rendered data, or artwork? If it is rendered data, what was measured and what was chosen for display? And over what real time span does the depicted motion actually occur?",
            "Productions that answer these in their own captions are generally trustworthy. Those that do not are not necessarily wrong, but they are asking the viewer to accept a composite of evidence and illustration without distinguishing them — which is exactly the failure mode this platform's provenance model exists to avoid.",
          ],
        },
      ],
      faqs: [
        {
          question: "Is most space video real footage?",
          answer:
            "No. Genuine recorded footage — spacecraft cameras, launch recordings, ISS views, planetary surface imagery — is a minority of what circulates. Most 'space video' is either scientific visualisation, which renders real data with constructed viewpoints and timing, or artistic animation depicting scenes no instrument recorded.",
        },
        {
          question: "What is the difference between a visualisation and an animation?",
          answer:
            "A scientific visualisation renders measured data — simulation output, spacecraft topography, observed structure — into a moving image, so the underlying content is real even though viewpoint, colour and pacing are chosen. An artistic animation depicts a scene that was never measured, and is legitimate only when clearly labelled as an impression.",
        },
        {
          question: "Can I assume video has the same licence as images from the same archive?",
          answer:
            "No. Video productions frequently incorporate licensed music, third-party footage or contributed material with separate terms, so an agency's general imagery policy may not cover the whole package. Check the terms stated on the individual item rather than inferring them from the source.",
        },
      ],
      explore: [
        { label: "Image archive", href: "/images", blurb: "Still imagery with verified provenance." },
        { label: "Licensing policy", href: "/sources-policy", blurb: "How the platform handles source terms." },
        { label: "Editorial policy", href: "/editorial-policy", blurb: "What the platform will and will not publish." },
      ],
      sources: ["nasa", "esa"],
      keywords: ["space video", "scientific visualisation", "artist impression", "time-lapse"],
    },
    {
      slug: "interactive-sky-maps",
      name: "Interactive Sky Maps",
      summary: "Pan-and-zoom maps of the night sky.",
      overview:
        "A sky map projects a sphere onto a flat display, and every projection distorts something. Understanding which distortion a given map accepts — and what coordinate frame it uses — is the difference between reading a chart correctly and being misled by it.",
      keyPoints: [
        "Every flat sky map distorts shape, area, or distance; no projection avoids all three.",
        "Sky charts are mirror-reversed relative to Earth maps because you view the sphere from inside.",
        "A chart is only valid for a stated coordinate epoch, because of precession.",
        "Equatorial, ecliptic and galactic coordinate frames each suit different purposes.",
      ],
      body: [
        {
          heading: "Projection, and what it costs",
          paragraphs: [
            "The sky is a sphere and a screen is flat, so a map must choose what to sacrifice. Stereographic projection preserves shapes locally and is common for detailed finder charts. Equal-area projections such as Aitoff and Mollweide preserve relative areas and are standard for whole-sky maps of surveys and the microwave background. Gnomonic projection renders great circles as straight lines, which suits plotting a trajectory.",
            "No projection preserves everything, and any all-sky map in a single frame necessarily distorts something badly near its edges. That is a mathematical fact about spheres, not a shortcoming of a particular tool.",
          ],
        },
        {
          heading: "Why sky charts look mirrored",
          paragraphs: [
            "An Earth map is drawn as seen from outside the globe. A sky chart is drawn as seen from inside the celestial sphere, because that is where the observer stands. Consequently east and west appear reversed relative to a terrestrial map — a chart with north up has east to the left.",
            "This trips up almost every beginner, and it becomes doubly confusing with an astronomical telescope, whose optics may invert the image, mirror it, or both depending on the design and whether a diagonal is used. Matching a chart to the eyepiece view often requires rotating or flipping one of them.",
          ],
        },
        {
          heading: "Coordinate frames and epochs",
          list: [
            "Equatorial coordinates — right ascension and declination — are referenced to Earth's rotation axis and equator. Standard for telescope pointing and most catalogues.",
            "Ecliptic coordinates are referenced to Earth's orbital plane, and are natural for Solar System work and for the zodiac.",
            "Galactic coordinates are referenced to the Milky Way's plane and centre, and are used for studying Galactic structure.",
            "Because precession moves the equatorial frame, coordinates must be quoted for an epoch — conventionally J2000.0. A position without an epoch is incompletely specified.",
          ],
        },
        {
          heading: "What a good interactive map tells you",
          paragraphs: [
            "Beyond drawing stars, a well-built sky map states the projection in use, the coordinate frame and epoch, the limiting magnitude of the catalogue it draws from, and the observer's assumed location and time. Without those, two maps can disagree and neither is checkable.",
            "The platform's sky atlas documents the catalogues, coordinate conventions and epochs behind its charts, and links each plotted object to its catalogue record. That traceability is the point: a chart should be a view onto data with provenance, not an unattributed picture.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why is east on the left of a star chart?",
          answer:
            "Because a sky chart shows the celestial sphere as seen from inside it, where the observer stands, whereas an Earth map shows the globe from outside. That inversion reverses east and west relative to a terrestrial map, so a chart oriented with north up has east on the left.",
        },
        {
          question: "Why do different sky maps use different projections?",
          answer:
            "Because each preserves a different property and no flat map preserves all of them. Stereographic projection preserves local shape and suits detailed finder charts; equal-area projections such as Aitoff and Mollweide preserve relative areas and suit whole-sky survey maps; gnomonic projection renders great circles as straight lines, which suits plotting trajectories.",
        },
        {
          question: "What does J2000.0 mean on a chart?",
          answer:
            "It is the reference epoch for the coordinate frame. Precession slowly rotates the equatorial coordinate grid relative to the stars, so any right ascension and declination must be quoted against a specified date. J2000.0 is the modern standard, and a position given without an epoch is incompletely specified.",
        },
      ],
      explore: [
        { label: "Sky atlas", href: "/sky-atlas", blurb: "Charts with documented catalogues and epochs." },
        { label: "Reference systems", href: "/reference-systems", blurb: "Coordinate frames, precession, and epochs." },
        { label: "Constellations", href: "/constellations", blurb: "The regions a chart divides the sky into." },
      ],
      sources: ["iau", "nasa", "hyg"],
      keywords: ["star map projection", "celestial coordinates", "J2000", "sky chart"],
    },
    {
      slug: "3d-solar-system",
      name: "3D Solar System",
      summary: "An interactive model of the Sun and its worlds.",
      overview:
        "Every visual model of the Solar System lies about something, because the real proportions cannot be shown on one screen. Knowing which compromise a given model has made is what makes it useful rather than misleading.",
      keyPoints: [
        "No model can show planet sizes and orbital distances at the same scale on one screen.",
        "At true scale with Earth as one pixel, Neptune would be over a kilometre away.",
        "Orbits are near-circular; textbook diagrams routinely exaggerate their eccentricity.",
        "The planets are almost never aligned, and diagrams showing them in a row are schematic.",
      ],
      body: [
        {
          heading: "The scale problem, quantified",
          paragraphs: [
            "The Sun is about 1.4 million kilometres across; Neptune orbits about 4.5 billion kilometres out. The ratio between the largest object and the largest distance is roughly three thousand to one, and between Earth's diameter and Neptune's orbital radius it is about 350,000 to one.",
            "Rendered honestly on a screen where Earth is a single pixel, Neptune's orbit would have a radius of hundreds of metres and the whole system would not fit in a stadium. Every usable model therefore exaggerates body sizes relative to distances — commonly by factors of thousands — and a model that does not say so is teaching a false intuition.",
          ],
        },
        {
          heading: "Orbits are rounder than diagrams suggest",
          paragraphs: [
            "Planetary orbits are ellipses, but the eccentricities are small: Earth's orbit deviates from a circle by well under a percent in shape, and even Mars, which is noticeably eccentric by planetary standards, is visually close to circular.",
            "Textbook diagrams routinely draw pronounced ellipses to illustrate Kepler's first law. That is pedagogically reasonable and physically misleading, and it is the source of the common misconception that Earth's seasons are caused by distance from the Sun rather than axial tilt.",
          ],
        },
        {
          heading: "Alignment and inclination",
          list: [
            "Planets orbit at slightly different inclinations, so the system is not perfectly flat — Mercury's orbit is inclined about seven degrees to the ecliptic.",
            "The planets are essentially never aligned. Because their orbital periods are unrelated, close alignments of even a few planets are rare and exact alignment of all eight does not occur on any human timescale.",
            "Diagrams showing planets in a row from the Sun are schematic aids, not depictions of a configuration.",
            "Orbital directions do share a sense — all planets orbit the same way, a legacy of the rotating disc they formed from.",
          ],
        },
        {
          heading: "What a good model provides",
          paragraphs: [
            "A useful interactive model states its scale distortion explicitly, lets the viewer switch between true-distance and true-size representations to feel the difference, sources its orbital elements from published data, and shows positions for a specified date rather than an arbitrary arrangement.",
            "The platform's 3D view and Solar System catalogue record the orbital elements and physical parameters they use, with the source for each value. Where a figure is derived rather than measured, that distinction is preserved — which is the difference between a visualisation built on data and one built on approximation.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why can't Solar System models be shown to scale?",
          answer:
            "Because the ratio of body sizes to orbital distances is too extreme. If Earth were a single pixel, Neptune's orbit would have a radius of hundreds of metres. Any model that fits on a screen must exaggerate body sizes relative to distances, typically by factors of thousands — and should say so.",
        },
        {
          question: "Are planetary orbits really that elliptical?",
          answer:
            "No. Textbook diagrams exaggerate eccentricity to illustrate Kepler's first law. Real planetary orbits are close to circular — Earth's deviates from a circle by well under a percent in shape. The exaggeration is a common source of the misconception that seasons are caused by varying distance from the Sun rather than by axial tilt.",
        },
        {
          question: "Do the planets ever line up?",
          answer:
            "Not in any meaningful sense. Their orbital periods are unrelated, so close groupings of a few planets are uncommon and an alignment of all eight does not occur on human timescales. Diagrams showing planets in a neat row from the Sun are schematic, not depictions of an actual configuration.",
        },
      ],
      explore: [
        { label: "3D universe", href: "/universe-3d", blurb: "The interactive model and its data sources." },
        { label: "Solar System", href: "/solar-system", blurb: "Measured masses, radii, and orbital elements." },
        { label: "Celestial mechanics", href: "/celestial-mechanics", blurb: "Orbital elements and what they mean." },
      ],
      sources: ["nasa", "jpl"],
      keywords: ["solar system model", "orbital scale", "eccentricity", "planetary alignment"],
    },
    {
      slug: "star-maps",
      name: "Star Maps",
      summary: "Reference and printable star charts.",
      overview:
        "A printed star chart is still the most practical tool for learning the sky, because it does not destroy dark adaptation and does not need power. Using one well means understanding limiting magnitude, orientation, and how to star-hop.",
      keyPoints: [
        "A chart's limiting magnitude determines what it shows and therefore what it is useful for.",
        "Paper charts under red light preserve night vision in a way screens do not.",
        "Star-hopping — navigating by recognisable patterns — is the core skill a chart supports.",
        "A planisphere shows the sky for any date and time at a given latitude.",
      ],
      body: [
        {
          heading: "Limiting magnitude decides the chart's purpose",
          paragraphs: [
            "Every chart plots stars down to some faintness limit. A naked-eye chart typically reaches magnitude 5 or 6 and shows a few thousand stars — enough to match what you can actually see, and no more. A binocular chart reaching magnitude 8 or 9 shows tens of thousands. A deep telescopic atlas may reach magnitude 11 or beyond and contain hundreds of thousands.",
            "Using a chart with the wrong limit is the most common practical error. A deep atlas is unusable for naked-eye orientation because the real sky shows a fraction of what is printed; a naked-eye chart is useless at the eyepiece because most of what you see is not on it.",
          ],
        },
        {
          heading: "Why paper still wins outdoors",
          paragraphs: [
            "Dark adaptation takes 20 to 30 minutes to develop and a moment of white light to destroy. A paper chart read under a dim red light preserves it; a screen, even in a red night mode, is generally far brighter than necessary and is a common cause of repeatedly losing night vision over a session.",
            "Paper also does not run out of battery in the cold, does not need a signal, and does not fail when wet in the way most devices do. For learning the sky specifically — as opposed to identifying a single object — a laminated chart and a red torch remain hard to improve on.",
          ],
        },
        {
          heading: "Star-hopping",
          list: [
            "Start from a bright star or a recognisable pattern you can identify without help.",
            "Identify a short chain of stars on the chart leading toward the target, ideally within one or two binocular or finder fields.",
            "Match the chart's orientation to the sky by rotating it — not by rotating your head — remembering that east is to the left when north is up.",
            "Move in short steps, confirming each pattern before continuing. Long jumps are where hops fail.",
            "Know the true field of view of your finder and eyepiece, so you can judge chart distances against what you actually see.",
          ],
        },
        {
          heading: "Planispheres and seasonal charts",
          paragraphs: [
            "A planisphere is a rotating chart with a mask that reveals the portion of sky above the horizon for any date and time at a given latitude. It is the single most useful learning tool for a beginner, because it makes the relationship between date, time and visible sky tangible rather than abstract.",
            "Its limitation is latitude: a planisphere is built for a specific range, and using one far outside that range distorts the horizon significantly. Seasonal charts, printed for particular months, avoid the mechanism but lose the ability to explore how the sky shifts through the night.",
          ],
        },
      ],
      faqs: [
        {
          question: "What limiting magnitude should a star chart have?",
          answer:
            "It depends on how you observe. A naked-eye chart reaching magnitude 5 or 6 matches what you can actually see and suits learning constellations. A binocular chart at magnitude 8 or 9 suits sweeping for clusters and brighter deep-sky objects. A telescopic atlas at magnitude 11 or beyond suits the eyepiece but is unusable for naked-eye orientation.",
        },
        {
          question: "Why use a paper chart instead of a phone?",
          answer:
            "Mainly to protect dark adaptation. Night vision takes 20 to 30 minutes to develop and is largely destroyed by a moment of bright light; even a red-mode screen is usually far brighter than needed. Paper under a dim red torch avoids that, and it does not fail in cold, wet or signal-free conditions.",
        },
        {
          question: "What is star-hopping?",
          answer:
            "Navigating to a faint target by moving in short steps along a chain of recognisable stars from a bright starting point, matching the chart to the sky at each step. It is the core skill a star chart supports, and it works best in hops small enough to fit within one or two finder fields.",
        },
        {
          question: "What is a planisphere?",
          answer:
            "A rotating star chart with a mask that reveals the part of the sky above the horizon for any date and time, at a specific latitude. It is among the most effective beginner tools because it makes the relationship between date, time and visible sky concrete. Its limitation is that it is built for a particular latitude range.",
        },
      ],
      explore: [
        { label: "Sky atlas", href: "/sky-atlas", blurb: "Charts, catalogues, and coordinate conventions." },
        { label: "Observing", href: "/observing", blurb: "Practical technique at the eyepiece." },
        { label: "Constellations", href: "/constellations", blurb: "The patterns a chart is built around." },
      ],
      sources: ["iau", "nasa", "hyg"],
      keywords: ["star chart", "planisphere", "star hopping", "limiting magnitude"],
    },
    {
      slug: "nasa-image-archive",
      name: "NASA Image Archive",
      summary: "How NASA's imagery archives are organised and searched.",
      overview:
        "NASA's imagery is not in one place. It is distributed across mission archives, institutional collections and science data centres, each organised differently — and knowing which archive holds what is the practical skill in finding a specific image.",
      keyPoints: [
        "There is no single NASA image archive; there are many, organised by mission and discipline.",
        "Science data archives hold calibrated data, not display images, and require processing.",
        "Press-release imagery and archival science data are different products from the same observations.",
        "Every catalogued item on this platform links to its official archive record.",
      ],
      body: [
        {
          heading: "The archive landscape",
          list: [
            "Mission and programme archives hold imagery organised by spacecraft and observation, and are the authoritative record for a given mission.",
            "Institutional archives such as those operated by STScI hold space telescope data and the processed releases derived from it.",
            "Discipline-specific science archives hold calibrated instrument data — for planetary, high-energy, infrared and solar physics — intended for research use rather than viewing.",
            "Public-facing galleries curate a selection for general audiences, and are the easiest to browse but the least complete.",
          ],
        },
        {
          heading: "Press images and science data are different products",
          paragraphs: [
            "A published release image and the archived science data behind it are not the same thing. The release has been processed for display: filters combined and assigned to colour channels, contrast stretched non-linearly to make faint structure visible, artefacts removed, and the field cropped and rotated for composition.",
            "The archived data is calibrated but not composed — separate exposures per filter, with instrumental signatures characterised rather than hidden. Research uses the latter. Anyone expecting to download a finished picture from a science archive will instead find files requiring substantial processing, which is a frequent source of confusion.",
          ],
        },
        {
          heading: "Proprietary periods and open release",
          paragraphs: [
            "Most major observatories operate a proprietary period, typically around a year, during which data is available only to the team that proposed the observation. After it expires the data becomes public and anyone can use it.",
            "This is why archival research is productive: a large share of published results now come from data someone else obtained for a different purpose. It is also why archives keep producing new science long after a mission ends — Hubble and Spitzer archives remain actively mined.",
          ],
        },
        {
          heading: "How the platform links to them",
          paragraphs: [
            "Every catalogued image on Asteria Star records the archive it came from and links to the official record, so a reader can verify the credit, the licence and the observing context at the source rather than taking this platform's word for it.",
            "That is the intended relationship: the archives are authoritative, and this platform is a provenance and navigation layer over them. It does not mirror them, and it does not claim holdings it has not verified.",
          ],
        },
      ],
      faqs: [
        {
          question: "Is there one NASA image archive?",
          answer:
            "No. Imagery is distributed across mission archives, institutional collections such as those operated by STScI, discipline-specific science data centres, and public-facing galleries. Each is organised differently, and knowing which holds what is the practical skill in finding a specific image.",
        },
        {
          question: "Why can't I just download the picture from a science archive?",
          answer:
            "Because science archives hold calibrated instrument data, not finished images. What you get is separate exposures per filter with instrumental signatures characterised rather than removed, requiring substantial processing to become a viewable picture. Published release images have already been combined, stretched, cleaned and composed for display.",
        },
        {
          question: "What is a proprietary period?",
          answer:
            "An interval, typically around a year, during which observational data is available only to the team that proposed it. After it expires the data becomes public. This is why archival research is so productive — a large share of published results now use data originally obtained by someone else for a different purpose.",
        },
      ],
      explore: [
        { label: "Data archives", href: "/data-archives", blurb: "Astronomical archives as catalogued entities." },
        { label: "Image archive", href: "/images", blurb: "The platform's verified image catalogue." },
        { label: "Open data", href: "/open-data", blurb: "The platform's own exports and API." },
      ],
      sources: ["nasa", "stsci"],
      dataModule: true,
      keywords: ["NASA archive", "science data", "proprietary period", "image processing"],
    },
    {
      slug: "esa-image-archive",
      name: "ESA Image Archive",
      summary: "How ESA's imagery and science archives are organised.",
      overview:
        "ESA maintains separate public imagery channels and scientific data archives, with different access models and different licence terms. The distinction matters both for finding material and for using it lawfully.",
      keyPoints: [
        "ESA's public imagery and its science archives are separate systems with different terms.",
        "The ESAC Science Data Centre is the principal home for ESA mission science data.",
        "Gaia's data releases are among the most widely used astronomical datasets in existence.",
        "Joint-mission material may be distributed by more than one agency under different terms.",
      ],
      body: [
        {
          heading: "Two distinct systems",
          paragraphs: [
            "ESA's public-facing imagery channels distribute release pictures, mission photography and visualisations for general use, generally under Creative Commons Attribution–ShareAlike terms. This is where most people encounter ESA imagery.",
            "Its science archives are a separate matter. The ESAC Science Data Centre hosts calibrated data from ESA missions for research use, organised by mission and instrument, with access models and terms set per mission. The two systems answer different questions and should not be assumed to share licensing.",
          ],
        },
        {
          heading: "The datasets that matter most",
          list: [
            "Gaia's astrometric data releases — positions, parallaxes and proper motions for over a billion stars — underpin a very large share of contemporary stellar and Galactic astronomy.",
            "Planck's full-sky microwave background maps remain a primary cosmological dataset.",
            "Rosetta's comet 67P observations constitute the most detailed dataset ever obtained for a comet.",
            "Mars Express, Venus Express and BepiColombo hold long-baseline planetary observation records.",
            "XMM-Newton's X-ray archive is one of the principal high-energy astronomical datasets.",
          ],
        },
        {
          heading: "Joint missions complicate provenance",
          paragraphs: [
            "Hubble and JWST are operated as international partnerships, and their data and imagery are distributed through both American and European channels. The same observation may therefore be obtainable from more than one archive, potentially under different stated terms and with differently formatted credit lines.",
            "For provenance purposes this means naming the archive an item actually came from, not the agency that seems most associated with the mission. The platform's records identify the specific source, which is the only way the licence claim can be checked.",
          ],
        },
        {
          heading: "Why Gaia is the outlier",
          paragraphs: [
            "Gaia deserves separate mention because of its effect on everything downstream. By measuring parallaxes for over a billion stars, it replaced the previous distance foundation — Hipparcos, with about a hundred thousand — by four orders of magnitude in scale and substantially in precision.",
            "Distance underpins luminosity, and luminosity underpins mass and age, so a large fraction of stellar parameters published since Gaia's releases ultimately depend on its measurements. Several of the stellar catalogues on this platform carry Gaia-derived values with that provenance recorded.",
          ],
        },
      ],
      faqs: [
        {
          question: "Where does ESA publish its mission data?",
          answer:
            "Principally through the ESAC Science Data Centre, which hosts calibrated data from ESA missions organised by mission and instrument, with terms set per mission. That is separate from ESA's public imagery channels, which distribute release pictures and visualisations generally under Creative Commons Attribution–ShareAlike terms.",
        },
        {
          question: "Why is Gaia data so widely used?",
          answer:
            "Because it supplies the distance foundation for stellar astronomy. Gaia measured parallaxes for over a billion stars, against roughly a hundred thousand from its predecessor Hipparcos, and with substantially better precision. Since distance underpins luminosity, and luminosity underpins mass and age, a large share of published stellar parameters now depend on it.",
        },
        {
          question: "Can the same image come from both NASA and ESA archives?",
          answer:
            "Yes, for jointly operated missions such as Hubble and JWST. The same observation may be distributed through both agencies' channels, potentially under different stated terms and with differently formatted credit lines. For provenance the archive an item actually came from must be named, not the agency most associated with the mission.",
        },
      ],
      explore: [
        { label: "Data archives", href: "/data-archives", blurb: "Astronomical archives as catalogued entities." },
        { label: "Image archive", href: "/images", blurb: "The platform's verified image catalogue." },
        { label: "Data health", href: "/authority/data-health", blurb: "Freshness and provenance of the platform's snapshots." },
      ],
      sources: ["esa", "gaia", "esa-hubble", "esa-webb"],
      dataModule: true,
      keywords: ["ESA archive", "Gaia data release", "ESAC", "science data"],
    },
    {
      slug: "launches",
      name: "Launches",
      summary: "How orbital launch works, and why schedules move.",
      overview:
        "Launch is the most constrained part of spaceflight: a narrow window set by orbital mechanics, a vehicle operating at the limits of its margins, and weather rules that ground flights for conditions that look unremarkable from the ground.",
      keyPoints: [
        "Launch windows are set by orbital geometry, not by convenience.",
        "Reaching orbit is mostly about horizontal speed, not altitude.",
        "Launch site latitude constrains which orbits are efficiently reachable.",
        "Scrubs are routine, and most are weather or minor technical issues rather than failures.",
      ],
      body: [
        {
          heading: "Orbit is about sideways speed",
          paragraphs: [
            "The common mental model of launch — going up — is misleading. Reaching the altitude of low Earth orbit is comparatively easy; staying there requires roughly 7.8 kilometres per second of horizontal velocity, and the overwhelming majority of a launch vehicle's energy goes into that rather than into altitude.",
            "This is why rockets pitch over shortly after lift-off and spend most of the ascent travelling nearly horizontally. A suborbital flight reaching space and falling back differs from an orbital flight not in height but in speed, by a very large margin.",
          ],
        },
        {
          heading: "Why windows are narrow",
          list: [
            "Rendezvous missions must launch when the target's orbital plane passes over the launch site, which for the ISS gives windows lasting minutes.",
            "Interplanetary missions need the correct relative planetary geometry, recurring at intervals of months to years.",
            "Sun-synchronous orbits require launch at a specific local solar time to achieve the intended orbital plane orientation.",
            "Geostationary transfers are less constrained but still shaped by the need to minimise plane-change energy.",
            "Missing a window can mean a delay of a day, a month, or in interplanetary cases years.",
          ],
        },
        {
          heading: "Latitude shapes what is reachable",
          paragraphs: [
            "A launch site's latitude sets the minimum orbital inclination directly reachable without an expensive plane change: a vehicle cannot reach an orbit inclined less than the launch latitude without additional manoeuvring. Equatorial sites are therefore advantaged for geostationary missions.",
            "Earth's rotation adds a further benefit, providing roughly 460 metres per second of eastward velocity at the equator and less at higher latitudes. Both effects explain why launch sites cluster at low latitudes where geography and politics permit, and why high-latitude sites specialise in polar and sun-synchronous orbits.",
          ],
        },
        {
          heading: "Why launches scrub",
          paragraphs: [
            "Delays are normal and are usually not failures. Weather rules are stricter than they appear: constraints cover upper-level winds, cloud types capable of triggering lightning, and conditions along the ascent corridor and at abort landing sites, so a launch can scrub under a clear blue sky.",
            "Technical scrubs frequently involve sensor readings out of tolerance rather than confirmed faults, and holds are also called for range conflicts such as a boat or aircraft entering the safety zone. A scrubbed launch generally reflects margins being enforced, which is what they exist for. Asteria Star records planned launches as planned and does not present schedules as commitments.",
          ],
        },
      ],
      faqs: [
        {
          question: "Why are launch windows sometimes only a few minutes long?",
          answer:
            "Because of orbital geometry. To rendezvous with something already in orbit, a vehicle must launch as the target's orbital plane passes over the site, and that alignment lasts only minutes. Interplanetary launches face the same constraint over much longer cycles, with windows recurring at intervals of months or years.",
        },
        {
          question: "Why do rockets tilt over instead of going straight up?",
          answer:
            "Because orbit is mainly about horizontal speed, not altitude. Staying in low Earth orbit requires roughly 7.8 kilometres per second sideways, and most of a launch vehicle's energy goes into achieving that. Climbing straight up would reach space and fall straight back down.",
        },
        {
          question: "Why does a launch scrub on a clear day?",
          answer:
            "Because launch weather rules cover far more than visible conditions at the pad — upper-level winds, cloud types capable of triggering lightning, and conditions along the ascent corridor and at abort landing sites all apply. Technical scrubs are also often triggered by sensor readings out of tolerance rather than by confirmed faults.",
        },
        {
          question: "Why are launch sites usually near the equator?",
          answer:
            "Two reasons. A site's latitude sets the minimum orbital inclination reachable without an expensive plane change, so equatorial sites suit geostationary missions. And Earth's rotation supplies about 460 metres per second of free eastward velocity at the equator, decreasing toward the poles.",
        },
      ],
      explore: [
        { label: "Rockets", href: "/rockets", blurb: "Launch vehicles, engines, and propellants." },
        { label: "Space infrastructure", href: "/space-infrastructure", blurb: "Launch sites, pads, and ground systems." },
        { label: "Spaceflight timeline", href: "/timeline", blurb: "Launches in chronological order." },
      ],
      sources: ["nasa", "esa", "spacex", "arianespace"],
      dataModule: true,
      keywords: ["launch window", "orbital velocity", "launch site latitude", "scrub"],
    },
  ],
};
