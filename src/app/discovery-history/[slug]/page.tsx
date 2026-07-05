import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DhDetail } from "@/components/discovery-history/DhDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { discoveryHistoryPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.discoveryHistory.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/discovery-history/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.discoveryHistory.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: discoveryHistoryPath(slug) });
}

export default async function DiscoveryHistoryPage({ params }: PageProps<"/discovery-history/[slug]">) {
  const { slug } = await params;
  const d = engine.discoveryHistory.resolveEntry(slug);
  if (!d) notFound();
  return <DhDetail d={d} />;
}
