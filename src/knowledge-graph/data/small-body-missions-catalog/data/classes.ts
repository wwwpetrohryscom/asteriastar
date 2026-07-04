import type { SmallBodyRecord } from "@/knowledge-graph/data/small-body-missions-catalog/types";

/**
 * Mission classes — the ways a spacecraft can explore a small body. A single mission
 * often belongs to several classes (an orbiter that also lands, or a rendezvous that
 * also returns a sample), so missions link to these via member_of_group rather than
 * being forced into one bucket.
 */

const mk = (r: Omit<SmallBodyRecord, "kind" | "id"> & { slug: string }): SmallBodyRecord => ({
  ...r,
  kind: "class",
  id: `mission_class:${r.slug}`,
});

export const classes: SmallBodyRecord[] = [
  mk({
    slug: "flyby",
    name: "Flyby Mission",
    description: "A spacecraft that passes a small body once at high speed, gathering images and data during a brief encounter. Flybys are the cheapest way to reach a new target — Giotto at Halley, Deep Space 1 at Borrelly, Lucy at the Trojans.",
    definition: "A single high-speed pass of a target body, without entering orbit.",
    sources: ["nasa", "esa"],
  }),
  mk({
    slug: "rendezvous",
    name: "Rendezvous Mission",
    description: "A spacecraft that matches a small body's orbit and stays with it for an extended study, rather than flying past. Rendezvous enables detailed mapping and, often, orbiting or landing.",
    definition: "Matching a target's orbit to accompany it, enabling prolonged study.",
    sources: ["nasa", "esa"],
  }),
  mk({
    slug: "orbiter",
    name: "Orbiter Mission",
    description: "A spacecraft that enters orbit around a small body to map it globally over time — NEAR at Eros, Dawn at Vesta and Ceres, Rosetta at comet 67P.",
    definition: "Entering and maintaining orbit around a target for global, long-term study.",
    sources: ["nasa", "esa"],
  }),
  mk({
    slug: "lander",
    name: "Lander Mission",
    description: "A spacecraft (or a deployed element) that touches down on a small body's surface — Philae on comet 67P, NEAR on Eros, and the touchdown sampling of Hayabusa and Hayabusa2.",
    definition: "Placing a spacecraft or lander onto the surface of a target body.",
    sources: ["nasa", "esa", "jaxa"],
  }),
  mk({
    slug: "impactor",
    name: "Impactor Mission",
    description: "A spacecraft (or a released projectile) that deliberately strikes a small body — to excavate subsurface material (Deep Impact) or to deflect it (DART).",
    definition: "Deliberately striking a target body to excavate material or change its orbit.",
    sources: ["nasa"],
  }),
  mk({
    slug: "sample-return",
    name: "Sample-Return Mission",
    description: "A mission that collects material from a small body and brings it back to Earth for laboratory study — Hayabusa (Itokawa), Hayabusa2 (Ryugu), OSIRIS-REx (Bennu), and Stardust (comet Wild 2).",
    definition: "Collecting material from a target body and returning it to Earth.",
    sources: ["nasa", "jaxa"],
  }),
];
