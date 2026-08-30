import type { Metadata } from "next";
import { CalendarPage } from "@/components/events/CalendarPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { eventsPath } from "@/lib/routes";

const DESCRIPTION =
  "Astronomical events over the next seven days, with each date labelled as computed, published, forecast or planned.";

export const metadata: Metadata = buildMetadata({
  title: "This week",
  description: DESCRIPTION,
  path: eventsPath("this-week"),
  keywords: ["astronomical events this week", "sky events this week", "astronomy calendar week"],
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
      slug="this-week"
      title="This week"
      eyebrow="Events · next 7 days"
      lead="The next seven days, in one list: computed instants, NASA's eclipse predictions, meteor shower peaks and the launches somebody currently intends to fly."
      description={DESCRIPTION}
      windowKind="week"
      emptyNote="Nothing in the next seven days. Quiet weeks are common; the planets and the Moon are still up there."
    />
  );
}
