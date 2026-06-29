import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionGrid } from "@/components/sections/SectionGrid";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getAllSections, REGISTRY_STATS } from "@/lib/content/registry";
import { ENTRY_STATS } from "@/content/entries";
import { sectionPath, categoryPath, ROUTES } from "@/lib/routes";

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
      <HeroSection
        accent="nebula"
        eyebrow={<span>A global knowledge platform for the sky</span>}
        title={
          <>
            Everything <span className="accent-text">Above Earth</span>.
          </>
        }
        lead="Explore stars, planets, galaxies, missions, telescopes, night-sky events, mythology, and the symbolic traditions humans built around the sky."
        actions={
          <>
            <Button href="/astronomy">Explore Astronomy</Button>
            <Button href="/sky-guide" variant="secondary">
              Tonight&apos;s Sky
            </Button>
          </>
        }
      >
        <p className="mt-6 text-sm text-faint">
          {REGISTRY_STATS.sectionCount} knowledge hubs · {REGISTRY_STATS.categoryCount} topic areas · {ENTRY_STATS.total} entries · built to scale
        </p>
      </HeroSection>

      {/* The defining principle: science vs. tradition, side by side. */}
      <Container className="mt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-nebula">
              Astronomy — Science
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              Evidence-based and sourced. We describe what is well established,
              cite authoritative references, and never invent figures or facts.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">
              Astrology — Tradition
            </p>
            <p className="mt-3 leading-relaxed text-muted">
              Cultural, symbolic, and interpretive heritage — clearly labeled as
              such. Presented as tradition and history, never as proven science.
            </p>
          </div>
        </div>
      </Container>

      {/* The seven hubs. */}
      <Container className="mt-20">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Explore the platform
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Seven hubs organize everything from stars and spacecraft to sky
            events, calculators, and the history behind it all.
          </p>
        </div>
        <SectionGrid items={hubCards} columns={3} />
      </Container>

      {/* Featured topics — internal linking across hubs. */}
      <Container className="mt-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Start exploring
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

      <CTASection
        title="Knowledge first. Built to grow."
        description="Asteria Star starts as a rigorous encyclopedia of the sky and is architected to grow into tools, galleries, and — in time — a community."
        actions={[
          { label: "Read our editorial policy", href: ROUTES.editorialPolicy },
          { label: "See our sources", href: ROUTES.sourcesPolicy, variant: "secondary" },
        ]}
      />
    </>
  );
}
