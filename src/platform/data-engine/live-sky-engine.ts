import { getEntityById } from "@/knowledge-graph";
import { getProvider } from "@/platform/live-sky/providers";
import {
  liveSky, SKY_PAGES, getSkyPage, allSkyPaths, LIVE_SKY_STATS,
  meteorShowers, moon, planets, eclipses, comets, asteroids, iss, aurora, spaceWeather, observingCalendar,
  type SkyPageDef,
} from "@/platform/live-sky";
import type { MeteorShower } from "@/platform/live-sky/models";
import type { ProviderInfo } from "@/platform/live-sky/providers";

/**
 * Live Sky Engine — the Scientific Data Engine's window onto the Live Sky
 * platform (engine.liveSky). Pure, typed, framework-independent, provider-
 * agnostic, source-aware, and timestamp-aware. It resolves the graph entity ids
 * that live-sky records reference into renderable {id, name, href} refs, and
 * exposes the honest reference/prepared data surface. It never fabricates values.
 */

export type Ref = { id: string; name: string; href: string; type: string };
function entRef(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  if (!e) return undefined;
  return { id, name: e.name, href: e.entryPath ?? `/explore/entity/${id.replace(":", "/")}`, type: e.type };
}
function refs(ids: (string | undefined)[]): Ref[] {
  return ids.map(entRef).filter((r): r is Ref => Boolean(r));
}

export interface ResolvedMeteorShower {
  record: MeteorShower;
  graphEntity?: Ref;
  parentBody?: Ref;
  radiant?: Ref;
  related: Ref[];
}
export interface ResolvedSkyPage {
  def: SkyPageDef;
  related: Ref[];
  providers: ProviderInfo[];
}
export type ResolvedSky = ResolvedMeteorShower | ResolvedSkyPage;

function resolveMeteorShower(s: MeteorShower): ResolvedMeteorShower {
  return {
    record: s,
    graphEntity: entRef(s.graphEntityId),
    parentBody: entRef(s.parentBodyId),
    radiant: entRef(s.radiantConstellationId),
    related: refs([s.graphEntityId, s.parentBodyId, s.radiantConstellationId]),
  };
}

export const liveSkyEngine = {
  /* provider architecture */
  providers: (): ProviderInfo[] => liveSky.providers,
  getProvider,
  connectedProviderCount: LIVE_SKY_STATS.connectedProviders,

  /* meteor showers (reference data) */
  meteorShowers: () => meteorShowers.all(),
  meteorShowerSlugs: () => meteorShowers.slugs(),
  meteorShower: (slug: string): ResolvedMeteorShower | null => {
    const s = meteorShowers.get(slug);
    return s ? resolveMeteorShower(s) : null;
  },
  meteorShowersForMonth: (m: number) => meteorShowers.forMonth(m),

  /* domain modules (reference facts + honest prepared states) */
  moon, planets, eclipses, comets, asteroids, iss, aurora, spaceWeather, observingCalendar,

  /* pages */
  skyPages: (): SkyPageDef[] => SKY_PAGES,
  skyPageSlugs: (): string[] => SKY_PAGES.map((p) => p.slug),
  skyPage: (slug: string): ResolvedSkyPage | null => {
    const def = getSkyPage(slug);
    if (!def) return null;
    return {
      def,
      related: refs(def.relatedEntityIds),
      providers: def.providerKeys.map((k) => getProvider(k)).filter((p): p is ProviderInfo => Boolean(p)),
    };
  },
  allSkyPaths,

  /* generic ref resolution for pages */
  refs,
  ref: entRef,

  stats: LIVE_SKY_STATS,
};
