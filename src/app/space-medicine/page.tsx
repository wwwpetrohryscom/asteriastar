import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MedCards } from "@/components/space-medicine/MedCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spaceMedicineDiscoveryPath } from "@/lib/routes";
import { MED_DISCOVERIES } from "@/app/space-medicine/discovery";

const DESCRIPTION =
  "The human-in-space scientific layer — how spaceflight changes the body and how crews are kept alive and healthy. Space medicine, radiation biology, psychology and human factors; the physiological effects of microgravity (bone and muscle loss, fluid shift, vision changes); the life-support technologies of ECLSS; and the countermeasures that protect crews. Reuses the platform's ECLSS system, radiation environments, stations, and astronauts; quantitative figures are omitted unless well established.";

export const metadata: Metadata = buildMetadata({ title: "Life Support, Space Biology & Space Medicine", description: DESCRIPTION, path: ROUTES.spaceMedicine });

export default function SpaceMedicineHubPage() {
  const e = engine.spaceMedicine;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Medicine", url: ROUTES.spaceMedicine },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Life Support, Space Biology & Space Medicine", description: DESCRIPTION, url: ROUTES.spaceMedicine })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Encyclopedia · {e.topics().length} disciplines · {e.effectCount} effects</span>} title="Life Support, Space Biology &amp; Space Medicine" lead="The human body did not evolve for space. This encyclopedia maps what weightlessness and radiation do to it, the technologies that keep a crew alive, and the countermeasures that will carry humans safely to the Moon and Mars." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the human factor</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MED_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={spaceMedicineDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-aurora hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="disc-heading">
          <h2 id="disc-heading" className="font-display text-2xl font-bold">Disciplines</h2>
          <div className="mt-4"><MedCards records={e.topics()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each discipline, physiological effect, life-support technology, and countermeasure is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the ECLSS life-support system, the radiation environments, the space stations, and the astronauts already in the graph. Curated from NASA and ESA human-research sources. Quantitative figures are omitted unless well established. See{" "}<Link href="/transparency/source-quality" className="text-aurora underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
