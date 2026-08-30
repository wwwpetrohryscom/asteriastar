import type { Metadata } from "next";
import { CalendarPage } from "@/components/events/CalendarPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { eventsPath } from "@/lib/routes";

const DESCRIPTION =
  "Meteor shower peak nights for the year ahead, with the Moon's illumination on each peak night computed, and honest rates.";

export const metadata: Metadata = buildMetadata({
  title: "Meteor showers",
  description: DESCRIPTION,
  path: eventsPath("meteor-showers"),
  keywords: ["meteor shower dates", "meteor shower peak", "meteor shower calendar"],
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
      slug="meteor-showers"
      title="Meteor showers"
      eyebrow="Annual forecast · IMO working list"
      lead="The peak nights of the year's showers, with the Moon's interference worked out for each one — which is usually the thing that decides whether it is worth setting an alarm."
      description={DESCRIPTION}
      windowKind="year"
      categories={["meteor-shower"]}
      emptyNote="No shower peak falls in this window."
    />
  );
}
