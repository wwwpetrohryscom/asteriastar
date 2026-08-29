import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, neoPath } from "@/lib/routes";
import { NeoNav, NeoHonestyNote, NeoPanel, PalermoNote, SentryRow } from "@/components/neo/NeoUI";
import { EnvelopeDetails } from "@/components/space-weather/LiveStatus";
import { riskSnapshot, highestRatedRisks, reage } from "@/platform/neo/service";
import { getLiveProvider } from "@/platform/live-providers/registry";

const DESCRIPTION =
  "NASA/JPL's Sentry impact-monitoring table, read as JPL publishes it: every near-Earth object whose orbit leaves any possibility of a future impact open, ranked by the Palermo scale that exists to compare such possibilities against the background risk. With JPL's own statement of how accurate these probabilities are, and what it means when an object leaves the table.";

export const metadata: Metadata = buildMetadata({
  title: "Near-Earth Object Impact Risk",
  description: DESCRIPTION,
  path: neoPath("risk"),
  keywords: ["Sentry impact risk", "Palermo scale", "Torino scale", "asteroid impact probability", "impact monitoring", "CNEOS Sentry"],
});

/** Six hours: Sentry re-runs when new observations arrive for a listed object, over days. */
export const revalidate = 21600;

export default async function NeoRiskPage() {
  const nowIso = new Date().toISOString();
  const s = reage(await riskSnapshot(), nowIso);
  const top = highestRatedRisks(s.sentry, 25);
  const all = s.sentry.data ?? [];
  const aboveThreshold = all.filter((o) => (o.palermoCumulative ?? -99) >= -2);
  const provider = getLiveProvider("jpl-ssd");

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Near-Earth Objects", url: ROUTES.neo },
    { name: "Impact risk", url: neoPath("risk") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Near-Earth Object Impact Risk", description: DESCRIPTION, url: neoPath("risk") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="ember"
        eyebrow={<span>Live · NASA/JPL CNEOS Sentry</span>}
        title="Impact risk"
        lead="Sentry is a monitoring system, not an alarm. It lists every object whose orbit has not yet been pinned down tightly enough to rule an impact out — which is a statement about how much we know, far more than about what will happen."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <NeoNav current="risk" />

        <section aria-labelledby="what-heading" className="space-y-3">
          <h2 id="what-heading" className="font-display text-2xl font-bold">What Sentry is</h2>
          <div className="max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              Sentry continuously scans the catalogue of near-Earth objects for any that could conceivably strike Earth in the next
              century or so. An object appears on this table not because it is expected to hit us, but because its orbit is not yet
              known precisely enough for the possibility to be excluded. There are currently{" "}
              <strong className="text-fg">{all.length.toLocaleString("en-GB")}</strong> such objects.
            </p>
            <p>
              Objects leave the table constantly, and that is the system working. A few more nights of observation usually shrink
              the orbital uncertainty until every possible impact falls outside it, and the object is removed. Very few entries stay
              for long.
            </p>
          </div>
        </section>

        <NeoPanel envelope={s.sentry} title="Highest-rated objects" what="The CNEOS Sentry table" id="risk-heading">
          <p className="text-sm text-muted">
            Ranked by the cumulative Palermo scale — not by raw impact probability, which would put a harmless boulder with a badly
            known orbit above a kilometre-wide object with a well-determined one.
            {aboveThreshold.length === 0
              ? " Every object currently listed sits below −2 on that scale, the level its own definition calls no cause for public concern."
              : ` ${aboveThreshold.length} object${aboveThreshold.length === 1 ? "" : "s"} currently sit${aboveThreshold.length === 1 ? "s" : ""} above −2, and all remain below 0 — that is, below the background risk from all objects of comparable size.`}
          </p>
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="px-3 pt-3 text-left text-xs text-faint">
                The 25 highest-rated of {all.length.toLocaleString("en-GB")} monitored objects. Diameters are JPL&apos;s estimate
                from absolute magnitude assuming an albedo of 0.154, unless a measurement exists.
              </caption>
              <thead className="text-faint">
                <tr>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">Object</th>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">Cumulative probability</th>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">Years</th>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">Palermo (cumulative)</th>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">Torino</th>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">Diameter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {top.map((o) => <SentryRow key={o.designation} s={o} />)}
              </tbody>
            </table>
          </div>
        </NeoPanel>

        <PalermoNote topRating={top[0]?.palermoCumulative} />

        {provider?.providerCaveat && (
          <section aria-labelledby="caveat-heading" className="space-y-3">
            <h2 id="caveat-heading" className="font-display text-2xl font-bold">JPL&apos;s own caveat</h2>
            <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm leading-relaxed text-muted">{provider.providerCaveat}</p>
            <p className="text-sm leading-relaxed text-muted">
              That caveat is the reason this page does not round these figures into headlines. A probability that could be wrong by
              a factor of ten is a useful monitoring signal and a terrible basis for alarm, which is exactly how JPL treats it and
              exactly how AsteriaStar presents it.
            </p>
          </section>
        )}

        <section aria-labelledby="scales-heading" className="space-y-3">
          <h2 id="scales-heading" className="font-display text-2xl font-bold">The two scales</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="scientific-card p-5">
              <h3 className="font-display text-base font-semibold text-fg">Palermo</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                A logarithmic comparison against the background risk: how much more or less likely this specific object is to cause
                damage than the general population of objects its size, over the time remaining until the potential impact. Zero
                means &ldquo;as likely as the background&rdquo;. Minus two means a hundred times less likely, and is the threshold
                the scale itself sets for public concern. Essentially every object ever listed has been well below it.
              </p>
            </div>
            <div className="scientific-card p-5">
              <h3 className="font-display text-base font-semibold text-fg">Torino</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                A 0–10 integer scale for public communication, combining impact probability with kinetic energy. It is defined only
                for potential impacts less than a century away. Zero means the collision chance is zero or effectively zero, and
                that is where almost every object has always sat. Only one object has ever briefly reached level 4, and further
                observations returned it to zero.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="prov-heading" className="space-y-4">
          <h2 id="prov-heading" className="font-display text-2xl font-bold">Provenance</h2>
          <NeoHonestyNote />
          <EnvelopeDetails envelope={s.sentry} title="Sentry risk table" />
        </section>

        <SourceList keys={["jpl", "nasa"]} title="Sources & references" />
      </Container>
    </>
  );
}
