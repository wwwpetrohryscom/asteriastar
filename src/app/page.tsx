import Image from "next/image";
import Link from "next/link";
import { SectionGrid } from "@/components/sections/SectionGrid";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroSearch } from "@/components/site/HeroSearch";
import { KnowledgeGraphPreview } from "@/components/graph/KnowledgeGraphPreview";
import { getAllSections, REGISTRY_STATS } from "@/lib/content/registry";
import { getHeroImageForEntity, getImageAsset } from "@/lib/media/registry";
import { IMAGE_LICENSE_LABELS } from "@/lib/media/types";
import { ENTRY_STATS } from "@/content/entries";
import { GRAPH_STATS } from "@/knowledge-graph";
import { sectionPath, topicPath, ROUTES } from "@/lib/routes";

const POPULAR_TOPICS = [
  ["stars", "Stars"],
  ["planets", "Planets"],
  ["galaxies", "Galaxies"],
  ["missions", "Missions"],
  ["telescopes", "Telescopes"],
  ["constellations", "Constellations"],
] as const;

/** Image props for an entity's hero, or null when it has none. */
function pic(entityId: string) {
  const h = getHeroImageForEntity(entityId);
  return h?.url ? { url: h.url, alt: h.alt, blurDataURL: h.blurDataURL, title: h.title, credit: h.credit, license: h.license } : null;
}

const HERO = getImageAsset("webb-cosmic-cliffs");

// Featured observations — real objects, each linking to its page.
const FEATURED = [
  { id: "galaxy:andromeda-galaxy", href: "/explore/entity/galaxy/andromeda-galaxy", cat: "Galaxy", blurb: "The nearest large spiral to the Milky Way, imaged across the spectrum." },
  { id: "nebula:crab-nebula", href: "/explore/entity/nebula/crab-nebula", cat: "Supernova remnant", blurb: "The expanding wreck of a star seen exploding in 1054 CE." },
  { id: "planet:jupiter", href: "/solar-system/jupiter", cat: "Planet", blurb: "The Solar System's largest world and its centuries-old storm." },
  { id: "space_telescope:james-webb-space-telescope", href: "/astronomy/space-telescopes/james-webb-space-telescope", cat: "Space telescope", blurb: "Infrared eyes on the earliest galaxies and forming stars." },
] as const;

// A representative real image for each knowledge hub.
const HUB_IMAGE: Record<string, string> = {
  astronomy: "galaxy:whirlpool-galaxy",
  "sky-guide": "moon:the-moon",
  astrology: "constellation:orion",
  calculators: "star:sun",
  encyclopedia: "space_mission:apollo-11",
  observatory: "space_telescope:hubble-space-telescope",
  guides: "nebula:eagle-nebula",
};

function licenseShort(license?: string) {
  return license ? IMAGE_LICENSE_LABELS[license as keyof typeof IMAGE_LICENSE_LABELS] ?? license : "";
}

