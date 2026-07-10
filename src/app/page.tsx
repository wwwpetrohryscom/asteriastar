import Image from "next/image";
import Link from "next/link";
import { SectionGrid } from "@/components/sections/SectionGrid";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroSearch } from "@/components/site/HeroSearch";
import { KnowledgeGraphPreview } from "@/components/graph/KnowledgeGraphPreview";
import { PhotoBackdrop } from "@/components/cosmos/PhotoBackdrop";
import { StarChartAccent, ConstellationDivider } from "@/components/cosmos/Cosmos";
import { getAllSections, REGISTRY_STATS } from "@/lib/content/registry";
import { getImageAsset } from "@/lib/media/registry";
import type { ImageAsset } from "@/lib/media/types";
import { ENTRY_STATS } from "@/content/entries";
import { GRAPH_STATS } from "@/knowledge-graph";
import { sectionPath, categoryPath, topicPath, ROUTES } from "@/lib/routes";

const POPULAR_TOPICS = [
  ["stars", "Stars"],
  ["planets", "Planets"],
  ["galaxies", "Galaxies"],
  ["missions", "Missions"],
  ["telescopes", "Telescopes"],
  ["constellations", "Constellations"],
] as const;

const mustImage = (id: string): ImageAsset => {
  const image = getImageAsset(id);
  if (!image) throw new Error(`Missing editorial image asset: ${id}`);
  return image;
};

const HERO_IMAGE = mustImage("webb-cosmic-cliffs");

const EDITORIAL_FEATURES = [
  {
    image: mustImage("webb-first-deep-field"),
    kicker: "Deep field",
    title: "Infrared astronomy at cosmic scale",
    description: "Webb turns gravitational lensing into a reading instrument for the early universe.",
    href: "/astronomy/space-missions/james-webb-space-telescope",
  },
  {
    image: mustImage("hubble-pillars-creation"),
    kicker: "Iconic Hubble",
    title: "Images as scientific evidence",
    description: "Every image is treated as a sourced record: mission, instrument, license, credit, and original archive.",
    href: ROUTES.images,
  },
  {
    image: mustImage("blue-marble-viirs"),
    kicker: "Planetary perspective",
    title: "From Earth outward",
    description: "The platform connects planets, missions, telescopes, discoveries, and observing guides into one graph.",
    href: "/astronomy/planets/earth",
  },
] as const;

