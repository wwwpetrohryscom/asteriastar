import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/site/Logo";
import { Container } from "@/components/ui/Container";
import { getImageAsset } from "@/lib/media/registry";
import { getAllSections } from "@/lib/content/registry";
import { categoryPath, sectionPath, ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

/**
 * Premium editorial footer: a cinematic mission band over a real deep-field
 * image, then the knowledge-hub navigation and policy links. Links are derived
 * from the registry, so the footer can never drift out of sync.
 */
export function SiteFooter() {
  const sections = getAllSections();
  const bg = getImageAsset("webb-first-deep-field");

  return (
    <footer className="relative mt-28 border-t border-white/10">
      {/* Mission band */}
      <div className="relative isolate overflow-hidden">
        {bg?.url && (
          <div aria-hidden className="absolute inset-0 -z-10">
            <Image src={bg.url} alt="" fill sizes="100vw" className="object-cover object-center opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-b from-bg/85 via-bg/80 to-bg" />
          </div>
        )}
        <Container className="py-20 text-center sm:py-24">
          <div className="mx-auto max-w-2xl">
            <div className="flex justify-center">
              <Logo idSuffix="footer" />
            </div>
            <h2 className="mt-8 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">{SITE.tagline}</h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/75">{SITE.positioning}</p>
            <p className="mx-auto mt-6 max-w-xl text-xs leading-relaxed text-white/50">{SITE.principle}</p>
          </div>
        </Container>
      </div>

      {/* Navigation */}
      <Container className="py-14">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {sections.map((section) => (
            <div key={section.slug}>
              <h3 className="text-sm font-semibold text-fg">
                <Link href={sectionPath(section)} className="transition hover:text-nasa">
                  {section.name}
                </Link>
              </h3>
              <ul className="mt-3 space-y-2.5">
                {section.categories.slice(0, 4).map((category) => (
                  <li key={category.slug}>
                    <Link href={categoryPath(section, category)} className="text-sm text-muted transition hover:text-fg">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {SITE.founded} {SITE.name}. Everything above Earth — science and tradition, kept clearly apart.</p>
          <nav aria-label="Policies" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href={ROUTES.about} className="transition hover:text-fg">About</Link>
            <Link href={ROUTES.gallery} className="transition hover:text-fg">Gallery</Link>
            <Link href={ROUTES.editorialPolicy} className="transition hover:text-fg">Editorial Policy</Link>
            <Link href={ROUTES.sourcesPolicy} className="transition hover:text-fg">Sources Policy</Link>
            <Link href="/llms.txt" className="transition hover:text-fg">llms.txt</Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
