import type { Metadata } from "next";
import { CalendarPage } from "@/components/events/CalendarPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { eventsPath } from "@/lib/routes";

const DESCRIPTION =
  "A month of astronomical events: lunar phases, oppositions, conjunctions, eclipses, meteor showers and planned launches.";

export const metadata: Metadata = buildMetadata({
  title: "This month",
  description: DESCRIPTION,
  path: eventsPath("this-month"),
  keywords: ["astronomical events this month", "astronomy calendar", "sky events this month"],
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
      slug="this-month"
      title="This month"
      eyebrow="Events · calendar month"
      lead="The whole calendar month. Four lunar phases, whatever the planets are doing, and any eclipse or shower that falls inside it."
      description={DESCRIPTION}
      windowKind="month"
      emptyNote="Nothing dated falls in this month, which for a full month would be unusual — if the provenance panels below report a provider failure, that is why."
    />
  );
}
