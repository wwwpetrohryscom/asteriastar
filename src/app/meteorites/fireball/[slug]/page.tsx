import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeteoriteEventView } from "@/components/meteorites/MeteoriteEventView";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { meteoriteFireballPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.meteorites.fireballs().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/meteorites/fireball/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = engine.meteorites.resolveFireball(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.name, description: d.record.description, path: meteoriteFireballPath(slug) });
}

export default async function FireballPage({ params }: PageProps<"/meteorites/fireball/[slug]">) {
  const { slug } = await params;
  const d = engine.meteorites.resolveFireball(slug);
  if (!d) notFound();
  return <MeteoriteEventView d={d} kindLabel="Fireball" url={meteoriteFireballPath(slug)} />;
}
