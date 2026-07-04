import {
  TD_RECORDS,
  TD_BY_SLUG,
  transients,
  alertSystems,
  stages,
  type TimeDomainRecord,
  type TransientCategory,
} from "@/knowledge-graph/data/time-domain-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Time-Domain Engine — resolver and query surface for the Multi-Wavelength & Time-Domain
 * Astronomy Atlas (engine.timeDomain). Pure, deterministic, framework-free. It resolves the
 * transient-class, alert-system, and observation-stage entities and REUSES the wavelength/
 * messenger bands, multi-messenger methods, surveys, and observatories via the graph, creating
 * and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: TimeDomainRecord, b: TimeDomainRecord) => a.name.localeCompare(b.name);
const byOrder = (a: TimeDomainRecord, b: TimeDomainRecord) => (a.order ?? 0) - (b.order ?? 0);

/** The reused wavelength/messenger bands that form the multi-wavelength axis. */
const SPECTRUM_BAND_IDS = [
  "radio", "millimeter", "submillimeter", "infrared", "near-infrared", "visible-light",
  "ultraviolet", "x-ray", "gamma-ray", "gravitational-waves", "neutrinos", "multi-messenger",
].map((b) => `wavelength_band:${b}`);

export interface ResolvedTimeDomain {
  record: TimeDomainRecord;
  related: Ref[]; // reused entities it involves
  nextStage?: Ref; // for a stage
  prevStage?: Ref; // for a stage
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: TimeDomainRecord): ResolvedTimeDomain {
  const entity = getEntityById(r.id);
  const prev = r.kind === "stage" ? stages.find((s) => s.nextStageSlug === r.slug) : undefined;
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    nextStage: r.kind === "stage" && r.nextStageSlug ? refFromId(`observation_stage:${r.nextStageSlug}`) : undefined,
    prevStage: prev ? refFromId(prev.id) : undefined,
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const timeDomainEngine = {
  count: TD_RECORDS.length,
  transientCount: transients.length,
  all: (): TimeDomainRecord[] => TD_RECORDS.slice(),
  get: (slug: string): TimeDomainRecord | undefined => TD_BY_SLUG.get(slug),
  transients: (): TimeDomainRecord[] => transients.slice().sort(byName),
  alerts: (): TimeDomainRecord[] => alertSystems.slice().sort(byName),
  stages: (): TimeDomainRecord[] => stages.slice().sort(byOrder),
  byCategory: (c: TransientCategory): TimeDomainRecord[] => transients.filter((x) => x.category === c).sort(byName),
  /** The reused wavelength/messenger bands (resolved refs), in spectral order. */
  spectrumBands: (): Ref[] => SPECTRUM_BAND_IDS.map((id) => refFromId(id)).filter(Boolean) as Ref[],
  resolveEntry: (slug: string): ResolvedTimeDomain | null => {
    const r = TD_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
