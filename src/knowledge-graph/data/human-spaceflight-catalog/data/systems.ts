import type { HsfRecord } from "@/knowledge-graph/data/human-spaceflight-catalog/types";

/**
 * Supporting systems and research topics: docking systems, life support,
 * experiments, and space-medicine topics. Each connects to the ISS, which it
 * is attached to, supports, or is studied aboard.
 */
const ISS = "international-space-station";
const D = (slug: string, name: string, alt: string[] | undefined, description: string): HsfRecord =>
  ({ id: `docking_system:${slug}`, slug, name, kind: "docking-system", altNames: alt, stationSlug: ISS, description, sources: ["nasa"] });
const L = (slug: string, name: string, alt: string[] | undefined, description: string): HsfRecord =>
  ({ id: `life_support_system:${slug}`, slug, name, kind: "life-support", altNames: alt, stationSlug: ISS, description, sources: ["nasa"] });
const X = (slug: string, name: string, description: string): HsfRecord =>
  ({ id: `space_experiment:${slug}`, slug, name, kind: "experiment", stationSlug: ISS, description, sources: ["nasa"] });
const Med = (slug: string, name: string, description: string): HsfRecord =>
  ({ id: `space_medicine_topic:${slug}`, slug, name, kind: "medicine", stationSlug: ISS, description, sources: ["nasa"] });

export const systems: HsfRecord[] = [
  D("probe-and-drogue", "Probe-and-drogue docking system", undefined, "The probe-and-drogue docking system is the long-serving Russian mechanism used by Soyuz and Progress to dock with space stations, including the ISS Russian segment."),
  D("apas", "APAS", ["Androgynous Peripheral Attach System"], "The Androgynous Peripheral Attach System is a docking mechanism developed for the Apollo–Soyuz Test Project and later used by the Space Shuttle to dock with Mir and the ISS."),
  D("idss", "International Docking System Standard", ["IDSS", "IDA"], "The International Docking System Standard, implemented on the ISS as the International Docking Adapters, allows Crew Dragon and Starliner to dock autonomously."),

  L("eclss", "Environmental Control and Life Support System", ["ECLSS"], "The Environmental Control and Life Support System keeps a station's crew alive by recycling air and water, controlling temperature and pressure, and removing carbon dioxide."),

  X("nasa-twins-study", "NASA Twins Study", "The NASA Twins Study compared astronaut Scott Kelly during a year aboard the ISS with his identical twin on Earth, advancing understanding of how spaceflight affects the human body."),

  Med("bone-density-loss", "Bone density loss", "In microgravity the human body loses bone mass, a key concern for long-duration spaceflight that is studied and countered aboard the ISS."),
  Med("muscle-atrophy", "Muscle atrophy", "Without gravity to work against, muscles weaken in space; resistance exercise aboard stations helps crews maintain strength."),
  Med("space-radiation", "Space radiation exposure", "Beyond Earth's protective atmosphere and much of its magnetic field, astronauts face increased radiation, a central challenge for long missions."),
  Med("fluid-shift", "Fluid shift and vision changes", "In weightlessness, body fluids shift toward the head, contributing to the vision changes studied as Spaceflight-Associated Neuro-ocular Syndrome (SANS)."),
];
