import type { HelioRecord } from "@/knowledge-graph/data/heliophysics-catalog/types";

/** Space-weather forecasting services — created with the EXISTING organization type, matching the
 *  reused NOAA Space Weather Prediction Center (organization:swpc), which already exists in the
 *  graph and is not recreated; this adds ESA's service. Each links to its operating organisation
 *  and the phenomena and impacts it serves. */
const svc = (r: Omit<HelioRecord, "kind" | "id" | "sources"> & { slug: string; sources?: HelioRecord["sources"] }): HelioRecord => ({ sources: ["esa"], ...r, kind: "service", id: `organization:${r.slug}` });

export const services: HelioRecord[] = [
  svc({ slug: "esa-space-weather-service-network", name: "ESA Space Weather Service Network", altNames: ["ESA SSA Space Weather"], sectorLabel: "Forecasting", relatedKeys: ["organization:esa", "space_weather_phenomenon:coronal-mass-ejection", "space_weather_impact:satellites"], description: "The operational space-weather arm of the European Space Agency's Space Safety programme, delivering forecasts, warnings, and data products — on solar activity, the near-Earth environment, and the ionosphere — to European operators of satellites, power grids, aviation, and navigation. The European counterpart to NOAA's Space Weather Prediction Center.", sources: ["esa"], highlights: ["Europe's operational space-weather service"] }),
];
