import Link from "next/link";
import { compactSnapshot, currentScales, latestObservedKp } from "@/platform/space-weather/service";
import { explainKp, explainSolarWindSpeed, scaleElevated } from "@/platform/space-weather/explain";
import { LiveStatusBadge, utcStamp } from "@/components/space-weather/LiveStatus";
import { FreshnessWatch } from "@/components/space-weather/FreshnessWatch";
import { getLiveProduct } from "@/platform/live-providers/registry";
import { NO_VALUE_STATUSES } from "@/platform/live-providers/envelope";
import { spaceWeatherPath } from "@/lib/routes";

/**
 * The compact current-conditions strip, for pages whose subject is the Sun or the heliosphere but
 * whose job is not to be a space-weather console.
 *
 * It reads four small products — not the eleven the full page uses — so dropping it onto an
 * existing page costs a few kilobytes of provider traffic, cached, and nothing at all on a second
 * view. If every one of them fails, the strip says so in one line and the host page is unaffected.
 */

export async function CompactSpaceWeather({ heading }: { heading?: string } = {}) {
  const snapshot = await compactSnapshot();
  const kp = latestObservedKp(snapshot.kpObserved);
  const scales = currentScales(snapshot.scales);
  const speed = snapshot.solarWindSpeed;
  const flare = snapshot.xrayFlare;

  const speedDatum = speed.data && !NO_VALUE_STATUSES.has(speed.status) ? speed.data : undefined;
  const g = scales?.geomagnetic?.scale;
  const anyData = Boolean(speedDatum || kp || scales || flare.data);

  const cells: { label: string; value: string; note: string; elevated: boolean; status: React.ComponentProps<typeof LiveStatusBadge>["status"]; at: string; reference?: string; productKey: string }[] = [];

  if (speedDatum) {
    const interpretation = explainSolarWindSpeed(speedDatum.speedKmS);
    cells.push({
      label: "Solar wind",
      value: `${speedDatum.speedKmS.toFixed(0)} km/s`,
      note: interpretation.label,
      elevated: interpretation.elevated,
      status: speed.status,
      at: speedDatum.observedAt,
      reference: speedDatum.observedAt,
      productKey: "swpc:solar-wind-speed",
    });
  }
  if (kp) {
    const interpretation = explainKp(kp.value);
    cells.push({
      label: "Planetary Kp",
      value: kp.value.toFixed(2),
      note: interpretation.label,
      elevated: interpretation.elevated,
      status: kp.status,
      at: kp.observedAt,
      reference: kp.observedAt,
      productKey: "swpc:kp-index",
    });
  }
  if (scales && g !== undefined) {
    cells.push({
      label: "Geomagnetic scale",
      value: g > 0 ? `G${g}` : "None",
      note: g > 0 ? (scales.geomagnetic?.text ?? "storm level") : "no storm in the last 24 h",
      elevated: scaleElevated(g),
      status: snapshot.scales.status,
      at: scales.at,
      reference: scales.at,
      productKey: "swpc:noaa-scales",
    });
  }
  if (flare.data?.currentClass) {
    cells.push({
      label: "X-ray flux",
      value: flare.data.currentClass,
      note: flare.data.inProgress ? "flare in progress" : "current GOES class",
      elevated: /^[MX]/.test(flare.data.currentClass),
      status: flare.status,
      at: flare.data.observedAt,
      reference: flare.data.observedAt,
      productKey: "swpc:xray-flares",
    });
  }

  return (
    <section aria-labelledby="compact-sw-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="compact-sw-heading" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">
          {heading ?? "Space weather now"}
        </h2>
        <Link href={spaceWeatherPath("live")} className="text-xs text-nasa underline-offset-4 hover:underline">
          Current conditions →
        </Link>
      </div>

      {!anyData ? (
        <p className="mt-3 text-sm text-muted">
          Current space-weather data is unavailable: NOAA SWPC could not be reached for any of these products. No values are
          shown, and none are substituted.
        </p>
      ) : (
        <>
          <ul className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cells.map((c) => (
              <li key={c.label}>
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-wider text-faint">{c.label}</p>
                  <FreshnessWatch serverStatus={c.status} referenceIso={c.reference} policy={getLiveProduct(c.productKey)?.freshness} />
                </div>
                <p className={`mt-1 font-display text-2xl font-bold ${c.elevated ? "text-nasa" : "text-fg"}`}>{c.value}</p>
                <p className="text-xs text-muted">{c.note}</p>
                <p className="mt-0.5 text-[0.7rem] text-faint">{utcStamp(c.at)}</p>
              </li>
            ))}
          </ul>
          {cells.length < 4 && (
            <p className="mt-3 text-xs text-faint">
              Some products could not be read from NOAA SWPC for this view; only the values that were actually returned are shown.
            </p>
          )}
        </>
      )}
      <p className="mt-4 text-xs text-faint">
        Source: NOAA Space Weather Prediction Center. Times are UTC, as published by the provider.
      </p>
    </section>
  );
}
