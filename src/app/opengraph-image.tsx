import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

/**
 * Default Open Graph / social card image, generated at build time. Applies to
 * every route that doesn't define its own. Self-contained (no remote fonts) so
 * builds stay deterministic.
 */
export const alt = `${SITE.name} — Astronomy, Night Sky & Astrology`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#05060f",
          backgroundImage:
            "radial-gradient(900px 600px at 85% -10%, rgba(167,139,250,0.45), transparent), radial-gradient(700px 500px at 0% 110%, rgba(52,211,211,0.30), transparent)",
          color: "#e9ebf8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <svg width="44" height="44" viewBox="0 0 64 64">
            <path
              d="M32 6 C34.6 22 42 29.4 58 32 C42 34.6 34.6 42 32 58 C29.4 42 22 34.6 6 32 C22 29.4 29.4 22 32 6 Z"
              fill="#a78bfa"
            />
          </svg>
          <div style={{ fontSize: "34px", fontWeight: 600, letterSpacing: "-0.5px" }}>
            {SITE.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              maxWidth: "900px",
            }}
          >
            Astronomy, the night sky &amp; the stories we tell.
          </div>
          <div style={{ marginTop: "28px", fontSize: "30px", color: "#a6abce", maxWidth: "920px" }}>
            A serious knowledge platform — science and astrology, kept clearly apart.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: "26px", color: "#767ca3" }}>
          {SITE.domain}
        </div>
      </div>
    ),
    { ...size },
  );
}
