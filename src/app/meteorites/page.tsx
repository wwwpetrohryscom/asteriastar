import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MeteoritesTable } from "@/components/meteorites/MeteoritesTable";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, meteoriteDiscoveryPath, meteoriteClassPath, meteoriteGroupPath, meteoriteImpactStructurePath, meteoriteSitePath } from "@/lib/routes";
import { METEORITE_DISCOVERIES } from "@/app/meteorites/discovery";

const DESCRIPTION =
  "A graph-driven encyclopedia of meteors, meteorites, fireballs, and impact structures — the rocks that survive the fall to Earth, classified into chondrites, achondrites, irons, and stony-irons, and traced back to their parent bodies: the asteroid Vesta, Mars, and the Moon. Reuses the platform's asteroids, impact events, and meteor showers; every figure is source-backed and unknown values are left blank.";

export const metadata: Metadata = buildMetadata({ title: "Meteors, Meteorites & Fireballs", description: DESCRIPTION, path: ROUTES.meteorites });

export default function MeteoritesHubPage() {
  const e = engine.meteorites;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Meteorites", url: ROUTES.meteorites },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Meteors, Meteorites & Fireballs", description: DESCRIPTION, url: ROUTES.meteorites })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="nebula"
        eyebrow={<span>Encyclopedia · {e.count} meteorites · {e.classes().length} classes</span>}
        title="Meteors, Meteorites & Fireballs"
        lead="The small bodies that reach the ground — the meteorites that fall from asteroids, Mars, and the Moon, the fireballs that announce their arrival, and the craters they leave behind. The capstone of the small-bodies trilogy, connected through the Knowledge Graph to the asteroids and comets they come from."
      />

      <Container className="mt-8 mb-14 space-y-10">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore by theme</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {METEORITE_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={meteoriteDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nebula hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="classes-heading">
          <h2 id="classes-heading" className="font-display text-2xl font-bold">Meteorite classification</h2>
          <p className="mt-1 text-sm text-faint">The four great classes and their groups.</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {e.classes().map((c) => (
              <li key={c.slug} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <Link href={meteoriteClassPath(c.slug)} className="font-medium text-fg hover:text-nebula">{c.name}</Link>
                <div className="text-xs text-faint">{e.byClass(c.slug).length} modelled</div>
              </li>
            ))}
          </ul>
          <ul className="mt-3 flex flex-wrap gap-2">
            {e.groups().map((g) => (
              <li key={g.slug}><Link href={meteoriteGroupPath(g.slug)} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{g.name}</Link></li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="structures-heading">
          <h2 id="structures-heading" className="font-display text-2xl font-bold">Impact structures &amp; recovery sites</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {e.structures().map((s) => (
              <li key={s.slug} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <Link href={meteoriteImpactStructurePath(s.slug)} className="font-medium text-fg hover:text-nebula">{s.name}</Link>
                {s.ageLabel && <div className="mt-1 text-xs text-faint">{s.ageLabel}</div>}
              </li>
            ))}
            {e.sites().map((s) => (
              <li key={s.slug} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <Link href={meteoriteSitePath(s.slug)} className="font-medium text-fg hover:text-nebula">{s.name}</Link>
                <div className="mt-1 text-xs text-faint">Strewn field</div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="falls-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="falls-heading" className="font-display text-2xl font-bold">Meteorite falls</h2>
            <Link href={meteoriteDiscoveryPath("all-meteorites")} className="text-sm text-nebula underline-offset-4 hover:underline">All meteorites →</Link>
          </div>
          <div className="mt-4"><MeteoritesTable records={e.falls()} /></div>
        </section>

        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">
            Each meteorite, class, group, fireball, impact structure, and recovery site is a first-class knowledge-graph entity resolved through the Scientific Data Engine. Classifications and fall data come from the Meteoritical Bulletin Database. The parent bodies — the asteroid Vesta, Mars, and the Moon — the impact events, and the meteor showers are the platform&apos;s existing entities, reused and never duplicated. This encyclopedia detects no live fireballs; for observing, see the{" "}
            <Link href="/sky/meteor-showers" className="text-nebula underline-offset-4 hover:underline">Live Sky meteor showers</Link>. Unknown values are left blank. See{" "}
            <Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
