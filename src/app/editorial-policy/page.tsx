import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage } from "@/components/sections/EditorialPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTES } from "@/lib/routes";
import { ASTROLOGY_DISCLAIMER } from "@/lib/site";

const PATH = ROUTES.editorialPolicy;
const DESCRIPTION =
  "Asteria Star's editorial policy: accuracy, sourcing, no fabricated facts or statistics, and the clear separation of scientific astronomy from interpretive astrology.";

export const metadata: Metadata = buildMetadata({
  title: "Editorial Policy",
  description: DESCRIPTION,
  path: PATH,
});

export default function EditorialPolicyPage() {
  return (
    <EditorialPage
      title="Editorial Policy"
      lead="The standards that keep Asteria Star accurate, honest, and trustworthy."
      path={PATH}
      description={DESCRIPTION}
      updated="2026-06-29"
    >
      <h2>0. Our scope</h2>
      <p>
        Asteria Star covers <strong>everything above Earth</strong>: astronomy,
        space exploration, the night sky, celestial events, observation and
        astrophotography, the history and mythology of the sky, and astrology as
        a separate cultural tradition. The standards below apply across all of
        it.
      </p>

      <h2>1. Accuracy before everything</h2>
      <p>
        We publish what is well established and clearly mark what is uncertain or
        still being developed. We do not invent astronomical data, statistics,
        dates, or measurements. Where a page has not yet been fully written, we
        say so plainly rather than padding it with filler.
      </p>

      <h2>2. Sourcing</h2>
      <p>
        Factual astronomy content is written to be cited from authoritative
        primary and reference sources. Every topic declares the source slots it
        draws on, and specific claims will carry specific citations. See our{" "}
        <Link href={ROUTES.sourcesPolicy}>sources policy</Link> for the full
        list and how we use it. We do not scrape, and we do not republish
        unverified claims.
      </p>

      <h2>3. Astronomy is science</h2>
      <p>
        Astronomy content is presented as evidence-based science. We describe the
        consensus understanding, attribute it to sources, and avoid speculation
        dressed up as fact.
      </p>

      <h2>4. Astrology is tradition — and labeled as such</h2>
      <p>
        Astrology, numerology, and related practices are presented as cultural,
        symbolic, historical, and interpretive material. Every astrology page
        carries this disclaimer:
      </p>
      <p>
        <strong>{ASTROLOGY_DISCLAIMER}</strong>
      </p>
      <p>
        We never present astrology as scientifically proven, and we never mix
        astrological claims into scientific astronomy pages.
      </p>

      <h2>5. No fabrication</h2>
      <ul>
        <li>No invented statistics, ratings, or counts.</li>
        <li>No fabricated astronomical figures, distances, or dates.</li>
        <li>No fake quotes, sources, or endorsements.</li>
        <li>No placeholder lorem ipsum in published copy.</li>
      </ul>

      <h2>6. Imagery and media</h2>
      <p>
        We use only openly licensed or public-domain imagery, and we record each
        item&apos;s source, license, and required attribution before publishing
        it. Details are in the <Link href={ROUTES.sourcesPolicy}>sources policy</Link>.
      </p>

      <h2>7. Corrections</h2>
      <p>
        When we find an error, we fix it and note material corrections. Accuracy
        is more important to us than appearing infallible.
      </p>

      <h2>8. Use of automation</h2>
      <p>
        We may use software to help structure and draft content, but editorial
        responsibility — and the duty to verify facts against real sources —
        always rests with people. Automation never overrides the rules above.
      </p>
    </EditorialPage>
  );
}
