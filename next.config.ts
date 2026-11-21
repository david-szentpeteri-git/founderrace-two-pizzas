import type { NextConfig } from "next";

// Classic rendering (no cacheComponents / partialPrefetching): pages that read
// params or the database render per request without extra Suspense rules.
// See node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
