import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { InfraCards } from "@/components/space-infrastructure/InfraCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spaceInfrastructureDiscoveryPath } from "@/lib/routes";
import { INFRA_DISCOVERIES } from "@/app/space-infrastructure/discovery";

const DESCRIPTION =
  "The future engineering layer — making and building things in space rather than launching them. In-situ resource utilisation (water, oxygen, metals, and propellant from the Moon, Mars, and asteroids); in-space manufacturing (3D printing, assembly, servicing); and the infrastructure of a spacefaring economy (propellant depots, habitats, power stations, tugs, and megastructure concepts). Reuses the platform's worlds, commercial and inflatable stations, propellants, and components; technology maturity is stated honestly and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Space Manufacturing & In-Space Infrastructure", description: DESCRIPTION, path: ROUTES.spaceInfrastructure });

export default function SpaceInfrastructureHubPage() {
  const e = engine.spaceInfrastructure;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Infrastructure", url: ROUTES.spaceInfrastructure },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Space Manufacturing & In-Space Infrastructure", description: DESCRIPTION, url: ROUTES.spaceInfrastructure })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="stone" eyebrow={<span>Encyclopedia · {e.domains().length} domains · {e.itemCount} technologies</span>} title="Space Manufacturing &amp; In-Space Infrastructure" lead="The next era of spaceflight will not launch everything from Earth. It will mine water on the Moon, make oxygen on Mars, print parts in orbit, and build the depots, habitats, and power stations of an economy in space. This encyclopedia maps that future — with each technology's real maturity stated plainly." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the build-out</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INFRA_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={spaceInfrastructureDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="domains-heading">
          <h2 id="domains-heading" className="font-display text-2xl font-bold">Domains</h2>
          <div className="mt-4"><InfraCards records={e.domains()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each domain, ISRU technique, manufacturing process, and infrastructure system is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the Moon, Mars, the metal asteroids, the commercial and inflatable space stations, the propellants, and the components already in the graph. Curated from NASA and ESA. Technology maturity is stated honestly — from operational to purely theoretical — and nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-faint underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
