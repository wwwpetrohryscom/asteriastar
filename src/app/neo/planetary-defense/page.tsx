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
import { NeoNav, NeoHonestyNote, NeoStat } from "@/components/neo/NeoUI";
import { riskSnapshot, discoverySnapshot, reage } from "@/platform/neo/service";
import { engine } from "@/platform/data-engine";

/**
 * Planetary defence — the operational view.
 *
 * AsteriaStar already has an encyclopedia section on planetary defence (`/planetary-defense`), so
 * this page deliberately does not restate it. Its job is the one the encyclopedia cannot do: put
 * today's live numbers next to the standing capability, and link across. Duplicating the
 * encyclopedia here would give the platform two accounts of the same subject that drift apart.
 */

const DESCRIPTION =
  "Planetary defence as it stands today: how many near-Earth objects are catalogued and monitored right now, what the monitoring systems actually do, and what happened the one time humanity deliberately changed an asteroid's orbit. Live counts from NASA/JPL's Center for Near-Earth Object Studies, linked to AsteriaStar's planetary-defence encyclopedia.";

export const metadata: Metadata = buildMetadata({
  title: "Planetary Defence — Live Status",
  description: DESCRIPTION,
  path: neoPath("planetary-defense"),
  keywords: ["planetary defence", "planetary defense", "asteroid deflection", "DART mission", "impact monitoring", "NEO survey", "kinetic impactor"],
});

export const revalidate = 21600;

export default async function NeoPlanetaryDefensePage() {
  const nowIso = new Date().toISOString();
  // Only the feeds this page actually renders. `neoSnapshot()` would additionally fetch and parse
  // the close-approach product — up to its byte ceiling — and run a full catalogue fold over it,
  // all discarded, inside a serialised JPL request budget this page has no reason to spend.
  const [risk, discovery] = await Promise.all([riskSnapshot(), discoverySnapshot()]);
  const s = reage({ ...risk, ...discovery }, nowIso);
  const sentry = s.sentry.data;
  const sentryObjects = sentry?.length;
  const torinoAboveZero = sentry?.filter((o) => (o.torinoMaximum ?? 0) > 0).length;
  const pd = engine.planetaryDefense;

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Near-Earth Objects", url: ROUTES.neo },
    { name: "Planetary defence", url: neoPath("planetary-defense") },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), webPageSchema({ name: "Planetary Defence — Live Status", description: DESCRIPTION, url: neoPath("planetary-defense") })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="ember"
        eyebrow={<span>Live counts · NASA/JPL CNEOS</span>}
        title="Planetary defence"
        lead="The only natural disaster humanity could, in principle, prevent entirely — and the only one where the whole job is finding things early enough. This is where that effort stands today."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <NeoNav current="planetary-defense" />

        <section aria-labelledby="today-heading" className="space-y-4">
          <h2 id="today-heading" className="font-display text-2xl font-bold">Where things stand right now</h2>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <NeoStat value={sentryObjects} label="objects monitored" sub="orbits not yet precise enough to exclude any impact" />
            <NeoStat value={torinoAboveZero} label="above Torino 0" sub="the scale's own definition of anything but routine" />
            <NeoStat value={s.recent.data?.length} label="first observed in 60 days" sub="and since given a computed orbit — not the same as newly announced" />
            <NeoStat value={s.candidates.data?.length} label="awaiting confirmation" sub="candidates on the MPC's page right now" />
          </ul>
        </section>

        <section aria-labelledby="how-heading" className="space-y-3">
          <h2 id="how-heading" className="font-display text-2xl font-bold">What the system actually does</h2>
          <div className="max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              <strong className="text-fg">Find.</strong> Survey telescopes sweep the sky nightly for moving points of light. Almost
              everything they find is already known; the rest goes to the Minor Planet Centre, which collates observations from
              observatories worldwide and publishes candidates for others to follow up.
            </p>
            <p>
              <strong className="text-fg">Track.</strong> Once enough observations accumulate, an orbit can be fitted. The
              uncertainty in that fit is the whole game: a week&apos;s arc leaves an object&apos;s position a year hence uncertain
              by millions of kilometres, and a decade&apos;s arc pins it to a few hundred.
            </p>
            <p>
              <strong className="text-fg">Assess.</strong> Sentry projects every fitted orbit forward and flags any that cannot yet
              be shown to miss.{" "}
              {sentryObjects !== undefined
                ? `The ${sentryObjects.toLocaleString("en-GB")} objects on that list are there because of what is not yet known about them, and they leave it as observations accumulate.`
                : "The table could not be read from JPL for this page, so no count is given; objects are on that list because of what is not yet known about them, and they leave it as observations accumulate."}
            </p>
            <p>
              <strong className="text-fg">Deflect.</strong> Demonstrated once, in 2022, by NASA&apos;s DART mission. The
              encyclopedia covers what was done and what it showed; this page&apos;s job is the live figures above.
            </p>
          </div>
        </section>

        <section aria-labelledby="encyclopedia-heading" className="space-y-3">
          <h2 id="encyclopedia-heading" className="font-display text-2xl font-bold">The full account</h2>
          <p className="text-sm leading-relaxed text-muted">
            This page is the live status and nothing else. AsteriaStar already covers planetary defence properly in two places,
            and repeating either here would give the platform three accounts of one subject that drift apart. The survey
            programmes, the deflection techniques and their trade-offs, the coordination structures and the impact record are in
            the encyclopedia — {pd.count} catalogued entries — and the asteroid section covers the objects themselves. The
            hazard scales are defined there too; this page and{" "}
            <Link href={neoPath("risk")} className="text-nasa underline-offset-4 hover:underline">the risk page</Link> quote them
            only as far as reading today&apos;s numbers requires.
          </p>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <li className="scientific-card p-5">
              <Link href={ROUTES.planetaryDefense} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">Planetary defence encyclopedia →</Link>
              <p className="mt-1 text-sm text-muted">Surveys, deflection methods, coordination and the impact record.</p>
            </li>
            <li className="scientific-card p-5">
              <Link href="/asteroids/planetary-defense" className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">Asteroid defence overview →</Link>
              <p className="mt-1 text-sm text-muted">The asteroid section&apos;s own account, including the hazard scales in full.</p>
            </li>
            <li className="scientific-card p-5">
              <Link href={ROUTES.asteroids} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">Asteroids →</Link>
              <p className="mt-1 text-sm text-muted">The objects themselves: families, groups, near-Earth classes and named bodies.</p>
            </li>
          </ul>
        </section>

        <section aria-labelledby="honesty-heading" className="space-y-3">
          <h2 id="honesty-heading" className="font-display text-2xl font-bold">What this page will not do</h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm leading-relaxed text-muted">
            <p>
              It will not tell you an asteroid is coming. If one ever were, the announcement would come from the agencies that
              compute these orbits, not from a website reading their tables — and it would appear in the Sentry figures above
              before anywhere else.
            </p>
            <p className="mt-3">
              It also will not compute a risk of its own. Every hazard figure on these pages is JPL&apos;s, on a scale JPL or the
              IAU defined, quoted with the caveats they attach to it. A platform that invented its own asteroid danger rating would
              be manufacturing authority it does not have, about a subject where alarm is cheap and accuracy is not.
            </p>
          </div>
          <NeoHonestyNote />
        </section>

        <SourceList keys={["jpl", "nasa", "mpc"]} title="Sources & references" />
      </Container>
    </>
  );
}
