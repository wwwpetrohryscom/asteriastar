import type { MedRecord } from "@/knowledge-graph/data/space-medicine-catalog/types";

/** NEW physiological effects of spaceflight — only those NOT already in the graph. The graph
 *  already models bone-density-loss, muscle-atrophy, fluid-shift (with vision changes), and
 *  space-radiation as `space_medicine_topic` entities; those are REUSED and enriched in
 *  index.ts, never duplicated. Each new effect is member_of_group its discipline and
 *  associated_with the stations/radiation environments where it is studied. */
const ef = (cat: MedRecord["category"], topicSlug: string) => (r: Omit<MedRecord, "kind" | "id" | "category" | "topicSlug"> & { slug: string }): MedRecord => ({ ...r, kind: "effect", id: `physiological_effect:${r.slug}`, category: cat, topicSlug });
const med = (cat: MedRecord["category"]) => ef(cat, "space-medicine");
const psy = ef("behavioral", "space-psychology-and-human-factors");
const ISS = "satellite:international-space-station";

export const effects: MedRecord[] = [
  med("cardiovascular")({ slug: "cardiovascular-deconditioning", name: "Cardiovascular Deconditioning", description: "The heart and blood vessels adapt to weightlessness, and the heart can weaken without the constant work of pumping against gravity. Crews often experience orthostatic intolerance — dizziness on standing — when they return to gravity.", relatedKeys: [ISS], sources: ["nasa"] }),
  med("neurovestibular")({ slug: "space-adaptation-syndrome", name: "Space Adaptation Syndrome", altNames: ["Space motion sickness"], description: "In the first days of flight, the conflict between the eyes and the balance organs of the inner ear causes disorientation and nausea as the brain adapts to weightlessness; a mirror-image readaptation occurs on return to gravity.", sources: ["nasa"] }),
  med("immune")({ slug: "immune-dysregulation", name: "Immune Dysregulation", description: "Spaceflight alters the immune system — some functions are dampened while latent viruses can reactivate — a concern for crew health on long missions far from medical care.", relatedKeys: [ISS], sources: ["nasa"] }),
  psy({ slug: "circadian-disruption", name: "Circadian Rhythm Disruption", description: "On the ISS the crew sees sixteen sunrises a day, and mission schedules can shift sleep times; the resulting disruption of the body clock degrades sleep, alertness, and performance.", relatedKeys: [ISS], sources: ["nasa"] }),
  psy({ slug: "psychological-stress", name: "Isolation & Psychological Stress", altNames: ["Behavioral health risk"], description: "Long missions in a confined habitat, far from family and unable to leave, place real psychological demands on crews — from mood and interpersonal tension to the cognitive effects of monotony — that grow with distance and duration.", sources: ["nasa"], highlights: ["Grows with mission distance and duration"] }),
];
