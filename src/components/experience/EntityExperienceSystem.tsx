import Link from "next/link";
import type { EntityType } from "@/knowledge-graph";
import { entityGraphPath, relationLabel } from "@/knowledge-graph";
import type { RuntimeEntity } from "@/platform/runtime";
import type { ImageAsset } from "@/lib/media/types";
import { IMAGE_LICENSE_LABELS } from "@/lib/media/types";
import { BODY_BY_ID } from "@/knowledge-graph/data/solar-system-catalog";
import { ScientificIcon } from "@/components/experience/ScientificIcons";
import { ScientificDiagram } from "@/components/experience/ScientificDiagram";
import { ScientificMap } from "@/components/experience/ScientificMap";
import { VisualKnowledgeGraph } from "@/components/experience/VisualKnowledgeGraph";

interface ExperienceProfile {
  title: string;
  summary: string;
  modules: string[];
}

const PROFILES: Partial<Record<EntityType, ExperienceProfile>> = {
  planet: {
    title: "Planetary world system",
    summary: "Built around orbit, rotation, atmosphere, surface conditions, rings, magnetic field, and parent-system context.",
    modules: ["Orbit viewer", "Interior diagram", "Atmosphere facts", "Magnetic-field cue"],
  },
  dwarf_planet: {
    title: "Dwarf-planet field guide",
    summary: "A compact planetary profile focused on orbit, classification, surface context, and graph-linked Solar System neighborhoods.",
    modules: ["Orbit viewer", "Scale metrics", "Classification", "Discovery context"],
  },
  moon: {
    title: "Satellite world profile",
    summary: "A moon-first layout that links the body to its parent planet, orbital context, geology, and mission evidence when available.",
    modules: ["Moon orbit", "Surface facts", "Parent-body relation", "Mission links"],
  },
  star: {
    title: "Stellar observatory profile",
    summary: "A star reading built around classification, catalog identity, observational context, and connected systems.",
    modules: ["Stellar structure", "Catalog identity", "Sky atlas", "Spectral cue"],
  },
  galaxy: {
    title: "Galaxy morphology profile",
    summary: "A deep-sky composition that treats the object as a physical structure, not a decorative background image.",
    modules: ["Morphology SVG", "Atlas context", "Image provenance", "Graph neighborhood"],
  },
  nebula: {
    title: "Nebular structure profile",
    summary: "A visual story for gas, dust, ionization, star-forming context, and observational imagery.",
    modules: ["Deep-sky map", "Structure diagram", "Image provenance", "Related objects"],
  },
  constellation: {
    title: "Constellation atlas profile",
    summary: "A sky-map experience that separates official constellation astronomy from cultural and symbolic associations.",
    modules: ["Star-map motif", "Domain-separated graph", "Atlas context", "Source trail"],
  },
  black_hole: {
    title: "Compact-object profile",
    summary: "A restrained scientific layout for extreme gravity, accretion structures, host systems, and observational evidence.",
    modules: ["Compact-object SVG", "Host context", "Atlas map", "Evidence graph"],
  },
  asteroid: {
    title: "Small-body profile",
    summary: "A catalog-first story for orbit class, discovery, physical parameters, and planetary-defense context when recorded.",
    modules: ["Orbit viewer", "Small-body anatomy", "Discovery facts", "Catalog links"],
  },
  comet: {
    title: "Comet profile",
    summary: "A trajectory-led view for nucleus, coma, tail, orbit class, and mission or observatory links.",
    modules: ["Orbit viewer", "Comet anatomy", "Discovery facts", "Graph links"],
  },
  space_mission: {
    title: "Mission dossier",
    summary: "A mission-story layout that emphasizes target bodies, spacecraft, timeline, agency, and evidence-backed status.",
    modules: ["Trajectory map", "Mission architecture", "Target graph", "Source trail"],
  },
  spacecraft: {
    title: "Spacecraft system profile",
    summary: "A hardware-aware view for mission membership, target worlds, landed bodies, and operational status.",
    modules: ["Trajectory map", "Architecture SVG", "Mission links", "Status facts"],
  },
  launch_vehicle: {
    title: "Rocket engineering profile",
    summary: "A vehicle-first layout for staging, launch context, organizations, and mission graph relations.",
    modules: ["Architecture SVG", "Trajectory context", "Organization graph", "Source trail"],
  },
  telescope: {
    title: "Telescope system profile",
    summary: "An observation-system composition focused on aperture, optical path, instruments, observing sites, and image provenance.",
    modules: ["Optics SVG", "Ground context", "Image provenance", "Instrument links"],
  },
  space_telescope: {
    title: "Space telescope dossier",
    summary: "An observatory-in-space experience for mission context, instruments, wavelength coverage, imagery, and science links.",
    modules: ["Optics SVG", "Mission context", "Instrument links", "Image provenance"],
  },
  astronaut: {
    title: "Human spaceflight profile",
    summary: "A biography-grade profile centered on missions, crews, stations, EVAs, and source-backed history.",
    modules: ["Timeline spine", "Mission graph", "Source trail", "Context map"],
  },
  exoplanet: {
    title: "Exoplanet profile",
    summary: "A planet-discovery layout that prioritizes host star, detection method, transit context, and habitability claims only when sourced.",
    modules: ["Transit schematic", "Host-star graph", "Atlas context", "Measured facts"],
  },
};

