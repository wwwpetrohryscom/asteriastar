import type { PlanetologyRecord } from "@/knowledge-graph/data/comparative-planetology-catalog/types";

/** Planetary interior layers — the structure beneath the surface. Each links to the REUSED planets
 *  that exemplify it and the processes that shape it. */
const intr = (r: Omit<PlanetologyRecord, "kind" | "id" | "sources"> & { slug: string; sources?: PlanetologyRecord["sources"] }): PlanetologyRecord => ({ sources: ["nasa"], ...r, kind: "interior", id: `planetary_interior:${r.slug}` });

export const interiors: PlanetologyRecord[] = [
  intr({ slug: "core", name: "Core", relatedKeys: ["planet:earth", "planet:mercury", "planetary_process:planetary-differentiation"], description: "The dense central region of a planet or moon, typically the heaviest material that sank inward as the body formed. In the terrestrial planets it is largely iron; where it is partly molten and convecting, as in Earth, it can generate a global magnetic field.", sources: ["nasa"], highlights: ["Where a planet's magnetic field is born"] }),
  intr({ slug: "mantle", name: "Mantle", relatedKeys: ["planet:earth", "planetary_process:plate-tectonics", "planetary_process:volcanism"], description: "The thick layer between core and crust, made of hot rock that, though solid, flows over geological time. Its slow convection carries heat outward and drives the tectonics and volcanism that resurface a planet.", sources: ["nasa"] }),
  intr({ slug: "crust", name: "Crust", relatedKeys: ["planet:earth", "planet:mars", "planetary_process:volcanism"], description: "The thin, rigid outermost solid layer of a rocky planet or moon — the product of differentiation and volcanism, and the surface on which its geological history is written.", sources: ["nasa"] }),
];
