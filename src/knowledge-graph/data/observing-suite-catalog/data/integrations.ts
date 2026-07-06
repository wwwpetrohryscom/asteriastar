import type { ObservingRecord } from "@/knowledge-graph/data/observing-suite-catalog/types";

/** Data integrations — architecture-ready interfaces for the external conditions that observing
 *  depends on but the platform does not itself measure. Each is honestly labelled as awaiting a
 *  connected provider: no weather, seeing, transparency, cloud, or sky-brightness value is ever
 *  fabricated. Until a provider is connected, these read as unavailable — the same honesty envelope
 *  the live-sky providers already use. */
const integ = (r: Omit<ObservingRecord, "kind" | "id" | "sources" | "computeStatus"> & { slug: string; sources?: ObservingRecord["sources"] }): ObservingRecord => ({ sources: ["nasa"], ...r, kind: "integration", computeStatus: "architecture", id: `observing_integration:${r.slug}` });

export const integrations: ObservingRecord[] = [
  integ({ slug: "weather-integration", name: "Weather Integration", relatedKeys: ["observing_planner:session-planner", "observing_site:la-palma"], description: "An architecture-ready interface for local weather forecasts — the first thing that decides whether a session happens. The interface is defined and wired into the session planner, but no forecast is shown until a weather provider is connected; nothing is assumed.", highlights: ["Interface ready; awaits a connected provider"] }),
  integ({ slug: "seeing-integration", name: "Seeing Integration", relatedKeys: ["observing_planner:astrophotography-planner", "observing_site:atacama-desert"], description: "An architecture-ready interface for atmospheric seeing — the steadiness of the air that sets how fine a detail a night can show. Wired into the astrophotography planner; seeing values appear only from a connected forecast source, never invented.", highlights: ["Steadiness of the air — provider-fed only"] }),
  integ({ slug: "transparency-integration", name: "Transparency Integration", relatedKeys: ["observing_planner:deep-sky-planner", "observing_site:atacama-desert"], description: "An architecture-ready interface for sky transparency — how much haze and moisture dim faint objects. Wired into the deep-sky planner; transparency is reported only from a connected source.", highlights: ["Haze & moisture — provider-fed only"] }),
  integ({ slug: "cloud-cover-integration", name: "Cloud Cover Integration", relatedKeys: ["observing_planner:tonight-planner", "observing_site:la-palma"], description: "An architecture-ready interface for cloud-cover forecasts and satellite cloud maps. Wired into the tonight planner; cloud data is shown only when a provider is connected.", highlights: ["Cloud maps — provider-fed only"] }),
  integ({ slug: "bortle-integration", name: "Bortle Sky-Brightness Integration", relatedKeys: ["observing_planner:deep-sky-planner", "observing_site:south-pole"], description: "An architecture-ready interface for light-pollution and Bortle-class sky-brightness data by location — which sets how faint an object a site can reach. Wired into the deep-sky planner; a site's darkness is reported only from a connected light-pollution source.", highlights: ["Light pollution — provider-fed only"] }),
];
