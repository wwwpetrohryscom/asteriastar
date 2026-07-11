import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { LiveCards } from "@/components/live/LiveCards";
import { LiveStatusPanel } from "@/components/live/LiveStatusPanel";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, liveDiscoveryPath } from "@/lib/routes";
import { BT_DISCOVERIES } from "@/app/live/discovery";

const DESCRIPTION =
  "AsteriaStar's first connections to real external scientific data providers — modelled with the full honesty envelope. Space weather from NOAA's Space Weather Prediction Center, solar activity from NASA DONKI, near-Earth-object close approaches from the Minor Planet Center and JPL/CNEOS, orbital elements from CelesTrak, and atmospheric conditions. Every provider exposes its endpoint, licence, status, and limitations; a provider that is not connected shows no data — only its honest status. No live value, timestamp, or provider response is ever fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Live Scientific Data Platform", description: DESCRIPTION, path: ROUTES.live });

export default function LiveHubPage() {
  const e = engine.liveScientificData;
  const report = e.statusReport();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Live Data", url: ROUTES.live },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Live Scientific Data Platform", description: DESCRIPTION, url: ROUTES.live })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Encyclopedia · {e.count} providers · {report.connected} connected</span>} title="Live Scientific Data Platform" lead="The Sun does not wait, and neither do the asteroids. This is AsteriaStar's connection to the real, changing sky — space weather, solar activity, and near-Earth objects from the agencies that measure them. Honesty first: every provider shows its status and licence, and a provider that is not connected shows no data at all, never a fabricated one." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="status-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="status-heading" className="font-display text-2xl font-bold">Provider status</h2>
            <Link href={`${ROUTES.live}/data-status`} className="text-sm text-nasa hover:underline">Full data-status →</Link>
          </div>
          <div className="mt-4"><LiveStatusPanel report={report} /></div>
        </section>
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">By category</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BT_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={liveDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} providers</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="providers-heading">
          <h2 id="providers-heading" className="font-display text-2xl font-bold">The providers</h2>
          <div className="mt-4"><LiveCards records={e.all()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each provider is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the operating organisation and the space-weather phenomena already in the graph. The integration reuses the existing live-sky provider registry as its source of truth for status. In this deployment no provider is connected, so no live value is shown — every provider reports its honest status, endpoint, licence, and limitations, and nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
