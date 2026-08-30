import type { Metadata } from "next";
import { CalendarPage } from "@/components/events/CalendarPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { eventsPath } from "@/lib/routes";

const DESCRIPTION =
  "Astronomical events happening today: Moon phases, planetary events, meteor shower peaks, eclipses and planned launches, each labelled with where its date comes from.";

export const metadata: Metadata = buildMetadata({
  title: "Today",
  description: DESCRIPTION,
  path: eventsPath("today"),
  keywords: ["astronomical events today", "what is in the sky tonight", "sky events today"],
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
      slug="today"
      title="Today"
      eyebrow="Events · next 24 hours"
      lead="What the sky is doing in the next twenty-four hours: the Moon's phase if it turns tonight, any planet reaching opposition, a shower at its peak, an eclipse, a launch."
      description={DESCRIPTION}
      windowKind="day"
      emptyNote="Nothing falls inside today. That is ordinary — most days have no dated event at all, and the sky is worth going outside for anyway."
    />
  );
}
