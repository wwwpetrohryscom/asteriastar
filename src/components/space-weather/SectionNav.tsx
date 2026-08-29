import Link from "next/link";
import { ROUTES, SPACE_WEATHER_SLUGS, spaceWeatherPath, type SpaceWeatherSlug } from "@/lib/routes";

/**
 * Navigation across the space-weather section. Every destination is a stable, evergreen URL with
 * no query string — which is what lets the whole section be indexed without a crawler ever
 * discovering a coordinate or a date parameter.
 */

export const SPACE_WEATHER_PAGES: { slug: SpaceWeatherSlug; title: string; blurb: string }[] = [
  { slug: "live", title: "Current conditions", blurb: "Everything being measured right now, in one view." },
  { slug: "solar-wind", title: "Solar wind", blurb: "Speed, density and the interplanetary magnetic field at L1." },
  { slug: "geomagnetic", title: "Geomagnetic activity", blurb: "The planetary K-index, observed and forecast, and NOAA's alerts." },
  { slug: "solar-activity", title: "Solar activity", blurb: "Flares, active regions, radio flux and catalogued eruptions." },
  { slug: "aurora", title: "Aurora", blurb: "NOAA's OVATION forecast and how far the oval reaches." },
  { slug: "events", title: "Events", blurb: "Flares, CMEs, storms and particle events as catalogued by NASA." },
];

export function SectionNav({ current }: { current?: SpaceWeatherSlug }) {
  return (
    <nav aria-label="Space weather sections" className="flex flex-wrap gap-2">
      <Link
        href={ROUTES.spaceWeather}
        aria-current={current === undefined ? "page" : undefined}
        className={`rounded-full border px-3 py-1.5 text-sm transition ${current === undefined ? "border-nasa/50 bg-nasa/10 text-fg" : "border-white/12 text-muted hover:border-white/30 hover:text-fg"}`}
      >
        Overview
      </Link>
      {SPACE_WEATHER_PAGES.map((p) => (
        <Link
          key={p.slug}
          href={spaceWeatherPath(p.slug)}
          aria-current={current === p.slug ? "page" : undefined}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${current === p.slug ? "border-nasa/50 bg-nasa/10 text-fg" : "border-white/12 text-muted hover:border-white/30 hover:text-fg"}`}
        >
          {p.title}
        </Link>
      ))}
    </nav>
  );
}

/** The section's standing note about what these pages are and are not. */
export function HonestyNote() {
  return (
    <p className="text-xs leading-relaxed text-faint">
      Every value on these pages is fetched from NOAA SWPC or NASA CCMC and carries the provider&apos;s own timestamp. Nothing is
      simulated, interpolated or filled in: when a provider cannot be reached, the panel says so and shows no number. There is no
      overall &ldquo;space weather score&rdquo; here — the agencies publish scales, and a single figure invented on top of them
      would be an opinion wearing NOAA&apos;s authority.
    </p>
  );
}

export { SPACE_WEATHER_SLUGS };
