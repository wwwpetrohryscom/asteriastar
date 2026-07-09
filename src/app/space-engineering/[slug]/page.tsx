import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EngineeringDetail } from "@/components/space-engineering/EngineeringDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { spaceEngineeringPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.spaceEngineering.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/space-engineering/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.spaceEngineering.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: spaceEngineeringPath(slug) });
}

export default async function SpaceEngineeringEntryPage({ params }: PageProps<"/space-engineering/[slug]">) {
  const { slug } = await params;
  const d = engine.spaceEngineering.resolveEntry(slug);
  if (!d) notFound();
  return <EngineeringDetail d={d} />;
}
