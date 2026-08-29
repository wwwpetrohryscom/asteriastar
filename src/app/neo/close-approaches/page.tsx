import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, datasetSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, neoPath } from "@/lib/routes";
import { NeoNav, NeoHonestyNote, NeoPanel } from "@/components/neo/NeoUI";
import { ApproachFilters } from "@/components/neo/ApproachFilters";
import { EnvelopeDetails } from "@/components/space-weather/LiveStatus";
import { closeApproachSnapshot, resolveApproaches, reage } from "@/platform/neo/service";

const DESCRIPTION =
  "Every near-Earth object passing within 0.05 astronomical units of Earth over the next 60 days, as computed by NASA/JPL's Center for Near-Earth Object Studies — with each approach's nominal distance, its 3-sigma minimum and maximum, its relative velocity, and the uncertainty in its timing. Distances in lunar distances, kilometres and astronomical units.";

export const metadata: Metadata = buildMetadata({
  title: "Near-Earth Object Close Approaches",
  description: DESCRIPTION,
  path: neoPath("close-approaches"),
  keywords: ["close approach", "asteroid close approach", "lunar distance", "CNEOS close approach data", "near-Earth object pass"],
});

export const revalidate = 3600;

export default async function CloseApproachesPage() {
  const nowIso = new Date().toISOString();
  const s = reage(await closeApproachSnapshot(), nowIso);
  const approaches = resolveApproaches(s.closeApproaches, s.sentry);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Near-Earth Objects", url: ROUTES.neo },
    { name: "Close approaches", url: neoPath("close-approaches") },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          webPageSchema({ name: "Near-Earth Object Close Approaches", description: DESCRIPTION, url: neoPath("close-approaches") }),
          datasetSchema({
            name: "Near-Earth object close-approach data (NASA/JPL CNEOS)",
            description: "Computed close approaches of near-Earth objects to Earth, with nominal and 3-sigma approach distances, relative velocity and approach-time uncertainty.",
            url: neoPath("close-approaches"),
            creatorName: "NASA Jet Propulsion Laboratory, Center for Near-Earth Object Studies",
            creatorUrl: "https://cneos.jpl.nasa.gov/",
            license: "https://www.usa.gov/government-works",
            variables: ["close-approach distance", "relative velocity", "absolute magnitude", "estimated diameter"],
            coverageFrom: "2026-08-29",
            /*
             * AsteriaStar's own endpoint, not JPL's. A bare `cad.api` URL returns CNEOS's DEFAULT
             * window, which is a different dataset from the 60-day / 0.05 au one described above —
             * so a machine following the distribution would get data that does not match the
             * declared variables or coverage. It would also advertise the very host this
             * integration is careful never to point a client at, per NASA's CORS policy.
             */
            distributionUrl: "https://asteriastar.com/api/v0/live/neo/close-approaches",
          }),
        ]}
      />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="ember"
        eyebrow={<span>Live · NASA/JPL CNEOS</span>}
        title="Close approaches"
        lead="Objects pass close to Earth constantly. What matters is how close, how well the orbit is known, and how big the thing actually is — so all three are here, with the uncertainty JPL publishes alongside them."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <NeoNav current="close-approaches" />

        <NeoPanel envelope={s.closeApproaches} title="The next 60 days" what="The CNEOS close-approach table" id="approaches-heading">
          {/*
            NeoPanel has already handled the case where the feed could not be READ. Reaching here
            with an empty list means the opposite: JPL answered, and nothing comes that close in the
            window. Rendering the red "current data unavailable" panel for that would report a real
            answer as a failure — the inverse of the mistake this platform is built against.
          */}
          {approaches.length === 0 ? (
            <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted">
              No object passes within 0.05 au in the next 60 days. The feed was read successfully and returned no approaches —
              that is an answer, not a gap.
            </p>
          ) : (
            <ApproachFilters approaches={approaches} />
          )}
        </NeoPanel>

        <section aria-labelledby="reading-heading" className="space-y-3">
          <h2 id="reading-heading" className="font-display text-2xl font-bold">How to read this table</h2>
          <div className="max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              <strong className="text-fg">The distance is a prediction, not a measurement.</strong> It comes from propagating a
              fitted orbit forward, and the fit has uncertainty. That is what the 3-sigma range beneath each distance is: the
              closest and furthest the object could plausibly pass given how well its orbit is currently known. For an object
              observed over years the range is a rounding error; for one discovered last week it can span an order of magnitude.
            </p>
            <p>
              <strong className="text-fg">The times are TDB.</strong> Barycentric dynamical time is the scale JPL computes in, and
              it currently runs about 69 seconds ahead of UTC. AsteriaStar does not convert them, because at the one-minute
              resolution these are published the conversion would imply a precision the source does not claim. If you need a
              wall-clock answer: UTC is TDB <em>minus</em> about 69 seconds, so a time shown here is at most a minute later than
              the same moment on a UTC clock.
            </p>
            <p>
              <strong className="text-fg">The size is usually a guess from brightness.</strong> Absolute magnitude says how much
              sunlight an object reflects, which depends on both its size and how dark its surface is. Converting one to the other
              requires assuming an albedo, and plausible albedos span a factor of five — so the size appears as a range, not a
              number, wherever nobody has actually measured it.
            </p>
            <p>
              <strong className="text-fg">A lunar distance is 384,400 km.</strong> An object at ten lunar distances is roughly four
              million kilometres away, which is not close by any human standard and is entirely routine by the Solar System&apos;s.
            </p>
          </div>
        </section>

        <section aria-labelledby="prov-heading" className="space-y-4">
          <h2 id="prov-heading" className="font-display text-2xl font-bold">Provenance</h2>
          <NeoHonestyNote />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EnvelopeDetails envelope={s.closeApproaches} title="Close approaches" />
            <EnvelopeDetails envelope={s.sentry} title="Sentry cross-reference" />
          </div>
        </section>

        <SourceList keys={["jpl", "nasa"]} title="Sources & references" />
      </Container>
    </>
  );
}
