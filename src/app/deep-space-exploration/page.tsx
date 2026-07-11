import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DseCards } from "@/components/deep-space-exploration/DseCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, deepSpaceExplorationDiscoveryPath } from "@/lib/routes";
import { BI_DISCOVERIES } from "@/app/deep-space-exploration/discovery";

const DESCRIPTION =
  "The architecture of sending humans beyond low Earth orbit to stay, and the challenges of keeping them alive and well far from home. The architectures of exploration: the Moon-to-Mars strategy, the Mars surface base, the deep-space transit habitat, surface power and mobility, construction from local resources, crewed deep-space propulsion, and Mars entry, descent and landing. And the challenges of deep space: the radiation beyond Earth's magnetic field, the communication time delay, Earth independence and crew autonomy, long-duration life support, behavioural health and crew cohesion, planetary protection, and planetary dust. Reuses the platform's Artemis program, the Lunar Gateway, in-situ resource utilisation and regolith processing, the ECLSS, closed-loop and bioregenerative life support, the countermeasures, the inflatable habitat, the surface-operations phase, nuclear-thermal propulsion, the construction processes, planetary protection, the Deep Space Network, and the space-medicine and human-factors topics; only well-established plans and physics are stated and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Deep-Space Human Exploration & Habitation", description: DESCRIPTION, path: ROUTES.deepSpaceExploration });

export default function DeepSpaceExplorationHubPage() {
  const e = engine.deepSpaceExploration;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Deep-Space Exploration", url: ROUTES.deepSpaceExploration },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Deep-Space Human Exploration & Habitation", description: DESCRIPTION, url: ROUTES.deepSpaceExploration })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Encyclopedia · {e.count} entries · {e.architectureCount} architectures</span>} title="Deep-Space Human Exploration &amp; Habitation" lead="Sending people to the Moon to stay, and one day to Mars, is less a rocketry problem than a habitation problem. This is the architecture of living beyond Earth — the bases, transit habitats, power and propulsion — and the hard human challenges of radiation, isolation, and self-sufficiency that only sharpen the farther a crew travels from home." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore deep-space exploration</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BI_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={deepSpaceExplorationDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="architecture-heading">
          <h2 id="architecture-heading" className="font-display text-2xl font-bold">The architecture of living beyond Earth</h2>
          <div className="mt-4"><DseCards records={e.architecture()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each exploration architecture and deep-space challenge is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the Artemis program, the Lunar Gateway, in-situ resource utilisation, the habitats, the countermeasures, the ECLSS and closed-loop life support, the construction processes, nuclear-thermal propulsion, planetary protection, the Deep Space Network, and the space-medicine topics already in the graph. Curated from NASA and the human-exploration literature. Only well-established plans and physics are stated. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
