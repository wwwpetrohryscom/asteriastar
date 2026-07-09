import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { getAllSections } from "@/lib/content/registry";
import { categoryPath, sectionPath, ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

/**
 * Site footer: brand + mission, a column per knowledge hub (with its top
 * categories), policy links, and the science/tradition principle. All links
 * are derived from the registry, so the footer can never drift out of sync.
 */
export function SiteFooter() {
  const sections = getAllSections();

  return (
    <footer className="mt-24 border-t border-white/10 bg-bg-elevated/40">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo idSuffix="footer" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {SITE.description}
            </p>
            <p className="mt-4 max-w-sm rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs leading-relaxed text-faint">
              {SITE.principle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
            {sections.map((section) => (
              <div key={section.slug}>
                <h2 className="text-sm font-semibold text-fg">
                  <Link href={sectionPath(section)} className="transition hover:text-nebula">
                    {section.name}
                  </Link>
                </h2>
                <ul className="mt-3 space-y-2">
                  {section.categories.slice(0, 4).map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={categoryPath(section, category)}
                        className="text-sm text-muted transition hover:text-fg"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {SITE.founded} {SITE.name}. Everything above Earth — science and tradition, kept clearly apart.
          </p>
          <nav aria-label="Policies" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={ROUTES.about} className="transition hover:text-fg">
              About
            </Link>
            <Link href={ROUTES.editorialPolicy} className="transition hover:text-fg">
              Editorial Policy
            </Link>
            <Link href={ROUTES.sourcesPolicy} className="transition hover:text-fg">
              Sources Policy
            </Link>
            <Link href="/llms.txt" className="transition hover:text-fg">
              llms.txt
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
