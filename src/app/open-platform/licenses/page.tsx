import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { OpenPlatformNav } from "@/components/open-platform/OpenPlatformNav";
import { getAllSources } from "@/lib/sources";
import { API_LICENSE } from "@/platform/open-data/api";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION = "The licences that apply to reuse — the platform's own CC BY-SA 4.0 for the graph and API, and the individual terms of each upstream source — so reuse obligations are never in doubt.";
export const metadata: Metadata = buildMetadata({ title: "Open Platform — Licensing", description: DESCRIPTION, path: `${ROUTES.openPlatform}/licenses` });

export default function OpenPlatformLicensesPage() {
  const sources = getAllSources().slice().sort((a, b) => a.name.localeCompare(b.name));
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Open Platform", url: ROUTES.openPlatform },
    { name: "Licenses", url: `${ROUTES.openPlatform}/licenses` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Open Platform · Licensing</span>} title="Licensing matrix" lead={DESCRIPTION} />
      <Container className="mt-8 mb-14">
        <OpenPlatformNav active="licenses" />

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="font-display text-lg font-bold text-fg">The platform</h2>
          <p className="mt-2 text-sm text-muted">
            The knowledge graph, the API responses, and the exports are licensed <span className="font-medium text-ember">{API_LICENSE}</span>. Attribution is requested as &ldquo;AsteriaStar&rdquo; with a link. Upstream source data retains the terms below — always defer to the stricter of the two for a given item.
          </p>
        </section>

        <section aria-labelledby="sources" className="mt-8">
          <h2 id="sources" className="font-display text-2xl font-bold">Upstream sources ({sources.length})</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-faint">
                  <th scope="col" className="px-4 py-2 font-medium">Source</th>
                  <th scope="col" className="px-4 py-2 font-medium">Organisation</th>
                  <th scope="col" className="px-4 py-2 font-medium">Usage terms</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.key} className="border-b border-white/5 align-top">
                    <td className="px-4 py-2"><a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-fg hover:text-ember">{s.name}</a></td>
                    <td className="px-4 py-2 text-muted">{s.organization}</td>
                    <td className="px-4 py-2 text-muted">{s.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">
            The same registry is served as JSON at{" "}
            <Link href="/api/v0/sources" className="text-ember underline-offset-4 hover:underline">/api/v0/sources</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
