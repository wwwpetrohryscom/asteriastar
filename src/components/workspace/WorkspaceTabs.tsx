import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const TABS: { slug: string; label: string; href: string }[] = [
  { slug: "", label: "Overview", href: ROUTES.workspace },
  { slug: "collections", label: "Collections", href: `${ROUTES.workspace}/collections` },
  { slug: "notes", label: "Notes", href: `${ROUTES.workspace}/notes` },
  { slug: "citations", label: "Citations", href: `${ROUTES.workspace}/citations` },
  { slug: "exports", label: "Exports", href: `${ROUTES.workspace}/exports` },
  { slug: "privacy", label: "Privacy", href: `${ROUTES.workspace}/privacy` },
];

/** The workspace section nav (Program BV). Server-rendered links; the active tab is highlighted. */
export function WorkspaceTabs({ active }: { active: string }) {
  return (
    <nav aria-label="Workspace sections" className="mb-8 flex flex-wrap gap-1.5 border-b border-white/10 pb-3 print:hidden">
      {TABS.map((t) => {
        const on = t.slug === active;
        return (
          <Link
            key={t.slug || "overview"}
            href={t.href}
            aria-current={on ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 text-sm ${on ? "bg-halo/15 text-halo" : "text-muted hover:bg-white/5 hover:text-fg"}`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
