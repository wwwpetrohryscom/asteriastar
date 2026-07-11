import type { RuntimeEntity } from "@/platform/runtime";
import type { BodyRecord } from "@/knowledge-graph/data/solar-system-catalog/types";
import { BODY_BY_ID } from "@/knowledge-graph/data/solar-system-catalog";
import { relationLabel } from "@/knowledge-graph";
import { ScientificIcon } from "@/components/experience/ScientificIcons";

function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

function getBodyName(id?: string) {
  if (!id) return undefined;
  return BODY_BY_ID.get(id)?.name;
}

function connectionTargets(entity: RuntimeEntity) {
  return entity.connections
    .filter((connection) => connection.relation.domain === "science")
    .slice(0, 4)
    .map((connection) => ({
      name: connection.other.name,
      label: relationLabel(connection.relation.type, connection.outgoing),
    }));
}

function OrbitMap({ entity, body }: { entity: RuntimeEntity; body?: BodyRecord }) {
  const parentName = getBodyName(body?.parent) ?? "Sun";
  const axis = body?.semiMajorAxisAu ?? body?.distanceFromSun1e6Km;
  const orbitLabel = body?.semiMajorAxisAu
    ? `${formatNumber(body.semiMajorAxisAu, 3)} AU semi-major axis`
    : body?.distanceFromSun1e6Km
      ? `${formatNumber(body.distanceFromSun1e6Km, 1)} million km mean distance`
      : "Orbital distance not recorded in this graph record";

  return (
    <>
      <svg viewBox="0 0 680 360" className="h-80 w-full" role="img" aria-label={`${entity.name} orbit context`}>
        <rect width="680" height="360" rx="24" fill="#02050b" />
        <g opacity="0.32">
          {Array.from({ length: 8 }).map((_, index) => (
            <circle
              key={index}
              cx="340"
              cy="180"
              r={42 + index * 32}
              fill="none"
              stroke="#c8d2e6"
              strokeWidth="0.8"
              strokeDasharray={index % 2 ? "4 10" : "1 12"}
            />
          ))}
        </g>
        <circle cx="340" cy="180" r="16" fill="#e7c98a" />
        <text x="340" y="220" textAnchor="middle" fill="#c2cad8" fontSize="13">
          {parentName}
        </text>
        <ellipse cx="340" cy="180" rx="212" ry="82" fill="none" stroke="#8fb0d4" strokeWidth="2" />
        <ellipse cx="340" cy="180" rx="212" ry="82" fill="none" stroke="#8fb0d4" strokeOpacity="0.35" strokeWidth="10" />
        <circle cx="552" cy="180" r="10" fill="#f5f7fb" />
        <circle cx="552" cy="180" r="22" fill="#5d95df" opacity="0.16" />
        <text x="552" y="218" textAnchor="middle" fill="#f5f7fb" fontSize="15" fontWeight="700">
          {entity.name.length > 20 ? `${entity.name.slice(0, 19)}...` : entity.name}
        </text>
        <path d="M340 180H552" stroke="#e7c98a" strokeWidth="1" strokeDasharray="5 8" />
        <text x="446" y="167" textAnchor="middle" fill="#e7c98a" fontSize="12">
          {axis ? orbitLabel : "Catalog position context"}
        </text>
      </svg>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wider text-faint">Primary orbital anchor</dt>
          <dd className="mt-1 font-medium text-fg">{parentName}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-faint">Measured orbit field</dt>
          <dd className="mt-1 font-medium text-fg">{orbitLabel}</dd>
        </div>
      </dl>
    </>
  );
}

