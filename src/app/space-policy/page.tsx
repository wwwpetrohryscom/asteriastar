import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SpCards } from "@/components/space-policy/SpCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spacePolicyDiscoveryPath } from "@/lib/routes";
import { BC_DISCOVERIES } from "@/app/space-policy/discovery";

const DESCRIPTION =
  "The institutional and operational layer of modern space activity — the law, the sustainability, and the economy that govern what happens above the atmosphere. The framework of space law: the Outer Space Treaty and the Liability, Registration, and Moon agreements built on it, and the modern Artemis Accords. The policy and sustainability challenges of a crowded orbit: orbital debris, the Kessler syndrome, space situational awareness and traffic management, debris mitigation, mega-constellations, launch licensing, spectrum allocation, export control, space-resource policy, and planetary protection. And the space economy: commercial launch, the satellite economy, insurance, and the whole system of space activity. Reuses the platform's on-orbit-servicing process, the in-situ-resource-utilisation domain, the planetary-protection topic and its contamination measures, the space-weather satellite impact, and NASA; the governing bodies (UNOOSA, COSPAR, the ITU, the IAF) join as organisations; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Space Policy, Sustainability & the Space Economy", description: DESCRIPTION, path: ROUTES.spacePolicy });

export default function SpacePolicyHubPage() {
  const e = engine.spacePolicy;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Policy", url: ROUTES.spacePolicy },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Space Policy, Sustainability & the Space Economy", description: DESCRIPTION, url: ROUTES.spacePolicy })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="stone" eyebrow={<span>Encyclopedia · {e.count} entries · {e.topicCount} policy topics</span>} title="Space Policy, Sustainability &amp; the Space Economy" lead="Space is no longer the preserve of a few governments — it is a crowded, commercial, and contested domain, and it runs on rules. This is the layer that so much of astronomy now depends on: the treaties that keep space peaceful, the sustainability of orbits filling with satellites and debris, and the economy that launches it all." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore space policy</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BC_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={spacePolicyDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="sustainability-heading">
          <h2 id="sustainability-heading" className="font-display text-2xl font-bold">Policy &amp; sustainability</h2>
          <div className="mt-4"><SpCards records={e.topics()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each treaty, policy topic, economy topic, and organisation is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the on-orbit-servicing process, the in-situ-resource-utilisation domain, the planetary-protection topic and its contamination measures, the space-weather satellite impact, and NASA already in the graph. Curated from the UN space treaties, UNOOSA, COSPAR, and NASA. Treaty years are historical facts. See{" "}<Link href="/transparency/source-quality" className="text-faint underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
