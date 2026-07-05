import type { AstrobiologyRecord } from "@/knowledge-graph/data/astrobiology-catalog/types";

/** Planetary-protection measures. Each is member_of_group the planetary-protection discipline
 *  and associated_with the REUSED worlds and missions it concerns. */
const pp = (r: Omit<AstrobiologyRecord, "kind" | "id" | "topicSlug" | "sources"> & { slug: string; sources?: AstrobiologyRecord["sources"] }): AstrobiologyRecord => ({ sources: ["nasa"], ...r, kind: "protection", id: `planetary_protection:${r.slug}`, topicSlug: "planetary-protection" });

export const protection: AstrobiologyRecord[] = [
  pp({ slug: "forward-contamination", name: "Forward Contamination", relatedKeys: ["planet:mars", "moon:europa"], description: "The risk of carrying Earth microbes to another world on a spacecraft, which could harm any native biosphere or, worse, be mistaken for alien life. Missions to Mars and the ocean worlds are cleaned and sterilised to strict standards to prevent it.", sources: ["nasa"], highlights: ["Keeping Earth life from contaminating other worlds"] }),
  pp({ slug: "backward-contamination", name: "Backward Contamination", relatedKeys: ["space_mission:mars-2020"], description: "The risk of bringing potentially hazardous material back to Earth in a returned sample. Sample-return missions are designed to contain their cargo as strictly as the most dangerous pathogens, so nothing escapes before it is shown to be safe.", sources: ["nasa"], highlights: ["Protecting Earth from anything a sample might carry"] }),
  pp({ slug: "sample-handling", name: "Sample Handling & Curation", relatedKeys: ["space_mission:mars-2020"], description: "The careful containment, quarantine, and curation of returned samples in specialised facilities — keeping them pristine for science while keeping Earth safe, and preserving them for study by instruments not yet invented.", sources: ["nasa"] }),
];
