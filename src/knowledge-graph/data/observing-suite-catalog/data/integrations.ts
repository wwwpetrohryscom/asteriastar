import type { ObservingRecord } from "@/knowledge-graph/data/observing-suite-catalog/types";

/** Data integrations — the external conditions that observing depends on but the platform does not
 *  itself measure.
 *
 *  ONE of them is now connected. Program CN wired total cloud cover to MET Norway, fetched from the
 *  reader's own browser so their coordinates reach the meteorological institute and nobody else. The
 *  other four are still interfaces with no provider behind them, and are labelled that way: no
 *  seeing, transparency or sky-brightness value is ever fabricated, and cloud cover is never allowed
 *  to stand in for any of them — they are different quantities from different models. */
// `computeStatus` defaults to "architecture" and is overridden per record, because one of these is
// now connected and four are not — a single default would make the file lie about whichever half it
// did not describe.
const integ = (r: Omit<ObservingRecord, "kind" | "id" | "sources"> & { slug: string; sources?: ObservingRecord["sources"] }): ObservingRecord => ({ sources: ["nasa"], computeStatus: "architecture", ...r, kind: "integration", id: `observing_integration:${r.slug}` });

export const integrations: ObservingRecord[] = [
  integ({ slug: "weather-integration", name: "Weather Integration", relatedKeys: ["observing_planner:session-planner", "observing_site:la-palma"], computeStatus: "connected", description: "Local weather — the first thing that decides whether a session happens. CONNECTED for total cloud cover only, from MET Norway, and fetched by the reader's own browser when they ask for it so their coordinates never reach this platform. Rain, wind and temperature come with the same forecast but are not what an observer is deciding on; nothing else about the weather is assumed.", sources: ["met-norway"], highlights: ["Cloud cover connected — fetched by your browser, never by us"] }),
  integ({ slug: "seeing-integration", name: "Seeing Integration", relatedKeys: ["observing_planner:astrophotography-planner", "observing_site:atacama-desert"], description: "An architecture-ready interface for atmospheric seeing — the steadiness of the air that sets how fine a detail a night can show. Wired into the astrophotography planner; seeing values appear only from a connected forecast source, never invented. NOT satisfied by the connected cloud-cover forecast: seeing is turbulence, forecast from entirely different model output, and a clear night with terrible seeing is an ordinary one.", highlights: ["Steadiness of the air — provider-fed only"] }),
  integ({ slug: "transparency-integration", name: "Transparency Integration", relatedKeys: ["observing_planner:deep-sky-planner", "observing_site:atacama-desert"], description: "An architecture-ready interface for sky transparency — how much haze and moisture dim faint objects. Wired into the deep-sky planner; transparency is reported only from a connected source.", highlights: ["Haze & moisture — provider-fed only"] }),
  integ({ slug: "cloud-cover-integration", name: "Cloud Cover Integration", relatedKeys: ["observing_planner:tonight-planner", "observing_site:la-palma"], computeStatus: "connected", description: "CONNECTED: total cloud cover from MET Norway, averaged across the night's dark window and reported alongside the observing plan rather than folded into it — a clear sky does not make a full Moon dark. Requested only when the reader presses the button, from their own browser, with the coordinates rounded to about a kilometre. Satellite cloud IMAGERY is a separate thing and is not connected.", sources: ["met-norway"], highlights: ["Cloud cover connected — never renamed as seeing"] }),
  integ({ slug: "bortle-integration", name: "Bortle Sky-Brightness Integration", relatedKeys: ["observing_planner:deep-sky-planner", "observing_site:south-pole"], description: "An architecture-ready interface for light-pollution and Bortle-class sky-brightness data by location — which sets how faint an object a site can reach. Wired into the deep-sky planner; a site's darkness is reported only from a connected light-pollution source.", highlights: ["Light pollution — provider-fed only"] }),
];
