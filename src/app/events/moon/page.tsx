import type { Metadata } from "next";
import { CalendarPage } from "@/components/events/CalendarPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { eventsPath } from "@/lib/routes";

const DESCRIPTION =
  "Lunar phases, perigee and apogee for the year ahead, computed and measured against NASA's published phase tables.";

export const metadata: Metadata = buildMetadata({
  title: "The Moon",
  description: DESCRIPTION,
  path: eventsPath("moon"),
  keywords: ["moon phases", "full moon dates", "new moon dates", "lunar perigee", "moon apogee"],
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
      slug="moon"
      title="The Moon"
      eyebrow="Computed · lunar series"
      lead="Every phase and every apsis for the year ahead, computed from the same lunar series behind the Moon pages. The phases are checked on every build against NASA's own published table; the apsides have no comparable published table to check against, and their cards say so."
      description={DESCRIPTION}
      windowKind="year"
      categories={["moon"]}
      emptyNote="No lunar events in this window, which cannot happen for a window of any length — if you are seeing this, something is wrong and worth reporting."
    />
  );
}
