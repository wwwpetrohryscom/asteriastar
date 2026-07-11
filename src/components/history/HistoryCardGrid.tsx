import Link from "next/link";
import type { HistoryCard } from "@/app/history/discovery";

/** A responsive grid of uniform history cards (astronomers, discoveries, publications, …). */
export function HistoryCardGrid({ cards }: { cards: HistoryCard[] }) {
  if (!cards.length) return null;
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <li key={c.slug}>
          <Link
            href={c.href}
            className="group flex h-full flex-col scientific-card p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-faint">{c.kind}</span>
            <h3 className="mt-1 font-display text-lg font-semibold text-fg group-hover:text-nasa">{c.name}</h3>
            {c.meta && <p className="mt-1 text-sm text-muted">{c.meta}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
