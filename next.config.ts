import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A lockfile exists in a parent
  // directory (an unrelated project), which would otherwise make Next infer
  // the wrong root.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
