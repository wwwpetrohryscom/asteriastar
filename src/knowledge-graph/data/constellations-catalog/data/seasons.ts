import type { SeasonRecord } from "@/knowledge-graph/data/constellations-catalog/types";

/**
 * The four seasonal skies, defined by the constellations best placed for evening
 * observing from the NORTHERN mid-latitudes (the convention used throughout the
 * encyclopedia). From the southern hemisphere the seasons are reversed; that
 * honest caveat is stated on the pages. Membership is derived from each
 * constellation's `season` field in the index.
 */
export const seasons: SeasonRecord[] = [
  { slug: "winter", name: "Winter Sky", sources: ["britannica"], months: "December–February", description: "The brilliant northern winter evening sky, dominated by Orion and the bright stars of the Winter Hexagon — Sirius, Rigel, Aldebaran, Capella, Pollux, and Procyon." },
  { slug: "spring", name: "Spring Sky", sources: ["britannica"], months: "March–May", description: "The northern spring evening sky, when Leo, Virgo, and Boötes ride high and the great galaxy fields of the Virgo and Coma clusters are best placed." },
  { slug: "summer", name: "Summer Sky", sources: ["britannica"], months: "June–August", description: "The northern summer evening sky, when the Milky Way arches overhead through the Summer Triangle (Vega, Deneb, Altair) toward the rich star clouds of Sagittarius and the Galactic Center." },
  { slug: "autumn", name: "Autumn Sky", sources: ["britannica"], months: "September–November", description: "The northern autumn evening sky of the Perseus–Andromeda legend — the Great Square of Pegasus, Andromeda and its galaxy, Cassiopeia, Cepheus, and Perseus." },
];
