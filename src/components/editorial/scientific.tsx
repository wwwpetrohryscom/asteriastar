import type { ReactNode } from "react";

/**
 * A library of premium, reusable scientific-storytelling blocks. All Server
 * Components, all on the deep-space black theme with a restrained NASA-red
 * accent. Each returns null when it has no data, so pages can compose freely.
 */

/** Editorial section header: a red-accent kicker rule + large title + optional lead. */
export function SectionHeader({
  kicker,
  title,
  lead,
  className = "",
}: {
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <header className={className}>
      {kicker && (
        <p className="mb-2 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-nasa">
          <span aria-hidden className="inline-block h-3 w-1 rounded-full bg-nasa-red" />
          {kicker}
        </p>
      )}
      <h2 className="font-display text-2xl font-bold leading-tight text-fg sm:text-3xl">{title}</h2>
      {lead && <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>}
    </header>
  );
}

/** A short editorial prose block with a comfortable measure. */
export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-2xl text-lg leading-[1.75] text-muted ${className}`}>{children}</div>;
}

export type KeyNumber = { label: string; value: ReactNode; unit?: string };

/** A few hero-scale numbers — the "key figures" that define an object. */
export function KeyNumbers({ items, className = "" }: { items: KeyNumber[]; className?: string }) {
  const shown = items.filter((i) => i.value !== undefined && i.value !== null && i.value !== "").slice(0, 4);
  if (shown.length === 0) return null;
  return (
    <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4 ${className}`}>
      {shown.map((i, idx) => (
        <div key={idx} className="bg-bg-elevated/80 p-6">
          <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">{i.label}</dt>
          <dd className="mt-2 font-display text-3xl font-bold leading-none text-fg sm:text-4xl">
            {i.value}
            {i.unit && <span className="ml-1 text-lg font-medium text-muted">{i.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A highlighted "Did you know?" editorial callout. */
export function DidYouKnow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <aside className={`relative overflow-hidden rounded-2xl border border-nasa/25 bg-nasa/[0.06] p-6 sm:p-8 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-nasa">Did you know?</p>
      <p className="mt-3 font-display text-xl leading-relaxed text-fg sm:text-2xl">{children}</p>
    </aside>
  );
}

/** A pull quote with attribution. */
export function ScientificQuote({ quote, cite, className = "" }: { quote: ReactNode; cite?: string; className?: string }) {
  return (
    <figure className={`border-l-2 border-nasa-red/70 pl-6 sm:pl-8 ${className}`}>
      <blockquote className="font-display text-2xl font-medium leading-snug text-fg sm:text-3xl">“{quote}”</blockquote>
      {cite && <figcaption className="mt-4 text-sm text-faint">— {cite}</figcaption>}
    </figure>
  );
}

/** Classification chips: type, domain, catalog, scientific name. */
export function ObjectClassification({ items, className = "" }: { items: { label: string; value?: string }[]; className?: string }) {
  const shown = items.filter((i) => i.value);
  if (shown.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {shown.map((i) => (
        <li key={i.label} className="rounded-full border border-white/12 bg-bg-elevated/70 px-4 py-1.5 text-sm">
          <span className="text-faint">{i.label}: </span>
          <span className="font-medium text-fg">{i.value}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * A visual size comparison against Earth. `otherDiameterKm` is the object's
 * diameter; the two bodies are drawn to scale (capped) with the ratio.
 */
const EARTH_DIAMETER_KM = 12742;
export function EarthComparison({
  name,
  otherDiameterKm,
  className = "",
}: {
  name: string;
  otherDiameterKm?: number;
  className?: string;
}) {
  if (!otherDiameterKm || otherDiameterKm <= 0) return null;
  const ratio = otherDiameterKm / EARTH_DIAMETER_KM;
  // Draw to scale but keep both visible: clamp the drawn radius range.
  const maxR = 120;
  const minR = 10;
  const otherR = Math.max(minR, Math.min(maxR, 30 * Math.sqrt(ratio)));
  const earthR = Math.max(minR, Math.min(maxR, 30));
  const ratioText = ratio >= 1 ? `${ratio.toFixed(ratio >= 10 ? 0 : 1)}× Earth` : `${(1 / ratio).toFixed(ratio > 0.1 ? 1 : 0)}× smaller than Earth`;
  return (
    <section className={`rounded-2xl border border-white/10 bg-bg-elevated/60 p-6 sm:p-8 ${className}`}>
      <SectionHeader kicker="Scale" title="Compared to Earth" />
      <div className="mt-6 flex items-end justify-center gap-10 sm:gap-16">
        <div className="flex flex-col items-center">
          <svg width={earthR * 2} height={maxR * 2} viewBox={`0 0 ${earthR * 2} ${maxR * 2}`} aria-hidden>
            <circle cx={earthR} cy={maxR * 2 - earthR} r={earthR} fill="url(#earth-g)" />
            <defs>
              <radialGradient id="earth-g" cx="0.4" cy="0.35" r="0.8">
                <stop offset="0" stopColor="#6ba1f0" />
                <stop offset="0.6" stopColor="#2f5aa0" />
                <stop offset="1" stopColor="#0b1f3a" />
              </radialGradient>
            </defs>
          </svg>
          <span className="mt-3 text-xs font-medium uppercase tracking-wider text-faint">Earth</span>
        </div>
        <div className="flex flex-col items-center">
          <svg width={otherR * 2} height={maxR * 2} viewBox={`0 0 ${otherR * 2} ${maxR * 2}`} aria-hidden>
            <circle cx={otherR} cy={maxR * 2 - otherR} r={otherR} fill="url(#other-g)" />
            <defs>
              <radialGradient id="other-g" cx="0.4" cy="0.35" r="0.85">
                <stop offset="0" stopColor="#e9edf5" />
                <stop offset="0.55" stopColor="#9aa6be" />
                <stop offset="1" stopColor="#2b3140" />
              </radialGradient>
            </defs>
          </svg>
          <span className="mt-3 text-xs font-medium uppercase tracking-wider text-faint">{name}</span>
        </div>
      </div>
      <p className="mt-6 text-center font-display text-xl font-semibold text-fg">
        {name} is {ratioText}
      </p>
      <p className="mt-1 text-center text-sm text-faint">{otherDiameterKm.toLocaleString()} km across · Earth is {EARTH_DIAMETER_KM.toLocaleString()} km</p>
    </section>
  );
}

/** A horizontal scale bar placing a value between a min and max, log-friendly. */
export function ScaleBar({
  kicker,
  title,
  value,
  valueLabel,
  markers,
  className = "",
}: {
  kicker?: string;
  title: string;
  value: number;
  valueLabel: string;
  markers: { at: number; label: string }[];
  className?: string;
}) {
  const all = [value, ...markers.map((m) => m.at)].filter((v) => v > 0);
  if (all.length === 0) return null;
  const min = Math.min(...all);
  const max = Math.max(...all);
  const pos = (v: number) => (max === min ? 50 : ((Math.log10(v) - Math.log10(min)) / (Math.log10(max) - Math.log10(min))) * 100);
  return (
    <section className={`rounded-2xl border border-white/10 bg-bg-elevated/60 p-6 sm:p-8 ${className}`}>
      <SectionHeader kicker={kicker} title={title} />
      <div className="relative mt-10 mb-8 h-px bg-white/15">
        {markers.map((m) => (
          <div key={m.label} className="absolute -top-2 flex -translate-x-1/2 flex-col items-center" style={{ left: `${Math.max(2, Math.min(98, pos(m.at)))}%` }}>
            <span className="h-4 w-px bg-white/25" />
            <span className="mt-2 whitespace-nowrap text-[10px] text-faint">{m.label}</span>
          </div>
        ))}
        <div className="absolute -top-3 flex -translate-x-1/2 flex-col items-center" style={{ left: `${Math.max(2, Math.min(98, pos(value)))}%` }}>
          <span className="h-6 w-1 rounded-full bg-nasa-red" />
          <span className="mt-2 whitespace-nowrap font-display text-sm font-semibold text-fg">{valueLabel}</span>
        </div>
      </div>
    </section>
  );
}

export type TimelineItem = { date: string; title: string; description?: string };

/** A premium vertical timeline for discovery / mission / historical milestones. */
export function Timeline({ items, kicker, title, className = "" }: { items: TimelineItem[]; kicker?: string; title?: string; className?: string }) {
  if (!items || items.length === 0) return null;
  return (
    <section className={className}>
      {title && <SectionHeader kicker={kicker} title={title} className="mb-8" />}
      <ol className="relative ml-3 border-l border-white/12">
        {items.map((it, i) => (
          <li key={i} className="relative mb-8 pl-8 last:mb-0">
            <span aria-hidden className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-nasa-red ring-4 ring-bg" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-nasa">{it.date}</p>
            <h3 className="mt-1 font-display text-lg font-semibold text-fg">{it.title}</h3>
            {it.description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{it.description}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** How an object is observed — synthesized from a real image's capture metadata. */
export function ObservationPanel({
  instrument,
  mission,
  provider,
  captureDate,
  className = "",
}: {
  instrument?: string;
  mission?: string;
  provider?: string;
  captureDate?: string;
  className?: string;
}) {
  const rows = [
    { label: "Observatory / instrument", value: instrument },
    { label: "Mission", value: mission },
    { label: "Source", value: provider ? provider.toUpperCase() : undefined },
    { label: "Observation date", value: captureDate },
  ].filter((r) => r.value);
  if (rows.length === 0) return null;
  return (
    <section className={`rounded-2xl border border-white/10 bg-bg-elevated/60 p-6 sm:p-8 ${className}`}>
      <SectionHeader kicker="Observation" title="How this was captured" />
      <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col">
            <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">{r.label}</dt>
            <dd className="mt-1 font-medium text-fg">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
