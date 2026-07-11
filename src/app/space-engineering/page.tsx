import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { EngineeringCards } from "@/components/space-engineering/EngineeringCards";
import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spaceEngineeringDiscoveryPath } from "@/lib/routes";
import { CB_DISCOVERIES } from "@/app/space-engineering/discovery";

const DESCRIPTION =
  "A deep dive into the concepts and methods of space engineering — the propulsion, rocketry, and flight-maneuver ideas that the hardware in the graph embodies. Propulsion methods: electric propulsion and its nuclear-electric, VASIMR, arcjet and resistojet variants, the propellant-free solar sail, mono- and bipropellant chemical systems, and the staged-combustion engine cycle. Rocketry principles: the Tsiolkovsky rocket equation, specific impulse, thrust-to-weight, the delta-v budget, rocket staging, and thrust vector control. Flight maneuvers: orbital rendezvous, station-keeping, aerobraking, aerocapture, and the gravity-turn ascent. Reuses the rocket engines, stages and propellants, the spacecraft subsystems and components, the docking and navigation systems, and the operations functions already in the graph. Only well-established engineering is stated; not-yet-flown technologies are flagged and nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Space Engineering & Launch Systems Deep Dive", description: DESCRIPTION, path: ROUTES.spaceEngineering });

// Engineering hardware already in the graph — reused here, not duplicated.
const REUSED_IDS = [
  "rocket_engine:rs-25",
  "rocket_engine:raptor",
  "rocket_stage:s-ic",
  "propellant:lh2-lox",
  "spacecraft_component:ion-thruster",
  "spacecraft_component:hall-effect-thruster",
  "spacecraft_component:nuclear-thermal-propulsion",
  "spacecraft_component:reaction-control-system",
  "spacecraft_component:heat-shield",
  "spacecraft_subsystem:entry-descent-and-landing",
  "docking_system:idss",
  "navigation_system:autonomous-navigation",
];

export default function SpaceEngineeringHubPage() {
  const e = engine.spaceEngineering;
  const reused = REUSED_IDS.map((id) => getEntityById(id)).filter(Boolean) as { id: string; name: string }[];
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Engineering", url: ROUTES.spaceEngineering },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Space Engineering & Launch Systems Deep Dive", description: DESCRIPTION, url: ROUTES.spaceEngineering })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="stone"
        eyebrow={<span>Encyclopedia · {e.count} entries · how spacecraft are engineered to fly</span>}
        title="Space Engineering & Launch Systems Deep Dive"
        lead="Rockets and spacecraft are governed by a handful of powerful ideas. Follow the propulsion methods that push off from nothing, the rocketry principles — led by the rocket equation — that make orbit hard-won, and the flight maneuvers that steer a vehicle from the pad to another planet. Each concept ties back to the real engines, stages, and subsystems that embody it."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore space engineering</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CB_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col scientific-card p-5">
                <Link href={spaceEngineeringDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="propulsion-heading">
          <h2 id="propulsion-heading" className="font-display text-2xl font-bold">Propulsion methods</h2>
          <div className="mt-4"><EngineeringCards records={e.propulsion()} /></div>
        </section>

        <section aria-labelledby="principles-heading">
          <h2 id="principles-heading" className="font-display text-2xl font-bold">Rocketry principles</h2>
          <div className="mt-4"><EngineeringCards records={e.performance()} /></div>
        </section>

        <section aria-labelledby="maneuvers-heading">
          <h2 id="maneuvers-heading" className="font-display text-2xl font-bold">Flight maneuvers</h2>
          <div className="mt-4"><EngineeringCards records={e.maneuvers()} /></div>
        </section>

        {reused.length > 0 && (
          <section aria-labelledby="reused-heading">
            <h2 id="reused-heading" className="font-display text-2xl font-bold">Also in the graph</h2>
            <p className="mt-1 text-sm text-muted">The engines, stages, subsystems, and systems these concepts build on — reused, not duplicated.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {reused.map((o) => (
                <li key={o.id}><Link href={entityGraphPath(o as never)} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{o.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="data-heading" className="scientific-card p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each entry is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the rocket engines, stages and propellants, the spacecraft subsystems and components, the docking and navigation systems, and the operations functions already in the graph. Only well-established engineering is stated; technologies not yet flown — nuclear-electric propulsion, VASIMR, aerocapture — are flagged as such, and nothing is fabricated. See{" "}<Link href="/transparency/source-quality" className="text-faint underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
