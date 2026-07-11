import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { DataStatusBadge, PreparedForIntegration, SkySection } from "@/components/sky/SkyUI";
import { Types } from "@/app/sky/eclipses/page";
import { engine } from "@/platform/data-engine";
import { getProvider } from "@/platform/live-sky";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, skyPath } from "@/lib/routes";

const DESCRIPTION = "Geomagnetic storms — disturbances of Earth's magnetic field driven by the Sun — and the NOAA G1–G5 scale, plus the Kp index behind aurora forecasts. Current storm status is prepared for NOAA SWPC; none is fabricated.";
export const metadata: Metadata = buildMetadata({ title: "Geomagnetic Storms — The G-scale", description: DESCRIPTION, path: skyPath("space-weather/geomagnetic-storms") });

export default function GeomagneticStormsPage() {
  const s = engine.liveSky;
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Night Sky", url: ROUTES.sky }, { name: "Space Weather", url: skyPath("space-weather") }, { name: "Geomagnetic Storms", url: skyPath("space-weather/geomagnetic-storms") }];
  const provider = getProvider("noaa-swpc");
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), { "@context": "https://schema.org", "@type": "WebPage", name: "Geomagnetic Storms", description: DESCRIPTION, url: absoluteUrl(skyPath("space-weather/geomagnetic-storms")) }]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Space Weather</span>} title="Geomagnetic Storms" lead={DESCRIPTION}>
        <div className="mt-4 flex flex-wrap items-center gap-2"><Badge tone="accent">Night Sky</Badge><DataStatusBadge status="reference" /></div>
      </HeroSection>
      <Container className="mt-8 mb-14 max-w-3xl space-y-8">
        <SkySection id="what" title="What a geomagnetic storm is"><p className="leading-relaxed text-muted">A geomagnetic storm is a temporary disturbance of Earth&apos;s magnetosphere caused by the solar wind — especially by coronal mass ejections. Storms drive the aurora to lower latitudes and, when strong, can affect power grids, satellites, and navigation.</p></SkySection>
        <SkySection id="scale" title="The G1–G5 storm scale"><Types items={s.spaceWeather.geomagneticScale.map((g) => [g.gScale, g.meaning])} /></SkySection>
        <PreparedForIntegration providers={provider ? [provider] : []} envelope={s.spaceWeather.geomagneticStorms()[0]?.envelope} />
        <p className="text-sm text-muted"><Link href={skyPath("space-weather")} className="text-nasa hover:underline">← Space weather</Link> · <Link href={skyPath("aurora")} className="text-nasa hover:underline">Aurora →</Link></p>
        <SourceList keys={["swpc"]} title="Sources & references" />
      </Container>
    </>
  );
}
