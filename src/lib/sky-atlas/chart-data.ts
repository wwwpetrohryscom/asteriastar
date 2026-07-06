import { raHoursToDeg, type SkyPoint } from "@/lib/sky-atlas/projection";

/**
 * Pure mappers from catalog records to chart points. They read only the measured coordinate fields
 * already present on the records (right ascension, declination, apparent magnitude) and carry them
 * through unchanged — no coordinate is computed or invented here. Records without coordinates are
 * dropped so nothing is plotted at a made-up position.
 */

type StarLike = { id: string; name: string; ra?: number; dec?: number; apparentMagnitude?: number };
type DeepSkyLike = { id?: string; entityId?: string; name: string; raHours?: number; decDeg?: number; apparentMagnitude?: number };

/** Star catalog records → sky points. Stars store RA in hours, Dec in degrees. */
export function starsToPoints(records: StarLike[], hrefFor?: (r: StarLike) => string): SkyPoint[] {
  return records
    .filter((r) => typeof r.ra === "number" && typeof r.dec === "number")
    .map((r) => ({
      id: r.id,
      name: r.name,
      raDeg: raHoursToDeg(r.ra as number),
      decDeg: r.dec as number,
      magnitude: typeof r.apparentMagnitude === "number" ? r.apparentMagnitude : undefined,
      href: hrefFor ? hrefFor(r) : undefined,
    }));
}

/** Deep-sky catalog records → sky points. Deep-sky objects store RA in hours, Dec in degrees. */
export function deepSkyToPoints(records: DeepSkyLike[], hrefFor?: (r: DeepSkyLike) => string): SkyPoint[] {
  return records
    .filter((r) => typeof r.raHours === "number" && typeof r.decDeg === "number")
    .map((r) => ({
      id: (r.entityId ?? r.id ?? r.name) as string,
      name: r.name,
      raDeg: raHoursToDeg(r.raHours as number),
      decDeg: r.decDeg as number,
      magnitude: typeof r.apparentMagnitude === "number" ? r.apparentMagnitude : undefined,
      href: hrefFor ? hrefFor(r) : undefined,
    }));
}
