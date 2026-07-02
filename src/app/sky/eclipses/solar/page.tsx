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

const DESCRIPTION = "Solar eclipses — total, annular, partial, and hybrid — with the geometry behind each and essential eye-safety guidance. Specific dates and paths of totality are prepared for published NASA predictions; none are fabricated.";
export const metadata: Metadata = buildMetadata({ title: "Solar Eclipses — Types & Safety", description: DESCRIPTION, path: skyPath("eclipses/solar") });

export default function SolarEclipsesPage() {
  const s = engine.liveSky;
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Night Sky", url: ROUTES.sky }, { name: "Eclipses", url: skyPath("eclipses") }, { name: "Solar", url: skyPath("eclipses/solar") }];
  const provider = getProvider("eclipse-catalogue");
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), { "@context": "https://schema.org", "@type": "WebPage", name: "Solar Eclipses", description: DESCRIPTION, url: absoluteUrl(skyPath("eclipses/solar")) }]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Eclipses</span>} title="Solar Eclipses" lead={DESCRIPTION}>
        <div className="mt-4 flex flex-wrap items-center gap-2"><Badge tone="accent">Night Sky</Badge><DataStatusBadge status="reference" /></div>
      </HeroSection>
      <Container className="mt-8 mb-14 max-w-3xl space-y-8">
        <aside role="note" className="rounded-xl border border-rose-400/25 bg-rose-400/[0.06] p-4">
          <p className="text-sm font-semibold text-rose-200">Never look at the Sun without certified solar filters</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">Only during the brief total phase of a total solar eclipse is the Sun safe to view with the naked eye. At all other times — including partial and annular eclipses — proper solar filters are essential.</p>
        </aside>
        <SkySection id="types" title="Types of solar eclipse"><Types items={s.eclipses.solarTypes.map((t) => [t.name, t.description])} /></SkySection>
        <PreparedForIntegration providers={provider ? [provider] : []} envelope={s.eclipses.upcoming()[0]?.envelope} />
        <p className="text-sm text-muted"><Link href={skyPath("eclipses")} className="text-nebula hover:underline">← All eclipses</Link> · <Link href={skyPath("eclipses/lunar")} className="text-nebula hover:underline">Lunar eclipses →</Link></p>
        <SourceList keys={["nasa"]} title="Sources & references" />
      </Container>
    </>
  );
}
