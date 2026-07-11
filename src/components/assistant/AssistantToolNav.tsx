import Link from "next/link";

const TOOLS: { slug: string; label: string; href: string }[] = [
  { slug: "entity", label: "Explain", href: "/assistant/entity" },
  { slug: "compare", label: "Compare", href: "/assistant/compare" },
  { slug: "evidence-path", label: "Evidence path", href: "/assistant/evidence-path" },
  { slug: "learning", label: "Learning path", href: "/assistant/learning" },
  { slug: "limitations", label: "Limitations", href: "/assistant/limitations" },
];

/** Section nav across the grounded-assistant tools (Program BW). The active tool is highlighted. */
export function AssistantToolNav({ active }: { active: string }) {
  return (
    <nav aria-label="Assistant tools" className="mb-8 flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
      <Link href="/assistant" className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-white/5 hover:text-fg">Capabilities</Link>
      {TOOLS.map((t) => {
        const on = t.slug === active;
        return (
          <Link key={t.slug} href={t.href} aria-current={on ? "page" : undefined} className={`rounded-lg px-3 py-1.5 text-sm ${on ? "bg-nasa/15 text-nasa" : "text-muted hover:bg-white/5 hover:text-fg"}`}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
