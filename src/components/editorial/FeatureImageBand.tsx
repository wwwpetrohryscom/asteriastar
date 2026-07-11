import Image from "next/image";

/**
 * A full-bleed cinematic image band used to break up long text with a beat of
 * large photography (National Geographic rhythm). Render it OUTSIDE a Container
 * so it spans the full viewport width.
 */
export function FeatureImageBand({
  url,
  alt,
  blurDataURL,
  caption,
  credit,
  aspect = "wide",
  className = "",
}: {
  url: string;
  alt: string;
  blurDataURL?: string;
  caption?: string;
  credit?: string;
  aspect?: "wide" | "cinema";
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className={`relative w-full overflow-hidden ${aspect === "cinema" ? "aspect-[2.4/1]" : "aspect-[16/9] sm:aspect-[2.6/1]"}`}>
        <Image
          src={url}
          alt={alt}
          fill
          sizes="100vw"
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          loading="lazy"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-black/18" />
      </div>
      {(caption || credit) && (
        <figcaption className="mx-auto max-w-3xl px-5 pt-3 text-sm text-faint sm:px-8">
          {caption}
          {caption && credit ? " " : ""}
          {credit && <span className="text-faint/70">· {credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
