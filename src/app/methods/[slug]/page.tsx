import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MethodDetail } from "@/components/methods/MethodDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { methodPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.astronomyMethods.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/methods/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.astronomyMethods.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: methodPath(slug) });
}

export default async function MethodPage({ params }: PageProps<"/methods/[slug]">) {
  const { slug } = await params;
  const d = engine.astronomyMethods.resolveEntry(slug);
  if (!d) notFound();
  return <MethodDetail d={d} />;
}
