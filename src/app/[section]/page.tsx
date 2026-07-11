import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionGrid } from "@/components/sections/SectionGrid";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DisclaimerBox } from "@/components/ui/DisclaimerBox";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { ObservatoryHub } from "@/components/sections/ObservatoryHub";
import { RelatedImages } from "@/components/media/RelatedImages";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllSections, getOtherSections, getSection } from "@/lib/content/registry";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbSchema,
  collectionPageSchema,
  type Crumb,
} from "@/lib/seo/jsonld";
import { categoryPath, sectionPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSections().map((section) => ({ section: section.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[section]">): Promise<Metadata> {
  const { section: slug } = await params;
  const section = getSection(slug);
  if (!section) return {};
  return buildMetadata({
    title: section.name,
    description: section.description,
    path: sectionPath(section),
  });
}

export default async function SectionPage({ params }: PageProps<"/[section]">) {
  const { section: slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: section.name, url: sectionPath(section) },
  ];

  const categoryCards = section.categories.map((category) => ({
    title: category.name,
    description: category.summary,
    href: categoryPath(section, category),
    accent: section.accent,
  }));

  const otherHubs = getOtherSections(section.slug).map((other) => ({
    title: other.name,
    description: other.tagline,
    href: sectionPath(other),
    accent: other.accent,
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({
            name: section.name,
            description: section.description,
            url: sectionPath(section),
          }),
        ]}
      />

      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <HeroSection
        compact
        accent={section.accent}
        eyebrow={<span>{section.tagline}</span>}
        title={section.name}
        lead={section.intro}
      />

      {section.slug === "observatory" ? (
        <ObservatoryHub />
      ) : (
        <Container className="mt-8 space-y-12">
          {section.kind === "interpretive" && <DisclaimerBox />}

          {section.slug === "astrology" && (
            <RelatedImages
              heading="The zodiac constellations"
              max={12}
              entityIds={[
                "constellation:aries", "constellation:taurus", "constellation:gemini", "constellation:cancer",
                "constellation:leo", "constellation:virgo", "constellation:libra", "constellation:scorpius",
                "constellation:sagittarius", "constellation:capricornus", "constellation:aquarius", "constellation:pisces",
              ]}
            />
          )}

          <SectionGrid items={categoryCards} columns={3} />

          <RelatedLinks title="Explore other hubs" items={otherHubs} columns={3} />
        </Container>
      )}
    </>
  );
}
