import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { ASTRO_GUIDES } from "@/app/images/astrophotography";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, astrophotographyPath } from "@/lib/routes";

const DESCRIPTION = "Guides to amateur and professional astrophotography — equipment, processing, and planning. Kept clearly separate from the institutional scientific imagery in the archive.";
export const metadata: Metadata = buildMetadata({ title: "Astrophotography Guides", description: DESCRIPTION, path: "/images/astrophotography" });

export default function AstrophotographyHub() {
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Image Archive", url: ROUTES.images }, { name: "Astrophotography", url: "/images/astrophotography" }];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Astrophotography Guides", description: DESCRIPTION, url: "/images/astrophotography" })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Astrophotography</span>} title="Astrophotography Guides" lead={DESCRIPTION}>
        <div className="mt-4"><Badge tone="accent">Image Archive</Badge></div>
      </HeroSection>
      <Container className="mt-8 mb-14 space-y-8">
        <aside role="note" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-sm font-semibold text-fg">Separate from institutional imagery</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">These guides are for making your own images. Amateur and community photographs are distinct from the institutional, peer-verified imagery in the archive; a community-submission system with per-image provenance and credit is prepared for the future. No amateur photographs or credits are fabricated here.</p>
        </aside>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ASTRO_GUIDES.map((g) => (
            <li key={g.slug}>
              <Link href={astrophotographyPath(g.slug)} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25">
                <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nebula">{g.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{g.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
