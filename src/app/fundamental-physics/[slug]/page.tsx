import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhysicsDetail } from "@/components/fundamental-physics/PhysicsDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { fundamentalPhysicsPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.fundamentalPhysics.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/fundamental-physics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.fundamentalPhysics.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: fundamentalPhysicsPath(slug) });
}

export default async function FundamentalPhysicsEntryPage({ params }: PageProps<"/fundamental-physics/[slug]">) {
  const { slug } = await params;
  const d = engine.fundamentalPhysics.resolveEntry(slug);
  if (!d) notFound();
  return <PhysicsDetail d={d} />;
}
