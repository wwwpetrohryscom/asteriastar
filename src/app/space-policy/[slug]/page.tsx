import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpDetail } from "@/components/space-policy/SpDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { spacePolicyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.spacePolicy.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/space-policy/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.spacePolicy.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: spacePolicyPath(slug) });
}

export default async function SpacePolicyPage({ params }: PageProps<"/space-policy/[slug]">) {
  const { slug } = await params;
  const d = engine.spacePolicy.resolveEntry(slug);
  if (!d) notFound();
  return <SpDetail d={d} />;
}
