import Link from "next/link";

export interface HsfCardItem {
  id: string;
  name: string;
  href: string;
  kindLabel: string;
  meta?: string;
  description?: string;
  status?: string;
}

export function HsfStatusPill({ status }: { status?: string }) {
  if (!status) return null;
  const active = /operational|active/i.test(status);
  const planned = /planned|development/i.test(status);
  const tone = active ? "text-success-strong border-success/25 bg-success/10"
    : planned ? "text-nasa border-nasa/40 bg-nasa/10"
    : "text-muted border-white/10 bg-white/[0.03]";
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${tone}`}>{status}</span>;
}

/** Card grid for human-spaceflight entities (stations, modules, spacecraft, people…). */
export function HsfCards({ items }: { items: HsfCardItem[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <li key={it.id}>
          <Link href={it.href} className="group flex h-full flex-col scientific-card p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nasa">{it.name}</h3>
              {it.status && <HsfStatusPill status={it.status} />}
            </div>
            {it.meta && <p className="mt-1 text-xs uppercase tracking-wide text-faint">{it.meta}</p>}
            {it.description && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{it.description}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
