import type { RuntimeEntity } from "@/platform/runtime";
import type { BodyRecord } from "@/knowledge-graph/data/solar-system-catalog/types";
import { BODY_BY_ID } from "@/knowledge-graph/data/solar-system-catalog";
import { ScientificIcon } from "@/components/experience/ScientificIcons";

function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

function PlanetDiagram({ entity, body }: { entity: RuntimeEntity; body?: BodyRecord }) {
  const radiusLabel = body?.radiusKm
    ? `${formatNumber(body.radiusKm, 0)} km radius`
    : body?.diameterKm
      ? `${formatNumber(body.diameterKm, 0)} km diameter`
      : "Radius not recorded";

  return (
    <>
      <svg viewBox="0 0 680 360" className="h-80 w-full" role="img" aria-label={`${entity.name} structure diagram`}>
        <rect width="680" height="360" rx="24" fill="#02050b" />
        <g transform="translate(238 180)">
          <circle r="118" fill="#0b3d91" fillOpacity="0.28" stroke="#8fb0d4" />
          <circle r="78" fill="#8fb0d4" fillOpacity="0.16" stroke="#8fb0d4" strokeOpacity="0.42" />
          <circle r="38" fill="#e7c98a" fillOpacity="0.26" stroke="#e7c98a" />
          {body?.hasRingSystem && (
            <ellipse rx="166" ry="44" fill="none" stroke="#e7c98a" strokeOpacity="0.72" strokeWidth="2" />
          )}
          {body?.hasMagneticField && (
            <>
              <ellipse rx="150" ry="98" fill="none" stroke="#c8d2e6" strokeOpacity="0.4" strokeDasharray="4 9" />
              <ellipse rx="98" ry="150" fill="none" stroke="#c8d2e6" strokeOpacity="0.22" strokeDasharray="4 9" />
            </>
          )}
        </g>
        <g fill="#f5f7fb" fontSize="14">
          <text x="404" y="118" fontWeight="700">Structure cues</text>
          <text x="404" y="152" fill="#c2cad8">Outer envelope / surface</text>
          <text x="404" y="186" fill="#c2cad8">Interior layer</text>
          <text x="404" y="220" fill="#c2cad8">Core region</text>
          <text x="404" y="268" fill="#e7c98a">{radiusLabel}</text>
        </g>
      </svg>
      <Facts
        facts={[
          ["Atmosphere", body?.atmosphere ?? "Not recorded"],
          ["Mean temperature", body?.meanTemperatureC === undefined ? "Not recorded" : `${formatNumber(body.meanTemperatureC, 0)} °C`],
          ["Gravity", body?.gravityMs2 === undefined ? "Not recorded" : `${formatNumber(body.gravityMs2, 2)} m/s²`],
          ["Magnetic field", body?.hasMagneticField === undefined ? "Not recorded" : body.hasMagneticField ? "Recorded" : "Not recorded"],
        ]}
      />
    </>
  );
}

function StarDiagram({ entity }: { entity: RuntimeEntity }) {
  return (
    <>
      <svg viewBox="0 0 680 360" className="h-80 w-full" role="img" aria-label={`${entity.name} stellar structure diagram`}>
        <rect width="680" height="360" rx="24" fill="#02050b" />
        <circle cx="260" cy="180" r="118" fill="#e7c98a" fillOpacity="0.16" stroke="#e7c98a" />
        <circle cx="260" cy="180" r="78" fill="#e7c98a" fillOpacity="0.22" stroke="#f5f7fb" strokeOpacity="0.38" />
        <circle cx="260" cy="180" r="34" fill="#f5f7fb" fillOpacity="0.88" />
        <path d="M260 44v272M124 180h272M164 84l192 192M356 84 164 276" stroke="#f5f7fb" strokeOpacity="0.34" />
        <g fill="#f5f7fb" fontSize="14">
          <text x="430" y="116" fontWeight="700">Stellar reading</text>
          <text x="430" y="152" fill="#c2cad8">Core and radiative regions</text>
          <text x="430" y="186" fill="#c2cad8">Photosphere / visible surface</text>
          <text x="430" y="220" fill="#c2cad8">Spectral observations required</text>
          <text x="430" y="268" fill="#e7c98a">{entity.name}</text>
        </g>
      </svg>
      <Facts
        facts={[
          ["Classification", entity.scientificName ?? entity.typeLabel],
          ["Catalog numbers", entity.catalogNumbers.length ? entity.catalogNumbers.join(", ") : "Not recorded"],
          ["Graph relations", `${entity.relationCount}`],
          ["Evidence sources", `${entity.sources.length}`],
        ]}
      />
    </>
  );
}