export default function HomePage() {
  const sections = getAllSections();

  const hubCards = sections.map((section) => {
    const img = HUB_IMAGE[section.slug] ? pic(HUB_IMAGE[section.slug]) : null;
    return {
      title: section.name,
      description: section.tagline,
      href: sectionPath(section),
      accent: section.accent,
      eyebrow: `${section.categories.length} topics`,
      image: img ? { url: img.url, alt: img.alt, blurDataURL: img.blurDataURL } : undefined,
    };
  });

  const iod = pic("nebula:orion-nebula");

  return (
    <>
      {/* ── Cinematic hero: a real observation behind the platform intro ── */}
      <section className="relative isolate overflow-hidden border-b border-white/10">
        {HERO?.url && (
          <div aria-hidden className="absolute inset-0 -z-10">
            <Image src={HERO.url} alt="" fill priority sizes="100vw" className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/40 to-transparent" />
          </div>
        )}
        <Container className="flex min-h-[78svh] flex-col justify-end pb-14 pt-24 sm:pb-20">
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              <span className="inline-block h-3 w-1 rounded-full bg-nasa-red" />
              Astronomy knowledge platform
            </p>
            <h1 className="font-display text-5xl font-bold leading-[1.02] text-white sm:text-7xl lg:text-8xl">
              Everything <span className="text-nasa">Above Earth</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
              A premium, source-first atlas of the universe — planets, moons, galaxies, nebulae, missions and
              observatories — with real scientific imagery on every page.
            </p>
            <div className="mt-8 max-w-2xl">
              <HeroSearch />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-white/60">Browse:</span>
              {POPULAR_TOPICS.map(([slug, label]) => (
                <Link
                  key={slug}
                  href={topicPath(slug)}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/85 backdrop-blur-md transition hover:border-nasa/60 hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={ROUTES.explore}>Explore the universe</Button>
              <Button href={ROUTES.gallery} variant="secondary">Image gallery</Button>
            </div>
            <p className="mt-8 max-w-2xl border-t border-white/15 pt-5 text-sm text-white/55">
              {REGISTRY_STATS.categoryCount} topic areas · {ENTRY_STATS.total} entries · {GRAPH_STATS.entityCount} graph entities · {GRAPH_STATS.relationCount} mapped connections
            </p>
          </div>
        </Container>
      </section>

      {/* ── Featured observations (NASA-style image cards) ── */}
      <Container className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nasa">Featured</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-fg sm:text-3xl">Real objects, real imagery</h2>
          </div>
          <Link href={ROUTES.gallery} className="hidden shrink-0 text-sm text-muted transition hover:text-fg sm:block">
            Browse the gallery →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURED.map((f) => {
            const img = pic(f.id);
            if (!img) return null;
            return (
              <Link
                key={f.id}
                href={f.href}
                className="group flex flex-col overflow-hidden rounded-lg border border-silver/12 bg-bg-elevated/80 shadow-[0_16px_60px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:border-nasa/50"
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-black">
                  <Image src={img.url} alt={img.alt} fill sizes="(min-width: 1280px) 24vw, (min-width: 640px) 50vw, 100vw" placeholder={img.blurDataURL ? "blur" : "empty"} blurDataURL={img.blurDataURL} className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur-md">{f.cat}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold text-fg">{img.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.blurb}</p>
                  <p className="mt-4 text-[11px] leading-relaxed text-faint">{img.credit} · {licenseShort(img.license)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>

      {/* ── Explore the platform: image-forward hub grid ── */}
      <Container className="mt-20">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nasa">Explore the platform</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-fg sm:text-3xl">Seven knowledge hubs</h2>
          <p className="mt-2 max-w-2xl text-muted">From physical astronomy and observing to reference, calculators, and the cultural history of the sky.</p>
        </div>
        <SectionGrid items={hubCards} columns={3} />
      </Container>

      {/* ── Image of the day ── */}
      {iod && (
        <Container className="mt-20">
          <div className="grid items-center gap-8 overflow-hidden rounded-xl border border-white/10 bg-bg-elevated/70 lg:grid-cols-[1.4fr_1fr]">
            <div className="relative aspect-[16/10] w-full bg-black lg:aspect-auto lg:h-full lg:min-h-[380px]">
              <Image src={iod.url} alt={iod.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" placeholder={iod.blurDataURL ? "blur" : "empty"} blurDataURL={iod.blurDataURL} className="object-cover" />
            </div>
            <div className="p-7 lg:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nasa">Featured observation</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-fg sm:text-3xl">{iod.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{iod.alt}</p>
              <p className="mt-4 text-xs text-faint">{iod.credit} · {licenseShort(iod.license)}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/explore/entity/nebula/orion-nebula">Open the object</Button>
                <Button href={ROUTES.gallery} variant="secondary">More imagery</Button>
              </div>
            </div>
          </div>
        </Container>
      )}

      {/* ── Science vs. tradition principle ── */}
      <Container className="mt-20">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border-l-2 border-nasa/60 bg-bg-elevated/72 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-nasa">Astronomy is evidence</p>
            <p className="mt-3 leading-relaxed text-muted">Scientific pages are sourced from institutions, observatories, datasets, and peer-reviewed literature. Unknown values stay blank; imagery is real and credited.</p>
          </div>
          <div className="rounded-lg border-l-2 border-gold/60 bg-bg-elevated/72 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Tradition is labeled</p>
            <p className="mt-3 leading-relaxed text-muted">Mythology and astrology are handled as culture, history, and symbolism — clearly separated, never presented as proven physical science.</p>
          </div>
        </div>
      </Container>

      {/* ── Knowledge graph preview ── */}
      <Container className="mt-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nasa">Connected knowledge</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-fg sm:text-3xl">The knowledge graph</h2>
            <p className="mt-2 max-w-2xl text-muted">Objects, missions, instruments, discoveries and cultural records are linked — without flattening science and tradition into the same claim.</p>
          </div>
          <Link href={ROUTES.explore} className="hidden shrink-0 text-sm text-muted transition hover:text-fg sm:block">Explore all →</Link>
        </div>
        <KnowledgeGraphPreview ids={["star:sirius", "constellation:orion", "space_telescope:james-webb-space-telescope"]} />
      </Container>

      {/* ── Tools ── */}
      <Container className="mt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nasa">Ways to explore</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-fg sm:text-3xl">Observatory tools</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { href: ROUTES.explore, title: "Explore", desc: "Navigate the graph by topic and connection." },
            { href: ROUTES.gallery, title: "Gallery", desc: "Webb, Hubble & the deep sky — openly-licensed." },
            { href: ROUTES.compare, title: "Compare", desc: "Objects and ideas, side by side." },
            { href: ROUTES.learn, title: "Learn", desc: "Guided paths from beginner to advanced." },
            { href: ROUTES.timelines, title: "Timelines", desc: "The history of astronomy and spaceflight." },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg border border-silver/12 bg-bg-elevated/72 p-5 transition hover:-translate-y-0.5 hover:border-nasa/50 hover:bg-surface/82">
              <h3 className="font-display text-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
      </Container>

      <CTASection
        title="Scientific knowledge with editorial discipline."
        description="AsteriaStar is a durable astronomy knowledge system: sourced entries, structured data, real image provenance, and internal links that scale without losing trust."
        actions={[
          { label: "Read our editorial policy", href: ROUTES.editorialPolicy },
          { label: "See our sources", href: ROUTES.sourcesPolicy, variant: "secondary" },
        ]}
      />
    </>
  );
}
