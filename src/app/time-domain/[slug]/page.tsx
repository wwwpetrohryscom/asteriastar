import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TDDetail } from "@/components/time-domain/TDDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { timeDomainPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.timeDomain.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/time-domain/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.timeDomain.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: timeDomainPath(slug) });
}

export default async function TimeDomainPage({ params }: PageProps<"/time-domain/[slug]">) {
  const { slug } = await params;
  const d = engine.timeDomain.resolveEntry(slug);
  if (!d) notFound();
  return <TDDetail d={d} />;
}
