import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AbCards } from "@/components/astrobiology/AbCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, astrobiologyDiscoveryPath } from "@/lib/routes";
import { AB_DISCOVERIES } from "@/app/astrobiology/discovery";

const DESCRIPTION =
  "The science of life beyond Earth — how life might begin, where it could survive, and how we would know. The origins of life, planetary habitability (liquid water, energy, chemistry, extremophiles), the ocean worlds Europa, Enceladus, and Titan, the biosignatures of life and the false positives that must be ruled out, the search for technosignatures and SETI, and the planetary protection that keeps the search honest. Reuses the platform's ocean-world moons, Mars, the habitable-zone concept, the SETI Institute, and the life-search missions; nothing is fabricated, and no claim of life is asserted.";

export const metadata: Metadata = buildMetadata({ title: "Astrobiology, Biosignatures & the Search for Life", description: DESCRIPTION, path: ROUTES.astrobiology });

export default function AstrobiologyHubPage() {
  const e = engine.astrobiology;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Astrobiology", url: ROUTES.astrobiology },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Astrobiology, Biosignatures & the Search for Life", description: DESCRIPTION, url: ROUTES.astrobiology })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Encyclopedia · {e.topics().length} disciplines · {e.biosignatureCount} biosignatures</span>} title="Astrobiology, Biosignatures &amp; the Search for Life" lead="Are we alone? Astrobiology turns that ancient question into science — studying how life begins, what a world needs to host it, and how to recognise its signs without being fooled. From the oceans of Europa to the spectra of distant worlds, this is the search for life, done carefully." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the search for life</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AB_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={astrobiologyDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="disc-heading">
          <h2 id="disc-heading" className="font-display text-2xl font-bold">Disciplines</h2>
          <div className="mt-4"><AbCards records={e.topics()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each discipline, biosignature, habitability factor, and planetary-protection measure is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the ocean-world moons, Mars, the habitable-zone concept, the SETI Institute, and the life-search missions already in the graph. Curated from NASA and ESA. No claim of extraterrestrial life is asserted; biosignatures are potential, and false positives are treated seriously. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
