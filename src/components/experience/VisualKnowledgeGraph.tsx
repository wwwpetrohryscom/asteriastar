import Link from "next/link";
import type { RuntimeEntity } from "@/platform/runtime";
import { entityGraphPath, relationLabel } from "@/knowledge-graph";
import { ScientificIcon } from "@/components/experience/ScientificIcons";

const NODE_POSITIONS = [
  [430, 64],
  [646, 110],
  [756, 260],
  [646, 410],
  [430, 456],
  [214, 410],
  [104, 260],
  [214, 110],
  [520, 160],
  [340, 160],
  [520, 360],
  [340, 360],
] as const;

const DOMAIN_STYLES = {
  science: { stroke: "#8fb0d4", fill: "#0b3d91", text: "text-halo", chip: "border-halo/20 bg-halo/[0.06]" },
  culture: { stroke: "#e7c98a", fill: "#5c4a25", text: "text-gold", chip: "border-gold/25 bg-gold/[0.06]" },
  astrology: { stroke: "#c8d2e6", fill: "#303847", text: "text-silver", chip: "border-silver/20 bg-silver/[0.05]" },
  editorial: { stroke: "#d4e0f4", fill: "#243248", text: "text-silver", chip: "border-silver/20 bg-silver/[0.05]" },
} as const;

function sortConnections(entity: RuntimeEntity) {
  const priority = { science: 0, editorial: 1, culture: 2, astrology: 3 } as const;
  return [...entity.connections].sort(
    (a, b) =>
      priority[a.relation.domain] - priority[b.relation.domain] ||
      a.other.name.localeCompare(b.other.name),
  );
}

export function VisualKnowledgeGraph({ entity }: { entity: RuntimeEntity }) {
  const connections = sortConnections(entity);
  if (connections.length === 0) return null;

  const shown = connections.slice(0, NODE_POSITIONS.length);
  const hidden = connections.slice(NODE_POSITIONS.length);

  return (
    <section
      aria-labelledby="visual-knowledge-graph-heading"
      className="overflow-hidden rounded-[2rem] border border-white/10 bg-bg-elevated/70 shadow-2xl shadow-black/25"
    >
      <div className="grid gap-0 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="relative overflow-x-auto border-b border-white/10 bg-[#02050b]/72 xl:border-r xl:border-b-0">
          <svg
            viewBox="0 0 860 520"
            className="h-[440px] min-w-[760px] w-full"
            aria-labelledby="visual-knowledge-graph-heading"
          >
            <defs>
              <radialGradient id="v6-node-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                <stop offset="52%" stopColor="#d4e0f4" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#5d95df" stopOpacity="0" />
              </radialGradient>
              <filter id="v6-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#000000" floodOpacity="0.35" />
              </filter>
            </defs>
            <rect width="860" height="520" fill="#02050b" />
            <g opacity="0.34">
              {Array.from({ length: 12 }).map((_, index) => (
                <path
                  key={`grid-x-${index}`}
                  d={`M40 ${54 + index * 38}H820`}
                  stroke="#c8d2e6"
                  strokeOpacity="0.18"
                  strokeWidth="0.7"
                />
              ))}
              {Array.from({ length: 13 }).map((_, index) => (
                <path
                  key={`grid-y-${index}`}
                  d={`M${70 + index * 60} 34V486`}
                  stroke="#c8d2e6"
                  strokeOpacity="0.11"
                  strokeWidth="0.7"
                />
              ))}
            </g>
            <g opacity="0.45">
              <circle cx="430" cy="260" r="188" fill="none" stroke="#8fb0d4" strokeWidth="0.8" strokeDasharray="4 10" />
              <circle cx="430" cy="260" r="112" fill="none" stroke="#e7c98a" strokeWidth="0.7" strokeDasharray="2 12" />
            </g>
            {shown.map((connection, index) => {
              const [x, y] = NODE_POSITIONS[index];
              const style = DOMAIN_STYLES[connection.relation.domain];
              const midX = (430 + x) / 2;
              const midY = (260 + y) / 2;
              return (
                <g key={connection.relation.id}>
                  <path
                    d={`M430 260 Q${midX} ${midY - 28} ${x} ${y}`}
                    fill="none"
                    stroke={style.stroke}
                    strokeOpacity="0.68"
                    strokeWidth="1.3"
                  />
                  <circle cx={x} cy={y} r="34" fill={style.fill} fillOpacity="0.54" stroke={style.stroke} strokeOpacity="0.82" />
                  <circle cx={x} cy={y} r="4.4" fill="#ffffff" />
                  <text
                    x={x}
                    y={y + 52}
                    textAnchor="middle"
                    fill="#f5f7fb"
                    fontSize="13"
                    fontWeight="600"
                  >
                    {connection.other.name.length > 18
                      ? `${connection.other.name.slice(0, 17)}...`
                      : connection.other.name}
                  </text>
                </g>
              );
            })}
            <g filter="url(#v6-soft-shadow)">
              <circle cx="430" cy="260" r="74" fill="#07111c" stroke="#f5f7fb" strokeOpacity="0.22" />
              <circle cx="430" cy="260" r="38" fill="url(#v6-node-glow)" opacity="0.86" />
              <path d="M430 172v176M342 260h176M368 198l124 124M492 198 368 322" stroke="#f5f7fb" strokeOpacity="0.48" strokeWidth="1" />
              <text x="430" y="354" textAnchor="middle" fill="#f5f7fb" fontSize="18" fontWeight="700">
                {entity.name.length > 24 ? `${entity.name.slice(0, 23)}...` : entity.name}
              </text>
              <text x="430" y="378" textAnchor="middle" fill="#c2cad8" fontSize="12">
                {entity.typeLabel}
              </text>
            </g>
          </svg>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full border border-halo/20 bg-halo/[0.07] text-halo">
              <ScientificIcon name="graph" className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
                Visual knowledge graph
              </p>
              <h2 id="visual-knowledge-graph-heading" className="mt-1 text-2xl font-semibold">
                Relationships, not isolated facts
              </h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            This viewport is generated from the Asteria knowledge graph. Science,
            culture, and interpretive links remain separated by domain so visual
            context never changes the evidentiary meaning of a relation.
          </p>
          <ul className="mt-6 space-y-3">
            {shown.slice(0, 8).map((connection) => {
              const style = DOMAIN_STYLES[connection.relation.domain];
              return (
                <li
                  key={`${connection.relation.id}-${connection.other.id}`}
                  className={`rounded-2xl border p-4 ${style.chip}`}
                >
                  <span className={`text-xs font-semibold uppercase tracking-wider ${style.text}`}>
                    {relationLabel(connection.relation.type, connection.outgoing)}
                  </span>
                  <Link
                    href={entityGraphPath(connection.other)}
                    className="mt-1 block font-display text-base font-semibold text-fg underline-offset-4 transition hover:text-halo hover:underline"
                  >
                    {connection.other.name}
                  </Link>
                  {connection.relation.note && (
                    <p className="mt-1 text-xs leading-relaxed text-faint">
                      {connection.relation.note}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          {hidden.length > 0 && (
            <details className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <summary className="cursor-pointer font-display text-sm font-semibold text-fg">
                {hidden.length} more graph link{hidden.length === 1 ? "" : "s"}
              </summary>
              <ul className="mt-3 space-y-2">
                {hidden.map((connection) => (
                  <li key={`${connection.relation.id}-hidden`} className="text-sm">
                    <Link
                      href={entityGraphPath(connection.other)}
                      className="text-muted underline-offset-4 hover:text-halo hover:underline"
                    >
                      {connection.other.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </section>
  );
}
