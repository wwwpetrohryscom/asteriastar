import type { ArchiveRecord } from "@/knowledge-graph/data/data-archives-catalog/types";

/** The Virtual Observatory framework and its access protocols. The framework is a distinct kind
 *  from the protocols it parents; each protocol is associated_with the VO and the REUSED standards
 *  and methods it builds on. */
const fw = (r: Omit<ArchiveRecord, "kind" | "id" | "sources"> & { slug: string; sources?: ArchiveRecord["sources"] }): ArchiveRecord => ({ sources: ["nasa"], ...r, kind: "framework", id: `vo_framework:${r.slug}` });
const pr = (r: Omit<ArchiveRecord, "kind" | "id" | "sources"> & { slug: string; sources?: ArchiveRecord["sources"] }): ArchiveRecord => ({ sources: ["nasa"], ...r, kind: "protocol", id: `vo_protocol:${r.slug}` });
const VO = "vo_framework:the-virtual-observatory";

export const protocols: ArchiveRecord[] = [
  fw({ slug: "the-virtual-observatory", name: "The Virtual Observatory", altNames: ["VO"], relatedKeys: ["data_archive:mast", "alert_system:voevent"], description: "The framework of standards, coordinated by the International Virtual Observatory Alliance, that lets the world's archives be searched and combined as if they were one — so an astronomer can query every telescope's data at once. TAP, Cone Search, VOEvent, and VOTable are among its standards.", sources: ["nasa"], highlights: ["The world's archives, searchable as one"] }),
  pr({ slug: "table-access-protocol", name: "Table Access Protocol", altNames: ["TAP"], relatedKeys: ["data_standard:votable", VO], description: "A Virtual Observatory protocol for running database queries against an archive's catalogues over the web, returning the results as VOTables — the standard way to ask an archive a precise question about its tables.", sources: ["nasa"] }),
  pr({ slug: "cone-search", name: "Cone Search", relatedKeys: [VO], description: "The simplest Virtual Observatory query — 'give me every object within this radius of this position' — a standard that any catalogue service can answer, used constantly to find what is known around a point on the sky.", sources: ["nasa"] }),
  pr({ slug: "simple-image-access", name: "Simple Image Access", altNames: ["SIA"], relatedKeys: [VO], description: "A Virtual Observatory protocol for finding and retrieving images of a region of sky from an archive, regardless of which telescope took them — the image counterpart of the cone search.", sources: ["nasa"] }),
  pr({ slug: "simple-spectral-access", name: "Simple Spectral Access", altNames: ["SSA"], relatedKeys: [VO, "astronomy_method:spectroscopy"], description: "A Virtual Observatory protocol for finding and retrieving spectra of a target from an archive, bringing the spectroscopy of many instruments into a single uniform search.", sources: ["nasa"] }),
];