function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

function getProfile(entity: RuntimeEntity): ExperienceProfile {
  return PROFILES[entity.type] ?? {
    title: `${entity.typeLabel} scientific profile`,
    summary: "A graph-grounded scientific layout that adapts to available evidence, imagery, relations, and source coverage.",
    modules: ["Evidence graph", "Scientific map", "Original SVG", "Source trail"],
  };
}

function bodyMetrics(entity: RuntimeEntity) {
  const body = BODY_BY_ID.get(entity.id);
  if (!body) return [];

  const physical = [
    body.mass1e24Kg !== undefined ? ["Mass", `${formatNumber(body.mass1e24Kg, 3)} × 10²⁴ kg`] : null,
    body.radiusKm !== undefined ? ["Radius", `${formatNumber(body.radiusKm, 0)} km`] : null,
    body.diameterKm !== undefined ? ["Diameter", `${formatNumber(body.diameterKm, 0)} km`] : null,
    body.gravityMs2 !== undefined ? ["Gravity", `${formatNumber(body.gravityMs2, 2)} m/s²`] : null,
    body.orbitalPeriodDays !== undefined ? ["Orbital period", `${formatNumber(body.orbitalPeriodDays, 2)} days`] : null,
    body.rotationPeriodHours !== undefined ? ["Rotation", `${formatNumber(body.rotationPeriodHours, 2)} hours`] : null,
    body.meanTemperatureC !== undefined ? ["Mean temperature", `${formatNumber(body.meanTemperatureC, 0)} °C`] : null,
    body.semiMajorAxisAu !== undefined ? ["Semi-major axis", `${formatNumber(body.semiMajorAxisAu, 3)} AU`] : null,
    body.distanceFromSun1e6Km !== undefined ? ["Mean solar distance", `${formatNumber(body.distanceFromSun1e6Km, 1)} million km`] : null,
    body.launchYear ? ["Launch year", body.launchYear] : null,
    body.agency ? ["Agency", body.agency] : null,
    body.status ? ["Status", body.status] : null,
  ].filter((item): item is [string, string] => item !== null);

  return physical.slice(0, 8);
}

function graphMetrics(entity: RuntimeEntity) {
  return [
    ["Object type", entity.typeLabel],
    ["Graph relations", `${entity.relationCount}`],
    ["Verified sources", `${entity.sources.length}`],
    ["Image records", `${entity.images.length}`],
    ["Domain", entity.domainLabel],
    ["Status", entity.status === "documented" ? "Documented page" : "Graph entity"],
  ];
}

