import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spaceWeatherPath } from "@/lib/routes";
import { SectionNav, SPACE_WEATHER_PAGES, HonestyNote } from "@/components/space-weather/SectionNav";
import { CompactSpaceWeather } from "@/components/space-weather/CompactSpaceWeather";
import { LIVE_PRODUCTS, LIVE_PROVIDERS } from "@/platform/live-providers/registry";
import { GEOMAGNETIC_SCALE, SOLAR_FLARE_CLASSES } from "@/platform/live-sky/spaceWeather";
import { KP_SCALE } from "@/platform/live-sky/aurora";

/**
 * The space-weather hub: the section's evergreen, indexable front door.
 *
 * The reference material here — the flare classes, the G-scale, the Kp scale — is timeless and is
 * imported from the platform's existing Live Sky reference data rather than restated, so the site
 * defines these scales in exactly one place. The only live thing on the page is the compact
 * current-conditions strip, which degrades to an honest "unavailable" without affecting the rest.
 */

const DESCRIPTION =
  "Live space weather from NOAA's Space Weather Prediction Center and NASA's DONKI catalogue: solar wind speed and interplanetary magnetic field measured at L1, the planetary K-index observed and forecast, the NOAA R, S and G scales, active regions, X-ray flares, and the OVATION aurora forecast. Every value carries the provider's own timestamp; nothing is simulated, and a provider that cannot be reached shows no number at all.";

export const metadata: Metadata = buildMetadata({
  title: "Space Weather",
  description: DESCRIPTION,
  path: ROUTES.spaceWeather,
  keywords: ["space weather", "solar wind", "Kp index", "geomagnetic storm", "aurora forecast", "solar flare", "NOAA SWPC", "coronal mass ejection"],
});

/** Five minutes. The page is mostly reference material; its one live strip is cached the same way. */
export const revalidate = 300;

