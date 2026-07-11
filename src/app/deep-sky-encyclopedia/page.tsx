import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DsoCards } from "@/components/deep-sky-encyclopedia/DsoCards";
import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, deepSkyEncyclopediaDiscoveryPath } from "@/lib/routes";
import { CE_DISCOVERIES } from "@/app/deep-sky-encyclopedia/discovery";

const DESCRIPTION =
  "The classification of the deep sky — the taxonomy layer for the platform's 600-plus galaxies, nebulae, and star clusters. New object classes: open and globular clusters, stellar associations, emission, reflection and dark nebulae, HII regions, Bok globules, planetary nebulae, and supernova remnants, each linked to canonical examples in the graph. Plus two genuinely-missing famous objects — the Horsehead and Cone nebulae. Reuses the existing deep-sky objects, the complete galaxy morphologies, the interstellar-medium concepts (molecular cloud, star-forming region, interstellar dust), the stellar-death processes and supernova classes, the Messier, NGC, Sharpless and Barnard catalogues, and the constellations. Only well-established astrophysics is stated; distances and sizes appear only where firmly measured and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Deep Sky Objects Encyclopedia", description: DESCRIPTION, path: ROUTES.deepSkyEncyclopedia });

// Canonical example objects already in the graph — reused here, not duplicated.
const REUSED_IDS = [
  "nebula:orion-nebula",
  "nebula:ring-nebula",
  "nebula:crab-nebula",
  "star_cluster:pleiades",
  "star_cluster:omega-centauri",
  "galaxy:andromeda-galaxy",
  "galaxy_morphology:spiral",
  "interstellar_environment:molecular-cloud",
  "interstellar_environment:star-forming-region",
  "stellar_process:planetary-nebula-ejection",
  "catalog:messier",
  "catalog:ngc",
];

export default function DeepSkyEncyclopediaHubPage() {
  const e = engine.deepSkyEncyclopedia;
  const reused = REUSED_IDS.map((id) => getEntityById(id)).filter(Boolean) as { id: string; name: string }[];
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Deep-Sky Encyclopedia", url: ROUTES.deepSkyEncyclopedia },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Deep Sky Objects Encyclopedia", description: DESCRIPTION, url: ROUTES.deepSkyEncyclopedia })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Encyclopedia · {e.count} entries · the classes of the deep sky</span>}
        title="Deep Sky Objects Encyclopedia"
        lead="Beyond the Solar System lies a menagerie of clusters, nebulae, and galaxies. This encyclopedia gives that menagerie its taxonomy — the classes of deep-sky object, from open clusters to supernova remnants — and ties each class to the hundreds of real objects already mapped in the graph, so a nebula is never just a picture but a member of a family with a physical story."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the deep sky</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CE_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={deepSkyEncyclopediaDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="classes-heading">
          <h2 id="classes-heading" className="font-display text-2xl font-bold">Deep-sky object classes</h2>
          <div className="mt-4"><DsoCards records={e.classes()} /></div>
        </section>

        <section aria-labelledby="objects-heading">
          <h2 id="objects-heading" className="font-display text-2xl font-bold">Featured objects</h2>
          <div className="mt-4"><DsoCards records={e.objects()} /></div>
        </section>

        {reused.length > 0 && (
          <section aria-labelledby="reused-heading">
            <h2 id="reused-heading" className="font-display text-2xl font-bold">Also in the graph</h2>
            <p className="mt-1 text-sm text-muted">The objects, morphologies, and concepts these classes build on — reused, not duplicated.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {reused.map((o) => (
                <li key={o.id}><Link href={entityGraphPath(o as never)} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{o.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each entry is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the 600-plus deep-sky objects in the graph, the complete galaxy morphologies, the interstellar-medium concepts, the stellar-death processes and supernova classes, and the Messier, NGC, Sharpless and Barnard catalogues already present. Only well-established astrophysics is stated; distances and sizes appear only where firmly measured, and nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
