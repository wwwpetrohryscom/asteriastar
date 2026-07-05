import type { MmRecord } from "@/knowledge-graph/data/multi-messenger-catalog/types";

/** Compact-binary-merger source classes — created with the EXISTING transient-class type (which
 *  already holds kilonovae, gamma-ray bursts, and the rest). Each links to the reused
 *  gravitational-wave-detection method, the band, and the electromagnetic counterparts it produces. */
const src = (r: Omit<MmRecord, "kind" | "id" | "sources"> & { slug: string; sources?: MmRecord["sources"] }): MmRecord => ({ sources: ["ligo"], ...r, kind: "source", id: `transient_class:${r.slug}` });

export const sources: MmRecord[] = [
  src({ slug: "binary-black-hole-merger", name: "Binary Black Hole Merger", altNames: ["BBH"], relatedKeys: ["astronomy_method:gravitational-wave-detection", "wavelength_band:gravitational-waves"], description: "The merger of two black holes spiralling together — the most common gravitational-wave source detected, and usually a purely gravitational event with no light. The first ever direct detection, in 2015, was of such a merger over a billion light-years away.", sources: ["ligo"], highlights: ["The first gravitational-wave source ever detected"] }),
  src({ slug: "binary-neutron-star-merger", name: "Binary Neutron Star Merger", altNames: ["BNS"], relatedKeys: ["astronomy_method:gravitational-wave-detection", "transient_class:kilonova", "transient_class:gamma-ray-burst"], description: "The merger of two neutron stars — a gravitational-wave source that also lights up across the electromagnetic spectrum, producing a short gamma-ray burst and a kilonova. The 2017 event GW170817 was seen in both gravitational waves and light, founding multi-messenger astronomy with gravitational waves.", sources: ["ligo"], highlights: ["Seen in both gravitational waves and light — GW170817"] }),
  src({ slug: "black-hole-neutron-star-merger", name: "Black Hole–Neutron Star Merger", altNames: ["NSBH"], relatedKeys: ["astronomy_method:gravitational-wave-detection", "wavelength_band:gravitational-waves"], description: "The merger of a black hole with a neutron star — the third class of compact-binary merger, first confidently detected in gravitational waves in early 2020. Whether it produces light depends on whether the black hole tears the neutron star apart before swallowing it.", sources: ["ligo"] }),
];
