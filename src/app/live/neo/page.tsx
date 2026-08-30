import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, liveDashboardPath } from "@/lib/routes";
import { DashboardProvenance, DashboardStat, DashboardTile, LiveDashboardNav, LocationNote } from "@/components/live/dashboard/DashboardUI";
import { neoSnapshot, neoTotals, reage } from "@/platform/neo/service";

/**
 * Near-Earth objects, right now.
 *
 * The honest headline of this page is that none of it is an observing matter, and it says so first.
 * An asteroid passing inside the Moon's orbit is a genuinely interesting fact and is invisible to
 * anyone without a telescope, a finder chart and an ephemeris — so this page reports the counts, and
 * refuses to imply that a reader should go outside and look for one.
 */

const DESCRIPTION =
  "How many near-Earth objects are passing close in the next sixty days, how many are on JPL's impact-risk table, and how many the Minor Planet Center is still confirming — with the honest note that none of them is a naked-eye object.";

export const metadata: Metadata = buildMetadata({
  title: "Near-Earth Objects Now",
  description: DESCRIPTION,
  path: liveDashboardPath("neo"),
  keywords: ["asteroid passing earth today", "near earth objects now", "close approach today"],
});

export const revalidate = 900;

export default async function LiveNeoPage() {
  const now = new Date();
  const snapshot = reage(await neoSnapshot(), now.toISOString());
  const totals = neoTotals(snapshot);
  const approaches = snapshot.closeApproaches.data ?? [];
  const soonest = approaches
    .filter((a) => Date.parse(a.approachTdb) >= now.getTime())
    .sort((a, b) => Date.parse(a.approachTdb) - Date.parse(b.approachTdb))[0];

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Live", url: ROUTES.live },
    { name: "Near-Earth objects now", url: liveDashboardPath("neo") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Near-Earth Objects Now", description: DESCRIPTION, url: liveDashboardPath("neo") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Live · NASA/JPL CNEOS · IAU MPC</span>} title="Near-Earth objects now"
        lead="What is passing, what is being watched, and what is still being confirmed — from the two organisations that actually do it." />
      <Container className="mt-8 mb-14 space-y-8">
        <LiveDashboardNav current="neo" />
        <LocationNote />

        <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm leading-relaxed text-muted">
          <strong className="text-fg">None of this is something to go outside and look at.</strong> A
          close approach is a fact about an orbit, not an event in the sky: even an object passing
          inside the Moon&apos;s distance is far too faint for the naked eye and moves too fast to find
          without a telescope, a finder chart and an ephemeris computed for your location. This page
          reports what the agencies report. It is not an observing recommendation.
        </p>

        <DashboardTile title="The counts" envelope={snapshot.closeApproaches} href={ROUTES.neo} hrefLabel="The full near-Earth-object section">
          <DashboardStat
            label="Approaches within 0.05 au" value={totals.approaches}
            detail="Over the next sixty days, as JPL/CNEOS computes them."
            unavailable={snapshot.closeApproaches.error ?? "JPL could not be reached."}
          />
          <DashboardStat
            label="Inside one lunar distance" value={totals.withinOneLunarDistance}
            detail="A real threshold, and not a danger threshold — objects pass inside it routinely."
            unavailable={snapshot.closeApproaches.error ?? "JPL could not be reached."}
          />
          <DashboardStat
            label="On the Sentry risk table" value={totals.sentryObjects}
            detail="Objects with any non-zero computed impact probability at all, most of them vanishingly small."
            unavailable={snapshot.sentry.error ?? "JPL could not be reached."}
          />
          <DashboardStat
            label="Above Palermo 0" value={totals.atOrAbovePalermoZero}
            detail="At or beyond the background risk of a random object of the same size. Zero is the usual answer."
            unavailable={snapshot.sentry.error ?? "JPL could not be reached."}
          />
          <DashboardStat
            label="Above Torino 0" value={totals.torinoAboveZero}
            detail="Torino 0 means no consequence. Anything above it would be news everywhere, not only here."
            unavailable={snapshot.sentry.error ?? "JPL could not be reached."}
          />
          <DashboardStat
            label="Awaiting confirmation" value={totals.candidates}
            detail="Candidates on the Minor Planet Center's confirmation page — most leave it within days."
            unavailable={snapshot.candidates.error ?? "The Minor Planet Center could not be reached."}
          />
        </DashboardTile>

        {soonest && (
          <section aria-labelledby="next-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h2 id="next-heading" className="font-display text-lg font-bold text-fg">The next close approach</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              <strong className="text-fg">{soonest.designation}</strong> passes{" "}
              {soonest.distance.lunarDistances.toFixed(1)} lunar distances from Earth on{" "}
              {soonest.approachTdb.slice(0, 16).replace("T", " ")} TDB — barycentric dynamical
              time, which is what JPL publishes and is not UTC. The distance is a prediction from a
              fitted orbit and travels with JPL&apos;s own three-sigma bounds on the full section.
            </p>
          </section>
        )}

        <DashboardProvenance envelopes={[snapshot.closeApproaches, snapshot.sentry, snapshot.candidates]} />
      </Container>
    </>
  );
}
