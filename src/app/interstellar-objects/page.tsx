import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { InterstellarCards } from "@/components/interstellar/InterstellarCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, interstellarDiscoveryPath, interstellarDetectionPath, interstellarTrajectoryPath } from "@/lib/routes";

const DESCRIPTION =
  "A focused, source-backed encyclopedia of interstellar and hyperbolic objects — the confirmed visitors from beyond the Solar System (1I/ʻOumuamua, 2I/Borisov, 3I/ATLAS), the debated candidates, the Solar-System comets on hyperbolic orbits, and the methods and surveys used to tell them apart. Confirmed, candidate, and Solar-System objects are kept clearly separate; every figure is source-backed and unknown values are left blank.";

export const metadata: Metadata = buildMetadata({ title: "Interstellar & Hyperbolic Objects", description: DESCRIPTION, path: ROUTES.interstellarObjects });

export default function InterstellarHubPage() {
  const e = engine.interstellarObjects;
  const confirmed = e.confirmedInterstellarObjects();
  const candidates = e.candidateInterstellarObjects();
  const hyperbolic = e.hyperbolicComets();
  const methods = e.detectionMethods();
  const classes = e.trajectoryClasses();
  const surveys = e.detectionSurveys();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Interstellar Objects", url: ROUTES.interstellarObjects },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Interstellar & Hyperbolic Objects", description: DESCRIPTION, url: ROUTES.interstellarObjects })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>Encyclopedia · {confirmed.length} confirmed · {hyperbolic.length} hyperbolic comets</span>}
        title="Interstellar &amp; Hyperbolic Objects"
        lead="Visitors from beyond the Solar System — and the Solar-System comets that merely look like them. This compact authority keeps confirmed interstellar objects, unconfirmed candidates, and hyperbolic Solar-System comets clearly apart, and explains how astronomers tell an object from another star from one of our own."
      />

      <Container className="mt-8 mb-14 space-y-12">
        {/* Confirmed — the headline group, visually distinct */}
        <section aria-labelledby="confirmed-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="confirmed-heading" className="font-display text-2xl font-bold">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 align-middle" /> Confirmed interstellar objects
            </h2>
            <Link href={interstellarDiscoveryPath("confirmed")} className="text-sm text-aurora underline-offset-4 hover:underline">All confirmed →</Link>
          </div>
          <p className="mt-1 text-sm text-faint">Unambiguously from beyond the Solar System — a strongly hyperbolic orbit and an IAU interstellar (&ldquo;I&rdquo;) designation.</p>
          <div className="mt-4"><InterstellarCards records={confirmed} /></div>
        </section>

        {/* Candidate / debated — explicitly separated */}
        <section aria-labelledby="candidate-heading" className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.03] p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="candidate-heading" className="font-display text-2xl font-bold">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400 align-middle" /> Candidate &amp; debated claims
            </h2>
            <Link href={interstellarDiscoveryPath("debated")} className="text-sm text-aurora underline-offset-4 hover:underline">Debated claims →</Link>
          </div>
          <p className="mt-1 text-sm text-faint">Proposed but not confirmed. These are never presented as catalogued interstellar objects — each carries an explicit uncertainty note.</p>
          <div className="mt-4"><InterstellarCards records={candidates} /></div>
        </section>

        {/* Hyperbolic Solar-System comets */}
        <section aria-labelledby="hyperbolic-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="hyperbolic-heading" className="font-display text-2xl font-bold">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-400 align-middle" /> Hyperbolic Solar-System comets
            </h2>
            <Link href={interstellarDiscoveryPath("hyperbolic-comets")} className="text-sm text-aurora underline-offset-4 hover:underline">All hyperbolic comets →</Link>
          </div>
          <p className="mt-1 text-sm text-faint">Comets that formed here but were nudged onto hyperbolic or near-parabolic orbits — a small eccentricity above 1 from planetary perturbations, not an interstellar origin.</p>
          <div className="mt-4"><InterstellarCards records={hyperbolic} /></div>
        </section>

        {/* Trajectory classes — the eccentricity ladder */}
        <section aria-labelledby="trajectory-heading">
          <h2 id="trajectory-heading" className="font-display text-2xl font-bold">Trajectory classes</h2>
          <p className="mt-1 text-sm text-faint">The eccentricity ladder, from bound orbits to interstellar trajectories — what makes an interstellar origin legible.</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {classes.map((c) => (
              <li key={c.slug} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <Link href={interstellarTrajectoryPath(c.slug)} className="font-medium text-fg hover:text-aurora">{c.name}</Link>
                {c.eccentricityRangeLabel ? <div className="mt-1 text-xs text-faint">{c.eccentricityRangeLabel}</div> : null}
              </li>
            ))}
          </ul>
        </section>

        {/* Detection methods */}
        <section aria-labelledby="methods-heading">
          <h2 id="methods-heading" className="font-display text-2xl font-bold">How interstellar objects are detected</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {methods.map((m) => (
              <li key={m.slug} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <Link href={interstellarDetectionPath(m.slug)} className="font-medium text-fg hover:text-aurora">{m.name}</Link>
                {m.definition ? <p className="mt-1 text-xs text-faint">{m.definition}</p> : null}
              </li>
            ))}
          </ul>
        </section>

        {/* Surveys + future */}
        <section aria-labelledby="surveys-heading">
          <h2 id="surveys-heading" className="font-display text-2xl font-bold">Surveys &amp; cataloguing bodies</h2>
          <p className="mt-1 text-sm text-faint">The surveys that discover these objects and the bodies that catalogue them — the reused Pan-STARRS and the new ATLAS, Catalina, Minor Planet Center, and CNEOS entities.</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {surveys.map((s) => (
              <li key={s.id}><Link href={s.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{s.name}</Link></li>
            ))}
          </ul>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="font-display text-base font-semibold text-fg">Future interstellar discoveries</h3>
            <p className="mt-2 text-sm text-muted">Only three interstellar objects have been confirmed so far, but wide-field surveys are expected to find many more. The{" "}
              <Link href="/observatories/lsst" className="text-aurora underline-offset-4 hover:underline">Legacy Survey of Space and Time</Link> at the Vera C. Rubin Observatory, in particular, should sharply increase the detection rate. This page states no predicted counts or dates — none are fabricated.</p>
          </div>
        </section>

        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">
            Each object, comet, detection method, trajectory class, and survey is a first-class knowledge-graph entity resolved through the Scientific Data Engine. Orbits and designations come from the IAU Minor Planet Center and the NASA/JPL Small-Body Database. Interstellar origin is asserted only for the confirmed objects; candidates carry explicit uncertainty notes and are never labelled confirmed. No &ldquo;alien&rdquo; or artificial-origin claims are made. Unknown values are left blank. See{" "}
            <Link href="/transparency/source-quality" className="text-aurora underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
