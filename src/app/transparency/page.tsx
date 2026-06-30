import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TRANSPARENCY_PAGES } from "@/app/transparency/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, transparencyPath } from "@/lib/routes";

const DESCRIPTION =
  "How Asteria Star works — methodology, editorial standards, the evidence framework, review process, source quality, versioning, provenance, scope, and a live transparency report.";

export const metadata: Metadata = buildMetadata({ title: "Transparency", description: DESCRIPTION, path: ROUTES.transparency });

export default function TransparencyPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Transparency", url: ROUTES.transparency },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Transparency", description: DESCRIPTION, url: ROUTES.transparency })]} />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        accent="halo"
        eyebrow={<span>Transparency</span>}
        title="How this platform works"
        lead="Trust is built on transparency, not assertion. These pages explain exactly how Asteria Star sources, structures, reviews, versions, and presents knowledge — and where its honest gaps are."
      />
      <Container className="mt-10 mb-14">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRANSPARENCY_PAGES.map((p) => (
            <li key={p.slug}>
              <Link href={transparencyPath(p.slug)} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                <h2 className="font-display text-lg font-semibold text-fg group-hover:text-nebula">{p.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-sm text-muted">
            See the live{" "}
            <Link href={ROUTES.authority} className="text-nebula underline-offset-4 hover:underline">authority dashboard</Link>{" "}
            for coverage and quality numbers across the whole graph.
          </p>
        </div>
      </Container>
    </>
  );
}
