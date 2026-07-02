import Link from "next/link";
import type { CosmoCard } from "@/app/cosmology/discovery";
import { ConsensusBadge } from "@/components/cosmology/Consensus";

/** A responsive grid of cosmology cards, each showing its consensus level. */
export function CosmoCardGrid({ cards }: { cards: CosmoCard[] }) {
  if (!cards.length) return null;
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <li key={card.slug}>
          <Link
            href={card.href}
            className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-faint">{card.kind}</span>
            <h3 className="mt-1 font-display text-lg font-semibold text-fg group-hover:text-nebula">{card.name}</h3>
            {card.consensus && <div className="mt-2"><ConsensusBadge level={card.consensus} /></div>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
