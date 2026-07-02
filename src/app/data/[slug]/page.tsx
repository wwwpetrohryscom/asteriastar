import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PortalSectionBody } from "@/components/data/PortalSections";
import { DATA_SECTIONS, DATA_SECTION_SLUGS, getDataSection } from "@/platform/open-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, dataPath } from "@/lib/routes";

export const dynamic = "force-static";

export function generateStaticParams() {
  return DATA_SECTION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const section = getDataSection(slug);
  if (!section) return buildMetadata({ title: "Data", description: "Asteria Star data portal.", path: ROUTES.data });
  return buildMetadata({ title: `${section.title} · Data`, description: section.description, path: dataPath(slug) });
}

export default async function DataSectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = getDataSection(slug);
  if (!section) notFound();

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Data Portal", url: ROUTES.data },
    { name: section.title, url: dataPath(slug) },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: section.title, description: section.description, url: dataPath(slug) }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection compact accent="halo" eyebrow={<span>{section.eyebrow}</span>} title={section.title} lead={section.description} />
      <Container className="mt-8 mb-12">
        <PortalSectionBody slug={slug} />
        <nav aria-label="Data portal" className="mt-14 border-t border-white/10 pt-6">
          <p className="text-xs uppercase tracking-wider text-faint">More in the data portal</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DATA_SECTIONS.filter((s) => s.slug !== slug).map((s) => (
              <a key={s.slug} href={dataPath(s.slug)} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-muted transition hover:border-white/25 hover:text-fg">
                {s.title}
              </a>
            ))}
          </div>
        </nav>
      </Container>
    </>
  );
}