function GalaxyDiagram({ entity }: { entity: RuntimeEntity }) {
  return (
    <>
      <svg viewBox="0 0 680 360" className="h-80 w-full" role="img" aria-label={`${entity.name} morphology diagram`}>
        <rect width="680" height="360" rx="24" fill="#02050b" />
        <g transform="translate(292 180)">
          <ellipse rx="172" ry="54" fill="#5d95df" fillOpacity="0.12" stroke="#8fb0d4" />
          <path d="M-18 0C-100-48-152-50-194-24M18 0c82 48 152 50 194 24M-18 0c-82 48-152 50-194 24M18 0c82-48 152-50 194-24" fill="none" stroke="#e7c98a" strokeOpacity="0.72" />
          <circle r="28" fill="#f5f7fb" fillOpacity="0.75" />
          <circle r="82" fill="none" stroke="#c8d2e6" strokeOpacity="0.26" strokeDasharray="3 9" />
        </g>
        <g fill="#f5f7fb" fontSize="14">
          <text x="484" y="118" fontWeight="700">Galaxy-scale view</text>
          <text x="484" y="152" fill="#c2cad8">Bulge / nucleus</text>
          <text x="484" y="186" fill="#c2cad8">Disk or stellar halo</text>
          <text x="484" y="220" fill="#c2cad8">Morphology comes from observation</text>
          <text x="484" y="268" fill="#e7c98a">{entity.typeLabel}</text>
        </g>
      </svg>
      <Facts
        facts={[
          ["Object class", entity.typeLabel],
          ["Catalog numbers", entity.catalogNumbers.length ? entity.catalogNumbers.join(", ") : "Not recorded"],
          ["Image records", `${entity.images.length}`],
          ["Graph relations", `${entity.relationCount}`],
        ]}
      />
    </>
  );
}

function CompactDiagram({ entity }: { entity: RuntimeEntity }) {
  return (
    <>
      <svg viewBox="0 0 680 360" className="h-80 w-full" role="img" aria-label={`${entity.name} compact-object diagram`}>
        <rect width="680" height="360" rx="24" fill="#02050b" />
        <ellipse cx="292" cy="188" rx="190" ry="50" fill="#e7c98a" fillOpacity="0.15" stroke="#e7c98a" />
        <ellipse cx="292" cy="188" rx="124" ry="30" fill="none" stroke="#f5f7fb" strokeOpacity="0.32" />
        <circle cx="292" cy="188" r="58" fill="#000000" stroke="#c8d2e6" strokeOpacity="0.64" />
        <circle cx="292" cy="188" r="78" fill="none" stroke="#8fb0d4" strokeOpacity="0.35" strokeDasharray="4 10" />
        <path d="M292 84v208M188 188h208" stroke="#c8d2e6" strokeOpacity="0.16" />
        <g fill="#f5f7fb" fontSize="14">
          <text x="492" y="118" fontWeight="700">Compact-object context</text>
          <text x="492" y="152" fill="#c2cad8">Event horizon boundary</text>
          <text x="492" y="186" fill="#c2cad8">Accretion structure</text>
          <text x="492" y="220" fill="#c2cad8">Relativistic environment</text>
          <text x="492" y="268" fill="#e7c98a">{entity.typeLabel}</text>
        </g>
      </svg>
      <Facts
        facts={[
          ["Object class", entity.typeLabel],
          ["Graph relations", `${entity.relationCount}`],
          ["Evidence sources", `${entity.sources.length}`],
          ["Image records", `${entity.images.length}`],
        ]}
      />
    </>
  );
}

