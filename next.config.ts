import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A lockfile exists in a parent
  // directory (an unrelated project), which would otherwise make Next infer
  // the wrong root.
  turbopack: {
    root: import.meta.dirname,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            /*
             * HSTS, declared by the application rather than by the host.
             *
             * Vercel added `max-age=63072000` to every response automatically.
             * Netlify sends its own `max-age=31536000` and a netlify.toml header
             * rule does not reach responses produced by the server function, so
             * the two-year policy the site has been publishing for its whole
             * life would silently halve on the platform move.
             *
             * Setting it here restores it and makes it portable: this is
             * framework configuration, so it applies identically on any host and
             * survives the next migration too. Both values are strong and
             * preload-eligible; the point is that the site's own security policy
             * should be the site's decision, not a side effect of where it is
             * deployed.
             */
            key: "Strict-Transport-Security",
            value: "max-age=63072000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