function MissionMap({ entity }: { entity: RuntimeEntity }) {
  const targets = connectionTargets(entity);
  const primaryTarget = targets[0]?.name ?? "Target body";

  return (
    <>
      <svg viewBox="0 0 680 360" className="h-80 w-full" role="img" aria-label={`${entity.name} trajectory context`}>
        <rect width="680" height="360" rx="24" fill="#02050b" />
        <g opacity="0.32">
          {Array.from({ length: 10 }).map((_, index) => (
            <path key={index} d={`M60 ${54 + index * 28}H620`} stroke="#c8d2e6" strokeWidth="0.8" />
          ))}
          {Array.from({ length: 10 }).map((_, index) => (
            <path key={index} d={`M${70 + index * 60} 42V318`} stroke="#c8d2e6" strokeWidth="0.6" />
          ))}
        </g>
        <circle cx="118" cy="260" r="28" fill="#0b3d91" stroke="#8fb0d4" />
        <text x="118" y="308" textAnchor="middle" fill="#c2cad8" fontSize="13">
          Earth / launch
        </text>
        <circle cx="560" cy="96" r="34" fill="#e7c98a" fillOpacity="0.2" stroke="#e7c98a" />
        <circle cx="560" cy="96" r="7" fill="#f5f7fb" />
        <text x="560" y="150" textAnchor="middle" fill="#f5f7fb" fontSize="15" fontWeight="700">
          {primaryTarget.length > 22 ? `${primaryTarget.slice(0, 21)}...` : primaryTarget}
        </text>
        <path
          d="M146 248 C268 178 376 286 532 112"
          fill="none"
          stroke="#8fb0d4"
          strokeWidth="2.2"
        />
        <path d="m513 114 21-3-8 19" fill="none" stroke="#8fb0d4" strokeWidth="2" />
        <circle cx="330" cy="220" r="5" fill="#e7c98a" />
        <text x="330" y="247" textAnchor="middle" fill="#e7c98a" fontSize="12">
          mission arc
        </text>
      </svg>
      <ul className="grid gap-3 sm:grid-cols-2">
        {(targets.length ? targets : [{ name: "No target relation recorded", label: "Graph status" }]).map((target) => (
          <li key={`${target.label}-${target.name}`}>
            <span className="text-xs uppercase tracking-wider text-faint">{target.label}</span>
            <p className="mt-1 font-medium text-fg">{target.name}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

function SkyMap({ entity }: { entity: RuntimeEntity }) {
  const anchors = connectionTargets(entity);

  return (
    <>
      <svg viewBox="0 0 680 360" className="h-80 w-full" role="img" aria-label={`${entity.name} sky atlas context`}>
        <rect width="680" height="360" rx="24" fill="#02050b" />
        <g opacity="0.42">
          {Array.from({ length: 9 }).map((_, index) => (
            <path key={`ra-${index}`} d={`M${82 + index * 64} 44V316`} stroke="#c8d2e6" strokeWidth="0.7" />
          ))}
          {Array.from({ length: 7 }).map((_, index) => (
            <path key={`dec-${index}`} d={`M58 ${64 + index * 38}H622`} stroke="#c8d2e6" strokeWidth="0.7" />
          ))}
          <ellipse cx="340" cy="180" rx="238" ry="96" fill="none" stroke="#8fb0d4" strokeDasharray="5 10" />
        </g>
        <path d="M174 224 246 146 326 188 414 102 512 212" fill="none" stroke="#e7c98a" strokeWidth="1.4" />
        {[174, 246, 326, 414, 512].map((x, index) => {
          const y = [224, 146, 188, 102, 212][index];
          return <circle key={x} cx={x} cy={y} r={index === 3 ? 5.5 : 4} fill="#f5f7fb" />;
        })}
        <circle cx="340" cy="180" r="58" fill="#5d95df" opacity="0.09" stroke="#8fb0d4" />
        <text x="340" y="184" textAnchor="middle" fill="#f5f7fb" fontSize="17" fontWeight="700">
          {entity.name.length > 26 ? `${entity.name.slice(0, 25)}...` : entity.name}
        </text>
        <text x="340" y="212" textAnchor="middle" fill="#c2cad8" fontSize="12">
          coordinate fields shown only when available
        </text>
      </svg>
      <ul className="grid gap-3 sm:grid-cols-2">
        {(anchors.length ? anchors : [{ name: "No coordinate value recorded", label: "Atlas data" }]).map((anchor) => (
          <li key={`${anchor.label}-${anchor.name}`}>
            <span className="text-xs uppercase tracking-wider text-faint">{anchor.label}</span>
            <p className="mt-1 font-medium text-fg">{anchor.name}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

function EarthMap({ entity }: { entity: RuntimeEntity }) {
  const anchors = connectionTargets(entity);

  return (
    <>
      <svg viewBox="0 0 680 360" className="h-80 w-full" role="img" aria-label={`${entity.name} terrestrial context`}>
        <rect width="680" height="360" rx="24" fill="#02050b" />
        <circle cx="340" cy="180" r="122" fill="#0b3d91" fillOpacity="0.22" stroke="#8fb0d4" />
        <path d="M218 180h244M340 58v244" stroke="#c8d2e6" strokeOpacity="0.38" />
        <ellipse cx="340" cy="180" rx="122" ry="38" fill="none" stroke="#c8d2e6" strokeOpacity="0.38" />
        <ellipse cx="340" cy="180" rx="58" ry="122" fill="none" stroke="#c8d2e6" strokeOpacity="0.28" />
        <path d="M282 154c34-28 91-20 124 11M268 211c47 22 96 20 145-6" stroke="#e7c98a" strokeOpacity="0.7" />
        <circle cx="394" cy="132" r="8" fill="#f5f7fb" />
        <circle cx="394" cy="132" r="22" fill="#e7c98a" opacity="0.14" />
        <text x="340" y="328" textAnchor="middle" fill="#c2cad8" fontSize="13">
          Geolocation is displayed only when coordinates exist in the data model.
        </text>
      </svg>
      <ul className="grid gap-3 sm:grid-cols-2">
        {(anchors.length ? anchors : [{ name: "Coordinates not recorded", label: "Location data" }]).map((anchor) => (
          <li key={`${anchor.label}-${anchor.name}`}>
            <span className="text-xs uppercase tracking-wider text-faint">{anchor.label}</span>
            <p className="mt-1 font-medium text-fg">{anchor.name}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export function ScientificMap({ entity }: { entity: RuntimeEntity }) {
  const body = BODY_BY_ID.get(entity.id);
  const orbitalTypes = new Set(["planet", "dwarf_planet", "moon", "asteroid", "comet", "exoplanet"]);
  const missionTypes = new Set(["space_mission", "spacecraft", "launch_vehicle", "satellite"]);
  const earthTypes = new Set(["observatory", "launch_site", "location", "tracking_station", "ground_station"]);
  const mode = orbitalTypes.has(entity.type)
    ? "orbit"
    : missionTypes.has(entity.type)
      ? "trajectory"
      : earthTypes.has(entity.type)
        ? "earth"
        : "sky";

  return (
    <section className="rounded-[2rem] border border-white/10 bg-bg-elevated/64 p-5 shadow-2xl shadow-black/20 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full border border-halo/20 bg-halo/[0.07] text-halo">
          <ScientificIcon name={mode === "trajectory" ? "trajectory" : mode === "earth" ? "atlas" : "orbit"} className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            Scientific map
          </p>
          <h3 className="mt-1 text-xl font-semibold">{mode === "orbit" ? "Orbit context" : mode === "trajectory" ? "Mission context" : mode === "earth" ? "Ground context" : "Atlas context"}</h3>
        </div>
      </div>
      <div className="space-y-5">
        {mode === "orbit" && <OrbitMap entity={entity} body={body} />}
        {mode === "trajectory" && <MissionMap entity={entity} />}
        {mode === "earth" && <EarthMap entity={entity} />}
        {mode === "sky" && <SkyMap entity={entity} />}
      </div>
    </section>
  );
}
