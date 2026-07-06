import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DseDetail } from "@/components/deep-space-exploration/DseDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { deepSpaceExplorationPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.deepSpaceExploration.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/deep-space-exploration/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.deepSpaceExploration.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: deepSpaceExplorationPath(slug) });
}

export default async function DeepSpaceExplorationPage({ params }: PageProps<"/deep-space-exploration/[slug]">) {
  const { slug } = await params;
  const d = engine.deepSpaceExploration.resolveEntry(slug);
  if (!d) notFound();
  return <DseDetail d={d} />;
}
