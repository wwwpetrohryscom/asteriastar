import type { Metadata } from "next";
import { CalendarPage } from "@/components/events/CalendarPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { eventsPath } from "@/lib/routes";

const DESCRIPTION =
  "Planetary oppositions for the year ahead, computed from geocentric ecliptic longitudes, with distance and approximate magnitude.";

export const metadata: Metadata = buildMetadata({
  title: "Oppositions",
  description: DESCRIPTION,
  path: eventsPath("oppositions"),
  keywords: ["planetary opposition", "mars opposition", "jupiter opposition", "saturn opposition"],
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
      slug="oppositions"
      title="Oppositions"
      eyebrow="Computed · planetary positions"
      lead="When each outer planet is opposite the Sun: closest, brightest, and above the horizon the whole night. The one date per apparition worth planning around."
      description={DESCRIPTION}
      windowKind="year"
      categories={["opposition"]}
      emptyNote="No planet reaches opposition in this window. With five outer planets that is unusual over a year."
    />
  );
}
