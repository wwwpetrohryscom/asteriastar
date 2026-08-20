import Link from "next/link";
import { EcosystemDisclosure } from "@/components/ecosystem/EcosystemDisclosure";
import { EcosystemDirectory } from "@/components/ecosystem/EcosystemLinks";
import { ECOSYSTEM_COUNTS, ECOSYSTEM_PATH } from "@/lib/ecosystem/projects";

/**
 * The global HELPERG ecosystem bar.
 *
 * Server Component. It sits above the AsteriaStar header as the topmost layer
 * of every public page, and it is deliberately quieter than the site header:
 * AsteriaStar is the product a visitor came for, and this is the shelf it sits
 * on.
 *
 * LAYOUT: `sticky top-0` with a height fixed by `--ecosystem-bar-height`. Note
 * that `relative` must NOT be added alongside it: both compile to a `position`
 * declaration, the winner is decided by stylesheet order rather than by the
 * order of the class names, and the first version of this component lost that
 * race and quietly scrolled away. It is not needed anyway — a sticky element is
 * already a containing block for the absolutely positioned panel. The
 * site header is `sticky top-[var(--ecosystem-bar-height)]`, so the two stack
 * as the page scrolls and both stay visible. Because both are in normal
 * document flow, content is never underneath either one and nothing has to be
 * pushed down with a computed offset — which is also why this costs no layout
 * shift: the bar occupies its height from the very first server-rendered paint,
 * never appears after hydration, and never measures itself.
 *
 * INDEXING: every ecosystem link is rendered here, by the server, inside
 * `EcosystemDirectory`. The panel is collapsed with the `hidden` attribute, not
 * absent from the document — a disclosure, not a fetch-on-click. A crawler that
 * never runs JavaScript sees all 33 outbound links in the HTML;
 * `scripts/validate-ecosystem-rendering.ts` asserts exactly that against the
 * built output, so it cannot regress into a client-only menu.
 */
export function EcosystemBar() {
  return (
    <nav
      aria-label="HELPERG Ecosystem"
      className="sticky top-0 z-[60] h-[var(--ecosystem-bar-height)] border-b border-silver/12 bg-[#050505] pt-[env(safe-area-inset-top)]"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center gap-2 px-4 sm:gap-3 sm:px-8">
        {/* The hub itself, and the one strong accent in the row. */}
        <a
          href="https://helperg.com"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[0.7rem] font-semibold tracking-[0.09em] text-fg transition-colors hover:text-nasa focus-visible:text-nasa sm:text-xs"
        >
          HELPERG
        </a>

        <span aria-hidden="true" className="h-3 w-px shrink-0 bg-silver/20" />

        {/* The crawlable home of the directory. A real link, not the toggle. */}
        <Link
          href={ECOSYSTEM_PATH}
          className="shrink-0 text-[0.7rem] text-muted transition-colors hover:text-fg focus-visible:text-fg sm:text-xs"
        >
          Ecosystem
        </Link>

        <span className="hidden truncate text-[0.7rem] text-faint sm:inline sm:text-xs">
          <span aria-hidden="true" className="px-1.5">·</span>
          {ECOSYSTEM_COUNTS.websites} websites · {ECOSYSTEM_COUNTS.apps} apps
        </span>

        <span className="ml-auto" />

        <EcosystemDisclosure label="the HELPERG ecosystem directory" summary="Explore our products">
          <EcosystemDirectory />
          <div className="border-t border-silver/10 px-4 py-3 sm:px-8">
            <Link
              href={ECOSYSTEM_PATH}
              className="text-[0.6875rem] font-medium text-nasa transition-opacity hover:opacity-80"
            >
              View the full ecosystem directory →
            </Link>
          </div>
        </EcosystemDisclosure>
      </div>
    </nav>
  );
}
