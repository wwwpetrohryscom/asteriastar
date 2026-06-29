import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { EntityCard } from "@/components/graph/EntityCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { LEARNING_PATHS, getLearningPath } from "@/lib/learn";
import { getEntityById } from "@/knowledge-graph";
import { accentVars } from "@/lib/theme";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, learnPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return LEARNING_PATHS.map((p) => ({ path: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/learn/[path]">): Promise<Metadata> {
  const { path } = await params;
  const lp = getLearningPath(path);
  if (!lp) return {};
  return buildMetadata({ title: lp.title, description: lp.description, path: learnPath(lp.slug) });
}

export default async function LearnPathPage({ params }: PageProps<"/learn/[path]">) {
  const { path } = await params;
  const lp = getLearningPath(path);
  if (!lp) notFound();

  const url = learnPath(lp.slug);
  const related = (lp.relatedEntityIds ?? []).map((id) => getEntityById(id)).filter(Boolean);
  const nextPaths = (lp.next ?? []).map((s) => getLearningPath(s)).filter(Boolean);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Learn", url: ROUTES.learn },
    { name: lp.title, url },
  ];

  return (
    <div style={accentVars(lp.accent)}>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: lp.title, description: lp.description, url }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent={lp.accent}
        eyebrow={<span>Learning path</span>}
        title={lp.title}
        lead={lp.description}
      />

      <Container className="mt-8 mb-12 space-y-10">
        {lp.stages.map((stage, si) => (
          <section key={stage.level} aria-label={stage.level}>
            <div className="flex items-center gap-3">
              <Badge tone="accent">{stage.level}</Badge>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <ol className="mt-4 space-y-3">
              {stage.steps.map((step, i) => (
                <li key={step.href}>
                  <Link
                    href={step.href}
                    className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/25 hover:bg-white/[0.04]"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs text-faint">
                      {si + 1}.{i + 1}
                    </span>
                    <span>
                      <span className="block font-medium text-fg group-hover:text-nebula">{step.title}</span>
                      <span className="mt-0.5 block text-sm text-muted">{step.blurb}</span>
                    </span>
                    <span aria-hidden className="ml-auto self-center text-faint transition group-hover:translate-x-0.5 group-hover:text-[var(--accent)]">→</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}

        {related.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-display text-xl font-semibold text-fg">
              Related entities
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((e) => (
                <li key={e!.id} className="contents">
                  <EntityCard entity={e!} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {nextPaths.length > 0 && (
          <section aria-labelledby="next-heading">
            <h2 id="next-heading" className="font-display text-xl font-semibold text-fg">
              Continue learning
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {nextPaths.map((np) => (
                <Link
                  key={np!.slug}
                  href={learnPath(np!.slug)}
                  className="rounded-xl border border-white/12 bg-white/[0.02] px-4 py-2.5 text-sm text-muted transition hover:border-white/25 hover:text-fg"
                >
                  {np!.title} →
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
