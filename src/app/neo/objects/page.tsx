import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, neoPath } from "@/lib/routes";
import { NeoNav, NeoHonestyNote, NeoPanel, Size, CatalogueLink } from "@/components/neo/NeoUI";
import { EnvelopeDetails } from "@/components/space-weather/LiveStatus";
import { neoSnapshot, resolveApproaches, matchCatalogue, reage } from "@/platform/neo/service";
import type { CatalogueMatch, ObjectSize } from "@/platform/neo/model";

/**
 * The objects behind the feeds, and whether AsteriaStar has anything to say about them.
 *
 * This page exists because the reconciliation question is genuinely interesting and usually hidden:
 * a live feed names thousands of objects, an encyclopedia covers a few dozen, and the overlap is
 * small. Showing it plainly is more honest than either padding the encyclopedia or quietly dropping
 * the records that do not match.
 */

interface ObjectRow {
  designation: string;
  fullName?: string;
  catalogue: CatalogueMatch;
  size?: ObjectSize;
  /** Which live feeds this object currently appears in. */
  appearsIn: string[];
  note?: string;
}

const DESCRIPTION =
  "Every near-Earth object currently named by NASA/JPL's live feeds — approaching, monitored for impact risk, or newly catalogued — and whether AsteriaStar has an encyclopedia entry for it. Live provider records are never silently turned into permanent entities: an object with no entry is shown as a provider record and labelled as such.";

export const metadata: Metadata = buildMetadata({
  title: "Near-Earth Objects in the Live Feeds",
  description: DESCRIPTION,
  path: neoPath("objects"),
  keywords: ["near-Earth object list", "asteroid designations", "NEO catalogue", "asteroid database", "CNEOS objects"],
});

export const revalidate = 3600;

export default async function NeoObjectsPage() {
  const nowIso = new Date().toISOString();
  const s = reage(await neoSnapshot(), nowIso);
  const approaches = resolveApproaches(s.closeApproaches, s.sentry);

  // One row per object, gathering which feeds it appears in. A designation seen in two feeds is one
  // object, not two — merging them here is what makes the catalogue coverage figure meaningful.
  const byDesignation = new Map<string, ObjectRow>();
  const add = (designation: string, fullName: string | undefined, feed: string, size?: ObjectSize, note?: string) => {
    const existing = byDesignation.get(designation);
    if (existing) {
      if (!existing.appearsIn.includes(feed)) existing.appearsIn.push(feed);
      if (!existing.size && size) existing.size = size;
      if (!existing.note && note) existing.note = note;
      return;
    }
    byDesignation.set(designation, { designation, fullName, catalogue: matchCatalogue(designation, fullName), size, appearsIn: [feed], note });
  };

  for (const a of approaches) add(a.designation, a.fullName, "Approaching", a.size);
  for (const o of (s.sentry.data ?? []).slice(0, 40)) {
    add(o.designation, o.fullName, "Sentry", o.diameterKm !== undefined ? { kind: "measured", km: o.diameterKm, note: "JPL's estimate from absolute magnitude assuming an albedo of 0.154, unless a measurement exists." } : undefined,
      o.palermoCumulative !== undefined ? `Palermo ${o.palermoCumulative.toFixed(2)}` : undefined);
  }
  for (const r of (s.recent.data ?? []).slice(0, 40)) add(r.designation, r.fullName, "Newly catalogued", r.size, r.orbitClass);

  const rows = [...byDesignation.values()].sort((a, b) => Number(a.catalogue.notYetCatalogued) - Number(b.catalogue.notYetCatalogued) || a.designation.localeCompare(b.designation));
  const matched = rows.filter((r) => !r.catalogue.notYetCatalogued);

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Near-Earth Objects", url: ROUTES.neo },
    { name: "Objects", url: neoPath("objects") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Near-Earth Objects in the Live Feeds", description: DESCRIPTION, url: neoPath("objects") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="ember"
        eyebrow={<span>Live · NASA/JPL CNEOS</span>}
        title="Objects"
        lead="Which objects the live feeds are talking about right now — and, just as usefully, which of them this encyclopedia has never written a word about."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <NeoNav current="objects" />

        <section aria-labelledby="coverage-heading" className="space-y-3">
          <h2 id="coverage-heading" className="font-display text-2xl font-bold">Coverage</h2>
          <p className="text-sm leading-relaxed text-muted">
            {rows.length} distinct objects appear across the three live feeds on this page.{" "}
            <strong className="text-fg">{matched.length}</strong> of them have an entry in AsteriaStar&apos;s knowledge graph. The
            rest are shown as provider records — real objects, really tracked, with nothing written about them here.
          </p>
          <p className="text-sm leading-relaxed text-muted">
            That is the honest state of affairs and it is not a backlog. Promoting a live record into a permanent encyclopedia
            entity is a deliberate editorial act: it needs sourcing, review and something worth saying. Doing it automatically from
            a feed would fill the catalogue with thousands of entries consisting of nothing but a designation and a magnitude.
          </p>
        </section>

        <NeoPanel envelope={s.closeApproaches} title="Objects in the feeds" what="The live near-Earth object feeds" id="objects-heading">
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="px-3 pt-3 text-left text-xs text-faint">
                Catalogued objects first. An object appearing in more than one feed is listed once.
              </caption>
              <thead className="text-faint">
                <tr>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">Designation</th>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">In AsteriaStar</th>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">Appears in</th>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">Estimated size</th>
                  <th scope="col" className="px-3 py-2 text-xs font-medium">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((r) => (
                  <tr key={r.designation}>
                    <td className="px-3 py-2">
                      <span className="font-medium text-fg">{r.fullName ?? r.designation}</span>
                    </td>
                    <td className="px-3 py-2"><CatalogueLink match={r.catalogue} /></td>
                    <td className="px-3 py-2 text-muted">{r.appearsIn.join(", ")}</td>
                    <td className="px-3 py-2"><Size size={r.size} /></td>
                    <td className="px-3 py-2 text-xs text-faint">{r.note ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </NeoPanel>

        <section aria-labelledby="promote-heading" className="space-y-3">
          <h2 id="promote-heading" className="font-display text-2xl font-bold">How an object becomes an entry</h2>
          <div className="max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              The match above is made against the committed JPL Small-Body Database snapshot, which is the one place in this
              repository that already carries both a JPL identifier and an AsteriaStar entity id. A match is shown with what it was
              matched on — a designation or a name — so a reader can judge it rather than trust it.
            </p>
            <p>
              Promoting an object into the catalogue means adding it to that snapshot with its measured orbital elements and their
              uncertainties, then writing the entry. It is a reviewed change to the repository, not a side effect of a page load.
              Until that happens the object appears here exactly as it is: a record from a provider.
            </p>
            <p>
              Catalogued objects link into the knowledge graph, where the orbital elements carry their own published uncertainties
              and epochs. Start from{" "}
              <Link href={ROUTES.asteroids} className="text-nasa underline-offset-4 hover:underline">the asteroid catalogue</Link>.
            </p>
          </div>
        </section>

        <section aria-labelledby="prov-heading" className="space-y-4">
          <h2 id="prov-heading" className="font-display text-2xl font-bold">Provenance</h2>
          <NeoHonestyNote />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EnvelopeDetails envelope={s.closeApproaches} title="Close approaches" />
            <EnvelopeDetails envelope={s.sentry} title="Sentry table" />
            <EnvelopeDetails envelope={s.recent} title="Newly catalogued" />
          </div>
        </section>

        <SourceList keys={["jpl", "nasa", "mpc"]} title="Sources & references" />
      </Container>
    </>
  );
}
