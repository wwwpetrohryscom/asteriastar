import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrajectoryClassView } from "@/components/interstellar/TrajectoryClassView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { interstellarTrajectoryPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.interstellarObjects.trajectoryClasses().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/interstellar-objects/trajectory/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.interstellarObjects.resolveTrajectoryClass(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: interstellarTrajectoryPath(slug) });
}

export default async function TrajectoryClassPage({ params }: PageProps<"/interstellar-objects/trajectory/[slug]">) {
  const { slug } = await params;
  const d = engine.interstellarObjects.resolveTrajectoryClass(slug);
  if (!d) notFound();
  return <TrajectoryClassView d={d} />;
}
