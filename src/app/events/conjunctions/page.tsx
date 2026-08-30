import type { Metadata } from "next";
import { CalendarPage } from "@/components/events/CalendarPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { eventsPath } from "@/lib/routes";

const DESCRIPTION =
  "Planetary conjunctions and solar conjunctions for the year ahead, computed from geocentric positions with the closest apparent separation given.";

export const metadata: Metadata = buildMetadata({
  title: "Conjunctions",
  description: DESCRIPTION,
  path: eventsPath("conjunctions"),
  keywords: ["planetary conjunction", "planet conjunction dates", "conjunction calendar"],
});

/*
 * Revalidated every fifteen minutes. The computed half of this page would be identical for a year,
 * but the launch schedule and the "now" that defines the window are not, and a page frozen at build
 * time would tell a reader in March what was happening the day the site was deployed.
 */
export const revalidate = 900;

export default function Page() {
  return (
    <CalendarPage
      slug="conjunctions"
      title="Conjunctions"
      eyebrow="Computed · planetary positions"
      lead="Planets passing close together on the sky, and the dates each one disappears into the Sun's glare and comes back out the other side."
      description={DESCRIPTION}
      windowKind="year"
      categories={["conjunction"]}
      emptyNote="No conjunction closer than five degrees falls in this window."
    />
  );
}
