import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { StarTable } from "@/components/stars/StarTable";
import { engine } from "@/platform/data-engine";
import { STAR_CATEGORY_LABELS, type StarCategory } from "@/knowledge-graph/data/star-catalog/types";
import { CATEGORY_INFO } from "@/lib/star-content";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, starCategoryPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return engine.star.categories().map((c) => ({ slug: c.category }));
}

export async function generateMetadata({ params }: PageProps<"/stars/type/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const label = STAR_CATEGORY_LABELS[slug as StarCategory];
  if (!label) return {};
  const n = engine.star.byCategory(slug as StarCategory).length;
  return buildMetadata({
    title: `${label}s`,
    description: `${n} catalogued ${label.toLowerCase()}s. ${CATEGORY_INFO[slug as StarCategory] ?? ""}`.trim(),
    path: starCategoryPath(slug),
  });
}

export default async function StarTypePage({ params }: PageProps<"/stars/type/[slug]">) {
  const { slug } = await params;
  const category = slug as StarCategory;
  const label = STAR_CATEGORY_LABELS[category];
  if (!label) notFound();
  const stars = engine.star.byCategory(category);
  if (stars.length === 0) notFound();
  const info = CATEGORY_INFO[category];
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Stars", url: ROUTES.stars },
    { name: `${label}s`, url: starCategoryPath(slug) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: `${label}s`, description: info ?? `Catalogued ${label.toLowerCase()}s.`, url: starCategoryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Stellar type</span>} title={`${label}s`} lead={info} />
      <Container className="mt-8 mb-14">
        <p className="mb-4 text-sm text-faint">{stars.length} catalogued {label.toLowerCase()}s, brightest first.</p>
        <StarTable stars={stars.slice(0, 250)} />
      </Container>
    </>
  );
}
