import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { UniverseCards } from "@/components/universe-3d/UniverseCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION =
  "An interactive 3D and Canvas view of the universe, built only from real measured coordinates. Fly through the local stellar neighbourhood at true parallax distances, see the Solar System's orbits to scale, and watch a constellation's familiar pattern dissolve into stars at wildly different distances. Every position is measured — nothing is invented — and where the catalogue carries no numeric geometry, the scene says so plainly rather than fabricate one.";

export const metadata: Metadata = buildMetadata({ title: "The Universe in 3D", description: DESCRIPTION, path: ROUTES.universe3d });

export default function Universe3DHubPage() {
  const e = engine.webglUniverse;
  const scenes = e.all();
  const interactive = e.interactiveScenes().length;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "3D Universe", url: ROUTES.universe3d },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "The Universe in 3D", description: DESCRIPTION, url: ROUTES.universe3d })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Encyclopedia · {scenes.length} scenes · {interactive} interactive</span>}
        title="The Universe in 3D"
        lead="A view of the cosmos you can turn in your hands — the nearest stars at their true distances, the Solar System to scale, a constellation revealed as a line-of-sight illusion. Every point sits at a measured position; nothing is placed at a guessed one, and where the data has no geometry to plot, the scene tells you so."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="scenes-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="scenes-heading" className="font-display text-2xl font-bold">The scenes</h2>
            <Link href={`${ROUTES.universe3d}/data-coverage`} className="text-sm text-nebula hover:underline">What can be shown in true 3D →</Link>
          </div>
          <div className="mt-4"><UniverseCards scenes={scenes} /></div>
        </section>
        <section aria-labelledby="how-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="how-heading" className="font-display text-base font-semibold text-fg">How these scenes are drawn</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The interactive scenes render on a 2D canvas from the same measured coordinates that back the Sky Atlas — right ascension, declination, parallax distance, and orbital semi-major axes already in the knowledge graph. They complete the Atlas&rsquo;s &ldquo;3D-ready&rdquo; views. A star with no measured distance is never placed in a distance-true scene; a galaxy with only a descriptive scale label is never given invented coordinates. With JavaScript off, or when a scene has no numeric geometry, a server-rendered static image and a data table carry the same real data. See{" "}
            <Link href={`${ROUTES.universe3d}/data-coverage`} className="text-nebula underline-offset-4 hover:underline">data coverage</Link>{" "}and{" "}
            <Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
