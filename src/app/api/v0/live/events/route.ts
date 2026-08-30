import { apiResponse } from "@/platform/open-data";
import { liveCacheControl, serialiseEnvelope } from "@/platform/space-weather/api";
import { buildCalendar, rollingYear } from "@/platform/events/service";

/**
 * GET /api/v0/live/events — the observing calendar for the year ahead.
 *
 * The response carries the same four-way distinction the pages do, on every entry: `basis` says
 * whether a date was computed here, published by an authority, forecast from an annual recurrence,
 * or merely planned; `method` names the algorithm and version behind a computed instant; `source`
 * names the authority and, for a planned date, when it was last confirmed; `precision` says how much
 * of the timestamp means anything, and `confirmed` is false for everything that can still move.
 *
 * There are no query parameters. The window is fixed and the whole year is returned, so there is no
 * combination of parameters to crawl and nothing for a caller to construct.
 */
export const dynamic = "force-dynamic";

const PRODUCTS = ["gsfc:solar-eclipses", "gsfc:lunar-eclipses", "ll2:upcoming-launches"];

export async function GET(): Promise<Response> {
  const now = new Date();
  const window = rollingYear(now.getTime());
  const calendar = await buildCalendar(window.fromMs, window.toMs, { now });

  return apiResponse(
    {
      window: { from: new Date(window.fromMs).toISOString(), to: new Date(window.toMs).toISOString(), timeBasis: "UTC" },
      events: calendar.events,
      // A category whose provider failed is reported, not silently absent. A consumer that sees no
      // eclipses can tell whether there are none or whether NASA did not answer.
      gaps: calendar.gaps,
      providers: {
        solarEclipses: serialiseEnvelope(calendar.solar),
        lunarEclipses: serialiseEnvelope(calendar.lunar),
        launches: serialiseEnvelope(calendar.launches),
      },
    },
    {
      provenance:
        "Every entry states its own basis. Computed instants are derived from the platform's position series. Every build checks the lunar phases against NASA's published tables, the equinoxes, solstices and Earth's apsides against the US Naval Observatory's, and the planetary positions the remaining events are derived from against JPL Horizons; those measured errors are the uncertainties quoted on the events concerned. The Moon's perigee and apogee are the one family with no external table to check against, and their `uncertainty` says so. Eclipses are reproduced from NASA/GSFC's Five Millennium Catalog with the catalogue's own delta-T applied to convert Terrestrial Dynamical Time to UTC. Meteor shower peaks are annual forecasts from the IMO working list and are approximate to about a day. Launches are planned dates from a community-maintained aggregator, not an agency schedule, and each carries the time it was last confirmed.",
      license:
        "AsteriaStar computed values: free to use with attribution. Eclipse predictions: public domain (US Government work), by Fred Espenak and Jean Meeus, NASA/GSFC. Launch data: Launch Library 2 by The Space Devs. Meteor shower parameters: IMO working list, cited as reference.",
      source: "AsteriaStar events engine, NASA/GSFC Eclipse Web Site, International Meteor Organization, Launch Library 2",
      generatedAt: now.toISOString(),
      count: calendar.events.length,
      stale: [calendar.solar, calendar.lunar, calendar.launches].some((e) => e.stale),
      cacheControl: liveCacheControl(PRODUCTS, calendar.gaps.length > 0),
    },
  );
}
