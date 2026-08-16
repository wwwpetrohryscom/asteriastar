import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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

  // FAQs are authored per category and rendered visibly below. The structured
  // data mirrors exactly what the page shows — never SEO-only markup.
  const faqs: FaqItem[] = category.faqs.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

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
              <aside className="flex gap-3 rounded-xl border border-white/25 bg-white/[0.05] p-4">
                <span aria-hidden className="mt-0.5 text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Why there is no live readout here</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    This topic explains the underlying astronomy rather than
                    streaming a live feed. Asteria Star does not publish
                    simulated positions, times, or forecasts — when a value
                    depends on your location and the current moment, we explain
                    how it is calculated and point to the authoritative source
                    that computes it.
                  </p>
                </div>
              </aside>
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
              {category.keyPoints && category.keyPoints.length > 0 && (
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {category.keyPoints.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 scientific-card px-4 py-3 text-sm leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent,#c8d2e6)]"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {category.body.map((block) => (
              <section key={block.heading} aria-labelledby={headingId(block.heading)}>
                <h2
                  id={headingId(block.heading)}
                  className="font-display text-xl font-semibold text-fg"
                >
                  {block.heading}
                </h2>
                {block.paragraphs?.map((p) => (
                  <p key={p.slice(0, 48)} className="mt-3 leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
                {block.list && block.list.length > 0 && (
                  <ul className="mt-4 space-y-2.5">
                    {block.list.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span
                          aria-hidden
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent,#c8d2e6)]"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

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

            {category.explore && category.explore.length > 0 && (
              <section aria-labelledby="continue-heading">
                <h2
                  id="continue-heading"
                  className="font-display text-xl font-semibold text-fg"
                >
                  Continue in the data
                </h2>
                <p className="mt-2 text-sm text-faint">
                  Catalogues, hubs, and reference pages that hold the underlying
                  records for this topic.
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {category.explore.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block h-full scientific-card px-4 py-3 transition hover:border-white/30"
                      >
                        <span className="font-medium text-fg">{link.label}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted">
                          {link.blurb}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="faq-heading">
              <h2
                id="faq-heading"
                className="font-display text-xl font-semibold text-fg"
              >
                Frequently asked
              </h2>
              <dl className="mt-4 space-y-4">
                {category.faqs.map((faq) => (
                  <div key={faq.question} className="scientific-card p-4">
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

function headingId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
