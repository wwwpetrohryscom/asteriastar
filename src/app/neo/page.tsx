import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, neoPath } from "@/lib/routes";
import { NeoNav, NEO_PAGES, NeoHonestyNote, NeoPanel, ApproachTable, PalermoNote } from "@/components/neo/NeoUI";
import { EnvelopeDetails } from "@/components/space-weather/LiveStatus";
import { neoSnapshot, neoTotals, resolveApproaches, reage } from "@/platform/neo/service";
import { LIVE_PROVIDERS } from "@/platform/live-providers/registry";

/**
 * The near-Earth object hub.
 *
 * The headline numbers are counts of what the providers actually returned, and the most useful
 * thing the page says is the least dramatic: how many objects come within one lunar distance
 * (usually none), and how many sit above the Palermo scale's own "no cause for public concern"
 * threshold (usually one or two, and always below zero).
 */

const DESCRIPTION =
  "Live near-Earth object intelligence from NASA/JPL's Center for Near-Earth Object Studies and the IAU Minor Planet Center: close approaches over the next 60 days with their 3-sigma uncertainty, the Sentry impact-risk table with JPL's own caveats, newly catalogued objects, and unconfirmed candidates awaiting confirmation. No impact probability is computed here — every number is the issuing agency's.";

export const metadata: Metadata = buildMetadata({
  title: "Near-Earth Objects",
  description: DESCRIPTION,
  path: ROUTES.neo,
  keywords: ["near-Earth objects", "close approach", "asteroid tracking", "Sentry impact risk", "potentially hazardous asteroid", "CNEOS", "Minor Planet Center", "planetary defence"],
});

/** An hour: close-approach solutions change when an orbit is refitted, which takes days. */
export const revalidate = 3600;

export default async function NeoHubPage() {
  const nowIso = new Date().toISOString();
  const s = reage(await neoSnapshot(), nowIso);
  const totals = neoTotals(s);
  const approaches = resolveApproaches(s.closeApproaches, s.sentry);
  const nextWeek = approaches.slice(0, 8);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Near-Earth Objects", url: ROUTES.neo },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Near-Earth Objects", description: DESCRIPTION, url: ROUTES.neo })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="ember"
        eyebrow={<span>Live · NASA/JPL CNEOS &amp; IAU Minor Planet Center</span>}
        title="Near-Earth objects"
        lead="Tens of thousands of rocks share the inner Solar System with us, and a few thousand of them are tracked closely enough to say where they will be. This is what the agencies that track them are reporting right now."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <NeoNav />

        <section aria-labelledby="now-heading" className="space-y-4">
          <h2 id="now-heading" className="font-display text-2xl font-bold">The state of the sky</h2>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              [totals.approaches, "close approaches", "within 0.05 au over 60 days"],
              [totals.withinOneLunarDistance, "closer than the Moon", "in that same window"],
              [totals.sentryObjects.toLocaleString("en-GB"), "objects on Sentry", "monitored for any possible impact"],
              [totals.torinoAboveZero, "above Torino 0", "on the scale's own definition"],
            ].map(([value, label, sub]) => (
              <li key={String(label)} className="scientific-card p-5">
                <p className="font-display text-3xl font-bold text-fg">{value}</p>
                <p className="mt-1 text-sm font-medium text-muted">{label}</p>
                <p className="mt-1 text-xs text-faint">{sub}</p>
              </li>
            ))}
          </ul>
          <p className="text-sm leading-relaxed text-muted">
            Those last two numbers are the ones worth dwelling on. Sentry monitors every object whose orbit leaves any possibility
            of an impact open, however remote — {totals.sentryObjects.toLocaleString("en-GB")} of them — and{" "}
            {totals.torinoAboveZero === 0
              ? "not one currently rates above zero on the Torino scale, which is the ordinary state of affairs."
              : `${totals.torinoAboveZero} currently rate above zero on the Torino scale.`}{" "}
            {totals.aboveBackgroundConcern === 0
              ? "None sits above the Palermo scale's own threshold for public concern."
              : `${totals.aboveBackgroundConcern} sit above the Palermo scale's −2 threshold, and all of them remain below zero — that is, below the background risk from all objects of comparable size.`}
          </p>
        </section>

        <NeoPanel envelope={s.closeApproaches} title="Approaching next" what="The CNEOS close-approach table" id="approaches-heading">
          <ApproachTable approaches={nextWeek} caption="The next eight close approaches within 0.05 au. Distances are given in lunar distances (LD); one LD is 384,400 km." />
          <p className="text-sm text-muted">
            <Link href={neoPath("close-approaches")} className="text-nasa underline-offset-4 hover:underline">All {totals.approaches} approaches, with filters →</Link>
          </p>
        </NeoPanel>

        <section aria-labelledby="sections-heading">
          <h2 id="sections-heading" className="font-display text-2xl font-bold">The section</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NEO_PAGES.map((p) => (
              <li key={p.slug} className="scientific-card flex flex-col p-5">
                <Link href={neoPath(p.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{p.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{p.blurb}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="catalogue-heading" className="space-y-3">
          <h2 id="catalogue-heading" className="font-display text-2xl font-bold">Live records and catalogued objects</h2>
          <div className="max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              Of the {totals.catalogued.total} objects approaching in this window, {totals.catalogued.matched} match something
              AsteriaStar has catalogued. That ratio is normal and it is not a gap to be closed: CNEOS tracks every object whose
              orbit is known well enough to project, and most of them are metres-wide rocks with provisional designations that will
              never warrant an encyclopedia entry.
            </p>
            <p>
              A live record that matches a catalogued object is linked to it. One that does not is shown as what it is — a provider
              record — and labelled <em>not yet catalogued in AsteriaStar</em>. It is never quietly turned into a permanent entity:
              minting encyclopedia entries from a feed is how an encyclopedia fills with things nobody wrote.
            </p>
          </div>
        </section>

        <PalermoNote topRating={s.sentry.data?.[0]?.palermoCumulative} />

        <section aria-labelledby="providers-heading" className="space-y-4">
          <h2 id="providers-heading" className="font-display text-2xl font-bold">Where the data comes from</h2>
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {LIVE_PROVIDERS.filter((p) => p.category === "near-earth-object").map((p) => (
              <li key={p.providerKey} className="scientific-card p-5">
                <h3 className="font-display text-base font-semibold text-fg">{p.name}</h3>
                <p className="mt-1 text-xs text-faint">{p.organization}</p>
                <p className="mt-2 text-xs leading-relaxed text-faint">{p.rateLimits}</p>
                {p.providerCaveat && <p className="mt-2 text-xs leading-relaxed text-faint">{p.providerCaveat}</p>}
                <p className="mt-3 text-xs">
                  <a href={p.documentation} target="_blank" rel="noreferrer nofollow" className="text-nasa underline-offset-4 hover:underline">Provider documentation →</a>
                </p>
              </li>
            ))}
          </ul>
          <NeoHonestyNote />
        </section>

        <section aria-labelledby="prov-heading" className="space-y-4">
          <h2 id="prov-heading" className="font-display text-2xl font-bold">Provenance</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EnvelopeDetails envelope={s.closeApproaches} title="Close approaches" />
            <EnvelopeDetails envelope={s.sentry} title="Sentry risk table" />
            <EnvelopeDetails envelope={s.recent} title="Recent database entries" />
            <EnvelopeDetails envelope={s.candidates} title="Unconfirmed candidates" />
          </div>
        </section>

        <SourceList keys={["jpl", "nasa", "mpc"]} title="Sources & references" />
      </Container>
    </>
  );
}
