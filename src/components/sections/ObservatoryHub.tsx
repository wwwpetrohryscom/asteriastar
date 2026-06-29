import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { topicPath, connectionPath } from "@/lib/routes";

interface ModuleLink {
  title: string;
  href: string;
  note?: string;
}
interface ModuleGroup {
  title: string;
  description: string;
  links: ModuleLink[];
}

/**
 * The Observatory hub — a curated "Celestial Data Platform" directory that
 * organizes night-sky, deep-sky, image, and graph modules and links to the
 * relevant routes. Live-data modules are honest placeholders (see their pages).
 */
const GROUPS: ModuleGroup[] = [
  {
    title: "Night Sky",
    description: "What's happening overhead — prepared for live almanac and space-weather data.",
    links: [
      { title: "Sky Tonight", href: "/sky-guide/night-sky-tonight" },
      { title: "Moon Calendar", href: "/sky-guide/moon-phase" },
      { title: "Planet Visibility", href: "/sky-guide/planet-visibility" },
      { title: "Meteor Showers", href: "/sky-guide/meteor-showers" },
      { title: "Solar Eclipses", href: "/sky-guide/solar-eclipses" },
      { title: "Lunar Eclipses", href: "/sky-guide/lunar-eclipses" },
      { title: "ISS Tracker", href: "/sky-guide/iss-tracker" },
      { title: "Space Weather", href: "/sky-guide/space-weather", note: "Live data planned" },
      { title: "Sun Activity", href: "/sky-guide/sun-activity", note: "Live data planned" },
    ],
  },
  {
    title: "Deep Sky",
    description: "Galaxies, nebulae, clusters, and the telescopes that study them.",
    links: [
      { title: "Deep-Sky Objects", href: topicPath("deep-sky") },
      { title: "Galaxies", href: topicPath("galaxies") },
      { title: "Nebulae", href: topicPath("nebulae") },
      { title: "Black Holes", href: topicPath("black-holes") },
      { title: "Messier Objects", href: connectionPath("messier-objects") },
      { title: "James Webb", href: "/astronomy/space-telescopes/james-webb-space-telescope" },
      { title: "Hubble", href: "/astronomy/space-telescopes/hubble-space-telescope" },
      { title: "Observed by James Webb", href: connectionPath("galaxies-observed-by-james-webb") },
    ],
  },
  {
    title: "Image Archives",
    description: "Openly licensed imagery with full provenance — prepared for official integration.",
    links: [
      { title: "Image Library", href: "/observatory/image-library" },
      { title: "NASA Image Archive", href: "/observatory/nasa-image-archive", note: "Prepared for integration" },
      { title: "ESA Image Archive", href: "/observatory/esa-image-archive", note: "Prepared for integration" },
      { title: "James Webb Gallery", href: "/observatory/james-webb" },
      { title: "Hubble Gallery", href: "/observatory/hubble" },
    ],
  },
  {
    title: "Explore the Graph",
    description: "Directories of the people, instruments, and institutions of spaceflight.",
    links: [
      { title: "Space Telescopes", href: topicPath("telescopes") },
      { title: "Observatories", href: topicPath("observatories") },
      { title: "Space Agencies", href: topicPath("space-agencies") },
      { title: "Launch Vehicles", href: topicPath("launch-vehicles") },
      { title: "Satellites & Stations", href: topicPath("satellites") },
      { title: "Astronomers", href: topicPath("astronomers") },
      { title: "Launches", href: "/observatory/launches", note: "Schedule planned" },
    ],
  },
];

export function ObservatoryHub() {
  return (
    <Container className="mt-8 mb-12 space-y-12">
      {GROUPS.map((group) => (
        <section key={group.title} aria-labelledby={`obs-${group.title}`}>
          <h2 id={`obs-${group.title}`} className="font-display text-2xl font-bold">
            {group.title}
          </h2>
          <p className="mt-1 text-muted">{group.description}</p>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition hover:border-white/25 hover:bg-white/[0.04]"
                >
                  <span className="font-medium text-fg group-hover:text-nebula">{link.title}</span>
                  {link.note && <span className="text-xs text-faint">{link.note}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Container>
  );
}
