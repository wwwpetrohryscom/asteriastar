import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AcCards } from "@/components/astrochemistry/AcCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, astrochemistryDiscoveryPath } from "@/lib/routes";
import { BB_DISCOVERIES } from "@/app/astrochemistry/discovery";

const DESCRIPTION =
  "How chemistry builds stars, planets, and the ingredients of life. The interstellar environments where cosmic chemistry happens — the diffuse medium, molecular clouds, star-forming regions, protoplanetary disks, and interstellar dust. The molecules of space, from water, carbon monoxide, ammonia, and methanol to the polycyclic aromatic hydrocarbons that lock up much of the galaxy's carbon and the precursors of life's building blocks. And the astrochemical processes that make and break them — gas-phase and grain-surface chemistry, photochemistry, shocks, and the prebiotic, planet-formation, cometary and meteoritic chemistry that carries molecules toward new worlds. Reuses the platform's spectroscopy method, ALMA and APEX, the James Webb Space Telescope, the Orion Nebula, the origins-of-life topic, the Murchison and Allende meteorites, and the infrared, radio, submillimetre and ultraviolet bands; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Astrochemistry & the Molecular Universe", description: DESCRIPTION, path: ROUTES.astrochemistry });

export default function AstrochemistryHubPage() {
  const e = engine.astrochemistry;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Astrochemistry", url: ROUTES.astrochemistry },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Astrochemistry & the Molecular Universe", description: DESCRIPTION, url: ROUTES.astrochemistry })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Encyclopedia · {e.count} entries · {e.moleculeCount} molecules</span>} title="Astrochemistry &amp; the Molecular Universe" lead="Space is not empty, and it is not simple. In the cold, dark clouds between the stars a rich chemistry unfolds — water and alcohols and the rings of carbon that carry the galaxy's soot, built atom by atom on grains of ice and dust — and it is inherited by every new star, planet, and comet. This is where the ingredients of worlds, and perhaps of life, are first assembled." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore astrochemistry</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BB_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={astrochemistryDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-white hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="molecules-heading">
          <h2 id="molecules-heading" className="font-display text-2xl font-bold">The molecules of space</h2>
          <div className="mt-4"><AcCards records={e.molecules()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each interstellar environment, molecule, and astrochemical process is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the spectroscopy method, ALMA and APEX, the James Webb Space Telescope, the Orion Nebula, the origins-of-life topic, the Murchison and Allende meteorites, and the infrared, radio, submillimetre and ultraviolet bands already in the graph. Curated from NASA, ESO/ALMA, and the astrochemistry community. See{" "}<Link href="/transparency/source-quality" className="text-white underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
