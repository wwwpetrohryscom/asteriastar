import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { GxCards } from "@/components/galaxies/GxCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, galaxiesDiscoveryPath } from "@/lib/routes";
import { GX_DISCOVERIES } from "@/app/galaxies/discovery";

const DESCRIPTION =
  "The extragalactic universe — the forms of galaxies (spiral, barred, elliptical, lenticular, irregular, ring, dwarf, peculiar), the active galactic nuclei at their hearts (Seyferts, LINERs, radio galaxies, blazars), the processes that shape them (mergers, interactions, starbursts, black-hole feedback, quenching), and the great structures they build — the Local Group, the Virgo and Coma clusters, Laniakea, the cosmic web, its walls and voids. Reuses the platform's galaxies, object classes, and cosmology concepts; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Galaxies, AGN & the Extragalactic Universe", description: DESCRIPTION, path: ROUTES.galaxies });

export default function GalaxiesHubPage() {
  const e = engine.galaxies;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Galaxies", url: ROUTES.galaxies },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Galaxies, AGN & the Extragalactic Universe", description: DESCRIPTION, url: ROUTES.galaxies })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Encyclopedia · {e.morphologyCount} morphologies · {e.agnTypes().length} AGN types</span>} title="Galaxies, AGN &amp; the Extragalactic Universe" lead="Beyond the Milky Way lie hundreds of billions of galaxies — spirals and ellipticals, some with blazing active hearts, drawn together by gravity into groups, clusters, and superclusters strung along the vast filaments of the cosmic web." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the extragalactic universe</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GX_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={galaxiesDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-halo hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="morph-heading">
          <h2 id="morph-heading" className="font-display text-2xl font-bold">Galaxy morphology</h2>
          <div className="mt-4"><GxCards records={e.morphologies()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each galaxy morphology, AGN type, galactic process, and cosmic structure is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the galaxies, the astrophysical object classes (AGN, quasar, blazar, clusters, voids), and the cosmology concepts already in the graph. Curated from NASA and ESA. See{" "}<Link href="/transparency/source-quality" className="text-halo underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
