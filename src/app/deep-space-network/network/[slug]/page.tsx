import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NetworkDetail } from "@/components/deep-space-comms/NetworkDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.deepSpaceCommunications.networks().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/deep-space-network/network/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.deepSpaceCommunications.resolveNetwork(slug);
  if (!d) return {};
  // Reused networks stay canonical at their existing page; new networks are canonical here.
  return buildMetadata({ title: d.record.name, description: d.record.description, path: d.canonicalHref });
}

export default async function NetworkPage({ params }: PageProps<"/deep-space-network/network/[slug]">) {
  const { slug } = await params;
  const d = engine.deepSpaceCommunications.resolveNetwork(slug);
  if (!d) notFound();
  return <NetworkDetail d={d} />;
}
