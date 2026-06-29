import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllSections } from "@/lib/content/registry";
import { TOPICS } from "@/lib/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, categoryPath, sectionPath, topicPath } from "@/lib/routes";

const DESCRIPTION =
  "A complete directory of Asteria Star — every knowledge hub and category, plus the knowledge-graph topics for exploring everything above Earth.";

export const metadata: Metadata = buildMetadata({
  title: "Topic Index",
  description: DESCRIPTION,
  path: ROUTES.topicIndex,
});

export default function TopicIndexPage() {
  const sections = getAllSections();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Explore", url: ROUTES.explore },
    { name: "Topic Index", url: ROUTES.topicIndex },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Topic Index", description: DESCRIPTION, url: ROUTES.topicIndex }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="stone"
        eyebrow={<span>Directory</span>}
        title="Topic index"
        lead="Every hub, category, and knowledge-graph topic on Asteria Star, in one place."
      />

      <Container className="mt-10 mb-12 space-y-12">
        <section aria-labelledby="hubs-heading">
          <h2 id="hubs-heading" className="font-display text-2xl font-bold">Knowledge hubs</h2>
          <div className="mt-5 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <div key={section.slug}>
                <h3 className="font-display text-sm font-semibold text-fg">
                  <Link href={sectionPath(section)} className="transition hover:text-nebula">
                    {section.name}
                  </Link>
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {section.categories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={categoryPath(section, category)}
                        className="text-sm text-muted transition hover:text-fg"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="topics-heading">
          <h2 id="topics-heading" className="font-display text-2xl font-bold">Knowledge-graph topics</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={topicPath(topic.slug)}
                  className="inline-block rounded-full border border-white/12 bg-white/[0.02] px-3.5 py-1.5 text-sm text-muted transition hover:border-white/25 hover:text-fg"
                >
                  {topic.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
