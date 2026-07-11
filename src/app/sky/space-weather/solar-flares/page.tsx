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

const DESCRIPTION = "Solar flares — sudden bursts of radiation from the Sun — and the A–X classification that ranks them. Recent flare activity is prepared for NASA DONKI and NOAA SWPC; none is fabricated.";
export const metadata: Metadata = buildMetadata({ title: "Solar Flares — Classification & Data", description: DESCRIPTION, path: skyPath("space-weather/solar-flares") });

export default function SolarFlaresPage() {
  const s = engine.liveSky;
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Night Sky", url: ROUTES.sky }, { name: "Space Weather", url: skyPath("space-weather") }, { name: "Solar Flares", url: skyPath("space-weather/solar-flares") }];
  const providers = [getProvider("nasa-donki"), getProvider("noaa-swpc")].filter((p): p is NonNullable<typeof p> => Boolean(p));
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), { "@context": "https://schema.org", "@type": "WebPage", name: "Solar Flares", description: DESCRIPTION, url: absoluteUrl(skyPath("space-weather/solar-flares")) }]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Space Weather</span>} title="Solar Flares" lead={DESCRIPTION}>
        <div className="mt-4 flex flex-wrap items-center gap-2"><Badge tone="accent">Night Sky</Badge><DataStatusBadge status="reference" /></div>
      </HeroSection>
      <Container className="mt-8 mb-14 max-w-3xl space-y-8">
        <SkySection id="what" title="What a solar flare is"><p className="leading-relaxed text-muted">A solar flare is a sudden, intense burst of electromagnetic radiation from the Sun&apos;s atmosphere, often near sunspots. The strongest can disturb radio communications and, with an accompanying coronal mass ejection, trigger geomagnetic storms and aurorae at Earth.</p></SkySection>
        <SkySection id="classes" title="The flare classification (A–X)"><Types items={s.spaceWeather.flareClasses.map((f) => [`Class ${f.flareClass}`, f.meaning])} /></SkySection>
        <PreparedForIntegration providers={providers} envelope={s.spaceWeather.recentFlares()[0]?.envelope} />
        <p className="text-sm text-muted"><Link href={skyPath("space-weather")} className="text-nasa hover:underline">← Space weather</Link> · <Link href={skyPath("space-weather/geomagnetic-storms")} className="text-nasa hover:underline">Geomagnetic storms →</Link></p>
        <SourceList keys={["donki", "swpc"]} title="Sources & references" />
      </Container>
    </>
  );
}
