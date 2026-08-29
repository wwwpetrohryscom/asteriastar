"use client";

import { useMemo, useState, useId } from "react";
import Link from "next/link";
import { formatDiameter, type ResolvedCloseApproach } from "@/platform/neo/model";
import { neoPath } from "@/lib/routes";

/**
 * Filters for the close-approach table.
 *
 * These run entirely in the browser, over data the server already sent. That is a deliberate SEO
 * decision as much as a UX one: a filtered view expressed as `?dist=1&pha=true&from=2026-09-01`
 * would multiply one honest page into a combinatorial space of near-identical crawlable URLs, all
 * of which change their content every hour. The URL never changes here, so there is exactly one
 * page for a crawler to hold and exactly one for a reader to link to.
 *
 * The trade-off is that filtering needs JavaScript. The server therefore renders the FULL, unfiltered
 * table first — this component receives it already populated — so a reader without JavaScript, or
 * before hydration, gets every row rather than an empty shell.
 */

type SizeBand = "any" | "small" | "medium" | "large";
type DistanceBand = "any" | "1" | "5" | "10";

/** The largest plausible diameter for an object, used only for filtering. */
function upperSizeKm(a: ResolvedCloseApproach): number | undefined {
  if (!a.size) return undefined;
  return a.size.kind === "measured" ? a.size.km : a.size.maxKm;
}

export function ApproachFilters({ approaches }: { approaches: ResolvedCloseApproach[] }) {
  const [distance, setDistance] = useState<DistanceBand>("any");
  const [size, setSize] = useState<SizeBand>("any");
  const [catalogued, setCatalogued] = useState(false);
  const [monitored, setMonitored] = useState(false);
  const baseId = useId();

  const filtered = useMemo(() => {
    return approaches.filter((a) => {
      if (distance !== "any" && a.distance.lunarDistances > Number(distance)) return false;
      if (size !== "any") {
        const km = upperSizeKm(a);
        // An object with no published size is EXCLUDED by a size filter rather than assumed to be
        // small: "we do not know how big this is" must not read as "this one is tiny".
        if (km === undefined) return false;
        if (size === "small" && km >= 0.05) return false;
        if (size === "medium" && (km < 0.05 || km >= 0.5)) return false;
        if (size === "large" && km < 0.5) return false;
      }
      if (catalogued && a.catalogue.notYetCatalogued) return false;
      if (monitored && !a.sentry) return false;
      return true;
    });
  }, [approaches, distance, size, catalogued, monitored]);

  const select = "rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-fg focus-visible:outline-2 focus-visible:outline-nasa";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex flex-col gap-1">
          <label htmlFor={`${baseId}-dist`} className="text-xs uppercase tracking-wider text-faint">Within</label>
          <select id={`${baseId}-dist`} className={select} value={distance} onChange={(e) => setDistance(e.target.value as DistanceBand)}>
            <option value="any">any distance (0.05 au)</option>
            <option value="10">10 lunar distances</option>
            <option value="5">5 lunar distances</option>
            <option value="1">1 lunar distance</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={`${baseId}-size`} className="text-xs uppercase tracking-wider text-faint">Estimated size</label>
          <select id={`${baseId}-size`} className={select} value={size} onChange={(e) => setSize(e.target.value as SizeBand)}>
            <option value="any">any size</option>
            <option value="small">under 50 m</option>
            <option value="medium">50 m to 500 m</option>
            <option value="large">over 500 m</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={catalogued} onChange={(e) => setCatalogued(e.target.checked)} className="h-4 w-4 accent-[var(--color-nasa)]" />
          Catalogued in AsteriaStar
        </label>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={monitored} onChange={(e) => setMonitored(e.target.checked)} className="h-4 w-4 accent-[var(--color-nasa)]" />
          On the Sentry table
        </label>

        {(distance !== "any" || size !== "any" || catalogued || monitored) && (
          <button
            type="button"
            onClick={() => { setDistance("any"); setSize("any"); setCatalogued(false); setMonitored(false); }}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-muted transition hover:border-white/30 hover:text-fg"
          >
            Clear filters
          </button>
        )}
      </div>

      {/*
        A polite live region, so a filter change is announced once with its result rather than the
        whole table being re-read. The count is also visible, because a reader who cannot see the
        table shrink should not be the only one told what happened.
      */}
      <p role="status" aria-live="polite" className="text-sm text-muted">
        Showing {filtered.length} of {approaches.length} approaches.
        {size !== "any" && " Objects with no published size are excluded by a size filter rather than assumed small."}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted">
          No approach in this window matches those filters. That is a statement about the filters, not about the sky.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="px-3 pt-3 text-left text-xs text-faint">
              Distances in lunar distances (LD); one LD is 384,400 km. Times are TDB, as JPL publishes them.
            </caption>
            <thead className="text-faint">
              <tr>
                <th scope="col" className="px-3 py-2 text-xs font-medium">Object</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium">Closest approach (TDB)</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium">Distance</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium">Relative velocity</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium">Estimated size</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium">Risk monitoring</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((a) => (
                <tr key={`${a.designation}-${a.approachTdb}`}>
                  <td className="px-3 py-2">
                    <span className="font-medium text-fg">{a.designation}</span>
                    <span className="block text-xs">
                      {a.catalogue.notYetCatalogued || !a.catalogue.entityPath ? (
                        <span className="text-faint">Not yet catalogued in AsteriaStar</span>
                      ) : (
                        <Link href={a.catalogue.entityPath} className="text-nasa underline-offset-4 hover:underline">{a.catalogue.entityName} →</Link>
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-muted">
                    {a.approachTdb.replace("T", " ")} <span className="text-faint">TDB</span>
                    {a.timeUncertainty && <span className="block text-xs text-faint">±{a.timeUncertainty} (3σ)</span>}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="font-medium text-fg">{a.distance.lunarDistances < 10 ? a.distance.lunarDistances.toFixed(2) : a.distance.lunarDistances.toFixed(1)} LD</span>
                    {a.distanceMin && a.distanceMax && (
                      <span className="block text-xs text-faint">3σ {a.distanceMin.lunarDistances.toFixed(2)}–{a.distanceMax.lunarDistances.toFixed(2)} LD</span>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-muted">{a.relativeVelocityKmS?.toFixed(1) ?? "—"} km/s</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {!a.size ? (
                      <span className="text-faint">not published</span>
                    ) : a.size.kind === "measured" ? (
                      <span className="font-medium text-fg">{formatDiameter(a.size.km)}<span className="ml-1.5 text-xs font-normal text-faint">measured</span></span>
                    ) : (
                      <span className="font-medium text-fg">
                        {formatDiameter(a.size.minKm)}–{formatDiameter(a.size.maxKm)}
                        <span className="ml-1.5 text-xs font-normal text-faint">from H {a.size.absoluteMagnitude.toFixed(1)}</span>
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {a.sentry ? (
                      <Link href={neoPath("risk")} className="text-xs text-nasa underline-offset-4 hover:underline">On the Sentry table →</Link>
                    ) : (
                      <span className="text-xs text-faint">Not on the Sentry table</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
