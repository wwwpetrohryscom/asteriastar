import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfraDetail } from "@/components/space-infrastructure/InfraDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { spaceInfrastructurePath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.spaceInfrastructure.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/space-infrastructure/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.spaceInfrastructure.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: spaceInfrastructurePath(slug) });
}

export default async function SpaceInfrastructurePage({ params }: PageProps<"/space-infrastructure/[slug]">) {
  const { slug } = await params;
  const d = engine.spaceInfrastructure.resolveEntry(slug);
  if (!d) notFound();
  return <InfraDetail d={d} />;
}
