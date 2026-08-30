import type { Metadata } from "next";
import { CalendarPage } from "@/components/events/CalendarPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { eventsPath } from "@/lib/routes";

const DESCRIPTION =
  "Upcoming solar and lunar eclipses from NASA's Five Millennium Catalog of Eclipses, with instants converted from Terrestrial Dynamical Time to UTC.";

export const metadata: Metadata = buildMetadata({
  title: "Eclipses",
  description: DESCRIPTION,
  path: eventsPath("eclipses"),
  keywords: ["upcoming eclipses", "solar eclipse dates", "lunar eclipse dates", "eclipse calendar"],
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
      slug="eclipses"
      title="Eclipses"
      eyebrow="Published prediction · NASA/GSFC"
      lead="Solar and lunar eclipses for the year ahead, taken from NASA's Five Millennium Catalog exactly as published — including the delta-T that turns its dynamical time into the clock on your wall."
      description={DESCRIPTION}
      windowKind="year"
      categories={["eclipse"]}
      emptyNote="No eclipse falls in the next year. That is possible but rare — there are usually four to seven a year — so check the provenance panels below before believing it."
    />
  );
}
