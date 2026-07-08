import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SolarCards } from "@/components/solar-physics/SolarCards";
import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, solarPhysicsDiscoveryPath } from "@/lib/routes";
import { BY_DISCOVERIES } from "@/app/solar-physics/discovery";

const DESCRIPTION =
  "The Sun from its core to the edge of the heliosphere. The concentric solar interior (core, radiative zone, convection zone, tachocline) and atmosphere (photosphere, chromosphere, transition region, corona); the surface and atmospheric features (granulation, prominences, filaments, plages, spicules, coronal loops, streamers); the physics of the Sun (dynamo, magnetic reconnection, differential rotation, the coronal-heating problem); the solar cycle (butterfly diagram, Maunder & Dalton minima, irradiance variation); the fast and slow solar wind; and the heliosphere (Parker spiral, termination shock, heliosheath, bow wave). Reuses the Sun, the space-weather phenomena, helioseismology, and the solar observatories already in the graph. Only well-established solar physics is stated; open questions are flagged and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Solar Physics, Heliosphere & Solar Observatory", description: DESCRIPTION, path: ROUTES.solarPhysics });

// Solar observatories already in the graph — reused here, not duplicated.
const OBSERVATORY_IDS = [
  "space_telescope:soho",
  "space_telescope:solar-dynamics-observatory",
  "space_telescope:hinode",
  "space_mission:parker-solar-probe",
  "space_mission:solar-orbiter",
  "telescope:daniel-k-inouye-solar-telescope",
];

export default function SolarPhysicsHubPage() {
  const e = engine.solarPhysics;
  const observatories = OBSERVATORY_IDS.map((id) => getEntityById(id)).filter(Boolean) as { id: string; name: string; description?: string }[];
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Solar Physics", url: ROUTES.solarPhysics },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Solar Physics, Heliosphere & Solar Observatory", description: DESCRIPTION, url: ROUTES.solarPhysics })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="ember"
        eyebrow={<span>Encyclopedia · {e.count} entries · core to heliosphere</span>}
        title="Solar Physics, Heliosphere & Solar Observatory"
        lead="The nearest star, from the inside out. Follow energy from the fusion core through the radiative and convective interior to the visible surface, into the million-degree corona, and out on the solar wind to the edge of the heliosphere — the bubble the Sun blows in interstellar space, crossed by the Voyagers."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the Sun</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {BY_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={solarPhysicsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-ember hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="structure-heading">
          <h2 id="structure-heading" className="font-display text-2xl font-bold">The structure of the Sun</h2>
          <div className="mt-4"><SolarCards records={e.regions()} /></div>
        </section>

        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="font-display text-2xl font-bold">Solar features</h2>
          <div className="mt-4"><SolarCards records={e.features()} /></div>
        </section>

        <section aria-labelledby="dynamics-heading">
          <h2 id="dynamics-heading" className="font-display text-2xl font-bold">Solar physics, cycle &amp; wind</h2>
          <div className="mt-4"><SolarCards records={e.dynamics()} /></div>
        </section>

        <section aria-labelledby="helio-heading">
          <h2 id="helio-heading" className="font-display text-2xl font-bold">The heliosphere</h2>
          <div className="mt-4"><SolarCards records={e.heliosphere()} /></div>
        </section>

        {observatories.length > 0 && (
          <section aria-labelledby="obs-heading">
            <h2 id="obs-heading" className="font-display text-2xl font-bold">Solar observatories</h2>
            <p className="mt-1 text-sm text-muted">The missions and telescopes that watch the Sun — reused from the graph, not duplicated.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {observatories.map((o) => (
                <li key={o.id}><Link href={entityGraphPath(o as never)} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{o.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each entry is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the Sun, the space-weather phenomena, helioseismology, and the solar observatories already in the graph. Only well-established solar physics is stated; open questions such as coronal heating and the nature of the heliospheric boundary are flagged, and nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-ember underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
