import { engine } from "@/platform/data-engine";
import type { ArchiveRecord } from "@/knowledge-graph/data/data-archives-catalog/types";

/** Engine-driven discovery hubs for the Space Data Archives & Open Science Infrastructure Encyclopedia. */
export interface AtDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => ArchiveRecord[];
}

const e = engine.dataArchives;

export const AT_DISCOVERIES: AtDiscovery[] = [
  { slug: "the-archives", title: "The Science Archives", description: "Where the data lives — the great archives that hold and serve the observations of the world's telescopes and surveys.", get: () => e.archives() },
  { slug: "data-standards", title: "Data Standards", description: "The formats that let data be shared — FITS, VOTable, and the standards astronomy is built on.", get: () => e.standards() },
  { slug: "the-virtual-observatory", title: "The Virtual Observatory", description: "The interoperability framework and the access protocols that make the world's archives searchable as one — TAP, Cone Search, and the query standards of the Virtual Observatory.", get: () => e.protocols() },
  { slug: "open-science", title: "Open Science", description: "The practices that make data usable and trustworthy — pipelines, identifiers, citation, and reproducibility.", get: () => e.practices() },
];

const BY_SLUG = new Map(AT_DISCOVERIES.map((d) => [d.slug, d]));
export function getAtDiscovery(slug: string): AtDiscovery | undefined {
  return BY_SLUG.get(slug);
}