function MetricGrid({ entity }: { entity: RuntimeEntity }) {
  const metrics = bodyMetrics(entity);
  const items = metrics.length >= 4 ? metrics : graphMetrics(entity);

  return (
    <dl className="grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="bg-bg-elevated/88 p-5">
          <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">{label}</dt>
          <dd className="mt-2 font-display text-xl font-semibold text-fg">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function StoryRail({
  entity,
  profile,
  image,
}: {
  entity: RuntimeEntity;
  profile: ExperienceProfile;
  image?: ImageAsset;
}) {
  const firstScience = entity.connections.find((connection) => connection.relation.domain === "science");
  const steps = [
    {
      icon: "aperture" as const,
      title: "Observe",
      body: image
        ? `${image.provider.toUpperCase()} imagery anchors the visual reading with licensed source metadata.`
        : "The page falls back to graph and source evidence when no cleared image is available.",
    },
    {
      icon: "measure" as const,
      title: "Measure",
      body: bodyMetrics(entity).length
        ? "Numerical fields come from the typed Solar System catalog and are omitted when not available."
        : "Measurement panels use graph coverage, catalog identifiers, and source availability without inventing values.",
    },
    {
      icon: "atlas" as const,
      title: "Locate",
      body: firstScience
        ? `${relationLabel(firstScience.relation.type, firstScience.outgoing)} ${firstScience.other.name}.`
        : "Map views display coordinate or trajectory context only where the local data model supports it.",
    },
    {
      icon: "graph" as const,
      title: "Connect",
      body: `${entity.relationCount} graph relation${entity.relationCount === 1 ? "" : "s"} shape the knowledge viewport.`,
    },
  ];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#02050b]/70 p-5 shadow-2xl shadow-black/25 sm:p-7">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
            Experience system V6
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
            {profile.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            {profile.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {profile.modules.map((module) => (
              <span
                key={module}
                className="rounded-full border border-halo/18 bg-halo/[0.05] px-3 py-1 text-xs font-medium text-silver"
              >
                {module}
              </span>
            ))}
          </div>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full border border-halo/20 bg-halo/[0.07] text-halo">
                  <ScientificIcon name={step.icon} className="size-5" />
                </span>
                <div>
                  <span className="text-xs uppercase tracking-[0.22em] text-faint">0{index + 1}</span>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ImageProvenanceStrip({ images }: { images: ImageAsset[] }) {
  const published = images.filter((image) => image.url).slice(0, 4);
  if (published.length === 0) return null;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-bg-elevated/64 p-5 shadow-2xl shadow-black/20 sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            Image provenance
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Photography as evidence</h2>
        </div>
        <span className="text-sm text-faint">{published.length} cleared visual record{published.length === 1 ? "" : "s"}</span>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        {published.map((image) => (
          <a
            key={image.id}
            href={image.sourceUrl}
            target="_blank"
            rel="noreferrer nofollow"
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] transition hover:-translate-y-1 hover:border-halo/30"
          >
            <div className="aspect-[4/3] overflow-hidden bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt}
                width={image.width ?? 640}
                height={image.height ?? 480}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
              />
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 font-display text-sm font-semibold text-fg">{image.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-faint">
                {image.credit} · {IMAGE_LICENSE_LABELS[image.license]}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function RelatedEditorial({ entity }: { entity: RuntimeEntity }) {
  const related = [...entity.related, ...entity.recommendations.map((item) => item.entity)]
    .filter((item, index, arr) => arr.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(0, 6);
  if (related.length === 0) return null;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#02050b]/58 p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.07] text-gold">
          <ScientificIcon name="source" className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            Continue the atlas
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Curated next objects</h2>
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => (
          <Link
            key={item.id}
            href={entityGraphPath(item)}
            className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-halo/30 hover:bg-white/[0.055]"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-faint">{item.type.replace(/_/g, " ")}</span>
            <h3 className="mt-2 font-display text-lg font-semibold text-fg">{item.name}</h3>
            {item.description && (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{item.description}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function EntityExperienceSystem({
  entity,
  images,
}: {
  entity: RuntimeEntity;
  images: ImageAsset[];
}) {
  const profile = getProfile(entity);
  const heroImage = images.find((image) => image.url);

  return (
    <div className="space-y-8">
      <StoryRail entity={entity} profile={profile} image={heroImage} />
      <MetricGrid entity={entity} />
      <div className="grid gap-8 xl:grid-cols-2">
        <ScientificMap entity={entity} />
        <ScientificDiagram entity={entity} />
      </div>
      <VisualKnowledgeGraph entity={entity} />
      <ImageProvenanceStrip images={images} />
      <RelatedEditorial entity={entity} />
    </div>
  );
}
