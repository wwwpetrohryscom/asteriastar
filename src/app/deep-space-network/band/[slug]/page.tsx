import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfraDetail } from "@/components/deep-space-comms/InfraDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { dsnBandPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.deepSpaceCommunications.signalBands().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/deep-space-network/band/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.deepSpaceCommunications.resolveSignalBand(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: dsnBandPath(slug) });
}

export default async function BandPage({ params }: PageProps<"/deep-space-network/band/[slug]">) {
  const { slug } = await params;
  const d = engine.deepSpaceCommunications.resolveSignalBand(slug);
  if (!d) notFound();
  return <InfraDetail d={d} />;
}