function SmallBodyDiagram({ entity, body }: { entity: RuntimeEntity; body?: BodyRecord }) {
  return (
    <>
      <svg viewBox="0 0 680 360" className="h-80 w-full" role="img" aria-label={`${entity.name} small-body diagram`}>
        <rect width="680" height="360" rx="24" fill="#02050b" />
        <path d="M238 168c24-56 112-76 160-28 48 46 14 130-58 142-78 14-138-42-102-114Z" fill="#8fb0d4" fillOpacity="0.22" stroke="#8fb0d4" />
        {entity.type === "comet" && (
          <>
            <path d="M238 178C148 156 102 126 54 82" stroke="#e7c98a" strokeOpacity="0.56" strokeWidth="18" />
            <path d="M240 198C158 218 92 242 42 292" stroke="#8fb0d4" strokeOpacity="0.38" strokeWidth="10" />
          </>
        )}
        <circle cx="318" cy="196" r="4" fill="#f5f7fb" />
        <circle cx="372" cy="160" r="5" fill="#f5f7fb" opacity="0.72" />
        <g fill="#f5f7fb" fontSize="14">
          <text x="456" y="118" fontWeight="700">Small-body reading</text>
          <text x="456" y="152" fill="#c2cad8">Irregular nucleus/body</text>
          <text x="456" y="186" fill="#c2cad8">{entity.type === "comet" ? "Coma and tail context" : "Surface / regolith context"}</text>
          <text x="456" y="220" fill="#c2cad8">Orbit class from catalog data</text>
          <text x="456" y="268" fill="#e7c98a">{body?.designation ?? entity.typeLabel}</text>
        </g>
      </svg>
      <Facts
        facts={[
          ["Designation", body?.designation ?? "Not recorded"],
          ["Discovery", [body?.discoveredBy, body?.discoveryYear].filter(Boolean).join(", ") || "Not recorded"],
          ["Eccentricity", body?.eccentricity === undefined ? "Not recorded" : formatNumber(body.eccentricity, 4)],
          ["Inclination", body?.inclinationDeg === undefined ? "Not recorded" : `${formatNumber(body.inclinationDeg, 2)}°`],
        ]}
      />
    </>
  );
}

function MissionDiagram({ entity, body }: { entity: RuntimeEntity; body?: BodyRecord }) {
  return (
    <>
      <svg viewBox="0 0 680 360" className="h-80 w-full" role="img" aria-label={`${entity.name} mission diagram`}>
        <rect width="680" height="360" rx="24" fill="#02050b" />
        <path d="M110 246C202 150 308 272 424 132S560 102 594 82" fill="none" stroke="#8fb0d4" strokeWidth="2.2" />
        <circle cx="110" cy="246" r="25" fill="#0b3d91" stroke="#8fb0d4" />
        <circle cx="424" cy="132" r="18" fill="#e7c98a" fillOpacity="0.26" stroke="#e7c98a" />
        <path d="M556 74h40l-14 38-14-16-22 24-12-12 22-24-16-10Z" fill="#f5f7fb" fillOpacity="0.86" />
        <g fill="#f5f7fb" fontSize="14">
          <text x="110" y="296" textAnchor="middle">Launch</text>
          <text x="424" y="176" textAnchor="middle">Encounter</text>
          <text x="568" y="146" textAnchor="middle">Spacecraft</text>
          <text x="84" y="70" fontWeight="700">{entity.typeLabel} system</text>
          <text x="84" y="102" fill="#c2cad8">Architecture follows recorded graph links.</text>
        </g>
      </svg>
      <Facts
        facts={[
          ["Agency", body?.agency ?? "Not recorded"],
          ["Launch year", body?.launchYear ?? "Not recorded"],
          ["Mission type", body?.missionType ?? body?.classification ?? "Not recorded"],
          ["Status", body?.status ?? "Not recorded"],
        ]}
      />
    </>
  );
}

