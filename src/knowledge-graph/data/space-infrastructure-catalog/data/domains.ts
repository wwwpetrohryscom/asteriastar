import type { InfraRecord } from "@/knowledge-graph/data/space-infrastructure-catalog/types";

/** The domains of space manufacturing and in-space infrastructure. */
const domain = (r: Omit<InfraRecord, "kind" | "id" | "category"> & { slug: string }): InfraRecord => ({ ...r, kind: "domain", id: `infrastructure_domain:${r.slug}`, category: "domain" });

export const domains: InfraRecord[] = [
  domain({ slug: "in-situ-resource-utilisation", name: "In-Situ Resource Utilisation", altNames: ["ISRU"], description: "Using the materials found on the Moon, Mars, and asteroids — water ice, regolith, and metals — instead of launching everything from Earth. ISRU is the key to affordable, sustained exploration beyond low Earth orbit.", definition: "Using local materials in space rather than launching them.", sources: ["nasa"], highlights: ["The key to living off the land beyond Earth"] }),
  domain({ slug: "in-space-manufacturing", name: "In-Space Manufacturing", description: "Making and assembling things in space — 3D-printing parts on a station, building large structures on orbit, and servicing spacecraft — rather than launching everything fully formed inside a rocket fairing.", definition: "Manufacturing, assembling, and servicing in space.", sources: ["nasa"] }),
  domain({ slug: "orbital-infrastructure", name: "Orbital & Surface Infrastructure", description: "The persistent facilities that a spacefaring economy needs — propellant depots, habitats, and surface bases — and the megastructure concepts, from space elevators to mass drivers, that would transform access to space.", definition: "Persistent facilities and megastructures in space.", sources: ["nasa"] }),
  domain({ slug: "space-based-power", name: "Space-Based Power", description: "Generating power in space and beaming it where it is needed — from the arrays that power a station to the concept of space solar-power satellites that would collect sunlight in orbit and send it to Earth.", definition: "Generating and distributing power in space.", sources: ["nasa"] }),
  domain({ slug: "in-space-logistics", name: "In-Space Logistics", description: "Moving cargo and spacecraft around in space — orbital tugs, in-space refuelling, and reusable transfer vehicles — the transport layer of an in-space economy.", definition: "Transporting cargo and spacecraft within space.", sources: ["nasa"] }),
];
