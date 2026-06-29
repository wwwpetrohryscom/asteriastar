import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DisclaimerBox } from "@/components/ui/DisclaimerBox";
import { SourceList } from "@/components/ui/SourceList";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { SectionGrid } from "@/components/sections/SectionGrid";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getAllCategoryParams,
  getCategory,
  getSiblingCategories,
} from "@/lib/content/registry";
import { getEntriesByCategory } from "@/content/entries";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbSchema,
  collectionPageSchema,
  faqPageSchema,
  type Crumb,
  type FaqItem,
} from "@/lib/seo/jsonld";
import { categoryPath, sectionPath } from "@/lib/routes";
import { ASTROLOGY_DISCLAIMER } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCategoryParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/[section]/[category]">): Promise<Metadata> {
  const { section: sectionSlug, category: categorySlug } = await params;
  const found = getCategory(sectionSlug, categorySlug);
  if (!found) return {};
  const { section, category } = found;
  return buildMetadata({
    title: category.name,
    description: category.summary,
    path: categoryPath(section, category),
    ogType: "article",
    keywords: category.keywords,
  });
}

export default async function CategoryPage({
  params,
}: PageProps<"/[section]/[category]">) {
  const { section: sectionSlug, category: categorySlug } = await params;
  const found = getCategory(sectionSlug, categorySlug);
  if (!found) notFound();
  const { section, category } = found;

  const interpretive = section.kind === "interpretive" || Boolean(category.interpretive);
  const disclaimerMessage = category.disclaimer ?? ASTROLOGY_DISCLAIMER;
  const url = categoryPath(section, category);

  const entries = getEntriesByCategory(section.slug, category.slug);
  const hasEntries = entries.length > 0;
  const entryItems = entries.map((entry) => ({
    title: entry.title,
    description: entry.excerpt,
    href: entry.path,
    accent: section.accent,
  }));

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: section.name, url: sectionPath(section) },
    { name: category.name, url },
  ];

  // Honest, content-matched FAQs (rendered visibly below + as FAQPage JSON-LD).
  const faqs: FaqItem[] = [
    { question: `What is ${category.name}?`, answer: category.overview },
  ];
  if (interpretive) {
    faqs.push({
      question: `Is ${category.name} scientifically proven?`,
      answer: disclaimerMessage,
    });
  } else if (section.kind === "science") {
    faqs.push({
      question: `Is ${category.name} astronomy or astrology?`,
      answer: `${category.name} is part of astronomy — the evidence-based, scientific study of the universe. On Asteria Star, astronomy is kept clearly separate from astrology.`,
    });
  } else {
    faqs.push({
      question: `What will I find under ${category.name}?`,
      answer: `We are building this topic on a foundation page. Planned material includes: ${category.plannedTopics.join(", ")}.`,
    });
  }

  const siblings = getSiblingCategories(section, category).map((sib) => ({
    title: sib.name,
    description: sib.summary,
    href: categoryPath(section, sib),
    accent: section.accent,
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({
            name: category.name,
            description: category.summary,
            url,
          }),
          faqPageSchema(faqs),
        ]}
      />

      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <HeroSection
        compact
        accent={section.accent}
        eyebrow={<span>{section.name}</span>}
        title={category.name}
        lead={category.summary}
      />

      <Container className="mt-6">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {interpretive && <DisclaimerBox message={category.disclaimer} />}

            {category.dataModule && (
              <aside className="flex gap-3 rounded-xl border border-halo/25 bg-halo/[0.05] p-4">
                <span aria-hidden className="mt-0.5 text-halo">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-halo">Live data module</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    Prepared for official integration. Live data will appear here —
                    we never fake live feeds or invent data. Explore the related
                    structured knowledge below in the meantime.
                  </p>
                </div>
              </aside>
            )}

            {hasEntries && (
              <section aria-labelledby="entries-heading">
                <div className="flex items-center gap-3">
                  <h2
                    id="entries-heading"
                    className="font-display text-xl font-semibold text-fg"
                  >
                    Explore {category.name}
                  </h2>
                  <Badge tone="accent">{entries.length} entries</Badge>
                </div>
                <p className="mt-2 text-sm text-faint">
                  In-depth, individual pages in this category.
                </p>
                <SectionGrid items={entryItems} columns={2} className="mt-4" />
              </section>
            )}

            <section aria-labelledby="overview-heading">
              <h2
                id="overview-heading"
                className="font-display text-xl font-semibold text-fg"
              >
                Overview
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-muted">
                {category.overview}
              </p>
            </section>

            <section aria-labelledby="planned-heading">
              <div className="flex items-center gap-3">
                <h2
                  id="planned-heading"
                  className="font-display text-xl font-semibold text-fg"
                >
                  {hasEntries ? "Also planned" : "What this topic will cover"}
                </h2>
                <Badge tone="tradition">In progress</Badge>
              </div>
              <p className="mt-2 text-sm text-faint">
                {hasEntries
                  ? "We continue to expand this category. Upcoming material includes:"
                  : "This is a foundation page. We are expanding it with structured, " +
                    (section.kind === "science" || section.kind === "reference"
                      ? "sourced"
                      : "carefully labeled") +
                    " content. Planned material includes:"}
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {category.plannedTopics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted"
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent,#a78bfa)]"
                    />
                    {topic}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="faq-heading">
              <h2
                id="faq-heading"
                className="font-display text-xl font-semibold text-fg"
              >
                Frequently asked
              </h2>
              <dl className="mt-4 space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <dt className="font-medium text-fg">{faq.question}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <aside className="space-y-8">
            {category.sources && category.sources.length > 0 && (
              <SourceList keys={category.sources} />
            )}
          </aside>
        </div>

        <div className="mt-16">
          <RelatedLinks
            title={`More in ${section.name}`}
            items={siblings}
            columns={4}
          />
        </div>
      </Container>
    </>
  );
}
