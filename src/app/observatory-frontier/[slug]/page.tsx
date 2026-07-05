import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OfDetail } from "@/components/observatory-frontier/OfDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { observatoryFrontierPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.observatoryFrontier.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/observatory-frontier/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.observatoryFrontier.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: observatoryFrontierPath(slug) });
}

export default async function ObservatoryFrontierPage({ params }: PageProps<"/observatory-frontier/[slug]">) {
  const { slug } = await params;
  const d = engine.observatoryFrontier.resolveEntry(slug);
  if (!d) notFound();
  return <OfDetail d={d} />;
}
