import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfraDetail } from "@/components/deep-space-comms/InfraDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { dsnAntennaPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.deepSpaceCommunications.antennas().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/deep-space-network/antenna/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.deepSpaceCommunications.resolveAntenna(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: dsnAntennaPath(slug) });
}

export default async function AntennaPage({ params }: PageProps<"/deep-space-network/antenna/[slug]">) {
  const { slug } = await params;
  const d = engine.deepSpaceCommunications.resolveAntenna(slug);
  if (!d) notFound();
  return <InfraDetail d={d} />;
}
