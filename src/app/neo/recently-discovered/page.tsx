import type { Metadata } from "next";
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
import { discoverySnapshot, matchCatalogue, reage } from "@/platform/neo/service";
import { getLiveProvider } from "@/platform/live-providers/registry";

const ORBIT_CLASS: Record<string, string> = {
  IEO: "Atira — orbit entirely inside Earth's",
  ATE: "Aten — Earth-crossing, mostly inside Earth's orbit",
  APO: "Apollo — Earth-crossing, mostly outside Earth's orbit",
  AMO: "Amor — approaches but does not cross Earth's orbit",
};

const DESCRIPTION =
  "Near-Earth objects newly entered into NASA/JPL's small-body database, and the candidates still awaiting confirmation on the IAU Minor Planet Center's NEO Confirmation Page. The difference matters: a confirmed entry has a computed orbit, while a candidate may turn out to be an already-known object, not near-Earth at all, or nothing.";

export const metadata: Metadata = buildMetadata({
  title: "Recently Discovered Near-Earth Objects",
  description: DESCRIPTION,
  path: neoPath("recently-discovered"),
  keywords: ["new asteroid discoveries", "NEO confirmation page", "recently discovered asteroids", "Minor Planet Center NEOCP", "new near-Earth objects"],
});

export const revalidate = 3600;

