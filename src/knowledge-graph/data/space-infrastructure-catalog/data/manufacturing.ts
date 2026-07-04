import type { InfraRecord } from "@/knowledge-graph/data/space-infrastructure-catalog/types";

/** In-space manufacturing and construction processes. Each is member_of_group the
 *  manufacturing domain and associated_with the reused stations and components. */
const proc = (cat: InfraRecord["category"]) => (r: Omit<InfraRecord, "kind" | "id" | "category" | "domainSlug"> & { slug: string }): InfraRecord => ({ ...r, kind: "manufacturing", id: `space_manufacturing_process:${r.slug}`, category: cat, domainSlug: "in-space-manufacturing" });
const mfg = proc("manufacturing"); const con = proc("construction");
const ISS = "satellite:international-space-station";

export const manufacturingProcesses: InfraRecord[] = [
  mfg({ slug: "additive-manufacturing", name: "Additive Manufacturing", altNames: ["3D printing in space"], maturity: "operational", description: "3D-printing parts and tools in orbit, layer by layer. A 3D printer has operated aboard the ISS since 2014, printing tools and spares on demand and pointing toward a future where spacecraft parts are made in space rather than launched.", relatedKeys: [ISS], sources: ["nasa"], highlights: ["A 3D printer has run on the ISS since 2014"] }),
  con({ slug: "in-space-assembly", name: "In-Space Assembly", altNames: ["On-orbit assembly"], maturity: "in-development", description: "Building large structures in space from parts, rather than folding a finished structure into a rocket fairing. In-space assembly would allow telescopes, antennas, and stations far larger than any launch vehicle could carry whole.", relatedKeys: [ISS, "spacecraft_component:robotic-arm"], sources: ["nasa"], highlights: ["Structures larger than any rocket fairing"] }),
  mfg({ slug: "on-orbit-servicing", name: "On-Orbit Servicing", altNames: ["Satellite servicing"], maturity: "demonstrated", description: "Repairing, refuelling, and upgrading spacecraft in orbit instead of discarding them — extending mission life and reducing debris. Robotic servicing missions have already docked with and relocated satellites.", relatedKeys: ["spacecraft_component:robotic-arm"], sources: ["nasa"], highlights: ["Robots have already serviced satellites on orbit"] }),
  con({ slug: "autonomous-construction", name: "Autonomous Construction", altNames: ["Construction robotics", "Autonomous assembly"], maturity: "in-development", description: "Using robots to build and maintain infrastructure in space and on other worlds with little or no human presence — laying landing pads, assembling habitats, and constructing solar farms before crews arrive.", relatedKeys: ["spacecraft_component:robotic-arm", "moon:the-moon"], sources: ["nasa"] }),
];
