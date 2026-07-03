import type { SatelliteRecord } from "@/knowledge-graph/data/satellites-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Ground tracking networks (new first-class entities). Each is operated_by an
 * existing agency; ground stations are described rather than modelled as separate
 * entities (a stated scope limit, not fabricated data).
 */
type N = { slug: string; name: string; agency: string; country: string; sources?: SourceKey[]; alt?: string[]; description: string };
const mk = (n: N): SatelliteRecord => ({
  id: `tracking_network:${n.slug}`,
  slug: n.slug,
  name: n.name,
  kind: "network",
  altNames: n.alt,
  description: n.description,
  sources: n.sources ?? ["nasa"],
  networkAgencySlug: n.agency,
  country: n.country,
});

export const networks: SatelliteRecord[] = [
  mk({ slug: "deep-space-network", name: "Deep Space Network (DSN)", agency: "nasa", country: "United States", sources: ["nasa"], alt: ["DSN"], description: "NASA's international array of giant radio antennas — at Goldstone (California), Madrid, and Canberra — that communicates with interplanetary spacecraft and distant satellites, spaced around the globe for continuous coverage." }),
  mk({ slug: "near-space-network", name: "Near Space Network", agency: "nasa", country: "United States", sources: ["nasa"], alt: ["NSN", "Space Network", "Ground Network"], description: "NASA's network of ground stations and relay satellites (formerly the Space Network's TDRSS and the Ground Network) that supports missions in Earth orbit and near-Earth space." }),
  mk({ slug: "estrack", name: "ESTRACK", agency: "esa", country: "Europe", sources: ["esa"], alt: ["ESA Tracking Network"], description: "The European Space Agency's global network of ground tracking stations that communicates with ESA's Earth-orbiting and deep-space missions." }),
];