function TelescopeDiagram({ entity }: { entity: RuntimeEntity }) {
  return (
    <>
      <svg viewBox="0 0 680 360" className="h-80 w-full" role="img" aria-label={`${entity.name} optics diagram`}>
        <rect width="680" height="360" rx="24" fill="#02050b" />
        <path d="M126 102h124l-30 156H156L126 102Z" fill="#0b3d91" fillOpacity="0.26" stroke="#8fb0d4" />
        <path d="M250 122 548 80M244 180h320M250 238l298 42" stroke="#e7c98a" strokeOpacity="0.72" />
        <circle cx="566" cy="180" r="30" fill="#f5f7fb" fillOpacity="0.12" stroke="#f5f7fb" strokeOpacity="0.5" />
        <path d="M156 258h64l26 58H130l26-58Z" fill="#8fb0d4" fillOpacity="0.12" stroke="#8fb0d4" />
        <g fill="#f5f7fb" fontSize="14">
          <text x="96" y="72" fontWeight="700">Optical path</text>
          <text x="382" y="126" fill="#c2cad8">Collected light</text>
          <text x="382" y="208" fill="#c2cad8">Focal plane / instrument</text>
          <text x="382" y="284" fill="#e7c98a">{entity.typeLabel}</text>
        </g>
      </svg>
      <Facts
        facts={[
          ["Object class", entity.typeLabel],
          ["Catalog numbers", entity.catalogNumbers.length ? entity.catalogNumbers.join(", ") : "Not recorded"],
          ["Graph relations", `${entity.relationCount}`],
          ["Sources", `${entity.sources.length}`],
        ]}
      />
    </>
  );
}

function Facts({ facts }: { facts: [string, string][] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {facts.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs uppercase tracking-wider text-faint">{label}</dt>
          <dd className="mt-1 font-medium text-fg">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ScientificDiagram({ entity }: { entity: RuntimeEntity }) {
  const body = BODY_BY_ID.get(entity.id);
  const title =
    entity.type === "planet" || entity.type === "dwarf_planet" || entity.type === "moon"
      ? "Interior and field cues"
      : entity.type === "star"
        ? "Stellar structure"
        : entity.type === "galaxy" || entity.type === "nebula" || entity.type === "constellation" || entity.type === "star_cluster"
          ? "Deep-sky morphology"
          : entity.type === "black_hole"
            ? "Compact-object anatomy"
            : entity.type === "asteroid" || entity.type === "comet"
              ? "Small-body anatomy"
              : entity.type === "space_mission" || entity.type === "spacecraft" || entity.type === "launch_vehicle" || entity.type === "satellite"
                ? "Mission architecture"
                : entity.type === "telescope" || entity.type === "space_telescope" || entity.type === "observatory"
                  ? "Observation system"
                  : "Scientific schematic";

  return (
    <section className="rounded-[2rem] border border-white/10 bg-bg-elevated/64 p-5 shadow-2xl shadow-black/20 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full border border-nasa/25 bg-nasa/[0.07] text-nasa">
          <ScientificIcon name="aperture" className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-nasa">
            Original SVG diagram
          </p>
          <h3 className="mt-1 text-xl font-semibold">{title}</h3>
        </div>
      </div>
      <div className="space-y-5">
        {(entity.type === "planet" || entity.type === "dwarf_planet" || entity.type === "moon") && (
          <PlanetDiagram entity={entity} body={body} />
        )}
        {entity.type === "star" && <StarDiagram entity={entity} />}
        {(entity.type === "galaxy" || entity.type === "nebula" || entity.type === "constellation" || entity.type === "star_cluster") && (
          <GalaxyDiagram entity={entity} />
        )}
        {entity.type === "black_hole" && <CompactDiagram entity={entity} />}
        {(entity.type === "asteroid" || entity.type === "comet") && (
          <SmallBodyDiagram entity={entity} body={body} />
        )}
        {(entity.type === "space_mission" || entity.type === "spacecraft" || entity.type === "launch_vehicle" || entity.type === "satellite") && (
          <MissionDiagram entity={entity} body={body} />
        )}
        {(entity.type === "telescope" || entity.type === "space_telescope" || entity.type === "observatory") && (
          <TelescopeDiagram entity={entity} />
        )}
        {![
          "planet",
          "dwarf_planet",
          "moon",
          "star",
          "galaxy",
          "nebula",
          "constellation",
          "star_cluster",
          "black_hole",
          "asteroid",
          "comet",
          "space_mission",
          "spacecraft",
          "launch_vehicle",
          "satellite",
          "telescope",
          "space_telescope",
          "observatory",
        ].includes(entity.type) && <TelescopeDiagram entity={entity} />}
      </div>
    </section>
  );
}
