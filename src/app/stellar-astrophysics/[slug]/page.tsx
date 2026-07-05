import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SaDetail } from "@/components/stellar-astrophysics/SaDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { stellarAstrophysicsPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.stellarAstrophysics.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stellar-astrophysics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.stellarAstrophysics.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: stellarAstrophysicsPath(slug) });
}

export default async function StellarAstrophysicsPage({ params }: PageProps<"/stellar-astrophysics/[slug]">) {
  const { slug } = await params;
  const d = engine.stellarAstrophysics.resolveEntry(slug);
  if (!d) notFound();
  return <SaDetail d={d} />;
}
