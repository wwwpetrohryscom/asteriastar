import type { Metadata } from "next";
import { CalendarPage } from "@/components/events/CalendarPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { eventsPath } from "@/lib/routes";

const DESCRIPTION =
  "Upcoming orbital launches with the provider's own scheduling precision and last-confirmation time, shown as planned dates rather than fixed ones.";

export const metadata: Metadata = buildMetadata({
  title: "Launches",
  description: DESCRIPTION,
  path: eventsPath("launches"),
  keywords: ["next rocket launch", "launch schedule", "orbital launch calendar"],
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
      slug="launches"
      title="Launches"
      eyebrow="Planned · community aggregator"
      lead="Orbital launches somebody currently intends to fly. Every one carries how precisely the date is known and when it was last confirmed, because both change constantly."
      description={DESCRIPTION}
      windowKind="year"
      categories={["launch"]}
      emptyNote="No launches are listed. The provider is a community aggregator and an empty list almost always means it could not be reached — the provenance panel below says which."
    />
  );
}