function EditorialImage({
  asset,
  priority = false,
  sizes,
  className = "",
}: {
  asset: ImageAsset;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  return (
    <figure className={`relative overflow-hidden rounded-lg border border-silver/15 bg-surface shadow-[0_22px_80px_rgba(0,0,0,0.36)] ${className}`}>
      <Image
        src={asset.url ?? ""}
        alt={asset.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-bg/72 px-4 py-3 text-[11px] leading-relaxed text-silver backdrop-blur-md">
        <span className="font-medium text-fg">{asset.title}</span>
        <span className="text-faint"> · {asset.credit}</span>
      </figcaption>
    </figure>
  );
}

export default function HomePage() {
  const sections = getAllSections();

  const hubCards = sections.map((section) => ({
    title: section.name,
    description: section.tagline,
    href: sectionPath(section),
    accent: section.accent,
    eyebrow: `${section.categories.length} topics`,
  }));

  // A small, honest sampling of featured topics across hubs for internal links.
  const featured = [
    ["astronomy", "black-holes"],
    ["sky-guide", "meteor-showers"],
    ["astronomy", "exoplanets"],
    ["observatory", "james-webb"],
    ["guides", "how-stars-form"],
    ["encyclopedia", "greek-mythology"],
  ].map(([s, c]) => {
    const section = sections.find((x) => x.slug === s)!;
    const category = section.categories.find((x) => x.slug === c)!;
    return {
      title: category.name,
      description: category.summary,
      href: categoryPath(section, category),
      accent: section.accent,
      eyebrow: section.name,
    };
  });

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <PhotoBackdrop variant="hero" priority />
        <Container className="grid min-h-[calc(100svh-4.25rem)] items-end gap-10 pb-10 pt-16 lg:grid-cols-[minmax(0,0.96fr)_minmax(360px,0.74fr)] lg:pb-16 lg:pt-24">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-silver">
              Astronomy knowledge platform
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] text-fg sm:text-7xl lg:text-8xl">
              AsteriaStar
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-silver sm:text-xl">
              A premium atlas for astronomy, space missions, observatories, sky events, and the cultural history of the night sky.
            </p>
            <div className="mt-8 max-w-2xl">
              <HeroSearch />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-faint">Browse:</span>
              {POPULAR_TOPICS.map(([slug, label]) => (
                <Link
                  key={slug}
                  href={topicPath(slug)}
                  className="rounded-full border border-silver/15 bg-bg/44 px-3 py-1 text-muted backdrop-blur-md transition hover:border-gold/35 hover:text-fg"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={ROUTES.explore}>Explore the universe</Button>
              <Button href={ROUTES.images} variant="secondary">
                View image archive
              </Button>
            </div>
            <p className="mt-8 max-w-2xl border-t border-silver/15 pt-5 text-sm text-faint">
              {REGISTRY_STATS.categoryCount} topic areas · {ENTRY_STATS.total} entries · {GRAPH_STATS.entityCount} graph entities · {GRAPH_STATS.relationCount} mapped connections
            </p>
          </div>

          <div className="hidden lg:block">
            <EditorialImage
              asset={HERO_IMAGE}
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="aspect-[5/6]"
            />
          </div>
        </Container>
      </section>

      <Container className="mt-10">
        <div className="grid gap-4 md:grid-cols-3">
          {EDITORIAL_FEATURES.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group overflow-hidden rounded-lg border border-silver/12 bg-bg-elevated/76 shadow-[0_16px_60px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-0.5 hover:border-gold/35"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-surface">
                <Image
                  src={feature.image.url ?? ""}
                  alt={feature.image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-gold">{feature.kicker}</p>
                <h2 className="mt-2 font-display text-xl font-semibold text-fg">{feature.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
                <p className="mt-4 text-[11px] leading-relaxed text-faint">
                  {feature.image.credit} · {feature.image.license === "nasa-media" ? "NASA media" : feature.image.license}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      <Container className="mt-16">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-halo/20 bg-bg-elevated/72 p-6 shadow-[0_14px_50px_rgba(0,0,0,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-halo">
              Astronomy is evidence
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              Scientific pages are sourced from institutions, observatories, datasets, and peer-reviewed literature. Unknown values stay blank.
            </p>
          </div>
          <div className="rounded-lg border border-gold/22 bg-bg-elevated/72 p-6 shadow-[0_14px_50px_rgba(0,0,0,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Tradition is labeled
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              Mythology and astrology are handled as culture, history, and symbolism, never as proven physical science.
            </p>
          </div>
        </div>
      </Container>

      <ConstellationDivider idKey="hubs" className="mt-16" />

      {/* The seven hubs. */}
      <Container className="mt-8">
        <div className="mb-6">
          <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold sm:text-3xl">
            <StarChartAccent /> Field Guide
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Topic hubs organize the platform from physical astronomy to observing, reference, and learning paths.
          </p>
        </div>
        <SectionGrid items={hubCards} columns={3} />
      </Container>

      {/* Knowledge graph preview. */}
      <Container className="mt-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold sm:text-3xl">
              <StarChartAccent /> Knowledge Graph
            </h2>
            <p className="mt-2 max-w-2xl text-muted">
              Objects, missions, instruments, discoveries, and cultural records are connected without flattening science and tradition into the same claim type.
            </p>
          </div>
          <Link
            href={ROUTES.explore}
            className="hidden shrink-0 text-sm text-muted transition hover:text-fg sm:block"
          >
            Explore all →
          </Link>
        </div>
        <KnowledgeGraphPreview
          ids={[
            "star:sirius",
            "constellation:orion",
            "space_telescope:james-webb-space-telescope",
          ]}
        />
      </Container>

      <Container className="mt-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Editorial Pathways
          </h2>
          <Link
            href={ROUTES.about}
            className="hidden text-sm text-muted transition hover:text-fg sm:block"
          >
            Why we built this →
          </Link>
        </div>
        <SectionGrid items={featured} columns={3} />
      </Container>

      <ConstellationDivider idKey="ways" className="mt-16" />

      <Container className="mt-8">
        <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold sm:text-3xl"><StarChartAccent /> Observatory Tools</h2>
        <p className="mt-2 max-w-2xl text-muted">
          The graph powers articles, comparisons, guided learning, timelines, and a provenance-first image archive.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: ROUTES.explore, title: "Explore", desc: "Navigate the graph by topic and connection." },
            { href: ROUTES.gallery, title: "Gallery", desc: "Webb, Hubble & the deep sky — openly-licensed imagery." },
            { href: ROUTES.compare, title: "Compare", desc: "Objects and ideas, side by side." },
            { href: ROUTES.learn, title: "Learn", desc: "Guided paths from beginner to advanced." },
            { href: ROUTES.timelines, title: "Timelines", desc: "The history of astronomy and spaceflight." },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-silver/12 bg-bg-elevated/72 p-5 shadow-[0_14px_50px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-gold/35 hover:bg-surface/82"
            >
              <h3 className="font-display text-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
      </Container>

      <CTASection
        title="Scientific knowledge with editorial discipline."
        description="AsteriaStar is designed as a durable astronomy knowledge system: sourced entries, structured data, image provenance, and internal links that can scale without losing trust."
        actions={[
          { label: "Read our editorial policy", href: ROUTES.editorialPolicy },
          { label: "See our sources", href: ROUTES.sourcesPolicy, variant: "secondary" },
        ]}
      />
    </>
  );
}
