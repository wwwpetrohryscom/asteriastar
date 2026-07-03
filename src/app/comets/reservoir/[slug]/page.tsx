import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CometGroupView } from "@/components/comets/CometGroupView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { cometReservoirPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.comets.reservoirs().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/comets/reservoir/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.comets.resolveReservoir(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: cometReservoirPath(slug) });
}

export default async function CometReservoirPage({ params }: PageProps<"/comets/reservoir/[slug]">) {
  const { slug } = await params;
  const d = engine.comets.resolveReservoir(slug);
  if (!d) notFound();
  return <CometGroupView d={d} kindLabel="Small-body reservoir" url={cometReservoirPath(slug)} />;
}
