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

const DESCRIPTION = "Lunar eclipses — total, partial, and penumbral — with the geometry behind each. Completely safe to watch with the naked eye. Specific dates are prepared for published NASA predictions; none are fabricated.";
export const metadata: Metadata = buildMetadata({ title: "Lunar Eclipses — Types & Viewing", description: DESCRIPTION, path: skyPath("eclipses/lunar") });

export default function LunarEclipsesPage() {
  const s = engine.liveSky;
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Night Sky", url: ROUTES.sky }, { name: "Eclipses", url: skyPath("eclipses") }, { name: "Lunar", url: skyPath("eclipses/lunar") }];
  const provider = getProvider("eclipse-catalogue");
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), { "@context": "https://schema.org", "@type": "WebPage", name: "Lunar Eclipses", description: DESCRIPTION, url: absoluteUrl(skyPath("eclipses/lunar")) }]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Eclipses</span>} title="Lunar Eclipses" lead={DESCRIPTION}>
        <div className="mt-4 flex flex-wrap items-center gap-2"><Badge tone="accent">Night Sky</Badge><DataStatusBadge status="reference" /></div>
      </HeroSection>
      <Container className="mt-8 mb-14 max-w-3xl space-y-8">
        <SkySection id="types" title="Types of lunar eclipse"><Types items={s.eclipses.lunarTypes.map((t) => [t.name, t.description])} /></SkySection>
        <PreparedForIntegration providers={provider ? [provider] : []} envelope={s.eclipses.upcoming()[0]?.envelope} />
        <p className="text-sm text-muted"><Link href={skyPath("eclipses")} className="text-nebula hover:underline">← All eclipses</Link> · <Link href={skyPath("eclipses/solar")} className="text-nebula hover:underline">Solar eclipses →</Link></p>
        <SourceList keys={["nasa"]} title="Sources & references" />
      </Container>
    </>
  );
}
