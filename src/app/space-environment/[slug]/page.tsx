import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnvDetail } from "@/components/space-environment/EnvDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { spaceEnvironmentPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.spaceEnvironment.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/space-environment/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.spaceEnvironment.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: spaceEnvironmentPath(slug) });
}

export default async function SpaceEnvironmentPage({ params }: PageProps<"/space-environment/[slug]">) {
  const { slug } = await params;
  const d = engine.spaceEnvironment.resolveEntry(slug);
  if (!d) notFound();
  return <EnvDetail d={d} />;
}
