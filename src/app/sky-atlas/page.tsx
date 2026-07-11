import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AtlasCards } from "@/components/sky-atlas/AtlasCards";
import { SkyChart } from "@/components/sky-atlas/SkyChart";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, skyAtlasDiscoveryPath } from "@/lib/routes";
import { BO_DISCOVERIES } from "@/app/sky-atlas/discovery";
import { starsToPoints } from "@/lib/sky-atlas/chart-data";

const DESCRIPTION =
  "The visual layer over the AsteriaStar knowledge graph. An interactive sky atlas and universe explorer: the all-sky star atlas, the constellation, Messier, and deep-sky atlases, and the Solar System, Milky Way, Local Group, galaxy, planet, moon, exoplanet, and distance-scale explorers, with constellation, observing, JWST, Hubble, Gaia, and telescope-field overlays. Positional maps are drawn as scalable vector graphics from the real, measured right ascension and declination of the stars and deep-sky objects already in the graph — no position is fabricated, and three-dimensional views are prepared as architecture rather than invented scenes.";

export const metadata: Metadata = buildMetadata({ title: "Interactive Sky Atlas & 3D Universe", description: DESCRIPTION, path: ROUTES.skyAtlas });

export default function SkyAtlasHubPage() {
  const e = engine.skyAtlas;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Sky Atlas", url: ROUTES.skyAtlas },
  ];
  // Real all-sky preview from the brightest catalogued stars.
  const brightStars = (engine.star.all() as Array<{ id: string; name: string; ra?: number; dec?: number; apparentMagnitude?: number }>)
    .filter((r) => typeof r.apparentMagnitude === "number" && (r.apparentMagnitude as number) <= 4.5);
  const previewPoints = starsToPoints(brightStars);
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Interactive Sky Atlas & 3D Universe", description: DESCRIPTION, url: ROUTES.skyAtlas })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Encyclopedia · {e.count} views · {e.viewCount} maps &amp; explorers</span>} title="Interactive Sky Atlas &amp; 3D Universe" lead="The visual layer over the knowledge graph. Every map here is drawn from real, measured coordinates — a star or galaxy appears only where the data places it — turning the catalogue into a sky you can navigate, from the constellations overhead to the far reaches of the Local Group." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="preview-heading">
          <h2 id="preview-heading" className="font-display text-2xl font-bold">The naked-eye sky</h2>
          <p className="mt-1 text-sm text-muted">{previewPoints.length} stars brighter than magnitude 4.5, at their measured positions.</p>
          <div className="mt-4"><SkyChart points={previewPoints} /></div>
        </section>
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the atlas</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BO_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={skyAtlasDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="views-heading">
          <h2 id="views-heading" className="font-display text-2xl font-bold">Maps &amp; explorers</h2>
          <div className="mt-4"><AtlasCards records={e.views()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each atlas view and overlay is a first-class knowledge-graph entity resolved through the Scientific Data Engine. Positional maps are rendered directly from the measured right ascension and declination already stored in the star and deep-sky catalogues; object counts are computed from the live collections, never hard-coded; and three-dimensional views are prepared as architecture rather than fabricated scenes. See{" "}<Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
