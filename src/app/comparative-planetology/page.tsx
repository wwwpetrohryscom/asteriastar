import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CpCards } from "@/components/comparative-planetology/CpCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, comparativePlanetologyDiscoveryPath } from "@/lib/routes";
import { BA_DISCOVERIES } from "@/app/comparative-planetology/discovery";

const DESCRIPTION =
  "How planets and moons evolve, compared across the Solar System and beyond. The interior layers that structure a world — core, mantle, and crust — and the differentiation that builds them. The planetary processes that shape a world over its history: plate tectonics (known for certain only on Earth), volcanism and cryovolcanism, atmospheric escape, climate evolution, the greenhouse effect, atmospheric circulation, magnetospheric shielding, and impact cratering. And the world-types beyond the familiar — ocean worlds like Europa and Enceladus, lava worlds, and the proposed hycean planets. Reuses the platform's planets (Mercury–Neptune), moons (Titan, Europa, Enceladus, Io, Triton), Pluto, the super-Earth, mini-Neptune, and hot-Jupiter classes, the magnetosphere, the cryovolcano feature, the habitable zone, and the ocean-worlds theme; hypothetical world-types are labelled as such and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Comparative Planetology & Planetary Atmospheres", description: DESCRIPTION, path: ROUTES.comparativePlanetology });

export default function ComparativePlanetologyHubPage() {
  const e = engine.comparativePlanetology;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Comparative Planetology", url: ROUTES.comparativePlanetology },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Comparative Planetology & Planetary Atmospheres", description: DESCRIPTION, url: ROUTES.comparativePlanetology })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Encyclopedia · {e.count} entries · {e.processCount} planetary processes</span>} title="Comparative Planetology &amp; Planetary Atmospheres" lead="Why is Venus a furnace, Mars a frozen desert, and Earth alive? The answer lies not in any one world but in comparing them — the same handful of processes, of interiors and atmospheres and magnetic fields, playing out to wildly different ends. This is planetary science as a comparative discipline, from the cores of planets to the oceans of icy moons." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore comparative planetology</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BA_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={comparativePlanetologyDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-ember hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="processes-heading">
          <h2 id="processes-heading" className="font-display text-2xl font-bold">The processes that shape worlds</h2>
          <div className="mt-4"><CpCards records={e.processes()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each interior layer, planetary process, and world-type is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the planets, moons, Pluto, the planetary classes, the magnetosphere, the cryovolcano feature, the habitable zone, and the ocean-worlds theme already in the graph. Curated from NASA and the planetary-science community. Hypothetical world-types (such as hycean planets) are labelled as proposed. See{" "}<Link href="/transparency/source-quality" className="text-ember underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
