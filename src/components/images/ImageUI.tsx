import Link from "next/link";
import { imagePath } from "@/lib/routes";
import { LICENSE_BY_SLUG, SOURCE_BY_SLUG } from "@/platform/images";
import type { ImageRecord } from "@/platform/images";
import type { Provenance } from "@/platform/images/provenance";
import type { MetaRow } from "@/platform/images/metadata";

/**
 * Image UI — provenance-first components. The platform catalogues verified
 * provenance and links to each image's official source archive; it does not
 * re-host or hotlink binaries it has not verified. So instead of a fabricated
 * pixel render, images show an honest, labelled placeholder with a link to the
 * source. Every card and panel foregrounds credit, license, and source.
 */

const LICENSE_CLASS: Record<string, string> = {
  "public-domain": "border-success/40 bg-success/10 text-success-strong",
  "cc-by-4-0": "border-white/20 bg-white/[0.045] text-muted",
};

export function LicenseBadge({ slug }: { slug: string }) {
  const lic = LICENSE_BY_SLUG.get(slug);
  if (!lic) return null;
  return (
    <a href={lic.url} target="_blank" rel="noreferrer nofollow" className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${LICENSE_CLASS[slug] ?? "border-white/15 bg-white/[0.04] text-muted"}`}>
      {lic.shortName}
    </a>
  );
}

function LicensePill({ slug }: { slug: string }) {
  const lic = LICENSE_BY_SLUG.get(slug);
  if (!lic) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${LICENSE_CLASS[slug] ?? "border-white/15 bg-white/[0.04] text-muted"}`}>
      {lic.shortName}
    </span>
  );
}

/** Honest labelled placeholder — never a fabricated render. Links to the source archive. */
export function ImagePlaceholder({ img, aspect = "aspect-[16/10]" }: { img: ImageRecord; aspect?: string }) {
  const source = SOURCE_BY_SLUG.get(img.sourceSlug);
  return (
    <div className={`relative w-full overflow-hidden rounded-lg border border-silver/12 bg-bg-elevated/72 ${aspect}`}>
      {/* The curated alt text describes the image for assistive technology, since the binary lives at the source archive. */}
      <span className="sr-only">{img.altText}</span>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <span aria-hidden className="text-xs font-medium uppercase tracking-[0.2em] text-faint">{img.objectName}</span>
        {source && (
          <a href={source.archiveUrl} target="_blank" rel="noreferrer nofollow" className="mt-3 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-sm text-fg transition hover:border-white/30">
            View at {source.institution} →
          </a>
        )}
        <span className="mt-3 max-w-xs text-[11px] leading-relaxed text-faint">Image hosted by its source archive. Asteria Star records verified provenance and links to the original.</span>
      </div>
    </div>
  );
}

export function ImageCard({ img }: { img: ImageRecord }) {
  return (
    <Link href={imagePath(img.slug)} className="group flex flex-col overflow-hidden scientific-card transition hover:-translate-y-0.5 hover:border-white/25">
      <div className="relative aspect-[16/10] w-full bg-bg-elevated/72">
        <span className="sr-only">{img.altText}</span>
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <span aria-hidden className="text-xs font-medium uppercase tracking-[0.18em] text-faint">{img.objectName}</span>
        </div>
        <div className="absolute right-2 top-2"><LicensePill slug={img.licenseSlug} /></div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display font-semibold text-fg group-hover:text-nasa">{img.title}</h3>
        <p className="mt-1 text-xs text-faint">{img.credit}</p>
      </div>
    </Link>
  );
}

export function ImageGallery({ images }: { images: ImageRecord[] }) {
  if (!images.length) return <p className="text-sm text-faint">No images in this view yet.</p>;
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((img) => <li key={img.slug}><ImageCard img={img} /></li>)}
    </ul>
  );
}

export function MetadataPanel({ rows, unrecorded }: { rows: MetaRow[]; unrecorded: string[] }) {
  return (
    <section aria-labelledby="metadata" className="scientific-card p-5">
      <h2 id="metadata" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Image metadata</h2>
      <dl className="mt-3 divide-y divide-white/5">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-3 py-2 text-sm">
            <dt className="text-faint">{r.label}</dt>
            <dd className="text-right font-medium text-fg">{r.value}</dd>
          </div>
        ))}
      </dl>
      {unrecorded.length > 0 && (
        <p className="mt-3 text-xs leading-relaxed text-faint">Not recorded in this catalogue entry: {unrecorded.join(", ")}. These are left blank rather than estimated — see the source archive for full metadata.</p>
      )}
    </section>
  );
}

export function ProvenancePanel({ provenance }: { provenance: Provenance }) {
  const p = provenance;
  const rows: [string, React.ReactNode][] = [];
  rows.push(["Credit", p.credit]);
  rows.push(["Institution", p.institution]);
  if (p.source) rows.push(["Source archive", <a key="s" href={p.source.archiveUrl} target="_blank" rel="noreferrer nofollow" className="text-nasa hover:underline">{p.source.name}</a>]);
  if (p.license) rows.push(["License", <a key="l" href={p.license.url} target="_blank" rel="noreferrer nofollow" className="text-nasa hover:underline">{p.license.name}</a>]);
  if (p.copyright) rows.push(["Copyright", p.copyright]);
  if (p.publication) rows.push(["Published", p.publication]);
  rows.push(["Provenance verified", p.lastVerified]);
  return (
    <section aria-labelledby="provenance" className="scientific-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 id="provenance" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Provenance</h2>
        {p.openlyLicensed && <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-xs text-success-strong">Openly licensed</span>}
      </div>
      <dl className="mt-3 divide-y divide-white/5">
        {rows.map(([k, v], i) => (
          <div key={i} className="flex justify-between gap-3 py-2 text-sm">
            <dt className="shrink-0 text-faint">{k}</dt>
            <dd className="text-right font-medium text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-faint">{p.note}</p>
    </section>
  );
}

export function ImageSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="font-display text-2xl font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function RefCards({ refs }: { refs: { id: string; name: string; href: string }[] }) {
  if (!refs.length) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {refs.map((r) => (
        <Link key={r.id} href={r.href} className="scientific-card p-3 transition hover:border-white/25">
          <div className="font-medium text-fg">{r.name}</div>
        </Link>
      ))}
    </div>
  );
}