export default async function RecentlyDiscoveredPage() {
  const nowIso = new Date().toISOString();
  const s = reage(await discoverySnapshot(), nowIso);
  const recent = (s.recent.data ?? []).slice(0, 60);
  const candidates = s.candidates.data ?? [];
  const mpc = getLiveProvider("minor-planet-center");

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Near-Earth Objects", url: ROUTES.neo },
    { name: "Recently discovered", url: neoPath("recently-discovered") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Recently Discovered Near-Earth Objects", description: DESCRIPTION, url: neoPath("recently-discovered") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="ember"
        eyebrow={<span>Live · NASA/JPL &amp; IAU Minor Planet Center</span>}
        title="Recently discovered"
        lead="Several near-Earth objects are found every night. Most are small, most are never seen again for years, and a good number of the things on the confirmation page turn out not to be new at all."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <NeoNav current="recently-discovered" />

        <NeoPanel envelope={s.candidates} title="Awaiting confirmation" what="The MPC's NEO Confirmation Page" id="candidates-heading">
          <p className="text-sm leading-relaxed text-muted">
            These are <strong className="text-fg">candidates, not discoveries</strong>. Each is a moving object someone has
            reported that may be a near-Earth object; the score is the Minor Planet Centre&apos;s estimate of how likely that is.
            Most entries leave the page within days — confirmed, identified as something already known, or discarded.
          </p>
          {candidates.length === 0 ? (
            <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted">
              The confirmation page is currently empty. Everything reported has been confirmed or discarded — a real state, read
              successfully, not a missing feed.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-[680px] text-left text-sm">
                <caption className="px-3 pt-3 text-left text-xs text-faint">
                  {candidates.length} candidate{candidates.length === 1 ? "" : "s"}. A temporary designation is not a name: it is
                  discarded once the object is confirmed and properly designated, or once it is discounted.
                </caption>
                <thead className="text-faint">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Temporary designation</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">NEO score</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Observations</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Observed arc</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Last seen</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Apparent magnitude</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {candidates.map((c) => (
                    <tr key={c.temporaryDesignation}>
                      <td className="px-3 py-2 font-medium text-fg">{c.temporaryDesignation}</td>
                      <td className="px-3 py-2 text-muted">{c.neoScore ?? "—"}</td>
                      <td className="px-3 py-2 text-muted">{c.observationCount ?? "—"}</td>
                      <td className="px-3 py-2 text-muted">
                        {c.arcDays !== undefined ? `${c.arcDays.toFixed(2)} d` : "—"}
                        {c.arcDays !== undefined && c.arcDays < 0.1 && <span className="block text-xs text-faint">very short — the orbit is barely constrained</span>}
                      </td>
                      <td className="px-3 py-2 text-muted">{c.daysSinceLastSeen !== undefined ? `${c.daysSinceLastSeen.toFixed(1)} d ago` : "—"}</td>
                      <td className="px-3 py-2 text-muted">{c.apparentMagnitude !== undefined ? `V ${c.apparentMagnitude.toFixed(1)}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {mpc?.providerCaveat && <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-faint">{mpc.providerCaveat}</p>}
        </NeoPanel>

        <NeoPanel envelope={s.recent} title="Newly catalogued" what="JPL's small-body database query" id="recent-heading">
          <p className="text-sm leading-relaxed text-muted">
            Objects whose <strong className="text-fg">first observation</strong> falls in the last sixty days and which now have a
            computed orbit in JPL&apos;s small-body database. First observation is not the same as announcement: an object is often
            recovered in archival images taken before anyone realised it was there.
          </p>
          {recent.length === 0 ? (
            <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted">
              No near-Earth object in this window. The query was answered successfully and returned nothing.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-[720px] text-left text-sm">
                <caption className="px-3 pt-3 text-left text-xs text-faint">
                  The {recent.length} most recent of {(s.recent.data ?? []).length} entries. MOID is the minimum distance between
                  the two orbits, not between the two bodies — an object with a small MOID need never come close in practice.
                </caption>
                <thead className="text-faint">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Designation</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">First observed</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Orbit class</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Estimated size</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Earth MOID</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Hazard classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recent.map((r) => (
                    <tr key={r.designation}>
                      <td className="px-3 py-2">
                        <span className="font-medium text-fg">{r.designation}</span>
                        <span className="block"><CatalogueLink match={matchCatalogue(r.designation, r.fullName)} /></span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-muted">{r.firstObservation}</td>
                      <td className="px-3 py-2 text-muted">
                        {r.orbitClass ?? "—"}
                        {r.orbitClass && ORBIT_CLASS[r.orbitClass] && <span className="block text-xs text-faint">{ORBIT_CLASS[r.orbitClass]}</span>}
                      </td>
                      <td className="px-3 py-2"><Size size={r.size} /></td>
                      <td className="px-3 py-2 whitespace-nowrap text-muted">{r.moidAu !== undefined ? `${r.moidAu.toFixed(4)} au` : "—"}</td>
                      <td className="px-3 py-2 text-muted">
                        {r.isPotentiallyHazardous ? (
                          <>
                            <span className="text-fg">Potentially hazardous</span>
                            <span className="block text-xs text-faint">MOID under 0.05 au and H brighter than 22 — a size-and-proximity classification, not a prediction</span>
                          </>
                        ) : (
                          <span className="text-faint">Not classified hazardous</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </NeoPanel>

        <section aria-labelledby="phrase-heading" className="space-y-3">
          <h2 id="phrase-heading" className="font-display text-2xl font-bold">&ldquo;Potentially hazardous&rdquo; is a category, not a warning</h2>
          <p className="max-w-none text-sm leading-relaxed text-muted">
            An object is classified potentially hazardous if its orbit comes within 0.05 astronomical units of Earth&apos;s and it
            is bright enough — absolute magnitude 22 or brighter — to be roughly 140 metres across or larger. Both conditions are
            about the orbit and the size, and neither says anything about whether an impact is expected. Around two thousand
            objects meet the definition. None of them is on a collision course.
          </p>
        </section>

        <section aria-labelledby="prov-heading" className="space-y-4">
          <h2 id="prov-heading" className="font-display text-2xl font-bold">Provenance</h2>
          <NeoHonestyNote />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EnvelopeDetails envelope={s.recent} title="Newly catalogued objects" />
            <EnvelopeDetails envelope={s.candidates} title="Confirmation page" />
          </div>
        </section>

        <SourceList keys={["jpl", "nasa", "mpc"]} title="Sources & references" />
      </Container>
    </>
  );
}
