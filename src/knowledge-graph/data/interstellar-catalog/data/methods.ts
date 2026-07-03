import type { InterstellarRecord } from "@/knowledge-graph/data/interstellar-catalog/types";

/**
 * INTERSTELLAR DETECTION METHODS — the techniques used to recognise an object that
 * originated beyond the Solar System (and to tell it apart from a Solar-System comet on
 * a merely hyperbolic orbit). These describe how the determination is made, keeping the
 * evidentiary basis explicit; they assert no result themselves.
 */

const mk = (r: Omit<InterstellarRecord, "kind" | "id"> & { slug: string }): InterstellarRecord => ({
  ...r,
  kind: "detection-method",
  id: `interstellar_detection_method:${r.slug}`,
  category: r.category ?? "method",
});

export const methods: InterstellarRecord[] = [
  mk({
    slug: "excess-hyperbolic-velocity",
    name: "Excess Hyperbolic Velocity",
    altNames: ["Excess velocity (v∞)", "Hyperbolic excess speed"],
    description:
      "The primary signature of an interstellar object: its speed relative to the Sun exceeds the local escape velocity by enough that the orbit is strongly hyperbolic (eccentricity well above 1). A large hyperbolic excess velocity (v∞) cannot be produced by planetary perturbations, so it points to an origin outside the Solar System. A small excess, by contrast, can come from a planetary slingshot and does not by itself prove an interstellar origin.",
    definition:
      "Measuring that an object's velocity exceeds Solar escape speed by a margin too large to be explained within the Solar System.",
    sources: ["jpl", "nasa", "ads"],
  }),
  mk({
    slug: "incoming-trajectory-analysis",
    name: "Incoming-Trajectory Analysis",
    altNames: ["Orbit determination", "Backward trajectory tracing"],
    description:
      "Determining an object's orbit from astrometry and tracing its path backward. An unbound, strongly hyperbolic incoming trajectory — arriving from interstellar space rather than from the planetary region — establishes that the object was not on a closed Solar orbit. The direction it came from (its radiant) can also be identified, though no specific parent star has been pinned down for any interstellar object.",
    definition:
      "Fitting an orbit to astrometric positions and running it backward to show the object arrived unbound from outside the planetary region.",
    sources: ["mpc", "jpl", "nasa"],
  }),
  mk({
    slug: "spectroscopic-composition",
    name: "Spectroscopic Composition Analysis",
    altNames: ["Spectroscopy", "Compositional characterisation"],
    description:
      "Taking spectra and colours of a visitor to characterise its surface or coma chemistry and compare it with Solar-System comets and asteroids. Spectroscopy does not by itself prove an interstellar origin — the orbit does that — but it reveals what a body from another planetary system is made of, as with the carbon-monoxide-rich coma of 2I/Borisov.",
    definition:
      "Comparing the light (spectra, colours) of a visitor with Solar-System bodies to characterise its composition.",
    sources: ["eso", "nasa", "ads"],
  }),
];
