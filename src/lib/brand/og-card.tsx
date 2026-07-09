import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SITE } from "@/lib/site";

/**
 * Shared builder for the Open Graph / Twitter social card (1200×630), used by
 * the root opengraph-image and twitter-image routes. Renders the official
 * AsteriaStar emblem (read from the generated PNG) beside the wordmark, the
 * tagline, and the domain, on the deep-space brand gradient. Self-contained —
 * no remote fonts or images — so builds stay deterministic.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_ALT = `${SITE.name} — ${SITE.tagline}`;
export const OG_CONTENT_TYPE = "image/png";

export function socialCard(): ImageResponse {
  const mark = readFileSync(join(process.cwd(), "public/brand/mark-512.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;
  const bg = readFileSync(join(process.cwd(), "public/brand/cosmos-og.jpg"));
  const bgSrc = `data:image/jpeg;base64,${bg.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#040711",
          color: "#e9ebf8",
          fontFamily: "sans-serif",
        }}
      >
        {/* The real-space cosmos photograph behind the card. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgSrc}
          width={1200}
          height={630}
          alt=""
          style={{ position: "absolute", top: 0, left: 0, width: "1200px", height: "630px", objectFit: "cover" }}
        />
        {/* Dark scrim for text contrast. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            display: "flex",
            backgroundImage:
              "linear-gradient(120deg, rgba(4,7,17,0.86) 0%, rgba(4,7,17,0.62) 55%, rgba(4,7,17,0.4) 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "24px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={104} height={104} alt="" />
          <div style={{ display: "flex", fontSize: "40px", fontWeight: 700, letterSpacing: "1px" }}>
            <span style={{ color: "#e9ebf8" }}>ASTERIA</span>
            <span style={{ color: "#e9c163" }}>STAR</span>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "78px", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-2px", maxWidth: "900px" }}>
            {SITE.tagline}
          </div>
          <div style={{ marginTop: "26px", fontSize: "30px", color: "#ccd6ef", maxWidth: "920px" }}>
            Astronomy, space, the night sky, mythology — and astrology as a separate cultural tradition.
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", fontSize: "26px", color: "#9aa6c8" }}>{SITE.domain}</div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
