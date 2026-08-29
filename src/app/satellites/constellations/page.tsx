import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, satelliteConstellationPath, satelliteLivePath } from "@/lib/routes";
import { engine } from "@/platform/data-engine";

/**
 * The constellation index.
 *
 * It exists because `/satellites/constellations/live` was added beneath a path segment that had no
 * page of its own, so truncating that URL — the ordinary way a reader or a crawler recovers from a
 * deep link — produced a 404. The individual entries live under the singular
 * `/satellites/constellation/[slug]`, which is why the plural namespace was empty; rather than
 * leave an orphan, the plural is now the index those singular pages belong to.
 */

const DESCRIPTION =
  "Every satellite constellation AsteriaStar catalogues — the navigation systems, the broadband networks and the Earth-observation fleets — with the operators, orbits and purposes behind each, and the current state of live orbital data for them.";

export const metadata: Metadata = buildMetadata({
  title: "Satellite Constellations",
  description: DESCRIPTION,
  path: "/satellites/constellations",
  keywords: ["satellite constellations", "Starlink", "GPS", "Galileo", "GLONASS", "BeiDou", "OneWeb", "Iridium"],
});

export default function ConstellationsIndexPage() {
  const constellations = engine.satellites.constellations();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Satellites", url: ROUTES.satellites },
    { name: "Constellations", url: "/satellites/constellations" },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Satellite Constellations", description: DESCRIPTION, url: "/satellites/constellations" })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="plasma"
        eyebrow={<span>Encyclopedia · {constellations.length} constellations</span>}
        title="Satellite constellations"
        lead="A constellation is a fleet flown as one system: enough satellites, in enough planes, that at least one is always where it is needed. Navigation needs four in view at once; broadband needs one overhead everywhere at all times."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="all-heading">
          <h2 id="all-heading" className="font-display text-2xl font-bold">Every catalogued constellation</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {constellations.map((c) => (
              <li key={c.slug} className="scientific-card flex flex-col p-5">
                <Link href={satelliteConstellationPath(c.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{c.name}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{c.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="live-heading" className="space-y-3">
          <h2 id="live-heading" className="font-display text-2xl font-bold">Live orbital data</h2>
          <p className="text-sm leading-relaxed text-muted">
            None of these constellations is tracked live on this platform, and the reason is worth reading rather than inferring
            from an absence: the public catalogue of orbital elements is served by hosts that refuse automated access or require
            credentials whose terms do not permit this use, and AsteriaStar does not scrape tracking sites.{" "}
            <Link href={satelliteLivePath("constellations/live")} className="text-nasa underline-offset-4 hover:underline">The full status, constellation by constellation →</Link>
          </p>
        </section>

        <SourceList keys={["nasa", "esa"]} title="Sources & references" />
      </Container>
    </>
  );
}
