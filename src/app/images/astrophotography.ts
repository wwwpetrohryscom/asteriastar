/**
 * Astrophotography guides — reference content, kept clearly separate from the
 * institutional scientific imagery in the rest of the platform. Community/amateur
 * image submissions are prepared for a future contribution system; no amateur
 * photographs or credits are fabricated here.
 */
export interface AstroGuide {
  slug: string;
  title: string;
  kind: "equipment" | "processing" | "observation";
  summary: string;
  sections: { heading: string; body: string }[];
}

export const ASTRO_GUIDES: AstroGuide[] = [
  {
    slug: "equipment", title: "Astrophotography Equipment", kind: "equipment",
    summary: "What you actually need to photograph the night sky — from a phone on a tripod to a tracked telescope.",
    sections: [
      { heading: "Start with what you have", body: "A modern camera or phone on a steady tripod can already capture star trails, the Milky Way, bright conjunctions, and the Moon. A remote shutter or timer avoids shake." },
      { heading: "Wide-field", body: "A camera with a fast wide lens (e.g. f/2.8 or faster) on a tripod captures constellations and the Milky Way. A simple star tracker counteracts Earth's rotation and allows longer, sharper exposures." },
      { heading: "Deep-sky", body: "Faint galaxies and nebulae need a tracking mount, a telescope or telephoto lens, and many stacked exposures. Guiding and a cooled astronomy camera help at the high end." },
      { heading: "Planetary & lunar", body: "Planets and the Moon are bright and small: a telescope with a high-frame-rate camera, capturing thousands of frames to 'stack' the sharpest, works best." },
    ],
  },
  {
    slug: "processing", title: "Image Processing", kind: "processing",
    summary: "How raw frames become a finished astrophoto — and how to stay honest about what is real.",
    sections: [
      { heading: "Calibration & stacking", body: "Multiple 'light' frames are combined (stacked) to boost signal over noise, with calibration frames (darks, flats, bias) removing sensor artefacts and vignetting." },
      { heading: "Stretching", body: "Astronomical data is stretched to reveal faint detail hidden in the raw linear image, then colour-balanced. Good practice keeps stars and structures true to the data." },
      { heading: "Honesty in processing", body: "Enhancing contrast and colour is normal; inventing features is not. Reputable astrophotographers disclose their acquisition and processing, mirroring the provenance standard this platform applies to institutional imagery." },
    ],
  },
  {
    slug: "observation", title: "Planning an Imaging Session", kind: "observation",
    summary: "Planning a night: targets, the Moon, weather, and dark skies.",
    sections: [
      { heading: "Pick a target for the season", body: "Different objects are up at different times of year and night. The observing calendar and each object's page can help you plan what is well placed." },
      { heading: "Mind the Moon and the weather", body: "A bright Moon washes out faint targets; plan deep-sky imaging near new Moon. Clear, steady air ('good seeing') matters most for planetary work." },
      { heading: "Find dark skies", body: "Light pollution is the biggest obstacle for deep-sky imaging. Darker sites dramatically improve results — the same reason professional observatories are built in remote places." },
    ],
  },
];

const BY_SLUG = new Map(ASTRO_GUIDES.map((g) => [g.slug, g]));
export function getAstroGuide(slug: string): AstroGuide | undefined { return BY_SLUG.get(slug); }
