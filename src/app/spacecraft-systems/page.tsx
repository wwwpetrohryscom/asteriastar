import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SysCards } from "@/components/spacecraft-systems/SysCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spacecraftSystemsDiscoveryPath } from "@/lib/routes";
import { SYS_DISCOVERIES } from "@/app/spacecraft-systems/discovery";

const DESCRIPTION =
  "An engineering encyclopedia of spacecraft — the subsystems and components that make a machine work in space: structure, thermal control, electrical power (solar arrays, batteries, RTGs), propulsion (chemical, ion, Hall-effect, nuclear), attitude control (reaction wheels, gyros), avionics and flight software, telecommunications, entry-descent-and-landing, and robotics. Reuses the platform's docking systems, life-support systems, antennas, and attitude sensors; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Spacecraft Systems & Engineering", description: DESCRIPTION, path: ROUTES.spacecraftSystems });

export default function SpacecraftSystemsHubPage() {
  const e = engine.spacecraftSystems;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Spacecraft Systems", url: ROUTES.spacecraftSystems },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Spacecraft Systems & Engineering", description: DESCRIPTION, url: ROUTES.spacecraftSystems })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="comet" eyebrow={<span>Encyclopedia · {e.subsystems().length} subsystems · {e.components().length} components</span>} title="Spacecraft Systems &amp; Engineering" lead="A spacecraft is a set of subsystems that must all work, together, for years, with no chance of repair. This encyclopedia maps the engineering of spacecraft — how they make power, change orbit, point themselves, stay warm, compute, and survive." />

      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore by system</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SYS_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={spacecraftSystemsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-comet hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="subsystems-heading">
          <h2 id="subsystems-heading" className="font-display text-2xl font-bold">The subsystems</h2>
          <div className="mt-4"><SysCards records={e.subsystems()} /></div>
        </section>

        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each subsystem and component is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the platform&apos;s docking systems, life-support systems (ECLSS), antennas, and attitude sensors. Curated from NASA, ESA, and engineering references. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-comet underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
