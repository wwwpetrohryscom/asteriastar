import type { TimeDomainRecord } from "@/knowledge-graph/data/time-domain-catalog/types";

/** The stages of the transient observation workflow, chained followed_by from discovery to
 *  publication, each associated_with the REUSED surveys, facilities, and alert systems it uses. */
const st = (order: number, nextStageSlug?: string) => (r: Omit<TimeDomainRecord, "kind" | "id" | "category" | "order" | "nextStageSlug" | "sources"> & { slug: string; sources?: TimeDomainRecord["sources"] }): TimeDomainRecord => ({ sources: ["nasa"], ...r, kind: "stage", id: `observation_stage:${r.slug}`, category: "workflow", order, nextStageSlug });

export const stages: TimeDomainRecord[] = [
  st(1, "follow-up")({ slug: "discovery", name: "Discovery", relatedKeys: ["sky_survey:lsst", "sky_survey:atlas", "alert_system:rubin-alert-stream"], description: "A wide-field survey images the sky repeatedly and flags anything that has changed — a new point of light, or one that has brightened or moved. The candidate is issued as an alert within seconds.", sources: ["nasa"], highlights: ["Surveys flag what has changed in the sky"] }),
  st(2, "confirmation")({ slug: "follow-up", name: "Follow-Up", relatedKeys: ["sky_survey:pan-starrs", "alert_system:astronomers-telegram"], description: "Other telescopes turn to the candidate to gather more data — deeper images, colours, and the first spectra — often within minutes to hours, before a fast-fading event disappears.", sources: ["nasa"] }),
  st(3, "classification")({ slug: "confirmation", name: "Confirmation", relatedKeys: ["alert_system:transient-name-server"], description: "The candidate is verified as a real astrophysical transient — not an instrument artefact, asteroid, or known variable — and registered with an official discovery name.", sources: ["nasa"] }),
  st(4, "publication")({ slug: "classification", name: "Classification", relatedKeys: ["astronomy_method:spectral-classification", "astronomy_method:spectroscopy"], description: "A spectrum reveals what the transient is — the type of supernova, the redshift of a burst, the nature of the source — placing it in its class and distance.", sources: ["nasa"] }),
  st(5)({ slug: "publication", name: "Publication", relatedKeys: ["alert_system:astronomers-telegram"], description: "The result is shared with the community and the scientific record — as a rapid telegram, a circular, and ultimately a peer-reviewed paper — so that the event contributes to the wider science.", sources: ["nasa"] }),
];
