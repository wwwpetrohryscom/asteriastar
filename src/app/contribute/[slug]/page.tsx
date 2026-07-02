import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContributeSectionBody } from "@/components/contribute/ContributeSections";
import { breadcrumbSchema, webPageSchema, howToSchema, type Crumb } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTES, contributePath } from "@/lib/routes";
import { CONTRIBUTE_SLUGS, ALL_CONTRIBUTE_SECTIONS, getContributeSection } from "@/platform/contributions";

export const dynamic = "force-static";

export function generateStaticParams() {
  return CONTRIBUTE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const section = getContributeSection(slug);
  if (!section) return buildMetadata({ title: "Contribute", description: "Contribute to Asteria Star.", path: ROUTES.contribute });
  return buildMetadata({ title: `${section.title} · Contribute`, description: section.description, path: contributePath(slug) });
}

export default async function ContributeSectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = getContributeSection(slug);
  if (!section) notFound();

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Contribute", url: ROUTES.contribute },
    { name: section.title, url: contributePath(slug) },
  ];

  const jsonld: Record<string, unknown>[] = [
    breadcrumbSchema(crumbs),
    webPageSchema({ name: section.title, description: section.description, url: contributePath(slug) }),
  ];
  if (slug === "how-it-works") {
    jsonld.push(howToSchema({
      name: "How a contribution is reviewed",
      description: section.description,
      url: contributePath(slug),
      steps: [
        { name: "Propose", text: "Draft a structured, sourced proposal attached to a real object." },
        { name: "Validate", text: "Automated checks confirm targets resolve and domains are honest." },
        { name: "Editorial review", text: "An editor checks scope and routes the proposal." },
        { name: "Scientific review", text: "A domain expert verifies factual accuracy and evidence." },
        { name: "Decision", text: "Accepted, rejected, or returned — with a recorded reason." },
        { name: "Versioned update", text: "Only accepted proposals become versioned graph updates." },
      ],
    }));
  }

  return (
    <>
      <JsonLd data={jsonld} />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection compact accent="comet" eyebrow={<span>{section.eyebrow}</span>} title={section.title} lead={section.description} />
      <Container className="mt-8 mb-12">
        <ContributeSectionBody slug={slug} />
        <nav aria-label="Contribute" className="mt-14 border-t border-white/10 pt-6">
          <p className="text-xs uppercase tracking-wider text-faint">More in the contribution portal</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ALL_CONTRIBUTE_SECTIONS.filter((s) => s.slug !== slug).map((s) => (
              <a key={s.slug} href={contributePath(s.slug)} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-muted transition hover:border-white/25 hover:text-fg">{s.title}</a>
            ))}
          </div>
        </nav>
      </Container>
    </>
  );
}
