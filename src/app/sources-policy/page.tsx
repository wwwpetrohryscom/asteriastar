import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/routes";
import { SOURCES, type SourceKey } from "@/lib/sources";

const PATH = ROUTES.sourcesPolicy;
const DESCRIPTION =
  "Asteria Star's sources policy: the authoritative organizations we cite, how we verify facts, our no-scraping rule, and how we license and attribute imagery.";

export const metadata: Metadata = buildMetadata({
  title: "Sources Policy",
  description: DESCRIPTION,
  path: PATH,
});

const ALL_SOURCE_KEYS = Object.keys(SOURCES) as SourceKey[];

export default function SourcesPolicyPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Sources Policy", url: PATH },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          articleSchema({
            headline: "Sources Policy",
            description: DESCRIPTION,
            url: PATH,
            dateModified: "2026-06-29",
          }),
        ]}
      />

      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <HeroSection
        compact
        accent="stone"
        title="Sources Policy"
        lead="Where our facts come from, and the rules we follow when we use them."
      />

      <Container size="narrow" className="mt-8">
        <div className="prose-cosmos">
          <h2>Our approach</h2>
          <p>
            Asteria Star is <strong>source-ready by design</strong>. Scientific
            astronomy content is built to be cited from authoritative primary and
            reference sources rather than asserted on our own authority. Every
            topic page declares the source slots it draws on.
          </p>

          <h2>What we will and won&apos;t do</h2>
          <ul>
            <li>
              <strong>We verify.</strong> Specific facts, figures, and dates are
              checked against the sources below before publication.
            </li>
            <li>
              <strong>We do not scrape.</strong> We do not bulk-harvest content
              from these organizations; we reference and link to them.
            </li>
            <li>
              <strong>We do not invent.</strong> No unverified claims, no
              fabricated statistics, no made-up astronomical data.
            </li>
            <li>
              <strong>We separate science from tradition.</strong> Astrology
              draws on cultural and historical references and is never cited as
              scientific evidence. See the{" "}
              <Link href={ROUTES.editorialPolicy}>editorial policy</Link>.
            </li>
          </ul>

          <h2>Imagery and licensing</h2>
          <p>
            Visual media will be drawn only from openly licensed or public-domain
            collections. For each image we record its source, its license (public
            domain or a specific Creative Commons license), and any required
            credit before it is published.
          </p>

          <h2>Our source library</h2>
          <p>
            These are the organizations whose data, research, and imagery anchor
            the platform. This list will grow as the encyclopedia deepens.
          </p>
        </div>

        <div className="mt-6">
          <SourceList keys={ALL_SOURCE_KEYS} title="Primary & reference sources" />
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-sm text-faint">
          Last reviewed 2026-06-29.
        </p>
      </Container>
    </>
  );
}
