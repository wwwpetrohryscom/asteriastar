import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConceptDetail } from "@/components/future-exploration/ConceptDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { futureExplorationPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.futureMissions.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/future-exploration/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.futureMissions.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: futureExplorationPath(slug) });
}

export default async function FutureExplorationPage({ params }: PageProps<"/future-exploration/[slug]">) {
  const { slug } = await params;
  const d = engine.futureMissions.resolveEntry(slug);
  if (!d) notFound();
  return <ConceptDetail d={d} />;
}