export default function SpaceWeatherHubPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Weather", url: ROUTES.spaceWeather },
  ];
  const swpc = LIVE_PROVIDERS.find((p) => p.providerKey === "noaa-swpc");

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Space Weather", description: DESCRIPTION, url: ROUTES.spaceWeather })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>Live data · {LIVE_PROVIDERS.length} providers · {LIVE_PRODUCTS.length} products</span>}
        title="Space Weather"
        lead="The Sun is measured continuously, and the measurements are public. This is AsteriaStar's operational space-weather centre: real values from NOAA and NASA, each shown with the time it was taken and the file it came from."
      />
      <Container className="mt-8 mb-14 space-y-12">
        <SectionNav />

        <section aria-labelledby="now-heading" className="space-y-4">
          <h2 id="now-heading" className="font-display text-2xl font-bold">Right now</h2>
          <CompactSpaceWeather />
          <p className="text-sm text-muted">
            <Link href={spaceWeatherPath("live")} className="text-nasa underline-offset-4 hover:underline">Full current conditions →</Link>
          </p>
        </section>

        <section aria-labelledby="sections-heading">
          <h2 id="sections-heading" className="font-display text-2xl font-bold">The section</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SPACE_WEATHER_PAGES.map((p) => (
              <li key={p.slug} className="scientific-card flex flex-col p-5">
                <Link href={spaceWeatherPath(p.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nasa hover:underline">{p.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{p.blurb}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="what-heading" className="space-y-4">
          <h2 id="what-heading" className="font-display text-2xl font-bold">What space weather is</h2>
          <div className="prose-invert max-w-none space-y-3 text-sm leading-relaxed text-muted">
            <p>
              The Sun does not simply shine. It sheds a supersonic plasma — the solar wind — that carries its magnetic field out
              past every planet, and it occasionally throws off far larger structures: flares that brighten the whole X-ray sky in
              minutes, and coronal mass ejections that launch billions of tonnes of magnetised plasma into interplanetary space.
              Space weather is what happens when that reaches Earth.
            </p>
            <p>
              Earth&apos;s magnetic field deflects most of it. What gets through depends less on how fast the wind is blowing than
              on which way its embedded magnetic field points: when the interplanetary field turns southward, opposite to Earth&apos;s
              own field at the dayside boundary, the two can reconnect and energy pours into the magnetosphere. That is what drives
              aurora, and what disturbs power grids, satellite navigation and high-frequency radio.
            </p>
            <p>
              The measurements on these pages come from spacecraft at the L1 Lagrange point, roughly 1.5 million kilometres
              sunward of Earth, from the GOES satellites in geostationary orbit, and from a worldwide network of ground
              magnetometers. L1 gives something like half an hour to an hour of warning, depending on how fast the wind is
              travelling — which is why the same page shows both an observation time and a modelled arrival time and never
              conflates them.
            </p>
          </div>
        </section>

        <section aria-labelledby="scales-heading" className="space-y-6">
          <h2 id="scales-heading" className="font-display text-2xl font-bold">The scales</h2>

          <div className="scientific-card p-5">
            <h3 className="font-display text-base font-semibold text-fg">Solar flare classes</h3>
            <p className="mt-1 text-sm text-muted">Flares are ranked by peak X-ray brightness in the 1–8 Ångström band, each class ten times stronger than the last.</p>
            <dl className="mt-3 divide-y divide-white/5">
              {SOLAR_FLARE_CLASSES.map((f) => (
                <div key={f.flareClass} className="grid grid-cols-[3rem_1fr] gap-3 py-2 text-sm">
                  <dt className="font-display font-semibold text-fg">{f.flareClass}</dt>
                  <dd className="text-muted">{f.meaning}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="scientific-card p-5">
            <h3 className="font-display text-base font-semibold text-fg">Geomagnetic storm scale (G1–G5)</h3>
            <p className="mt-1 text-sm text-muted">NOAA&apos;s operational scale for geomagnetic disturbance, keyed to the planetary K-index.</p>
            <dl className="mt-3 divide-y divide-white/5">
              {GEOMAGNETIC_SCALE.map((g) => (
                <div key={g.gScale} className="grid grid-cols-[3rem_1fr] gap-3 py-2 text-sm">
                  <dt className="font-display font-semibold text-fg">{g.gScale}</dt>
                  <dd className="text-muted">{g.meaning}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="scientific-card p-5">
            <h3 className="font-display text-base font-semibold text-fg">The planetary K-index</h3>
            <p className="mt-1 text-sm text-muted">A quasi-logarithmic index of geomagnetic disturbance over each three-hour interval, averaged across a global network of magnetometer stations.</p>
            <dl className="mt-3 divide-y divide-white/5">
              {KP_SCALE.map((k) => (
                <div key={k.kp} className="grid grid-cols-[3rem_1fr] gap-3 py-2 text-sm">
                  <dt className="font-display font-semibold text-fg">Kp {k.kp}</dt>
                  <dd className="text-muted">{k.meaning}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-labelledby="providers-heading" className="space-y-4">
          <h2 id="providers-heading" className="font-display text-2xl font-bold">Where the data comes from</h2>
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {LIVE_PROVIDERS.map((p) => (
              <li key={p.providerKey} className="scientific-card p-5">
                <h3 className="font-display text-base font-semibold text-fg">{p.name}</h3>
                <p className="mt-1 text-xs text-faint">{p.organization}</p>
                <p className="mt-2 text-sm text-muted">{p.license}</p>
                <p className="mt-2 text-xs leading-relaxed text-faint">{p.rateLimits}</p>
                {p.providerCaveat && <p className="mt-2 text-xs leading-relaxed text-faint">{p.providerCaveat}</p>}
                <p className="mt-3 text-xs">
                  <a href={p.documentation} target="_blank" rel="noreferrer nofollow" className="text-nasa underline-offset-4 hover:underline">Provider documentation →</a>
                </p>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted">
            Every product, its cache window and this server&apos;s own request record are on the{" "}
            <Link href="/authority/data-health/live-providers" className="text-nasa underline-offset-4 hover:underline">live provider health page</Link>. The same data is
            available through the{" "}
            <Link href="/developers/api" className="text-nasa underline-offset-4 hover:underline">public API</Link>.
          </p>
          {swpc && <HonestyNote />}
        </section>

        <SourceList keys={["swpc", "donki", "nasa"]} title="Sources & references" />
      </Container>
    </>
  );
}
