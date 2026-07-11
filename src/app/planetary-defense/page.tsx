import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PdCards } from "@/components/planetary-defense/PdCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, planetaryDefenseDiscoveryPath } from "@/lib/routes";
import { PD_DISCOVERIES } from "@/app/planetary-defense/discovery";

const DESCRIPTION =
  "The operational planetary-defense layer — the end-to-end system that finds, tracks, assesses, and could deflect a hazardous near-Earth object. The NEO pipeline from survey discovery through orbit determination, characterization, impact monitoring, risk assessment and communication, to decision and deflection; the Torino and Palermo risk scales; and the deflection methods from the demonstrated kinetic impactor (DART) to theoretical nuclear concepts. Reuses the platform's survey telescopes, the Minor Planet Center and CNEOS, the DART and Hera missions, and the near-Earth objects; nothing is fabricated and speculative methods are marked as such.";

export const metadata: Metadata = buildMetadata({ title: "Planetary Defense & NEO Operations", description: DESCRIPTION, path: ROUTES.planetaryDefense });

export default function PlanetaryDefenseHubPage() {
  const e = engine.planetaryDefense;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Planetary Defense", url: ROUTES.planetaryDefense },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Planetary Defense & NEO Operations", description: DESCRIPTION, url: ROUTES.planetaryDefense })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Encyclopedia · {e.stageCount}-stage pipeline · {e.methods().length} deflection methods</span>} title="Planetary Defense &amp; NEO Operations" lead="An asteroid impact is the one natural disaster we could, in principle, prevent. This is the system that would do it — the surveys that find the near-Earth objects, the networks that track and assess them, and the missions, like DART, that have shown an asteroid can be moved." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore planetary defense</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PD_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={planetaryDefenseDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="pipeline-heading">
          <h2 id="pipeline-heading" className="font-display text-2xl font-bold">The NEO pipeline</h2>
          <div className="mt-4"><PdCards records={e.stages()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each pipeline stage, risk scale, and deflection method is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the survey telescopes, the Minor Planet Center and CNEOS, the DART and Hera missions, and the near-Earth objects already in the graph. Curated from NASA, ESA, and the Minor Planet Center. Deflection-method maturity is stated honestly — from the DART-demonstrated kinetic impactor to purely theoretical nuclear concepts. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
