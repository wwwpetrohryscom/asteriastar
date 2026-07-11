import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { ImageSection } from "@/components/images/ImageUI";
import { ASTRO_GUIDES, getAstroGuide } from "@/app/images/astrophotography";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, astrophotographyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return ASTRO_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/images/astrophotography/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = getAstroGuide(slug);
  if (!g) return {};
  return buildMetadata({ title: `${g.title} — Astrophotography Guide`, description: g.summary, path: astrophotographyPath(slug) });
}

export default async function AstroGuidePage({ params }: PageProps<"/images/astrophotography/[slug]">) {
  const { slug } = await params;
  const guide = getAstroGuide(slug);
  if (!guide) notFound();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" }, { name: "Image Archive", url: ROUTES.images },
    { name: "Astrophotography", url: "/images/astrophotography" }, { name: guide.title, url: astrophotographyPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), { "@context": "https://schema.org", "@type": "HowTo", name: guide.title, description: guide.summary }]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Astrophotography Guide</span>} title={guide.title} lead={guide.summary}>
        <div className="mt-4"><Badge tone="accent">Image Archive</Badge></div>
      </HeroSection>
      <Container className="mt-8 mb-14 max-w-3xl space-y-8">
        {guide.sections.map((s) => (
          <ImageSection key={s.heading} id={s.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")} title={s.heading}>
            <p className="leading-relaxed text-muted">{s.body}</p>
          </ImageSection>
        ))}
        <p className="text-sm text-muted">More guides: {ASTRO_GUIDES.filter((x) => x.slug !== slug).map((x, i) => (<span key={x.slug}>{i > 0 ? " · " : ""}<Link href={astrophotographyPath(x.slug)} className="text-nasa hover:underline">{x.title}</Link></span>))}</p>
      </Container>
    </>
  );
}
