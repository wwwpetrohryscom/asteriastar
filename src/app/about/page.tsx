import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage } from "@/components/sections/EditorialPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/routes";
import { REGISTRY_STATS } from "@/lib/content/registry";

const PATH = ROUTES.about;
const DESCRIPTION =
  "About Asteria Star: our mission to build a trusted, beautiful knowledge platform for astronomy and the night sky, with astrology kept clearly separate as cultural tradition.";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: DESCRIPTION,
  path: PATH,
});

export default function AboutPage() {
  return (
    <EditorialPage
      title="About Asteria Star"
      lead="A serious knowledge platform for the sky — scientifically credible, beautifully made, and built to last."
      path={PATH}
      description={DESCRIPTION}
      updated="2026-06-29"
    >
      <h2>Our mission</h2>
      <p>
        Asteria Star exists to help people study the real universe — stars,
        galaxies, planets, and the events of the night sky — and to explore the
        long human tradition of finding meaning in the heavens. We want to be a
        trusted, global home for celestial knowledge, not another low-quality
        horoscope site.
      </p>

      <h2>Science and tradition, kept apart</h2>
      <p>
        Our defining principle is a clear boundary between two very different
        things. <strong>Astronomy</strong> is the science of the universe: it is
        evidence-based, sourced, and factual. <strong>Astrology</strong> is a
        cultural and symbolic tradition: it is interpretive and historical, and
        we present it as heritage — never as proven science. We never mix
        scientific astronomy claims with astrological ones.
      </p>

      <h2>What&apos;s here now</h2>
      <p>
        This is the foundation of the platform. It establishes{" "}
        {REGISTRY_STATS.sectionCount} knowledge hubs spanning{" "}
        {REGISTRY_STATS.categoryCount} topic areas — from{" "}
        <Link href="/astronomy">Astronomy</Link> and the{" "}
        <Link href="/sky-guide">Sky Guide</Link> to{" "}
        <Link href="/astrology">Astrology</Link>,{" "}
        <Link href="/encyclopedia">the Encyclopedia</Link>, and more. Each topic
        is a structured, source-ready page designed to grow into deep,
        well-cited reference material.
      </p>

      <h2>What&apos;s coming</h2>
      <p>
        We are building outward from this base: location-aware sky tools,
        interactive calculators, curated galleries of openly licensed imagery,
        and structured entries for individual objects. In time, Asteria Star is
        architected to support community features — profiles, saved charts, and
        sharing — without compromising the integrity of the reference content.
      </p>

      <h2>How we work</h2>
      <p>
        Our standards are public. Read our{" "}
        <Link href={ROUTES.editorialPolicy}>editorial policy</Link> for how we
        handle accuracy, sourcing, and the labeling of interpretive content, and
        our <Link href={ROUTES.sourcesPolicy}>sources policy</Link> for the
        authoritative references we draw on.
      </p>
    </EditorialPage>
  );
}
