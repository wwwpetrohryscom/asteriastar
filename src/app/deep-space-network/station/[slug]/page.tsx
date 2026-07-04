import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StationDetail } from "@/components/deep-space-comms/StationDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { dsnStationPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.deepSpaceCommunications.allStations().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/deep-space-network/station/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.deepSpaceCommunications.resolveStation(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: dsnStationPath(slug) });
}

export default async function StationPage({ params }: PageProps<"/deep-space-network/station/[slug]">) {
  const { slug } = await params;
  const d = engine.deepSpaceCommunications.resolveStation(slug);
  if (!d) notFound();
  return <StationDetail d={d} />;
}
