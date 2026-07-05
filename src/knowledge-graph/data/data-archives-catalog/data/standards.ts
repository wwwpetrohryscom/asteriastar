import type { ArchiveRecord } from "@/knowledge-graph/data/data-archives-catalog/types";

/** Data formats and standards. Each is associated_with the REUSED telescopes and VO standards
 *  that use it. */
const sd = (r: Omit<ArchiveRecord, "kind" | "id" | "sources"> & { slug: string; sources?: ArchiveRecord["sources"] }): ArchiveRecord => ({ sources: ["nasa"], ...r, kind: "standard", id: `data_standard:${r.slug}` });

export const standards: ArchiveRecord[] = [
  sd({ slug: "fits", name: "FITS", altNames: ["Flexible Image Transport System"], relatedKeys: ["space_telescope:hubble-space-telescope"], description: "The universal file format of astronomy — a self-describing container for images, tables, and spectra with a human-readable header of metadata. In use since the 1980s and still the standard way astronomical data is stored and shared.", sources: ["nasa"], highlights: ["The universal file format of astronomy since the 1980s"] }),
  sd({ slug: "votable", name: "VOTable", relatedKeys: ["alert_system:voevent", "vo_framework:the-virtual-observatory"], description: "The Virtual Observatory's XML standard for exchanging tabular data — catalogues and query results — between archives, tools, and services, so tables flow between systems without custom parsing.", sources: ["nasa"] }),
  sd({ slug: "asdf", name: "ASDF", altNames: ["Advanced Scientific Data Format"], relatedKeys: ["space_telescope:james-webb-space-telescope"], description: "A modern, human-readable data format developed by the astronomy community as a successor to FITS for complex data — used by the James Webb Space Telescope for its calibration and world-coordinate metadata and adopted as the primary data format of the Roman mission.", sources: ["nasa"] }),
];
