import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { DataStatusBadge, PreparedForIntegration, EnvelopeCard, RefCards, SkySection } from "@/components/sky/SkyUI";
import { Types } from "@/app/sky/eclipses/page";
import { engine } from "@/platform/data-engine";
import { getProvider } from "@/platform/live-sky";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, skyPath } from "@/lib/routes";

const s = engine.liveSky;
const DESCRIPTION = "Space weather — solar flares and geomagnetic storms — explained with the standard NOAA scales. Live activity is prepared for NASA DONKI and NOAA SWPC; no current alerts are fabricated.";
export const metadata: Metadata = buildMetadata({ title: "Space Weather — Guide & Data Architecture", description: DESCRIPTION, path: skyPath("space-weather") });

export default function SpaceWeatherPage() {
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Night Sky", url: ROUTES.sky }, { name: "Space Weather", url: skyPath("space-weather") }];
  const sw = s.spaceWeather;
  const related = s.refs(sw.linkedEntityIds);
  const providers = [getProvider("nasa-donki"), getProvider("noaa-swpc")].filter((p): p is NonNullable<typeof p> => Boolean(p));
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Space Weather", description: DESCRIPTION, url: skyPath("space-weather") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Night Sky Platform</span>} title="Space Weather" lead={DESCRIPTION}>
        <div className="mt-4 flex flex-wrap items-center gap-2"><Badge tone="accent">Night Sky</Badge><DataStatusBadge status="reference" /></div>
      </HeroSection>
      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            <SkySection id="flares" title="Solar flare classes">
              <p className="mb-3 text-sm text-muted">Flares are ranked A–B–C–M–X by X-ray brightness, each class ten times stronger than the last. <Link href={skyPath("space-weather/solar-flares")} className="text-nasa hover:underline">Solar flares in detail →</Link></p>
              <Types items={sw.flareClasses.map((f) => [`Class ${f.flareClass}`, f.meaning])} />
            </SkySection>
            <SkySection id="storms" title="Geomagnetic storm scale">
              <p className="mb-3 text-sm text-muted">NOAA ranks geomagnetic storms G1–G5. <Link href={skyPath("space-weather/geomagnetic-storms")} className="text-nasa hover:underline">Geomagnetic storms in detail →</Link></p>
              <Types items={sw.geomagneticScale.map((g) => [g.gScale, g.meaning])} />
            </SkySection>
            <PreparedForIntegration providers={providers} envelope={sw.recentFlares()[0]?.envelope} />
            {related.length > 0 && <SkySection id="graph" title="Related in the Knowledge Graph"><RefCards refs={related} /></SkySection>}
            <SourceList keys={["swpc", "donki"]} title="Sources & references" />
          </div>
          <aside className="space-y-6">
            <EnvelopeCard envelope={sw.scalesEnvelope} />
            <section className="scientific-card p-5">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Related</h2>
              <p className="mt-2 text-sm text-muted"><Link href={skyPath("aurora")} className="text-nasa hover:underline">Aurora forecast →</Link></p>
            </section>
          </aside>
        </div>
      </Container>
    </>
  );
}
