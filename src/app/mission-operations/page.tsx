import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { OpsCards } from "@/components/mission-operations/OpsCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, missionOperationsDiscoveryPath } from "@/lib/routes";
import { OPS_DISCOVERIES } from "@/app/mission-operations/discovery";

const DESCRIPTION =
  "An encyclopedia of the operational infrastructure behind every mission — the mission-control and operations centres (JPL's SFOF, ESA's ESOC, Houston's Mission Control) and the operational functions that fly spacecraft: mission control, flight dynamics, orbit determination, navigation, telemetry, command sequencing, fault protection, and the operations lifecycle. Reuses the agencies, tracking networks, and missions; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Ground Segment & Mission Operations", description: DESCRIPTION, path: ROUTES.missionOperations });

export default function MissionOperationsHubPage() {
  const e = engine.missionOperations;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Mission Operations", url: ROUTES.missionOperations },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Ground Segment & Mission Operations", description: DESCRIPTION, url: ROUTES.missionOperations })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="stone" eyebrow={<span>Encyclopedia · {e.centers().length} centres · {e.functions().length} functions</span>} title="Ground Segment &amp; Mission Operations" lead="Behind every spacecraft is a team on the ground that flies it. This encyclopedia maps the mission-control centres and the operational functions — navigation, commanding, health monitoring, fault protection — that turn a machine in space into a working mission." />

      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore operations</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OPS_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={missionOperationsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-stone hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="centers-heading">
          <h2 id="centers-heading" className="font-display text-2xl font-bold">Operations centres</h2>
          <p className="mt-1 text-sm text-faint">The control rooms that fly the world&apos;s spacecraft.</p>
          <div className="mt-4"><OpsCards records={e.centers()} /></div>
        </section>

        <section aria-labelledby="functions-heading">
          <h2 id="functions-heading" className="font-display text-2xl font-bold">Operational functions</h2>
          <div className="mt-4"><OpsCards records={e.functions()} /></div>
        </section>

        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each operations centre and function is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the agencies, the tracking networks (DSN, Estrack), and the missions. Curated from NASA, ESA, JAXA, ISRO, Roscosmos, and CNSA. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-stone underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
