import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { DataStatusBadge } from "@/components/sky/SkyUI";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, skyPath, meteorShowerPath } from "@/lib/routes";

const s = engine.liveSky;
const DESCRIPTION = "A guide to the eight major annual meteor showers — the Perseids, Geminids, Quadrantids and more — with source-backed activity windows, peak nights, and rates from the IMO. Annual definitions, not a live meteor count.";

export const metadata: Metadata = buildMetadata({ title: "Meteor Shower Guide", description: DESCRIPTION, path: skyPath("meteor-showers") });

export default function MeteorShowersHub() {
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Night Sky", url: ROUTES.sky }, { name: "Meteor Showers", url: skyPath("meteor-showers") }];
  const showers = s.meteorShowers();
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Meteor Shower Guide", description: DESCRIPTION, url: skyPath("meteor-showers") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>Night Sky Platform</span>} title="Meteor Shower Guide" lead={DESCRIPTION}>
        <div className="mt-4 flex flex-wrap items-center gap-2"><Badge tone="accent">Night Sky</Badge><DataStatusBadge status="reference" /></div>
      </HeroSection>
      <Container className="mt-8 mb-14 space-y-8">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {showers.map((sh) => (
            <li key={sh.slug}>
              <Link href={meteorShowerPath(sh.slug)} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nebula">{sh.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-faint">Peak {sh.peakLabel}</p>
                <p className="mt-2 text-sm text-muted">Active {sh.activeWindow}. ZHR ≈ {sh.zhr}, {sh.velocityKmS} km/s. Best from the {sh.bestHemisphere === "Both" ? "both hemispheres" : `${sh.bestHemisphere} Hemisphere`}.</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-xs text-faint">Zenithal hourly rates (ZHR) are ideal-condition maxima under a dark sky with the radiant overhead; real observed rates are usually lower. Peak nights are annual and shift a day or two year to year.</p>
        <SourceList keys={["imo"]} title="Sources & references" />
      </Container>
    </>
  );
}
